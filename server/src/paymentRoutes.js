import crypto from "node:crypto";
import express from "express";
import { Donation, Notification } from "./models.js";

const router = express.Router();
const apiBase = "https://api.flutterwave.com/v3";

async function verifyWithFlutterwave(transactionId) {
  if (!process.env.FLW_SECRET_KEY) throw Object.assign(new Error("Flutterwave is not configured."), { status: 503 });
  const response = await fetch(`${apiBase}/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.status !== "success" || !result.data) {
    throw Object.assign(new Error("Flutterwave could not verify this payment."), { status: 502 });
  }
  return result.data;
}

async function confirmDonation(transactionId, expectedReference = null) {
  const transaction = await verifyWithFlutterwave(transactionId);
  const donation = await Donation.findOne({ reference: transaction.tx_ref, method: "flutterwave" });
  if (!donation || (expectedReference && donation.reference !== expectedReference)) throw Object.assign(new Error("Donation reference was not found."), { status: 404 });
  const amountMatches = Number(transaction.amount) >= donation.amount;
  const matches = transaction.status === "successful" && transaction.currency === donation.currency && amountMatches;
  if (matches && donation.status !== "confirmed") {
    donation.status = "confirmed";
    donation.gatewayTransactionId = String(transaction.id);
    await donation.save();
    await Notification.create({
      title: "Online donation confirmed",
      message: `A Flutterwave donation of ${donation.amount} ${donation.currency} was verified.`,
      type: "donation",
      link: "/admin/donations",
      read: false,
    });
  }
  return { success: matches, status: matches ? "confirmed" : "pending", amount: donation.amount, currency: donation.currency };
}

router.get("/providers", (_req, res) => {
  res.json({ flutterwave: Boolean(process.env.FLW_SECRET_KEY) });
});

router.post("/flutterwave/initialize", async (req, res, next) => {
  try {
    if (!process.env.FLW_SECRET_KEY) return res.status(503).json({ message: "Online payments are not configured yet. Please use bank transfer or Mobile Money." });
    const { donorName, email, phone, amount, message } = req.body || {};
    const numericAmount = Number(amount);
    if (!donorName?.trim() || !email?.trim() || !Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ message: "Name, email, and a donation amount of at least UGX 1 are required." });
    }
    const currency = (process.env.FLW_CURRENCY || "UGX").toUpperCase();
    const txRef = `rehema-${crypto.randomUUID()}`;
    const donation = await Donation.create({
      donorName: donorName.trim(), email: email.trim().toLowerCase(), phone,
      amount: numericAmount, currency, method: "flutterwave", reference: txRef,
      message, status: "pending",
    });
    const origin = process.env.CLIENT_URL || "http://localhost:5173";
    const response = await fetch(`${apiBase}/payments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: numericAmount,
        currency,
        redirect_url: `${origin}/donate`,
        customer: { email: donation.email, name: donation.donorName, phonenumber: donation.phone || undefined },
        customizations: { title: "REHEMA donation", description: "Support Rural Empowerment on Health Management" },
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.status !== "success" || !result.data?.link) {
      donation.status = "cancelled";
      await donation.save();
      return res.status(502).json({ message: result.message || "Could not start the secure checkout. Please try again." });
    }
    return res.status(201).json({ checkoutUrl: result.data.link, reference: txRef });
  } catch (error) { return next(error); }
});

router.post("/flutterwave/verify", async (req, res, next) => {
  try {
    const { transactionId, txRef } = req.body || {};
    if (!transactionId || !txRef) return res.status(400).json({ message: "Payment reference is incomplete." });
    const donation = await Donation.findOne({ reference: txRef, method: "flutterwave" });
    if (!donation) return res.status(404).json({ message: "Donation reference was not found." });
    const result = await confirmDonation(transactionId, txRef);
    if (!result.success) return res.status(400).json({ message: "Payment is not confirmed yet. Please check again shortly.", status: result.status });
    return res.json(result);
  } catch (error) { return next(error); }
});

router.post("/flutterwave/webhook", async (req, res, next) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.get("verif-hash");
    if (!secretHash || !signature || Buffer.byteLength(secretHash) !== Buffer.byteLength(signature) || !crypto.timingSafeEqual(Buffer.from(secretHash), Buffer.from(signature))) {
      return res.status(401).end();
    }
    const transactionId = req.body?.data?.id;
    if (req.body?.event === "charge.completed" && transactionId) await confirmDonation(String(transactionId));
    return res.status(200).end();
  } catch (error) { return next(error); }
});

export default router;
