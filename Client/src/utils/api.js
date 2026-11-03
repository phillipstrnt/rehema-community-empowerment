import { API_BASE_URL } from "../apiConfig.js";


const API = API_BASE_URL;


/* =========================================================
   GET ADMIN TOKEN
========================================================= */

function getAdminToken() {
  return (
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token") ||
    null
  );
}


/* =========================================================
   ADMIN API REQUEST
========================================================= */

async function adminFetch(path, options = {}) {

  const token = getAdminToken();

  const isFormData =
    options.body instanceof FormData;


  const headers = {
    ...(options.headers || {}),
  };


  /* -------------------------------------------------------
     JSON CONTENT TYPE
     Do not manually set this for FormData.
  ------------------------------------------------------- */

  if (!isFormData) {
    headers["Content-Type"] =
      "application/json";
  }


  /* -------------------------------------------------------
     AUTHENTICATION
  ------------------------------------------------------- */

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  /* -------------------------------------------------------
     REQUEST
  ------------------------------------------------------- */

  const response = await fetch(
    `${API}${path}`,
    {
      ...options,
      headers,
    }
  );


  /* -------------------------------------------------------
     READ RESPONSE
  ------------------------------------------------------- */

  const data =
    await response
      .json()
      .catch(() => ({}));


  /* -------------------------------------------------------
     HANDLE UNAUTHORIZED
  ------------------------------------------------------- */

  if (response.status === 401) {

    /*
     Do not automatically redirect here.
     The page can decide how to handle
     an expired authentication session.
    */

    throw new Error(
      data.message ||
      "Authentication required."
    );
  }


  /* -------------------------------------------------------
     HANDLE OTHER ERRORS
  ------------------------------------------------------- */

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Request failed."
    );
  }


  return data;
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default adminFetch;


/* =========================================================
   NAMED EXPORT
   Allows either:

   import adminFetch from "../utils/api";

   OR

   import { api } from "../utils/api";
========================================================= */

export const api = adminFetch;
