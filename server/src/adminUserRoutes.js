import express from "express";
import bcrypt from "bcryptjs";

import { AdminUser } from "../adminUserModel.js";

import {
  requireAdmin,
  requireRole,
} from "../authMiddleware.js";

const router = express.Router();

/* =========================================================
   ADMIN USER MANAGEMENT

   Mounted in server.js as:

   app.use("/api/admin/users", adminUserRoutes);

   Therefore:

   GET    /api/admin/users
   POST   /api/admin/users
   PUT    /api/admin/users/:id
   DELETE /api/admin/users/:id

   ONLY super_admin CAN MANAGE ADMINISTRATORS.
========================================================= */


/* =========================================================
   GET ALL ADMINISTRATORS

   GET /api/admin/users
========================================================= */

router.get(
  "/",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const users = await AdminUser.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin users:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch administrator accounts.",
      });
    }
  }
);


/* =========================================================
   CREATE ADMINISTRATOR

   POST /api/admin/users
========================================================= */

router.post(
  "/",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        active,
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

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      if (
        typeof password !== "string" ||
        password.length < 8
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least 8 characters.",
        });
      }

      /* ---------------------------------------------------
         NORMALIZE EMAIL
      --------------------------------------------------- */

      const normalizedEmail =
        email.toLowerCase().trim();

      /* ---------------------------------------------------
         CHECK EXISTING EMAIL
      --------------------------------------------------- */

      const existingUser =
        await AdminUser.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "An administrator with this email already exists.",
        });
      }

      /* ---------------------------------------------------
         VALIDATE ROLE
      --------------------------------------------------- */

      let selectedRole = "admin";

      if (role === "super_admin") {
        selectedRole = "super_admin";
      }

      if (
        role !== undefined &&
        role !== "admin" &&
        role !== "super_admin"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid administrator role.",
        });
      }

      /* ---------------------------------------------------
         HASH PASSWORD
      --------------------------------------------------- */

      const hashedPassword =
        await bcrypt.hash(
          password,
          12
        );

      /* ---------------------------------------------------
         ACTIVE STATUS
      --------------------------------------------------- */

      const selectedActive =
        typeof active === "boolean"
          ? active
          : true;

      /* ---------------------------------------------------
         CREATE ADMINISTRATOR
      --------------------------------------------------- */

      const admin =
        await AdminUser.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: selectedRole,
          active: selectedActive,
        });

      /* ---------------------------------------------------
         SAFE RESPONSE

         Password is NEVER returned.
      --------------------------------------------------- */

      const safeAdmin = {
        id: admin._id.toString(),
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: admin.lastLogin,
      };

      return res.status(201).json({
        success: true,
        message:
          "Administrator created successfully.",
        user: safeAdmin,
      });
    } catch (error) {
      console.error(
        "Create admin error:",
        error
      );

      /* ---------------------------------------------------
         MONGODB DUPLICATE KEY
      --------------------------------------------------- */

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "An administrator with this email already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create administrator.",
      });
    }
  }
);


/* =========================================================
   UPDATE ADMINISTRATOR

   PUT /api/admin/users/:id
========================================================= */

router.put(
  "/:id",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        active,
      } = req.body;

      /* ---------------------------------------------------
         FIND ADMINISTRATOR
      --------------------------------------------------- */

      const admin =
        await AdminUser.findById(
          req.params.id
        );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Administrator account not found.",
        });
      }

      /* ---------------------------------------------------
         UPDATE NAME
      --------------------------------------------------- */

      if (name !== undefined) {
        if (
          typeof name !== "string" ||
          !name.trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Name cannot be empty.",
          });
        }

        admin.name = name.trim();
      }

      /* ---------------------------------------------------
         UPDATE EMAIL
      --------------------------------------------------- */

      if (email !== undefined) {
        if (
          typeof email !== "string" ||
          !email.trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Email cannot be empty.",
          });
        }

        const normalizedEmail =
          email.toLowerCase().trim();

        const emailOwner =
          await AdminUser.findOne({
            email: normalizedEmail,

            _id: {
              $ne: admin._id,
            },
          });

        if (emailOwner) {
          return res.status(409).json({
            success: false,
            message:
              "Another administrator already uses this email.",
          });
        }

        admin.email = normalizedEmail;
      }

      /* ---------------------------------------------------
         UPDATE PASSWORD

         Only change password if one was supplied.
      --------------------------------------------------- */

      if (
        password !== undefined &&
        password !== ""
      ) {
        if (
          typeof password !== "string" ||
          password.length < 8
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Password must contain at least 8 characters.",
          });
        }

        admin.password =
          await bcrypt.hash(
            password,
            12
          );
      }

      /* ---------------------------------------------------
         UPDATE ROLE
      --------------------------------------------------- */

      if (role !== undefined) {
        if (
          role !== "admin" &&
          role !== "super_admin"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid administrator role.",
          });
        }

        /* -----------------------------------------------
           PREVENT REMOVING LAST ACTIVE SUPER ADMIN
        ----------------------------------------------- */

        if (
          admin.role === "super_admin" &&
          role !== "super_admin" &&
          admin.active === true
        ) {
          const activeSuperAdmins =
            await AdminUser.countDocuments({
              role: "super_admin",
              active: true,
            });

          if (
            activeSuperAdmins <= 1
          ) {
            return res.status(400).json({
              success: false,
              message:
                "The system must have at least one active super administrator.",
            });
          }
        }

        admin.role = role;
      }

      /* ---------------------------------------------------
         UPDATE ACTIVE STATUS
      --------------------------------------------------- */

      if (
        typeof active === "boolean"
      ) {
        /* -----------------------------------------------
           PREVENT SELF DEACTIVATION
        ----------------------------------------------- */

        if (
          admin._id.toString() ===
            req.admin._id.toString() &&
          active === false
        ) {
          return res.status(400).json({
            success: false,
            message:
              "You cannot deactivate your own account.",
          });
        }

        /* -----------------------------------------------
           PREVENT DEACTIVATING LAST SUPER ADMIN
        ----------------------------------------------- */

        if (
          admin.role === "super_admin" &&
          admin.active === true &&
          active === false
        ) {
          const activeSuperAdmins =
            await AdminUser.countDocuments({
              role: "super_admin",
              active: true,
            });

          if (
            activeSuperAdmins <= 1
          ) {
            return res.status(400).json({
              success: false,
              message:
                "The last active super administrator cannot be deactivated.",
            });
          }
        }

        admin.active = active;
      }

      /* ---------------------------------------------------
         SAVE CHANGES
      --------------------------------------------------- */

      await admin.save();

      /* ---------------------------------------------------
         SAFE RESPONSE
      --------------------------------------------------- */

      const safeAdmin = {
        id: admin._id.toString(),
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: admin.lastLogin,
      };

      return res.status(200).json({
        success: true,
        message:
          "Administrator updated successfully.",
        user: safeAdmin,
      });
    } catch (error) {
      console.error(
        "Update admin error:",
        error
      );

      /* ---------------------------------------------------
         DUPLICATE EMAIL
      --------------------------------------------------- */

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "Another administrator already uses this email.",
        });
      }

      return res.status(500).json({
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
========================================================= */

router.delete(
  "/:id",
  requireAdmin,
  requireRole("super_admin"),
  async (req, res) => {
    try {
      /* ---------------------------------------------------
         FIND ADMINISTRATOR
      --------------------------------------------------- */

      const admin =
        await AdminUser.findById(
          req.params.id
        );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Administrator account not found.",
        });
      }

      /* ---------------------------------------------------
         PREVENT SELF DELETE
      --------------------------------------------------- */

      if (
        req.admin &&
        req.admin._id.toString() ===
          admin._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot delete your own administrator account.",
        });
      }

      /* ---------------------------------------------------
         PREVENT DELETING LAST ACTIVE SUPER ADMIN
      --------------------------------------------------- */

      if (
        admin.role === "super_admin" &&
        admin.active === true
      ) {
        const activeSuperAdmins =
          await AdminUser.countDocuments({
            role: "super_admin",
            active: true,
          });

        if (
          activeSuperAdmins <= 1
        ) {
          return res.status(400).json({
            success: false,
            message:
              "The last active super administrator cannot be deleted.",
          });
        }
      }

      /* ---------------------------------------------------
         DELETE ADMINISTRATOR
      --------------------------------------------------- */

      await AdminUser.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Administrator deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete admin error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete administrator.",
      });
    }
  }
);


/* =========================================================
   EXPORT
========================================================= */

export default router;