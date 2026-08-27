import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminPrograms() {
  const emptyForm = {
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    active: true,
  };

  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================
  // LOAD PROGRAMS
  // ============================

  async function loadPrograms() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/programs");

      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  // ============================
  // HANDLE INPUT
  // ============================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ============================
  // ADD PROGRAM
  // ============================

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================
  // EDIT PROGRAM
  // ============================

  function openEditForm(program) {
    setEditingId(program._id);

    setForm({
      title: program.title || "",
      slug: program.slug || "",
      shortDescription: program.shortDescription || "",
      description: program.description || "",
      image: program.image || "",
      active: program.active ?? true,
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============================
  // CLOSE FORM
  // ============================

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  // ============================
  // SAVE PROGRAM
  // ============================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let savedProgram;

      if (editingId) {
        savedProgram = await api(`/programs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setPrograms((current) =>
          current.map((program) =>
            program._id === editingId
              ? savedProgram
              : program
          )
        );

        setSuccess("Program updated successfully.");
      } else {
        savedProgram = await api("/programs", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setPrograms((current) => [
          savedProgram,
          ...current,
        ]);

        setSuccess("Program added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  // ============================
  // DELETE PROGRAM
  // ============================

  async function deleteProgram(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api(`/programs/${id}`, {
        method: "DELETE",
      });

      setPrograms((current) =>
        current.filter((program) => program._id !== id)
      );

      setSuccess("Program deleted successfully.");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className="admin-form-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="admin-form-header">

        <div>
          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>
            Programs
          </h1>

          <p>
            Manage REHEMA's health programs,
            community initiatives and services.
          </p>
        </div>

        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={openAddForm}
        >
          + Add Program
        </button>

      </div>


      {/* ==================================
          MESSAGES
      ================================== */}

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


      {/* ==================================
          ADD / EDIT FORM
      ================================== */}

      {showForm && (
        <div className="admin-form-card">

          <div className="section-heading">

            <div>
              <p className="admin-eyebrow">
                {editingId
                  ? "EDIT PROGRAM"
                  : "NEW PROGRAM"}
              </p>

              <h2>
                {editingId
                  ? "Edit Program"
                  : "Add New Program"}
              </h2>

              <p>
                {editingId
                  ? "Update the program information below."
                  : "Add a new REHEMA program to your website."}
              </p>
            </div>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              {/* PROGRAM NAME */}

              <div className="admin-field">

                <label htmlFor="program-title">
                  Program Name
                </label>

                <input
                  id="program-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Medical Camps"
                  required
                />

              </div>


              {/* SLUG */}

              <div className="admin-field">

                <label htmlFor="program-slug">
                  Slug
                </label>

                <input
                  id="program-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="medical-camps"
                  required
                />

                <small>
                  Used for the program's web address.
                </small>

              </div>


              {/* SHORT DESCRIPTION */}

              <div className="admin-field admin-field-full">

                <label htmlFor="program-short-description">
                  Short Description
                </label>

                <input
                  id="program-short-description"
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description of the program"
                />

              </div>


              {/* FULL DESCRIPTION */}

              <div className="admin-field admin-field-full">

                <label htmlFor="program-description">
                  Full Description
                </label>

                <textarea
                  id="program-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Describe the program, its goals, activities and community impact..."
                />

              </div>


              {/* IMAGE */}

              <div className="admin-field admin-field-full">

                <label htmlFor="program-image">
                  Program Image
                </label>

                <input
                  id="program-image"
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <small>
                  Paste the Cloudinary image URL for this program.
                </small>

              </div>


              {/* ACTIVE */}

              <div className="admin-field admin-field-full">

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />

                  <span>
                    Make this program active on the website
                  </span>

                </label>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-button admin-button-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Program"
                    : "Save Program"}
              </button>

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ==================================
          PROGRAM LIBRARY
      ================================== */}

      <div className="admin-form-card">

        <div className="section-heading">

          <div>
            <p className="admin-eyebrow">
              PROGRAM LIBRARY
            </p>

            <h2>
              Existing Programs
            </h2>

            <p>
              {programs.length} program
              {programs.length === 1 ? "" : "s"} in your
              content library.
            </p>
          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-empty-state">

            <div className="admin-loader"></div>

            <p>
              Loading programs...
            </p>

          </div>
        )}


        {/* EMPTY */}

        {!loading && programs.length === 0 && (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📋
            </div>

            <h3>
              No programs yet
            </h3>

            <p>
              Create your first REHEMA program
              using the button above.
            </p>

            <button
              type="button"
              className="admin-button admin-button-primary"
              onClick={openAddForm}
            >
              + Add Program
            </button>

          </div>
        )}


        {/* PROGRAMS */}

        {!loading && programs.length > 0 && (

          <div className="admin-items">

            {programs.map((program) => (

              <div
                className="admin-item-card"
                key={program._id}
              >

                {/* IMAGE */}

                {program.image && (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="admin-media-preview"
                  />
                )}


                {/* CONTENT */}

                <div className="admin-item-content">

                  <h3>
                    {program.title}
                  </h3>

                  {program.shortDescription && (
                    <p>
                      {program.shortDescription}
                    </p>
                  )}

                  <span
                    className={
                      program.active
                        ? "admin-status admin-status-active"
                        : "admin-status"
                    }
                  >
                    {program.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                {/* ACTIONS */}

                <div className="admin-item-actions">

                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={() =>
                      openEditForm(program)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-button admin-button-danger"
                    onClick={() =>
                      deleteProgram(program._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}