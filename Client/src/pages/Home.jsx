
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

/* =====================================================
   ANIMATED COUNTER
===================================================== */

function Counter({
  end,
  prefix = "",
  suffix = "",
  duration = 1800
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    function animate(currentTime) {
      if (!startTime) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.floor(progress * end);

      setCount(value);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    }

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  );
}


/* =====================================================
   HOME PAGE
===================================================== */

export default function Home() {
  return (
    <main className="home-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="home-hero">

        {/* HERO IMAGE */}

        <img
          src="/images/rehema/hero.jpg"
          alt="REHEMA community health outreach"
          className="home-hero-image"
        />

        {/* DARK OVERLAY */}

        <div className="home-hero-overlay"></div>


        {/* HERO CONTENT */}

        <div className="container home-hero-content">

          <div className="home-hero-copy">

            <span className="home-hero-label">
              RURAL EMPOWERMENT ON HEALTH MANAGEMENT
            </span>

            <h1>
              Healthier communities.
              <br />
              Stronger health systems.
              <br />
              <span>Greater impact.</span>
            </h1>

            <p>
              REHEMA works with communities across Uganda
              to promote better health through medical
              outreach, health education, disease prevention,
              community engagement and partnerships.
            </p>


            {/* HERO BUTTONS */}

            <div className="home-actions">

              <Link
                to="/programs"
                className="home-btn home-btn-primary"
              >
                Explore Our Programs
                <span>→</span>
              </Link>

              <Link
                to="/get-involved"
                className="home-btn home-btn-outline"
              >
                Get Involved
                <span>→</span>
              </Link>

            </div>

          </div>


          {/* HERO FLOATING CARD */}

          <div className="home-hero-impact-card">

            <div className="impact-icon">
              ♥
            </div>

            <div>

              <strong>
                Community First
              </strong>

              <span>
                Health • Education • Empowerment
              </span>

            </div>

          </div>

        </div>


        {/* SCROLL INDICATOR */}

        <div className="home-scroll-indicator">
          <span></span>
          Scroll to explore
        </div>

      </section>


      {/* =================================================
          IMPACT COUNTERS
      ================================================= */}

      <section className="home-impact-strip">

        <div className="container home-impact-grid">

          <div className="home-counter">

            <strong>
              <Counter end={2025} />
            </strong>

            <span>
              Outreach milestone
            </span>

          </div>


          <div className="home-counter">

            <strong>
              <Counter
                end={5}
                suffix="+"
              />
            </strong>

            <span>
              Core program areas
            </span>

          </div>


          <div className="home-counter">

            <strong>
              <Counter
                end={100}
                suffix="%"
              />
            </strong>

            <span>
              Community centered
            </span>

          </div>


          <div className="home-counter">

            <strong>
              <Counter
                end={1}
                suffix="+"
              />
            </strong>

            <span>
              Key sponsor
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          INTRODUCTION
      ================================================= */}

      <section className="container home-section home-introduction">

        <div className="home-two-column">

          {/* IMAGE */}

          <div className="home-image-wrapper">

            <img
              src="/images/rehema/about.jpg"
              alt="REHEMA community activities"
              className="home-section-image"
            />

            <div className="home-image-badge">

              <strong>
                Community First
              </strong>

              <span>
                Working where health matters most
              </span>

            </div>

          </div>


          {/* CONTENT */}

          <div className="home-section-content">

            <p className="home-eyebrow">
              WHO WE ARE
            </p>

            <h2>
              Putting communities at the heart of better health
            </h2>

            <p>
              REHEMA is committed to improving health and
              wellbeing by working directly with communities
              and supporting practical solutions to local
              health challenges.
            </p>

            <p>
              Our work brings together medical outreach,
              health education, disease prevention,
              community engagement and partnerships that
              help communities access useful information
              and appropriate services.
            </p>

            <p>
              We believe lasting improvements happen when
              communities are informed, involved and
              empowered to participate in decisions
              affecting their health.
            </p>

            <Link
              to="/about"
              className="home-text-link"
            >
              Discover our story →
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          FUNDING / RESOURCE IMPACT
      ================================================= */}

      <section className="home-funding-section">

        <div className="container">

          <div className="home-section-heading">

            <p className="home-eyebrow">
              OUR GROWING IMPACT
            </p>

            <h2>
              Every contribution can create meaningful change
            </h2>

            <p>
              Through partnerships, community support and
              dedicated resources, REHEMA continues working
              toward healthier communities.
            </p>

          </div>


          <div className="home-funding-grid">

            {/* FUNDING CARD */}

            <div className="home-funding-card">

              <span className="funding-icon">
                UGX
              </span>

              <strong>
                <Counter
                  end={10000000}
                  prefix="UGX "
                />
              </strong>

              <h3>
                Funding Target
              </h3>

              <p>
                Resources mobilized toward community
                health activities and outreach.
              </p>

            </div>


            {/* PROGRAM CARD */}

            <div className="home-funding-card featured">

              <span className="funding-icon">
                +
              </span>

              <strong>
                <Counter
                  end={5}
                  suffix="+"
                />
              </strong>

              <h3>
                Program Areas
              </h3>

              <p>
                Multiple areas of intervention supporting
                health, prevention, education and empowerment.
              </p>

            </div>


            {/* COMMUNITY CARD */}

            <div className="home-funding-card">

              <span className="funding-icon">
                ♥
              </span>

              <strong>
                <Counter
                  end={100}
                  suffix="%"
                />
              </strong>

              <h3>
                Community Focus
              </h3>

              <p>
                Our programs are designed around the needs
                of the communities we serve.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          PROGRAMS
      ================================================= */}

      <section className="home-section home-work-section">

        <div className="container">

          <div className="home-section-heading">

            <p className="home-eyebrow">
              WHAT WE DO
            </p>

            <h2>
              Practical programs. Real community needs.
            </h2>

            <p>
              Our work focuses on health initiatives that
              connect communities with knowledge, services
              and opportunities.
            </p>

          </div>


          <div className="home-program-grid">

            {/* =================================================
                PROGRAM 01
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/medical-camp.jpg"
                  alt="REHEMA medical camp"
                />

                <span className="home-card-number">
                  01
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  Medical Camps
                </h3>

                <p>
                  Bringing health services, screening,
                  consultation and health information
                  closer to communities.
                </p>

                <Link to="/programs">
                  Explore Program →
                </Link>

              </div>

            </article>


            {/* =================================================
                PROGRAM 02
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/community.jpg"
                  alt="Community health"
                />

                <span className="home-card-number">
                  02
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  Community Health
                </h3>

                <p>
                  Supporting communities through awareness,
                  engagement and practical health initiatives.
                </p>

                <Link to="/programs">
                  Explore Program →
                </Link>

              </div>

            </article>


            {/* =================================================
                PROGRAM 03
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/maternal-health.jpg"
                  alt="Maternal health"
                />

                <span className="home-card-number">
                  03
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  Maternal Health
                </h3>

                <p>
                  Supporting healthier mothers, families
                  and communities through education and
                  access to services.
                </p>

                <Link to="/programs">
                  Explore Program →
                </Link>

              </div>

            </article>


            {/* =================================================
                PROGRAM 04
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/community.jpg"
                  alt="HIV prevention"
                />

                <span className="home-card-number">
                  04
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  HIV Prevention & PrEP
                </h3>

                <p>
                  Promoting prevention, testing, treatment
                  linkage and access to appropriate services.
                </p>

                <Link to="/programs">
                  Explore Program →
                </Link>

              </div>

            </article>


            {/* =================================================
                PROGRAM 05
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/about.jpg"
                  alt="Health education"
                />

                <span className="home-card-number">
                  05
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  Health Education
                </h3>

                <p>
                  Helping communities access practical
                  information that supports informed
                  health decisions.
                </p>

                <Link to="/programs">
                  Explore Program →
                </Link>

              </div>

            </article>


            {/* =================================================
                PROGRAM 06
            ================================================= */}

            <article className="home-program-card">

              <div className="home-card-image">

                <img
                  src="/images/rehema/team.jpg"
                  alt="REHEMA partnerships"
                />

                <span className="home-card-number">
                  06
                </span>

              </div>

              <div className="home-card-content">

                <h3>
                  Partnerships
                </h3>

                <p>
                  Collaborating with organizations,
                  professionals and stakeholders to
                  strengthen health solutions.
                </p>

                <Link to="/get-involved">
                  Partner With Us →
                </Link>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =================================================
          MEDICAL CAMP FEATURE
      ================================================= */}

      <section className="home-feature-section">

        <div className="container home-two-column">

          <div className="home-section-content">

            <p className="home-eyebrow">
              COMMUNITY IMPACT
            </p>

            <h2>
              From community conversations to action
            </h2>

            <p>
              REHEMA held a free medical camp on
              <strong> 13 August 2025</strong>, bringing
              health services and information closer to
              members of the community.
            </p>

            <p>
              The experience strengthened our commitment
              to expanding community outreach and building
              partnerships that can help address health
              challenges at the local level.
            </p>


            <div className="home-mini-stats">

              <div>

                <strong>
                  2025
                </strong>

                <span>
                  Medical Camp
                </span>

              </div>

              <div>

                <strong>
                  Free
                </strong>

                <span>
                  Community Outreach
                </span>

              </div>

            </div>


            <Link
              to="/news"
              className="home-btn home-btn-primary"
            >
              Read Our Stories →
            </Link>

          </div>


          <div className="home-feature-image">

            <img
              src="/images/rehema/medical-camp.jpg"
              alt="REHEMA medical outreach"
            />

            <div className="home-feature-caption">

              <strong>
                REHEMA Medical Outreach
              </strong>

              <span>
                Serving communities through practical action
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FOUNDER
      ================================================= */}

      <section className="home-founder-section">

        <div className="container">

          <div className="home-founder-grid">

            <div className="home-founder-image">

              <img
                src="/images/rehema/founder.jpeg"
                alt="Sydney Nsubuga"
              />

            </div>


            <div className="home-founder-content">

              <p className="home-eyebrow">
                MEET THE FOUNDER
              </p>

              <h2>
                I am the Founder
              </h2>

              <h3>
                Sydney Nsubuga
              </h3>

              <p className="home-founder-title">
                Clinical Epidemiologist & Public Health Specialist
              </p>

              <p>
                REHEMA was founded with a commitment to
                supporting communities through practical
                public health initiatives, health education
                and stronger community engagement.
              </p>

              <p>
                Through REHEMA, I am passionate about creating
                opportunities for communities to better
                understand health challenges, access appropriate
                services and participate in solutions that
                improve wellbeing.
              </p>

              <p>
                Our approach is grounded in evidence,
                compassion, collaboration and the belief that
                communities should be active participants in
                shaping healthier futures.
              </p>

              <div className="home-founder-signature">
                Sydney Nsubuga
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          WHY REHEMA
      ================================================= */}

      <section className="container home-section">

        <div className="home-section-heading">

          <p className="home-eyebrow">
            WHY REHEMA
          </p>

          <h2>
            A community-centered approach to health
          </h2>

          <p>
            We focus on practical action, meaningful
            partnerships and solutions that respond to
            the people we serve.
          </p>

        </div>


        <div className="home-values-grid">

          <div className="home-value-card">

            <div className="home-value-icon">
              01
            </div>

            <h3>
              Community First
            </h3>

            <p>
              We listen to communities and place their
              needs at the center of our work.
            </p>

          </div>


          <div className="home-value-card">

            <div className="home-value-icon">
              02
            </div>

            <h3>
              Evidence Based
            </h3>

            <p>
              We promote health information and
              interventions informed by public health
              knowledge.
            </p>

          </div>


          <div className="home-value-card">

            <div className="home-value-icon">
              03
            </div>

            <h3>
              Partnership
            </h3>

            <p>
              Collaboration helps create stronger and
              more sustainable health outcomes.
            </p>

          </div>


          <div className="home-value-card">

            <div className="home-value-icon">
              04
            </div>

            <h3>
              Lasting Impact
            </h3>

            <p>
              We aim to create initiatives that continue
              making a difference beyond individual
              activities.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          SPONSOR
      ================================================= */}

      <section className="home-sponsor-section">

        <div className="container">

          <div className="home-section-heading">

            <p className="home-eyebrow">
              OUR KEY SPONSOR
            </p>

            <h2>
              Together, we create greater impact
            </h2>

            <p>
              REHEMA is grateful for organizations and
              partners who believe in community health
              and sustainable development.
            </p>

          </div>


          <div className="home-sponsor-card">

            <div className="home-sponsor-logo">

              <img
                src="/images/rehema/rotary-logo.png"
                alt="Rotary Club of RY Denmark"
              />

            </div>


            <div>

              <span>
                KEY SPONSOR
              </span>

              <h3>
                Rotary Club of RY Denmark
              </h3>

              <p>
                Our key sponsor supporting REHEMA's
                commitment to community health and
                empowerment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CALL TO ACTION
      ================================================= */}

      <section className="home-cta-section">

        <div className="container">

          <p className="home-eyebrow">
            MAKE A DIFFERENCE
          </p>

          <h2>
            Be part of healthier communities
          </h2>

          <p>
            Whether you want to volunteer, partner with
            REHEMA, support our programs or stay informed,
            there is a place for you.
          </p>


          <div className="home-actions">

            <Link
              to="/get-involved"
              className="home-btn home-btn-primary"
            >
              Get Involved →
            </Link>

            <Link
              to="/donate"
              className="home-btn home-btn-outline"
            >
              Support Our Work →
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          NOTE:
          NEWSLETTER IS NO LONGER HERE.
          
          It is now inside Footer.jsx so that the
          newsletter appears uniformly across all
          public pages.
      ================================================= */}


      {/* =================================================
          SCROLL TO TOP
      ================================================= */}

      <button
        type="button"
        className="home-scroll-top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
        aria-label="Scroll back to top"
      >
        ↑
      </button>

    </main>
  );
}