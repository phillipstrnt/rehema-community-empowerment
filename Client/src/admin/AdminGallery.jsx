import React, {
  useEffect,
  useState,
} from "react";

import { api } from "../api";


export default function AdminGallery() {

  const emptyForm = {
    title: "",
    type: "image",
    url: "",
    caption: "",
    date: "",
  };


  const [media, setMedia] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);


  const [selectedFile, setSelectedFile] =
    useState(null);


  const [previewUrl, setPreviewUrl] =
    useState("");


  const [editingId, setEditingId] =
    useState(null);


  const [showForm, setShowForm] =
    useState(false);


  const [loading, setLoading] =
    useState(true);


  const [uploading, setUploading] =
    useState(false);


  const [saving, setSaving] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  /*
  ========================================================
  LOAD MEDIA
  ========================================================
  */

  async function loadMedia() {

    try {

      setLoading(true);
      setError("");

      const data =
        await api("/gallery");

      setMedia(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to load gallery."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadMedia();

  }, []);


  /*
  ========================================================
  INPUT CHANGE
  ========================================================
  */

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

  }


  /*
  ========================================================
  OPEN ADD FORM
  ========================================================
  */

  function openAddForm() {

    setEditingId(null);

    setForm(emptyForm);

    setSelectedFile(null);

    setPreviewUrl("");

    setError("");

    setSuccess("");

    setShowForm(true);

  }


  /*
  ========================================================
  OPEN EDIT FORM
  ========================================================
  */

  function openEditForm(item) {

    setEditingId(item._id);

    setForm({

      title:
        item.title || "",

      type:
        item.type || "image",

      url:
        item.url || "",

      caption:
        item.caption || "",

      date:
        item.date
          ? item.date.substring(0, 10)
          : "",

    });


    setSelectedFile(null);

    setPreviewUrl(
      item.type === "image"
        ? item.url
        : ""
    );


    setError("");

    setSuccess("");

    setShowForm(true);

  }


  /*
  ========================================================
  FILE SELECT
  ========================================================
  */

  function handleFileChange(event) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    const isImage =
      file.type.startsWith("image/");


    const isVideo =
      file.type.startsWith("video/");


    if (!isImage && !isVideo) {

      setError(
        "Please select a valid image or video."
      );

      return;

    }


    setSelectedFile(file);


    setForm(
      (current) => ({
        ...current,
        type: isVideo
          ? "video"
          : "image",
      })
    );


    /*
    Create local preview
    */

    const objectUrl =
      URL.createObjectURL(file);


    setPreviewUrl(objectUrl);


    setError("");

  }


  /*
  ========================================================
  UPLOAD FILE TO CLOUDINARY
  ========================================================
  */

  async function uploadMedia() {

    if (!selectedFile) {
      return form.url;
    }


    setUploading(true);

    setError("");


    try {

      const formData =
        new FormData();


      formData.append(
        "media",
        selectedFile
      );


      const result =
        await api(
          "/upload/media",
          {
            method: "POST",
            body: formData,
          }
        );


      return result.url;

    } catch (error) {

      console.error(error);

      throw new Error(
        error.message ||
        "Media upload failed."
      );

    } finally {

      setUploading(false);

    }

  }


  /*
  ========================================================
  SAVE
  ========================================================
  */

  async function handleSubmit(event) {

    event.preventDefault();


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      /*
      New media must have a file
      or an existing URL.
      */

      if (
        !selectedFile &&
        !form.url
      ) {

        throw new Error(
          "Please select an image or video."
        );

      }


      /*
      Upload selected file
      */

      const uploadedUrl =
        await uploadMedia();


      /*
      Save to MongoDB
      */

      const payload = {

        title:
          form.title.trim(),

        type:
          form.type,

        url:
          uploadedUrl,

        caption:
          form.caption.trim(),

        date:
          form.date || undefined,

      };


      let saved;


      /*
      EDIT
      */

      if (editingId) {

        saved =
          await api(
            `/gallery/${editingId}`,
            {
              method: "PUT",

              body:
                JSON.stringify(payload),
            }
          );


        setMedia(
          (current) =>
            current.map(
              (item) =>
                item._id === editingId
                  ? saved
                  : item
            )
        );


        setSuccess(
          "Media updated successfully."
        );

      }


      /*
      ADD
      */

      else {

        saved =
          await api(
            "/gallery",
            {
              method: "POST",

              body:
                JSON.stringify(payload),
            }
          );


        setMedia(
          (current) => [
            saved,
            ...current,
          ]
        );


        setSuccess(
          "Media uploaded and added to the gallery."
        );

      }


      /*
      Reset form
      */

      setForm(emptyForm);

      setSelectedFile(null);

      setPreviewUrl("");

      setEditingId(null);

      setShowForm(false);


    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to save media."
      );

    } finally {

      setSaving(false);

    }

  }


  /*
  ========================================================
  DELETE
  ========================================================
  */

  async function deleteMedia(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this media?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      setSuccess("");


      await api(
        `/gallery/${id}`,
        {
          method: "DELETE",
        }
      );


      setMedia(
        (current) =>
          current.filter(
            (item) =>
              item._id !== id
          )
      );


      setSuccess(
        "Media deleted successfully."
      );

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Unable to delete media."
      );

    }

  }


  /*
  ========================================================
  CANCEL
  ========================================================
  */

  function closeForm() {

    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);

    setSelectedFile(null);

    setPreviewUrl("");

    setError("");

  }


  return (

    <div className="admin-gallery-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-gallery-header">

        <div>

          <p className="admin-eyebrow">
            MEDIA MANAGEMENT
          </p>

          <h1>
            Gallery
          </h1>

          <p className="admin-gallery-description">
            Upload and manage photos and videos
            from REHEMA's programs, medical
            outreaches and community activities.
          </p>

        </div>


        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={openAddForm}
        >
          + Add Media
        </button>

      </div>


      {/* ==================================================
          MESSAGES
      ================================================== */}

      {error && (

        <div className="admin-alert admin-alert-error">
          {error}
        </div>

      )}


      {success && (

        <div className="admin-alert admin-alert-success">
          {success}
        </div>

      )}


      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}

      {showForm && (

        <div className="admin-gallery-form-card">


          <div className="admin-gallery-form-header">

            <div>

              <span className="admin-gallery-form-icon">
                {editingId ? "✏️" : "📤"}
              </span>

              <div>

                <h2>
                  {editingId
                    ? "Edit Media"
                    : "Add New Media"}
                </h2>

                <p>
                  Upload a photo or video to the
                  REHEMA public gallery.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="admin-gallery-close"
              onClick={closeForm}
              aria-label="Close"
            >
              ×
            </button>

          </div>


          <form
            className="admin-gallery-form"
            onSubmit={handleSubmit}
          >


            {/* ==================================================
                FILE UPLOAD
            ================================================== */}

            <div className="admin-gallery-upload-section">

              <label className="admin-gallery-label">
                Media File
              </label>


              <label
                htmlFor="gallery-file"
                className="admin-gallery-dropzone"
              >

                {previewUrl ? (

                  <div className="admin-gallery-preview">

                    {form.type === "video" ? (

                      <video
                        src={previewUrl}
                        controls
                      />

                    ) : (

                      <img
                        src={previewUrl}
                        alt="Selected media"
                      />

                    )}

                  </div>

                ) : (

                  <div className="admin-gallery-upload-placeholder">

                    <div className="admin-gallery-upload-icon">
                      ☁️
                    </div>

                    <strong>
                      Choose an image or video
                    </strong>

                    <span>
                      Click here to browse your computer
                    </span>

                    <small>
                      JPG, PNG, WEBP, MP4, WEBM or MOV
                    </small>

                  </div>

                )}

              </label>


              <input
                id="gallery-file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                hidden
              />


              {selectedFile && (

                <div className="admin-gallery-file-info">

                  <span>
                    📎
                  </span>

                  <div>

                    <strong>
                      {selectedFile.name}
                    </strong>

                    <small>
                      {(
                        selectedFile.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </small>

                  </div>

                </div>

              )}

            </div>


            {/* ==================================================
                DETAILS
            ================================================== */}

            <div className="admin-gallery-details">

              <div className="admin-field">

                <label>
                  Media Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="REHEMA Medical Outreach"
                />

              </div>


              <div className="admin-field">

                <label>
                  Media Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >

                  <option value="image">
                    Image
                  </option>

                  <option value="video">
                    Video
                  </option>

                </select>

              </div>


              <div className="admin-field">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>


              <div className="admin-field admin-field-full">

                <label>
                  Caption
                </label>

                <textarea
                  name="caption"
                  value={form.caption}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this photo or video..."
                />

              </div>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="admin-gallery-form-actions">

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={closeForm}
                disabled={saving || uploading}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-button admin-button-primary"
                disabled={
                  saving ||
                  uploading
                }
              >

                {uploading
                  ? "Uploading..."
                  : saving
                    ? "Saving..."
                    : editingId
                      ? "Update Media"
                      : "Upload & Save"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ==================================================
          MEDIA LIBRARY
      ================================================== */}

      <div className="admin-gallery-library">


        <div className="admin-gallery-library-header">

          <div>

            <p className="admin-eyebrow">
              YOUR CONTENT
            </p>

            <h2>
              Media Library
            </h2>

          </div>


          <span className="admin-gallery-total">
            {media.length}{" "}
            {media.length === 1
              ? "item"
              : "items"}
          </span>

        </div>


        {loading ? (

          <div className="admin-gallery-loading">

            <div className="admin-loader"></div>

            <p>
              Loading media...
            </p>

          </div>

        ) : media.length === 0 ? (

          <div className="admin-gallery-empty">

            <div>
              📷
            </div>

            <h3>
              No media yet
            </h3>

            <p>
              Upload your first photo or video
              to start building the REHEMA gallery.
            </p>

            <button
              type="button"
              className="admin-button admin-button-primary"
              onClick={openAddForm}
            >
              + Add First Media
            </button>

          </div>

        ) : (

          <div className="admin-gallery-grid">

            {media.map((item) => (

              <article
                className="admin-gallery-card"
                key={item._id}
              >


                {/* MEDIA */}
                <div className="admin-gallery-card-media">

                  {item.type === "video" ? (

                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                    />

                  ) : (

                    <img
                      src={item.url}
                      alt={
                        item.title ||
                        "REHEMA media"
                      }
                      loading="lazy"
                    />

                  )}


                  <span className="admin-gallery-type-badge">

                    {item.type === "video"
                      ? "Video"
                      : "Image"}

                  </span>

                </div>


                {/* CONTENT */}
                <div className="admin-gallery-card-body">

                  <h3>
                    {item.title ||
                      "Untitled Media"}
                  </h3>


                  {item.caption && (

                    <p>
                      {item.caption}
                    </p>

                  )}


                  <div className="admin-gallery-card-meta">

                    {item.date && (

                      <span>
                        {new Date(
                          item.date
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    )}

                  </div>


                  <div className="admin-gallery-card-actions">

                    <button
                      type="button"
                      className="admin-button admin-button-secondary"
                      onClick={() =>
                        openEditForm(item)
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() =>
                        deleteMedia(item._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}