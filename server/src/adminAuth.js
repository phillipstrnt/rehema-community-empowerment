import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdminUser } from "./adminUserModel.js";
import {
  requireAdmin,
  requireRole,
} from "./authMiddleware.js";

const router = express.Router();


/* =========================================================
   ADMIN LOGIN
   POST /api/admin/login
========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration is missing.",
      });
    }

    const admin = await AdminUser.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (admin.active !== true) {
      return res.status(403).json({
        success: false,
        message:
          "This administrator account is inactive.",
      });
    }

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

    admin.lastLogin = new Date();

    await admin.save();

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
      message:
        "Login failed. Please try again.",
    });
  }
});


/* =========================================================
   GET CURRENT ADMIN
   GET /api/admin/me
========================================================= */

router.get(
  "/me",
  requireAdmin,
  async (req, res) => {
    try {
      res.json({
        success: true,
        admin: {
          id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          active: req.admin.active,
          lastLogin: req.admin.lastLogin,
        },
      });

    } catch (error) {
      console.error("Get current admin error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch administrator.",
      });
    }
  }
);


/* =========================================================
   GET ALL ADMINISTRATORS
   GET /api/admin/users

   ONLY SUPER ADMIN
========================================================= */

router.get(
  "/users",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const admins = await AdminUser.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        admins,
      });

    } catch (error) {
      console.error(
        "Get administrators error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch administrators.",
      });
    }
  }
);


/* =========================================================
   CREATE ADMINISTRATOR
   POST /api/admin/users

   ONLY SUPER ADMIN
========================================================= */

router.post(
  "/users",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
      } = req.body;

      /* ---------------------------------------------------
         VALIDATION
      --------------------------------------------------- */

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required.",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters.",
        });
      }

      const normalizedEmail =
        email.toLowerCase().trim();

      /* ---------------------------------------------------
         CHECK EXISTING EMAIL
      --------------------------------------------------- */

      const existingAdmin =
        await AdminUser.findOne({
          email: normalizedEmail,
        });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message:
            "An administrator with this email already exists.",
        });
      }

      /* ---------------------------------------------------
         VALIDATE ROLE
      --------------------------------------------------- */

      const selectedRole =
        role === "super_admin"
          ? "super_admin"
          : "admin";

      /* ---------------------------------------------------
         HASH PASSWORD
      --------------------------------------------------- */

      const hashedPassword =
        await bcrypt.hash(password, 12);

      /* ---------------------------------------------------
         CREATE ADMIN
      --------------------------------------------------- */

      const admin = await AdminUser.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: selectedRole,
        active: true,
      });

      /* ---------------------------------------------------
         RESPONSE
         NEVER SEND PASSWORD
      --------------------------------------------------- */

      res.status(201).json({
        success: true,
        message:
          "Administrator created successfully.",

        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          active: admin.active,
          createdAt: admin.createdAt,
        },
      });

    } catch (error) {
      console.error(
        "Create administrator error:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "An administrator with this email already exists.",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create administrator.",
      });
    }
  }
);


/* =========================================================
   UPDATE ADMINISTRATOR STATUS
   PATCH /api/admin/users/:id/status

   ONLY SUPER ADMIN
========================================================= */

router.patch(
  "/users/:id/status",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const { active } = req.body;

      if (typeof active !== "boolean") {
        return res.status(400).json({
          success: false,
          message:
            "Active status must be true or false.",
        });
      }

      /* -----------------------------------------------
         PREVENT SUPER ADMIN FROM DISABLING THEMSELVES
      ------------------------------------------------ */

      if (
        req.params.id ===
        req.admin._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot deactivate your own account.",
        });
      }

      const admin =
        await AdminUser.findByIdAndUpdate(
          req.params.id,
          {
            active,
          },
          {
            new: true,
          }
        ).select("-password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Administrator not found.",
        });
      }

      res.json({
        success: true,
        message: active
          ? "Administrator activated successfully."
          : "Administrator deactivated successfully.",
        admin,
      });

    } catch (error) {
      console.error(
        "Update administrator status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update administrator.",
      });
    }
  }
);


/* =========================================================
   DELETE ADMINISTRATOR
   DELETE /api/admin/users/:id

   ONLY SUPER ADMIN
========================================================= */

router.delete(
  "/users/:id",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {

      /* -----------------------------------------------
         PREVENT SELF DELETE
      ------------------------------------------------ */

      if (
        req.params.id ===
        req.admin._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot delete your own administrator account.",
        });
      }

      const admin =
        await AdminUser.findById(
          req.params.id
        );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Administrator not found.",
        });
      }

      /* -----------------------------------------------
         PROTECT LAST SUPER ADMIN
      ------------------------------------------------ */

      if (admin.role === "super_admin") {

        const superAdminCount =
          await AdminUser.countDocuments({
            role: "super_admin",
            active: true,
          });

        if (superAdminCount <= 1) {
          return res.status(400).json({
            success: false,
            message:
              "The last active super administrator cannot be deleted.",
          });
        }
      }

      await AdminUser.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Administrator deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete administrator error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete administrator.",
      });
    }
  }
);


/* =========================================================
   LOGOUT
   POST /api/admin/logout
========================================================= */

router.post(
  "/logout",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  }
);


export default router;