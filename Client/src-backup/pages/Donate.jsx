import {
  useState
} from "react";

import {
  api
} from "../api";


export default function Donate() {

  const [form, setForm] =
    useState({
      method: "mobile_money"
    });


  const [message, setMessage] =
    useState("");


  async function submit(e) {

    e.preventDefault();


    try {

      const data =
        await api(
          "/donations",
          {
            method: "POST",

            body: JSON.stringify(form)
          }
        );


      setMessage(
        data.message
      );

    }

    catch (error) {

      setMessage(
        error.message
      );

    }

  }


  return (

    <section className="container section narrow">

      <p className="eyebrow">
        SUPPORT REHEMA
      </p>


      <h1>
        Donate
      </h1>


      <p>

        Your support can help
        REHEMA expand community
        health outreach and education.

      </p>


      <div className="notice">

        <h3>
          Payment Instructions
        </h3>


        <p>

          <strong>
            Mobile Money:
          </strong>

          Replace this section
          with REHEMA's verified
          registered mobile-money
          number and account name.

        </p>


        <p>

          <strong>
            Bank:
          </strong>

          Replace this section
          with the verified bank
          name, account name and
          account number.

        </p>

      </div>


      <form
        className="form"
        onSubmit={submit}
      >

        <input
          placeholder="Donor name"
          onChange={
            e =>
              setForm({
                ...form,
                donorName: e.target.value
              })
          }
        />


        <input
          type="email"
          placeholder="Email"
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
          type="number"
          min="1"
          placeholder="Amount (UGX)"
          required
          onChange={
            e =>
              setForm({
                ...form,
                amount: e.target.value
              })
          }
        />


        <select

          value={form.method}

          onChange={
            e =>
              setForm({
                ...form,
                method: e.target.value
              })
          }

        >

          <option value="mobile_money">
            Mobile Money
          </option>

          <option value="bank">
            Bank
          </option>

        </select>


        <input
          placeholder="Payment reference"
          onChange={
            e =>
              setForm({
                ...form,
                reference: e.target.value
              })
          }
        />


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
          Submit Donation Details
        </button>


        {message && (

          <p className="form-message">
            {message}
          </p>

        )}

      </form>

    </section>

  );
}