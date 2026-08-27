
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const mainMenu = [
  {
    label: "Dashboard",
    icon: "▣",
    path: "/admin",
  },
  {
    label: "News & Stories",
    icon: "📰",
    path: "/admin/posts",
  },
  {
    label: "Programs",
    icon: "▣",
    path: "/admin/programs",
  },
  {
    label: "Events",
    icon: "📅",
    path: "/admin/events",
  },
  {
    label: "Gallery",
    icon: "🖼️",
    path: "/admin/gallery",
  },
  {
    label: "Volunteers",
    icon: "👥",
    path: "/admin/volunteers",
  },
  {
  label: "Partners",
  icon: "🤝",
  path: "/admin/partners",
  },
];

const communicationMenu = [
  {
    label: "Donations",
    icon: "💰",
    path: "/admin/donations",
  },
  {
    label: "Messages",
    icon: "✉️",
    path: "/admin/messages",
  },
  {
    label: "Newsletter",
    icon: "📧",
    path: "/admin/newsletter",
  },
];

const systemMenu = [
  {
    label: "Settings",
    icon: "⚙️",
    path: "/admin/settings",
  },
  {
    label: "Admin Users",
    icon: "🔐",
    path: "/admin/users",
  },
];

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

    if (!confirmed) {
      return;
    }

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">
            R
          </div>

          <div className="admin-brand-text">
            <strong>REHEMA</strong>
            <span>ADMINISTRATION</span>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-heading">
              MAIN MENU
            </span>

            {renderMenu(mainMenu)}
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-heading">
              COMMUNICATION
            </span>

            {renderMenu(communicationMenu)}
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-heading">
              SYSTEM
            </span>

            {renderMenu(systemMenu)}
          </div>
        </nav>

        {/* Logout */}
        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="admin-topbar-title">
            Administration
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
