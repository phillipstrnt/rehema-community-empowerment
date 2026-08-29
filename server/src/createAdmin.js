import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "./db.js";
import { AdminUser } from "./adminUserModel.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await AdminUser.findOne({
      email: "admin@rehemafoundation.org",
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "ChangeThisPassword123!",
      12
    );

    const admin = await AdminUser.create({
      name: "REHEMA Administrator",
      email: "admin@rehemafoundation.org",
      password: hashedPassword,
      role: "super_admin",
      active: true,
    });

    console.log("=================================");
    console.log("ADMIN ACCOUNT CREATED");
    console.log("=================================");
    console.log("Email:", admin.email);
    console.log("Password: ChangeThisPassword123!");
    console.log("Role:", admin.role);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();