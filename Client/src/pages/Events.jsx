import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "../styles/Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api("/events")
      .then((data) => {
        if (mounted) setEvents(Array.isArray(data) ? data.filter((event) => event.active !== false) : []);
      })
      .catch((loadError) => {
        console.error("Events loading error:", loadError);
        if (mounted) setError("We could not load upcoming events right now.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="container section events-page">
      <header className="events-header">
        <p className="eyebrow">COMMUNITY CALENDAR</p>
        <h1>Events &amp; Activities</h1>
        <p>Find upcoming REHEMA Foundation activities and ways to take part in our community work.</p>
      </header>

      {loading && <p className="events-state" role="status">Loading events…</p>}
      {!loading && error && <p className="events-state events-error" role="alert">{error}</p>}
      {!loading && !error && events.length === 0 && (
        <div className="events-empty">
          <h2>No upcoming events announced</h2>
          <p>New activities will appear here when they are ready to share.</p>
          <Link className="btn" to="/contact">Contact our team</Link>
        </div>
      )}
      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event) => (
            <article className="event-card" key={event._id}>
              {event.image && <img src={event.image} alt={event.title} loading="lazy" />}
              <div className="event-card-content">
                {event.date && <p className="event-date">{new Date(event.date).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}</p>}
                <h2>{event.title}</h2>
                {event.location && <p className="event-location">{event.location}</p>}
                {event.description && <p className="event-description">{event.description}</p>}
                {event.registrationUrl && <a className="btn" href={event.registrationUrl} target="_blank" rel="noreferrer">Register / Learn more</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
