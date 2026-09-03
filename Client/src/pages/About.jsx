
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {

  /* =====================================================
     ALWAYS START PAGE FROM TOP
  ===================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, []);

  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        {/* IMAGE: Add your best REHEMA organisation/community image */}
        <img
          src="/images/rehema/about.jpg"
          alt="REHEMA community health work"
          className="about-hero-image"
        />

        <div className="about-hero-overlay"></div>

        <div className="container about-hero-content">

          <p className="about-eyebrow">
            ABOUT REHEMA
          </p>

          <h1>
            Compassion in action.
            <br />
            Healthier communities.
          </h1>

          <p>
            Rural Empowerment on Health Management works alongside
            communities to address health inequalities and create
            opportunities for sustainable development.
          </p>

          <div className="about-hero-actions">

            <Link
              to="/programs"
              className="about-btn about-btn-primary"
            >
              Explore Our Programs
            </Link>

            <Link
              to="/get-involved"
              className="about-btn about-btn-light"
            >
              Get Involved
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="container about-section about-intro">

        <div className="about-intro-grid">

          <div className="about-image-column">

            {/* IMAGE: Use a genuine REHEMA field/community photo */}
            <img
              src="/images/rehema/community.jpg"
              alt="REHEMA working with communities"
              className="about-main-image"
            />

            <div className="about-image-label">
              <strong>REHEMA</strong>
              <span>Compassion • Empowerment • Community</span>
            </div>

          </div>


          <div className="about-content">

            <p className="about-eyebrow">
              WHO WE ARE
            </p>

            <h2>
              Compassion at the centre of community health
            </h2>

            <p>
              <strong>REHEMA</strong> is a Swahili word meaning
              <strong> compassion.</strong>
            </p>

            <p>
              Rural Empowerment on Health Management (REHEMA) is a
              non-governmental organisation working in line with
              government efforts to address health inequalities in
              Africa, initially focusing on communities in Uganda.
            </p>

            <p>
              We believe that there is no single best approach to
              addressing public health challenges. Instead, our work
              begins by listening to communities and understanding
              their priorities.
            </p>

            <p>
              Ill-health is often connected to wider social and
              economic conditions. For this reason, REHEMA works
              with communities to identify challenges, establish
              priorities and tailor interventions that respond to
              their realities.
            </p>

            <p>
              Our work connects people with health information and
              services, education, financial solutions and opportunities
              for their voices to be heard.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT REHEMA STANDS FOR
      ===================================================== */}

      <section className="about-highlight">

        <div className="container">

          <div className="about-highlight-content">

            <p className="about-eyebrow">
              OUR APPROACH
            </p>

            <h2>
              Health is more than the absence of disease
            </h2>

            <p>
              The World Health Organization defines health as a state
              of complete physical, mental and social well-being, not
              merely the absence of disease or infirmity.
            </p>

            <p>
              In light of this understanding, REHEMA seeks to address
              rural health through interconnected thematic program
              areas and projects that consider the broader conditions
              influencing people's wellbeing.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR FOCUS AREAS
      ===================================================== */}

      <section className="container about-section">

        <div className="about-section-heading">

          <p className="about-eyebrow">
            OUR FOCUS AREAS
          </p>

          <h2>
            Addressing the issues that shape community wellbeing
          </h2>

          <p>
            Our work brings together health, social and economic
            interventions because healthier communities require
            more than healthcare alone.
          </p>

        </div>


        <div className="about-focus-grid">


          {/* CARD 01 */}

          <article className="about-focus-card">

            {/* IMAGE: Maternal and child health photo */}
            <div className="about-card-image">

              <img
                src="/images/rehema/maternal-health.jpg"
                alt="Maternal and child health"
              />

              <span>01</span>

            </div>

            <div className="about-card-body">

              <h3>
                Maternal, Child Health & HIV/AIDS
              </h3>

              <p>
                Promoting equitable access to essential reproductive,
                maternal, newborn, child and adolescent health services
                while supporting HIV prevention and healthcare access.
              </p>

              <ul>
                <li>Maternal and newborn health</li>
                <li>Child and adolescent health</li>
                <li>HIV/AIDS prevention and services</li>
                <li>Birth and death registration</li>
              </ul>

            </div>

          </article>


          {/* CARD 02 */}

          <article className="about-focus-card">

            {/* IMAGE: Child development photo */}
            <div className="about-card-image">

              <img
                src="/images/rehema/community.jpg"
                alt="Child development and community support"
              />

              <span>02</span>

            </div>

            <div className="about-card-body">

              <h3>
                Child Development
              </h3>

              <p>
                We believe sustainable community development is
                strongly connected to the investment made in children
                from pregnancy through early childhood and beyond.
              </p>

              <ul>
                <li>Antenatal care awareness</li>
                <li>Safe delivery and postnatal care</li>
                <li>Child health and growth</li>
                <li>Vaccination awareness</li>
              </ul>

            </div>

          </article>


          {/* CARD 03 */}

          <article className="about-focus-card">

            {/* IMAGE: WASH/environment photo */}
            <div className="about-card-image">

              <img
                src="/images/rehema/wash.jpg"
                alt="Water sanitation hygiene and environment"
              />

              <span>03</span>

            </div>

            <div className="about-card-body">

              <h3>
                Water, Sanitation, Hygiene & Environment
              </h3>

              <p>
                We promote community awareness and practical action
                around sanitation, hygiene, safe water and
                environmentally responsible practices.
              </p>

              <ul>
                <li>Community sanitation awareness</li>
                <li>Safe water practices</li>
                <li>Personal and household hygiene</li>
                <li>Responsible waste management</li>
              </ul>

            </div>

          </article>


          {/* CARD 04 */}

          <article className="about-focus-card">

            {/* IMAGE: Economic empowerment/community meeting */}
            <div className="about-card-image">

              <img
                src="/images/rehema/economic-development.jpg"
                alt="Community and economic development"
              />

              <span>04</span>

            </div>

            <div className="about-card-body">

              <h3>
                Community & Economic Development
              </h3>

              <p>
                We recognise that social and economic empowerment
                contributes to physical, mental and social wellbeing.
              </p>

              <ul>
                <li>Village savings initiatives</li>
                <li>Loan and financial solutions</li>
                <li>Community networking</li>
                <li>Household economic resilience</li>
              </ul>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          MATERNAL CHILD HEALTH FEATURE
      ===================================================== */}

      <section className="about-feature">

        <div className="container about-feature-grid">

          <div className="about-feature-content">

            <span className="about-feature-number">
              01
            </span>

            <p className="about-eyebrow">
              PROGRAM AREA
            </p>

            <h2>
              Maternal, Child Health & HIV/AIDS
            </h2>

            <p>
              REHEMA's Maternal and Child Health Services Program
              focuses on improving utilisation of essential health
              services, particularly reproductive, maternal, newborn,
              child and adolescent health services.
            </p>

            <p>
              The program also supports initiatives aimed at improving
              birth and death registration services within communities.
            </p>


            <div className="about-mini-grid">

              <div>
                <strong>01</strong>
                <span>Primary healthcare</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Institutional capacity</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Civil registration</span>
              </div>

              <div>
                <strong>04</strong>
                <span>Governance</span>
              </div>

            </div>

          </div>


          <div className="about-feature-image">

            {/* IMAGE: Best maternal/child health photograph */}
            <img
              src="/images/rehema/maternal-health.jpg"
              alt="Maternal and child healthcare"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          COMMUNITY DEVELOPMENT
      ===================================================== */}

      <section className="container about-section">

        <div className="about-development-grid">

          <div>

            {/* IMAGE: Village/community meeting */}
            <img
              src="/images/rehema/community.jpg"
              alt="REHEMA community development"
              className="about-development-image"
            />

          </div>


          <div className="about-content">

            <p className="about-eyebrow">
              COMMUNITY EMPOWERMENT
            </p>

            <h2>
              Empowering people to shape their own future
            </h2>

            <p>
              We believe an economically and socially disempowered
              society cannot achieve physical, mental and social
              health.
            </p>

            <p>
              REHEMA promotes economic and social stability by
              supporting community structures such as village savings
              and loan associations.
            </p>

            <p>
              These initiatives can provide members with access to
              revolving loan capital while creating opportunities for
              networking, experience sharing and collective learning.
            </p>

            <p>
              Our approach is therefore not simply about delivering
              services to communities. It is about working with
              communities and strengthening their capacity to identify
              and respond to their own challenges.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          VISION & MISSION
      ===================================================== */}

      <section className="about-vision-section">

        <div className="container">

          <div className="about-section-heading light">

            <p className="about-eyebrow">
              OUR DIRECTION
            </p>

            <h2>
              Vision & Mission
            </h2>

          </div>


          <div className="about-vision-grid">


            <div className="about-statement-card">

              <span className="about-statement-icon">
                V
              </span>

              <p className="about-eyebrow">
                OUR VISION
              </p>

              <h3>
                To be the leading rural healthcare provider and
                community engagement organization.
              </h3>

            </div>


            <div className="about-statement-card">

              <span className="about-statement-icon">
                M
              </span>

              <p className="about-eyebrow">
                OUR MISSION
              </p>

              <h3>
                To promote equitable access to quality Maternal,
                Child (MCH/OVCs) and HIV/AIDS healthcare, WASH and
                environmentally friendly services through engaging
                rural communities for sustainable development.
              </h3>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR BELIEFS
      ===================================================== */}

      <section className="container about-section">

        <div className="about-section-heading">

          <p className="about-eyebrow">
            WHAT WE BELIEVE
          </p>

          <h2>
            Principles that guide our work
          </h2>

          <p>
            Our approach is rooted in empowerment, participation,
            equality and the belief that communities have the capacity
            to create meaningful change.
          </p>

        </div>


        <div className="about-beliefs-grid">


          <article className="about-belief-card">
            <span>01</span>
            <h3>People's Power</h3>
            <p>
              People have an inherent capacity to grow and blossom,
              even in difficult circumstances, when given appropriate
              support and opportunity.
            </p>
          </article>


          <article className="about-belief-card">
            <span>02</span>
            <h3>Shared Resources</h3>
            <p>
              Resources, goods, information, technology and services
              can create greater benefit when shared across communities.
            </p>
          </article>


          <article className="about-belief-card">
            <span>03</span>
            <h3>Empowerment</h3>
            <p>
              Communities should be empowered to understand, demand
              and participate in the services that affect their lives.
            </p>
          </article>


          <article className="about-belief-card">
            <span>04</span>
            <h3>Women & Families</h3>
            <p>
              Women possess immense strength and can act as powerful
              catalysts for positive development within families and
              communities.
            </p>
          </article>


          <article className="about-belief-card">
            <span>05</span>
            <h3>Participation</h3>
            <p>
              Sustainable development is strengthened when communities
              actively participate in planning, management and decision
              making.
            </p>
          </article>


          <article className="about-belief-card">
            <span>06</span>
            <h3>Economic Change</h3>
            <p>
              Economic transformation is an important contributor to
              wider social change and community wellbeing.
            </p>
          </article>


          <article className="about-belief-card">
            <span>07</span>
            <h3>Local Resources</h3>
            <p>
              Communities can build sustainable development by
              responsibly utilising their own knowledge, skills and
              resources.
            </p>
          </article>


          <article className="about-belief-card">
            <span>08</span>
            <h3>Self-Reliance</h3>
            <p>
              Our goal is to support steady development that strengthens
              resilience and reduces dependence over time.
            </p>
          </article>

        </div>

      </section>


      {/* =====================================================
          STRATEGIC GOALS
      ===================================================== */}

      <section className="about-goals-section">

        <div className="container">

          <div className="about-section-heading">

            <p className="about-eyebrow">
              OUR GOALS
            </p>

            <h2>
              What we are working toward
            </h2>

            <p>
              REHEMA's framework is designed around stronger health
              systems, empowered communities and sustainable development.
            </p>

          </div>


          <div className="about-goals-grid">

            <div className="about-goal-card">
              <span>01</span>
              <h3>Better Access</h3>
              <p>
                Improved access to appropriate and comprehensive
                healthcare, water, sanitation and hygiene.
              </p>
            </div>

            <div className="about-goal-card">
              <span>02</span>
              <h3>Sustainable Services</h3>
              <p>
                Effective, appropriate and sustainable healthcare
                service delivery.
              </p>
            </div>

            <div className="about-goal-card">
              <span>03</span>
              <h3>Skilled Workforce</h3>
              <p>
                An appropriate, skilled and well-supported health
                workforce.
              </p>
            </div>

            <div className="about-goal-card">
              <span>04</span>
              <h3>Collaboration</h3>
              <p>
                Collaborative health service planning and policy
                development.
              </p>
            </div>

            <div className="about-goal-card">
              <span>05</span>
              <h3>Good Governance</h3>
              <p>
                Strong leadership, governance, transparency and
                accountability.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOUNDER
      ===================================================== */}

      <section className="about-founder-section">

        <div className="container about-founder-grid">

          <div className="about-founder-image">

            {/* IMAGE: Sydney Nsubuga founder photograph */}
            <img
              src="https://res.cloudinary.com/ttymyelh/image/upload/v1788243559/founder.jpg"
              alt="Sydney Nsubuga, Founder of REHEMA"
            />

          </div>


          <div className="about-founder-content">

            <p className="about-eyebrow">
              LEADERSHIP
            </p>

            <h2>
              The vision behind REHEMA
            </h2>

            <h3>
              Sydney Nsubuga
            </h3>

            <p className="about-founder-role">
              Founder • Clinical Epidemiologist & Public Health Specialist
            </p>

            <p>
              REHEMA was founded around a commitment to supporting
              communities through practical public health initiatives,
              health education and stronger community engagement.
            </p>

            <p>
              As Founder, Sydney Nsubuga brings a public health
              perspective focused on understanding community health
              challenges and creating practical pathways toward
              sustainable solutions.
            </p>

            <p>
              REHEMA's work is guided by the belief that communities
              should not simply receive services. They should be
              participants in identifying priorities, shaping
              interventions and creating healthier futures.
            </p>

            <div className="about-founder-signature">
              Sydney Nsubuga
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PARTNERSHIP
      ===================================================== */}

      <section className="about-partnership-section">

        <div className="container about-partnership-grid">

          <div>

            <p className="about-eyebrow">
              COLLABORATION
            </p>

            <h2>
              Stronger together
            </h2>

            <p>
              Sustainable community health requires collaboration.
              REHEMA values partnerships with organisations,
              professionals, communities and stakeholders who share
              a commitment to improving lives.
            </p>

            <Link
              to="/get-involved"
              className="about-btn about-btn-primary"
            >
              Partner With REHEMA
            </Link>

          </div>


          <div className="about-sponsor-card">

            {/* IMAGE: Rotary logo */}
            <img
              src="/images/rehema/rotary-logo.png"
              alt="Rotary Club of RY Denmark"
            />

            <div>

              <span>
                KEY SPONSOR
              </span>

              <h3>
                Rotary Club of RY Denmark
              </h3>

              <p>
                REHEMA is grateful for the support of partners who
                contribute to community health and empowerment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CALL TO ACTION
      ===================================================== */}

      <section className="about-cta">

        <div className="container">

          <p className="about-eyebrow">
            JOIN THE MOVEMENT
          </p>

          <h2>
            Help us build healthier, stronger communities
          </h2>

          <p>
            Whether you want to volunteer, partner with REHEMA,
            support our work or stay connected with our activities,
            your involvement can contribute to meaningful community
            impact.
          </p>

          <div className="about-cta-actions">

            <Link
              to="/get-involved"
              className="about-btn about-btn-primary"
            >
              Get Involved
            </Link>

            <Link
              to="/donate"
              className="about-btn about-btn-light"
            >
              Support REHEMA
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
