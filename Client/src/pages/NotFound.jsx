import React from "react";

import {
  Link
} from "react-router-dom";


export default function NotFound() {

  return (

    <section className="container section center">

      <h1>
        404
      </h1>

      <p>
        Page not found.
      </p>

      <Link
        className="btn"
        to="/"
      >
        Back Home
      </Link>

    </section>

  );
}
