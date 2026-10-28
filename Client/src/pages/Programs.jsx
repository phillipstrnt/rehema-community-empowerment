
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Programs.css";
import api from "../api";

/* =====================================================
   HARDCODED PROGRAMS
   These remain permanently available on the website.
===================================================== */

const hardcodedPrograms = [
  {
    id: "hardcoded-01",
    number: "01",
    title: "Maternal, Child Health & HIV/AIDS",
    shortTitle: "Maternal & Child Health",
    image: "/images/rehema/maternal-health.jpg",
    description:
      "We work to improve access to essential reproductive, maternal, newborn, child and adolescent health services while supporting communities to prevent and respond to HIV/AIDS.",
    points: [
      "Maternal and reproductive health",
      "Newborn and child health",
      "Adolescent health",
      "HIV prevention and awareness",
      "Health service utilization",
      "Birth and death registration"
    ]
  },
  {
    id: "hardcoded-02",
    number: "02",
    title: "Child Development",
    shortTitle: "Child Development",
    image: "/images/rehema/child-health.jpg",
    description:
      "We believe that investing in children creates stronger families and healthier communities. Our work supports appropriate nurturing, health and development from pregnancy through childhood.",
    points: [
      "Child wellbeing",
      "Antenatal care awareness",
      "Postnatal care awareness",
      "Child vaccination awareness",
      "Early childhood development",
      "Family health education"
    ]
  },
  {
    id: "hardcoded-03",
    number: "03",
    title: "HIV Prevention & PrEP",
    shortTitle: "HIV Prevention",
    image: "/images/rehema/hiv-prevention.jpg",
    description:
      "We promote accurate health information, HIV prevention, testing, treatment linkage and access to appropriate prevention services within communities.",
    points: [
      "HIV prevention education",
      "Community sensitization",
      "Testing awareness",
      "Treatment linkage",
      "PrEP awareness",
      "Stigma reduction"
    ]
  },
  {
    id: "hardcoded-04",
    number: "04",
    title: "Water, Sanitation, Hygiene & Environment",
    shortTitle: "WASH & Environment",
    image: "/images/rehema/wash.jpg",
    description:
      "Healthy communities depend on healthy environments. We promote improved sanitation, hygiene, safe water practices and responsible environmental management.",
    points: [
      "Water safety awareness",
      "Household sanitation",
      "Personal hygiene",
      "Community sanitation",
      "Waste management",
      "Environmental awareness"
    ]
  },
  {
    id: "hardcoded-05",
    number: "05",
    title: "Community & Economic Development",
    shortTitle: "Economic Development",
    image: "/images/rehema/economic-development.jpg",
    description:
      "We support social and economic empowerment because families facing economic hardship can struggle to achieve sustainable health and wellbeing.",
    points: [
      "Village savings initiatives",
      "Access to revolving loan capital",
      "Community networking",
      "Household economic empowerment",
      "Skills and knowledge sharing",
      "Community-led development"
    ]
  },
  {
    id: "hardcoded-06",
    number: "06",
    title: "Community Health & Outreach",
    shortTitle: "Community Health",
    image: "https://res.cloudinary.com/ttymyelh/image/upload/v1788243559/group1.webp",
    description:
      "We bring health information, services and community engagement closer to people, particularly communities that may face barriers to accessing conventional health services.",
    points: [
      "Community outreach",
      "Health screening",
      "Health awareness",
      "Community dialogue",
      "Referral and linkage",
      "Public health education"
    ]
  }
];


/* =====================================================
   APPROACH
===================================================== */

const approaches = [
  {
    number: "01",
    title: "Listen",
    text:
      "We begin by understanding community priorities, experiences and health challenges."
  },
  {
    number: "02",
    title: "Engage",
    text:
      "We work alongside communities, local leaders, health workers and other stakeholders."
  },
  {
    number: "03",
    title: "Educate",
    text:
      "We provide practical information that enables people to make informed health decisions."
  },
  {
    number: "04",
    title: "Act",
    text:
      "We translate identified needs into practical programs, outreach activities and partnerships."
  }
];


/* =====================================================
   HELPER
   Convert database program into the same structure
   used by the existing program cards.
===================================================== */

function normalizeProgram(program, index) {
  const points = Array.isArray(program.points)
    ? program.points
    : Array.isArray(program.focusAreas)
      ? program.focusAreas
      : [];

  return {
    id: program._id || program.id || `database-${index}`,
    number: String(index + 1).padStart(2, "0"),
    title: program.title || "REHEMA Program",
    shortTitle:
      program.shortTitle ||
      program.title ||
      "REHEMA Program",
    image: program.image || "/images/rehema/program-placeholder.jpg",
    description:
      program.shortDescription ||
      program.description ||
      "REHEMA works with communities to improve health, wellbeing and sustainable development.",
    points
  };
}


/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Programs() {

  const [databasePrograms, setDatabasePrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState(false);


  /* =====================================================
     FETCH PROGRAMS FROM API
  ===================================================== */

  useEffect(() => {

    let mounted = true;

    async function loadPrograms() {

      try {

        setProgramsLoading(true);
        setProgramsError(false);

        const data = await api("/programs");

        /*
          The backend normally returns an array.

          This also safely handles APIs that return:
          { programs: [...] }
          or
          { data: [...] }
        */

        const returnedPrograms =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.programs)
              ? data.programs
              : Array.isArray(data?.data)
                ? data.data
                : [];

        if (mounted) {
          setDatabasePrograms(returnedPrograms);
        }

      } catch (error) {

        console.error(
          "Failed to load programs:",
          error
        );

        if (mounted) {
          setProgramsError(true);
          setDatabasePrograms([]);
        }

      } finally {

        if (mounted) {
          setProgramsLoading(false);
        }

      }

    }

    loadPrograms();

    return () => {
      mounted = false;
    };

  }, []);


  /* =====================================================
     COMBINE HARDCODED + DATABASE PROGRAMS

     Existing hardcoded programs remain.

     Database programs are added after them.

     Duplicate titles are removed so the same program
     is not displayed twice if it exists in both places.
  ===================================================== */

  const programs = useMemo(() => {

    const normalizedDatabasePrograms =
      databasePrograms
        .filter((program) => program && program.active !== false)
        .map((program, index) =>
          normalizeProgram(
            program,
            index + hardcodedPrograms.length
          )
        );


    const databaseByTitle = new Map(
      normalizedDatabasePrograms.map((program) => [
        String(program.title || "").trim().toLowerCase(),
        program,
      ])
    );

    // Keep the original public programme catalogue, but let admin-managed
    // entries replace matching cards so edits in the dashboard take effect.
    const combined = hardcodedPrograms.map((program) => {
      const key = String(program.title || "").trim().toLowerCase();
      const managedProgram = databaseByTitle.get(key);
      if (!managedProgram) return program;
      databaseByTitle.delete(key);
      return { ...program, ...managedProgram };
    });

    combined.push(...databaseByTitle.values());


    /*
      Remove duplicate titles.

      This is case-insensitive and prevents an
      accidentally duplicated database program
      from appearing twice.
    */

    const seenTitles = new Set();

    return combined.filter((program) => {

      const titleKey =
        String(program.title || "")
          .trim()
          .toLowerCase();

      if (!titleKey) {
        return true;
      }

      if (seenTitles.has(titleKey)) {
        return false;
      }

      seenTitles.add(titleKey);

      return true;

    });

  }, [databasePrograms]);


  /* =====================================================
     DISPLAY NUMBERS

     The program number is regenerated here so that
     database programs continue from the hardcoded ones.
  ===================================================== */

  const displayPrograms = useMemo(() => {

    return programs.map((program, index) => ({
      ...program,
      number: String(index + 1).padStart(2, "0")
    }));

  }, [programs]);


  return (
    <main className="programs-page">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="programs-hero">

        <img
          src="/images/rehema/programs-hero.jpg"
          alt="REHEMA community health programs"
          className="programs-hero-image"
        />

        <div className="programs-hero-overlay"></div>

        <div className="container programs-hero-content">

          <span className="programs-eyebrow">
            OUR PROGRAMS
          </span>

          <h1>
            Turning community priorities
            <br />
            into meaningful action.
          </h1>

          <p>
            REHEMA develops and supports community-centered initiatives
            that promote better health, stronger families, healthier
            environments and sustainable community development.
          </p>

          <div className="programs-hero-actions">

            <a
              href="#programs"
              className="programs-btn programs-btn-primary"
            >
              Explore Our Programs
              <span>↓</span>
            </a>

            <Link
              to="/get-involved"
              className="programs-btn programs-btn-outline"
            >
              Get Involved
              <span>→</span>
            </Link>

          </div>

        </div>

        <div className="programs-hero-tag">
          <strong>Community First</strong>
          <span>Health • Education • Empowerment</span>
        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="container programs-intro">

        <div className="programs-intro-heading">

          <span className="programs-eyebrow dark">
            OUR APPROACH
          </span>

          <h2>
            Health is more than the absence of disease.
          </h2>

        </div>

        <div className="programs-intro-content">

          <p>
            REHEMA recognizes that health is influenced by the social,
            economic and environmental conditions in which people live.
            For this reason, our programs extend beyond clinical services
            to address the wider factors that influence wellbeing.
          </p>

          <p>
            We work with communities to identify priorities, develop
            practical interventions and strengthen access to health
            information and services.
          </p>

          <p>
            Our goal is not simply to deliver activities, but to help
            communities develop the knowledge, confidence, relationships
            and opportunities needed to create sustainable change.
          </p>

        </div>

      </section>


      {/* =====================================================
          PROGRAM STATISTICS
      ===================================================== */}

      <section className="programs-stats">

        <div className="container programs-stats-grid">

          <div className="programs-stat">

            <strong>
              {programsLoading
                ? "—"
                : String(displayPrograms.length).padStart(2, "0")}
            </strong>

            <span>
              Program areas
            </span>

          </div>


          <div className="programs-stat">

            <strong>
              MCH
            </strong>

            <span>
              Maternal & child health focus
            </span>

          </div>


          <div className="programs-stat">

            <strong>
              HIV
            </strong>

            <span>
              Prevention & support
            </span>

          </div>


          <div className="programs-stat">

            <strong>
              WASH
            </strong>

            <span>
              Water, sanitation & hygiene
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRAMS GRID
      ===================================================== */}

      <section
        id="programs"
        className="programs-list-section"
      >

        <div className="container">

          <div className="programs-section-heading">

            <span className="programs-eyebrow dark">
              PROGRAM AREAS
            </span>

            <h2>
              Building healthier communities from the ground up
            </h2>

            <p>
              Our thematic program areas respond to interconnected
              health, social, environmental and economic needs.
            </p>

          </div>


          {/* -------------------------------------------------
              LOADING STATE
          ------------------------------------------------- */}

          {programsLoading && (

            <div
              className="programs-loading"
              aria-live="polite"
            >
              Loading additional programs...
            </div>

          )}


          {/* -------------------------------------------------
              API ERROR

              The hardcoded programs still display, so the
              website remains functional.
          ------------------------------------------------- */}

          {programsError && (

            <div
              className="programs-api-notice"
              role="status"
            >
              Additional programs could not be loaded right now.
              Our core program areas are still available below.
            </div>

          )}


          {/* -------------------------------------------------
              PROGRAM CARDS
          ------------------------------------------------- */}

          <div className="programs-grid">

            {displayPrograms.map((program) => (

              <article
                className="program-card"
                key={program.id}
              >

                <div className="program-card-image">

                  <img
                    src={program.image}
                    alt={program.title}
                    onError={(event) => {
                      event.currentTarget.src =
                        "/images/rehema/program-placeholder.jpg";
                    }}
                  />

                  <span className="program-card-number">
                    {program.number}
                  </span>

                </div>


                <div className="program-card-body">

                  <span className="program-card-label">
                    PROGRAM AREA
                  </span>

                  <h3>
                    {program.title}
                  </h3>

                  <p>
                    {program.description}
                  </p>


                  <div className="program-card-divider"></div>


                  <h4>
                    Our focus includes
                  </h4>


                  {program.points.length > 0 ? (

                    <ul>

                      {program.points.map(
                        (point, pointIndex) => (

                          <li
                            key={`${program.id}-point-${pointIndex}`}
                          >

                            <span>✓</span>

                            {point}

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <ul>

                      <li>
                        <span>✓</span>
                        Community-centered services
                      </li>

                      <li>
                        <span>✓</span>
                        Health education and awareness
                      </li>

                      <li>
                        <span>✓</span>
                        Community engagement
                      </li>

                    </ul>

                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED MATERNAL HEALTH SECTION
      ===================================================== */}

      <section className="programs-feature">

        <div className="container programs-feature-grid">

          <div className="programs-feature-image">

            <img
              src="/images/rehema/maternal-health.jpg"
              alt="Maternal and child health"
            />

            <div className="programs-image-badge">

              <strong>
                Maternal & Child Health
              </strong>

              <span>
                Protecting mothers, newborns and children
              </span>

            </div>

          </div>


          <div className="programs-feature-content">

            <span className="programs-eyebrow dark">
              PRIORITY AREA
            </span>

            <h2>
              Investing in mothers and children means investing in the future.
            </h2>

            <p>
              REHEMA seeks to improve the utilization of essential
              reproductive, maternal, newborn, child and adolescent
              health services in communities.
            </p>

            <p>
              We support awareness around antenatal, delivery and
              postnatal care while promoting healthy childhood
              development and access to essential health services.
            </p>

            <div className="programs-feature-points">

              <div>
                <strong>01</strong>
                <span>Maternal health awareness</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Newborn and child health</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Adolescent health</span>
              </div>

              <div>
                <strong>04</strong>
                <span>Health service access</span>
              </div>

            </div>

            <Link
              to="/contact"
              className="programs-text-link"
            >
              Learn more about our work →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          WASH SECTION
      ===================================================== */}

      <section className="programs-wash">

        <div className="container programs-wash-grid">

          <div className="programs-wash-content">

            <span className="programs-eyebrow">
              HEALTHY ENVIRONMENTS
            </span>

            <h2>
              Clean water. Better sanitation. Healthier communities.
            </h2>

            <p>
              Water, sanitation and hygiene are fundamental to public
              health. Poor sanitation and unsafe hygiene practices can
              expose communities to preventable disease and environmental
              hazards.
            </p>

            <p>
              REHEMA works to promote practical sanitation and hygiene
              practices while encouraging communities to understand the
              connection between environmental conditions and health.
            </p>

            <div className="programs-wash-highlights">

              <div>
                <strong>W</strong>
                <span>Safe Water</span>
              </div>

              <div>
                <strong>S</strong>
                <span>Sanitation</span>
              </div>

              <div>
                <strong>H</strong>
                <span>Hygiene</span>
              </div>

              <div>
                <strong>E</strong>
                <span>Environment</span>
              </div>

            </div>

          </div>


          <div className="programs-wash-image">

            <img
              src="https://res.cloudinary.com/ttymyelh/image/upload/v1788362003/Gasi_Spring_Ethiopia.jpg"
              alt="Water sanitation hygiene and environment"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          COMMUNITY ECONOMIC DEVELOPMENT
      ===================================================== */}

      <section className="container programs-economic">

        <div className="programs-economic-image">

          <img
            src="https://res.cloudinary.com/ttymyelh/image/upload/v1788363465/savings.jpg"
            alt="Community economic development"
          />

        </div>


        <div className="programs-economic-content">

          <span className="programs-eyebrow dark">
            EMPOWERMENT
          </span>

          <h2>
            Healthier communities need stronger economic foundations.
          </h2>

          <p>
            We believe that social and economic empowerment is closely
            connected to physical, mental and social wellbeing.
          </p>

          <p>
            Through community-based approaches such as village savings
            and loan associations, communities can create opportunities
            for individuals and families to access revolving capital,
            strengthen relationships and build resilience.
          </p>


          <div className="programs-economic-card">

            <span>
              COMMUNITY MODEL
            </span>

            <h3>
              Savings → Opportunity → Resilience
            </h3>

            <p>
              Communities come together to save, share experiences,
              access opportunities and support one another.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW WE WORK
      ===================================================== */}

      <section className="programs-approach">

        <div className="container">

          <div className="programs-section-heading light">

            <span className="programs-eyebrow">
              HOW WE WORK
            </span>

            <h2>
              From listening to lasting action.
            </h2>

            <p>
              Our approach is participatory, community-centered and
              focused on practical solutions.
            </p>

          </div>


          <div className="programs-approach-grid">

            {approaches.map((item) => (

              <div
                className="approach-card"
                key={item.number}
              >

                <span className="approach-number">
                  {item.number}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COMMUNITY OUTREACH FEATURE
      ===================================================== */}

      <section className="container programs-outreach">

        <div className="programs-outreach-content">

          <span className="programs-eyebrow dark">
            COMMUNITY OUTREACH
          </span>

          <h2>
            Taking health information and services closer to people.
          </h2>

          <p>
            Community outreach allows REHEMA to engage directly with
            people, understand local concerns and connect communities
            with relevant health information and services.
          </p>

          <div className="programs-outreach-stats">

            <div>
              <strong>01</strong>
              <span>Engage communities</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Identify priorities</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Connect services</span>
            </div>

          </div>

        </div>


        <div className="programs-outreach-image">

          <img
            src="/images/rehema/programs-community.jpg"
            alt="REHEMA community outreach"
          />

        </div>

      </section>


      {/* =====================================================
          PARTNERSHIP SECTION
      ===================================================== */}

      <section className="programs-partnership">

        <div className="container programs-partnership-inner">

          <div>

            <span className="programs-eyebrow">
              COLLABORATION
            </span>

            <h2>
              Stronger partnerships. Greater impact.
            </h2>

            <p>
              Sustainable community health requires collaboration.
              REHEMA welcomes partnerships with organizations,
              professionals, institutions, community leaders and
              individuals who share our commitment to healthier
              communities.
            </p>

          </div>

          <Link
            to="/get-involved"
            className="programs-btn programs-btn-primary"
          >
            Partner With REHEMA
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="programs-cta">

        <div className="container">

          <span className="programs-eyebrow">
            JOIN THE MOVEMENT
          </span>

          <h2>
            Help us turn community needs into lasting change.
          </h2>

          <p>
            Your time, expertise, partnership or financial support can
            help REHEMA expand health initiatives and reach more
            communities.
          </p>

          <div className="programs-cta-actions">

            <Link
              to="/get-involved"
              className="programs-btn programs-btn-primary"
            >
              Get Involved →
            </Link>

            <Link
              to="/donate"
              className="programs-btn programs-btn-outline"
            >
              Support Our Work →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
