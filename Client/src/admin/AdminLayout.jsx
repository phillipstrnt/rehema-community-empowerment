
import React, { useEffect, useRef, useState } from "react";
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
   INITIAL NOTIFICATIONS
========================================================= */

const initialNotifications = [
  {
    id: 1,
    type: "message",
    icon: "✉",
    title: "New message received",
    text: "A visitor has submitted a new contact message.",
    time: "Just now",
    read: false,
    path: "/admin/messages",
  },

  {
    id: 2,
    type: "volunteer",
    icon: "♟",
    title: "New volunteer application",
    text: "A new volunteer has submitted an application.",
    time: "10 minutes ago",
    read: false,
    path: "/admin/volunteers",
  },

  {
    id: 3,
    type: "donation",
    icon: "◆",
    title: "New donation received",
    text: "A new donation has been recorded.",
    time: "25 minutes ago",
    read: false,
    path: "/admin/donations",
  },

  {
    id: 4,
    type: "newsletter",
    icon: "◎",
    title: "New newsletter subscriber",
    text: "Someone has subscribed to the REHEMA newsletter.",
    time: "1 hour ago",
    read: true,
    path: "/admin/newsletter",
  },
];

/* =========================================================
   ADMIN LAYOUT
========================================================= */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const notificationRef = useRef(null);

  const navigate = useNavigate();

  /* =======================================================
     CLOSE NOTIFICATION PANEL WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  /* =======================================================
     NOTIFICATION FUNCTIONS
  ======================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = (notification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
    );

    setNotificationsOpen(false);

    if (notification.path) {
      navigate(notification.path);
    }
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /* =======================================================
     MENU RENDERER
  ======================================================= */

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


            <div className="admin-nav-section">

              <div className="admin-nav-heading">
                <span>MAIN MENU</span>
              </div>

              {renderMenu(mainMenu)}

            </div>



            <div className="admin-nav-section">


              <div className="admin-nav-heading">
                <span>COMMUNICATION</span>
              </div>

              {renderMenu(communicationMenu)}

            </div>



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

          {/* =================================================
              TOPBAR RIGHT
          ================================================= */}

          <div className="admin-topbar-right">

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              className="admin-notification-wrapper"
              ref={notificationRef}
            >

              <button
                type="button"
                className="admin-topbar-icon"
                aria-label="Notifications"
                title="Notifications"
                onClick={() =>
                  setNotificationsOpen(
                    (current) => !current
                  )
                }
              >

                🔔

                {unreadCount > 0 && (
                  <span className="admin-notification-badge">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}

              </button>

              {/* =================================================
                  NOTIFICATION DROPDOWN
              ================================================= */}

              {notificationsOpen && (
                <div className="admin-notification-panel">

                  <div className="admin-notification-header">

                    <div>
                      <strong>
                        Notifications
                      </strong>

                      <span>
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : "All caught up"}
                      </span>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="admin-mark-read"
                      >
                        Mark all read
                      </button>
                    )}

                  </div>

                  <div className="admin-notification-list">

                    {notifications.length === 0 ? (

                      <div className="admin-no-notifications">
                        <div>
                          ✓
                        </div>

                        <strong>
                          No notifications
                        </strong>

                        <span>
                          You're all caught up.
                        </span>
                      </div>

                    ) : (

                      notifications.map(
                        (notification) => (
                          <button
                            type="button"
                            key={notification.id}
                            className={`admin-notification-item ${
                              !notification.read
                                ? "unread"
                                : ""
                            }`}
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                          >

                            <span
                              className={`admin-notification-icon ${notification.type}`}
                            >
                              {notification.icon}
                            </span>

                            <span className="admin-notification-content">

                              <strong>
                                {notification.title}
                              </strong>

                              <span>
                                {notification.text}
                              </span>

                              <small>
                                {notification.time}
                              </small>

                            </span>

                            {!notification.read && (
                              <span className="admin-notification-unread-dot" />
                            )}

                          </button>
                        )
                      )

                    )}

                  </div>

                  <div className="admin-notification-footer">

                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/admin/messages");
                      }}
                    >
                      View communication center →
                    </button>

                  </div>

                </div>
              )}

            </div>

            <div className="admin-topbar-divider" />

            {/* PROFILE */}

            <button
              type="button"
              className="admin-profile-button"
              title="Administrator profile"
            >

              <div className="admin-profile-avatar">
                A
              </div>

              <div className="admin-profile-info">
                <strong>
                  Administrator
                </strong>

                <span>
                  Admin
                </span>
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