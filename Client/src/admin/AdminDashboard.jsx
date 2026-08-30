
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/* =========================================================
   GET SAVED ADMIN TOKEN
========================================================= */

const getAdminToken = () => {
  return (
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token")
  );
};


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {

  /* =======================================================
     STATE
  ======================================================= */

  const [stats, setStats] = useState({
    posts: 0,
    programs: 0,
    events: 0,
    gallery: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =======================================================
     FETCH DASHBOARD STATISTICS
  ======================================================= */

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setError("");

        const token = getAdminToken();

        if (!token) {
          setError("Administrator authentication is required.");
          setLoading(false);
          return;
        }


        /* ---------------------------------------------------
           COMMON REQUEST OPTIONS
        --------------------------------------------------- */

        const requestOptions = {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        };


        /* ---------------------------------------------------
           FETCH ALL FOUR RESOURCES
        --------------------------------------------------- */

        const [
          postsResponse,
          programsResponse,
          eventsResponse,
          galleryResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/posts`,
            requestOptions
          ),

          fetch(
            `${API_URL}/programs`,
            requestOptions
          ),

          fetch(
            `${API_URL}/events`,
            requestOptions
          ),

          fetch(
            `${API_URL}/gallery`,
            requestOptions
          ),
        ]);


        /* ---------------------------------------------------
           CHECK RESPONSES
        --------------------------------------------------- */

        if (!postsResponse.ok) {
          throw new Error("Failed to load news stories.");
        }

        if (!programsResponse.ok) {
          throw new Error("Failed to load programs.");
        }

        if (!eventsResponse.ok) {
          throw new Error("Failed to load events.");
        }

        if (!galleryResponse.ok) {
          throw new Error("Failed to load gallery.");
        }


        /* ---------------------------------------------------
           CONVERT RESPONSES TO JSON
        --------------------------------------------------- */

        const posts =
          await postsResponse.json();

        const programs =
          await programsResponse.json();

        const events =
          await eventsResponse.json();

        const gallery =
          await galleryResponse.json();


        /* ---------------------------------------------------
           UPDATE DASHBOARD
        --------------------------------------------------- */

        setStats({
          posts: Array.isArray(posts)
            ? posts.length
            : 0,

          programs: Array.isArray(programs)
            ? programs.length
            : 0,

          events: Array.isArray(events)
            ? events.length
            : 0,

          gallery: Array.isArray(gallery)
            ? gallery.length
            : 0,
        });

      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error.message ||
          "Unable to load dashboard statistics."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  /* =======================================================
     DISPLAY NUMBER
  ======================================================= */

  const displayNumber = (value) => {

    if (loading) {
      return "…";
    }

    return value;

  };


  return (

    <div className="dashboard">


      {/* =====================================================
          DASHBOARD HEADER CARD
      ===================================================== */}

      <section className="dashboard-welcome-card">

        <div className="dashboard-welcome-content">

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Welcome back, Administrator. Manage REHEMA's
            website content and community information from
            one place.
          </p>

        </div>


        <div className="dashboard-welcome-mark">
          R
        </div>

      </section>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (

        <div
          className="dashboard-error"
          role="alert"
        >

          <span>
            ⚠️
          </span>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="dashboard-stats">


        {/* =================================================
            NEWS
        ================================================= */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon news-icon">
              📰
            </div>

            <span className="stat-status">
              CONTENT
            </span>

          </div>


          <div className="stat-card-body">

            <span className="stat-label">
              NEWS STORIES
            </span>

            <strong className="stat-number">
              {displayNumber(stats.posts)}
            </strong>

            <small>
              Published stories
            </small>

          </div>

        </div>


        {/* =================================================
            PROGRAMS
        ================================================= */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon program-icon">
              ❤️
            </div>

            <span className="stat-status">
              ACTIVE
            </span>

          </div>


          <div className="stat-card-body">

            <span className="stat-label">
              PROGRAMS
            </span>

            <strong className="stat-number">
              {displayNumber(stats.programs)}
            </strong>

            <small>
              Community programs
            </small>

          </div>

        </div>


        {/* =================================================
            EVENTS
        ================================================= */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon event-icon">
              📅
            </div>

            <span className="stat-status">
              UPCOMING
            </span>

          </div>


          <div className="stat-card-body">

            <span className="stat-label">
              EVENTS
            </span>

            <strong className="stat-number">
              {displayNumber(stats.events)}
            </strong>

            <small>
              Upcoming events
            </small>

          </div>

        </div>


        {/* =================================================
            GALLERY
        ================================================= */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon gallery-icon">
              🖼️
            </div>

            <span className="stat-status">
              MEDIA
            </span>

          </div>


          <div className="stat-card-body">

            <span className="stat-label">
              GALLERY
            </span>

            <strong className="stat-number">
              {displayNumber(stats.gallery)}
            </strong>

            <small>
              Photos & videos
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          LOWER DASHBOARD AREA
      ===================================================== */}

      <div className="dashboard-main-grid">


        {/* =================================================
            CONTENT MANAGEMENT CARD
        ================================================= */}

        <section className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="panel-eyebrow">
                WEBSITE
              </span>

              <h2>
                Content Management
              </h2>

              <p>
                Manage the content displayed across
                the REHEMA website.
              </p>

            </div>

          </div>


          <div className="management-grid">


            {/* NEWS */}

            <Link
              to="/admin/posts"
              className="management-card"
            >

              <div className="management-icon news-management-icon">
                📰
              </div>

              <div className="management-content">

                <h3>
                  News & Stories
                </h3>

                <p>
                  Create, edit and manage REHEMA
                  news and community stories.
                </p>

                <span>
                  Manage News
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* PROGRAMS */}

            <Link
              to="/admin/programs"
              className="management-card"
            >

              <div className="management-icon program-management-icon">
                ❤️
              </div>

              <div className="management-content">

                <h3>
                  Programs
                </h3>

                <p>
                  Manage health programs and
                  community initiatives.
                </p>

                <span>
                  Manage Programs
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* EVENTS */}

            <Link
              to="/admin/events"
              className="management-card"
            >

              <div className="management-icon event-management-icon">
                📅
              </div>

              <div className="management-content">

                <h3>
                  Events
                </h3>

                <p>
                  Create and manage upcoming
                  REHEMA events.
                </p>

                <span>
                  Manage Events
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* GALLERY */}

            <Link
              to="/admin/gallery"
              className="management-card"
            >

              <div className="management-icon gallery-management-icon">
                🖼️
              </div>

              <div className="management-content">

                <h3>
                  Gallery
                </h3>

                <p>
                  Manage photos, videos and
                  community media.
                </p>

                <span>
                  Manage Gallery
                  <b>→</b>
                </span>

              </div>

            </Link>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS CARD
        ================================================= */}

        <section className="dashboard-panel quick-actions-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="panel-eyebrow">
                SHORTCUTS
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Quickly create or upload new content.
              </p>

            </div>

          </div>


          <div className="quick-actions">


            {/* ADD NEWS */}

            <Link
              to="/admin/posts/new"
              className="quick-action"
            >

              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-text">

                <strong>
                  Add News Story
                </strong>

                <small>
                  Publish a new story
                </small>

              </span>

              <span className="quick-action-arrow">
                →
              </span>

            </Link>


            {/* ADD PROGRAM */}

            <Link
              to="/admin/programs/new"
              className="quick-action"
            >

              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-text">

                <strong>
                  Add Program
                </strong>

                <small>
                  Create a community program
                </small>

              </span>

              <span className="quick-action-arrow">
                →
              </span>

            </Link>


            {/* ADD EVENT */}

            <Link
              to="/admin/events/new"
              className="quick-action"
            >

              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-text">

                <strong>
                  Add Event
                </strong>

                <small>
                  Schedule an upcoming event
                </small>

              </span>

              <span className="quick-action-arrow">
                →
              </span>

            </Link>


            {/* ADD GALLERY */}

            <Link
              to="/admin/gallery/new"
              className="quick-action"
            >

              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-text">

                <strong>
                  Add Gallery Media
                </strong>

                <small>
                  Upload photos or videos
                </small>

              </span>

              <span className="quick-action-arrow">
                →
              </span>

            </Link>

          </div>

        </section>

      </div>

    </div>

  );

}