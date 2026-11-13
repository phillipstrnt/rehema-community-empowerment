const LIVE_API_BASE_URL =
  "https://rehema-community-empowerment-api-frb8.onrender.com/api";

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl || LIVE_API_BASE_URL
).replace(
  "https://rehema-community-empowerment-api.onrender.com",
  "https://rehema-community-empowerment-api-frb8.onrender.com",
).replace(/\/+$/, "");

