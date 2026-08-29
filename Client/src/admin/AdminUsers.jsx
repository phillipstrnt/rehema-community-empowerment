
import React from "react";

export default function AdminUsers() {
  return (
    <div className="admin-page">

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <div>
          <p className="admin-eyebrow">
            SYSTEM
          </p>

          <h1>
            Admin Users
          </h1>

          <p className="admin-page-subtitle">
            Manage administrators who have access to the
            REHEMA Foundation administration portal.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() =>
            alert("Add administrator functionality coming next.")
          }
        >
          + Add Administrator
        </button>

      </div>


      {/* USERS CARD */}

      <div className="admin-card">

        <div className="admin-card-header">

          <div>
            <h2>
              Administrators
            </h2>

            <p>
              Authorized users of the administration system.
            </p>
          </div>

        </div>


        {/* EMPTY STATE */}

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            👥
          </div>

          <h3>
            Admin user management
          </h3>

          <p>
            Administrator accounts will appear here once
            they are added to the system.
          </p>

        </div>

      </div>

    </div>
  );
}