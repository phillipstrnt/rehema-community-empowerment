
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../utils/api";

import "./AdminPartners.css";


/* =========================================================
   EMPTY FORM
========================================================= */

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


/* =========================================================
   ADMIN PARTNERS
========================================================= */

export default function AdminPartners() {

  /* =======================================================
     STATE
  ======================================================= */

  const [partners, setPartners] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      ...emptyForm,
    });


  /* =======================================================
     LOAD PARTNERS
  ======================================================= */

  const fetchPartners = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await api("/partners");


      /*
        Support either:

        [
          {...},
          {...}
        ]

        OR:

        {
          partners: [...]
        }

        OR:

        {
          data: [...]
        }
      */

      let partnerList = [];

      if (Array.isArray(data)) {

        partnerList = data;

      } else if (
        Array.isArray(data.partners)
      ) {

        partnerList = data.partners;

      } else if (
        Array.isArray(data.data)
      ) {

        partnerList = data.data;

      }


      setPartners(partnerList);

    } catch (err) {

      console.error(
        "Fetch partners error:",
        err
      );

      setError(
        err.message ||
        "Unable to load partners."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    fetchPartners();

  }, []);


  /* =======================================================
     FORM INPUT
  ======================================================= */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
      Clear previous error when
      user starts editing again.
    */

    if (error) {
      setError("");
    }
  };


  /* =======================================================
     OPEN ADD FORM
  ======================================================= */

  const openAddForm = () => {

    setEditingId(null);

    setFormData({
      ...emptyForm,
    });

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const openEditForm = (partner) => {

    setEditingId(
      partner._id
    );

    setFormData({

      organization:
        partner.organization || "",

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

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const closeForm = () => {

    if (saving) {
      return;
    }

    setShowForm(false);

    setEditingId(null);

    setFormData({
      ...emptyForm,
    });

    setError("");
  };


  /* =======================================================
     SAVE PARTNER
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (saving) {
      return;
    }

    setError("");


    /* -----------------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------------- */

    if (
      !formData.organization.trim()
    ) {

      setError(
        "Organization name is required."
      );

      return;
    }


    try {

      setSaving(true);


      /* ---------------------------------------------------
         CREATE
      --------------------------------------------------- */

      if (!editingId) {

        await api(
          "/partners",
          {
            method: "POST",

            body: JSON.stringify(
              formData
            ),
          }
        );

      }


      /* ---------------------------------------------------
         UPDATE
      --------------------------------------------------- */

      else {

        await api(
          `/partners/${editingId}`,
          {
            method: "PUT",

            body: JSON.stringify(
              formData
            ),
          }
        );

      }


      /* ---------------------------------------------------
         REFRESH LIST
      --------------------------------------------------- */

      await fetchPartners();


      /* ---------------------------------------------------
         CLOSE FORM
      --------------------------------------------------- */

      setShowForm(false);

      setEditingId(null);

      setFormData({
        ...emptyForm,
      });


    } catch (err) {

      console.error(
        "Save partner error:",
        err
      );

      setError(
        err.message ||
        "Failed to save partner."
      );

    } finally {

      setSaving(false);

    }
  };


  /* =======================================================
     DELETE PARTNER
  ======================================================= */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this partner? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      setError("");


      await api(
        `/partners/${id}`,
        {
          method: "DELETE",
        }
      );


      /*
        Remove immediately from UI.
      */

      setPartners((previous) =>
        previous.filter(
          (partner) =>
            partner._id !== id
        )
      );


    } catch (err) {

      console.error(
        "Delete partner error:",
        err
      );

      setError(
        err.message ||
        "Failed to delete partner."
      );

    } finally {

      setDeletingId(null);

    }
  };


  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(() => {

    const active =
      partners.filter(
        (partner) =>
          partner.status === "Active"
      );

    const ngo =
      partners.filter(
        (partner) =>
          partner.type ===
          "NGO / Organization"
      );

    const corporate =
      partners.filter(
        (partner) =>
          partner.type ===
          "Corporate"
      );

    return {

      total:
        partners.length,

      active:
        active.length,

      ngo:
        ngo.length,

      corporate:
        corporate.length,

    };

  }, [partners]);


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="admin-page">


      {/* ===================================================
          PAGE HEADER
      =================================================== */}

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


        <div
          className="admin-page-header-actions"
        >

          <button
            type="button"
            className="admin-secondary-button"
            onClick={fetchPartners}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>


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

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >

          <strong>
            Attention:
          </strong>{" "}

          {error}

        </div>

      )}


      {/* ===================================================
          STATISTICS
      =================================================== */}

      <div className="admin-stats-grid">


        {/* TOTAL */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🤝
          </div>

          <div>

            <span>
              Total Partners
            </span>

            <strong>
              {statistics.total}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Active Partners
            </span>

            <strong>
              {statistics.active}
            </strong>

          </div>

        </div>


        {/* NGO */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏢
          </div>

          <div>

            <span>
              NGO / Organizations
            </span>

            <strong>
              {statistics.ngo}
            </strong>

          </div>

        </div>


        {/* CORPORATE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ◆
          </div>

          <div>

            <span>
              Corporate Partners
            </span>

            <strong>
              {statistics.corporate}
            </strong>

          </div>

        </div>

      </div>


      {/* ===================================================
          ADD / EDIT FORM
      =================================================== */}

      {showForm && (

        <div
          className="admin-card partner-form-card"
        >


          {/* FORM HEADER */}

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


          {/* FORM */}

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
                  disabled={saving}
                />

              </div>


              {/* TYPE */}

              <div className="admin-form-group">

                <label htmlFor="type">
                  Partner Type
                </label>

                <select
                  id="type"
                  name="type"
                  value={
                    formData.type
                  }
                  onChange={handleChange}
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  placeholder="+256..."
                  disabled={saving}
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
                  disabled={saving}
                />

              </div>


              {/* DESCRIPTION */}

              <div
                className="admin-form-group admin-form-full"
              >

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
                  disabled={saving}
                />

              </div>


              {/* LOGO */}

              <div
                className="admin-form-group admin-form-full"
              >

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
                  disabled={saving}
                />

                <small>
                  You can connect Cloudinary
                  image uploads here later.
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
                  disabled={saving}
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


      {/* ===================================================
          PARTNERS DIRECTORY
      =================================================== */}

      <div className="admin-card">


        {/* TABLE HEADER */}

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


        {/* =================================================
            LOADING
        ================================================= */}

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

        )


        /* =================================================
           EMPTY
        ================================================= */

        : partners.length === 0 ? (

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

        )


        /* =================================================
           TABLE
        ================================================= */

        : (

          <div className="admin-table-wrapper">

            <table className="admin-table">


              {/* TABLE HEADER */}

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


              {/* TABLE BODY */}

              <tbody>

                {partners.map(
                  (partner) => (

                    <tr
                      key={
                        partner._id
                      }
                    >


                      {/* ORGANIZATION */}

                      <td>

                        <div
                          className="partner-table-name"
                        >

                          {partner.logo ? (

                            <img
                              src={
                                partner.logo
                              }
                              alt={
                                partner.organization ||
                                "Partner logo"
                              }
                              className="partner-logo"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div
                              className="partner-logo-placeholder"
                            >

                              {partner.organization
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "P"}

                            </div>

                          )}


                          <div>

                            <strong>
                              {
                                partner.organization ||
                                "Unnamed Partner"
                              }
                            </strong>


                            {partner.description && (

                              <div
                                className="admin-table-description"
                              >
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

                        <span
                          className="partner-type-badge"
                        >
                          {
                            partner.type ||
                            "—"
                          }
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
                            rel="noopener noreferrer"
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
                            partner.status ||
                            "Inactive"
                          }

                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        {
                          formatDate(
                            partner.createdAt
                          )
                        }

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div
                          className="admin-table-actions"
                        >

                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() =>
                              openEditForm(
                                partner
                              )
                            }
                            disabled={
                              deletingId !==
                              null
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
                            disabled={
                              deletingId ===
                              partner._id
                            }
                          >

                            {deletingId ===
                            partner._id
                              ? "Deleting..."
                              : "Delete"}

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