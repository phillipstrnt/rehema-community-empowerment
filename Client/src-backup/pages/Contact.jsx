import {
  useState
} from "react";

import {
  api
} from "../api";


export default function Contact() {

  const [form, setForm] =
    useState({});


  const [message, setMessage] =
    useState("");


  async function submit(e) {

    e.preventDefault();


    try {

      const data =
        await api(
          "/contact",
          {
            method: "POST",

            body: JSON.stringify(form)
          }
        );


      setMessage(
        data.message
      );

      setForm({});

    }

    catch (error) {

      setMessage(
        error.message
      );

    }

  }


  return (

    <section className="container section">

      <p className="eyebrow">
        CONTACT REHEMA
      </p>


      <h1>
        We Would Love To Hear From You
      </h1>


      <div className="two-col">


        <div>

          <h2>
            REHEMA
          </h2>

          <p>
            Mbale, Uganda
          </p>

          <p>
            0702952694
          </p>

          <p>
            info@rehemauganda.org
          </p>


          <div className="map">

            <iframe

              title="Mbale map"

              src="https://www.google.com/maps?q=Mbale%2C%20Uganda&output=embed"

              loading="lazy"

            />

          </div>

        </div>


        <form
          className="form"
          onSubmit={submit}
        >

          <input
            placeholder="Name"
            required
            onChange={
              e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
            }
          />


          <input
            type="email"
            placeholder="Email"
            required
            onChange={
              e =>
                setForm({
                  ...form,
                  email: e.target.value
                })
            }
          />


          <input
            placeholder="Phone"
            onChange={
              e =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
            }
          />


          <input
            placeholder="Subject"
            onChange={
              e =>
                setForm({
                  ...form,
                  subject: e.target.value
                })
            }
          />


          <textarea
            placeholder="Message"
            required
            onChange={
              e =>
                setForm({
                  ...form,
                  message: e.target.value
                })
            }
          />


          <button className="btn">
            Send Message
          </button>


          {message && (

            <p className="form-message">
              {message}
            </p>

          )}

        </form>

      </div>

    </section>

  );
}