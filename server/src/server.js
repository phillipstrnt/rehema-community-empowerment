import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import adminAuthRoutes from "./adminAuth.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";

import uploadRoutes from "./upload.js";
import { connectDB } from "./db.js";
import routes from "./routes.js";


const app = express();

const PORT =
  process.env.PORT || 5000;


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
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);


/* =========================================================
   REQUEST BODY
========================================================= */

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

const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      message:
        "Too many requests. Please try again later.",
    },
  });


app.use(
  "/api",
  apiLimiter
);


/* =========================================================
   UPLOAD ROUTES
========================================================= */

app.use(
  "/api/upload",
  uploadRoutes
);


/* =========================================================
   ADMIN USER MANAGEMENT
========================================================= */

app.use(
  "/api/admin/users",
  adminUserRoutes
);


/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

app.use(
  "/api/admin",
  adminAuthRoutes
);


/* =========================================================
   GENERAL API ROUTES
========================================================= */

app.use(
  "/api",
  routes
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/",
  (_req, res) => {
    res.json({
      success: true,
      message:
        "REHEMA API is running",
    });
  }
);


/* =========================================================
   404 HANDLER
========================================================= */

app.use(
  (_req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found",
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

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Server error. Please try again later.",
    });
  }
);


/* =========================================================
   DATABASE + SERVER
========================================================= */

connectDB()

  .then(() => {

    app.listen(
      PORT,
      () => {

        console.log(
          `REHEMA API running on port ${PORT}`
        );

        console.log(
          `API: http://localhost:${PORT}/api`
        );

      }
    );

  })

  .catch(
    (error) => {

      console.error(
        "Database connection failed:",
        error.message
      );

      process.exit(1);

    }
  );