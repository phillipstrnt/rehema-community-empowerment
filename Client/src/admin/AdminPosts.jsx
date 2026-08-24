import React, {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import { api } from "../api";


export default function AdminPosts() {

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function loadPosts() {

    try {

      setLoading(true);

      const data =
        await api("/posts");

      setPosts(data);

    }

    catch (error) {

      console.error(error);

      setError(
        "Unable to load news posts."
      );

    }

    finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadPosts();

  }, []);


  return (

    <section>

      <div className="admin-page-header">

        <div>

          <p className="eyebrow">
            CONTENT
          </p>

          <h1>
            News
          </h1>

        </div>


        <Link
          to="/admin/posts/new"
          className="button"
        >
          + Add Story
        </Link>

      </div>


      {loading && (
        <p>
          Loading posts...
        </p>
      )}


      {error && (
        <p>
          {error}
        </p>
      )}


      {!loading && !error && (

        <div className="admin-table">

          {posts.length === 0 ? (

            <p>
              No news posts found.
            </p>

          ) : (

            posts.map(post => (

              <div
                className="admin-row"
                key={post._id}
              >

                <div>

                  <h3>
                    {post.title}
                  </h3>

                  <small>
                    {post.published
                      ? "Published"
                      : "Draft"}
                  </small>

                </div>


                <Link
                  to={`/admin/posts/${post._id}/edit`}
                  className="button secondary"
                >
                  Edit
                </Link>

              </div>

            ))

          )}

        </div>

      )}

    </section>

  );

}