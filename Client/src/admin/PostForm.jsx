import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { api } from "../api";


export default function PostForm() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const editing =
    Boolean(id);


  const [form, setForm] =
    useState({

      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      author: "REHEMA",
      published: true

    });


  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (!editing) {
      return;
    }


    async function loadPost() {

      try {

        /*
          We will add a proper
          admin GET endpoint shortly.
        */

        const response =
          await fetch(
            `http://localhost:5000/api/admin/posts/${id}`
          );


        if (!response.ok) {

          throw new Error(
            "Unable to load post."
          );

        }


        const data =
          await response.json();


        setForm({

          title:
            data.title || "",

          slug:
            data.slug || "",

          excerpt:
            data.excerpt || "",

          content:
            data.content || "",

          image:
            data.image || "",

          author:
            data.author || "REHEMA",

          published:
            data.published ?? true

        });

      }

      catch (error) {

        console.error(error);

        setError(
          "Unable to load this post."
        );

      }

    }


    loadPost();

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

      const url =
        editing

          ? `http://localhost:5000/api/admin/posts/${id}`

          : "http://localhost:5000/api/admin/posts";


      const method =
        editing
          ? "PUT"
          : "POST";


      const response =
        await fetch(

          url,

          {

            method,

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify(form)

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to save post."
        );

      }


      navigate("/admin/posts");

    }

    catch (error) {

      console.error(error);

      setError(
        error.message
      );

    }

    finally {

      setSaving(false);

    }

  }


  return (

    <section>

      <p className="eyebrow">
        CONTENT MANAGEMENT
      </p>

      <h1>
        {editing
          ? "Edit News Story"
          : "Add News Story"}
      </h1>


      {error && (

        <div className="admin-error">

          {error}

        </div>

      )}


      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        <label>

          Title

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

        </label>


        <label>

          Slug

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />

        </label>


        <label>

          Excerpt

          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
          />

        </label>


        <label>

          Content

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="12"
            required
          />

        </label>


        <label>

          Image URL

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
          />

        </label>


        <label>

          Author

          <input
            name="author"
            value={form.author}
            onChange={handleChange}
          />

        </label>


        <label className="checkbox">

          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />

          Published

        </label>


        <button
          type="submit"
          disabled={saving}
          className="button"
        >

          {saving
            ? "Saving..."
            : editing
              ? "Update Story"
              : "Publish Story"}

        </button>

      </form>

    </section>

  );

}