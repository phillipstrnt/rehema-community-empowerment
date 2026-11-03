

import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";

import adminAuthRoutes from "./adminAuth.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";

import uploadRoutes from "./upload.js";
import facebookRoutes from "./facebook.js";

import { connectDB } from "./db.js";
import { AdminUser } from "./adminUserModel.js";
import paymentRoutes from "./paymentRoutes.js";
import { localUploadDirectory } from "./localUploads.js";
import { ensureSamplePosts } from "./samplePosts.js";
import routes from "./routes.js";


/* =========================================================
   CREATE EXPRESS APPLICATION
========================================================= */

const app = express();


/* =========================================================
   PORT
========================================================= */

const PORT = process.env.PORT || 5000;


/* =========================================================
   SECURITY
========================================================= */

app.use(
  helmet()
);


/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        ...(process.env.CLIENT_URL || "http://localhost:5173")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        "https://rehema-website-preview-2026-1028-pe5b.onrender.com",
      ];

      callback(null, !origin || allowedOrigins.includes(origin));
    },

    credentials: true,
  })
);


/* =========================================================
   REQUEST BODY
========================================================= */

app.use("/uploads", express.static(localUploadDirectory, { fallthrough: false, maxAge: "1d" }));

app.use(
  express.json({
    limit: "1mb",
  })
);


/* =========================================================
   REQUEST LOGGING
========================================================= */

app.use(
  morgan("dev")
);


/* =========================================================
   RATE LIMITING
========================================================= */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 200,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});


app.use(
  "/api",
  apiLimiter
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "REHEMA API is running",
    });
  }
);


/* =========================================================
   UPLOAD ROUTES

   POST /api/upload/...
========================================================= */

app.use("/api/payments", paymentRoutes);

app.use(
  "/api/upload",
  uploadRoutes
);


/* =========================================================
   ADMIN AUTHENTICATION

   POST /api/admin/login
   GET  /api/admin/me
   POST /api/admin/logout

   IMPORTANT:
   adminAuth.js now contains ONLY authentication routes.
========================================================= */

app.use(
  "/api/admin",
  adminAuthRoutes
);


/* =========================================================
   ADMIN USER MANAGEMENT

   GET    /api/admin/users
   POST   /api/admin/users
   PUT    /api/admin/users/:id
   DELETE /api/admin/users/:id

   IMPORTANT:
   adminUserRoutes.js contains administrator CRUD.
========================================================= */

app.use(
  "/api/admin/users",
  adminUserRoutes
);


/* =========================================================
   FACEBOOK PUBLISHING

   /api/admin/facebook/...
========================================================= */

app.use(
  "/api/admin/facebook",
  facebookRoutes
);


/* =========================================================
   GENERAL API ROUTES

   /api/...
========================================================= */

app.use(
  "/api",
  routes
);


/* =========================================================
   404 HANDLER
========================================================= */

app.use(
  (_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (
    error,
    _req,
    res,
    _next
  ) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    const statusCode =
      error.status ||
      error.statusCode ||
      500;

    res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Server error. Please try again later.",
    });
  }
);


/* =========================================================
   DATABASE + SERVER START
========================================================= */

const startServer = async () => {
  try {
    await connectDB();
    await ensureSamplePosts();

    const initialAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const initialAdminPassword = process.env.ADMIN_PASSWORD;
    if (initialAdminEmail && initialAdminPassword) {
      const existingAdmin = await AdminUser.exists({});
      if (!existingAdmin) {
        if (initialAdminPassword.length < 8) {
          throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
        }

        const passwordHash = await bcrypt.hash(initialAdminPassword, 12);
        await AdminUser.create({
          name: process.env.ADMIN_NAME?.trim() || "REHEMA Administrator",
          email: initialAdminEmail,
          password: passwordHash,
          role: "super_admin",
          active: true,
        });
        console.log("Initial REHEMA administrator created.");
      }
    }

    console.log(
      "MongoDB connected successfully."
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `REHEMA API running on port ${PORT}`
        );

        console.log(
          `API: http://localhost:${PORT}/api`
        );

        console.log(
          `Health: http://localhost:${PORT}/`
        );
      }
    );
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
};


/* =========================================================
   START APPLICATION
========================================================= */

startServer();

