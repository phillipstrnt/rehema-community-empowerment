
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Donations.css";

export default function Donations() {
  const [activeMethod, setActiveMethod] = useState("bank");

  const [copied, setCopied] = useState("");

  const [form, setForm] = useState({
    donorName: "",
    email: "",
    amount: "",
    method: "bank",
    reference: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [submitting, setSubmitting] = useState(false);
  const [flutterwaveEnabled, setFlutterwaveEnabled] = useState(false);

  useEffect(() => {
    api("/payments/providers")
      .then((providers) => setFlutterwaveEnabled(Boolean(providers.flutterwave)))
      .catch(() => setFlutterwaveEnabled(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const txRef = params.get("tx_ref");
    const paymentStatus = params.get("status");
    if (!txRef) return;
    if (!transactionId || paymentStatus !== "successful") {
      setMessageType("error");
      setMessage("The payment was not completed. You can try again or use bank transfer or Mobile Money.");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    setSubmitting(true);
    setMessageType("success");
    setMessage("Checking your payment securely…");
    api("/payments/flutterwave/verify", {
      method: "POST",
      body: JSON.stringify({ transactionId, txRef }),
    }).then(() => {
      setMessageType("success");
      setMessage("Thank you. Your donation payment has been confirmed.");
    }).catch((error) => {
      setMessageType("error");
      setMessage(error.message || "We could not confirm the payment yet. Contact REHEMA with your payment reference.");
    }).finally(() => {
      setSubmitting(false);
      window.history.replaceState({}, "", window.location.pathname);
    });
  }, []);

  /* =========================================================
     BANK INFORMATION
  ========================================================= */

  const bankDetails = {
    accountName:
      "Rural Empowerment on Health Management (REHEMA)",

    accountNumber: "01113658533160",

    bank: "dfcu Bank",

    branch: "Mbale",

    swift: "DFCUUGKA",
  };

  /* =========================================================
     MOBILE MONEY INFORMATION
  ========================================================= */

  const mobileMoneyDetails = {
    number: "586795",

    recipient:
      "Rural Empowerment on Health Management",
  };

  /* =========================================================
     COPY TO CLIPBOARD
  ========================================================= */

  const copyValue = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (error) {
      console.error("Unable to copy:", error);
    }
  };

  /* =========================================================
     METHOD CHANGE
  ========================================================= */

  const changeMethod = (method) => {
    setActiveMethod(method);

    setForm((current) => ({
      ...current,
      method,
    }));

    setMessage("");
    setMessageType("success");
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT DONATION
  ========================================================= */

  const submitDonation = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setMessageType("success");

    try {
      const payload = {
        donorName: form.donorName,
        email: form.email,
        amount: Number(form.amount),
        method: activeMethod,
        reference: form.reference,
      };

      if (activeMethod === "flutterwave") {
        const checkout = await api("/payments/flutterwave/initialize", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        window.location.assign(checkout.checkoutUrl);
        return;
      }

      const data = await api("/donations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessageType("success");
      setMessage(data.message || "Your donation details have been submitted successfully.");

      setForm({
        donorName: "",
        email: "",
        amount: "",
        method: activeMethod,
        reference: "",
      });
    } catch (error) {
      console.error("Donation submission error:", error);
      setMessageType("error");

      setMessage(
        error.message ||
          "Unable to submit your donation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="donations-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="donation-hero">

        <div className="donation-hero-inner">

          <div className="donation-hero-content">

            <span className="donation-eyebrow">
              SUPPORT REHEMA
            </span>

            <h1>
              Your generosity can
              <span> change a life.</span>
            </h1>

            <p>
              Every contribution helps REHEMA
              strengthen communities, improve
              access to healthcare and create
              meaningful opportunities for people
              across Uganda.
            </p>

            <div className="donation-hero-actions">

              <button
                type="button"
                className="donation-primary-button"
                onClick={() =>
                  document
                    .getElementById("donation-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Make a Donation
                <span>→</span>
              </button>

              <button
                type="button"
                className="donation-secondary-button"
                onClick={() =>
                  document
                    .getElementById("bank-details")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                View Bank Details
              </button>

            </div>

          </div>

          <div className="donation-hero-card">

            <div className="donation-hero-card-icon">
              ♥
            </div>

            <strong>
              Every contribution matters
            </strong>

            <p>
              Support REHEMA through bank transfer
              or Mobile Money. Every contribution
              helps strengthen communities and
              improve access to healthcare.
            </p>

            <div className="donation-hero-card-line" />

            <span>
              Rural Empowerment on Health
              Management
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="donations-container">

        {/* ===================================================
            INTRO
        =================================================== */}

        <div className="donation-intro">

          <span className="donation-section-label">
            HOW TO GIVE
          </span>

          <h2>
            Choose how you would like to
            support REHEMA
          </h2>

          <p>
            We provide clear and secure
            information so your contribution
            reaches REHEMA safely.
          </p>

        </div>


        {/* ===================================================
            METHOD SELECTOR
        =================================================== */}

        <div className="donation-methods">

          <button
            type="button"
            className={`donation-method ${
              activeMethod === "bank"
                ? "active"
                : ""
            }`}
            onClick={() => changeMethod("bank")}
          >

            <span className="method-icon">
              ▣
            </span>

            <span className="method-text">

              <strong>
                Bank Transfer
              </strong>

              <small>
                Local & international transfers
              </small>

            </span>

            <span className="method-arrow">
              →
            </span>

          </button>


          <button
            type="button"
            className={`donation-method ${
              activeMethod === "mobile_money"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeMethod("mobile_money")
            }
          >

            <span className="method-icon">
              ◉
            </span>

            <span className="method-text">

              <strong>
                Mobile Money
              </strong>

              <small>
                Donate directly using MoMo
              </small>

            </span>

            <span className="method-arrow">
              →
            </span>

          </button>

          {flutterwaveEnabled ? (
          <button
            type="button"
            className={`donation-method ${activeMethod === "flutterwave" ? "active" : ""}`}
            onClick={() => changeMethod("flutterwave")}
          >
            <span className="method-icon">↗</span>
            <span className="method-text">
              <strong>Pay Online</strong>
              <small>Secure card and mobile money checkout</small>
            </span>
            <span className="method-arrow">→</span>
          </button>
          ) : (
            <div className="payment-unavailable-note" role="status">
              Online card payments are temporarily unavailable. Choose bank transfer or Mobile Money instead.
            </div>
          )}

        </div>

        {activeMethod === "flutterwave" && (
          <div className="mobile-money-section">
            <div className="mobile-money-card">
              <span className="donation-section-label">SECURE ONLINE CHECKOUT</span>
              <h2>Pay with Flutterwave</h2>
              <p>Enter your name, email and amount below. You’ll continue to Flutterwave’s secure checkout to choose an available payment method.</p>
            </div>
          </div>
        )}

        {/* ===================================================
            BANK TRANSFER
        =================================================== */}

        {activeMethod === "bank" && (

          <div
            className="bank-section"
            id="bank-details"
          >

            <div className="bank-section-heading">

              <div>

                <span className="donation-section-label">
                  BANK TRANSFER
                </span>

                <h2>
                  REHEMA Bank Details
                </h2>

                <p>
                  Use the following details when
                  making a bank transfer to REHEMA.
                </p>

              </div>

              <div className="verified-badge">
                <span>✓</span>
                Official bank details
              </div>

            </div>


            {/* ===============================================
                PRIMARY BANK CARD
            =============================================== */}

            <div className="bank-card">

              <div className="bank-card-header">

                <div className="bank-brand">

                  <div className="bank-logo">
                    df
                  </div>

                  <div>

                    <strong>
                      dfcu Bank
                    </strong>

                    <span>
                      Mbale Branch
                    </span>

                  </div>

                </div>

                <span className="bank-transfer-label">
                  BANK TRANSFER
                </span>

              </div>


              <div className="bank-main-details">

                <div className="bank-detail-large">

                  <span>
                    Beneficiary Account Name
                  </span>

                  <strong>
                    {bankDetails.accountName}
                  </strong>

                </div>


                <div className="bank-detail-large account-number-detail">

                  <span>
                    Beneficiary Account Number
                  </span>

                  <div className="copy-row">

                    <strong>
                      {bankDetails.accountNumber}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          bankDetails.accountNumber,
                          "account"
                        )
                      }
                    >
                      {copied === "account"
                        ? "✓ Copied"
                        : "Copy"}
                    </button>

                  </div>

                </div>

              </div>


              <div className="bank-detail-grid">

                <div className="bank-detail">

                  <span>
                    Bank
                  </span>

                  <strong>
                    {bankDetails.bank}
                  </strong>

                </div>


                <div className="bank-detail">

                  <span>
                    Bank Branch
                  </span>

                  <strong>
                    {bankDetails.branch}
                  </strong>

                </div>


                <div className="bank-detail">

                  <span>
                    Beneficiary SWIFT Code
                  </span>

                  <div className="copy-row">

                    <strong>
                      {bankDetails.swift}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          bankDetails.swift,
                          "swift"
                        )
                      }
                    >
                      {copied === "swift"
                        ? "✓ Copied"
                        : "Copy"}
                    </button>

                  </div>

                </div>

              </div>

            </div>


            <div className="international-section">
              <span className="donation-section-label">INTERNATIONAL TRANSFERS</span>
              <p className="international-contact-note">
                For international transfer instructions, <Link to="/contact">contact REHEMA</Link> and include your preferred currency.
              </p>
            </div>

          </div>

        )}


        {/* ===================================================
            MOBILE MONEY
        =================================================== */}

        {activeMethod === "mobile_money" && (

          <div
            className="mobile-money-section"
            id="mobile-money-details"
          >

            <div className="mobile-money-card">

              {/* MOBILE MONEY HEADER */}

              <div className="mobile-money-header">

                <div className="mobile-money-icon">
                  ◉
                </div>

                <div>

                  <span className="donation-section-label">
                    MOBILE MONEY
                  </span>

                  <h2>
                    Donate using MoMo
                  </h2>

                </div>

              </div>


              {/* DESCRIPTION */}

              <p className="mobile-money-description">
                You can support REHEMA directly
                through Mobile Money. Send your
                contribution to the official MoMo
                payment number below.
              </p>


              {/* PAYMENT DETAILS */}

              <div className="momo-payment-details">

                <div className="momo-payment-label">

                  <span>
                    MoMo Number
                  </span>

                  <span className="momo-badge">
                    MOBILE MONEY
                  </span>

                </div>


                <div className="momo-number-row">

                  <strong className="momo-number">
                    {mobileMoneyDetails.number}
                  </strong>

                  <button
                    type="button"
                    className="momo-copy-button"
                    onClick={() =>
                      copyValue(
                        mobileMoneyDetails.number,
                        "momo"
                      )
                    }
                  >
                    {copied === "momo"
                      ? "✓ Copied"
                      : "Copy Number"}
                  </button>

                </div>


                <div className="momo-recipient">

                  <span>
                    Account / Recipient Name
                  </span>

                  <strong>
                    {mobileMoneyDetails.recipient}
                  </strong>

                </div>

              </div>


              {/* HOW TO PAY */}

              <div className="momo-instructions">

                <div className="momo-instructions-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    How to donate
                  </strong>

                  <p>
                    Confirm the recipient name shown above before approving your transfer.
                  </p>

                </div>

              </div>



            </div>

          </div>

        )}


        {/* ===================================================
            DONATION FORM
        =================================================== */}

        <div
          className="donation-form-section"
          id="donation-form"
        >

          <div className="donation-form-intro">

            <span className="donation-section-label">
              DONATION RECORD
            </span>

            <h2>
              Tell us about your donation
            </h2>

            <p>
              Your name, email, amount and transfer reference help REHEMA match and acknowledge your gift. Online checkout handles payment details securely.
            </p>

            <div className="form-trust-list">

              <div>
                <span>✓</span>
                Secure submission
              </div>

              <div>
                <span>✓</span>
                Your details are handled
                responsibly
              </div>

              <div>
                <span>✓</span>
                Donation status can be
                confirmed by REHEMA
              </div>

            </div>

          </div>


          <form
            className="donation-form"
            onSubmit={submitDonation}
          >

            <div className="form-heading">

              <h3>
                Donation Information
              </h3>

              <p>
                Fields marked with * are
                required.
              </p>

            </div>


            <div className="form-grid">

              <div className="donation-field">

                <label htmlFor="donorName">
                  Full Name *
                </label>

                <input
                  id="donorName"
                  name="donorName"
                  type="text"
                  value={form.donorName}
                  required
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>


              <div className="donation-field">

                <label htmlFor="email">
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  required
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>


              <div className="donation-field">

                <label htmlFor="amount">
                  Donation Amount *
                </label>

                <div className="amount-input">

                  <span>
                    UGX
                  </span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    required
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="100000"
                  />

                </div>

              </div>

            </div>


            {activeMethod !== "flutterwave" && <div className="donation-field">

              <label htmlFor="reference">
                Transaction Reference
              </label>

              <input
                id="reference"
                name="reference"
                type="text"
                value={form.reference}
                onChange={handleChange}
                placeholder="Enter your transaction reference"
              />

              <small>
                Optional — useful when
                confirming a bank transfer
                or Mobile Money payment.
              </small>

            </div>}


            <button
              type="submit"
              className="donation-submit-button"
              disabled={submitting}
            >

              {submitting
                ? "Submitting..."
                : activeMethod === "flutterwave" ? "Continue to Secure Checkout" : "Submit Donation Details"}

              {!submitting && (
                <span>→</span>
              )}

            </button>


            {message && (

              <div className={`donation-form-message ${messageType}`} role="status" aria-live="polite">

                <span>
                  {messageType === "success" ? "✓" : "!"}
                </span>

                {message}

              </div>

            )}

          </form>

        </div>


        {/* ===================================================
            CONTACT / SUPPORT
        =================================================== */}

        <div className="donation-support">

          <div>

            <span className="donation-section-label">
              NEED HELP?
            </span>

            <h2>
              Have questions about donating?
            </h2>

            <p>
              Contact REHEMA if you need
              assistance with your donation,
              Mobile Money payment or bank
              transfer.
            </p>

          </div>

          <Link to="/contact" className="donation-contact-button">
            Contact REHEMA
            <span>→</span>
          </Link>

        </div>

      </div>

    </section>
  );
}
