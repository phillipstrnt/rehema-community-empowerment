import "dotenv/config";

import uploadRoutes from "./upload.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import rateLimit from
  "express-rate-limit";

import {
  connectDB
} from "./db.js";

import routes from "./routes.js";

const app =
  express();


const PORT =
  process.env.PORT || 5000;


/* SECURITY */

app.use(
  helmet()
);


/* CORS */

app.use(

  cors({

    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173"

  })

);


/* JSON */

app.use(

  express.json({
    limit: "1mb"
  })

);


/* UPLOAD ROUTES */

app.use(
  "/api/upload",
  uploadRoutes
);


/* LOGGING */

app.use(
  morgan("dev")
);

/* RATE LIMIT */

app.use(
  "/api",

  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit:
      200,

    standardHeaders:
      true,

    legacyHeaders:
      false

  })

);


/* ROUTES */

app.use(
  "/api",
  routes
);


/* 404 */

app.use(
  (_req, res) => {

    res
      .status(404)
      .json({
        message:
          "Route not found"
      });

  }
);


/* ERROR HANDLER */

app.use(

  (
    error,
    _req,
    res,
    _next
  ) => {

    console.error(error);


    res
      .status(500)
      .json({

        message:
          "Server error. Please try again later."

      });

  }

);


/* DATABASE + SERVER */

connectDB()

  .then(() => {

    app.listen(
      PORT,

      () => {

        console.log(
          `REHEMA API running on port ${PORT}`
        );

      }

    );

  })

  .catch(error => {

    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);

  });



  