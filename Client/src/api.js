const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


export async function api(
  path,
  options = {}
) {

  const isFormData =
    options.body instanceof FormData;


  const headers = {
    ...(options.headers || {}),
  };


  /*
  Only use JSON Content-Type when
  the request is NOT FormData.
  */

  if (!isFormData) {

    headers["Content-Type"] =
      "application/json";

  }


  const response = await fetch(
    `${API}${path}`,
    {
      ...options,
      headers,
    }
  );


  const data =
    await response
      .json()
      .catch(() => ({}));


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Request failed"
    );

  }


  return data;

}