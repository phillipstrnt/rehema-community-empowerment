
const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/* =========================================================
   GET ADMIN TOKEN
========================================================= */

function getAdminToken() {

  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("rehema_admin_token") ||
    sessionStorage.getItem("rehema_admin_token") ||
    null
  );

}


/* =========================================================
   API REQUEST HELPER
========================================================= */

export async function api(
  path,
  options = {}
) {

  const isFormData =
    options.body instanceof FormData;


  const headers = {
    ...(options.headers || {}),
  };


  /* -------------------------------------------------------
     JSON CONTENT TYPE
  ------------------------------------------------------- */

  if (!isFormData) {

    headers["Content-Type"] =
      "application/json";

  }


  /* -------------------------------------------------------
     ADMIN AUTHENTICATION
     
     Automatically attach JWT token.
  ------------------------------------------------------- */

  const token =
    getAdminToken();


  if (token) {

    headers.Authorization =
      `Bearer ${token}`;

  }


  /* -------------------------------------------------------
     SEND REQUEST
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
      Do not immediately remove the token.

      This allows the page to display the actual
      authentication error.
    */

    throw new Error(
      data.message ||
      "Authentication required. Please log in again."
    );

  }


  /* -------------------------------------------------------
     HANDLE FORBIDDEN
  ------------------------------------------------------- */

  if (response.status === 403) {

    throw new Error(
      data.message ||
      "You do not have permission to perform this action."
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


  /* -------------------------------------------------------
     RETURN DATA
  ------------------------------------------------------- */

  return data;

}


/* =========================================================
   GET CURRENT ADMIN TOKEN
========================================================= */

export function getToken() {

  return getAdminToken();

}


/* =========================================================
   LOGOUT
========================================================= */

export function logoutAdmin() {

  localStorage.removeItem(
    "adminToken"
  );

  localStorage.removeItem(
    "adminUser"
  );

  localStorage.removeItem(
    "rehema_admin_token"
  );

  localStorage.removeItem(
    "rehema_admin_user"
  );


  sessionStorage.removeItem(
    "adminToken"
  );

  sessionStorage.removeItem(
    "adminUser"
  );

  sessionStorage.removeItem(
    "rehema_admin_token"
  );

  sessionStorage.removeItem(
    "rehema_admin_user"
  );

}
