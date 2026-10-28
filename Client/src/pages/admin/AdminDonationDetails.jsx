import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

/*
  IMPORTANT:
  AdminDonationDetails.jsx is inside:

  src/pages/admin/

  api.js is inside:

  src/

  Therefore we need ../../api
*/
import api from "../../api";


export default function AdminDonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);


  /* =========================================================
     FETCH DONATION
  ========================================================= */

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api(`/donations/${id}`);

        setDonation(data);
      } catch (err) {
        console.error(
          "Fetch donation error:",
          err
        );

        setError(
          err.message ||
            "Unable to load this donation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDonation();
    } else {
      setLoading(false);
      setError("No donation ID was provided.");
    }
  }, [id]);


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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
      "en-UG",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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

      case "flutterwave":
        return "Flutterwave Online Payment";

      default:
        return method || "—";
    }
  };


  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async (status) => {
    try {
      setUpdating(true);

      const updatedDonation = await api(
        `/donations/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      setDonation(updatedDonation);
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
      setUpdating(false);
    }
  };


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-empty-state">
        <div className="admin-loading-spinner" />

        <p>
          Loading donation...
        </p>
      </div>
    );
  }


  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error || !donation) {
    return (
      <div className="admin-error-state">
        <h2>
          Donation not found
        </h2>

        <p>
          {error ||
            "The donation you are trying to view could not be found."}
        </p>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() =>
            navigate("/admin/donations")
          }
        >
          Back to Donations
        </button>
      </div>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="admin-donation-details-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>
          <p className="admin-eyebrow">
            COMMUNICATION / DONATIONS
          </p>

          <h1>
            Donation Details
          </h1>

          <p className="admin-page-subtitle">
            View the complete information for
            this donation.
          </p>
        </div>

        <Link
          to="/admin/donations"
          className="admin-secondary-button"
        >
          ← Back to Donations
        </Link>

      </div>


      {/* =====================================================
          DETAILS GRID
      ===================================================== */}

      <div className="donation-details-grid">

        {/* ===================================================
            DONOR INFORMATION
        =================================================== */}

        <div className="donation-details-card">

          <div className="donation-details-card-header">

            <div>
              <h2>
                Donor Information
              </h2>

              <p>
                Information submitted by
                the donor.
              </p>
            </div>

          </div>


          <div className="donation-detail-list">

            <div className="donation-detail-item">
              <span>
                Full Name
              </span>

              <strong>
                {donation.donorName ||
                  "Anonymous"}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Email
              </span>

              <strong>
                {donation.email || "—"}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Phone
              </span>

              <strong>
                {donation.phone || "—"}
              </strong>
            </div>

          </div>

        </div>


        {/* ===================================================
            PAYMENT INFORMATION
        =================================================== */}

        <div className="donation-details-card">

          <div className="donation-details-card-header">

            <div>
              <h2>
                Payment Information
              </h2>

              <p>
                Donation and transaction
                details.
              </p>
            </div>

          </div>


          <div className="donation-detail-list">

            <div className="donation-detail-item">
              <span>
                Amount
              </span>

              <strong className="donation-large-amount">
                {formatAmount(
                  donation.amount,
                  donation.currency
                )}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Payment Method
              </span>

              <strong>
                {formatMethod(
                  donation.method
                )}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Reference
              </span>

              <strong>
                {donation.reference ||
                  "—"}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Transaction ID
              </span>

              <strong>
                {donation.transactionId ||
                  "—"}
              </strong>
            </div>


            <div className="donation-detail-item">
              <span>
                Date Submitted
              </span>

              <strong>
                {formatDate(
                  donation.createdAt
                )}
              </strong>
            </div>

          </div>

        </div>


        {/* ===================================================
            STATUS
        =================================================== */}

        <div className="donation-details-card">

          <div className="donation-details-card-header">

            <div>
              <h2>
                Status
              </h2>

              <p>
                Update the current donation
                status.
              </p>
            </div>

          </div>


          <div className="donation-status-control">

            <label htmlFor="donation-status">
              Donation Status
            </label>

            <select
              id="donation-status"
              value={
                donation.status ||
                "pending"
              }
              disabled={updating}
              onChange={(event) =>
                updateStatus(
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


            {updating && (
              <p className="donation-status-updating">
                Updating status...
              </p>
            )}

          </div>

        </div>


        {/* ===================================================
            DONOR MESSAGE
        =================================================== */}

        {donation.message && (
          <div className="donation-details-card">

            <div className="donation-details-card-header">

              <div>
                <h2>
                  Donor Message
                </h2>

                <p>
                  Message provided with
                  the donation.
                </p>
              </div>

            </div>


            <div className="donation-message">
              {donation.message}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}