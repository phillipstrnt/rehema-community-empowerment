
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Programs.css";



const programs = [
  {
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
    number: "06",
    title: "Community Health & Outreach",
    shortTitle: "Community Health",
    image: "/images/rehema/community-health.jpg",
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

export default function Programs() {
  return (
    <main className="programs-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="programs-hero">

        {/* IMAGE:
            Replace programs-hero.jpg with your strongest
            REHEMA community/program image.
        */}
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
            <a href="#programs" className="programs-btn programs-btn-primary">
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
            <strong>06</strong>
            <span>Core program areas</span>
          </div>

          <div className="programs-stat">
            <strong>MCH</strong>
            <span>Maternal & child health focus</span>
          </div>

          <div className="programs-stat">
            <strong>HIV</strong>
            <span>Prevention & support</span>
          </div>

          <div className="programs-stat">
            <strong>WASH</strong>
            <span>Water, sanitation & hygiene</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRAMS GRID
      ===================================================== */}

      <section id="programs" className="programs-list-section">

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


          <div className="programs-grid">

            {programs.map((program) => (

              <article
                className="program-card"
                key={program.number}
              >

                <div className="program-card-image">

                  <img
                    src={program.image}
                    alt={program.title}
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

                  <ul>
                    {program.points.map((point) => (
                      <li key={point}>
                        <span>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>

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

            {/* IMAGE:
                Add your best maternal/child health image here.
            */}
            <img
              src="/images/rehema/maternal-health.jpg"
              alt="Maternal and child health"
            />

            <div className="programs-image-badge">
              <strong>Maternal & Child Health</strong>
              <span>Protecting mothers, newborns and children</span>
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

            {/* IMAGE:
                Use a WASH, sanitation, water or environment photo.
            */}
            <img
              src="/images/rehema/wash.jpg"
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

          {/* IMAGE:
              Use a village savings, community meeting or
              economic empowerment photo.
          */}
          <img
            src="/images/rehema/economic-development.jpg"
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

            <span>COMMUNITY MODEL</span>

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

          {/* IMAGE:
              Use your strongest community outreach photo.
          */}
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