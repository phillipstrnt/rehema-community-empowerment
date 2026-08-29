
import React, { useEffect, useMemo, useState } from "react";
import "./AdminNewsletter.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/newsletter`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subscribers");
      }

      const data = await response.json();

      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Newsletter error:", err);

      setError(
        "Unable to load newsletter subscribers. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        subscriber.email
          ?.toLowerCase()
          .includes(searchValue) ||
        subscriber.name
          ?.toLowerCase()
          .includes(searchValue);

      const status =
        subscriber.status ||
        (subscriber.subscribed === false
          ? "inactive"
          : "active");

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    subscribers,
    search,
    statusFilter,
  ]);

  const activeCount = subscribers.filter(
    (subscriber) =>
      subscriber.status === "active" ||
      subscriber.status === undefined &&
      subscriber.subscribed !== false
  ).length;

  const inactiveCount = subscribers.filter(
    (subscriber) =>
      subscriber.status === "inactive" ||
      subscriber.subscribed === false
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const deleteSubscriber = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this subscriber?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/newsletter/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete subscriber"
        );
      }

      setSubscribers((current) =>
        current.filter(
          (subscriber) =>
            subscriber._id !== id
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove subscriber.");
    }
  };

  return (
    <div className="admin-newsletter-page">

      {/* PAGE HEADER */}

      <div className="newsletter-page-header">

        <div>
          <p className="newsletter-eyebrow">
            COMMUNICATION
          </p>

          <h1>Newsletter</h1>

          <p className="newsletter-subtitle">
            Manage people subscribed to the
            REHEMA Foundation newsletter.
          </p>
        </div>

        <button
          type="button"
          className="newsletter-refresh-button"
          onClick={fetchSubscribers}
          disabled={loading}
        >
          ↻{" "}
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* STATISTICS */}

      <div className="newsletter-stat-grid">

        <div className="newsletter-stat-card">
          <span>Total Subscribers</span>

          <strong>
            {subscribers.length}
          </strong>
        </div>

        <div className="newsletter-stat-card">
          <span>Active</span>

          <strong>
            {activeCount}
          </strong>
        </div>

        <div className="newsletter-stat-card">
          <span>Inactive</span>

          <strong>
            {inactiveCount}
          </strong>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="newsletter-toolbar">

        <div className="newsletter-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search subscribers..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="all">
            All subscribers
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

      </div>


      {/* ERROR */}

      {error && (
        <div className="newsletter-error">

          <strong>
            Unable to load subscribers
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchSubscribers}
          >
            Try again
          </button>

        </div>
      )}


      {/* SUBSCRIBERS */}

      <div className="newsletter-card">

        <div className="newsletter-card-header">

          <div>
            <h2>Subscribers</h2>

            <span>
              {filteredSubscribers.length}{" "}
              {filteredSubscribers.length === 1
                ? "subscriber"
                : "subscribers"}
            </span>
          </div>

        </div>


        {loading ? (

          <div className="newsletter-empty">

            <div className="newsletter-spinner" />

            <p>
              Loading subscribers...
            </p>

          </div>

        ) : filteredSubscribers.length === 0 ? (

          <div className="newsletter-empty">

            <div className="newsletter-empty-icon">
              ◎
            </div>

            <h3>
              No subscribers found
            </h3>

            <p>
              {search ||
              statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Newsletter subscribers will appear here."}
            </p>

          </div>

        ) : (

          <div className="newsletter-table-wrapper">

            <table className="newsletter-table">

              <thead>

                <tr>
                  <th>SUBSCRIBER</th>
                  <th>EMAIL</th>
                  <th>STATUS</th>
                  <th>DATE SUBSCRIBED</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {filteredSubscribers.map(
                  (subscriber) => {

                    const status =
                      subscriber.status ||
                      (subscriber.subscribed === false
                        ? "inactive"
                        : "active");

                    return (
                      <tr
                        key={subscriber._id}
                      >

                        <td>

                          <div className="subscriber-cell">

                            <div className="subscriber-avatar">
                              {(subscriber.name ||
                                subscriber.email ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {subscriber.name ||
                                "Subscriber"}
                            </strong>

                          </div>

                        </td>


                        <td>
                          {subscriber.email ||
                            "—"}
                        </td>


                        <td>

                          <span
                            className={`subscriber-status status-${status}`}
                          >
                            {status}
                          </span>

                        </td>


                        <td>
                          {formatDate(
                            subscriber.createdAt
                          )}
                        </td>


                        <td>

                          <button
                            type="button"
                            className="newsletter-delete-button"
                            onClick={() =>
                              deleteSubscriber(
                                subscriber._id
                              )
                            }
                          >
                            ×
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}