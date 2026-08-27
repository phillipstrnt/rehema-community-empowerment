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
  const [sortBy, setSortBy] = useState("newest");

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    message: "",
    status: "new",
  });

  // =====================================================
  // LOAD VOLUNTEERS
  // =====================================================

  async function loadVolunteers() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/volunteers");

      setVolunteers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load volunteers error:", err);

      setError(
        err.message || "Unable to load volunteer applications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVolunteers();
  }, []);

  // =====================================================
  // SEARCH / FILTER / SORT
  // =====================================================

  const filteredVolunteers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const result = volunteers.filter((volunteer) => {
      const name = String(volunteer.name || "").toLowerCase();
      const email = String(volunteer.email || "").toLowerCase();
      const phone = String(volunteer.phone || "").toLowerCase();
      const skills = String(volunteer.skills || "").toLowerCase();
      const message = String(volunteer.message || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText) ||
        skills.includes(searchText) ||
        message.includes(searchText);

      const status = volunteer.status || "new";

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "name") {
        return String(a.name || "").localeCompare(
          String(b.name || "")
        );
      }

      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      if (sortBy === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }, [volunteers, search, statusFilter, sortBy]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalVolunteers = volunteers.length;

  const newVolunteers = volunteers.filter(
    (volunteer) => (volunteer.status || "new") === "new"
  ).length;

  const contactedVolunteers = volunteers.filter(
    (volunteer) => volunteer.status === "contacted"
  ).length;

  const approvedVolunteers = volunteers.filter(
    (volunteer) => volunteer.status === "approved"
  ).length;

  const rejectedVolunteers = volunteers.filter(
    (volunteer) => volunteer.status === "rejected"
  ).length;

  // =====================================================
  // OPEN EDIT
  // =====================================================

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

  // =====================================================
  // INPUT
  // =====================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // =====================================================
  // SAVE EDIT
  // =====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!editingVolunteer?._id) {
      setError("No volunteer selected for editing.");
      return;
    }

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

      setSuccess("Volunteer updated successfully.");
    } catch (err) {
      console.error("Update volunteer error:", err);

      setError(
        err.message || "Unable to update volunteer."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // QUICK STATUS UPDATE
  // =====================================================

  async function updateStatus(id, status) {
    try {
      setError("");
      setSuccess("");

      const updated = await api(
        `/volunteers/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setVolunteers((current) =>
        current.map((volunteer) =>
          volunteer._id === updated._id
            ? updated
            : volunteer
        )
      );

      // Also update the open modal if this volunteer is being viewed
      setSelectedVolunteer((current) =>
        current && current._id === updated._id
          ? updated
          : current
      );

      setSuccess("Volunteer status updated successfully.");
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err.message || "Unable to update volunteer status."
      );
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function deleteVolunteer(id) {
    const volunteer = volunteers.find(
      (item) => item._id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        volunteer?.name || "this volunteer"
      }?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api(`/volunteers/${id}`, {
        method: "DELETE",
      });

      setVolunteers((current) =>
        current.filter(
          (volunteer) => volunteer._id !== id
        )
      );

      setSelectedVolunteer(null);
      setEditingVolunteer(null);

      setSuccess("Volunteer deleted successfully.");
    } catch (err) {
      console.error("Delete volunteer error:", err);

      setError(
        err.message || "Unable to delete volunteer."
      );
    }
  }

  // =====================================================
  // EMAIL
  // =====================================================

  function emailVolunteer(volunteer) {
    if (!volunteer?.email) {
      setError(
        "This volunteer does not have an email address."
      );
      return;
    }

    const subject = encodeURIComponent(
      "REHEMA Foundation Volunteer Application"
    );

    const body = encodeURIComponent(
      `Dear ${volunteer.name || "Volunteer"},

Thank you for your interest in volunteering with REHEMA Foundation.

We have received your volunteer application and would like to follow up with you.

Kind regards,
REHEMA Foundation`
    );

    window.location.href =
      `mailto:${volunteer.email}?subject=${subject}&body=${body}`;
  }

  // =====================================================
  // EXPORT CSV
  // =====================================================

  function exportVolunteers() {
    if (filteredVolunteers.length === 0) {
      setError("There are no volunteers to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Skills",
      "Message",
      "Status",
      "Submitted",
    ];

    const rows = filteredVolunteers.map((volunteer) => [
      volunteer.name || "",
      volunteer.email || "",
      volunteer.phone || "",
      volunteer.skills || "",
      volunteer.message || "",
      volunteer.status || "new",
      volunteer.createdAt
        ? new Date(volunteer.createdAt).toLocaleDateString()
        : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? "")
              .replace(/"/g, '""')
              .replace(/\r?\n|\r/g, " ");

            return `"${safeValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `rehema-volunteers-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setSuccess(
      `${filteredVolunteers.length} volunteer record(s) exported successfully.`
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================

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

  function formatStatus(status) {
    const value = status || "new";

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString();
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSortBy("newest");
  }

  function closeViewModal() {
    setSelectedVolunteer(null);
  }

  function closeEditModal() {
    if (saving) return;

    setEditingVolunteer(null);
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-form-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-form-header">

        <div>
          <p className="admin-eyebrow">
            COMMUNITY MANAGEMENT
          </p>

          <h1>Volunteers</h1>

          <p>
            Review, manage and communicate with people
            interested in volunteering with REHEMA.
          </p>
        </div>

        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={exportVolunteers}
        >
          ↓ Export CSV
        </button>

      </div>


      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="admin-alert admin-alert-success"
          role="status"
        >
          {success}
        </div>
      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="volunteer-stats">

        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            👥
          </div>

          <div>
            <span>Total Volunteers</span>
            <strong>{totalVolunteers}</strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            🆕
          </div>

          <div>
            <span>New Applications</span>
            <strong>{newVolunteers}</strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            📞
          </div>

          <div>
            <span>Contacted</span>
            <strong>{contactedVolunteers}</strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            ✓
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedVolunteers}</strong>
          </div>
        </div>


        <div className="volunteer-stat-card">
          <div className="volunteer-stat-icon">
            ✕
          </div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedVolunteers}</strong>
          </div>
        </div>

      </div>


      {/* =================================================
          MANAGEMENT CARD
      ================================================= */}

      <div className="admin-form-card">

        <div className="section-heading">

          <div>
            <h2>
              Volunteer Applications
            </h2>

            <p>
              Showing{" "}
              <strong>
                {filteredVolunteers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {volunteers.length}
              </strong>{" "}
              volunteer
              {volunteers.length === 1
                ? ""
                : "s"}
            </p>
          </div>

        </div>


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="volunteer-toolbar">

          <div className="volunteer-search">

            <span aria-hidden="true">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search name, email, phone, skills..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search volunteers"
            />

          </div>


          <select
            className="volunteer-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter volunteers by status"
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


          <select
            className="volunteer-filter"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            aria-label="Sort volunteers"
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="name">
              Name A–Z
            </option>
          </select>


          {(search ||
            statusFilter !== "all" ||
            sortBy !== "newest") && (

            <button
              type="button"
              className="admin-button admin-button-secondary"
              onClick={clearFilters}
            >
              Clear
            </button>

          )}

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="admin-empty-state">

            <div className="admin-loader"></div>

            <p>
              Loading volunteers...
            </p>

          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

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
                {volunteers.length === 0
                  ? "There are currently no volunteer applications."
                  : "Try changing your search or filter settings."}
              </p>

              {(search ||
                statusFilter !== "all" ||
                sortBy !== "newest") && (

                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              )}

            </div>

          )}


        {/* =================================================
            TABLE
        ================================================= */}

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
                        key={volunteer._id}
                      >

                        {/* VOLUNTEER */}

                        <td>

                          <div className="volunteer-person">

                            <div className="volunteer-avatar">
                              {(volunteer.name || "V")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {volunteer.name ||
                                  "Unnamed Volunteer"}
                              </strong>

                              <span>
                                {volunteer.email ||
                                  "No email"}
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
                          {formatDate(
                            volunteer.createdAt
                          )}
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
                            aria-label={`Status for ${
                              volunteer.name ||
                              "volunteer"
                            }`}
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
                              className="admin-button admin-button-secondary"
                              onClick={() =>
                                emailVolunteer(
                                  volunteer
                                )
                              }
                              disabled={!volunteer.email}
                              title={
                                volunteer.email
                                  ? "Email volunteer"
                                  : "No email address"
                              }
                            >
                              Email
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


      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {selectedVolunteer && (

        <div
          className="admin-modal-overlay"
          onClick={closeViewModal}
        >

          <div
            className="admin-modal admin-modal-volunteer"
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
                  {selectedVolunteer.name ||
                    "Volunteer"}
                </h2>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeViewModal}
                aria-label="Close volunteer details"
              >
                ×
              </button>

            </div>


            {/* PROFILE */}

            <div className="volunteer-profile-header">

              <div className="volunteer-avatar volunteer-avatar-large">

                {(selectedVolunteer.name || "V")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <h3>
                  {selectedVolunteer.name ||
                    "Unnamed Volunteer"}
                </h3>

                <span>
                  {selectedVolunteer.skills ||
                    "Volunteer"}
                </span>

              </div>

            </div>


            {/* DETAILS */}

            <div className="volunteer-detail-grid">

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {selectedVolunteer.email ||
                    "Not provided"}
                </strong>
              </div>


              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {selectedVolunteer.phone ||
                    "Not provided"}
                </strong>
              </div>


              <div>
                <span>
                  Skills
                </span>

                <strong>
                  {selectedVolunteer.skills ||
                    "Not provided"}
                </strong>
              </div>


              <div>
                <span>
                  Application Date
                </span>

                <strong>
                  {formatDate(
                    selectedVolunteer.createdAt
                  )}
                </strong>
              </div>


              <div>
                <span>
                  Current Status
                </span>

                <strong
                  className={`volunteer-status-text ${getStatusClass(
                    selectedVolunteer.status
                  )}`}
                >
                  {formatStatus(
                    selectedVolunteer.status
                  )}
                </strong>
              </div>

            </div>


            {/* MESSAGE */}

            <div className="volunteer-message">

              <span>
                Message
              </span>

              <p>
                {selectedVolunteer.message ||
                  "No message provided."}
              </p>

            </div>


            {/* MODAL ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => {

                  const volunteer =
                    selectedVolunteer;

                  setSelectedVolunteer(null);

                  openEdit(volunteer);

                }}
              >
                Edit Volunteer
              </button>


              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() =>
                  emailVolunteer(
                    selectedVolunteer
                  )
                }
                disabled={!selectedVolunteer.email}
              >
                Email Volunteer
              </button>


              <button
                type="button"
                className="admin-button admin-button-primary"
                onClick={closeViewModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingVolunteer && (

        <div
          className="admin-modal-overlay"
          onClick={closeEditModal}
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
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit volunteer"
              >
                ×
              </button>

            </div>


            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                {/* NAME */}

                <div className="admin-field">

                  <label htmlFor="volunteer-name">
                    Full Name
                  </label>

                  <input
                    id="volunteer-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="admin-field">

                  <label htmlFor="volunteer-email">
                    Email
                  </label>

                  <input
                    id="volunteer-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="admin-field">

                  <label htmlFor="volunteer-phone">
                    Phone
                  </label>

                  <input
                    id="volunteer-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                </div>


                {/* STATUS */}

                <div className="admin-field">

                  <label htmlFor="volunteer-status">
                    Status
                  </label>

                  <select
                    id="volunteer-status"
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


                {/* SKILLS */}

                <div className="admin-field admin-field-full">

                  <label htmlFor="volunteer-skills">
                    Skills
                  </label>

                  <input
                    id="volunteer-skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                  />

                </div>


                {/* MESSAGE */}

                <div className="admin-field admin-field-full">

                  <label htmlFor="volunteer-message">
                    Message
                  </label>

                  <textarea
                    id="volunteer-message"
                    name="message"
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* FORM ACTIONS */}

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
                  onClick={closeEditModal}
                  disabled={saving}
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