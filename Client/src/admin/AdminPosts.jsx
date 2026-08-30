
import React, {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  api
} from "../api";


export default function AdminPosts() {

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [facebookPublishing, setFacebookPublishing] =
    useState("");


  async function loadPosts() {

    try {

      setLoading(true);
      setError("");

      const data =
        await api("/posts");

      setPosts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load news posts."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadPosts();

  }, []);


  async function deletePost(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this story? This cannot be undone."
      );

    if (!confirmed) return;


    try {

      await api(
        `/posts/${id}`,
        {
          method: "DELETE",
        }
      );


      setPosts(
        previous =>
          previous.filter(
            post =>
              post._id !== id
          )
      );

    } catch (error) {

      console.error(error);

      alert(error.message);

    }
  }


  async function publishToFacebook(post) {

    if (
      post.facebook?.published
    ) {

      alert(
        "This story has already been published to Facebook."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `Publish "${post.title}" to the REHEMA Facebook Page?`
      );


    if (!confirmed) return;


    try {

      setFacebookPublishing(
        post._id
      );


      const data =
        await api(
          `/admin/facebook/posts/${post._id}`,
          {
            method: "POST",
          }
        );


      alert(
        data.message ||
        "Published to Facebook successfully."
      );


      await loadPosts();


    } catch (error) {

      console.error(
        "FACEBOOK ERROR:",
        error
      );


      alert(
        error.message ||
        "Unable to publish to Facebook."
      );

    } finally {

      setFacebookPublishing(
        ""
      );

    }
  }


  const filteredPosts =
    posts.filter(
      post => {

        const searchText =
          search.toLowerCase();


        return (

          post.title
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          post.author
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          post.excerpt
            ?.toLowerCase()
            .includes(
              searchText
            )

        );

      }
    );


  return (

    <section className="admin-content-page">


      {/* HEADER */}

      <div className="admin-content-header">

        <div>

          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>
            News & Stories
          </h1>

          <p className="admin-page-description">
            Create, publish and manage REHEMA news,
            community stories and updates.
          </p>

        </div>


        <Link
          to="/admin/posts/new"
          className="admin-button admin-button-primary"
        >
          + Add Story
        </Link>

      </div>


      {/* TOOLBAR */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={
              event =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


        <div className="admin-count">

          {filteredPosts.length}{" "}

          {
            filteredPosts.length === 1
              ? "story"
              : "stories"
          }

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="admin-alert admin-alert-error">
          {error}
        </div>

      )}


      {/* LOADING */}

      {loading && (

        <div className="admin-empty-state">

          <div className="admin-loader"></div>

          <p>
            Loading stories...
          </p>

        </div>

      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredPosts.length === 0 && (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📰
            </div>

            <h2>
              No stories found
            </h2>

            <p>
              Start publishing REHEMA news and
              community stories.
            </p>

            <Link
              to="/admin/posts/new"
              className="admin-button admin-button-primary"
            >
              + Create Your First Story
            </Link>

          </div>

        )}


      {/* STORIES */}

      {!loading &&
        filteredPosts.length > 0 && (

          <div className="admin-content-grid">

            {filteredPosts.map(
              post => (

                <article
                  className="admin-content-card"
                  key={post._id}
                >


                  {/* IMAGE */}

                  <div className="admin-card-image">

                    {post.image ? (

                      <img
                        src={post.image}
                        alt={post.title}
                      />

                    ) : (

                      <div className="admin-no-image">

                        <span>
                          📰
                        </span>

                        <p>
                          No image
                        </p>

                      </div>

                    )}


                    <span
                      className={
                        post.published
                          ? "admin-status published"
                          : "admin-status draft"
                      }
                    >

                      {post.published
                        ? "Published"
                        : "Draft"}

                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="admin-card-body">


                    <div className="admin-card-meta">

                      <span>
                        {
                          post.author ||
                          "REHEMA"
                        }
                      </span>


                      {post.createdAt && (

                        <>

                          <span>
                            •
                          </span>

                          <span>

                            {
                              new Date(
                                post.createdAt
                              ).toLocaleDateString()
                            }

                          </span>

                        </>

                      )}

                    </div>


                    <h2>
                      {post.title}
                    </h2>


                    <p>

                      {
                        post.excerpt ||
                        "No excerpt available for this story."
                      }

                    </p>


                    {/* FACEBOOK STATUS */}

                    <div
                      style={{
                        marginTop: "12px",
                        marginBottom: "12px"
                      }}
                    >

                      {post.facebook?.published ? (

                        <span
                          className="admin-status published"
                        >
                          ✓ Published on Facebook
                        </span>

                      ) : post.facebook?.status === "failed" ? (

                        <span
                          className="admin-status draft"
                        >
                          ⚠ Facebook publishing failed
                        </span>

                      ) : (

                        <span
                          className="admin-status draft"
                        >
                          Facebook: Not published
                        </span>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="admin-card-actions">


                      <Link
                        to={`/admin/posts/${post._id}/edit`}
                        className="admin-button admin-button-secondary"
                      >
                        ✏️ Edit
                      </Link>


                      <button
                        type="button"
                        className="admin-button admin-button-danger"
                        onClick={() =>
                          deletePost(
                            post._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>


                      <button
                        type="button"
                        className="admin-button admin-button-primary"
                        disabled={
                          facebookPublishing ===
                          post._id ||
                          post.facebook?.published
                        }
                        onClick={() =>
                          publishToFacebook(
                            post
                          )
                        }
                      >

                        {
                          facebookPublishing ===
                          post._id

                            ? "Publishing..."

                            : post.facebook?.published

                              ? "✓ Facebook"

                              : "📘 Publish to Facebook"
                        }

                      </button>


                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

    </section>

  );
}