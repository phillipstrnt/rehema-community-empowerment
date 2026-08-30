
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../../utils/api";


/* =========================================================
   ADMIN NEWSLETTER SUBSCRIBERS
========================================================= */

export default function AdminSubscribers() {

  const [subscribers, setSubscribers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /* =========================================================
     LOAD SUBSCRIBERS
  ========================================================= */

  const fetchSubscribers =
    async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await api(
            "/newsletter/subscribers"
          );


        if (Array.isArray(data)) {

          setSubscribers(data);

        } else if (
          Array.isArray(
            data?.subscribers
          )
        ) {

          setSubscribers(
            data.subscribers
          );

        } else if (
          Array.isArray(
            data?.data
          )
        ) {

          setSubscribers(
            data.data
          );

        } else {

          setSubscribers([]);

        }

      } catch (err) {

        console.error(
          "Subscribers error:",
          err
        );


        setError(
          err.message ||
          "Unable to load newsletter subscribers."
        );

      } finally {

        setLoading(false);

      }

    };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    fetchSubscribers();

  }, []);


  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredSubscribers =
    useMemo(() => {

      const value =
        search
          .toLowerCase()
          .trim();


      if (!value) {

        return subscribers;

      }


      return subscribers.filter(
        (subscriber) =>
          subscriber.email
            ?.toLowerCase()
            .includes(value)
      );

    }, [
      subscribers,
      search,
    ]);


  /* =========================================================
     DELETE SUBSCRIBER
  ========================================================= */

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

        await api(
          `/newsletter/subscribers/${id}`,
          {
            method: "DELETE",
          }
        );


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
          "Failed to delete subscriber."
        );

      }

    };


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate =
    (date) => {

      if (!date) {

        return "—";

      }


      const parsed =
        new Date(date);


      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {

        return "—";

      }


      return parsed.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="admin-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            COMMUNICATION
          </p>


          <h1>
            Newsletter Subscribers
          </h1>


          <p className="admin-page-description">
            Manage people who have subscribed
            to the REHEMA Foundation newsletter.
          </p>

        </div>


        <button
          type="button"
          className="admin-primary-button"
          onClick={fetchSubscribers}
          disabled={loading}
        >

          ↻{" "}

          {loading
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>



      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="admin-alert admin-alert-error">

          <strong>
            Unable to load subscribers
          </strong>

          <p>
            {error}
          </p>


          <button
            type="button"
            className="admin-secondary-button"
            onClick={fetchSubscribers}
          >
            Try again
          </button>

        </div>

      )}



      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ◎
          </div>

          <div>

            <span>
              Total Subscribers
            </span>

            <strong>
              {subscribers.length}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Newsletter List
            </span>

            <strong>
              Active
            </strong>

          </div>

        </div>

      </div>



      {/* =====================================================
          SUBSCRIBERS CARD
      ===================================================== */}

      <div className="admin-card">


        <div className="admin-card-header">

          <div>

            <p className="admin-eyebrow">
              NEWSLETTER
            </p>


            <h2>
              Subscriber Directory
            </h2>


            <p>
              View and manage newsletter
              subscribers.
            </p>

          </div>

        </div>



        {/* ===================================================
            SEARCH
        =================================================== */}

        <div
          style={{
            padding: "0 0 24px 0",
          }}
        >

          <input
            type="email"
            placeholder="Search subscriber email..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />

        </div>



        {/* ===================================================
            CONTENT
        =================================================== */}

        {loading ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ⏳
            </div>


            <h3>
              Loading Subscribers...
            </h3>


            <p>
              Please wait while we retrieve
              the newsletter subscribers.
            </p>

          </div>


        ) : filteredSubscribers.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ◎
            </div>


            <h3>
              No Subscribers Found
            </h3>


            <p>

              {search
                ? "No subscriber matches your search."
                : "Newsletter subscribers will appear here once people subscribe."}

            </p>

          </div>


        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Email Address
                  </th>

                  <th>
                    Date Subscribed
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSubscribers.map(
                  (subscriber, index) => (

                    <tr
                      key={
                        subscriber._id
                      }
                    >

                      <td>
                        {index + 1}
                      </td>


                      <td>

                        <strong>
                          {
                            subscriber.email
                          }
                        </strong>

                      </td>


                      <td>

                        {formatDate(
                          subscriber.createdAt
                        )}

                      </td>


                      <td>

                        <button
                          type="button"
                          className="admin-danger-button"
                          onClick={() =>
                            deleteSubscriber(
                              subscriber._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}