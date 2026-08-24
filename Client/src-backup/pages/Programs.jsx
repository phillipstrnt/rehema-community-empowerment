import {
  useEffect,
  useState
} from "react";

import {
  api
} from "../api";


export default function Programs() {

  const [programs, setPrograms] =
    useState([]);


  useEffect(() => {

    api("/programs")
      .then(setPrograms)
      .catch(console.error);

  }, []);


  return (

    <section className="container section">

      <p className="eyebrow">
        PROGRAMS & SERVICES
      </p>

      <h1>
        What We Do
      </h1>


      <div className="cards">

        {programs.map(program => (

          <article
            className="card"
            key={program._id}
          >

            <h2>
              {program.title}
            </h2>

            <p>
              {program.shortDescription}
            </p>

            <p>
              {program.description}
            </p>

          </article>

        ))}

      </div>

    </section>

  );
}