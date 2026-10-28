import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/Gallery.css";

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError("");

        const data = await api("/gallery");

        setMedia(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gallery error:", error);
        setError("Unable to load the gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  return (
    <section className="container section gallery-page">

      {/* HEADER */}
      <div className="gallery-header">

        <p className="eyebrow">
          GALLERY
        </p>

        <h1>
          REHEMA Gallery
        </h1>

        <p className="gallery-intro">
          Explore photos and stories from REHEMA's programs,
          activities, medical outreaches, and community
          initiatives.
        </p>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="gallery-message">
          <div className="gallery-loader"></div>

          <p>
            Loading gallery...
          </p>
        </div>
      )}


      {/* ERROR */}
      {!loading && error && (
        <div className="gallery-message gallery-error">
          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>
        </div>
      )}


      {/* EMPTY */}
      {!loading && !error && media.length === 0 && (
        <div className="gallery-message">

          <div className="gallery-empty-icon">
            📷
          </div>

          <h3>
            No media available yet
          </h3>

          <p>
            REHEMA's latest photos and videos will
            appear here soon.
          </p>

        </div>
      )}


      {/* GALLERY */}
      {!loading && !error && media.length > 0 && (

        <div className="public-gallery-grid">

          {media.map((item) => (

            <article
              className="public-gallery-card"
              key={item._id}
            >

              {/* MEDIA */}
              <div className="public-gallery-media">

                {item.type === "video" ? (

                  <video
                    src={item.url}
                    controls
                    preload="metadata"
                    className="public-gallery-video"
                  >
                    Your browser does not support
                    video playback.
                  </video>

                ) : (

                  <img
                    src={item.url}
                    alt={
                      item.title ||
                      item.caption ||
                      "REHEMA community activity"
                    }
                    loading="lazy"
                    className="public-gallery-image"
                  />

                )}

              </div>


              {/* CONTENT */}
              <div className="public-gallery-content">

                {item.title && (
                  <h2>
                    {item.title}
                  </h2>
                )}

                {item.caption && (
                  <p>
                    {item.caption}
                  </p>
                )}

                <div className="public-gallery-meta">

                  <span className="public-gallery-type">
                    {item.type === "video"
                      ? "Video"
                      : "Photo"}
                  </span>

                  {item.date && (
                    <span>
                      {new Date(
                        item.date
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  )}

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </section>
  );
}