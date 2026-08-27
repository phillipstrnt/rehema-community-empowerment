
import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { api } from "../api";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "REHEMA",
    published: true
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD EXISTING STORY
  ===================================================== */

  useEffect(() => {
    if (!editing) {
      return;
    }

    async function loadPost() {
      try {
        setError("");

        const data = await api("/posts/id/" + id);

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          image: data.image || "",
          author: data.author || "REHEMA",
          published: data.published ?? true
        });
      } catch (error) {
        console.error("LOAD POST ERROR:", error);

        setError(
          error.message ||
          "Unable to load this story."
        );
      }
    }

    loadPost();
  }, [editing, id]);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  }

  /* =====================================================
     UPLOAD IMAGE TO CLOUDINARY
  ===================================================== */

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        "http://localhost:5000/api/upload/image",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Image upload failed."
        );
      }

      console.log(
        "CLOUDINARY UPLOAD:",
        data
      );

      setForm((previous) => ({
        ...previous,
        image: data.url || ""
      }));
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  /* =====================================================
     SAVE STORY
  ===================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    if (uploading) {
      setError(
        "Please wait for the image upload to finish."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      let savedPost;

      if (editing) {
        savedPost = await api(
          "/posts/" + id,
          {
            method: "PUT",
            body: JSON.stringify(form)
          }
        );
      } else {
        savedPost = await api(
          "/posts",
          {
            method: "POST",
            body: JSON.stringify(form)
          }
        );
      }

      console.log(
        "POST SAVED:",
        savedPost
      );

      navigate("/admin/posts");
    } catch (error) {
      console.error(
        "SAVE POST ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to save story."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     IMAGE PREVIEW
  ===================================================== */

  const imagePreview = form.image.trim();

  return (
    <section className="admin-form-page">

      {/* HEADER */}

      <div className="admin-form-header">
        <div>

          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>
            {editing
              ? "Edit News Story"
              : "Create News Story"}
          </h1>

          <p>
            {editing
              ? "Update the story details below."
              : "Create and publish a new REHEMA story."}
          </p>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        className="admin-editor-layout"
        onSubmit={handleSubmit}
      >

        {/* MAIN CONTENT */}

        <div className="admin-editor-main">

          {/* STORY INFORMATION */}

          <div className="admin-form-card">

            <h2>
              Story Information
            </h2>

            <p className="admin-form-help">
              Provide the main information
              about this news story.
            </p>

            <div className="admin-form-group">

              <label>
                Story Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter story title"
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Slug
              </label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="story-url-slug"
                required
              />

              <small>
                Example:
                free-medical-camp-mbale
              </small>

            </div>

            <div className="admin-form-group">

              <label>
                Excerpt
              </label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write a short summary of the story..."
                rows="4"
              />

            </div>

            <div className="admin-form-group">

              <label>
                Story Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write the full story here..."
                rows="16"
                required
              />

            </div>

          </div>

          {/* IMAGE */}

          <div className="admin-form-card">

            <h2>
              Featured Image
            </h2>

            <p className="admin-form-help">
              Select an image from your computer.
              It will be uploaded securely to Cloudinary.
            </p>

            <div className="admin-form-group">

              <label>
                Choose Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />

            </div>

            {uploading && (
              <div className="admin-upload-status">
                Uploading image...
              </div>
            )}

            {form.image && !uploading && (
              <div className="admin-upload-success">
                Image uploaded successfully.
              </div>
            )}

            {imagePreview && (
              <div className="admin-image-preview">

                <img
                  src={imagePreview}
                  alt="Story preview"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

          </div>

        </div>

        {/* SIDEBAR */}

        <aside className="admin-editor-sidebar">

          <div className="admin-form-card">

            <h2>
              Publish
            </h2>

            <div className="admin-publish-status">

              <span
                className={
                  form.published
                    ? "admin-status published"
                    : "admin-status draft"
                }
              >
                {form.published
                  ? "Published"
                  : "Draft"}
              </span>

            </div>

            <label className="admin-checkbox">

              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
              />

              <span>
                Publish this story
              </span>

            </label>

            <div className="admin-form-group">

              <label>
                Author
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
              />

            </div>

            <div className="admin-editor-actions">

              <button
                type="submit"
                className="admin-button admin-button-primary"
                disabled={saving || uploading}
              >

                {uploading
                  ? "Uploading Image..."
                  : saving
                    ? "Saving..."
                    : editing
                      ? "Update Story"
                      : "Publish Story"}

              </button>

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() =>
                  navigate("/admin/posts")
                }
              >
                Cancel
              </button>

            </div>

          </div>

  
        </aside>

      </form>

    </section>
  );
}