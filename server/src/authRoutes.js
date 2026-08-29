import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdminUser } from "./adminUserModel.js";
import { requireAdmin } from "./adminAuth.js";

const router = express.Router();


/* =====================================================
   ADMIN LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const admin = await AdminUser.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!admin.active) {
      return res.status(403).json({
        message: "This admin account has been disabled.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});


/* =====================================================
   CHECK CURRENT ADMIN
===================================================== */

router.get("/me", requireAdmin, async (req, res) => {
  res.json({
    authenticated: true,
    admin: req.admin,
  });
});


/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", (req, res) => {

  const isProduction =
    process.env.NODE_ENV === "production";

  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({
    message: "Logged out successfully.",
  });
});


export default router;