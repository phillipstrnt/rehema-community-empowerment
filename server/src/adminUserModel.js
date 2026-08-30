import mongoose from "mongoose";

/* =========================================================
   ADMIN USER SCHEMA
========================================================= */

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   ADMIN USER MODEL
========================================================= */

export const AdminUser =
  mongoose.models.AdminUser ||
  mongoose.model(
    "AdminUser",
    adminUserSchema
  );