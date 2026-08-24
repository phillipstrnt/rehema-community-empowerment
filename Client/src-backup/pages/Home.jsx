import {
  Link
} from "react-router-dom";

import Newsletter from "../components/Newsletter";


export default function Home() {

  return (

    <>

      <section className="hero">

        <div className="container hero-content">

          <p className="eyebrow">

            RURAL EMPOWERMENT ON
            HEALTH MANAGEMENT

          </p>


          <h1>

            Healthier communities.
            Stronger health systems.
            Greater impact.

          </h1>


          <p>

            REHEMA works with
            communities in Uganda
            through medical outreach,
            health education and
            programs that promote
            better health outcomes.

          </p>


          <div className="actions">

            <Link
              className="btn"
              to="/programs"
            >
              Explore Our Programs
            </Link>


            <Link
              className="btn outline"
              to="/get-involved"
            >
              Get Involved
            </Link>

          </div>

        </div>

      </section>


      <section className="stats container">

        <div>

          <strong>
            2025
          </strong>

          <span>
            Medical outreach milestone
          </span>

        </div>


        <div>

          <strong>
            5+
          </strong>

          <span>
            Core program areas
          </span>

        </div>


        <div>

          <strong>
            Mbale
          </strong>

          <span>
            Community focus
          </span>

        </div>


        <div>

          <strong>
            100%
          </strong>

          <span>
            Community-centered
          </span>

        </div>

      </section>


      <section className="container section">

        <div className="section-head">

          <div>

            <p className="eyebrow">
              OUR WORK
            </p>

            <h2>
              Creating practical
              health impact
            </h2>

          </div>


          <Link to="/about">
            Learn About REHEMA →
          </Link>

        </div>


        <div className="cards">

          <article className="card">

            <h3>
              Medical Camps
            </h3>

            <p>
              Bringing outreach and
              health services closer
              to communities.
            </p>

            <Link to="/programs">
              Learn More →
            </Link>

          </article>


          <article className="card">

            <h3>
              HIV Prevention & PrEP
            </h3>

            <p>
              Promoting accurate
              information, prevention
              and linkage to services.
            </p>

            <Link to="/programs">
              Learn More →
            </Link>

          </article>


          <article className="card">

            <h3>
              Maternal Health
            </h3>

            <p>
              Supporting healthier
              mothers, families and
              communities.
            </p>

            <Link to="/programs">
              Learn More →
            </Link>

          </article>

        </div>

      </section>


      <section className="impact">

        <div className="container two-col">

          <div>

            <p className="eyebrow">
              OUR IMPACT
            </p>

            <h2>
              From community
              conversations to action
            </h2>

            <p>

              REHEMA recently held
              a successful free medical
              camp on 13 August 2025.

              We are building toward
              bigger annual impact
              campaigns and stronger
              community partnerships.

            </p>


            <Link
              className="btn"
              to="/news"
            >
              Read Our Stories
            </Link>

          </div>


          <div className="photo-placeholder">

            REHEMA
            <br />
            Medical Camp

            <small>
              Replace with approved
              campaign photo
            </small>

          </div>

        </div>

      </section>


      <Newsletter />

    </>

  );
}