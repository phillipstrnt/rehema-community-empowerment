
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./AdminNewsletter.css";
import { api } from "../../utils/api";


export default function AdminNewsletter() {

  const [subscribers, setSubscribers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");


  /* =====================================================
     FETCH SUBSCRIBERS
  ===================================================== */

  const fetchSubscribers = async () => {

    try {

      setLoading(true);
      setError("");


      const data = await api("/newsletter/subscribers");
      setSubscribers(Array.isArray(data) ? data : data.subscribers || data.data || []);

    } catch (err) {

      console.error(
        "Newsletter subscribers error:",
        err
      );


      setError(
        err.message ||
        "Unable to load newsletter subscribers."
      );


      setSubscribers([]);


    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {

    fetchSubscribers();

  }, []);


  /* =====================================================
     FILTER SUBSCRIBERS
  ===================================================== */

  const filteredSubscribers =
    useMemo(() => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      return subscribers.filter(
        (subscriber) => {

          const email =
            subscriber.email ||
            "";

          const name =
            subscriber.name ||
            "";


          const matchesSearch =
            !searchValue ||
            email
              .toLowerCase()
              .includes(searchValue) ||
            name
              .toLowerCase()
              .includes(searchValue);


          const status =
            subscriber.status ||
            "active";


          const matchesStatus =
            statusFilter === "all" ||
            status === statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      subscribers,
      search,
      statusFilter,
    ]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeCount =
    subscribers.filter(
      (subscriber) =>
        subscriber.status !==
        "unsubscribed"
    ).length;


  const inactiveCount =
    subscribers.filter(
      (subscriber) =>
        subscriber.status ===
        "unsubscribed"
    ).length;


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
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


  /* =====================================================
     DELETE SUBSCRIBER
  ===================================================== */

  const deleteSubscriber =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to remove this subscriber?"
        );


      if (!confirmed) {
        return;
      }


      try {

        await api(`/newsletter/subscribers/${id}`, { method: "DELETE" });


        setSubscribers(
          (current) =>
            current.filter(
              (subscriber) =>
                subscriber._id !== id
            )
        );


      } catch (err) {

        console.error(
          "Delete subscriber error:",
          err
        );


        alert(
          err.message ||
          "Failed to remove subscriber."
        );

      }

    };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="admin-newsletter-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="newsletter-page-header">

        <div>

          <p className="newsletter-eyebrow">
            COMMUNICATION
          </p>


          <h1>
            Newsletter
          </h1>


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


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="newsletter-stat-grid">


        <div className="newsletter-stat-card">

          <span>
            Total Subscribers
          </span>


          <strong>
            {subscribers.length}
          </strong>

        </div>


        <div className="newsletter-stat-card">

          <span>
            Active
          </span>


          <strong>
            {activeCount}
          </strong>

        </div>


        <div className="newsletter-stat-card">

          <span>
            Inactive
          </span>


          <strong>
            {inactiveCount}
          </strong>

        </div>


      </div>


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="newsletter-toolbar">


        <div className="newsletter-search">

          <span>
            ⌕
          </span>


          <input
            type="text"
            placeholder="Search subscribers..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
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


          <option value="unsubscribed">
            Unsubscribed
          </option>

        </select>


      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="newsletter-error">

          <strong>
            Unable to load subscribers
          </strong>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={fetchSubscribers}
          >
            Try again
          </button>

        </div>

      )}


      {/* =================================================
          SUBSCRIBERS CARD
      ================================================= */}

      <div className="newsletter-card">


        <div className="newsletter-card-header">

          <div>

            <h2>
              Subscribers
            </h2>


            <span>

              {filteredSubscribers.length}{" "}

              {filteredSubscribers.length === 1
                ? "subscriber"
                : "subscribers"}

            </span>

          </div>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="newsletter-empty">

            <div className="newsletter-spinner" />


            <p>
              Loading subscribers...
            </p>

          </div>


        ) : filteredSubscribers.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

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

                : "Newsletter subscribers will appear here."
              }

            </p>

          </div>


        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="newsletter-table-wrapper">

            <table className="newsletter-table">


              <thead>

                <tr>

                  <th>
                    SUBSCRIBER
                  </th>


                  <th>
                    EMAIL
                  </th>


                  <th>
                    STATUS
                  </th>


                  <th>
                    DATE SUBSCRIBED
                  </th>


                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSubscribers.map(
                  (subscriber) => {

                    const status =
                      subscriber.status ||
                      "active";


                    const displayName =
                      subscriber.name ||
                      "Subscriber";


                    const avatarLetter =
                      (
                        subscriber.name ||
                        subscriber.email ||
                        "S"
                      )
                        .charAt(0)
                        .toUpperCase();


                    return (

                      <tr
                        key={
                          subscriber._id
                        }
                      >


                        <td>

                          <div className="subscriber-cell">

                            <div className="subscriber-avatar">

                              {avatarLetter}

                            </div>


                            <strong>

                              {displayName}

                            </strong>

                          </div>

                        </td>


                        <td>

                          {subscriber.email ||
                            "—"}

                        </td>


                        <td>

                          <span
                            className={
                              `subscriber-status status-${status}`
                            }
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
