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

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // ============================
  // HANDLE INPUT
  // ============================

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // ============================
  // ADD EVENT
  // ============================

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // ============================
  // EDIT EVENT
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
      registrationUrl:
        event.registrationUrl || "",
      image: event.image || "",
      active: event.active ?? true,
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============================
  // CLOSE FORM
  // ============================

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  // ============================
  // SAVE EVENT
  // ============================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let savedEvent;

      if (editingId) {
        savedEvent = await api(
          `/events/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          }
        );

        setEvents((current) =>
          current.map((item) =>
            item._id === editingId
              ? savedEvent
              : item
          )
        );

        setSuccess(
          "Event updated successfully."
        );
      } else {
        savedEvent = await api(
          "/events",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

        setEvents((current) => [
          savedEvent,
          ...current,
        ]);

        setSuccess(
          "Event added successfully."
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  // ============================
  // DELETE EVENT
  // ============================

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api(`/events/${id}`, {
        method: "DELETE",
      });

      setEvents((current) =>
        current.filter(
          (event) => event._id !== id
        )
      );

      setSuccess(
        "Event deleted successfully."
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className="admin-form-page">

      {/* ==================================
          HEADER
      ================================== */}

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
            events, campaigns and outreach activities.
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


      {/* ==================================
          MESSAGES
      ================================== */}

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


      {/* ==================================
          ADD / EDIT FORM
      ================================== */}

      {showForm && (

        <div className="admin-form-card">

          <div className="section-heading">

            <div>

              <p className="admin-eyebrow">
                {editingId
                  ? "EDIT EVENT"
                  : "NEW EVENT"}
              </p>

              <h2>
                {editingId
                  ? "Edit Event"
                  : "Add New Event"}
              </h2>

              <p>
                {editingId
                  ? "Update the event information below."
                  : "Add a new REHEMA event to your website."}
              </p>

            </div>

          </div>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              {/* EVENT TITLE */}

              <div className="admin-field">

                <label htmlFor="event-title">
                  Event Title
                </label>

                <input
                  id="event-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Annual Community Health Campaign"
                  required
                />

              </div>


              {/* DATE */}

              <div className="admin-field">

                <label htmlFor="event-date">
                  Event Date
                </label>

                <input
                  id="event-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>


              {/* LOCATION */}

              <div className="admin-field">

                <label htmlFor="event-location">
                  Location
                </label>

                <input
                  id="event-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Mbale, Uganda"
                />

              </div>


              {/* REGISTRATION */}

              <div className="admin-field">

                <label htmlFor="event-registration">
                  Registration URL
                </label>

                <input
                  id="event-registration"
                  type="url"
                  name="registrationUrl"
                  value={form.registrationUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              {/* DESCRIPTION */}

              <div className="admin-field admin-field-full">

                <label htmlFor="event-description">
                  Event Description
                </label>

                <textarea
                  id="event-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Describe the event, activities, target community and expected outcomes..."
                />

              </div>


              {/* IMAGE */}

              <div className="admin-field admin-field-full">

                <label htmlFor="event-image">
                  Event Image
                </label>

                <input
                  id="event-image"
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                <small>
                  Paste the Cloudinary image URL for
                  this event.
                </small>

              </div>


              {/* ACTIVE */}

              <div className="admin-field admin-field-full">

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />

                  <span>
                    Make this event active on the website
                  </span>

                </label>

              </div>

            </div>


            {/* ACTIONS */}

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
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ==================================
          EVENT LIBRARY
      ================================== */}

      <div className="admin-form-card">

        <div className="section-heading">

          <div>

            <p className="admin-eyebrow">
              EVENT LIBRARY
            </p>

            <h2>
              Existing Events
            </h2>

            <p>
              {events.length} event
              {events.length === 1
                ? ""
                : "s"} in your content library.
            </p>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-empty-state">

            <div className="admin-loader"></div>

            <p>
              Loading events...
            </p>

          </div>
        )}


        {/* EMPTY */}

        {!loading && events.length === 0 && (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📅
            </div>

            <h3>
              No events yet
            </h3>

            <p>
              Create your first REHEMA event
              using the button above.
            </p>

            <button
              type="button"
              className="admin-button admin-button-primary"
              onClick={openAddForm}
            >
              + Add Event
            </button>

          </div>

        )}


        {/* EVENTS */}

        {!loading && events.length > 0 && (

          <div className="admin-items">

            {events.map((event) => (

              <div
                className="admin-item-card"
                key={event._id}
              >

                {/* IMAGE */}

                {event.image && (

                  <img
                    src={event.image}
                    alt={event.title}
                    className="admin-media-preview"
                  />

                )}


                {/* CONTENT */}

                <div className="admin-item-content">

                  <h3>
                    {event.title}
                  </h3>

                  {event.description && (
                    <p>
                      {event.description}
                    </p>
                  )}

                  <div className="admin-event-details">

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
                      {event.location ||
                        "Not specified"}
                    </p>

                  </div>

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


                {/* ACTIONS */}

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