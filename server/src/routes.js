
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
  Contact,
} from "./models.js";


const router =
  express.Router();


/* =========================================================
   POSTS / NEWS
========================================================= */


/* GET ALL POSTS */

router.get(
  "/posts",
  async (req, res) => {

    try {

      const posts =
        await Post.find()
          .sort({
            publishedAt: -1,
            createdAt: -1,
          });


      res.json(posts);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch posts",
      });

    }

  }
);


/* GET SINGLE POST */

router.get(
  "/posts/:slug",
  async (req, res) => {

    try {

      const post =
        await Post.findOne({
          slug: req.params.slug,
        });


      if (!post) {

        return res.status(404).json({
          message:
            "Post not found",
        });

      }


      res.json(post);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch post",
      });

    }

  }
);


/* CREATE POST */

router.post(
  "/posts",
  async (req, res) => {

    try {

      const post =
        await Post.create(
          req.body
        );


      res.status(201).json(post);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE POST */

router.put(
  "/posts/:id",
  async (req, res) => {

    try {

      const post =
        await Post.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );


      if (!post) {

        return res.status(404).json({
          message:
            "Post not found",
        });

      }


      res.json(post);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE POST */

router.delete(
  "/posts/:id",
  async (req, res) => {

    try {

      const post =
        await Post.findByIdAndDelete(
          req.params.id
        );


      if (!post) {

        return res.status(404).json({
          message:
            "Post not found",
        });

      }


      res.json({
        message:
          "Post deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete post",
      });

    }

  }
);


/* =========================================================
   PROGRAMS
========================================================= */


/* GET PROGRAMS */

router.get(
  "/programs",
  async (req, res) => {

    try {

      const programs =
        await Program.find()
          .sort({
            createdAt: -1,
          });


      res.json(programs);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch programs",
      });

    }

  }
);


/* GET SINGLE PROGRAM */

router.get(
  "/programs/:id",
  async (req, res) => {

    try {

      const program =
        await Program.findById(
          req.params.id
        );


      if (!program) {

        return res.status(404).json({
          message:
            "Program not found",
        });

      }


      res.json(program);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch program",
      });

    }

  }
);


/* CREATE PROGRAM */

router.post(
  "/programs",
  async (req, res) => {

    try {

      const program =
        await Program.create(
          req.body
        );


      res.status(201).json(program);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE PROGRAM */

router.put(
  "/programs/:id",
  async (req, res) => {

    try {

      const program =
        await Program.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );


      if (!program) {

        return res.status(404).json({
          message:
            "Program not found",
        });

      }


      res.json(program);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE PROGRAM */

router.delete(
  "/programs/:id",
  async (req, res) => {

    try {

      const program =
        await Program.findByIdAndDelete(
          req.params.id
        );


      if (!program) {

        return res.status(404).json({
          message:
            "Program not found",
        });

      }


      res.json({
        message:
          "Program deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete program",
      });

    }

  }
);


/* =========================================================
   EVENTS
========================================================= */


/* GET EVENTS */

router.get(
  "/events",
  async (req, res) => {

    try {

      const events =
        await Event.find()
          .sort({
            date: 1,
          });


      res.json(events);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch events",
      });

    }

  }
);


/* GET SINGLE EVENT */

router.get(
  "/events/:id",
  async (req, res) => {

    try {

      const event =
        await Event.findById(
          req.params.id
        );


      if (!event) {

        return res.status(404).json({
          message:
            "Event not found",
        });

      }


      res.json(event);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch event",
      });

    }

  }
);


/* CREATE EVENT */

router.post(
  "/events",
  async (req, res) => {

    try {

      const event =
        await Event.create(
          req.body
        );


      res.status(201).json(event);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE EVENT */

router.put(
  "/events/:id",
  async (req, res) => {

    try {

      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );


      if (!event) {

        return res.status(404).json({
          message:
            "Event not found",
        });

      }


      res.json(event);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE EVENT */

router.delete(
  "/events/:id",
  async (req, res) => {

    try {

      const event =
        await Event.findByIdAndDelete(
          req.params.id
        );


      if (!event) {

        return res.status(404).json({
          message:
            "Event not found",
        });

      }


      res.json({
        message:
          "Event deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete event",
      });

    }

  }
);


/* =========================================================
   GALLERY
========================================================= */


/* GET GALLERY */

router.get(
  "/gallery",
  async (req, res) => {

    try {

      const gallery =
        await Gallery.find()
          .sort({
            date: -1,
            createdAt: -1,
          });


      res.json(gallery);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch gallery",
      });

    }

  }
);


/* GET SINGLE GALLERY ITEM */

router.get(
  "/gallery/:id",
  async (req, res) => {

    try {

      const item =
        await Gallery.findById(
          req.params.id
        );


      if (!item) {

        return res.status(404).json({
          message:
            "Gallery item not found",
        });

      }


      res.json(item);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch gallery item",
      });

    }

  }
);


/* CREATE GALLERY ITEM */

router.post(
  "/gallery",
  async (req, res) => {

    try {

      const item =
        await Gallery.create(
          req.body
        );


      res.status(201).json(item);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE GALLERY ITEM */

router.put(
  "/gallery/:id",
  async (req, res) => {

    try {

      const item =
        await Gallery.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );


      if (!item) {

        return res.status(404).json({
          message:
            "Gallery item not found",
        });

      }


      res.json(item);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE GALLERY ITEM */

router.delete(
  "/gallery/:id",
  async (req, res) => {

    try {

      const item =
        await Gallery.findByIdAndDelete(
          req.params.id
        );


      if (!item) {

        return res.status(404).json({
          message:
            "Gallery item not found",
        });

      }


      res.json({
        message:
          "Gallery item deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete gallery item",
      });

    }

  }
);


/* =========================================================
   VOLUNTEERS
========================================================= */


/* GET VOLUNTEERS */

router.get(
  "/volunteers",
  async (req, res) => {

    try {

      const volunteers =
        await Volunteer.find()
          .sort({
            createdAt: -1,
          });


      res.json(volunteers);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch volunteers",
      });

    }

  }
);


/* DELETE VOLUNTEER */

router.delete(
  "/volunteers/:id",
  async (req, res) => {

    try {

      const volunteer =
        await Volunteer.findByIdAndDelete(
          req.params.id
        );


      if (!volunteer) {

        return res.status(404).json({
          message:
            "Volunteer not found",
        });

      }


      res.json({
        message:
          "Volunteer deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete volunteer",
      });

    }

  }
);


/* =========================================================
   PARTNERS
========================================================= */


/* GET PARTNERS */

router.get(
  "/partners",
  async (req, res) => {

    try {

      const partners =
        await Partner.find()
          .sort({
            createdAt: -1,
          });


      res.json(partners);

    } catch (error) {

      console.error(
        "Partners GET error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch partners",
      });

    }

  }
);


/* GET SINGLE PARTNER */

router.get(
  "/partners/:id",
  async (req, res) => {

    try {

      const partner =
        await Partner.findById(
          req.params.id
        );


      if (!partner) {

        return res.status(404).json({
          message:
            "Partner not found",
        });

      }


      res.json(partner);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch partner",
      });

    }

  }
);


/* CREATE PARTNER */

router.post(
  "/partners",
  async (req, res) => {

    try {

      const partner =
        await Partner.create(
          req.body
        );


      res.status(201).json(partner);

    } catch (error) {

      console.error(
        "Partner creation error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE PARTNER */

router.put(
  "/partners/:id",
  async (req, res) => {

    try {

      const partner =
        await Partner.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );


      if (!partner) {

        return res.status(404).json({
          message:
            "Partner not found",
        });

      }


      res.json(partner);

    } catch (error) {

      console.error(
        "Partner update error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE PARTNER */

router.delete(
  "/partners/:id",
  async (req, res) => {

    try {

      const partner =
        await Partner.findByIdAndDelete(
          req.params.id
        );


      if (!partner) {

        return res.status(404).json({
          message:
            "Partner not found",
        });

      }


      res.json({
        message:
          "Partner deleted successfully",
      });

    } catch (error) {

      console.error(
        "Partner deletion error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete partner",
      });

    }

  }
);


/* =========================================================
   MESSAGES / CONTACT ENQUIRIES
========================================================= */


/* GET ALL MESSAGES */

router.get(
  "/messages",
  async (req, res) => {

    try {

      const messages =
        await Contact.find()
          .sort({
            createdAt: -1,
          });


      /*
        Normalize the contact documents so
        the frontend can consistently use
        read/status.
      */

      const normalized =
        messages.map(
          (message) => {

            const item =
              message.toObject();


            const isRead =
              item.read === true ||
              item.status === "read";


            return {
              ...item,
              read: isRead,
              status:
                isRead
                  ? "read"
                  : item.status ||
                    "new",
            };

          }
        );


      res.json(normalized);

    } catch (error) {

      console.error(
        "Messages GET error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch messages",
      });

    }

  }
);


/* GET SINGLE MESSAGE */

router.get(
  "/messages/:id",
  async (req, res) => {

    try {

      const message =
        await Contact.findById(
          req.params.id
        );


      if (!message) {

        return res.status(404).json({
          message:
            "Message not found",
        });

      }


      res.json(message);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch message",
      });

    }

  }
);


/* MARK MESSAGE AS READ */

router.patch(
  "/messages/:id/read",
  async (req, res) => {

    try {

      const message =
        await Contact.findByIdAndUpdate(
          req.params.id,
          {
            read: true,
            status: "read",
          },
          {
            new: true,
          }
        );


      if (!message) {

        return res.status(404).json({
          message:
            "Message not found",
        });

      }


      res.json(message);

    } catch (error) {

      console.error(
        "Mark message read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark message as read",
      });

    }

  }
);


/* DELETE MESSAGE */

router.delete(
  "/messages/:id",
  async (req, res) => {

    try {

      const message =
        await Contact.findByIdAndDelete(
          req.params.id
        );


      if (!message) {

        return res.status(404).json({
          message:
            "Message not found",
        });

      }


      res.json({
        message:
          "Message deleted successfully",
      });

    } catch (error) {

      console.error(
        "Delete message error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete message",
      });

    }

  }
);


/* =========================================================
   PUBLIC CONTACT FORM
========================================================= */


/* CREATE CONTACT MESSAGE */

router.post(
  "/messages",
  async (req, res) => {

    try {

      const message =
        await Contact.create({
          name:
            req.body.name,
          email:
            req.body.email,
          phone:
            req.body.phone,
          subject:
            req.body.subject,
          message:
            req.body.message,
          status:
            "new",
        });


      res.status(201).json(
        message
      );

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* =========================================================
   NEWSLETTER
========================================================= */


/* PUBLIC NEWSLETTER SUBSCRIPTION */

router.post(
  "/newsletter/subscribe",
  async (req, res) => {

    try {

      const email =
        req.body.email
          ?.trim()
          .toLowerCase();


      if (!email) {

        return res.status(400).json({
          message:
            "Email address is required.",
        });

      }


      const existing =
        await Newsletter.findOne({
          email,
        });


      if (existing) {

        return res.status(409).json({
          message:
            "This email is already subscribed.",
        });

      }


      const subscriber =
        await Newsletter.create({
          email,
        });


      res.status(201).json({
        success: true,
        message:
          "Successfully subscribed to the newsletter.",
        subscriber,
      });

    } catch (error) {

      console.error(
        "Newsletter subscription error:",
        error
      );


      /*
        MongoDB duplicate-key protection
      */

      if (
        error.code === 11000
      ) {

        return res.status(409).json({
          message:
            "This email is already subscribed.",
        });

      }


      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* GET NEWSLETTER SUBSCRIBERS */

router.get(
  "/newsletter/subscribers",
  async (req, res) => {

    try {

      const subscribers =
        await Newsletter.find()
          .sort({
            createdAt: -1,
          });


      res.json(
        subscribers
      );

    } catch (error) {

      console.error(
        "Newsletter subscribers GET error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch newsletter subscribers",
      });

    }

  }
);


/* GET SINGLE SUBSCRIBER */

router.get(
  "/newsletter/subscribers/:id",
  async (req, res) => {

    try {

      const subscriber =
        await Newsletter.findById(
          req.params.id
        );


      if (!subscriber) {

        return res.status(404).json({
          message:
            "Subscriber not found",
        });

      }


      res.json(
        subscriber
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch subscriber",
      });

    }

  }
);


/* DELETE SUBSCRIBER */

router.delete(
  "/newsletter/subscribers/:id",
  async (req, res) => {

    try {

      const subscriber =
        await Newsletter.findByIdAndDelete(
          req.params.id
        );


      if (!subscriber) {

        return res.status(404).json({
          message:
            "Subscriber not found",
        });

      }


      res.json({
        message:
          "Subscriber removed successfully",
      });

    } catch (error) {

      console.error(
        "Delete subscriber error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete subscriber",
      });

    }

  }
);


/* =========================================================
   DONATIONS
========================================================= */


/* GET DONATIONS */

router.get(
  "/donations",
  async (req, res) => {

    try {

      const donations =
        await Donation.find()
          .sort({
            createdAt: -1,
          });


      res.json(donations);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch donations",
      });

    }

  }
);


/* CREATE DONATION */

router.post(
  "/donations",
  async (req, res) => {

    try {

      const donation =
        await Donation.create({
          donorName:
            req.body.donorName,
          email:
            req.body.email,
          phone:
            req.body.phone,
          amount:
            req.body.amount,
          method:
            req.body.method,
          reference:
            req.body.reference,
          message:
            req.body.message,
          status:
            "pending",
        });


      res.status(201).json(
        donation
      );

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* UPDATE DONATION STATUS */

router.patch(
  "/donations/:id/status",
  async (req, res) => {

    try {

      const donation =
        await Donation.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
            runValidators: true,
          }
        );


      if (!donation) {

        return res.status(404).json({
          message:
            "Donation not found",
        });

      }


      res.json(
        donation
      );

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          error.message,
      });

    }

  }
);


/* DELETE DONATION */

router.delete(
  "/donations/:id",
  async (req, res) => {

    try {

      const donation =
        await Donation.findByIdAndDelete(
          req.params.id
        );


      if (!donation) {

        return res.status(404).json({
          message:
            "Donation not found",
        });

      }


      res.json({
        message:
          "Donation deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete donation",
      });

    }

  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

router.get(
  "/health",
  (req, res) => {

    res.json({
      success: true,
      message:
        "REHEMA API is working",
    });

  }
);


/* =========================================================
   EXPORT
========================================================= */

export default router;