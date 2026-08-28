import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function AdminDonationDetails() {
const { id } = useParams();
const navigate = useNavigate();

const [donation, setDonation] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchDonation = async () => {
try {
setLoading(true);
setError("");

    const response = await fetch(
      `${API_URL}/donations/${id}`
    );

    if (!response.ok) {
      throw new Error("Donation not found");
    }

    const data = await response.json();

    setDonation(data);
  } catch (err) {
    console.error(err);
    setError("Unable to load this donation.");
  } finally {
    setLoading(false);
  }
};

fetchDonation();

}, [id]);

const formatAmount = (amount, currency = "UGX") => {
return `${currency} ${Number(amount || 0).toLocaleString()}`;
};

const formatDate = (date) => {
if (!date) return "—";

return new Date(date).toLocaleString("en-UG", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});


};

const updateStatus = async (status) => {
try {
const response = await fetch(
`${API_URL}/donations/${id}/status`,
{
method: "PATCH",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ status }),
}
);


  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  const updatedDonation = await response.json();

  setDonation(updatedDonation);
} catch (err) {
  console.error(err);
  alert("Failed to update donation status.");
}


};

if (loading) {
return ( <div className="admin-empty-state"> <div className="admin-loading-spinner" /> <p>Loading donation...</p> </div>
);
}

if (error || !donation) {
return ( <div className="admin-error-state"> <h2>Donation not found</h2>


    <p>
      The donation you are trying to view could not be found.
    </p>

    <button
      type="button"
      className="admin-primary-button"
      onClick={() => navigate("/admin/donations")}
    >
      Back to Donations
    </button>
  </div>
);


}

return ( <div className="admin-donation-details-page">


  <div className="admin-page-header">

    <div>
      <p className="admin-eyebrow">
        COMMUNICATION / DONATIONS
      </p>

      <h1>Donation Details</h1>

      <p className="admin-page-subtitle">
        View the complete information for this donation.
      </p>
    </div>

    <Link
      to="/admin/donations"
      className="admin-secondary-button"
    >
      ← Back to Donations
    </Link>

  </div>


  <div className="donation-details-grid">

    <div className="donation-details-card">

      <div className="donation-details-card-header">
        <div>
          <h2>Donor Information</h2>
          <p>Information submitted by the donor.</p>
        </div>
      </div>

      <div className="donation-detail-list">

        <div className="donation-detail-item">
          <span>Full Name</span>
          <strong>
            {donation.donorName || "Anonymous"}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Email</span>
          <strong>
            {donation.email || "—"}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Phone</span>
          <strong>
            {donation.phone || "—"}
          </strong>
        </div>

      </div>

    </div>


    <div className="donation-details-card">

      <div className="donation-details-card-header">
        <div>
          <h2>Payment Information</h2>
          <p>Donation and transaction details.</p>
        </div>
      </div>

      <div className="donation-detail-list">

        <div className="donation-detail-item">
          <span>Amount</span>
          <strong className="donation-large-amount">
            {formatAmount(
              donation.amount,
              donation.currency
            )}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Payment Method</span>
          <strong>
            {donation.method === "mobile_money"
              ? "Mobile Money"
              : donation.method === "bank"
              ? "Bank Transfer"
              : donation.method === "card"
              ? "Card"
              : donation.method || "—"}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Reference</span>
          <strong>
            {donation.reference || "—"}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Transaction ID</span>
          <strong>
            {donation.transactionId || "—"}
          </strong>
        </div>

        <div className="donation-detail-item">
          <span>Date Submitted</span>
          <strong>
            {formatDate(donation.createdAt)}
          </strong>
        </div>

      </div>

    </div>


    <div className="donation-details-card">

      <div className="donation-details-card-header">
        <div>
          <h2>Status</h2>
          <p>Update the current donation status.</p>
        </div>
      </div>

      <div className="donation-status-control">

        <label htmlFor="donation-status">
          Donation Status
        </label>

        <select
          id="donation-status"
          value={donation.status || "pending"}
          onChange={(e) =>
            updateStatus(e.target.value)
          }
        >
          <option value="pending">
            Pending
          </option>

          <option value="successful">
            Successful
          </option>

          <option value="failed">
            Failed
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>

      </div>

    </div>


    {donation.message && (
      <div className="donation-details-card">

        <div className="donation-details-card-header">
          <div>
            <h2>Donor Message</h2>
            <p>Message provided with the donation.</p>
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
