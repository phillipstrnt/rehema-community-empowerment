import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import { api } from "../api";

export default function ProgramForm() {

  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    active: true
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!editing) return;

    async function loadProgram() {

      try {

        const data = await api(`/programs/${id}`);

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          image: data.image || "",
          active: data.active ?? true
        });

      } catch (error) {

        console.error(error);

        setError("Unable to load program.");

      }

    }

    loadProgram();

  }, [editing, id]);


  function handleChange(event) {

    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm(previous => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

  }


  async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      const url = editing
        ? `/programs/${id}`
        : "/programs";

      const method = editing
        ? "PUT"
        : "POST";

      const response = await fetch(
        `http://localhost:5000/api${url}`,
        {
          method,

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || "Unable to save program."
        );

      }

      navigate("/admin/programs");

    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setSaving(false);

    }

  }


  return (

    <section className="admin-form-page">

      <div className="admin-form-header">

        <p className="admin-eyebrow">
          PROGRAM MANAGEMENT
        </p>

        <h1>
          {editing
            ? "Edit Program"
            : "Add Program"}
        </h1>

        <p>
          Create and manage REHEMA programs.
        </p>

      </div>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <form
        className="admin-form-card admin-form"
        onSubmit={handleSubmit}
      >

        <label>
          Program Name

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Medical Camps"
            required
          />

        </label>


        <label>
          Slug

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="medical-camps"
            required
          />

        </label>


        <label>
          Short Description

          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            rows="3"
            placeholder="Short description of the program"
          />

        </label>


        <label>
          Full Description

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="8"
            placeholder="Describe the program..."
          />

        </label>


        <label>
          Image URL

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
          />

        </label>


        <label className="checkbox">

          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          Active Program

        </label>


        <div className="admin-form-actions">

          <button
            type="button"
            className="button secondary"
            onClick={() => navigate("/admin/programs")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Program"
                : "Add Program"}
          </button>

        </div>

      </form>

    </section>

  );

}