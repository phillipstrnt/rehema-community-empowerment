import React from "react";

import { Link } from "react-router-dom";


export default function AdminDashboard() {

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
          STATISTICS
      ===================================================== */}

      <section className="dashboard-stats">

        {/* NEWS */}

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
              --
            </strong>

            <small>
              Published stories
            </small>

          </div>

        </div>


        {/* PROGRAMS */}

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
              --
            </strong>

            <small>
              Community programs
            </small>

          </div>

        </div>


        {/* EVENTS */}

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
              --
            </strong>

            <small>
              Upcoming events
            </small>

          </div>

        </div>


        {/* GALLERY */}

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
              --
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