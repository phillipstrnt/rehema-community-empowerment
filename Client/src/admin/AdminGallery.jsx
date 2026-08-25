import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminGallery() {
  const emptyForm = {
    title: "",
    type: "image",
    url: "",
    caption: "",
    date: "",
  };

  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================
  // LOAD MEDIA
  // ============================

  async function loadMedia() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/gallery");

      setMedia(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  // ============================
  // INPUT
  // ============================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // ============================
  // ADD
  // ============================

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================
  // EDIT
  // ============================

  function openEditForm(item) {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      type: item.type || "image",
      url: item.url || "",
      caption: item.caption || "",
      date: item.date
        ? item.date.substring(0, 10)
        : "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================
  // SAVE
  // ============================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let saved;

      if (editingId) {
        saved = await api(
          `/gallery/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          }
        );

        setMedia((current) =>
          current.map((item) =>
            item._id === editingId
              ? saved
              : item
          )
        );

        setSuccess("Media updated successfully.");
      } else {
        saved = await api(
          "/gallery",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

        setMedia((current) => [
          saved,
          ...current,
        ]);

        setSuccess("Media added successfully.");
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
  // DELETE
  // ============================

  async function deleteMedia(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api(
        `/gallery/${id}`,
        {
          method: "DELETE",
        }
      );

      setMedia((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      setSuccess("Media deleted successfully.");

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
            MEDIA MANAGEMENT
          </p>

          <h1>
            Gallery
          </h1>

          <p>
            Manage REHEMA photos, videos and
            community outreach media.
          </p>

        </div>


        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={openAddForm}
        >
          + Add Media
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
                ? "Edit Media"
                : "Add New Media"}
            </h2>

            <p>
              Add a photo or video to the REHEMA
              media library.
            </p>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              <div className="admin-field">

                <label>
                  Media Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="REHEMA Medical Outreach"
                />

              </div>


              <div className="admin-field">

                <label>
                  Media Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >

                  <option value="image">
                    Image
                  </option>

                  <option value="video">
                    Video
                  </option>

                </select>

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Media URL
                </label>

                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Caption
                </label>

                <textarea
                  name="caption"
                  value={form.caption}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this photo or video..."
                />

              </div>


              <div className="admin-field">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
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
                  : editingId
                    ? "Update Media"
                    : "Save Media"}
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


      {/* MEDIA LIBRARY */}

      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Media Library
          </h2>

          <p>
            {media.length} item
            {media.length === 1 ? "" : "s"}
          </p>

        </div>


        {loading ? (

          <p>
            Loading media...
          </p>

        ) : media.length === 0 ? (

          <div className="admin-empty-state">

            <h3>
              No media yet
            </h3>

            <p>
              Click "Add Media" to upload your
              first image or video.
            </p>

          </div>

        ) : (

          <div className="admin-items">

            {media.map((item) => (

              <div
                className="admin-item-card"
                key={item._id}
              >

                <div className="admin-item-content">

                  {item.type === "image" &&
                    item.url && (
                      <img
                        src={item.url}
                        alt={item.title || "REHEMA media"}
                        className="admin-media-preview"
                      />
                    )
                  }

                  <h3>
                    {item.title ||
                      "Untitled Media"}
                  </h3>

                  <p>
                    {item.caption}
                  </p>

                  <span className="admin-status admin-status-active">
                    {item.type}
                  </span>

                </div>


                <div className="admin-item-actions">

                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={() =>
                      openEditForm(item)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="admin-button admin-button-danger"
                    onClick={() =>
                      deleteMedia(item._id)
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