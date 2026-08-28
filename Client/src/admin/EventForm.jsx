import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  registrationUrl: "",
  image: "",
  active: true,
};

export default function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadEvent() {
      try {
        setLoading(true);

        const events = await api("/events");
        const event = events.find((item) => item._id === id);

        if (!event) {
          throw new Error("Event not found.");
        }

        setForm({
          title: event.title || "",
          description: event.description || "",
          date: event.date ? event.date.substring(0, 10) : "",
          location: event.location || "",
          registrationUrl: event.registrationUrl || "",
          image: event.image || "",
          active: event.active ?? true,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
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
        await api(`/events/${id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await api("/events", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      navigate("/admin/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-form-page">
        <p>Loading event...</p>
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
          {id ? "Edit Event" : "Create Event"}
        </h1>

        <p>
          {id
            ? "Update the details of this REHEMA event."
            : "Create and publish a new REHEMA event."}
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
              <h2>Event Information</h2>

              <p>
                Provide the main information about this event.
              </p>
            </div>

            <div className="admin-editor-fields">

              <div className="admin-editor-field admin-editor-field-full">
                <label>Event Title</label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Annual Community Health Campaign"
                  required
                />
              </div>


              <div className="admin-editor-field">
                <label>Event Date</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>


              <div className="admin-editor-field">
                <label>Location</label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Mbale, Uganda"
                />
              </div>


              <div className="admin-editor-field admin-editor-field-full">
                <label>Registration URL</label>

                <input
                  type="url"
                  name="registrationUrl"
                  value={form.registrationUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/register"
                />

                <span className="admin-editor-help">
                  Optional link where visitors can register for this event.
                </span>
              </div>


              <div className="admin-editor-field admin-editor-field-full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="8"
                  placeholder="Describe the event, its purpose, activities and expected participants..."
                />
              </div>


              <div className="admin-editor-field admin-editor-field-full">
                <label>Featured Image</label>

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <span className="admin-editor-help">
                  Add the image URL that should represent this event.
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* SIDEBAR */}

        <aside className="admin-editor-sidebar">

          <div className="admin-editor-card">

            <h2>Publish</h2>

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
                Publish this event
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
                  ? "Update Event"
                  : "Publish Event"}
            </button>


            <button
              type="button"
              className="admin-editor-cancel-button"
              onClick={() => navigate("/admin/events")}
            >
              Cancel
            </button>

          </div>

        </aside>

      </form>

    </div>
  );
}