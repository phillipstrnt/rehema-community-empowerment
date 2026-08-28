import React, { useState } from "react";
// import "./AdminLayout.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

/* =========================================================
   SIDEBAR MENUS
========================================================= */

const mainMenu = [
  {
    label: "Dashboard",
    icon: "▦",
    path: "/admin",
  },
  {
    label: "News & Stories",
    icon: "📰",
    path: "/admin/posts",
  },
  {
    label: "Programs",
    icon: "♥",
    path: "/admin/programs",
  },
  {
    label: "Events",
    icon: "▣",
    path: "/admin/events",
  },
  {
    label: "Gallery",
    icon: "▧",
    path: "/admin/gallery",
  },
  {
    label: "Volunteers",
    icon: "♟",
    path: "/admin/volunteers",
  },
  {
    label: "Partners",
    icon: "♣",
    path: "/admin/partners",
  },
];

const communicationMenu = [
  {
    label: "Donations",
    icon: "◆",
    path: "/admin/donations",
  },
  {
    label: "Messages",
    icon: "✉",
    path: "/admin/messages",
  },
  {
    label: "Newsletter",
    icon: "◎",
    path: "/admin/newsletter",
  },
];

const systemMenu = [
  {
    label: "Settings",
    icon: "⚙",
    path: "/admin/settings",
  },
  {
    label: "Admin Users",
    icon: "♙",
    path: "/admin/users",
  },
];

/* =========================================================
   ADMIN LAYOUT
========================================================= */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  const renderMenu = (items) => {
    return items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/admin"}
        onClick={closeSidebar}
        className={({ isActive }) =>
          `admin-nav-link ${isActive ? "active" : ""}`
        }
      >
        <span className="admin-nav-icon">
          {item.icon}
        </span>

        <span className="admin-nav-label">
          {item.label}
        </span>
      </NavLink>
    ));
  };

  return (
    <div className="admin-layout">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        {/* BRAND */}
        <div className="admin-sidebar-brand">

          <div className="admin-brand-mark">
            R
          </div>

          <div className="admin-brand-text">
            <strong>REHEMA</strong>
            <span>FOUNDATION</span>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            ×
          </button>

        </div>


        {/* SIDEBAR NAVIGATION */}

        <div className="admin-sidebar-scroll">

          <nav className="admin-sidebar-nav">

            {/* MAIN MENU */}
            <div className="admin-nav-section">

              <div className="admin-nav-heading">
                <span>MAIN MENU</span>
              </div>

              {renderMenu(mainMenu)}

            </div>


            {/* COMMUNICATION */}
            <div className="admin-nav-section">

              <div className="admin-nav-heading">
                <span>COMMUNICATION</span>
              </div>

              {renderMenu(communicationMenu)}

            </div>


            {/* SYSTEM */}
            <div className="admin-nav-section">

              <div className="admin-nav-heading">
                <span>SYSTEM</span>
              </div>

              {renderMenu(systemMenu)}

            </div>

          </nav>

        </div>


        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div className="admin-user-info">
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span className="admin-logout-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <button
              type="button"
              className="admin-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div className="admin-breadcrumb">

              <span className="admin-breadcrumb-main">
                REHEMA
              </span>

              <span className="admin-breadcrumb-separator">
                /
              </span>

              <span className="admin-breadcrumb-current">
                Administration
              </span>

            </div>

          </div>


          {/* TOPBAR RIGHT */}

          <div className="admin-topbar-right">

            <button
              type="button"
              className="admin-topbar-icon"
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              <span className="admin-notification-dot" />
            </button>


            <div className="admin-topbar-divider" />


            <button
              type="button"
              className="admin-profile-button"
              title="Administrator profile"
            >

              <div className="admin-profile-avatar">
                A
              </div>

              <div className="admin-profile-info">
                <strong>Administrator</strong>
                <span>Admin</span>
              </div>

              <span className="admin-profile-arrow">
                ▾
              </span>

            </button>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );

}