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
  Notification,
} from "./models.js";
import { requireAdmin } from "./authMiddleware.js";

const router = express.Router();

// Keep public submissions open and require an administrator for management APIs.
router.use((req, res, next) => {
  const publicWrites = new Set([
    "POST /donations", "POST /volunteers", "POST /contact",
    "POST /messages", "POST /newsletter/subscribe",
  ]);
  const privateReads = new Set([
    "/donations", "/volunteers", "/messages", "/newsletter/subscribers", "/notifications",
  ]);
  if (req.method === "GET" && !privateReads.has(req.path) && !req.path.startsWith("/donations/")) return next();
  if (publicWrites.has(`${req.method} ${req.path}`)) return next();
  return requireAdmin(req, res, next);
});

/* =========================================================
   NOTIFICATION HELPER
========================================================= */

const createNotification = async ({
  title,
  message,
  type,
  link,
}) => {
  try {
    await Notification.create({
      title,
      message,
      type,
      link,
      read: false,
    });
  } catch (error) {
    console.error(
      "Notification creation error:",
      error
    );
  }
};

/* =========================================================
   POSTS / NEWS
========================================================= */

/* GET ALL POSTS */

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    console.error(
      "Posts GET error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
});

/* =========================================================
   GET SINGLE POST BY MONGODB ID
   USED BY ADMIN EDIT FORM
========================================================= */

router.get("/posts/id/:id", async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(
      "Single post by ID GET error:",
      error
    );

    res.status(400).json({
      message: "Invalid post ID",
    });
  }
});

/* =========================================================
   GET SINGLE POST BY SLUG
   USED BY PUBLIC WEBSITE
========================================================= */

router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(
      "Single post GET error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch post",
    });
  }
});

/* CREATE POST */

router.post("/posts", async (req, res) => {
  try {
    const post = await Post.create(
      req.body
    );

    await createNotification({
      title: "New news story",
      message: `A new news story "${post.title}" was created.`,
      type: "post",
      link: "/admin/posts",
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(
      "Post creation error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
});

/* UPDATE POST */

router.put("/posts/:id", async (req, res) => {
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
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(
      "Post update error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
});

/* DELETE POST */

router.delete("/posts/:id", async (req, res) => {
  try {
    const post =
      await Post.findByIdAndDelete(
        req.params.id
      );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      message:
        "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      "Post deletion error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete post",
    });
  }
});

/* =========================================================
   PROGRAMS
========================================================= */

/* GET PROGRAMS */

router.get("/programs", async (req, res) => {
  try {
    const programs =
      await Program.find().sort({
        createdAt: -1,
      });

    res.json(programs);
  } catch (error) {
    console.error(
      "Programs GET error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch programs",
    });
  }
});

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
      console.error(
        "Single program GET error:",
        error
      );

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

      await createNotification({
        title: "New program created",
        message: `The program "${program.title}" was added.`,
        type: "program",
        link: "/admin/programs",
      });

      res.status(201).json(
        program
      );
    } catch (error) {
      console.error(
        "Program creation error:",
        error
      );

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
      console.error(
        "Program update error:",
        error
      );

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
      console.error(
        "Program deletion error:",
        error
      );

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
        await Event.find().sort({
          date: 1,
        });

      res.json(events);
    } catch (error) {
      console.error(
        "Events GET error:",
        error
      );

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
      console.error(
        "Single event GET error:",
        error
      );

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

      await createNotification({
        title: "New event created",
        message: `The event "${event.title}" was added.`,
        type: "event",
        link: "/admin/events",
      });

      res.status(201).json(
        event
      );
    } catch (error) {
      console.error(
        "Event creation error:",
        error
      );

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
      console.error(
        "Event update error:",
        error
      );

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
      console.error(
        "Event deletion error:",
        error
      );

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
        await Gallery.find().sort({
          date: -1,
          createdAt: -1,
        });

      res.json(gallery);
    } catch (error) {
      console.error(
        "Gallery GET error:",
        error
      );

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
      console.error(
        "Single gallery GET error:",
        error
      );

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

      await createNotification({
        title: "New gallery item",
        message: `A new gallery ${item.type || "item"} was added.`,
        type: "gallery",
        link: "/admin/gallery",
      });

      res.status(201).json(item);
    } catch (error) {
      console.error(
        "Gallery creation error:",
        error
      );

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
      console.error(
        "Gallery update error:",
        error
      );

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
      console.error(
        "Gallery deletion error:",
        error
      );

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
        await Volunteer.find().sort({
          createdAt: -1,
        });

      res.json(volunteers);
    } catch (error) {
      console.error(
        "Volunteers GET error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch volunteers",
      });
    }
  }
);

/* CREATE VOLUNTEER */

router.post(
  "/volunteers",
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.create(
          req.body
        );

      await createNotification({
        title: "New volunteer application",
        message: `${volunteer.name} submitted a volunteer application.`,
        type: "volunteer",
        link: "/admin/volunteers",
      });

      res.status(201).json(
        volunteer
      );
    } catch (error) {
      console.error(
        "Volunteer creation error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });
    }
  }
);

/* UPDATE VOLUNTEER */

router.put(
  "/volunteers/:id",
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          message:
            "Volunteer not found",
        });
      }

      res.json(volunteer);
    } catch (error) {
      console.error(
        "Volunteer update error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });
    }
  }
);

/* =========================================================
   UPDATE VOLUNTEER STATUS
========================================================= */

router.patch(
  "/volunteers/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message:
            "Volunteer status is required.",
        });
      }

      const allowedStatuses = [
        "new",
        "contacted",
        "approved",
        "rejected",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid volunteer status.",
          allowedStatuses,
        });
      }

      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          message:
            "Volunteer not found",
        });
      }

      res.json(volunteer);

    } catch (error) {
      console.error(
        "Volunteer status update error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
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
      console.error(
        "Volunteer deletion error:",
        error
      );

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
        await Partner.find().sort({
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
      console.error(
        "Single partner GET error:",
        error
      );

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

      await createNotification({
        title: "New partner",
        message: `${partner.organization} was added as a partner.`,
        type: "partner",
        link: "/admin/partners",
      });

      res.status(201).json(
        partner
      );
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
   MESSAGES / CONTACT
========================================================= */

/* GET ALL MESSAGES */

router.get(
  "/messages",
  async (req, res) => {
    try {
      const messages =
        await Contact.find().sort({
          createdAt: -1,
        });

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
              status: isRead
                ? "read"
                : item.status || "new",
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
      console.error(
        "Single message GET error:",
        error
      );

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

router.post(
  "/contact",
  async (req, res) => {
    try {
      const contact =
        await Contact.create({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          message: req.body.message,
          status: "new",
          read: false,
        });

      await createNotification({
        title: "New contact message",
        message: `${contact.name} sent a new message.`,
        type: "message",
        link: "/admin/messages",
      });

      res.status(201).json({
        success: true,
        message:
          "Your message has been sent successfully.",
        contact,
      });
    } catch (error) {
      console.error(
        "Contact creation error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });
    }
  }
);

/* =========================================================
   LEGACY PUBLIC MESSAGES ENDPOINT
========================================================= */

router.post(
  "/messages",
  async (req, res) => {
    try {
      const message =
        await Contact.create({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          subject: req.body.subject,
          message: req.body.message,
          status: "new",
          read: false,
        });

      await createNotification({
        title: "New contact message",
        message: `${message.name} sent a new message.`,
        type: "message",
        link: "/admin/messages",
      });

      res.status(201).json(
        message
      );
    } catch (error) {
      console.error(
        "Contact message creation error:",
        error
      );

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

      await createNotification({
        title: "New newsletter subscriber",
        message: `${email} subscribed to the newsletter.`,
        type: "newsletter",
        link: "/admin/newsletter",
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

      if (error.code === 11000) {
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
        await Newsletter.find().sort({
          createdAt: -1,
        });

      res.json(subscribers);
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

      res.json(subscriber);
    } catch (error) {
      console.error(
        "Single subscriber GET error:",
        error
      );

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
        await Donation.find().sort({
          createdAt: -1,
        });

      res.json(donations);
    } catch (error) {
      console.error(
        "Donations GET error:",
        error
      );

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

          status: "pending",
        });

      await createNotification({
        title: "New donation received",
        message: `A donation of ${donation.amount} was submitted.`,
        type: "donation",
        link: "/admin/donations",
      });

      res.status(201).json(
        donation
      );
    } catch (error) {
      console.error(
        "Donation creation error:",
        error
      );

      res.status(400).json({
        message:
          error.message,
      });
    }
  }
);

/* GET SINGLE DONATION */

router.get("/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    return res.json(donation);
  } catch (error) {
    return res.status(400).json({ message: "Invalid donation ID" });
  }
});

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

      res.json(donation);
    } catch (error) {
      console.error(
        "Donation status update error:",
        error
      );

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
      console.error(
        "Donation deletion error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete donation",
      });
    }
  }
);

/* =========================================================
   NOTIFICATIONS
========================================================= */

/* GET NOTIFICATIONS */

router.get(
  "/notifications",
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .sort({
            createdAt: -1,
          })
          .limit(50);

      res.json(notifications);
    } catch (error) {
      console.error(
        "Notifications GET error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch notifications",
      });
    }
  }
);

/* MARK ONE NOTIFICATION AS READ */

router.patch(
  "/notifications/:id/read",
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      res.json(notification);
    } catch (error) {
      console.error(
        "Notification read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark notification as read",
      });
    }
  }
);

/* MARK ALL NOTIFICATIONS AS READ */

router.patch(
  "/notifications/read-all",
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read.",
      });
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark all notifications as read",
      });
    }
  }
);

/* DELETE ALL READ NOTIFICATIONS */

router.delete(
  "/notifications/read",
  async (req, res) => {
    try {
      await Notification.deleteMany({
        read: true,
      });

      res.json({
        success: true,
        message:
          "Read notifications deleted.",
      });
    } catch (error) {
      console.error(
        "Delete notifications error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete read notifications",
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
   EXPORT ROUTER
========================================================= */

export default router;
