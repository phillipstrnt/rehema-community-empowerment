
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  /* =======================================================
     HANDLE INPUT CHANGES
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      /* ---------------------------------------------------
         SEND LOGIN REQUEST TO SERVER
      --------------------------------------------------- */

      const response = await fetch(
        `${API_URL}/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


      /* ---------------------------------------------------
         READ SERVER RESPONSE
      --------------------------------------------------- */

      const data = await response.json();


      /* ---------------------------------------------------
         HANDLE LOGIN FAILURE
      --------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }


      /* ---------------------------------------------------
         MAKE SURE TOKEN WAS RETURNED
      --------------------------------------------------- */

      if (!data.token) {
        throw new Error(
          "Login succeeded, but no authentication token was received."
        );
      }


      /* ---------------------------------------------------
         SAVE ADMIN LOGIN
         
         Remember me checked:
         → localStorage

         Remember me unchecked:
         → sessionStorage
      --------------------------------------------------- */

      if (rememberMe) {

        localStorage.setItem(
          "adminToken",
          data.token
        );

        localStorage.setItem(
          "adminUser",
          JSON.stringify(data.admin || {})
        );

        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");

      } else {

        sessionStorage.setItem(
          "adminToken",
          data.token
        );

        sessionStorage.setItem(
          "adminUser",
          JSON.stringify(data.admin || {})
        );

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }


      /* ---------------------------------------------------
         LOGIN SUCCESSFUL
      --------------------------------------------------- */

      navigate("/admin", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );

      setError(
        error.message ||
          "Unable to sign in. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="admin-login-page">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="admin-login-brand">

        <div className="admin-login-brand-content">

          <div className="admin-login-logo">
            R
          </div>

          <p className="admin-login-eyebrow">
            REHEMA FOUNDATION
          </p>

          <h1>
            Administration
            <br />
            Portal
          </h1>

          <p className="admin-login-description">
            Secure access to the REHEMA Foundation
            administration dashboard.
          </p>

          <div className="admin-login-security">

            <span className="security-icon">
              🔒
            </span>

            <div>

              <strong>
                Secure Administration
              </strong>

              <p>
                Authorized personnel only
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="admin-login-panel">

        <div className="admin-login-card">

          <div className="admin-login-header">

            <p className="admin-login-small-title">
              WELCOME BACK
            </p>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your administrator credentials
              to continue.
            </p>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="admin-login-error">

              <span>
                ⚠
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="admin-form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-form-group">

              <div className="admin-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password recovery has not been implemented yet."
                    )
                  }
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>


              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔑
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

            </div>


            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <div className="admin-login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="login-spinner"></span>

                  Signing in...
                </>

              ) : (

                <>
                  Sign in

                  <span>
                    →
                  </span>
                </>

              )}

            </button>

          </form>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="admin-login-footer">

            <span>
              REHEMA FOUNDATION
            </span>

            <span>
              •
            </span>

            <span>
              Secure Admin Portal
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}