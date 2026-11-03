import { API_BASE_URL } from "./apiConfig.js";

const API = API_BASE_URL;

/* =========================================================
   GET STORED ADMIN TOKEN
========================================================= */

function getAdminToken() {
  return (
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token")
  );
}


/* =========================================================
   ADMIN API HELPER
========================================================= */

export async function api(path, options = {}) {
  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };


  /* -------------------------------------------------------
     AUTHENTICATION
  ------------------------------------------------------- */

  const token = getAdminToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


  /* -------------------------------------------------------
     CONTENT TYPE
     
     Do NOT set Content-Type manually for FormData.
     The browser needs to create the multipart boundary.
  ------------------------------------------------------- */

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }


  /* -------------------------------------------------------
     REQUEST
  ------------------------------------------------------- */

  let response;

  try {
    response = await fetch(
      `${API}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    console.error(
      "API connection error:",
      error
    );

    throw new Error(
      "Unable to connect to the server. Please make sure the server is running."
    );
  }


  /* -------------------------------------------------------
     RESPONSE
  ------------------------------------------------------- */

  const data =
    await response
      .json()
      .catch(() => ({}));


  /* -------------------------------------------------------
     AUTHENTICATION FAILURE
  ------------------------------------------------------- */

  if (response.status === 401) {

    /*
      Do not immediately redirect here.
      Let the page decide what to do with
      the authentication error.
    */

    throw new Error(
      data.message ||
      "Authentication required. Please log in again."
    );
  }


  /* -------------------------------------------------------
     OTHER SERVER ERRORS
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

export default api;
