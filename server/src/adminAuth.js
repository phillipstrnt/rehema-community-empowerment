import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdminUser } from "./adminUserModel.js";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN
========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* Validate input */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    /* Find admin */

    const admin = await AdminUser.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* Check account status */

    if (!admin.active) {
      return res.status(403).json({
        message: "This administrator account is inactive.",
      });
    }

    /* Compare password */

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /* Create JWT */

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

    /* Send response */

    res.json({
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

export default router;