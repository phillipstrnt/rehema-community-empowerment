import React from "react";

import {
  useState
} from "react";

import {
  api
} from "../api";


function Form({ type }) {

  const [form, setForm] =
    useState({});


  const [message, setMessage] =
    useState("");


  const volunteer =
    type === "volunteer";


  async function submit(e) {

    e.preventDefault();


    try {

      const data =
        await api(
          volunteer
            ? "/volunteers"
            : "/partners",

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

    catch (err) {

      setMessage(
        err.message
      );

    }

  }


  return (

    <form
      className="form"
      onSubmit={submit}
    >

      <input
        placeholder={
          volunteer
            ? "Full name"
            : "Organization name"
        }
        required
        onChange={
          e =>
            setForm({
              ...form,

              ...(volunteer
                ? { name: e.target.value }
                : { organization: e.target.value })
            })
        }
      />


      {!volunteer && (

        <input
          placeholder="Contact name"
          onChange={
            e =>
              setForm({
                ...form,
                contactName: e.target.value
              })
          }
        />

      )}


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


      {volunteer && (

        <input
          placeholder="Skills / experience"
          onChange={
            e =>
              setForm({
                ...form,
                skills: e.target.value
              })
          }
        />

      )}


      <textarea
        placeholder="Message"
        onChange={
          e =>
            setForm({
              ...form,
              message: e.target.value
            })
        }
      />


      <button className="btn">

        {volunteer
          ? "Apply to Volunteer"
          : "Partner With REHEMA"}

      </button>


      {message && (

        <p className="form-message">
          {message}
        </p>

      )}

    </form>

  );
}


export default function GetInvolved() {

  return (

    <section className="container section">

      <p className="eyebrow">
        GET INVOLVED
      </p>


      <h1>
        Help Us Create Greater Impact
      </h1>


      <div className="two-col forms">


        <div>

          <h2>
            Volunteer
          </h2>

          <p>
            Share your skills and
            time with community
            health initiatives.
          </p>

          <Form type="volunteer" />

        </div>


        <div>

          <h2>
            Partner With Us
          </h2>

          <p>
            Organizations, institutions
            and supporters can work
            with REHEMA on campaigns
            and programs.
          </p>

          <Form type="partner" />

        </div>

      </div>

    </section>

  );
}
