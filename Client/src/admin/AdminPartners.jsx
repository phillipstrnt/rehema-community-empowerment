import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
  organization: "",
  partnerType: "NGO / Organization",
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

  const [formData, setFormData] = useState(emptyForm);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  /* =====================================================
     FETCH PARTNERS
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

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load partners. Please make sure the server is running."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPartners();
  }, []);


  /* =====================================================
     FORM HANDLING
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
      partnerType:
        partner.partnerType ||
        "NGO / Organization",
      contactName: partner.contactName || "",
      email: partner.email || "",
      phone: partner.phone || "",
      website: partner.website || "",
      description: partner.description || "",
      logo: partner.logo || "",
      status: partner.status || "Active",
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
          "Content-Type": "application/json",
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

      if (editingId) {
        setPartners((prev) =>
          prev.map((partner) =>
            partner._id === editingId
              ? data
              : partner
          )
        );
      } else {
        setPartners((prev) => [
          data,
          ...prev,
        ]);
      }

      closeForm();

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
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

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Failed to delete partner."
      );
    }
  };


  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        partner.organization
          ?.toLowerCase()
          .includes(searchText) ||
        partner.contactName
          ?.toLowerCase()
          .includes(searchText) ||
        partner.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        partner.partnerType ===
          typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        partner.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    partners,
    search,
    typeFilter,
    statusFilter,
  ]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalPartners =
    partners.length;

  const activePartners =
    partners.filter(
      (partner) =>
        partner.status === "Active"
    ).length;

  const ngoPartners =
    partners.filter(
      (partner) =>
        partner.partnerType ===
        "NGO / Organization"
    ).length;

  const corporatePartners =
    partners.filter(
      (partner) =>
        partner.partnerType ===
        "Corporate"
    ).length;


  return (
    <div className="admin-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>
          <div className="admin-eyebrow">
            PARTNERS
          </div>

          <h1>
            Partners & Organizations
          </h1>

          <p>
            Manage organizations, companies,
            donors and partners supporting
            REHEMA Foundation.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          + Add Partner
        </button>

      </div>


      {/* ERROR */}

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
            <span>
              Total Partners
            </span>

            <strong>
              {totalPartners}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✓
          </div>

          <div>
            <span>
              Active Partners
            </span>

            <strong>
              {activePartners}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ◎
          </div>

          <div>
            <span>
              NGO / Organizations
            </span>

            <strong>
              {ngoPartners}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ◈
          </div>

          <div>
            <span>
              Corporate Partners
            </span>

            <strong>
              {corporatePartners}
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
              <div className="admin-eyebrow">
                {editingId
                  ? "EDIT PARTNER"
                  : "NEW PARTNER"}
              </div>

              <h2>
                {editingId
                  ? "Edit Partner"
                  : "Add Partner"}
              </h2>

              <p>
                Add organization and
                partnership information.
              </p>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={closeForm}
            >
              Cancel
            </button>

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

                <label htmlFor="partnerType">
                  Partner Type
                </label>

                <select
                  id="partnerType"
                  name="partnerType"
                  value={
                    formData.partnerType
                  }
                  onChange={handleChange}
                >

                  <option>
                    NGO / Organization
                  </option>

                  <option>
                    Corporate
                  </option>

                  <option>
                    Government
                  </option>

                  <option>
                    Community
                  </option>

                  <option>
                    Donor
                  </option>

                  <option>
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
                  value={
                    formData.email
                  }
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
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                  placeholder="+256 700 000 000"
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
                  Partnership Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Describe the partnership and how the organization supports REHEMA Foundation..."
                  rows="5"
                />

              </div>


              {/* LOGO */}

              <div className="admin-form-group">

                <label htmlFor="logo">
                  Logo URL
                </label>

                <input
                  id="logo"
                  name="logo"
                  type="url"
                  value={
                    formData.logo
                  }
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <small>
                  You can add the Cloudinary
                  logo URL here.
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


            {/* FORM ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeForm}
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
            <div className="admin-eyebrow">
              PARTNER DIRECTORY
            </div>

            <h2>
              Partners & Organizations
            </h2>

            <p>
              {filteredPartners.length}
              {" "}
              partner
              {filteredPartners.length !== 1
                ? "s"
                : ""}
              {" "}displayed
            </p>
          </div>

        </div>


        {/* FILTERS */}

        <div className="partner-toolbar">

          <div className="partner-search">

            <span>⌕</span>

            <input
              type="search"
              placeholder="Search partners..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Types
            </option>

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

            <option value="Donor">
              Donor
            </option>

          </select>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ◌
            </div>

            <h3>
              Loading Partners...
            </h3>

            <p>
              Retrieving partner information.
            </p>

          </div>

        ) : filteredPartners.length === 0 ? (

          /* EMPTY */

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              🤝
            </div>

            <h3>
              {partners.length === 0
                ? "No Partners Yet"
                : "No Matching Partners"}
            </h3>

            <p>
              {partners.length === 0
                ? "Add your first partner organization to get started."
                : "Try adjusting your search or filters."}
            </p>

            {partners.length === 0 && (
              <button
                type="button"
                className="admin-primary-button"
                onClick={openAddForm}
              >
                + Add Partner
              </button>
            )}

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table partner-table">

              <thead>

                <tr>

                  <th>
                    Partner
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Contact Person
                  </th>

                  <th>
                    Contact
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

                {filteredPartners.map(
                  (partner) => (

                    <tr
                      key={partner._id}
                    >

                      {/* PARTNER */}

                      <td>

                        <div className="partner-name-cell">

                          <div className="partner-logo">

                            {partner.logo ? (

                              <img
                                src={
                                  partner.logo
                                }
                                alt={
                                  partner.organization
                                }
                              />

                            ) : (

                              <span>
                                {partner.organization
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>

                            )}

                          </div>


                          <div>

                            <strong>
                              {
                                partner.organization
                              }
                            </strong>

                            {partner.website && (
                              <a
                                href={
                                  partner.website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="partner-website"
                              >
                                Visit website
                              </a>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* TYPE */}

                      <td>

                        <span className="partner-type">
                          {
                            partner.partnerType
                          }
                        </span>

                      </td>


                      {/* CONTACT PERSON */}

                      <td>

                        {partner.contactName ||
                          "—"}

                      </td>


                      {/* CONTACT */}

                      <td>

                        <div className="partner-contact">

                          <span>
                            {partner.email ||
                              "—"}
                          </span>

                          <span>
                            {partner.phone ||
                              "—"}
                          </span>

                        </div>

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
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-table-actions">

                          <button
                            type="button"
                            className="admin-secondary-button admin-small-button"
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