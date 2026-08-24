import React from "react";

import { Link } from "react-router-dom";


export default function AdminDashboard() {

  return (

    <div className="dashboard">

      {/* PAGE HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage REHEMA's website content and
            community information from one place.
          </p>

        </div>

      </div>


      {/* STATISTICS */}

      <section className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon news-icon">
            📰
          </div>

          <div>

            <span>
              NEWS STORIES
            </span>

            <strong>
              --
            </strong>

            <small>
              Database content
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon program-icon">
            ❤️
          </div>

          <div>

            <span>
              PROGRAMS
            </span>

            <strong>
              --
            </strong>

            <small>
              Community programs
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon event-icon">
            📅
          </div>

          <div>

            <span>
              EVENTS
            </span>

            <strong>
              --
            </strong>

            <small>
              Upcoming events
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon gallery-icon">
            🖼️
          </div>

          <div>

            <span>
              GALLERY
            </span>

            <strong>
              --
            </strong>

            <small>
              Photos & videos
            </small>

          </div>

        </div>

      </section>


      {/* MANAGEMENT */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Content Management
            </h2>

            <p>
              Choose what you want to manage.
            </p>

          </div>

        </div>


        <div className="management-grid">


          <Link
            to="/admin/posts"
            className="management-card"
          >

            <div className="management-icon">
              📰
            </div>

            <div className="management-content">

              <h3>
                News & Stories
              </h3>

              <p>
                Create, edit and manage REHEMA
                news, stories and updates.
              </p>

              <span>
                Manage News →
              </span>

            </div>

          </Link>


          <Link
            to="/admin/programs"
            className="management-card"
          >

            <div className="management-icon">
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
                Manage Programs →
              </span>

            </div>

          </Link>


          <Link
            to="/admin/events"
            className="management-card"
          >

            <div className="management-icon">
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
                Manage Events →
              </span>

            </div>

          </Link>


          <Link
            to="/admin/gallery"
            className="management-card"
          >

            <div className="management-icon">
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
                Manage Gallery →
              </span>

            </div>

          </Link>

        </div>

      </section>


      {/* QUICK ACTIONS */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Frequently used content actions.
            </p>

          </div>

        </div>


        <div className="quick-actions">

          <Link
            to="/admin/posts/new"
            className="quick-action"
          >
            <span>＋</span>
            Add News Story
          </Link>


          <Link
            to="/admin/programs/new"
            className="quick-action"
          >
            <span>＋</span>
            Add Program
          </Link>


          <Link
            to="/admin/events/new"
            className="quick-action"
          >
            <span>＋</span>
            Add Event
          </Link>


          <Link
            to="/admin/gallery/new"
            className="quick-action"
          >
            <span>＋</span>
            Add Gallery Media
          </Link>

        </div>

      </section>

    </div>

  );

}