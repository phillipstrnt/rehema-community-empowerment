
import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Contact() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api("/settings/public").then(setSiteSettings).catch(() => {});
  }, []);

  const contactEmail = siteSettings?.email || "rehemainfo@gmail.com";
  const contactPhone = siteSettings?.phone || "+256 39 3239910";
  const contactAddress = siteSettings?.address || "Plot 1580, Block 1, Bukasakya Subcounty, Florida Road, Nauyo-Bugema";

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setSending(true);
    setMessage("");

    try {
      const data = await api("/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage(
        data.message || "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setMessage(
        error.message || "Failed to send your message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="container section">
      <p className="eyebrow">CONTACT REHEMA</p>

      <h1>We Would Love To Hear From You</h1>

      <div className="two-col">
        {/* ================================================
            CONTACT INFORMATION
        ================================================= */}

        <div>
          <h2>REHEMA</h2>

          <p>{contactAddress}</p>

          <p><a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}>{contactPhone}</a></p>

          <p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>

          {/* ==============================================
              GOOGLE MAP
          ============================================== */}

          <div className="map">
            <iframe
              title="REHEMA location in Mbale, Uganda"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
              width="100%"
              height="400"
              style={{
                border: 0,
                borderRadius: "12px",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* DIRECT MAP LINK */}

          <p style={{ marginTop: "12px" }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Get Directions to REHEMA
            </a>
          </p>
        </div>

        {/* ================================================
            CONTACT FORM
        ================================================= */}

        <form
          className="form"
          onSubmit={submit}
        >
          <input
            name="name"
            value={form.name}
            placeholder="Name"
            required
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone"
            onChange={handleChange}
          />

          <input
            name="subject"
            value={form.subject}
            placeholder="Subject"
            onChange={handleChange}
          />

          <textarea
            name="message"
            value={form.message}
            placeholder="Message"
            required
            rows="6"
            onChange={handleChange}
          />

          <button
            className="btn"
            type="submit"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>

          {message && (
            <p className="form-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
