import express from "express";

import {
  Program,
  Post,
  Event,
  Gallery,
  Volunteer,
  Partner,
  Donation,
  Newsletter,
  Contact
} from "./models.js";


const router =
  express.Router();


const clean = (
  value,
  max = 5000
) =>

  typeof value === "string"
    ? value.trim().slice(0, max)
    : value;


const emailOK = email =>

  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);


/* HEALTH */

router.get(
  "/health",
  (_req, res) => {

    res.json({
      ok: true,
      service: "REHEMA API"
    });

  }
);


/* PROGRAMS */

router.get(
  "/programs",
  async (_req, res, next) => {

    try {

      const programs =
        await Program.find({
          active: true
        })
        .sort({
          createdAt: -1
        });


      res.json(programs);

    }

    catch (error) {

      next(error);

    }

  }
);


/* POSTS */

router.get(
  "/posts",
  async (req, res, next) => {

    try {

      const limit =
        Math.min(
          Number(req.query.limit) || 12,
          50
        );


      const posts =
        await Post.find({
          published: true
        })
        .sort({
          publishedAt: -1
        })
        .limit(limit);


      res.json(posts);

    }

    catch (error) {

      next(error);

    }

  }
);


router.get(
  "/posts/:slug",
  async (req, res, next) => {

    try {

      const post =
        await Post.findOne({
          slug: req.params.slug,
          published: true
        });


      if (!post) {

        return res
          .status(404)
          .json({
            message:
              "Post not found"
          });

      }


      res.json(post);

    }

    catch (error) {

      next(error);

    }

  }
);


/* EVENTS */

router.get(
  "/events",
  async (_req, res, next) => {

    try {

      const events =
        await Event.find({
          active: true
        })
        .sort({
          date: 1
        });


      res.json(events);

    }

    catch (error) {

      next(error);

    }

  }
);


/* GALLERY */

router.get(
  "/gallery",
  async (_req, res, next) => {

    try {

      const gallery =
        await Gallery.find()
        .sort({
          date: -1,
          createdAt: -1
        });


      res.json(gallery);

    }

    catch (error) {

      next(error);

    }

  }
);


/* VOLUNTEER */

router.post(
  "/volunteers",
  async (req, res, next) => {

    try {

      const {
        name,
        email,
        phone,
        skills,
        message
      } = req.body;


      if (
        !name ||
        !emailOK(email)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Valid name and email are required."
          });

      }


      const item =
        await Volunteer.create({

          name:
            clean(name, 120),

          email:
            clean(email, 180),

          phone:
            clean(phone, 40),

          skills:
            clean(skills, 1000),

          message:
            clean(message, 2000)

        });


      res.status(201).json({

        message:
          "Thank you. Your volunteer application was received.",

        id:
          item._id

      });

    }

    catch (error) {

      next(error);

    }

  }
);


/* PARTNER */

router.post(
  "/partners",
  async (req, res, next) => {

    try {

      const {
        organization,
        contactName,
        email,
        phone,
        message
      } = req.body;


      if (
        !organization ||
        !emailOK(email)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Organization and valid email are required."
          });

      }


      const item =
        await Partner.create({

          organization:
            clean(
              organization,
              180
            ),

          contactName:
            clean(
              contactName,
              120
            ),

          email:
            clean(email, 180),

          phone:
            clean(phone, 40),

          message:
            clean(message, 3000)

        });


      res.status(201).json({

        message:
          "Thank you. We will contact you about partnership.",

        id:
          item._id

      });

    }

    catch (error) {

      next(error);

    }

  }
);


/* DONATION */

router.post(
  "/donations",
  async (req, res, next) => {

    try {

      const {
        donorName,
        email,
        phone,
        amount,
        method,
        reference,
        message
      } = req.body;


      const numericAmount =
        Number(amount);


      if (
        !numericAmount ||
        numericAmount < 1 ||
        ![
          "mobile_money",
          "bank"
        ].includes(method)
      ) {

        return res
          .status(400)
          .json({
            message:
              "Enter a valid amount and payment method."
          });

      }


      const item =
        await Donation.create({

          donorName:
            clean(donorName, 120),

          email:
            clean(email, 180),

          phone:
            clean(phone, 40),

          amount:
            numericAmount,

          method,

          reference:
            clean(reference, 120),

          message:
            clean(message, 2000)

        });


      res.status(201).json({

        message:
          "Donation request recorded. Complete the payment using the instructions provided by REHEMA.",

        id:
          item._id

      });

    }

    catch (error) {

      next(error);

    }

  }
);


/* NEWSLETTER */

router.post(
  "/newsletter",
  async (req, res, next) => {

    try {

      const email =
        clean(
          req.body.email,
          180
        );


      if (!emailOK(email)) {

        return res
          .status(400)
          .json({
            message:
              "Enter a valid email."
          });

      }


      await Newsletter.updateOne(

        { email },

        {
          $set: {
            email
          }
        },

        {
          upsert: true
        }

      );


      res.status(201).json({

        message:
          "You have been subscribed to REHEMA updates."

      });

    }

    catch (error) {

      next(error);

    }

  }
);


/* CONTACT */

router.post(
  "/contact",
  async (req, res, next) => {

    try {

      const {
        name,
        email,
        phone,
        subject,
        message
      } = req.body;


      if (
        !name ||
        !emailOK(email) ||
        !message
      ) {

        return res
          .status(400)
          .json({
            message:
              "Name, valid email and message are required."
          });

      }


      const item =
        await Contact.create({

          name:
            clean(name, 120),

          email:
            clean(email, 180),

          phone:
            clean(phone, 40),

          subject:
            clean(subject, 180),

          message:
            clean(message, 4000)

        });


      res.status(201).json({

        message:
          "Your message has been received.",

        id:
          item._id

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;