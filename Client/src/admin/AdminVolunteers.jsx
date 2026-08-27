import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState(null);

  const [editingVolunteer, setEditingVolunteer] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    message: "",
    status: "new",
  });

  // ==========================================
  // LOAD VOLUNTEERS
  // ==========================================

  async function loadVolunteers() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/volunteers");

      setVolunteers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Unable to load volunteers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVolunteers();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredVolunteers = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return volunteers.filter((volunteer) => {
      const matchesSearch =
        !searchText ||
        volunteer.name
          ?.toLowerCase()
          .includes(searchText) ||
        volunteer.email
          ?.toLowerCase()
          .includes(searchText) ||
        volunteer.phone
          ?.toLowerCase()
          .includes(searchText) ||
        volunteer.skills
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        volunteer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    volunteers,
    search,
    statusFilter,
  ]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalVolunteers =
    volunteers.length;

  const newVolunteers =
    volunteers.filter(
      (volunteer) =>
        volunteer.status === "new"
    ).length;

  const contactedVolunteers =
    volunteers.filter(
      (volunteer) =>
        volunteer.status === "contacted"
    ).length;

  const approvedVolunteers =
    volunteers.filter(
      (volunteer) =>
        volunteer.status === "approved"
    ).length;

  // ==========================================
  // OPEN EDIT
  // ==========================================

  function openEdit(volunteer) {
    setEditingVolunteer(volunteer);

    setForm({
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      skills: volunteer.skills || "",
      message: volunteer.message || "",
      status: volunteer.status || "new",
    });

    setError("");
    setSuccess("");
  }

  // ==========================================
  // INPUT
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // ==========================================
  // UPDATE VOLUNTEER
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await api(
        `/volunteers/${editingVolunteer._id}`,
        {
          method: "PUT",
          body: JSON.stringify(form),
        }
      );

      setVolunteers((current) =>
        current.map((volunteer) =>
          volunteer._id === updated._id
            ? updated
            : volunteer
        )
      );

      setEditingVolunteer(null);

      setSuccess(
        "Volunteer updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to update volunteer."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // QUICK STATUS UPDATE
  // ==========================================

  async function updateStatus(
    id,
    status
  ) {
    try {
      setError("");

      const updated = await api(
        `/volunteers/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      setVolunteers((current) =>
        current.map((volunteer) =>
          volunteer._id === updated._id
            ? updated
            : volunteer
        )
      );

      setSuccess(
        "Volunteer status updated."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to update status."
      );
    }
  }

  // ==========================================
  // DELETE
  // ==========================================

  async function deleteVolunteer(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this volunteer? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");

      await api(
        `/volunteers/${id}`,
        {
          method: "DELETE",
        }
      );

      setVolunteers((current) =>
        current.filter(
          (volunteer) =>
            volunteer._id !== id
        )
      );

      setSelectedVolunteer(null);

      setSuccess(
        "Volunteer deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to delete volunteer."
      );
    }
  }

  // ==========================================
  // STATUS LABEL
  // ==========================================

  function getStatusClass(status) {
    switch (status) {
      case "approved":
        return "approved";

      case "contacted":
        return "contacted";

      case "rejected":
        return "rejected";

      default:
        return "new";
    }
  }

  return (
    <div className="admin-form-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-form-header">
        <div>
          <p className="admin-eyebrow">
            COMMUNITY MANAGEMENT
          </p>

          <h1>
            Volunteers
          </h1>

          <p>
            Manage people who have expressed
            interest in volunteering with REHEMA.
          </p>
        </div>
      </div>


      {/* =====================================
          ALERTS
      ===================================== */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
        </div>
      )}


      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="volunteer-stats">

        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            👥
          </div>

          <div>
            <span>Total Volunteers</span>
            <strong>
              {totalVolunteers}
            </strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            🆕
          </div>

          <div>
            <span>New Applications</span>
            <strong>
              {newVolunteers}
            </strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            📞
          </div>

          <div>
            <span>Contacted</span>
            <strong>
              {contactedVolunteers}
            </strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            ✓
          </div>

          <div>
            <span>Approved</span>
            <strong>
              {approvedVolunteers}
            </strong>
          </div>
        </div>

      </div>


      {/* =====================================
          VOLUNTEER MANAGEMENT CARD
      ===================================== */}

      <div className="admin-form-card">

        <div className="section-heading">

          <div>
            <h2>
              Volunteer Applications
            </h2>

            <p>
              Review and manage volunteer
              applications submitted through
              the website.
            </p>
          </div>

        </div>


        {/* =================================
            TOOLBAR
        ================================= */}

        <div className="volunteer-toolbar">

          <div className="volunteer-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by name, email, phone or skills..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>


          <select
            className="volunteer-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Statuses
            </option>

            <option value="new">
              New
            </option>

            <option value="contacted">
              Contacted
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>

        </div>


        {/* =================================
            LOADING
        ================================= */}

        {loading && (
          <div className="admin-empty-state">

            <div className="admin-loader"></div>

            <p>
              Loading volunteers...
            </p>

          </div>
        )}


        {/* =================================
            EMPTY
        ================================= */}

        {!loading &&
          filteredVolunteers.length === 0 && (
            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                👥
              </div>

              <h3>
                No volunteers found
              </h3>

              <p>
                There are currently no volunteer
                applications matching your search.
              </p>

            </div>
          )}


        {/* =================================
            TABLE
        ================================= */}

        {!loading &&
          filteredVolunteers.length > 0 && (

            <div className="volunteer-table-wrapper">

              <table className="volunteer-table">

                <thead>
                  <tr>

                    <th>
                      Volunteer
                    </th>

                    <th>
                      Contact
                    </th>

                    <th>
                      Skills
                    </th>

                    <th>
                      Submitted
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {filteredVolunteers.map(
                    (volunteer) => (

                      <tr
                        key={
                          volunteer._id
                        }
                      >

                        {/* VOLUNTEER */}

                        <td>

                          <div className="volunteer-person">

                            <div className="volunteer-avatar">
                              {(
                                volunteer.name ||
                                "V"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  volunteer.name ||
                                  "Unnamed"
                                }
                              </strong>

                              <span>
                                {
                                  volunteer.skills ||
                                  "Volunteer"
                                }
                              </span>
                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="volunteer-contact">

                            <span>
                              {volunteer.email ||
                                "No email"}
                            </span>

                            <span>
                              {volunteer.phone ||
                                "No phone"}
                            </span>

                          </div>

                        </td>


                        {/* SKILLS */}

                        <td>

                          <div className="volunteer-skills">

                            {volunteer.skills ||
                              "Not specified"}

                          </div>

                        </td>


                        {/* DATE */}

                        <td>

                          {volunteer.createdAt
                            ? new Date(
                                volunteer.createdAt
                              ).toLocaleDateString()
                            : "—"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <select
                            className={`volunteer-status-select ${getStatusClass(
                              volunteer.status
                            )}`}
                            value={
                              volunteer.status ||
                              "new"
                            }
                            onChange={(event) =>
                              updateStatus(
                                volunteer._id,
                                event.target.value
                              )
                            }
                          >

                            <option value="new">
                              New
                            </option>

                            <option value="contacted">
                              Contacted
                            </option>

                            <option value="approved">
                              Approved
                            </option>

                            <option value="rejected">
                              Rejected
                            </option>

                          </select>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="volunteer-actions">

                            <button
                              type="button"
                              className="admin-button admin-button-secondary"
                              onClick={() =>
                                setSelectedVolunteer(
                                  volunteer
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="admin-button admin-button-secondary"
                              onClick={() =>
                                openEdit(
                                  volunteer
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-button admin-button-danger"
                              onClick={() =>
                                deleteVolunteer(
                                  volunteer._id
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

      </div>


      {/* =====================================
          VIEW VOLUNTEER MODAL
      ===================================== */}

      {selectedVolunteer && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedVolunteer(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <p className="admin-eyebrow">
                  VOLUNTEER APPLICATION
                </p>

                <h2>
                  {
                    selectedVolunteer.name
                  }
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedVolunteer(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="volunteer-detail-grid">

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {
                    selectedVolunteer.email ||
                    "Not provided"
                  }
                </strong>
              </div>


              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {
                    selectedVolunteer.phone ||
                    "Not provided"
                  }
                </strong>
              </div>


              <div>
                <span>
                  Skills
                </span>

                <strong>
                  {
                    selectedVolunteer.skills ||
                    "Not provided"
                  }
                </strong>
              </div>


              <div>
                <span>
                  Application Date
                </span>

                <strong>
                  {selectedVolunteer.createdAt
                    ? new Date(
                        selectedVolunteer.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>

            </div>


            <div className="volunteer-message">

              <span>
                Message
              </span>

              <p>
                {
                  selectedVolunteer.message ||
                  "No message provided."
                }
              </p>

            </div>


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => {
                  setSelectedVolunteer(
                    null
                  );

                  openEdit(
                    selectedVolunteer
                  );
                }}
              >
                Edit Volunteer
              </button>

              <button
                type="button"
                className="admin-button admin-button-primary"
                onClick={() =>
                  setSelectedVolunteer(
                    null
                  )
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================
          EDIT MODAL
      ===================================== */}

      {editingVolunteer && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setEditingVolunteer(null)
          }
        >

          <div
            className="admin-modal admin-modal-large"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <p className="admin-eyebrow">
                  VOLUNTEER MANAGEMENT
                </p>

                <h2>
                  Edit Volunteer
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setEditingVolunteer(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                <div className="admin-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="admin-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="admin-field">

                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                </div>


                <div className="admin-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="new">
                      New
                    </option>

                    <option value="contacted">
                      Contacted
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                  </select>

                </div>


                <div className="admin-field admin-field-full">

                  <label>
                    Skills
                  </label>

                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                  />

                </div>


                <div className="admin-field admin-field-full">

                  <label>
                    Message
                  </label>

                  <textarea
                    name="message"
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="admin-form-actions">

                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={() =>
                    setEditingVolunteer(
                      null
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}