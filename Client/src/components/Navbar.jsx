
import React, { useState } from "react";

import {
  Link,
  NavLink
} from "react-router-dom";


export default function Navbar() {

  const [open, setOpen] = useState(false);


  const links = [
    ["/", "Home"],
    ["/about", "About"],
    ["/programs", "Programs"],
    ["/news", "News"],
    ["/gallery", "Gallery"],
    ["/get-involved", "Get Involved"],
    ["/contact", "Contact"]
  ];


  function closeMenu() {
    setOpen(false);

    // Always return the page to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  return (

    <header className="nav">

      <div className="container nav-inner">


        {/* =====================================================
            REHEMA LOGO
        ===================================================== */}

        <Link
          to="/"
          className="logo"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/rehema/logo.png"
            alt="REHEMA Foundation"
            className="logo-image"
          />
        </Link>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label={
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={open}
        >

          {open ? "✕" : "☰"}

        </button>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav
          className={
            open
              ? "nav-links open"
              : "nav-links"
          }
        >

          {links.map(
            ([to, label]) => (

              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}

                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
              >

                {label}

              </NavLink>

            )
          )}


          {/* ===================================================
              DONATE BUTTON
          =================================================== */}

          <Link
            className="btn small nav-donate"
            to="/donate"
            onClick={closeMenu}
          >

            Donate

          </Link>

        </nav>

      </div>

    </header>

  );
}
