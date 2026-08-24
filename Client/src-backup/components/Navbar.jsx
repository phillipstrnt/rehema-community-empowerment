import {
  Link,
  NavLink
} from "react-router-dom";

import {
  useState
} from "react";


export default function Navbar() {

  const [open, setOpen] =
    useState(false);


  const links = [

    ["/", "Home"],

    ["/about", "About"],

    ["/programs", "Programs"],

    ["/news", "News"],

    ["/gallery", "Gallery"],

    ["/get-involved", "Get Involved"],

    ["/contact", "Contact"]

  ];


  return (

    <header className="nav">

      <div className="container nav-inner">

        <Link
          to="/"
          className="logo"
        >
          REHEMA<span>.</span>
        </Link>


        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>


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
                onClick={() => setOpen(false)}

                className={
                  ({ isActive }) =>
                    isActive
                      ? "active"
                      : ""
                }
              >

                {label}

              </NavLink>

            )
          )}


          <Link
            className="btn small"
            to="/donate"
            onClick={() => setOpen(false)}
          >
            Donate
          </Link>

        </nav>

      </div>

    </header>

  );
}