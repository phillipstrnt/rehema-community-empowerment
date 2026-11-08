import { API_BASE_URL } from "../apiConfig.js";


import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import "./AdminUsers.css";


const API_URL = API_BASE_URL;


export default function AdminUsers() {

  /* =====================================================
     STATE
  ===================================================== */

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    active: true,
  });


  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    return (
      localStorage.getItem(
        "rehema_admin_token"
      ) ||
      sessionStorage.getItem(
        "rehema_admin_token"
      )
    );
  };


  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "admin",
      active: true,
    });

    setEditingUser(null);
  };


  /* =====================================================
     FETCH USERS
  ===================================================== */

  const fetchUsers = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "Your administrator session has expired. Please login again."
          );
        }


        const response = await fetch(
          `${API_URL}/admin/users`,
          {
            method: "GET",
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
            "Failed to load administrators."
          );
        }


        setUsers(
          Array.isArray(data.users)
            ? data.users
            : Array.isArray(data)
              ? data
              : []
        );

      } catch (err) {
        console.error(
          "Admin users error:",
          err
        );

        setError(
          err.message ||
          "Unable to load administrators."
        );

      } finally {
        setLoading(false);
      }
    },
    []
  );


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  /* =====================================================
     FORM INPUT
  ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  /* =====================================================
     OPEN ADD FORM
  ===================================================== */

  const openAddForm = () => {
    resetForm();

    setSuccess("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     OPEN EDIT FORM
  ===================================================== */

  const openEditForm = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "admin",
      active:
        user.active !== false,
    });

    setSuccess("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     CLOSE FORM
  ===================================================== */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    resetForm();

    setError("");
  };


  /* =====================================================
     SAVE ADMIN
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");


    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Your administrator session has expired. Please login again."
        );
      }


      if (!form.name.trim()) {
        throw new Error(
          "Please enter the administrator's name."
        );
      }


      if (!form.email.trim()) {
        throw new Error(
          "Please enter an email address."
        );
      }


      const isEditing =
        Boolean(editingUser);


      const url = isEditing
        ? `${API_URL}/admin/users/${editingUser._id}`
        : `${API_URL}/admin/users`;


      const method =
        isEditing
          ? "PUT"
          : "POST";


      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        active: form.active,
      };


      /*
        Password is sent only when:

        1. Creating a new administrator
        2. Editing and entering a new password
      */

      if (
        form.password.trim()
      ) {
        payload.password =
          form.password;
      }


      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to save administrator."
        );
      }


      setSuccess(
        isEditing
          ? "Administrator updated successfully."
          : "Administrator created successfully."
      );


      setShowForm(false);

      resetForm();

      await fetchUsers();

    } catch (err) {
      console.error(
        "Save administrator error:",
        err
      );

      setError(
        err.message ||
        "Unable to save administrator."
      );

    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     TOGGLE ACTIVE
  ===================================================== */

  const toggleActive = async (user) => {

    const action =
      user.active
        ? "deactivate"
        : "activate";


    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} ${user.name}?`
      );


    if (!confirmed) {
      return;
    }


    try {
      setError("");
      setSuccess("");


      const token = getToken();


      if (!token) {
        throw new Error(
          "Your administrator session has expired. Please login again."
        );
      }


      const response =
        await fetch(
          `${API_URL}/admin/users/${user._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                active:
                  !user.active,
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to update administrator."
        );
      }


      setSuccess(
        user.active
          ? "Administrator deactivated successfully."
          : "Administrator activated successfully."
      );


      await fetchUsers();

    } catch (err) {
      console.error(
        "Toggle administrator error:",
        err
      );

      setError(
        err.message ||
        "Unable to update administrator."
      );
    }
  };


  /* =====================================================
     DELETE USER
  ===================================================== */

  const deleteUser = async (user) => {

    const confirmed =
      window.confirm(
        `Delete administrator "${user.name}"?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    try {
      setError("");
      setSuccess("");


      const token = getToken();


      if (!token) {
        throw new Error(
          "Your administrator session has expired. Please login again."
        );
      }


      const response =
        await fetch(
          `${API_URL}/admin/users/${user._id}`,
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
          "Unable to delete administrator."
        );
      }


      setSuccess(
        "Administrator deleted successfully."
      );


      await fetchUsers();

    } catch (err) {
      console.error(
        "Delete administrator error:",
        err
      );

      setError(
        err.message ||
        "Unable to delete administrator."
      );
    }
  };


  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers =
    users.filter((user) => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      if (!searchValue) {
        return true;
      }


      return (
        user.name
          ?.toLowerCase()
          .includes(searchValue) ||

        user.email
          ?.toLowerCase()
          .includes(searchValue) ||

        user.role
          ?.toLowerCase()
          .includes(searchValue)
      );
    });


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="admin-users-header">

        <div>

          <p className="admin-users-eyebrow">
            SYSTEM
          </p>

          <h1>
            Admin Users
          </h1>

          <p>
            Manage the administrators who have
            access to the REHEMA administration portal.
          </p>

        </div>


        <button
          type="button"
          className="admin-users-add-button"
          onClick={openAddForm}
        >
          <span>+</span>
          Add Administrator
        </button>

      </section>


      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="admin-users-alert error">
          <strong>Error</strong>
          <span>{error}</span>
        </div>
      )}


      {success && (
        <div className="admin-users-alert success">
          <strong>Success</strong>
          <span>{success}</span>
        </div>
      )}


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (
        <section className="admin-users-form-card">

          <div className="admin-users-form-header">

            <div>

              <span>
                {editingUser
                  ? "EDIT ADMINISTRATOR"
                  : "NEW ADMINISTRATOR"}
              </span>

              <h2>
                {editingUser
                  ? "Edit Administrator"
                  : "Add Administrator"}
              </h2>

            </div>


            <button
              type="button"
              className="admin-users-close-button"
              onClick={closeForm}
              disabled={saving}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="admin-users-form"
          >

            <div className="admin-users-form-grid">

              {/* NAME */}

              <div className="admin-form-field">

                <label htmlFor="admin-name">
                  Full Name
                </label>

                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="admin-form-field">

                <label htmlFor="admin-email">
                  Email Address
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="admin-form-field">

                <label htmlFor="admin-password">

                  Password

                  {editingUser && (
                    <small>
                      Leave blank to keep current password
                    </small>
                  )}

                </label>


                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Create a secure password"
                  }
                  required={!editingUser}
                  minLength="8"
                />

              </div>


              {/* ROLE */}

              <div className="admin-form-field">

                <label htmlFor="admin-role">
                  Administrator Role
                </label>

                <select
                  id="admin-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >

                  <option value="admin">
                    Admin
                  </option>

                  <option value="super_admin">
                    Super Admin
                  </option>

                </select>

              </div>

            </div>


            {/* ACTIVE */}

            <label className="admin-active-toggle">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />


              <span className="admin-toggle-box">
                ✓
              </span>


              <span>

                <strong>
                  Account Active
                </strong>

                <small>
                  Allow this administrator to
                  access the administration portal.
                </small>

              </span>

            </label>


            {/* ACTIONS */}

            <div className="admin-users-form-actions">

              <button
                type="button"
                className="admin-users-cancel"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-users-save"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingUser
                    ? "Update Administrator"
                    : "Create Administrator"}

              </button>

            </div>

          </form>

        </section>
      )}


      {/* =================================================
          USERS TABLE
      ================================================= */}

      <section className="admin-users-card">

        <div className="admin-users-card-header">

          <div>

            <span>
              ADMINISTRATORS
            </span>

            <h2>
              Administrator Accounts
            </h2>

          </div>


          <div className="admin-users-count">
            {users.length}
          </div>

        </div>


        {/* SEARCH */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <span>
              ⌕
            </span>

            <input
              type="search"
              placeholder="Search administrators..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="admin-users-refresh"
            onClick={fetchUsers}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* TABLE */}

        {loading ? (

          <div className="admin-users-empty">

            <div className="admin-users-spinner" />

            <strong>
              Loading administrators...
            </strong>

          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">
              ♙
            </div>

            <strong>
              {search
                ? "No administrators found"
                : "No administrators yet"}
            </strong>

            <p>
              {search
                ? "Try a different search."
                : "Add your first administrator to get started."}
            </p>


            {!search && (
              <button
                type="button"
                onClick={openAddForm}
                className="admin-users-empty-button"
              >
                + Add Administrator
              </button>
            )}

          </div>

        ) : (

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    ADMINISTRATOR
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    CREATED
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user._id}
                    >

                      {/* USER */}

                      <td>

                        <div className="admin-table-user">

                          <div className="admin-table-avatar">

                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>


                          <div>

                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              {user.email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={`admin-role-badge ${
                            user.role ===
                            "super_admin"
                              ? "super-admin"
                              : "admin"
                          }`}
                        >

                          {user.role ===
                          "super_admin"
                            ? "Super Admin"
                            : "Admin"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status-badge ${
                            user.active
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          <i />

                          {user.active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>


                      {/* CREATED */}

                      <td>

                        <span className="admin-created-date">

                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-user-actions">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                user
                              )
                            }
                            className="admin-action-edit"
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              toggleActive(
                                user
                              )
                            }
                            className="admin-action-status"
                          >

                            {user.active
                              ? "Deactivate"
                              : "Activate"}

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              deleteUser(
                                user
                              )
                            }
                            className="admin-action-delete"
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
