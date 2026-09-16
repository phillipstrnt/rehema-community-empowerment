
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const REHEMA_LOGO =
  "https://res.cloudinary.com/ttymyelh/image/upload/v1788243561/logo.jpg";

const mainMenu = [
  {
    label: "Dashboard",
    icon: "📊",
    path: "/admin",
    end: true,
  },
  {
    label: "Posts",
    icon: "📰",
    path: "/admin/posts",
  },
  {
    label: "Programs",
    icon: "📋",
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
];

const managementMenu = [
  {
    label: "Volunteers",
    icon: "🙋",
    path: "/admin/volunteers",
  },
  {
    label: "Partners",
    icon: "🤝",
    path: "/admin/partners",
  },
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
    label: "Users",
    icon: "👥",
    path: "/admin/users",
  },
];

const getAdminToken = () => {
  return (
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token")
  );
};

const getAdminUser = () => {
  try {
    const stored =
      localStorage.getItem("rehema_admin_user") ||
      sessionStorage.getItem("rehema_admin_user");

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const authenticatedFetch = async (
  endpoint,
  options = {}
) => {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    throw new Error(
      "Your admin session has expired. Please log in again."
    );
  }

  return response;
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const notificationRef = useRef(null);
  const themeRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [themeOpen, setThemeOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const [adminUser, setAdminUser] =
    useState(null);

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("rehema_admin_theme") ||
      "system"
    );
  });

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      navigate("/admin/login", {
        replace: true,
      });
      return;
    }

    setAdminUser(getAdminUser());
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(
      "rehema_admin_theme",
      theme
    );

    const root = document.documentElement;

    if (theme === "system") {
      root.removeAttribute("data-admin-theme");
    } else {
      root.setAttribute(
        "data-admin-theme",
        theme
      );
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute(
        "data-admin-theme"
      );
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!getAdminToken()) return;

    try {
      setLoadingNotifications(true);

      const response =
        await authenticatedFetch(
          "/notifications"
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch notifications"
        );
      }

      const data = await response.json();

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      30000
    );

    return () => {
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    setSidebarOpen(false);
    setNotificationsOpen(false);
    setThemeOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationsOpen(false);
      }

      if (
        themeRef.current &&
        !themeRef.current.contains(event.target)
      ) {
        setThemeOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setSidebarOpen(false);
      setNotificationsOpen(false);
      setThemeOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const toggleSidebar = () => {
    setNotificationsOpen(false);
    setThemeOpen(false);

    setSidebarOpen((current) => !current);
  };

  const toggleNotifications = () => {
    setSidebarOpen(false);
    setThemeOpen(false);

    setNotificationsOpen((current) => {
      const nextState = !current;

      if (nextState) {
        fetchNotifications();
      }

      return nextState;
    });
  };

  const toggleThemeMenu = () => {
    setSidebarOpen(false);
    setNotificationsOpen(false);

    setThemeOpen((current) => !current);
  };

  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setThemeOpen(false);
  };

  const markNotificationRead = async (
    notification
  ) => {
    if (
      !notification?._id ||
      notification.read
    ) {
      return;
    }

    try {
      await authenticatedFetch(
        `/notifications/${notification._id}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await authenticatedFetch(
        "/notifications/read-all",
        {
          method: "PATCH",
        }
      );

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  const handleLogout = () => {
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

    setSidebarOpen(false);
    setNotificationsOpen(false);
    setThemeOpen(false);

    navigate("/admin/login", {
      replace: true,
    });
  };

  const pageTitle = useMemo(() => {
    const allItems = [
      ...mainMenu,
      ...managementMenu,
      ...systemMenu,
    ];

    const matched = allItems.find((item) => {
      if (item.end) {
        return (
          location.pathname === item.path
        );
      }

      return (
        location.pathname === item.path ||
        location.pathname.startsWith(
          `${item.path}/`
        )
      );
    });

    return (
      matched?.label ||
      "Admin Dashboard"
    );
  }, [location.pathname]);

  const notificationIcon = (type) => {
    switch (type) {
      case "post":
        return "📰";
      case "program":
        return "📋";
      case "event":
        return "📅";
      case "gallery":
        return "🖼️";
      case "volunteer":
        return "🙋";
      case "partner":
        return "🤝";
      case "donation":
        return "💰";
      case "message":
        return "✉️";
      case "newsletter":
        return "📧";
      default:
        return "🔔";
    }
  };

  const formatNotificationDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };

  const renderMenu = (
    items,
    sectionTitle
  ) => {
    return (
      <div className="admin-sidebar-section">
        <div className="admin-sidebar-section-title">
          {sectionTitle}
        </div>

        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className="admin-nav-link"
            onClick={() => {
              setSidebarOpen(false);
              setNotificationsOpen(false);
              setThemeOpen(false);
            }}
          >
            <span className="admin-nav-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    );
  };

  const userName =
    adminUser?.name ||
    adminUser?.username ||
    "Administrator";

  const userRole =
    adminUser?.role ||
    "Administrator";

  const userInitial =
    userName?.charAt(0)?.toUpperCase() ||
    "A";

  const currentThemeLabel =
    theme === "light"
      ? "Light"
      : theme === "dark"
      ? "Dark"
      : "System";

  const currentThemeIcon =
    theme === "light"
      ? "☀️"
      : theme === "dark"
      ? "🌙"
      : "🌓";

  return (
    <div className="admin-layout">
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <img
              src={REHEMA_LOGO}
              alt="REHEMA Foundation logo"
            />
          </div>

          <div className="admin-sidebar-brand">
            <strong>
              REHEMA Foundation
            </strong>

            <span>
              Administration
            </span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {renderMenu(
            mainMenu,
            "Main"
          )}

          {renderMenu(
            managementMenu,
            "Management"
          )}

          {renderMenu(
            systemMenu,
            "System"
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-user">
            <div className="admin-sidebar-footer-avatar">
              {userInitial}
            </div>

            <div className="admin-sidebar-footer-info">
              <strong>
                {userName}
              </strong>

              <span>
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`admin-sidebar-overlay ${
          sidebarOpen ? "active" : ""
        }`}
        onClick={() =>
          setSidebarOpen(false)
        }
      />

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-button"
              onClick={toggleSidebar}
              aria-label={
                sidebarOpen
                  ? "Close sidebar"
                  : "Open sidebar"
              }
              aria-expanded={
                sidebarOpen
              }
            >
              {sidebarOpen
                ? "✕"
                : "☰"}
            </button>

            <div className="admin-page-heading">
              <h1>{pageTitle}</h1>

              <p>
                REHEMA Foundation
                administration
              </p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div
              className="admin-notification-wrapper"
              ref={notificationRef}
            >
              <button
                type="button"
                className={`admin-notification-button ${
                  notificationsOpen
                    ? "active"
                    : ""
                }`}
                onClick={
                  toggleNotifications
                }
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
              >
                🔔

                {unreadCount > 0 && (
                  <span className="admin-notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="admin-notification-panel">
                  <div className="admin-notification-header">
                    <h3>
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={
                          markAllNotificationsRead
                        }
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="admin-notification-list">
                    {loadingNotifications ? (
                      <div className="admin-notification-empty">
                        Loading
                        notifications...
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div className="admin-notification-empty">
                        No notifications
                        yet.
                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <div
                            key={
                              notification._id
                            }
                            className={`admin-notification-item ${
                              notification.read
                                ? ""
                                : "unread"
                            }`}
                            onClick={() =>
                              markNotificationRead(
                                notification
                              )
                            }
                          >
                            <div className="admin-notification-icon">
                              {notificationIcon(
                                notification.type
                              )}
                            </div>

                            <div className="admin-notification-content">
                              <h4>
                                {
                                  notification.title
                                }
                              </h4>

                              <p>
                                {
                                  notification.message
                                }
                              </p>

                              <div className="admin-notification-time">
                                {formatNotificationDate(
                                  notification.createdAt
                                )}
                              </div>
                            </div>
                          </div>
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
                          "/admin"
                        );
                      }}
                    >
                      Close
                      notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="admin-theme-wrapper"
              ref={themeRef}
            >
              <button
                type="button"
                className={`admin-theme-button ${
                  themeOpen
                    ? "active"
                    : ""
                }`}
                onClick={
                  toggleThemeMenu
                }
                aria-label="Choose theme"
                aria-expanded={
                  themeOpen
                }
              >
                <span className="admin-theme-icon">
                  {currentThemeIcon}
                </span>

                <span className="admin-theme-label">
                  {currentThemeLabel}
                </span>

                <span className="admin-theme-arrow">
                  {themeOpen
                    ? "⌃"
                    : "⌄"}
                </span>
              </button>

              {themeOpen && (
                <div className="admin-theme-menu">
                  <div className="admin-theme-menu-title">
                    <strong>
                      Appearance
                    </strong>

                    <span>
                      Choose your dashboard
                      theme
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`admin-theme-option ${
                      theme === "light"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectTheme(
                        "light"
                      )
                    }
                  >
                    <span className="admin-theme-option-icon">
                      ☀️
                    </span>

                    <span className="admin-theme-option-content">
                      <strong>
                        Light
                      </strong>

                      <small>
                        Bright dashboard
                      </small>
                    </span>

                    {theme ===
                      "light" && (
                      <span className="admin-theme-check">
                        ✓
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`admin-theme-option ${
                      theme === "dark"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectTheme(
                        "dark"
                      )
                    }
                  >
                    <span className="admin-theme-option-icon">
                      🌙
                    </span>

                    <span className="admin-theme-option-content">
                      <strong>
                        Dark
                      </strong>

                      <small>
                        Dark dashboard
                      </small>
                    </span>

                    {theme ===
                      "dark" && (
                      <span className="admin-theme-check">
                        ✓
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`admin-theme-option ${
                      theme ===
                      "system"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectTheme(
                        "system"
                      )
                    }
                  >
                    <span className="admin-theme-option-icon">
                      🌓
                    </span>

                    <span className="admin-theme-option-content">
                      <strong>
                        System
                      </strong>

                      <small>
                        Follow device
                        settings
                      </small>
                    </span>

                    {theme ===
                      "system" && (
                      <span className="admin-theme-check">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="admin-user-summary">
              <div className="admin-user-avatar">
                {userInitial}
              </div>

              <div className="admin-user-details">
                <strong>
                  {userName}
                </strong>

                <span>
                  {userRole}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <span className="admin-logout-icon">
                ↪
              </span>

              <span className="admin-logout-text">
                Logout
              </span>
            </button>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}