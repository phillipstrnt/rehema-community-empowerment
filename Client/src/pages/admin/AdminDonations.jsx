import { API_BASE_URL } from "../../apiConfig.js";


import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDonations.css";

const API_URL = API_BASE_URL;

/* =========================================================
   GET ADMIN AUTH TOKEN
========================================================= */

const getAdminToken = () => {
  return (
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token")
  );
};

/* =========================================================
   AUTHENTICATED FETCH
========================================================= */

const adminFetch = async (url, options = {}) => {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /*
    Only add JSON content type when a body exists
    and it is not FormData.
  */
  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* =========================================================
     FETCH DONATIONS
  ========================================================= */

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(
        `${API_URL}/donations`
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch donations"
        );
      }

      setDonations(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Fetch donations error:", err);

      setError(
        err.message ||
          "Unable to load donations. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  /* =========================================================
     UPDATE DONATION STATUS
  ========================================================= */

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await adminFetch(
        `${API_URL}/donations/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update donation status"
        );
      }

      const updatedDonation = data;

      setDonations((current) =>
        current.map((donation) =>
          donation._id === id
            ? updatedDonation
            : donation
        )
      );
    } catch (err) {
      console.error(
        "Donation status update error:",
        err
      );

      alert(
        err.message ||
          "Failed to update donation status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     DELETE DONATION
  ========================================================= */

  const deleteDonation = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await adminFetch(
        `${API_URL}/donations/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete donation"
        );
      }

      setDonations((current) =>
        current.filter(
          (donation) =>
            donation._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete donation error:",
        err
      );

      alert(
        err.message ||
          "Failed to delete donation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     FILTER DONATIONS
  ========================================================= */

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        donation.donorName
          ?.toLowerCase()
          .includes(searchValue) ||
        donation.email
          ?.toLowerCase()
          .includes(searchValue) ||
        donation.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        donation.reference
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        donation.status === statusFilter;

      const matchesMethod =
        methodFilter === "all" ||
        donation.method === methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    donations,
    search,
    statusFilter,
    methodFilter,
  ]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    const confirmed = donations.filter(
      (donation) =>
        donation.status === "confirmed"
    );

    const pending = donations.filter(
      (donation) =>
        donation.status === "pending"
    );

    const cancelled = donations.filter(
      (donation) =>
        donation.status === "cancelled"
    );

    const totalAmount = confirmed.reduce(
      (sum, donation) =>
        sum + Number(donation.amount || 0),
      0
    );

    return {
      total: donations.length,
      confirmed: confirmed.length,
      pending: pending.length,
      cancelled: cancelled.length,
      totalAmount,
    };
  }, [donations]);

  /* =========================================================
     FORMAT AMOUNT
  ========================================================= */

  const formatAmount = (
    amount,
    currency = "UGX"
  ) => {
    return `${currency} ${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT PAYMENT METHOD
  ========================================================= */

  const formatMethod = (method) => {
    switch (method) {
      case "mobile_money":
        return "Mobile Money";

      case "bank":
        return "Bank Transfer";

      case "card":
        return "Card";

      default:
        return method || "—";
    }
  };

  /* =========================================================
     GET DONOR INITIALS
  ========================================================= */

  const getInitials = (name) => {
    if (!name) {
      return "D";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-donations-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="donations-page-header">

        <div>
          <p className="donations-eyebrow">
            FUNDRAISING
          </p>

          <h1>Donations</h1>

          <p className="donations-subtitle">
            Track and manage contributions received
            through the REHEMA Foundation website.
          </p>
        </div>

        <button
          type="button"
          className="donations-refresh-button"
          onClick={fetchDonations}
          disabled={loading}
        >
          <span>↻</span>

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="donations-stat-grid">

        {/* TOTAL */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon">
            ◆
          </div>

          <div>
            <span>Total Donations</span>

            <strong>
              {statistics.total}
            </strong>
          </div>

        </div>

        {/* CONFIRMED */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon success">
            ✓
          </div>

          <div>
            <span>Confirmed</span>

            <strong>
              {statistics.confirmed}
            </strong>
          </div>

        </div>

        {/* PENDING */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon pending">
            ◷
          </div>

          <div>
            <span>Pending</span>

            <strong>
              {statistics.pending}
            </strong>
          </div>

        </div>

        {/* CONFIRMED AMOUNT */}

        <div className="donation-stat-card">

          <div className="donation-stat-icon amount">
            UGX
          </div>

          <div>
            <span>Confirmed Amount</span>

            <strong className="amount-value">
              {statistics.totalAmount.toLocaleString()}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="donations-toolbar">

        <div className="donation-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search donor, email, phone or reference..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>

        <div className="donation-filters">

          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="all">
              All statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

          {/* METHOD FILTER */}

          <select
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(
                event.target.value
              )
            }
          >

            <option value="all">
              All methods
            </option>

            <option value="mobile_money">
              Mobile Money
            </option>

            <option value="bank">
              Bank Transfer
            </option>

            <option value="card">
              Card
            </option>

          </select>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="donations-error">

          <span>!</span>

          <div>
            <strong>
              Unable to load donations
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchDonations}
          >
            Try again
          </button>

        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="donations-table-card">

        <div className="donations-table-header">

          <div>
            <h2>Donation Records</h2>

            <span>
              {filteredDonations.length}{" "}
              {filteredDonations.length === 1
                ? "record"
                : "records"}
            </span>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="donations-loading">

            <div className="donations-spinner" />

            <p>
              Loading donations...
            </p>

          </div>

        ) : filteredDonations.length === 0 ? (

          /* EMPTY */

          <div className="donations-empty">

            <div className="donations-empty-icon">
              ◆
            </div>

            <h3>
              No donations found
            </h3>

            <p>
              {search ||
              statusFilter !== "all" ||
              methodFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Donations submitted through the website will appear here."}
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="donations-table-wrapper">

            <table className="donations-table">

              <thead>

                <tr>
                  <th>DONOR</th>
                  <th>AMOUNT</th>
                  <th>METHOD</th>
                  <th>REFERENCE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {filteredDonations.map(
                  (donation) => (

                    <tr
                      key={donation._id}
                    >

                      {/* DONOR */}

                      <td>

                        <div className="donor-cell">

                          <div className="donor-avatar">
                            {getInitials(
                              donation.donorName
                            )}
                          </div>

                          <div>

                            <strong>
                              {donation.donorName ||
                                "Anonymous"}
                            </strong>

                            <span>
                              {donation.email ||
                                "No email"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* AMOUNT */}

                      <td>

                        <strong className="donation-amount">

                          {formatAmount(
                            donation.amount,
                            donation.currency
                          )}

                        </strong>

                      </td>

                      {/* METHOD */}

                      <td>

                        <span className="method-badge">

                          {formatMethod(
                            donation.method
                          )}

                        </span>

                      </td>

                      {/* REFERENCE */}

                      <td>

                        <span className="reference-text">

                          {donation.reference ||
                            donation.transactionId ||
                            "—"}

                        </span>

                      </td>

                      {/* DATE */}

                      <td>

                        <span className="date-text">

                          {formatDate(
                            donation.createdAt
                          )}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <select
                          className={`status-select status-${donation.status}`}
                          value={
                            donation.status ||
                            "pending"
                          }
                          disabled={
                            updatingId ===
                            donation._id
                          }
                          onChange={(event) =>
                            updateStatus(
                              donation._id,
                              event.target.value
                            )
                          }
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="donation-actions">

                          <Link
                            to={`/admin/donations/${donation._id}`}
                            className="view-donation-button"
                            title="View donation"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            className="delete-donation-button"
                            title="Delete donation"
                            disabled={
                              deletingId ===
                              donation._id
                            }
                            onClick={() =>
                              deleteDonation(
                                donation._id
                              )
                            }
                          >

                            {deletingId ===
                            donation._id
                              ? "..."
                              : "×"}

                          </button>

                        </div>

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
