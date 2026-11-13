<<<<<<< HEAD
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "./adminUserModel.js";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "REHEMA Administrator";

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGO_URI and JWT_SECRET before creating an administrator.");
  }
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await AdminUser.findOneAndUpdate(
      { email },
      { $set: { name, email, password: hashedPassword, role: "super_admin", active: true } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`Administrator ready for ${admin.email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin().catch((error) => {
  console.error("Failed to create administrator:", error.message);
  process.exitCode = 1;
});
=======

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "./adminUserModel.js";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "REHEMA Administrator";

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGO_URI and JWT_SECRET before creating an administrator.");
  }
  if (!email || !password || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await AdminUser.findOneAndUpdate(
      { email },
      { $set: { name, email, password: hashedPassword, role: "super_admin", active: true } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`Administrator ready for ${admin.email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin().catch((error) => {
  console.error("Failed to create administrator:", error.message);
  process.exitCode = 1;
});
>>>>>>> d5654c452cbb6c15341a2a7d6601300e472486d0
