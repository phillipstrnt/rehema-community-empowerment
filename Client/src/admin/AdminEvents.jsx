import React from "react";

import { Link } from "react-router-dom";


export default function AdminEvents() {

  return (

    <div className="admin-form-page">

      <div className="admin-form-header">

        <p className="admin-eyebrow">
          CONTENT MANAGEMENT
        </p>

        <h1>
          Events
        </h1>

        <p>
          Create and manage REHEMA community
          events and campaigns.
        </p>

      </div>


      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Event Management
          </h2>

          <p>
            Events will appear here once connected
            to the database.
          </p>

        </div>


        <Link
          to="/admin/events/new"
          className="admin-button admin-button-primary"
        >
          + Add Event
        </Link>

      </div>

    </div>

  );

}