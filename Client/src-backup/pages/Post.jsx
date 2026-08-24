import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  api
} from "../api";


export default function Post() {

  const { slug } = useParams();

  const [post, setPost] = useState(null);


  useEffect(() => {

    api(`/posts/${slug}`)
      .then(setPost)
      .catch(console.error);

  }, [slug]);


  if (!post) {

    return (

      <section className="container section">

        <p>
          Loading...
        </p>

      </section>

    );

  }


  return (

    <article className="container section narrow">

      <p className="eyebrow">
        NEWS
      </p>


      <h1>
        {post.title}
      </h1>


      <small>

        {new Date(
          post.publishedAt
        ).toLocaleDateString()}

        {" • "}

        {post.author}

      </small>


      <div className="article-body">

        {post.content
          .split("\n")
          .map(
            (paragraph, index) => (

              <p key={index}>
                {paragraph}
              </p>

            )
          )}

      </div>

    </article>

  );
}