import React from "react";

import {
  Link,
  NavLink,
  Outlet
} from "react-router-dom";


export default function AdminLayout() {

  return (

    <div className="admin-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-logo">
            R
          </div>

          <div>
            <h2>REHEMA</h2>
            <span>Administration</span>
          </div>

        </div>


        <nav className="admin-nav">

          <p className="admin-nav-title">
            MAIN MENU
          </p>


          <NavLink
            to="/admin"
            end
          >
            <span>▦</span>
            Dashboard
          </NavLink>


          <NavLink to="/admin/posts">
            <span>📰</span>
            News & Stories
          </NavLink>


          <NavLink to="/admin/programs">
            <span>▣</span>
            Programs
          </NavLink>


          <NavLink to="/admin/events">
            <span>📅</span>
            Events
          </NavLink>


          <NavLink to="/admin/gallery">
            <span>🖼️</span>
            Gallery
          </NavLink>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <Link to="/">
            <span>←</span>
            Back to Website
          </Link>

        </div>

      </aside>

        <NavLink to="/admin/volunteers">
          <span>👥</span>
          Volunteers
        </NavLink>


      {/* =========================
          MAIN ADMIN AREA
      ========================= */}

      <div className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <h1>
              REHEMA Admin
            </h1>

            <p>
              Manage your website content
            </p>

          </div>


          <Link
            to="/"
            className="admin-view-site"
          >
            View Website
          </Link>

        </header>


        {/* PAGE CONTENT */}

        <main className="admin-content">

          <Outlet />

        </main>

      </div>

    </div>

  );

}