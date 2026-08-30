
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/* =========================================================
   PROTECTED ADMIN ROUTE

   Protects all /admin/* pages.

   A user must have an authentication token stored in either:
   - localStorage
   - sessionStorage

   If no token exists:
   → redirect to /admin/login
========================================================= */

export default function ProtectedRoute() {
  const location = useLocation();

  /* =======================================================
     CHECK FOR ADMIN TOKEN
  ======================================================= */

  const localToken = localStorage.getItem(
    "rehema_admin_token"
  );

  const sessionToken = sessionStorage.getItem(
    "rehema_admin_token"
  );

  const token =
    localToken || sessionToken;

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* =======================================================
     AUTHENTICATED
  ======================================================= */

  return <Outlet />;
}