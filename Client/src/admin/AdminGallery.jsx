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

  async function loadMedia() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/gallery");

      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let saved;

      if (editingId) {
        saved = await api(`/gallery/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setMedia((current) =>
          current.map((item) =>
            item._id === editingId
              ? saved
              : item
          )
        );

        setSuccess("Media updated successfully.");
      } else {
        saved = await api("/gallery", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setMedia((current) => [
          saved,
          ...current,
        ]);

        setSuccess("Media added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedia(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api(`/gallery/${id}`, {
        method: "DELETE",
      });

      setMedia((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      setSuccess(
        "Media deleted successfully."
      );

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <section className="gallery-admin-page">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="gallery-admin-header">

        <div className="gallery-admin-header-text">

          <span className="gallery-admin-eyebrow">
            MEDIA MANAGEMENT
          </span>

          <h1>
            Gallery
          </h1>

          <p>
            Manage REHEMA photos, videos and
            community outreach media.
          </p>

        </div>

        {!showForm && (
          <button
            type="button"
            className="gallery-add-button"
            onClick={openAddForm}
          >
            <span className="gallery-button-icon">
              +
            </span>

            Add Media
          </button>
        )}

      </div>


      {/* =========================================
          ALERTS
      ========================================== */}

      {error && (
        <div className="gallery-alert gallery-alert-error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="gallery-alert gallery-alert-success">
          <span>✓</span>
          {success}
        </div>
      )}


      {/* =========================================
          ADD / EDIT FORM
      ========================================== */}

      {showForm && (

        <div className="gallery-editor-card">

          <div className="gallery-editor-header">

            <div>
              <span className="gallery-section-label">
                {editingId
                  ? "EDIT MEDIA"
                  : "NEW MEDIA"}
              </span>

              <h2>
                {editingId
                  ? "Edit Media"
                  : "Add New Media"}
              </h2>

              <p>
                Add details about the photo or
                video you want to display in the
                REHEMA gallery.
              </p>
            </div>

            <button
              type="button"
              className="gallery-close-button"
              onClick={closeForm}
              aria-label="Close form"
            >
              ×
            </button>

          </div>


          <form
            className="gallery-editor-form"
            onSubmit={handleSubmit}
          >

            {/* LEFT SIDE */}

            <div className="gallery-form-main">

              <div className="gallery-form-section">

                <div className="gallery-form-section-title">
                  <span>01</span>
                  <div>
                    <h3>
                      Media Information
                    </h3>

                    <p>
                      Provide the basic information
                      about this media.
                    </p>
                  </div>
                </div>


                <div className="gallery-form-grid">

                  <div className="gallery-field gallery-field-full">

                    <label htmlFor="gallery-title">
                      Media Title
                    </label>

                    <input
                      id="gallery-title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. REHEMA Medical Outreach"
                    />

                  </div>


                  <div className="gallery-field">

                    <label htmlFor="gallery-type">
                      Media Type
                    </label>

                    <select
                      id="gallery-type"
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


                  <div className="gallery-field">

                    <label htmlFor="gallery-date">
                      Date
                    </label>

                    <input
                      id="gallery-date"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="gallery-field gallery-field-full">

                    <label htmlFor="gallery-url">
                      Media URL
                      <span className="required-label">
                        *
                      </span>
                    </label>

                    <input
                      id="gallery-url"
                      type="url"
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      placeholder="https://res.cloudinary.com/..."
                      required
                    />

                    <small>
                      Paste the public URL of the
                      image or video.
                    </small>

                  </div>


                  <div className="gallery-field gallery-field-full">

                    <label htmlFor="gallery-caption">
                      Caption
                    </label>

                    <textarea
                      id="gallery-caption"
                      name="caption"
                      value={form.caption}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Describe what is happening in this photo or video..."
                    />

                    <small>
                      A short description helps
                      visitors understand the media.
                    </small>

                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT SIDE */}

            <aside className="gallery-form-preview">

              <div className="gallery-preview-header">

                <div>
                  <span>
                    PREVIEW
                  </span>

                  <h3>
                    Media Preview
                  </h3>
                </div>

              </div>


              <div className="gallery-preview-box">

                {form.url ? (

                  form.type === "image" ? (

                    <img
                      src={form.url}
                      alt={
                        form.title ||
                        "Media preview"
                      }
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="gallery-video-preview">

                      <span>
                        ▶
                      </span>

                      <p>
                        Video selected
                      </p>

                    </div>

                  )

                ) : (

                  <div className="gallery-preview-empty">

                    <span>
                      +
                    </span>

                    <p>
                      Your media preview
                      will appear here
                    </p>

                  </div>

                )}

              </div>


              <div className="gallery-preview-details">

                <div>
                  <span>
                    TYPE
                  </span>

                  <strong>
                    {form.type === "image"
                      ? "Image"
                      : "Video"}
                  </strong>
                </div>

                <div>
                  <span>
                    DATE
                  </span>

                  <strong>
                    {form.date || "Not set"}
                  </strong>
                </div>

              </div>

            </aside>


            {/* FORM ACTIONS */}

            <div className="gallery-form-actions">

              <button
                type="button"
                className="gallery-cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="gallery-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Media"
                    : "Save Media"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =========================================
          MEDIA LIBRARY
      ========================================== */}

      <div className="gallery-library">

        <div className="gallery-library-header">

          <div>

            <span className="gallery-section-label">
              YOUR CONTENT
            </span>

            <h2>
              Media Library
            </h2>

            <p>
              {media.length}{" "}
              {media.length === 1
                ? "item"
                : "items"}{" "}
              in your gallery.
            </p>

          </div>

          {!showForm && (
            <button
              type="button"
              className="gallery-secondary-add"
              onClick={openAddForm}
            >
              + Add Media
            </button>
          )}

        </div>


        {loading ? (

          <div className="gallery-loading">
            <div className="gallery-spinner"></div>
            <p>
              Loading media library...
            </p>
          </div>

        ) : media.length === 0 ? (

          <div className="gallery-empty">

            <div className="gallery-empty-icon">
              +
            </div>

            <h3>
              No media yet
            </h3>

            <p>
              Add your first photo or video to
              start building the REHEMA gallery.
            </p>

            <button
              type="button"
              className="gallery-add-button"
              onClick={openAddForm}
            >
              + Add Your First Media
            </button>

          </div>

        ) : (

          <div className="gallery-media-grid">

            {media.map((item) => (

              <article
                className="gallery-media-card"
                key={item._id}
              >

                <div className="gallery-media-image">

                  {item.type === "image" &&
                  item.url ? (

                    <img
                      src={item.url}
                      alt={
                        item.title ||
                        "REHEMA media"
                      }
                    />

                  ) : (

                    <div className="gallery-video-card">

                      <span>
                        ▶
                      </span>

                      <small>
                        VIDEO
                      </small>

                    </div>

                  )}

                  <span className="gallery-media-type">
                    {item.type}
                  </span>

                </div>


                <div className="gallery-media-body">

                  <h3>
                    {item.title ||
                      "Untitled Media"}
                  </h3>

                  {item.caption && (
                    <p>
                      {item.caption}
                    </p>
                  )}

                  {item.date && (
                    <span className="gallery-media-date">
                      {new Date(
                        item.date
                      ).toLocaleDateString()}
                    </span>
                  )}

                  <div className="gallery-media-actions">

                    <button
                      type="button"
                      className="gallery-edit-button"
                      onClick={() =>
                        openEditForm(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="gallery-delete-button"
                      onClick={() =>
                        deleteMedia(item._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}