import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdminUser } from "./adminUserModel.js";
import { requireAdmin } from "./authMiddleware.js";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN

   POST /api/admin/login
========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /* -------------------------------------------------------
       NORMALIZE EMAIL
    ------------------------------------------------------- */

    const normalizedEmail = email.toLowerCase().trim();

    /* -------------------------------------------------------
       CHECK JWT CONFIGURATION
    ------------------------------------------------------- */

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration is missing.",
      });
    }

    /* -------------------------------------------------------
       FIND ADMIN
    ------------------------------------------------------- */

    const admin = await AdminUser.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* -------------------------------------------------------
       CHECK ACCOUNT STATUS
    ------------------------------------------------------- */

    if (admin.active !== true) {
      return res.status(403).json({
        success: false,
        message: "This administrator account is inactive.",
      });
    }

    /* -------------------------------------------------------
       CHECK PASSWORD
    ------------------------------------------------------- */

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* -------------------------------------------------------
       CREATE JWT TOKEN
    ------------------------------------------------------- */

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    /* -------------------------------------------------------
       UPDATE LAST LOGIN
    ------------------------------------------------------- */

    admin.lastLogin = new Date();

    await admin.save();

    /* -------------------------------------------------------
       RESPONSE
       NEVER SEND PASSWORD
    ------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

/* =========================================================
   GET CURRENT ADMIN

   GET /api/admin/me
========================================================= */

router.get("/me", requireAdmin, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      admin: {
        id: req.admin._id.toString(),
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        active: req.admin.active,
        lastLogin: req.admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get current admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch administrator.",
    });
  }
});

/* =========================================================
   ADMIN LOGOUT

   POST /api/admin/logout

   JWT authentication is stateless, so the frontend
   removes the stored token after receiving this response.
========================================================= */

router.post("/logout", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

/* =========================================================
   EXPORT
========================================================= */

export default router;