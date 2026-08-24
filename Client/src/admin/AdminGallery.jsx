import React from "react";

import { Link } from "react-router-dom";


export default function AdminGallery() {

  return (

    <div className="admin-form-page">

      <div className="admin-form-header">

        <p className="admin-eyebrow">
          MEDIA MANAGEMENT
        </p>

        <h1>
          Gallery
        </h1>

        <p>
          Manage REHEMA photos, videos and
          community outreach media.
        </p>

      </div>


      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Media Library
          </h2>

          <p>
            Your photos and videos will appear here
            once connected to the database.
          </p>

        </div>


        <Link
          to="/admin/gallery/new"
          className="admin-button admin-button-primary"
        >
          + Add Media
        </Link>

      </div>

    </div>

  );

}