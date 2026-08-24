import {
  useState
} from "react";

import {
  api
} from "../api";


export default function Newsletter() {

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function submit(e) {

    e.preventDefault();


    try {

      const data =
        await api(
          "/newsletter",
          {
            method: "POST",

            body: JSON.stringify({
              email
            })
          }
        );


      setMessage(data.message);

      setEmail("");

    }

    catch (err) {

      setMessage(
        err.message
      );

    }

  }


  return (

    <section className="newsletter">

      <div>

        <h2>
          Stay Connected
        </h2>

        <p>
          Receive REHEMA news,
          health campaigns and
          community updates.
        </p>

      </div>


      <form onSubmit={submit}>

        <input

          type="email"

          placeholder="Your email address"

          value={email}

          onChange={
            e => setEmail(e.target.value)
          }

          required

        />

        <button className="btn">

          Subscribe

        </button>

      </form>


      {message && (

        <small>
          {message}
        </small>

      )}

    </section>

  );
}