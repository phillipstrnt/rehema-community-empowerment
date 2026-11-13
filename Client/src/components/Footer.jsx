import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Newsletter from "./Newsletter";
import "../styles/Footer.css";

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState(null);
  useEffect(() => {
    api("/settings/public").then(setSiteSettings).catch(() => {});
  }, []);
  const socialLinks = [
    ["Facebook", siteSettings?.facebook || "https://www.facebook.com/share/1HmhYn5hJX/"], ["Instagram", siteSettings?.instagram],
    ["X", siteSettings?.twitter], ["LinkedIn", siteSettings?.linkedin], ["YouTube", siteSettings?.youtube],
  ].filter(([, url]) => url);

  return (
    <footer className="site-footer">

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">

          <div className="footer-newsletter-text">
            <span className="footer-eyebrow">
              STAY CONNECTED
            </span>

            <h2>
              Stay informed. Stay connected.
            </h2>

            <p>
              Receive updates about REHEMA programs, community
              health activities, events and opportunities to
              get involved.
            </p>
          </div>

          <div className="footer-newsletter-form">
            <Newsletter />
          </div>

        </div>
      </div>


      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="footer-main">

        <div className="container footer-grid">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              <img
                src="/images/rehema/logo.png"
                alt="REHEMA"
              />
            </Link>

            <p>
              Rural Empowerment on Health Management (REHEMA)
              works with communities to promote equitable
              access to health information, services,
              education and opportunities for sustainable
              development.
            </p>

            <Link
              to="/about"
              className="footer-read-more"
            >
              Learn more about REHEMA →
            </Link>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div className="footer-column">

            <h3>
              Explore
            </h3>

            <ul>

              <li>
                <Link to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/programs">
                  Our Programs
                </Link>
              </li>

              <li>
                <Link to="/news">
                  News & Stories
                </Link>
              </li>

              <li>
                <Link to="/events">
                  Events
                </Link>
              </li>

              <li>
                <Link to="/gallery">
                  Gallery
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              GET INVOLVED
          ================================================= */}

          <div className="footer-column">

            <h3>
              Get Involved
            </h3>

            <ul>

              <li>
                <Link to="/get-involved">
                  Volunteer
                </Link>
              </li>

              <li>
                <Link to="/get-involved">
                  Partner With Us
                </Link>
              </li>

              <li>
                <Link to="/donate">
                  Donate
                </Link>
              </li>

              <li>
                <Link to="/get-involved">
                  Support Our Work
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact Our Team
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="footer-column footer-contact">

            <h3>
              Contact Us
            </h3>

            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                ✉
              </span>

              <div>
                <small>
                  Email
                </small>

                <a href={`mailto:${siteSettings?.email || "rehemainfo@gmail.com"}`}>
                  {siteSettings?.email || "rehemainfo@gmail.com"}
                </a>
              </div>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                ☎
              </span>

              <div>
                <small>
                  Phone
                </small>

                <a href={`tel:${(siteSettings?.phone || "+256 39 3239910").replace(/[^+\d]/g, "")}`}>
                  {siteSettings?.phone || "+256 39 3239910"}
                </a>
              </div>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                💬
              </span>

              <div>
                <small>
                  WhatsApp
                </small>

                <a
<<<<<<< HEAD
                  href="whatsapp://send?phone=256702952694"
=======
                  href="https://wa.me/256702952694"
>>>>>>> d5654c452cbb6c15341a2a7d6601300e472486d0
                >
                  +256 702 952 694
                </a>
              </div>

            </div>


            <div className="footer-contact-item">

              <span className="footer-contact-icon">
                📍
              </span>

              <div>
                <small>
                  Location
                </small>

                <p>
                  {siteSettings?.address || "Plot 1580, Block 1, Bukasakya Subcounty, Florida Road, Nauyo-Bugema"}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM FOOTER
      ===================================================== */}

      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <p>
            © {new Date().getFullYear()} REHEMA.
            All rights reserved.
          </p>


          <div className="footer-social">
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={`REHEMA on ${label}`}>
                {label}
              </a>
            ))}
          </div>


          <div className="footer-bottom-links">

            <Link to="/contact">
              Contact
            </Link>

            <Link to="/donate">
              Support REHEMA
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
