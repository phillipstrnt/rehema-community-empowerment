
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdminUser } from "./adminUserModel.js";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN
   POST /api/admin/login
========================================================= */

router.post("/login", async (req, res) => {
  try {
    /* -------------------------------------------------------
       GET LOGIN DATA
    ------------------------------------------------------- */

    const { email, password } = req.body;

    /* -------------------------------------------------------
       VALIDATE INPUT
    ------------------------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* -------------------------------------------------------
       CHECK JWT SECRET
    ------------------------------------------------------- */

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration is missing.",
      });
    }

    /* -------------------------------------------------------
       FIND ADMINISTRATOR
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
       VERIFY PASSWORD
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
       Only if your model contains lastLogin.
    ------------------------------------------------------- */

    if ("lastLogin" in admin.schema.paths) {
      admin.lastLogin = new Date();
      await admin.save();
    }

    /* -------------------------------------------------------
       LOGIN SUCCESS
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
   ADMIN LOGOUT
   POST /api/admin/logout

   JWT authentication is stateless, so the frontend removes
   the stored token. This endpoint is provided for a clean
   logout API response.
========================================================= */

router.post("/logout", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});


/* =========================================================
   EXPORT ROUTER
========================================================= */

export default router;