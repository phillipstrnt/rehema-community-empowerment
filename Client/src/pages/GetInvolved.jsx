<<<<<<< HEAD

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/GetInvolved.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function GetInvolved() {
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [partnerForm, setPartnerForm] = useState({
    organization: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [volunteerStatus, setVolunteerStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const [partnerStatus, setPartnerStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  /* =====================================================
     VOLUNTEER FORM
  ===================================================== */

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;

    setVolunteerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    setVolunteerStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const response = await fetch(`${API_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your application."
        );
      }

      setVolunteerStatus({
        loading: false,
        success:
          "Thank you for your interest in volunteering with REHEMA. Your application has been received.",
        error: "",
      });

      setVolunteerForm({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (error) {
      setVolunteerStatus({
        loading: false,
        success: "",
        error:
          error.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  /* =====================================================
     PARTNER FORM
  ===================================================== */

  const handlePartnerChange = (e) => {
    const { name, value } = e.target;

    setPartnerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();

    setPartnerStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const response = await fetch(`${API_URL}/partners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partnerForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit partnership request."
        );
      }

      setPartnerStatus({
        loading: false,
        success:
          "Thank you. Your partnership request has been received. The REHEMA team will get in touch with you.",
        error: "",
      });

      setPartnerForm({
        organization: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setPartnerStatus({
        loading: false,
        success: "",
        error:
          error.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="get-involved-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="gi-hero">

        <img
          src="/images/rehema/get-involved.jpg"
          alt="REHEMA community engagement"
          className="gi-hero-image"
        />

        <div className="gi-hero-overlay"></div>

        <div className="container gi-hero-content">

          <span className="gi-eyebrow">
            GET INVOLVED
          </span>

          <h1>
            Be part of healthier communities.
          </h1>

          <p>
            REHEMA believes that lasting change happens when
            communities, professionals, organizations and
            individuals work together.
          </p>

          <div className="gi-hero-actions">

            <a
              href="#volunteer"
              className="gi-btn gi-btn-primary"
            >
              Volunteer With Us
              <span>→</span>
            </a>

            <a
              href="#partner"
              className="gi-btn gi-btn-light"
            >
              Partner With Us
              <span>→</span>
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="container gi-section">

        <div className="gi-intro">

          <div>
            <span className="gi-eyebrow dark">
              YOUR SUPPORT MATTERS
            </span>

            <h2>
              There is more than one way to make a difference.
            </h2>
          </div>

          <div>
            <p>
              Whether you volunteer your time, provide professional
              expertise, build a partnership or support our work,
              your contribution can help REHEMA reach more people
              with meaningful health and community initiatives.
            </p>

            <p>
              We welcome individuals, organizations, health
              professionals, community leaders and development
              partners who share our commitment to healthier and
              empowered communities.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          INVOLVEMENT CARDS
      ===================================================== */}

      <section className="gi-options-section">

        <div className="container">

          <div className="gi-heading">

            <span className="gi-eyebrow dark">
              HOW YOU CAN HELP
            </span>

            <h2>
              Find your way to get involved
            </h2>

            <p>
              Choose an opportunity that matches your skills,
              resources and passion.
            </p>

          </div>


          <div className="gi-options-grid">

            <article className="gi-option-card">

              <div className="gi-option-icon">
                01
              </div>

              <h3>
                Volunteer
              </h3>

              <p>
                Give your time, knowledge and skills to support
                REHEMA activities and community initiatives.
              </p>

              <a href="#volunteer">
                Become a Volunteer →
              </a>

            </article>


            <article className="gi-option-card featured">

              <div className="gi-option-icon">
                02
              </div>

              <h3>
                Partner
              </h3>

              <p>
                Work with REHEMA to develop programs, mobilize
                resources and create sustainable community impact.
              </p>

              <a href="#partner">
                Become a Partner →
              </a>

            </article>


            <article className="gi-option-card">

              <div className="gi-option-icon">
                03
              </div>

              <h3>
                Support
              </h3>

              <p>
                Your financial support helps us expand outreach,
                health education and community empowerment.
              </p>

              <Link to="/donate">
                Support REHEMA →
              </Link>

            </article>


            <article className="gi-option-card">

              <div className="gi-option-icon">
                04
              </div>

              <h3>
                Spread the Word
              </h3>

              <p>
                Help us reach more people by sharing REHEMA's
                work, stories and community initiatives.
              </p>

              <a
                href="https://www.facebook.com/share/1HmhYn5hJX/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow REHEMA →
              </a>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          VOLUNTEER
      ===================================================== */}

      <section
        className="gi-form-section"
        id="volunteer"
      >

        <div className="container gi-form-layout">

          <div className="gi-form-info">

            <span className="gi-eyebrow dark">
              VOLUNTEER
            </span>

            <h2>
              Give your time. Share your skills.
            </h2>

            <p>
              Volunteers are an important part of community
              development. Whether you have experience in public
              health, medicine, communications, administration,
              technology, fundraising or community engagement,
              there may be a place for you.
            </p>

            <div className="gi-benefits">

              <div>
                <strong>01</strong>
                <span>Support community initiatives</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Share professional skills</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Connect with communities</span>
              </div>

              <div>
                <strong>04</strong>
                <span>Contribute to sustainable impact</span>
              </div>

            </div>

          </div>


          <div className="gi-form-card">

            <div className="gi-form-header">
              <span>VOLUNTEER APPLICATION</span>
              <h3>
                Tell us about yourself
              </h3>
            </div>

            <form onSubmit={handleVolunteerSubmit}>

              <div className="gi-form-row">

                <div className="gi-field">
                  <label htmlFor="volunteer-name">
                    Full Name *
                  </label>

                  <input
                    id="volunteer-name"
                    type="text"
                    name="name"
                    value={volunteerForm.name}
                    onChange={handleVolunteerChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="gi-field">
                  <label htmlFor="volunteer-email">
                    Email Address *
                  </label>

                  <input
                    id="volunteer-email"
                    type="email"
                    name="email"
                    value={volunteerForm.email}
                    onChange={handleVolunteerChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

              </div>


              <div className="gi-form-row">

                <div className="gi-field">
                  <label htmlFor="volunteer-phone">
                    Phone Number
                  </label>

                  <input
                    id="volunteer-phone"
                    type="tel"
                    name="phone"
                    value={volunteerForm.phone}
                    onChange={handleVolunteerChange}
                    placeholder="+256..."
                  />
                </div>

                <div className="gi-field">
                  <label htmlFor="volunteer-interest">
                    Area of Interest *
                  </label>

                  <select
                    id="volunteer-interest"
                    name="interest"
                    value={volunteerForm.interest}
                    onChange={handleVolunteerChange}
                    required
                  >

                    <option value="">
                      Select an area
                    </option>

                    <option value="Medical Outreach">
                      Medical Outreach
                    </option>

                    <option value="Maternal and Child Health">
                      Maternal & Child Health
                    </option>

                    <option value="HIV Prevention">
                      HIV Prevention
                    </option>

                    <option value="Health Education">
                      Health Education
                    </option>

                    <option value="WASH and Environment">
                      WASH & Environment
                    </option>

                    <option value="Community Development">
                      Community Development
                    </option>

                    <option value="Communications">
                      Communications
                    </option>

                    <option value="Fundraising">
                      Fundraising
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              <div className="gi-field">

                <label htmlFor="volunteer-message">
                  Message
                </label>

                <textarea
                  id="volunteer-message"
                  name="message"
                  value={volunteerForm.message}
                  onChange={handleVolunteerChange}
                  placeholder="Tell us about yourself, your skills and how you would like to contribute."
                  rows="5"
                />

              </div>


              {volunteerStatus.success && (
                <div className="gi-success">
                  ✓ {volunteerStatus.success}
                </div>
              )}

              {volunteerStatus.error && (
                <div className="gi-error">
                  {volunteerStatus.error}
                </div>
              )}


              <button
                type="submit"
                className="gi-submit-btn"
                disabled={volunteerStatus.loading}
              >
                {volunteerStatus.loading
                  ? "Submitting..."
                  : "Submit Volunteer Application →"}
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* =====================================================
          PARTNER
      ===================================================== */}

      <section
        className="gi-partner-section"
        id="partner"
      >

        <div className="container">

          <div className="gi-partner-layout">

            <div className="gi-partner-image">

              {/* ADD YOUR PARTNERSHIP IMAGE HERE */}
              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788360703/partnership-img.jpg"
                alt="REHEMA partnership and collaboration"
              />

              <div className="gi-image-caption">
                <strong>
                  Stronger together
                </strong>

                <span>
                  Partnerships for sustainable community impact
                </span>
              </div>

            </div>


            <div className="gi-form-card partner-card">

              <div className="gi-form-header">

                <span>
                  PARTNERSHIP
                </span>

                <h3>
                  Let's work together
                </h3>

              </div>

              <p className="gi-form-description">
                If your organization is interested in partnering
                with REHEMA, tell us about your organization and
                how you would like to collaborate.
              </p>


              <form onSubmit={handlePartnerSubmit}>

                <div className="gi-field">

                  <label htmlFor="organization">
                    Organization
                  </label>

                  <input
                    id="organization"
                    type="text"
                    name="organization"
                    value={partnerForm.organization}
                    onChange={handlePartnerChange}
                    placeholder="Organization name"
                  />

                </div>


                <div className="gi-form-row">

                  <div className="gi-field">

                    <label htmlFor="partner-name">
                      Contact Person *
                    </label>

                    <input
                      id="partner-name"
                      type="text"
                      name="name"
                      value={partnerForm.name}
                      onChange={handlePartnerChange}
                      placeholder="Full name"
                      required
                    />

                  </div>


                  <div className="gi-field">

                    <label htmlFor="partner-email">
                      Email *
                    </label>

                    <input
                      id="partner-email"
                      type="email"
                      name="email"
                      value={partnerForm.email}
                      onChange={handlePartnerChange}
                      placeholder="you@example.com"
                      required
                    />

                  </div>

                </div>


                <div className="gi-field">

                  <label htmlFor="partner-phone">
                    Phone Number
                  </label>

                  <input
                    id="partner-phone"
                    type="tel"
                    name="phone"
                    value={partnerForm.phone}
                    onChange={handlePartnerChange}
                    placeholder="+256..."
                  />

                </div>


                <div className="gi-field">

                  <label htmlFor="partner-message">
                    Partnership Proposal *
                  </label>

                  <textarea
                    id="partner-message"
                    name="message"
                    value={partnerForm.message}
                    onChange={handlePartnerChange}
                    placeholder="Tell us about the partnership or collaboration you have in mind."
                    rows="5"
                    required
                  />

                </div>


                {partnerStatus.success && (
                  <div className="gi-success">
                    ✓ {partnerStatus.success}
                  </div>
                )}

                {partnerStatus.error && (
                  <div className="gi-error">
                    {partnerStatus.error}
                  </div>
                )}


                <button
                  type="submit"
                  className="gi-submit-btn"
                  disabled={partnerStatus.loading}
                >
                  {partnerStatus.loading
                    ? "Submitting..."
                    : "Send Partnership Request →"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORT
      ===================================================== */}

      <section className="gi-support-section">

        <div className="container">

          <div className="gi-support-content">

            <div>

              <span className="gi-eyebrow">
                SUPPORT OUR WORK
              </span>

              <h2>
                Help us reach more communities.
              </h2>

              <p>
                Your support can contribute to health outreach,
                education, prevention initiatives and community
                empowerment.
              </p>

            </div>

            <Link
              to="/donate"
              className="gi-btn gi-btn-primary"
            >
              Donate & Support REHEMA →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT OPTIONS
      ===================================================== */}

      <section className="container gi-section">

        <div className="gi-heading">

          <span className="gi-eyebrow dark">
            TALK TO US
          </span>

          <h2>
            Have a question or another way to help?
          </h2>

          <p>
            Contact REHEMA directly and our team will be happy
            to hear from you.
          </p>

        </div>


        <div className="gi-contact-grid">

          <a
            href="mailto:rehemainfo@gmail.com"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              ✉
            </span>

            <div>
              <span>Email</span>
              <strong>
                rehemainfo@gmail.com
              </strong>
            </div>
          </a>


          <a
            href="tel:+256393239910"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              ☎
            </span>

            <div>
              <span>Call Us</span>
              <strong>
                +256 39 3239910
              </strong>
            </div>
          </a>


          <a
            href="whatsapp://send?phone=256702952694"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              WA
            </span>

            <div>
              <span>WhatsApp</span>
              <strong>
                +256 702 952 694
              </strong>
            </div>
          </a>


          <a
            href="https://www.facebook.com/share/1HmhYn5hJX/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              f
            </span>

            <div>
              <span>Facebook</span>
              <strong>
                Rural Empowerment on Health Management
              </strong>
            </div>
          </a>

        </div>

      </section>


      {/* =====================================================
          LOCATION
      ===================================================== */}

      <section className="gi-location-section">

        <div className="container">

          <div className="gi-location-card">

            <div>

              <span className="gi-eyebrow dark">
                FIND US
              </span>

              <h2>
                Visit REHEMA
              </h2>

              <p>
                Plot 1580, Block 1 at BUKASAKYA SUBCOUNTY,
                Florida Road, Nauyo-Bugema.
              </p>

            </div>


            <Link
              to="/contact"
              className="gi-outline-btn"
            >
              Contact REHEMA →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="gi-final-cta">

        <div className="container">

          <span className="gi-eyebrow">
            TOGETHER
          </span>

          <h2>
            Healthier communities start with people who care.
          </h2>

          <p>
            Join REHEMA in creating practical, sustainable and
            community-centered solutions.
          </p>

          <div className="gi-final-actions">

            <Link
              to="/programs"
              className="gi-btn gi-btn-light"
            >
              Explore Our Programs
            </Link>

            <Link
              to="/contact"
              className="gi-btn gi-btn-primary"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
=======
import { API_BASE_URL } from "../apiConfig.js";


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "../styles/GetInvolved.css";

const API_URL = API_BASE_URL;

export default function GetInvolved() {
  const [contactEmail, setContactEmail] = useState("rehemainfo@gmail.com");
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [partnerForm, setPartnerForm] = useState({
    organization: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    api("/settings/public")
      .then((settings) => {
        if (settings.email) setContactEmail(settings.email);
      })
      .catch(() => {});
  }, []);

  const [volunteerStatus, setVolunteerStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const [partnerStatus, setPartnerStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  /* =====================================================
     VOLUNTEER FORM
  ===================================================== */

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;

    setVolunteerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    setVolunteerStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const response = await fetch(`${API_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your application."
        );
      }

      setVolunteerStatus({
        loading: false,
        success:
          "Thank you for your interest in volunteering with REHEMA. Your application has been received.",
        error: "",
      });

      setVolunteerForm({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (error) {
      setVolunteerStatus({
        loading: false,
        success: "",
        error:
          error.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  /* =====================================================
     PARTNER FORM
  ===================================================== */

  const handlePartnerChange = (e) => {
    const { name, value } = e.target;

    setPartnerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();

    setPartnerStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const response = await fetch(`${API_URL}/partners/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partnerForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit partnership request."
        );
      }

      setPartnerStatus({
        loading: false,
        success:
          "Thank you. Your partnership request has been received. The REHEMA team will get in touch with you.",
        error: "",
      });

      setPartnerForm({
        organization: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setPartnerStatus({
        loading: false,
        success: "",
        error:
          error.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="get-involved-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="gi-hero">

        <img
          src="/images/rehema/get-involved.jpg"
          alt="REHEMA community engagement"
          className="gi-hero-image"
        />

        <div className="gi-hero-overlay"></div>

        <div className="container gi-hero-content">

          <span className="gi-eyebrow">
            GET INVOLVED
          </span>

          <h1>
            Be part of healthier communities.
          </h1>

          <p>
            REHEMA believes that lasting change happens when
            communities, professionals, organizations and
            individuals work together.
          </p>

          <div className="gi-hero-actions">

            <a
              href="#volunteer"
              className="gi-btn gi-btn-primary"
            >
              Volunteer With Us
              <span>→</span>
            </a>

            <a
              href="#partner"
              className="gi-btn gi-btn-light"
            >
              Partner With Us
              <span>→</span>
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="container gi-section">

        <div className="gi-intro">

          <div>
            <span className="gi-eyebrow dark">
              YOUR SUPPORT MATTERS
            </span>

            <h2>
              There is more than one way to make a difference.
            </h2>
          </div>

          <div>
            <p>
              Whether you volunteer your time, provide professional
              expertise, build a partnership or support our work,
              your contribution can help REHEMA reach more people
              with meaningful health and community initiatives.
            </p>

            <p>
              We welcome individuals, organizations, health
              professionals, community leaders and development
              partners who share our commitment to healthier and
              empowered communities.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          INVOLVEMENT CARDS
      ===================================================== */}

      <section className="gi-options-section">

        <div className="container">

          <div className="gi-heading">

            <span className="gi-eyebrow dark">
              HOW YOU CAN HELP
            </span>

            <h2>
              Find your way to get involved
            </h2>

            <p>
              Choose an opportunity that matches your skills,
              resources and passion.
            </p>

          </div>


          <div className="gi-options-grid">

            <article className="gi-option-card">

              <div className="gi-option-icon">
                01
              </div>

              <h3>
                Volunteer
              </h3>

              <p>
                Give your time, knowledge and skills to support
                REHEMA activities and community initiatives.
              </p>

              <a href="#volunteer">
                Become a Volunteer →
              </a>

            </article>


            <article className="gi-option-card featured">

              <div className="gi-option-icon">
                02
              </div>

              <h3>
                Partner
              </h3>

              <p>
                Work with REHEMA to develop programs, mobilize
                resources and create sustainable community impact.
              </p>

              <a href="#partner">
                Become a Partner →
              </a>

            </article>


            <article className="gi-option-card">

              <div className="gi-option-icon">
                03
              </div>

              <h3>
                Support
              </h3>

              <p>
                Your financial support helps us expand outreach,
                health education and community empowerment.
              </p>

              <Link to="/donate">
                Support REHEMA →
              </Link>

            </article>


            <article className="gi-option-card">

              <div className="gi-option-icon">
                04
              </div>

              <h3>
                Spread the Word
              </h3>

              <p>
                Help us reach more people by sharing REHEMA's
                work, stories and community initiatives.
              </p>

              <a
                href="https://www.facebook.com/share/1HmhYn5hJX/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow REHEMA →
              </a>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          VOLUNTEER
      ===================================================== */}

      <section
        className="gi-form-section"
        id="volunteer"
      >

        <div className="container gi-form-layout">

          <div className="gi-form-info">

            <span className="gi-eyebrow dark">
              VOLUNTEER
            </span>

            <h2>
              Give your time. Share your skills.
            </h2>

            <p>
              Volunteers are an important part of community
              development. Whether you have experience in public
              health, medicine, communications, administration,
              technology, fundraising or community engagement,
              there may be a place for you.
            </p>

            <div className="gi-benefits">

              <div>
                <strong>01</strong>
                <span>Support community initiatives</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Share professional skills</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Connect with communities</span>
              </div>

              <div>
                <strong>04</strong>
                <span>Contribute to sustainable impact</span>
              </div>

            </div>

          </div>


          <div className="gi-form-card">

            <div className="gi-form-header">
              <span>VOLUNTEER APPLICATION</span>
              <h3>
                Tell us about yourself
              </h3>
            </div>

            <form onSubmit={handleVolunteerSubmit}>

              <div className="gi-form-row">

                <div className="gi-field">
                  <label htmlFor="volunteer-name">
                    Full Name *
                  </label>

                  <input
                    id="volunteer-name"
                    type="text"
                    name="name"
                    value={volunteerForm.name}
                    onChange={handleVolunteerChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="gi-field">
                  <label htmlFor="volunteer-email">
                    Email Address *
                  </label>

                  <input
                    id="volunteer-email"
                    type="email"
                    name="email"
                    value={volunteerForm.email}
                    onChange={handleVolunteerChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

              </div>


              <div className="gi-form-row">

                <div className="gi-field">
                  <label htmlFor="volunteer-phone">
                    Phone Number
                  </label>

                  <input
                    id="volunteer-phone"
                    type="tel"
                    name="phone"
                    value={volunteerForm.phone}
                    onChange={handleVolunteerChange}
                    placeholder="+256..."
                  />
                </div>

                <div className="gi-field">
                  <label htmlFor="volunteer-interest">
                    Area of Interest *
                  </label>

                  <select
                    id="volunteer-interest"
                    name="interest"
                    value={volunteerForm.interest}
                    onChange={handleVolunteerChange}
                    required
                  >

                    <option value="">
                      Select an area
                    </option>

                    <option value="Medical Outreach">
                      Medical Outreach
                    </option>

                    <option value="Maternal and Child Health">
                      Maternal & Child Health
                    </option>

                    <option value="HIV Prevention">
                      HIV Prevention
                    </option>

                    <option value="Health Education">
                      Health Education
                    </option>

                    <option value="WASH and Environment">
                      WASH & Environment
                    </option>

                    <option value="Community Development">
                      Community Development
                    </option>

                    <option value="Communications">
                      Communications
                    </option>

                    <option value="Fundraising">
                      Fundraising
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              <div className="gi-field">

                <label htmlFor="volunteer-message">
                  Message
                </label>

                <textarea
                  id="volunteer-message"
                  name="message"
                  value={volunteerForm.message}
                  onChange={handleVolunteerChange}
                  placeholder="Tell us about yourself, your skills and how you would like to contribute."
                  rows="5"
                />

              </div>


              {volunteerStatus.success && (
                <div className="gi-success">
                  ✓ {volunteerStatus.success}
                </div>
              )}

              {volunteerStatus.error && (
                <div className="gi-error">
                  {volunteerStatus.error}
                </div>
              )}


              <button
                type="submit"
                className="gi-submit-btn"
                disabled={volunteerStatus.loading}
              >
                {volunteerStatus.loading
                  ? "Submitting..."
                  : "Submit Volunteer Application →"}
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* =====================================================
          PARTNER
      ===================================================== */}

      <section
        className="gi-partner-section"
        id="partner"
      >

        <div className="container">

          <div className="gi-partner-layout">

            <div className="gi-partner-image">

              {/* ADD YOUR PARTNERSHIP IMAGE HERE */}
              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788360703/partnership-img.jpg"
                alt="REHEMA partnership and collaboration"
              />

              <div className="gi-image-caption">
                <strong>
                  Stronger together
                </strong>

                <span>
                  Partnerships for sustainable community impact
                </span>
              </div>

            </div>


            <div className="gi-form-card partner-card">

              <div className="gi-form-header">

                <span>
                  PARTNERSHIP
                </span>

                <h3>
                  Let's work together
                </h3>

              </div>

              <p className="gi-form-description">
                If your organization is interested in partnering
                with REHEMA, tell us about your organization and
                how you would like to collaborate.
              </p>


              <form onSubmit={handlePartnerSubmit}>

                <div className="gi-field">

                  <label htmlFor="organization">
                    Organization
                  </label>

                  <input
                    id="organization"
                    type="text"
                    name="organization"
                    value={partnerForm.organization}
                    onChange={handlePartnerChange}
                    placeholder="Organization name"
                  />

                </div>


                <div className="gi-form-row">

                  <div className="gi-field">

                    <label htmlFor="partner-name">
                      Contact Person *
                    </label>

                    <input
                      id="partner-name"
                      type="text"
                      name="name"
                      value={partnerForm.name}
                      onChange={handlePartnerChange}
                      placeholder="Full name"
                      required
                    />

                  </div>


                  <div className="gi-field">

                    <label htmlFor="partner-email">
                      Email *
                    </label>

                    <input
                      id="partner-email"
                      type="email"
                      name="email"
                      value={partnerForm.email}
                      onChange={handlePartnerChange}
                      placeholder="you@example.com"
                      required
                    />

                  </div>

                </div>


                <div className="gi-field">

                  <label htmlFor="partner-phone">
                    Phone Number
                  </label>

                  <input
                    id="partner-phone"
                    type="tel"
                    name="phone"
                    value={partnerForm.phone}
                    onChange={handlePartnerChange}
                    placeholder="+256..."
                  />

                </div>


                <div className="gi-field">

                  <label htmlFor="partner-message">
                    Partnership Proposal *
                  </label>

                  <textarea
                    id="partner-message"
                    name="message"
                    value={partnerForm.message}
                    onChange={handlePartnerChange}
                    placeholder="Tell us about the partnership or collaboration you have in mind."
                    rows="5"
                    required
                  />

                </div>


                {partnerStatus.success && (
                  <div className="gi-success">
                    ✓ {partnerStatus.success}
                  </div>
                )}

                {partnerStatus.error && (
                  <div className="gi-error">
                    {partnerStatus.error}
                  </div>
                )}


                <button
                  type="submit"
                  className="gi-submit-btn"
                  disabled={partnerStatus.loading}
                >
                  {partnerStatus.loading
                    ? "Submitting..."
                    : "Send Partnership Request →"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORT
      ===================================================== */}

      <section className="gi-support-section">

        <div className="container">

          <div className="gi-support-content">

            <div>

              <span className="gi-eyebrow">
                SUPPORT OUR WORK
              </span>

              <h2>
                Help us reach more communities.
              </h2>

              <p>
                Your support can contribute to health outreach,
                education, prevention initiatives and community
                empowerment.
              </p>

            </div>

            <Link
              to="/donate"
              className="gi-btn gi-btn-primary"
            >
              Donate & Support REHEMA →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT OPTIONS
      ===================================================== */}

      <section className="container gi-section">

        <div className="gi-heading">

          <span className="gi-eyebrow dark">
            TALK TO US
          </span>

          <h2>
            Have a question or another way to help?
          </h2>

          <p>
            Contact REHEMA directly and our team will be happy
            to hear from you.
          </p>

        </div>


        <div className="gi-contact-grid">

          <a
            href={`mailto:${contactEmail}`}
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              ✉
            </span>

            <div>
              <span>Email</span>
              <strong>
                {contactEmail}
              </strong>
            </div>
          </a>


          <a
            href="tel:+256393239910"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              ☎
            </span>

            <div>
              <span>Call Us</span>
              <strong>
                +256 39 3239910
              </strong>
            </div>
          </a>


          <a
            href="https://wa.me/256702952694"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              WA
            </span>

            <div>
              <span>WhatsApp</span>
              <strong>
                +256 702 952 694
              </strong>
            </div>
          </a>


          <a
            href="https://www.facebook.com/share/1HmhYn5hJX/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="gi-contact-card"
          >
            <span className="gi-contact-icon">
              f
            </span>

            <div>
              <span>Facebook</span>
              <strong>
                Rural Empowerment on Health Management
              </strong>
            </div>
          </a>

        </div>

      </section>


      {/* =====================================================
          LOCATION
      ===================================================== */}

      <section className="gi-location-section">

        <div className="container">

          <div className="gi-location-card">

            <div>

              <span className="gi-eyebrow dark">
                FIND US
              </span>

              <h2>
                Visit REHEMA
              </h2>

              <p>
                Plot 1580, Block 1 at BUKASAKYA SUBCOUNTY,
                Florida Road, Nauyo-Bugema.
              </p>

            </div>


            <Link
              to="/contact"
              className="gi-outline-btn"
            >
              Contact REHEMA →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="gi-final-cta">

        <div className="container">

          <span className="gi-eyebrow">
            TOGETHER
          </span>

          <h2>
            Healthier communities start with people who care.
          </h2>

          <p>
            Join REHEMA in creating practical, sustainable and
            community-centered solutions.
          </p>

          <div className="gi-final-actions">

            <Link
              to="/programs"
              className="gi-btn gi-btn-light"
            >
              Explore Our Programs
            </Link>

            <Link
              to="/contact"
              className="gi-btn gi-btn-primary"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

>>>>>>> d5654c452cbb6c15341a2a7d6601300e472486d0
