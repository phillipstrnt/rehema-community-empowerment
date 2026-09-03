
import React, { useState } from "react";
import { api } from "../api";
import "./Donations.css";

export default function Donations() {
  const [activeMethod, setActiveMethod] = useState("bank");

  const [copied, setCopied] = useState("");

  const [form, setForm] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: "",
    method: "bank",
    reference: "",
    message: "",
  });

  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     BANK INFORMATION
  ========================================================= */

  const bankDetails = {
    accountName:
      "Rural Empowerment on Health Management (REHEMA)",

    accountNumber: "01113658533160",

    bank: "dfcu Bank",

    bankAddress: "dfcu Bank, P.O Box 70, Kampala",

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

    contact: "0702952694",
  };

  /* =========================================================
     INTERMEDIARY BANKS
  ========================================================= */

  const intermediaryBanks = [
    {
      currency: "USD",
      bank: "Citibank N.A. New York",
      address:
        "399 Park Avenue, New York, NY 10043 U.S.A.",
      swift: "CITIUS33",
      account: "34069709",
    },

    {
      currency: "CNY",
      bank: "Bank Of China",
      address:
        "Zhongyin Tower, Shanghai, China",
      swift: "BKCHCNBJ500",
      account: "453360544156",
    },

    {
      currency: "EUR",
      bank: "Citibank NA London",
      address:
        "Citigroup Centre, Canada Square, Canary Wharf, London E14 5LB",
      swift: "CITIGB2L",
      account: "11117874",
      iban: "GB59CITI18500811117874",
    },

    {
      currency: "GBP",
      bank: "Citibank NA London",
      address:
        "Citigroup Centre, Canada Square, Canary Wharf, London E14 5LB",
      swift: "CITIGB2L",
      account: "13679780",
      iban: "GB73CITI18500813679780",
    },

    {
      currency: "JPY",
      bank: "Citibank NA London",
      address:
        "Citigroup Centre, Canada Square, Canary Wharf, London E14 5LB",
      swift: "CITIGB2L",
      account: "11184253",
    },

    {
      currency: "KES",
      bank: "Kenya Commercial Bank",
      address:
        "Kencorn House, Moi Avenue, Nairobi, Kenya",
      swift: "KCBLKENX",
      account: "1109007396",
    },

    {
      currency: "ZAR",
      bank: "First Rand Bank",
      address:
        "6TH Floor, 1 Merchant Place, Corner Fredman Drive and Rivonia Road, Sandton, South Africa",
      swift: "FIRNZAJJ",
      account: "9021795",
    },
  ];

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

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        method: activeMethod,
      };

      const data = await api("/donations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessage(
        data.message ||
          "Your donation details have been submitted successfully."
      );

      setForm({
        donorName: "",
        email: "",
        phone: "",
        amount: "",
        method: activeMethod,
        reference: "",
        message: "",
      });
    } catch (error) {
      console.error("Donation submission error:", error);

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

        </div>


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
                    Bank Address
                  </span>

                  <strong>
                    {bankDetails.bankAddress}
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


            {/* ===============================================
                INTERNATIONAL TRANSFERS
            =============================================== */}

            <div className="international-section">

              <div className="international-heading">

                <div>

                  <span className="donation-section-label">
                    INTERNATIONAL TRANSFERS
                  </span>

                  <h3>
                    Intermediary Bank Details
                  </h3>

                  <p>
                    Depending on the currency,
                    payment can be made through
                    the following intermediary banks.
                  </p>

                </div>

              </div>


              <div className="international-table-wrapper">

                <table className="international-table">

                  <thead>

                    <tr>

                      <th>
                        Currency
                      </th>

                      <th>
                        Bank Name & Address
                      </th>

                      <th>
                        SWIFT Code
                      </th>

                      <th>
                        Account Number
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {intermediaryBanks.map(
                      (bank) => (

                        <tr
                          key={bank.currency}
                        >

                          <td>

                            <span className="currency-badge">
                              {bank.currency}
                            </span>

                          </td>

                          <td>

                            <strong>
                              {bank.bank}
                            </strong>

                            <span>
                              {bank.address}
                            </span>

                          </td>

                          <td>

                            <code>
                              {bank.swift}
                            </code>

                          </td>

                          <td>

                            <strong>
                              {bank.account}
                            </strong>

                            {bank.iban && (

                              <span className="iban">
                                IBAN:{" "}
                                {bank.iban}
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* =============================================
                  FURTHER CREDIT
              ============================================= */}

              <div className="further-credit">

                <div className="further-credit-icon">
                  ✓
                </div>

                <div>

                  <span>
                    FOR FURTHER CREDIT TO
                  </span>

                  <strong>
                    Bank: dfcu Bank
                  </strong>

                  <p>
                    Beneficiary SWIFT Code:
                    <strong>
                      {" "}
                      DFCUUGKA
                    </strong>
                  </p>

                </div>

              </div>

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
                    Open your Mobile Money
                    service and enter the MoMo
                    number
                    <strong>
                      {" "}
                      {mobileMoneyDetails.number}
                    </strong>
                    . Confirm that the recipient
                    is
                    <strong>
                      {" "}
                      {mobileMoneyDetails.recipient}
                    </strong>
                    before completing your donation.
                  </p>

                </div>

              </div>


              {/* CONTACT */}

              <div className="mobile-money-contact">

                <span>
                  NEED ASSISTANCE?
                </span>

                <strong>
                  {mobileMoneyDetails.contact}
                </strong>

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
              If you have made a transfer,
              submitting your details helps
              REHEMA identify and acknowledge
              your contribution.
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
                  Full Name
                </label>

                <input
                  id="donorName"
                  name="donorName"
                  type="text"
                  value={form.donorName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>


              <div className="donation-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>


              <div className="donation-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0700 000 000"
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


            <div className="donation-field">

              <label htmlFor="method">
                Donation Method
              </label>

              <select
                id="method"
                name="method"
                value={activeMethod}
                onChange={(event) =>
                  changeMethod(
                    event.target.value
                  )
                }
              >

                <option value="bank">
                  Bank Transfer
                </option>

                <option value="mobile_money">
                  Mobile Money
                </option>

              </select>

            </div>


            <div className="donation-field">

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

            </div>


            <div className="donation-field">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Leave a message for REHEMA..."
              />

            </div>


            <button
              type="submit"
              className="donation-submit-button"
              disabled={submitting}
            >

              {submitting
                ? "Submitting..."
                : "Submit Donation Details"}

              {!submitting && (
                <span>→</span>
              )}

            </button>


            {message && (

              <div className="donation-form-message">

                <span>
                  ✓
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

          <a
            href={`tel:${mobileMoneyDetails.contact}`}
            className="donation-contact-button"
          >
            Call {mobileMoneyDetails.contact}
            <span>→</span>
          </a>

        </div>

      </div>

    </section>
  );
}
