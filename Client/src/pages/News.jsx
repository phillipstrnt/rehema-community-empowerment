
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/News.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


/* ============================================================
   FORMAT DATE
============================================================ */

function formatDate(date) {
  if (!date) return "REHEMA Update";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "REHEMA Update";
  }

  return parsedDate.toLocaleDateString("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


/* ============================================================
   GET CATEGORY
============================================================ */

function getCategory(post) {
  return (
    post.category ||
    post.type ||
    post.program ||
    "Community Health"
  );
}


/* ============================================================
   IMAGE FALLBACK
============================================================ */

function handleImageError(event) {
  event.currentTarget.src =
    "/images/rehema/community.jpg";
}


/* ============================================================
   NEWS PAGE
============================================================ */

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState("");

  /*
    ----------------------------------------------------------
    LOAD POSTS
    ----------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/posts`);

        if (!response.ok) {
          throw new Error("Unable to load news.");
        }

        const data = await response.json();

        const receivedPosts = Array.isArray(data)
          ? data
          : Array.isArray(data.posts)
          ? data.posts
          : [];

        if (mounted) {
          setPosts(receivedPosts);
        }
      } catch (err) {
        console.error("News loading error:", err);

        if (mounted) {
          setError(
            "We could not load the latest stories right now."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);


  const allStories = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      category: getCategory(post),
      image: post.image || post.imageUrl || "/images/rehema/community.jpg",
    }));
  }, [posts]);


  /*
    ----------------------------------------------------------
    CATEGORIES
  ----------------------------------------------------------
  */

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        allStories.map((story) => getCategory(story))
      ),
    ];

    return ["All", ...unique];
  }, [allStories]);


  /*
    ----------------------------------------------------------
    FILTER STORIES
  ----------------------------------------------------------
  */

  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      const category = getCategory(story);

      const matchesCategory =
        activeCategory === "All" ||
        category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        story.title?.toLowerCase().includes(searchText) ||
        story.excerpt?.toLowerCase().includes(searchText) ||
        story.content?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [allStories, activeCategory, search]);


  /*
    ----------------------------------------------------------
    FEATURED STORY
  ----------------------------------------------------------
  */

  const featuredStory =
    filteredStories.length > 0
      ? filteredStories[0]
      : null;

  const remainingStories =
    filteredStories.length > 1
      ? filteredStories.slice(1)
      : [];


  return (
    <main className="news-page">

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="news-hero">

        <img
          src="/images/rehema/news-hero.jpg"
          alt="REHEMA community stories"
          className="news-hero-image"
          onError={handleImageError}
        />

        <div className="news-hero-overlay"></div>

        <div className="container news-hero-content">

          <span className="news-eyebrow">
            NEWS & STORIES
          </span>

          <h1>
            Stories of health,
            <br />
            hope and community impact.
          </h1>

          <p>
            Discover the latest stories, community activities,
            health initiatives and updates from REHEMA as we
            work alongside communities toward healthier futures.
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRO / NEWSLETTER STYLE STRIP
      ===================================================== */}

      <section className="news-intro">

        <div className="container news-intro-grid">

          <div>

            <span className="news-small-label">
              FROM THE FIELD
            </span>

            <h2>
              Real work. Real communities. Real stories.
            </h2>

          </div>

          <p>
            From medical outreach and health education to maternal
            and child health, HIV prevention, WASH and community
            empowerment, this is where we share what REHEMA is
            doing and the difference our collective efforts are
            making.
          </p>

        </div>

      </section>


      {/* =====================================================
          SEARCH + CATEGORIES
      ===================================================== */}

      <section className="container news-controls">

        <div className="news-search">

          <span>⌕</span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search stories..."
            aria-label="Search stories"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>


        <div className="news-categories">

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                activeCategory === category
                  ? "news-category active"
                  : "news-category"
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

      </section>


      {/* =====================================================
          ERROR NOTICE
      ===================================================== */}

      {error && (
        <div className="container">
          <div className="news-notice">
            {error}
          </div>
        </div>
      )}


      {/* =====================================================
          FEATURED STORY
      ===================================================== */}

      {!loading && featuredStory && (
        <section className="container news-featured-section">

          <div className="news-section-heading">

            <div>
              <span className="news-small-label">
                FEATURED STORY
              </span>

              <h2>
                Latest from REHEMA
              </h2>
            </div>

            <span className="news-story-count">
              {filteredStories.length}{" "}
              {filteredStories.length === 1
                ? "story"
                : "stories"}
            </span>

          </div>


          <article className="news-featured-card">

            <div className="news-featured-image">

              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                onError={handleImageError}
              />

              <span className="news-featured-tag">
                {getCategory(featuredStory)}
              </span>

            </div>


            <div className="news-featured-content">

              <div className="news-meta">

                <span>
                  {formatDate(
                    featuredStory.createdAt ||
                    featuredStory.date ||
                    featuredStory.publishedAt
                  )}
                </span>

                <span>•</span>

                <span>
                  {featuredStory.author || "REHEMA"}
                </span>

              </div>


              <h3>
                {featuredStory.title}
              </h3>


              <p>
                {featuredStory.excerpt ||
                  "Read the latest REHEMA story and discover more about our work with communities."}
              </p>


              <Link
                to={`/news/${featuredStory.slug || featuredStory._id}`}
                className="news-read-button"
              >
                Read Full Story
                <span>→</span>
              </Link>

            </div>

          </article>

        </section>
      )}


      {/* =====================================================
          ALL STORIES
      ===================================================== */}

      <section className="container news-stories-section">

        <div className="news-section-heading">

          <div>

            <span className="news-small-label">
              LATEST UPDATES
            </span>

            <h2>
              Explore our stories
            </h2>

          </div>

        </div>


        {loading ? (

          <div className="news-loading-grid">

            {[1, 2, 3].map((item) => (
              <div
                className="news-skeleton"
                key={item}
              >
                <div className="news-skeleton-image"></div>

                <div className="news-skeleton-body">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ))}

          </div>

        ) : remainingStories.length > 0 ? (

          <div className="news-grid">

            {remainingStories.map((story, index) => (

              <article
                className="news-card"
                key={story._id || story.id || index}
              >

                <div className="news-card-image">

                  <img
                    src={story.image}
                    alt={story.title}
                    onError={handleImageError}
                  />

                  <span className="news-card-category">
                    {getCategory(story)}
                  </span>

                </div>


                <div className="news-card-body">

                  <div className="news-meta">

                    <span>
                      {formatDate(
                        story.createdAt ||
                        story.date ||
                        story.publishedAt
                      )}
                    </span>

                  </div>


                  <h3>
                    {story.title}
                  </h3>


                  <p>
                    {story.excerpt ||
                      "Discover more about REHEMA's work and community impact."}
                  </p>


                  <Link
                    to={`/news/${story.slug || story._id}`}
                    className="news-card-link"
                  >
                    Read Story
                    <span>→</span>
                  </Link>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="news-empty">

            <div className="news-empty-icon">
              ◌
            </div>

            <h3>
              No stories found
            </h3>

            <p>
              Try another search term or select a different
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="news-reset-button"
            >
              View All Stories
            </button>

          </div>

        )}

      </section>


      {/* =====================================================
          PROGRAM STORY BANNERS
      ===================================================== */}

      <section className="news-topic-section">

        <div className="container">

          <div className="news-section-heading centered">

            <span className="news-small-label">
              OUR FOCUS
            </span>

            <h2>
              Stories from the areas that matter
            </h2>

            <p>
              Explore the health and development themes that
              shape REHEMA's work with communities.
            </p>

          </div>


          <div className="news-topic-grid">

            <Link
              to="/programs"
              className="news-topic-card"
            >

              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788243562/maternal-health1.jpg"
                alt="Maternal and child health"
                onError={handleImageError}
              />

              <div className="news-topic-overlay">

                <span>
                  01
                </span>

                <h3>
                  Maternal & Child Health
                </h3>

                <p>
                  Supporting healthier mothers, children
                  and families.
                </p>

                <strong>
                  Explore →
                </strong>

              </div>

            </Link>


            <Link
              to="/programs"
              className="news-topic-card"
            >

              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788243561/Maternal_mortality__It_s_just_poor_African_and_Asian_women_dying___Liz_Ford.jpg2"
                alt="Community development"
                onError={handleImageError}
              />

              <div className="news-topic-overlay">

                <span>
                  02
                </span>

                <h3>
                  Community Development
                </h3>

                <p>
                  Empowering people to participate in
                  healthier communities.
                </p>

                <strong>
                  Explore →
                </strong>

              </div>

            </Link>


            <Link
              to="/programs"
              className="news-topic-card"
            >

              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788243556/camp11.jpg"
                alt="Medical outreach"
                onError={handleImageError}
              />

              <div className="news-topic-overlay">

                <span>
                  03
                </span>

                <h3>
                  Medical Outreach
                </h3>

                <p>
                  Taking essential health information and
                  services closer to communities.
                </p>

                <strong>
                  Explore →
                </strong>

              </div>

            </Link>


            <Link
              to="/programs"
              className="news-topic-card"
            >

              <img
                src="https://res.cloudinary.com/ttymyelh/image/upload/v1788243556/camp14.jpg"
                alt="Health education"
                onError={handleImageError}
              />

              <div className="news-topic-overlay">

                <span>
                  04
                </span>

                <h3>
                  Health Education
                </h3>

                <p>
                  Equipping communities with practical
                  health information.
                </p>

                <strong>
                  Explore →
                </strong>

              </div>

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEWS CTA
      ===================================================== */}

      <section className="news-cta">

        <div className="container news-cta-inner">

          <div>

            <span className="news-small-label">
              JOIN THE JOURNEY
            </span>

            <h2>
              Help us turn stories into action.
            </h2>

            <p>
              Volunteer, partner with REHEMA or support our
              community initiatives and become part of the work
              happening on the ground.
            </p>

          </div>


          <div className="news-cta-actions">

            <Link
              to="/get-involved"
              className="news-cta-primary"
            >
              Get Involved
              <span>→</span>
            </Link>

            <Link
              to="/donate"
              className="news-cta-secondary"
            >
              Support REHEMA
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
