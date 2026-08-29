
import jwt from "jsonwebtoken";
import { AdminUser } from "./adminUserModel.js";

/* =========================================================
   REQUIRE ADMIN AUTHENTICATION
   Protects admin-only API routes
========================================================= */

export const requireAdmin = async (req, res, next) => {
  try {
    /* -------------------------------------------------------
       1. CHECK AUTHORIZATION HEADER
    ------------------------------------------------------- */

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /* -------------------------------------------------------
       2. CHECK BEARER FORMAT
    ------------------------------------------------------- */

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format.",
      });
    }

    /* -------------------------------------------------------
       3. EXTRACT TOKEN
    ------------------------------------------------------- */

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    /* -------------------------------------------------------
       4. CHECK JWT SECRET
    ------------------------------------------------------- */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    /* -------------------------------------------------------
       5. VERIFY TOKEN
    ------------------------------------------------------- */

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      console.error(
        "JWT verification error:",
        error.message
      );

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please log in again.",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid authentication token.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Authentication failed.",
      });
    }

    /* -------------------------------------------------------
       6. CHECK TOKEN PAYLOAD
    ------------------------------------------------------- */

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    /* -------------------------------------------------------
       7. FIND ADMINISTRATOR
    ------------------------------------------------------- */

    const admin = await AdminUser.findById(
      decoded.id
    ).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Administrator account not found.",
      });
    }

    /* -------------------------------------------------------
       8. CHECK ACCOUNT STATUS
    ------------------------------------------------------- */

    if (admin.active === false) {
      return res.status(403).json({
        success: false,
        message: "Your administrator account is inactive.",
      });
    }

    /* -------------------------------------------------------
       9. ATTACH ADMIN TO REQUEST
    ------------------------------------------------------- */

    req.admin = admin;

    /* -------------------------------------------------------
       10. CONTINUE TO PROTECTED ROUTE
    ------------------------------------------------------- */

    next();

  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};


/* =========================================================
   OPTIONAL ADMIN ROLE CHECK
   Use this when we need different admin permissions later.
========================================================= */

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      /* Admin must already be authenticated */
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      /* Get administrator role */
      const adminRole = req.admin.role;

      /* Check whether role is allowed */
      if (!allowedRoles.includes(adminRole)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }

      next();

    } catch (error) {
      console.error(
        "Role authorization error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Authorization failed.",
      });
    }
  };
};
