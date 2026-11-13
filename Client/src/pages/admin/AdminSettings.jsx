import React, { useEffect, useState } from "react";
import { api } from "../../api";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");

  const [settings, setSettings] = useState({
    foundationName: "REHEMA Foundation",
    email: "info@rehemafoundation.org",
    phone: "",
    address: "Mbale, Uganda",
    website: "",

    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",

    mobileMoneyName: "",
    mobileMoneyNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",

    emailNotifications: true,
    donationNotifications: true,
    volunteerNotifications: true,
    messageNotifications: true,
    newsletterNotifications: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/settings").then(setSettings).catch((loadError) => setError(loadError.message || "Unable to load settings."));
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    setError("");
    try {
      const result = await api("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      if (result.settings) setSettings(result.settings);
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: "general",
      icon: "⚙",
      title: "General",
      description: "Foundation information",
    },
    {
      id: "social",
      icon: "◎",
      title: "Social Media",
      description: "Social media accounts",
    },
    {
      id: "donations",
      icon: "◆",
      title: "Donations",
      description: "Donation information",
    },
    {
      id: "notifications",
      icon: "🔔",
      title: "Notifications",
      description: "Admin notification preferences",
    },
  ];

  return (
    <div className="admin-settings-page">

      {/* PAGE HEADER */}

      <div className="settings-page-header">

        <div>
          <p className="settings-eyebrow">
            SYSTEM
          </p>

          <h1>Settings</h1>

          <p className="settings-subtitle">
            Manage your REHEMA Foundation administration
            preferences and organization information.
          </p>
        </div>

        <div className="settings-status">
          <span className="settings-status-dot" />
          System settings
        </div>

      </div>


      {/* SETTINGS LAYOUT */}

      <div className="settings-layout">

        {/* SETTINGS NAVIGATION */}

        <aside className="settings-sidebar">

          <div className="settings-sidebar-title">
            SETTINGS
          </div>

          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`settings-sidebar-item ${
                activeSection === section.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveSection(section.id)
              }
            >
              <span className="settings-sidebar-icon">
                {section.icon}
              </span>

              <span className="settings-sidebar-text">
                <strong>{section.title}</strong>
                <small>{section.description}</small>
              </span>

              <span className="settings-sidebar-arrow">
                ›
              </span>
            </button>
          ))}

        </aside>


        {/* SETTINGS CONTENT */}

        <form
          className="settings-content"
          onSubmit={handleSave}
        >

          {/* GENERAL */}

          {activeSection === "general" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>General Information</h2>

                  <p>
                    Basic information about the REHEMA
                    Foundation.
                  </p>
                </div>
              </div>


              <div className="settings-form-grid">

                <div className="settings-field full">
                  <label>
                    Foundation Name
                  </label>

                  <input
                    type="text"
                    name="foundationName"
                    value={settings.foundationName}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+256 ..."
                    value={settings.phone}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field full">
                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field full">
                  <label>
                    Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    placeholder="https://..."
                    value={settings.website}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </section>
          )}


          {/* SOCIAL MEDIA */}

          {activeSection === "social" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Social Media</h2>

                  <p>
                    Connect the Foundation's social
                    media accounts.
                  </p>
                </div>
              </div>


              <div className="settings-form-grid">

                <div className="settings-field full">
                  <label>Facebook</label>

                  <input
                    type="url"
                    name="facebook"
                    placeholder="https://facebook.com/..."
                    value={settings.facebook}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>Instagram</label>

                  <input
                    type="url"
                    name="instagram"
                    placeholder="https://instagram.com/..."
                    value={settings.instagram}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>X / Twitter</label>

                  <input
                    type="url"
                    name="twitter"
                    placeholder="https://x.com/..."
                    value={settings.twitter}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>LinkedIn</label>

                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/..."
                    value={settings.linkedin}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>YouTube</label>

                  <input
                    type="url"
                    name="youtube"
                    placeholder="https://youtube.com/..."
                    value={settings.youtube}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </section>
          )}


          {/* DONATIONS */}

          {activeSection === "donations" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Donation Information</h2>

                  <p>
                    Configure the payment information
                    displayed to donors.
                  </p>
                </div>
              </div>


              <div className="settings-section-label">
                MOBILE MONEY
              </div>


              <div className="settings-form-grid">

                <div className="settings-field">
                  <label>
                    Account Name
                  </label>

                  <input
                    type="text"
                    name="mobileMoneyName"
                    value={settings.mobileMoneyName}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Mobile Money Number
                  </label>

                  <input
                    type="tel"
                    name="mobileMoneyNumber"
                    placeholder="+256 ..."
                    value={settings.mobileMoneyNumber}
                    onChange={handleChange}
                  />
                </div>

              </div>


              <div className="settings-section-label">
                BANK ACCOUNT
              </div>


              <div className="settings-form-grid">

                <div className="settings-field">
                  <label>
                    Bank Name
                  </label>

                  <input
                    type="text"
                    name="bankName"
                    value={settings.bankName}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Account Name
                  </label>

                  <input
                    type="text"
                    name="accountName"
                    value={settings.accountName}
                    onChange={handleChange}
                  />
                </div>


                <div className="settings-field full">
                  <label>
                    Account Number
                  </label>

                  <input
                    type="text"
                    name="accountNumber"
                    value={settings.accountNumber}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </section>
          )}


          {/* NOTIFICATIONS */}

          {activeSection === "notifications" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Notification Preferences</h2>

                  <p>
                    Choose which activities should generate
                    administrator notifications.
                  </p>
                </div>
              </div>


              <div className="notification-settings">

                <label className="notification-setting">

                  <span>
                    <strong>
                      Email notifications
                    </strong>

                    <small>
                      Receive important administration
                      notifications.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={
                      settings.emailNotifications
                    }
                    onChange={handleChange}
                  />

                  <span className="toggle" />

                </label>


                <label className="notification-setting">

                  <span>
                    <strong>
                      Donation notifications
                    </strong>

                    <small>
                      Notify administrators when a new
                      donation is received.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="donationNotifications"
                    checked={
                      settings.donationNotifications
                    }
                    onChange={handleChange}
                  />

                  <span className="toggle" />

                </label>


                <label className="notification-setting">

                  <span>
                    <strong>
                      Volunteer applications
                    </strong>

                    <small>
                      Notify administrators about new
                      volunteer applications.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="volunteerNotifications"
                    checked={
                      settings.volunteerNotifications
                    }
                    onChange={handleChange}
                  />

                  <span className="toggle" />

                </label>


                <label className="notification-setting">

                  <span>
                    <strong>
                      Contact messages
                    </strong>

                    <small>
                      Notify administrators about new
                      contact messages.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="messageNotifications"
                    checked={
                      settings.messageNotifications
                    }
                    onChange={handleChange}
                  />

                  <span className="toggle" />

                </label>


                <label className="notification-setting">

                  <span>
                    <strong>
                      Newsletter subscribers
                    </strong>

                    <small>
                      Notify administrators when someone
                      subscribes.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="newsletterNotifications"
                    checked={
                      settings.newsletterNotifications
                    }
                    onChange={handleChange}
                  />

                  <span className="toggle" />

                </label>

              </div>

            </section>
          )}


          {/* SAVE BAR */}

          <div className="settings-save-bar">

            <div>
              {error && <span role="alert" className="settings-error">{error}</span>}
              {saved && !error && (
                <span className="settings-saved">
                  ✓ Changes saved successfully
                </span>
              )}
            </div>

            <button
              type="submit"
              className="settings-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}