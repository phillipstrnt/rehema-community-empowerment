import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

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
  const [error, setError] = useState("");


  /* =========================
     LOAD EXISTING POST
  ========================= */

  useEffect(() => {

    if (!editing) return;

    async function loadPost() {

      try {

        setError("");

        const response = await fetch(
          `http://localhost:5000/api/admin/posts/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load this story."
          );
        }

        const data = await response.json();

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

        console.error(error);

        setError(
          error.message ||
          "Unable to load this story."
        );
      }
    }

    loadPost();

  }, [editing, id]);


  /* =========================
     HANDLE INPUT
  ========================= */

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


  /* =========================
     SAVE POST
  ========================= */

  async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      const url = editing
        ? `http://localhost:5000/api/admin/posts/${id}`
        : "http://localhost:5000/api/admin/posts";

      const method = editing
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to save story."
        );
      }

      navigate("/admin/posts");

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Something went wrong."
      );

    } finally {

      setSaving(false);

    }
  }


  /* =========================
     IMAGE PREVIEW
  ========================= */

  const imagePreview =
    form.image.trim();


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

        {/* MAIN */}

        <div className="admin-editor-main">

          <div className="admin-form-card">

            <h2>
              Story Information
            </h2>

            <p className="admin-form-help">
              Provide the main information about
              this news story.
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
              Add an image to appear with this story.
              We will connect Cloudinary here later.
            </p>


            <div className="admin-form-group">

              <label>
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

            </div>


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
                disabled={saving}
              >

                {saving
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