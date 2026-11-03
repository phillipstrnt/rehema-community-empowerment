import { API_BASE_URL } from "../apiConfig.js";

import React, {
  useEffect,
  useState,
} from "react";

const API_URL = API_BASE_URL;

export default function AdminUsers() {

  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "admin",
    });


  /* =====================================================
     GET TOKEN
  ===================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token")
    );
  };


  /* =====================================================
     LOAD ADMINISTRATORS
  ===================================================== */

  const loadAdmins = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Your administrator session has expired. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load administrators."
        );
      }

      setAdmins(data.admins || []);

    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadAdmins();
  }, []);


  /* =====================================================
     FORM INPUT
  ===================================================== */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  /* =====================================================
     CREATE ADMIN
  ===================================================== */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    try {

      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create administrator."
        );
      }

      setSuccess(
        "Administrator created successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
      });

      setShowForm(false);

      await loadAdmins();

    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     TOGGLE ACTIVE STATUS
  ===================================================== */

  const toggleStatus = async (
    admin
  ) => {

    setError("");
    setSuccess("");

    const token = getToken();

    try {

      const response = await fetch(
        `${API_URL}/admin/users/${admin._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            active: !admin.active,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update administrator."
        );
      }

      setSuccess(
        data.message
      );

      await loadAdmins();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }
  };


  /* =====================================================
     DELETE ADMIN
  ===================================================== */

  const deleteAdmin = async (
    admin
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${admin.name}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {

      const token = getToken();

      const response = await fetch(
        `${API_URL}/admin/users/${admin._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete administrator."
        );
      }

      setSuccess(
        data.message
      );

      await loadAdmins();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }
  };


  return (

    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-users-header">

        <div>

          <span className="admin-eyebrow">
            SYSTEM
          </span>

          <h1>
            Administrator Users
          </h1>

          <p>
            Manage the people who have access
            to the REHEMA administration panel.
          </p>

        </div>


        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            setShowForm(
              !showForm
            );

            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Administrator"}
        </button>

      </div>


      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div className="admin-alert success">
          {success}
        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-alert error">
          {error}
        </div>

      )}


      {/* =================================================
          ADD ADMIN FORM
      ================================================= */}

      {showForm && (

        <section className="admin-users-form-card">

          <div className="form-card-header">

            <div>

              <span className="panel-eyebrow">
                NEW USER
              </span>

              <h2>
                Add Administrator
              </h2>

              <p>
                Create a new account with
                access to the REHEMA admin panel.
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="admin-users-form"
          >

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  minLength="8"
                  required
                />

                <small>
                  Use at least 8 characters.
                </small>

              </div>


              {/* ROLE */}

              <div className="form-group">

                <label htmlFor="role">
                  Administrator Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >

                  <option value="admin">
                    Administrator
                  </option>

                  <option value="super_admin">
                    Super Administrator
                  </option>

                </select>

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Administrator"}
              </button>

            </div>

          </form>

        </section>

      )}


      {/* =================================================
          ADMIN LIST
      ================================================= */}

      <section className="admin-users-list-card">

        <div className="list-card-header">

          <div>

            <span className="panel-eyebrow">
              ACCESS CONTROL
            </span>

            <h2>
              Administrators
            </h2>

          </div>

          <span className="admin-count">
            {admins.length} user
            {admins.length !== 1
              ? "s"
              : ""}
          </span>

        </div>


        {loading ? (

          <div className="admin-loading">
            Loading administrators...
          </div>

        ) : admins.length === 0 ? (

          <div className="admin-empty">
            No administrators found.
          </div>

        ) : (

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    Administrator
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {admins.map(
                  (admin) => (

                    <tr
                      key={admin._id}
                    >

                      <td>

                        <div className="admin-user-name">

                          <div className="admin-avatar">
                            {admin.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <strong>
                            {admin.name}
                          </strong>

                        </div>

                      </td>


                      <td>
                        {admin.email}
                      </td>


                      <td>

                        <span
                          className={
                            admin.role ===
                            "super_admin"
                              ? "role-badge super"
                              : "role-badge"
                          }
                        >
                          {admin.role ===
                          "super_admin"
                            ? "Super Admin"
                            : "Admin"}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            admin.active
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {admin.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>


                      <td>

                        {admin.createdAt
                          ? new Date(
                              admin.createdAt
                            ).toLocaleDateString()
                          : "—"}

                      </td>


                      <td>

                        <div className="admin-actions">

                          <button
                            type="button"
                            className={
                              admin.active
                                ? "table-button deactivate"
                                : "table-button activate"
                            }
                            onClick={() =>
                              toggleStatus(
                                admin
                              )
                            }
                          >
                            {admin.active
                              ? "Deactivate"
                              : "Activate"}
                          </button>


                          <button
                            type="button"
                            className="table-button delete"
                            onClick={() =>
                              deleteAdmin(
                                admin
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

