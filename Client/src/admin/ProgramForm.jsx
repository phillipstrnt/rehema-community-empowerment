import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const emptyForm = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  image: "",
  active: true,
};

export default function ProgramForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadProgram() {
      
      try {
        setLoading(true);

        const programs = await api("/programs");
        const program = programs.find(
          (item) => item._id === id
        );

        if (!program) {
          throw new Error("Program not found.");
        }

        setForm({
          title: program.title || "",
          slug: program.slug || "",
          shortDescription: program.shortDescription || "",
          description: program.description || "",
          image: program.image || "",
          active: program.active ?? true,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    }

    loadProgram();
  }, [id]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

  }


  async function handleSubmit(event) {

    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (id) {
        await api(`/programs/${id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await api("/programs", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      navigate("/admin/programs");
    } catch (err) {
      setError(err.message);
    } finally {

      setSaving(false);

    }
  }

  if (loading) {
    return (
      <div className="admin-form-page">
        <p>Loading program...</p>
      </div>
    );
  }


  return (
    <div className="admin-editor-page">

      <div className="admin-editor-header">

        <p className="admin-eyebrow">
          CONTENT MANAGEMENT
        </p>

        <h1>
          {id ? "Edit Program" : "Create Program"}
        </h1>

        <p>
          {id
            ? "Update the details of this REHEMA program."
            : "Create and publish a new REHEMA program."}
        </p>

      </div>


      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}


      <form
        className="admin-editor-layout"
        onSubmit={handleSubmit}
      >

        {/* MAIN CONTENT */}

        <div className="admin-editor-main">

          <div className="admin-editor-card">

            <div className="admin-editor-section-heading">

              <h2>
                Program Information
              </h2>

              <p>
                Provide the main information about this program.
              </p>

            </div>


            <div className="admin-editor-fields">

              <div className="admin-editor-field">

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


              <div className="admin-editor-field">

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

                <span className="admin-editor-help">
                  Example: medical-camps
                </span>

              </div>


              <div className="admin-editor-field admin-editor-field-full">

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


              <div className="admin-editor-field admin-editor-field-full">

                <label>
                  Full Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="9"
                  placeholder="Describe this program, its objectives, activities and impact..."
                />

              </div>


              <div className="admin-editor-field admin-editor-field-full">

                <label>
                  Featured Image
                </label>

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <span className="admin-editor-help">
                  Add the image URL that should represent this program.
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* SIDEBAR */}

        <aside className="admin-editor-sidebar">

          <div className="admin-editor-card">

            <h2>
              Publish
            </h2>


            <div className="admin-publish-status">

              <span className="admin-status-dot"></span>

              {form.active ? "Active" : "Inactive"}

            </div>


            <label className="admin-publish-checkbox">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span>
                Publish this program
              </span>

            </label>


            <button
              type="submit"
              className="admin-editor-publish-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : id
                  ? "Update Program"
                  : "Publish Program"}
            </button>


            <button
              type="button"
              className="admin-editor-cancel-button"
              onClick={() => navigate("/admin/programs")}
            >
              Cancel
            </button>

          </div>

        </aside>

      </form>

    </div>
  );

}