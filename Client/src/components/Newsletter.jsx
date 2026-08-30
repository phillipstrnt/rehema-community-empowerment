
import React, { useState } from "react";
import { api } from "../utils/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setSuccess(false);
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      const data = await api("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      setSuccess(true);
      setMessage(
        data.message ||
          "Successfully subscribed to the newsletter."
      );

      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      setSuccess(false);

      setMessage(
        error.message ||
          "Unable to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="newsletter">
      <div>
        <h2>Stay Connected</h2>

        <p>
          Receive REHEMA news, health campaigns and
          community updates.
        </p>
      </div>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          disabled={loading}
          required
        />

        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <small
          className={
            success
              ? "newsletter-success"
              : "newsletter-error"
          }
        >
          {message}
        </small>
      )}
    </section>
  );
}