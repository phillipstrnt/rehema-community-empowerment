import React from "react";

import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  api
} from "../api";


export default function News() {

  const [posts, setPosts] =
    useState([]);


  useEffect(() => {

    api("/posts")
      .then(setPosts)
      .catch(console.error);

  }, []);


  return (

    <section className="container section">

      <p className="eyebrow">
        NEWS & STORIES
      </p>

      <h1>
        REHEMA Updates
      </h1>


      <div className="cards">

        {posts.map(post => (

          <article
            className="card"
            key={post._id}
          >

            <small>

              {new Date(
                post.publishedAt
              ).toLocaleDateString()}

            </small>


            <h2>
              {post.title}
            </h2>


            <p>
              {post.excerpt}
            </p>


            <Link
              to={`/news/${post.slug}`}
            >
              Read Story →
            </Link>

          </article>

        ))}

      </div>

    </section>

  );
}
