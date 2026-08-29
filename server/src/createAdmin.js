
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { AdminUser } from "./adminUserModel.js";


/* =========================================================
   CREATE OR UPDATE ADMINISTRATOR
========================================================= */

const createAdmin = async () => {
  try {

    /* -------------------------------------------------------
       CHECK MONGODB CONNECTION STRING
    ------------------------------------------------------- */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file."
      );
    }


    /* -------------------------------------------------------
       CHECK JWT SECRET
    ------------------------------------------------------- */

    if (!process.env.JWT_SECRET) {
      console.warn(
        "WARNING: JWT_SECRET is missing from the .env file."
      );
    }


    /* -------------------------------------------------------
       CONNECT TO MONGODB
    ------------------------------------------------------- */

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");


    /* -------------------------------------------------------
       ADMIN DETAILS

       CHANGE THESE VALUES WHENEVER YOU WANT TO CHANGE
       THE ADMIN LOGIN DETAILS.
    ------------------------------------------------------- */

    const name = "REHEMA Administrator";

    const email = "rehemainfo@gmail.com";

    const password = "SYDney9425#";

    const role = "super_admin";


    /* -------------------------------------------------------
       NORMALIZE EMAIL
    ------------------------------------------------------- */

    const normalizedEmail = email
      .toLowerCase()
      .trim();


    /* -------------------------------------------------------
       HASH PASSWORD
    ------------------------------------------------------- */

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );


    /* -------------------------------------------------------
       FIND EXISTING ADMIN

       We search by the CURRENT email first.
    ------------------------------------------------------- */

    let admin = await AdminUser.findOne({
      email: normalizedEmail,
    });


    /* -------------------------------------------------------
       IF ADMIN EXISTS
       UPDATE ACCOUNT
    ------------------------------------------------------- */

    if (admin) {

      admin.name = name;
      admin.email = normalizedEmail;
      admin.password = hashedPassword;
      admin.role = role;
      admin.active = true;

      await admin.save();

      console.log("");
      console.log("==========================================");
      console.log(" ADMINISTRATOR UPDATED SUCCESSFULLY");
      console.log("==========================================");
      console.log(`Name:  ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role:  ${admin.role}`);
      console.log("Password: updated successfully");
      console.log("Status: ACTIVE");
      console.log("==========================================");
      console.log("");

      return;
    }


    /* -------------------------------------------------------
       CREATE NEW ADMIN
    ------------------------------------------------------- */

    admin = await AdminUser.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      active: true,
    });


    /* -------------------------------------------------------
       SUCCESS MESSAGE
    ------------------------------------------------------- */

    console.log("");
    console.log("==========================================");
    console.log(" ADMINISTRATOR CREATED SUCCESSFULLY");
    console.log("==========================================");
    console.log(`Name:  ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role:  ${admin.role}`);
    console.log("Password: set successfully");
    console.log("Status: ACTIVE");
    console.log("==========================================");
    console.log("");


  } catch (error) {

    console.error(
      "Failed to create/update administrator:",
      error.message
    );

  } finally {

    /* -------------------------------------------------------
       CLOSE DATABASE CONNECTION
    ------------------------------------------------------- */

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
};


createAdmin();