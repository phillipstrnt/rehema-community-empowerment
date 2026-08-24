import {
  Link
} from "react-router-dom";


export default function Footer() {

  return (

    <footer className="footer">

      <div className="container footer-grid">


        <div>

          <h3>REHEMA</h3>

          <p>
            RURAL EMPOWERMENT ON
            HEALTH MANAGEMENT
          </p>

          <p>
            Community health • Health
            systems strengthening •
            Medical outreach
          </p>

        </div>


        <div>

          <h4>Quick Links</h4>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/programs">
            Programs
          </Link>

          <Link to="/get-involved">
            Get Involved
          </Link>

          <Link to="/donate">
            Donate
          </Link>

        </div>


        <div>

          <h4>Contact</h4>

          <p>
            Mbale, Uganda
          </p>

          <p>
            Phone: 0702952694
          </p>

          <p>
            Email:
            info@rehemauganda.org
          </p>

          <p>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

          </p>

        </div>

      </div>


      <div className="copyright">

        © {new Date().getFullYear()}
        {" "}
        REHEMA.
        All rights reserved.

      </div>

    </footer>

  );
}