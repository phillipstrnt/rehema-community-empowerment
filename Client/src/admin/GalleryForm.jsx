import React, { useMemo, useState } from "react";
import "../styles/Gallery.css";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  /*
    =========================================================
    ADD / CHANGE YOUR IMAGES HERE
    =========================================================

    All images should be placed in:

    Client/public/images/rehema/

    Example:
    Client/public/images/rehema/medical-camp-1.jpg

    Then add the filename below.

    Categories can be:
    Medical Camps
    Community Outreach
    Maternal Health
    Health Education
    Team & Partners
  */

  const galleryImages = [
    {
      id: 1,
      src: "/images/rehema/medical-camp.jpg",
      title: "REHEMA Medical Camp",
      category: "Medical Camps",
      description:
        "Community members accessing health services and information through REHEMA outreach.",
    },

    {
      id: 2,
      src: "/images/rehema/community.jpg",
      title: "Community Outreach",
      category: "Community Outreach",
      description:
        "Working together with communities to promote healthier and more resilient households.",
    },

    {
      id: 3,
      src: "/images/rehema/maternal-health.jpg",
      title: "Maternal Health",
      category: "Maternal Health",
      description:
        "Promoting maternal, newborn and family health through community-based initiatives.",
    },

    {
      id: 4,
      src: "/images/rehema/about.jpg",
      title: "Health Education",
      category: "Health Education",
      description:
        "Sharing practical health information that enables communities to make informed decisions.",
    },

    /*
      ADD MORE IMAGES BELOW

      {
        id: 5,
        src: "/images/rehema/your-image.jpg",
        title: "Your Image Title",
        category: "Community Outreach",
        description: "Your image description.",
      },
    */

    {
      id: 5,
      src: "/images/rehema/team.jpg",
      title: "REHEMA Team",
      category: "Team & Partners",
      description:
        "Our team and partners working together to strengthen community health.",
    },

    {
      id: 6,
      src: "/images/rehema/hero.jpg",
      title: "Serving Communities",
      category: "Community Outreach",
      description:
        "REHEMA's commitment to reaching communities with meaningful health interventions.",
    },
  ];

  const categories = [
    "All",
    "Medical Camps",
    "Community Outreach",
    "Maternal Health",
    "Health Education",
    "Team & Partners",
  ];

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") {
      return galleryImages;
    }

    return galleryImages.filter(
      (image) => image.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <main className="gallery-page">

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="gallery-hero">

        <div className="gallery-hero-background"></div>

        <div className="container gallery-hero-content">

          <span className="gallery-eyebrow">
            REHEMA • OUR STORIES IN PICTURES
          </span>

          <h1>
            Moments of
            <span> community impact.</span>
          </h1>

          <p>
            Explore moments from REHEMA's community health activities,
            medical outreach, health education, partnerships and
            initiatives supporting healthier communities.
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="container gallery-intro">

        <div className="gallery-intro-text">

          <span className="gallery-eyebrow">
            OUR GALLERY
          </span>

          <h2>
            See the people and moments behind our work
          </h2>

          <p>
            Every photograph tells a story of people coming together,
            sharing knowledge, accessing services and creating
            opportunities for better health.
          </p>

        </div>


        <div className="gallery-intro-highlight">

          <strong>
            {galleryImages.length}+
          </strong>

          <span>
            Featured moments
          </span>

        </div>

      </section>


      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="gallery-filter-section">

        <div className="container">

          <div className="gallery-filter">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "gallery-filter-btn active"
                    : "gallery-filter-btn"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          GALLERY GRID
      ===================================================== */}

      <section className="container gallery-main">

        {filteredImages.length > 0 ? (

          <div className="gallery-grid">

            {filteredImages.map((image, index) => (

              <article
                className={`gallery-card ${
                  index === 0 ? "gallery-card-featured" : ""
                }`}
                key={image.id}
                onClick={() => setSelectedImage(image)}
              >

                <div className="gallery-image-wrapper">

                  <img
                    src={image.src}
                    alt={image.title}
                    className="gallery-image"
                    loading="lazy"
                  />

                  <div className="gallery-image-overlay">

                    <div className="gallery-view-icon">
                      +
                    </div>

                    <span>
                      View image
                    </span>

                  </div>

                  <span className="gallery-category">
                    {image.category}
                  </span>

                </div>


                <div className="gallery-card-content">

                  <h3>
                    {image.title}
                  </h3>

                  <p>
                    {image.description}
                  </p>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="gallery-empty">

            <div>
              No images found in this category.
            </div>

            <button
              type="button"
              onClick={() => setActiveCategory("All")}
            >
              View all images
            </button>

          </div>

        )}

      </section>


      {/* =====================================================
          COMMUNITY STORY
      ===================================================== */}

      <section className="gallery-story">

        <div className="container gallery-story-grid">

          <div className="gallery-story-image">

            <img
              src="/images/rehema/community.jpg"
              alt="REHEMA community engagement"
              loading="lazy"
            />

            <div className="gallery-story-badge">
              <strong>Community First</strong>
              <span>Health • Education • Empowerment</span>
            </div>

          </div>


          <div className="gallery-story-content">

            <span className="gallery-eyebrow">
              BEYOND THE PHOTOGRAPHS
            </span>

            <h2>
              Every moment represents a person, a family or a community.
            </h2>

            <p>
              Our gallery captures more than events. It reflects the
              relationships, conversations and partnerships that make
              community health work possible.
            </p>

            <p>
              From medical outreach to health education and community
              engagement, REHEMA continues to work alongside communities
              to identify priorities and develop practical responses.
            </p>

            <div className="gallery-story-points">

              <div>
                <span>01</span>
                <strong>Listen</strong>
                <p>Understanding community priorities.</p>
              </div>

              <div>
                <span>02</span>
                <strong>Engage</strong>
                <p>Working together toward solutions.</p>
              </div>

              <div>
                <span>03</span>
                <strong>Impact</strong>
                <p>Turning action into meaningful change.</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PARTNERSHIP SECTION
      ===================================================== */}

      <section className="container gallery-partners">

        <div className="gallery-section-heading">

          <span className="gallery-eyebrow">
            STRONGER TOGETHER
          </span>

          <h2>
            Community health is a shared responsibility
          </h2>

          <p>
            Our work is strengthened by communities, health workers,
            volunteers, organizations and partners who contribute
            knowledge, resources and time.
          </p>

        </div>


        <div className="gallery-partner-cards">

          <div className="gallery-partner-card">

            <span className="gallery-partner-number">
              01
            </span>

            <h3>
              Communities
            </h3>

            <p>
              Communities help identify priorities and shape solutions
              that respond to their everyday realities.
            </p>

          </div>


          <div className="gallery-partner-card">

            <span className="gallery-partner-number">
              02
            </span>

            <h3>
              Health Professionals
            </h3>

            <p>
              Skilled professionals contribute expertise that supports
              quality health education and outreach.
            </p>

          </div>


          <div className="gallery-partner-card">

            <span className="gallery-partner-number">
              03
            </span>

            <h3>
              Partners
            </h3>

            <p>
              Strategic partnerships help expand resources and create
              opportunities for sustainable community impact.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CALL TO ACTION
      ===================================================== */}

      <section className="gallery-cta">

        <div className="container">

          <span className="gallery-eyebrow">
            JOIN THE JOURNEY
          </span>

          <h2>
            Help us create more moments worth capturing.
          </h2>

          <p>
            Volunteer, partner with REHEMA or support our community
            health programs and become part of the story.
          </p>

          <div className="gallery-cta-actions">

            <a
              href="/get-involved"
              className="gallery-btn gallery-btn-primary"
            >
              Get Involved →
            </a>

            <a
              href="/donate"
              className="gallery-btn gallery-btn-light"
            >
              Support REHEMA →
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          IMAGE LIGHTBOX
      ===================================================== */}

      {selectedImage && (

        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
        >

          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            ×
          </button>


          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
            />

            <div className="gallery-lightbox-info">

              <span>
                {selectedImage.category}
              </span>

              <h3>
                {selectedImage.title}
              </h3>

              <p>
                {selectedImage.description}
              </p>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}