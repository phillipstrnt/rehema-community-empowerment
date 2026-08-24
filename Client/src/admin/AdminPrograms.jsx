import React from "react";

import { Link } from "react-router-dom";


export default function AdminPrograms() {

  return (

    <div className="admin-form-page">

      <div className="admin-form-header">

        <p className="admin-eyebrow">
          CONTENT MANAGEMENT
        </p>

        <h1>
          Programs
        </h1>

        <p>
          Manage REHEMA's health programs and
          community initiatives.
        </p>

      </div>


      <div className="admin-form-card">

        <div className="section-heading">

          <h2>
            Program Management
          </h2>

          <p>
            Programs will appear here once connected
            to the database.
          </p>

        </div>


        <Link
          to="/admin/programs/new"
          className="admin-button admin-button-primary"
        >
          + Add Program
        </Link>

      </div>

    </div>

  );

}