import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const emptyForm = {
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    active: true,
  };

  const [form, setForm] = useState(emptyForm);


  // ============================
  // LOAD PROGRAMS
  // ============================

  async function loadPrograms() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/programs");

      setPrograms(data);
    } catch (error) {
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

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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
  }


  // ============================
  // SAVE PROGRAM
  // ============================

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    setError("");

    setSuccess("");

    try {
      let savedProgram;

      if (editingId) {
        savedProgram = await api(
          `/programs/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          }
        );

        setPrograms((current) =>
          current.map((program) =>
            program._id === editingId
              ? savedProgram
              : program
          )
        );

        setSuccess("Program updated successfully.");
      } else {
        savedProgram = await api(
          "/programs",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

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
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api(
        `/programs/${id}`,
        {
          method: "DELETE",
        }
      );

      setPrograms((current) =>
        current.filter(
          (program) => program._id !== id
        )
      );

      setSuccess("Program deleted successfully.");

    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <div className="admin-form-page">

      {/* HEADER */}

      <div className="admin-form-header">

        <div>
          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>
            Programs
          </h1>

          <p>
            Manage REHEMA's health programs and
            community initiatives.
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


      {/* MESSAGES */}

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


      {/* FORM */}

      {showForm && (
        <div className="admin-form-card">

          <div className="section-heading">

            <h2>
              {editingId
                ? "Edit Program"
                : "Add New Program"}
            </h2>

            <p>
              Enter the program information below.
            </p>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              <div className="admin-field">

                <label>
                  Program Name
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Medical Camps"
                  required
                />

              </div>


              <div className="admin-field">

                <label>
                  Slug
                </label>

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="medical-camps"
                  required
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Short Description
                </label>

                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description of the program"
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Full Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe this program..."
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Image URL
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              <div className="admin-field">

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />

                  <span>
                    Active Program
                  </span>

                </label>

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
                  : editingId
                    ? "Update Program"
                    : "Save Program"}
              </button>


              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* PROGRAM LIST */}

      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Existing Programs
          </h2>

          <p>
            {programs.length} program
            {programs.length === 1 ? "" : "s"}
          </p>

        </div>


        {loading ? (

          <p>
            Loading programs...
          </p>

        ) : programs.length === 0 ? (

          <div className="admin-empty-state">

            <h3>
              No programs yet
            </h3>

            <p>
              Click "Add Program" to create your
              first program.
            </p>

          </div>

        ) : (

          <div className="admin-items">

            {programs.map((program) => (

              <div
                className="admin-item-card"
                key={program._id}
              >

                <div className="admin-item-content">

                  <h3>
                    {program.title}
                  </h3>

                  <p>
                    {program.shortDescription}
                  </p>

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