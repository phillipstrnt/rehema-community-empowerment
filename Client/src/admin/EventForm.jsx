import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

export default function EventForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    registrationUrl: "",
    image: "",
    active: true
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {

    if (!editing) return;

    async function loadEvent() {

      try {

        const response = await fetch(
          `http://localhost:5000/api/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load event."
          );
        }

        setForm({
          title: data.title || "",
          description: data.description || "",
          date: data.date
            ? data.date.substring(0, 10)
            : "",
          location: data.location || "",
          registrationUrl: data.registrationUrl || "",
          image: data.image || "",
          active: data.active ?? true
        });

      } catch (error) {

        console.error(error);

        setError(error.message);

      }

    }

    loadEvent();

  }, [editing, id]);


  function handleChange(event) {

    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm(previous => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

  }


  async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      const response = await fetch(
        editing
          ? `http://localhost:5000/api/events/${id}`
          : "http://localhost:5000/api/events",
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
          data.message || "Unable to save event."
        );
      }

      navigate("/admin/events");

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
          EVENT MANAGEMENT
        </p>

        <h1>
          {editing
            ? "Edit Event"
            : "Add Event"}
        </h1>

        <p>
          Create and manage REHEMA events and campaigns.
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
          Event Title

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Community Health Campaign"
            required
          />

        </label>


        <label>
          Description

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="7"
            placeholder="Describe the event..."
          />

        </label>


        <label>
          Event Date

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

        </label>


        <label>
          Location

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Mbale, Uganda"
          />

        </label>


        <label>
          Registration URL

          <input
            name="registrationUrl"
            value={form.registrationUrl}
            onChange={handleChange}
            placeholder="https://..."
          />

        </label>


        <label>
          Image URL

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
          />

        </label>


        <label className="checkbox">

          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          Active Event

        </label>


        <div className="admin-form-actions">

          <button
            type="button"
            className="button secondary"
            onClick={() => navigate("/admin/events")}
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
                ? "Update Event"
                : "Add Event"}
          </button>

        </div>

      </form>

    </section>

  );

}