import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";


export default function GalleryForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    type: "image",
    url: "",
    caption: "",
    date: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {

    if (!editing) return;

    async function loadMedia() {

      try {

        const response = await fetch(
          `http://localhost:5000/api/gallery/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load media."
          );
        }

        setForm({
          title: data.title || "",
          type: data.type || "image",
          url: data.url || "",
          caption: data.caption || "",
          date: data.date
            ? data.date.substring(0, 10)
            : ""
        });

      } catch (error) {

        console.error(error);

        setError(error.message);

      }

    }

    loadMedia();

  }, [editing, id]);


  function handleChange(event) {

    const {
      name,
      value
    } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));

  }


  async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      const response = await fetch(
        editing
          ? `http://localhost:5000/api/gallery/${id}`
          : "http://localhost:5000/api/gallery",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || "Unable to save media."
        );

      }

      navigate("/admin/gallery");

    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setSaving(false);

    }

  }


  return (

    <section className="admin-form-page">

      <div className="admin-form-header">

        <p className="admin-eyebrow">
          MEDIA MANAGEMENT
        </p>

        <h1>
          {editing
            ? "Edit Media"
            : "Add Media"}
        </h1>

        <p>
          Add photos and videos to the REHEMA gallery.
        </p>

      </div>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <form
        className="admin-form-card admin-form"
        onSubmit={handleSubmit}
      >

        <label>
          Media Title

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="REHEMA Medical Outreach"
          />

        </label>


        <label>
          Media Type

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

        </label>


        <label>
          Media URL

          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="Image or video URL"
            required
          />

        </label>


        <label>
          Caption

          <textarea
            name="caption"
            value={form.caption}
            onChange={handleChange}
            rows="5"
            placeholder="Describe this media..."
          />

        </label>


        <label>
          Date

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

        </label>


        <div className="admin-form-actions">

          <button
            type="button"
            className="button secondary"
            onClick={() => navigate("/admin/gallery")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Media"
                : "Add Media"}
          </button>

        </div>

      </form>

    </section>

  );

}