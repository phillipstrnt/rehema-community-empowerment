import React from "react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import "../styles/Footer.css";

export default function Footer() {
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

                <a href="mailto:rehemainfo@gmail.com">
                  rehemainfo@gmail.com
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

                <a href="tel:+256393239910">
                  +256 39 3239910
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
                  href="whatsapp://send?phone=256702952694"
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
                  Plot 1580, Block 1<br />
                  BUKASAKYA SUBCOUNTY<br />
                  Florida Road, Nauyo-Bugema
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

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="REHEMA on Facebook"
              title="Rural Empowerment on Health Management on Facebook"
            >
              Facebook
            </a>

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