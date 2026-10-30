import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "../styles/Events.css";
import "../styles/ScrollReveal.css";
import useScrollReveal from "../hooks/useScrollReveal";
import { communityHighlights } from "../data/communityHighlights";

export default function Events() {
  const highlightsRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useScrollReveal(highlightsRef);

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

      <section ref={highlightsRef} className="events-highlights scroll-reveal" aria-labelledby="events-highlights-title">
        <div className="events-highlights-heading">
          <p className="eyebrow">OUR WORK IN PICTURES</p>
          <h2 id="events-highlights-title">Community activity highlights</h2>
          <p>Snapshots of REHEMA community work, health outreach and partnership.</p>
        </div>
        <div className="events-highlights-grid">
          {communityHighlights.map((highlight) => (
            <article className="events-highlight-card" key={highlight._id}>
              <img src={highlight.url} alt={highlight.alt} loading="lazy" />
              <div className="events-highlight-content">
                <h3>{highlight.title}</h3>
                <p>{highlight.caption}</p>
                <Link to="/gallery">View gallery</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

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
