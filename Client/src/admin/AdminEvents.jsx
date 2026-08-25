import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminEvents() {
  const emptyForm = {
    title: "",
    description: "",
    date: "",
    location: "",
    registrationUrl: "",
    image: "",
    active: true,
  };

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================
  // LOAD EVENTS
  // ============================

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/events");

      setEvents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // ============================
  // INPUT
  // ============================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
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

  function openEditForm(event) {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date
        ? event.date.substring(0, 10)
        : "",
      location: event.location || "",
      registrationUrl: event.registrationUrl || "",
      image: event.image || "",
      active: event.active ?? true,
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
          `/events/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          }
        );

        setEvents((current) =>
          current.map((item) =>
            item._id === editingId
              ? saved
              : item
          )
        );

        setSuccess("Event updated successfully.");
      } else {
        saved = await api(
          "/events",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

        setEvents((current) => [
          saved,
          ...current,
        ]);

        setSuccess("Event added successfully.");
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

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api(
        `/events/${id}`,
        {
          method: "DELETE",
        }
      );

      setEvents((current) =>
        current.filter(
          (event) => event._id !== id
        )
      );

      setSuccess("Event deleted successfully.");

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
            Events
          </h1>

          <p>
            Create and manage REHEMA community
            events and campaigns.
          </p>
        </div>

        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={openAddForm}
        >
          + Add Event
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
                ? "Edit Event"
                : "Add New Event"}
            </h2>

            <p>
              Enter the event details below.
            </p>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              <div className="admin-field">

                <label>
                  Event Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Annual Community Health Campaign"
                  required
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


              <div className="admin-field">

                <label>
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Mbale, Uganda"
                />

              </div>


              <div className="admin-field">

                <label>
                  Registration URL
                </label>

                <input
                  type="url"
                  name="registrationUrl"
                  value={form.registrationUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe the event..."
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Image URL
                </label>

                <input
                  type="url"
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
                    Active Event
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
                    ? "Update Event"
                    : "Save Event"}
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


      {/* EVENTS */}

      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Existing Events
          </h2>

          <p>
            {events.length} event
            {events.length === 1 ? "" : "s"}
          </p>

        </div>


        {loading ? (

          <p>
            Loading events...
          </p>

        ) : events.length === 0 ? (

          <div className="admin-empty-state">

            <h3>
              No events yet
            </h3>

            <p>
              Click "Add Event" to create your
              first event.
            </p>

          </div>

        ) : (

          <div className="admin-items">

            {events.map((event) => (

              <div
                className="admin-item-card"
                key={event._id}
              >

                <div className="admin-item-content">

                  <h3>
                    {event.title}
                  </h3>

                  <p>
                    {event.description}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {event.date
                      ? new Date(
                          event.date
                        ).toLocaleDateString()
                      : "Not specified"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {event.location || "Not specified"}
                  </p>

                  <span
                    className={
                      event.active
                        ? "admin-status admin-status-active"
                        : "admin-status"
                    }
                  >
                    {event.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                <div className="admin-item-actions">

                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={() =>
                      openEditForm(event)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="admin-button admin-button-danger"
                    onClick={() =>
                      deleteEvent(event._id)
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