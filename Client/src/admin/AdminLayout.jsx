
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./AdminLayout.css";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

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
   NOTIFICATION PATH
========================================================= */

const getNotificationPath = (notification) => {
  if (notification?.link) {
    return notification.link;
  }

  switch (notification?.type) {
    case "message":
      return "/admin/messages";

    case "volunteer":
      return "/admin/volunteers";

    case "donation":
      return "/admin/donations";

    case "newsletter":
      return "/admin/newsletter";

    case "partner":
      return "/admin/partners";

    case "event":
      return "/admin/events";

    case "program":
      return "/admin/programs";

    case "post":
      return "/admin/posts";

    case "gallery":
      return "/admin/gallery";

    default:
      return "/admin";
  }
};

/* =========================================================
   NOTIFICATION ICON
========================================================= */

const getNotificationIcon = (type) => {
  switch (type) {
    case "message":
      return "✉";

    case "volunteer":
      return "♟";

    case "donation":
      return "◆";

    case "newsletter":
      return "◎";

    case "partner":
      return "♣";

    case "event":
      return "▣";

    case "program":
      return "♥";

    case "post":
      return "📰";

    case "gallery":
      return "▧";

    default:
      return "●";
  }
};

/* =========================================================
   RELATIVE TIME
========================================================= */

const formatRelativeTime = (dateValue) => {
  if (!dateValue) {
    return "Just now";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();

  const difference = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (difference < 0 || difference < 10) {
    return "Just now";
  }

  if (difference < 60) {
    return `${difference} seconds ago`;
  }

  const minutes = Math.floor(difference / 60);

  if (minutes === 1) {
    return "1 minute ago";
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours === 1) {
    return "1 hour ago";
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks === 1) {
    return "1 week ago";
  }

  if (weeks < 5) {
    return `${weeks} weeks ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   ADMIN LAYOUT
========================================================= */

export default function AdminLayout() {
  /* =======================================================
     NAVIGATION

     IMPORTANT:
     There is ONLY ONE useNavigate declaration.
  ======================================================= */

  const navigate = useNavigate();

  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [adminUser, setAdminUser] =
    useState(null);

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notifications, setNotifications] =
    useState([]);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [notificationError, setNotificationError] =
    useState("");

  const [timeTick, setTimeTick] =
    useState(Date.now());

  const notificationRef =
    useRef(null);

  /* =======================================================
     GET CURRENT ADMIN TOKEN
     
     Remember me:
     localStorage

     Session login:
     sessionStorage
  ======================================================= */

  const getAdminToken = () => {
    return (
      localStorage.getItem(
        "rehema_admin_token"
      ) ||
      sessionStorage.getItem(
        "rehema_admin_token"
      )
    );
  };

  /* =======================================================
     CHECK AUTHENTICATION
  ======================================================= */

  useEffect(() => {
    const token = getAdminToken();

    const storedUser =
      localStorage.getItem(
        "rehema_admin_user"
      ) ||
      sessionStorage.getItem(
        "rehema_admin_user"
      );

    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);

      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    /* -----------------------------------------------
       Restore administrator information
    ------------------------------------------------ */

    if (storedUser) {
      try {
        setAdminUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.error(
          "Unable to read stored admin user:",
          error
        );
      }
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [navigate]);

  /* =======================================================
     AUTHENTICATED REQUEST HELPER
  ======================================================= */

  const authenticatedFetch =
    useCallback(
      async (url, options = {}) => {
        const token = getAdminToken();

        if (!token) {
          setIsAuthenticated(false);

          navigate("/admin/login", {
            replace: true,
          });

          throw new Error(
            "Administrator authentication required."
          );
        }

        const response = await fetch(
          url,
          {
            ...options,

            headers: {
              ...(options.headers || {}),
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        /* ---------------------------------------------
           Invalid or expired token
        --------------------------------------------- */

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "rehema_admin_token"
          );

          localStorage.removeItem(
            "rehema_admin_user"
          );

          sessionStorage.removeItem(
            "rehema_admin_token"
          );

          sessionStorage.removeItem(
            "rehema_admin_user"
          );

          setIsAuthenticated(false);
          setAdminUser(null);

          navigate("/admin/login", {
            replace: true,
          });
        }

        return response;
      },
      [navigate]
    );

  /* =======================================================
     FETCH NOTIFICATIONS
  ======================================================= */

  const fetchNotifications =
    useCallback(async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setNotificationsLoading(true);
        setNotificationError("");

        const response =
          await authenticatedFetch(
            `${API_URL}/notifications`
          );

        if (!response.ok) {
          throw new Error(
            `Notification request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        setNotifications(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Notification error:",
          error
        );

        if (
          error.message !==
          "Administrator authentication required."
        ) {
          setNotificationError(
            "Unable to load notifications."
          );
        }

      } finally {

        setNotificationsLoading(false);

      }
    }, [
      authenticatedFetch,
      isAuthenticated,
    ]);

  /* =======================================================
     INITIAL NOTIFICATION FETCH
  ======================================================= */

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [
    isAuthenticated,
    fetchNotifications,
  ]);

  /* =======================================================
     AUTO REFRESH NOTIFICATIONS
  ======================================================= */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isAuthenticated,
    fetchNotifications,
  ]);

  /* =======================================================
     UPDATE RELATIVE TIME
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(Date.now());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     CLOSE NOTIFICATIONS ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
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
     LOCK BODY SCROLL ON MOBILE SIDEBAR
  ======================================================= */

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add(
        "admin-sidebar-open"
      );
    } else {
      document.body.classList.remove(
        "admin-sidebar-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "admin-sidebar-open"
      );
    };
  }, [sidebarOpen]);

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

    if (!confirmed) {
      return;
    }

    /* -----------------------------------------------
       Remove persistent authentication
    ------------------------------------------------ */

    localStorage.removeItem(
      "rehema_admin_token"
    );

    localStorage.removeItem(
      "rehema_admin_user"
    );

    /* -----------------------------------------------
       Remove session authentication
    ------------------------------------------------ */

    sessionStorage.removeItem(
      "rehema_admin_token"
    );

    sessionStorage.removeItem(
      "rehema_admin_user"
    );

    setIsAuthenticated(false);
    setAdminUser(null);

    navigate("/admin/login", {
      replace: true,
    });
  };

  /* =======================================================
     UNREAD COUNT
  ======================================================= */

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.read !== true
    ).length;

  /* =======================================================
     TOGGLE NOTIFICATIONS
  ======================================================= */

  const toggleNotifications = () => {
    setNotificationsOpen(
      (current) => {
        const nextState = !current;

        if (nextState) {
          fetchNotifications();
        }

        return nextState;
      }
    );
  };

  /* =======================================================
     MARK ONE AS READ
  ======================================================= */

  const handleNotificationClick =
    async (notification) => {

      try {

        if (
          !notification.read &&
          notification._id
        ) {

          const response =
            await authenticatedFetch(
              `${API_URL}/notifications/${notification._id}/read`,
              {
                method: "PATCH",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to mark notification as read"
            );
          }
        }

      } catch (error) {

        console.error(
          "Failed to mark notification as read:",
          error
        );

      }

      setNotifications(
        (current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
      );

      setNotificationsOpen(false);

      navigate(
        getNotificationPath(
          notification
        )
      );
    };

  /* =======================================================
     MARK ALL AS READ
  ======================================================= */

  const markAllAsRead = async () => {

    try {

      const response =
        await authenticatedFetch(
          `${API_URL}/notifications/read-all`,
          {
            method: "PATCH",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to mark notifications as read"
        );
      }

      setNotifications(
        (current) =>
          current.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to mark all notifications as read."
      );

    }
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
          `admin-nav-link ${
            isActive ? "active" : ""
          }`
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

  /* =======================================================
     AUTH CHECK SCREEN
  ======================================================= */

  if (checkingAuth) {

    return (
      <div className="admin-auth-loading">

        <div className="login-spinner"></div>

        <p>
          Checking administrator access...
        </p>

      </div>
    );
  }

  /* =======================================================
     DO NOT RENDER DASHBOARD WITHOUT AUTH
  ======================================================= */

  if (!isAuthenticated) {
    return null;
  }

  /* =======================================================
     DISPLAY NAME
  ======================================================= */

  const displayName =
    adminUser?.name ||
    "Administrator";

  const displayRole =
    adminUser?.role === "super_admin"
      ? "Super Admin"
      : "Admin";

  /* =======================================================
     RENDER
  ======================================================= */

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

        {/* NAVIGATION */}

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

              {renderMenu(
                communicationMenu
              )}

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
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="admin-user-info">

              <strong>
                {displayName}
              </strong>

              <span>
                {displayRole}
              </span>

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
              onClick={() =>
                setSidebarOpen(true)
              }
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

            {/* NOTIFICATIONS */}

            <div
              className="admin-notification-wrapper"
              ref={notificationRef}
            >

              <button
                type="button"
                className="admin-topbar-icon"
                aria-label="Notifications"
                title="Notifications"
                onClick={
                  toggleNotifications
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

              {/* NOTIFICATION PANEL */}

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
                        onClick={
                          markAllAsRead
                        }
                        className="admin-mark-read"
                      >
                        Mark all read
                      </button>

                    )}

                  </div>

                  <div className="admin-notification-list">

                    {notificationsLoading ? (

                      <div className="admin-no-notifications">

                        <div>◷</div>

                        <strong>
                          Loading notifications...
                        </strong>

                      </div>

                    ) : notificationError ? (

                      <div className="admin-no-notifications">

                        <div>!</div>

                        <strong>
                          {notificationError}
                        </strong>

                        <button
                          type="button"
                          onClick={
                            fetchNotifications
                          }
                          className="admin-notification-retry"
                        >
                          Try again
                        </button>

                      </div>

                    ) : notifications.length === 0 ? (

                      <div className="admin-no-notifications">

                        <div>✓</div>

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
                            key={
                              notification._id ||
                              notification.id
                            }
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
                              className={`admin-notification-icon ${
                                notification.type ||
                                "default"
                              }`}
                            >
                              {getNotificationIcon(
                                notification.type
                              )}
                            </span>

                            <span className="admin-notification-content">

                              <strong>
                                {notification.title ||
                                  "Notification"}
                              </strong>

                              <span>
                                {notification.message ||
                                  notification.text ||
                                  ""}
                              </span>

                              <small>
                                {timeTick &&
                                  formatRelativeTime(
                                    notification.createdAt
                                  )}
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
                        setNotificationsOpen(
                          false
                        );

                        navigate(
                          "/admin/messages"
                        );
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
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="admin-profile-info">

                <strong>
                  {displayName}
                </strong>

                <span>
                  {displayRole}
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