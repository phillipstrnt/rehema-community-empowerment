import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
  organization: "",
  type: "NGO / Organization",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  logo: "",
  status: "Active",
};

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);


  /* =====================================================
     LOAD PARTNERS
  ===================================================== */

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/partners`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load partners."
        );
      }

      const data = await response.json();

      setPartners(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load partners. Please check that the server is running."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPartners();
  }, []);


  /* =====================================================
     FORM
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
  };


  const openEditForm = (partner) => {
    setEditingId(partner._id);

    setFormData({
      organization: partner.organization || "",
      type:
        partner.type ||
        "NGO / Organization",
      contactName:
        partner.contactName || "",
      email:
        partner.email || "",
      phone:
        partner.phone || "",
      website:
        partner.website || "",
      description:
        partner.description || "",
      logo:
        partner.logo || "",
      status:
        partner.status || "Active",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };


  /* =====================================================
     SAVE PARTNER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `${API_URL}/partners/${editingId}`
        : `${API_URL}/partners`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save partner."
        );
      }

      await fetchPartners();

      closeForm();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save partner."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this partner?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/partners/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete partner."
        );
      }

      setPartners((prev) =>
        prev.filter(
          (partner) =>
            partner._id !== id
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete partner."
      );
    }
  };


  /* =====================================================
     STATISTICS
  ===================================================== */

  const statistics = useMemo(() => {
    return {
      total: partners.length,

      active: partners.filter(
        (partner) =>
          partner.status === "Active"
      ).length,

      ngo: partners.filter(
        (partner) =>
          partner.type ===
          "NGO / Organization"
      ).length,

      corporate: partners.filter(
        (partner) =>
          partner.type === "Corporate"
      ).length,
    };
  }, [partners]);


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>
          <p className="admin-eyebrow">
            PARTNERS
          </p>

          <h1>
            Partners & Organizations
          </h1>

          <p className="admin-page-description">
            Manage the organizations,
            institutions and corporate
            partners working with REHEMA
            Foundation.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            showForm
              ? closeForm
              : openAddForm
          }
        >
          {showForm
            ? "Close Form"
            : "+ Add Partner"}
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🤝
          </div>

          <div>
            <span>Total Partners</span>

            <strong>
              {statistics.total}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✓
          </div>

          <div>
            <span>Active Partners</span>

            <strong>
              {statistics.active}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏢
          </div>

          <div>
            <span>NGO / Organizations</span>

            <strong>
              {statistics.ngo}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ◆
          </div>

          <div>
            <span>Corporate Partners</span>

            <strong>
              {statistics.corporate}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (
        <div className="admin-card partner-form-card">

          <div className="admin-card-header">

            <div>
              <p className="admin-eyebrow">
                {editingId
                  ? "EDIT PARTNER"
                  : "NEW PARTNER"}
              </p>

              <h2>
                {editingId
                  ? "Edit Partner"
                  : "Add Partner"}
              </h2>

              <p>
                Enter the organization's
                information below.
              </p>
            </div>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              {/* ORGANIZATION */}

              <div className="admin-form-group">

                <label htmlFor="organization">
                  Organization Name
                </label>

                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={
                    formData.organization
                  }
                  onChange={handleChange}
                  placeholder="e.g. UNICEF Uganda"
                  required
                />

              </div>


              {/* PARTNER TYPE */}

              <div className="admin-form-group">

                <label htmlFor="type">
                  Partner Type
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="NGO / Organization">
                    NGO / Organization
                  </option>

                  <option value="Corporate">
                    Corporate
                  </option>

                  <option value="Government">
                    Government
                  </option>

                  <option value="Community">
                    Community
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* CONTACT PERSON */}

              <div className="admin-form-group">

                <label htmlFor="contactName">
                  Contact Person
                </label>

                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={
                    formData.contactName
                  }
                  onChange={handleChange}
                  placeholder="Full name"
                />

              </div>


              {/* EMAIL */}

              <div className="admin-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="partner@example.org"
                />

              </div>


              {/* PHONE */}

              <div className="admin-form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+256..."
                />

              </div>


              {/* WEBSITE */}

              <div className="admin-form-group">

                <label htmlFor="website">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={
                    formData.website
                  }
                  onChange={handleChange}
                  placeholder="https://example.org"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="admin-form-group admin-form-full">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Describe the partnership..."
                  rows="5"
                />

              </div>


              {/* LOGO */}

              <div className="admin-form-group admin-form-full">

                <label htmlFor="logo">
                  Logo URL
                </label>

                <input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <small>
                  Cloudinary logo upload can
                  be connected here next.
                </small>

              </div>


              {/* STATUS */}

              <div className="admin-form-group">

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Partner"
                  : "Save Partner"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =================================================
          PARTNERS TABLE
      ================================================= */}

      <div className="admin-card">

        <div className="admin-card-header">

          <div>
            <p className="admin-eyebrow">
              DIRECTORY
            </p>

            <h2>
              Partner Organizations
            </h2>

            <p>
              View and manage all REHEMA
              Foundation partners.
            </p>
          </div>

        </div>


        {loading ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ⏳
            </div>

            <h3>
              Loading Partners...
            </h3>

            <p>
              Please wait while we retrieve
              the partner directory.
            </p>

          </div>

        ) : partners.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              🤝
            </div>

            <h3>
              No Partners Yet
            </h3>

            <p>
              Add your first organization or
              partner to build the directory.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddForm}
            >
              + Add Partner
            </button>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Organization
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Website
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date Added
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {partners.map(
                  (partner) => (

                    <tr
                      key={partner._id}
                    >

                      {/* ORGANIZATION */}

                      <td>

                        <div className="partner-table-name">

                          {partner.logo ? (

                            <img
                              src={
                                partner.logo
                              }
                              alt={
                                partner.organization
                              }
                              className="partner-logo"
                            />

                          ) : (

                            <div className="partner-logo-placeholder">
                              {partner.organization
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                          )}

                          <div>

                            <strong>
                              {
                                partner.organization
                              }
                            </strong>

                            {partner.description && (
                              <div className="admin-table-description">
                                {
                                  partner.description
                                }
                              </div>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="partner-type-badge">
                          {partner.type ||
                            "—"}
                        </span>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <strong>
                          {
                            partner.contactName ||
                            "—"
                          }
                        </strong>

                        {partner.email && (
                          <div>
                            {
                              partner.email
                            }
                          </div>
                        )}

                        {partner.phone && (
                          <div>
                            {
                              partner.phone
                            }
                          </div>
                        )}

                      </td>


                      {/* WEBSITE */}

                      <td>

                        {partner.website ? (

                          <a
                            href={
                              partner.website
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visit Website
                          </a>

                        ) : (
                          "—"
                        )}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status ${
                            partner.status ===
                            "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {
                            partner.status
                          }
                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        {partner.createdAt
                          ? new Date(
                              partner.createdAt
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-table-actions">

                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() =>
                              openEditForm(
                                partner
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-danger-button"
                            onClick={() =>
                              handleDelete(
                                partner._id
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

    </div>
  );
}