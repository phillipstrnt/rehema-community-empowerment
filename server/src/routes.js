
import express from "express";

import {
  createNotification
} from "./notificationHelper.js";

import {
  requireAdmin
} from "./authMiddleware.js";

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
  Notification
} from "./models.js";


const router = express.Router();


/* =========================================================
   POSTS / NEWS
========================================================= */

// PUBLIC: GET all posts
router.get("/posts", async (req, res) => {

  try {

    const posts = await Post
      .find()
      .sort({ publishedAt: -1, createdAt: -1 });

    res.json(posts);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts"
    });

  }

});


// PUBLIC: GET single post by slug
router.get("/posts/:slug", async (req, res) => {

  try {

    const post = await Post.findOne({
      slug: req.params.slug
    });

    if (!post) {

      return res.status(404).json({
        message: "Post not found"
      });

    }

    res.json(post);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch post"
    });

  }

});


// 🔒 ADMIN: CREATE post
router.post(
  "/posts",
  requireAdmin,
  async (req, res) => {
    try {
      const post = await Post.create(req.body);

      res.status(201).json(post);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE post
router.put(
  "/posts/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      res.json(post);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE post
router.delete(
  "/posts/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(
        req.params.id
      );

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      res.json({
        message: "Post deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete post"
      });
    }
  }
);


/* =========================================================
   PROGRAMS
========================================================= */

// PUBLIC: GET programs
router.get("/programs", async (req, res) => {

  try {

    const programs = await Program.find()
      .sort({ createdAt: -1 });

    res.json(programs);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch programs"
    });

  }

});


// PUBLIC: GET single program
router.get("/programs/:id", async (req, res) => {

  try {

    const program = await Program.findById(
      req.params.id
    );

    if (!program) {

      return res.status(404).json({
        message: "Program not found"
      });

    }

    res.json(program);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch program"
    });

  }

});


// 🔒 ADMIN: CREATE program
router.post(
  "/programs",
  requireAdmin,
  async (req, res) => {
    try {
      const program = await Program.create(
        req.body
      );

      res.status(201).json(program);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE program
router.put(
  "/programs/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const program =
        await Program.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!program) {
        return res.status(404).json({
          message: "Program not found"
        });
      }

      res.json(program);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE program
router.delete(
  "/programs/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const program =
        await Program.findByIdAndDelete(
          req.params.id
        );

      if (!program) {
        return res.status(404).json({
          message: "Program not found"
        });
      }

      res.json({
        message: "Program deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete program"
      });
    }
  }
);


/* =========================================================
   EVENTS
========================================================= */

// PUBLIC: GET events
router.get("/events", async (req, res) => {

  try {

    const events = await Event.find()
      .sort({ date: 1 });

    res.json(events);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch events"
    });

  }

});


// PUBLIC: GET single event
router.get("/events/:id", async (req, res) => {

  try {

    const event = await Event.findById(
      req.params.id
    );

    if (!event) {

      return res.status(404).json({
        message: "Event not found"
      });

    }

    res.json(event);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch event"
    });

  }

});


// 🔒 ADMIN: CREATE event
router.post(
  "/events",
  requireAdmin,
  async (req, res) => {
    try {
      const event = await Event.create(
        req.body
      );

      res.status(201).json(event);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE event
router.put(
  "/events/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!event) {
        return res.status(404).json({
          message: "Event not found"
        });
      }

      res.json(event);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE event
router.delete(
  "/events/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const event =
        await Event.findByIdAndDelete(
          req.params.id
        );

      if (!event) {
        return res.status(404).json({
          message: "Event not found"
        });
      }

      res.json({
        message: "Event deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete event"
      });
    }
  }
);


/* =========================================================
   GALLERY
========================================================= */

// PUBLIC: GET gallery
router.get("/gallery", async (req, res) => {

  try {

    const gallery = await Gallery.find()
      .sort({ date: -1, createdAt: -1 });

    res.json(gallery);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch gallery"
    });

  }

});


// PUBLIC: GET single gallery item
router.get("/gallery/:id", async (req, res) => {

  try {

    const item = await Gallery.findById(
      req.params.id
    );

    if (!item) {

      return res.status(404).json({
        message: "Gallery item not found"
      });

    }

    res.json(item);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch gallery item"
    });

  }

});


// 🔒 ADMIN: CREATE gallery item
router.post(
  "/gallery",
  requireAdmin,
  async (req, res) => {
    try {
      const item = await Gallery.create(
        req.body
      );

      res.status(201).json(item);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE gallery item
router.put(
  "/gallery/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const item =
        await Gallery.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!item) {
        return res.status(404).json({
          message: "Gallery item not found"
        });
      }

      res.json(item);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE gallery item
router.delete(
  "/gallery/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const item =
        await Gallery.findByIdAndDelete(
          req.params.id
        );

      if (!item) {
        return res.status(404).json({
          message: "Gallery item not found"
        });
      }

      res.json({
        message: "Gallery item deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete gallery item"
      });
    }
  }
);



/* =========================================================
   VOLUNTEERS
========================================================= */

// 🔒 ADMIN: GET volunteers
router.get(
  "/volunteers",
  requireAdmin,
  async (req, res) => {
    try {
      const volunteers = await Volunteer.find()
        .sort({ createdAt: -1 });

      res.json(volunteers);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch volunteers"
      });
    }
  }
);


// 🔒 ADMIN: GET single volunteer
router.get(
  "/volunteers/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findById(
          req.params.id
        );

      if (!volunteer) {
        return res.status(404).json({
          message: "Volunteer not found"
        });
      }

      res.json(volunteer);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch volunteer"
      });
    }
  }
);


// PUBLIC: CREATE volunteer application
router.post(
  "/volunteers",
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.create({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          skills: req.body.skills,
          message: req.body.message,
          status: "new"
        });

      await createNotification({
        type: "volunteer",
        title: "New volunteer application",
        message:
          `${volunteer.name} submitted a volunteer application.`,
        link: "/admin/volunteers"
      });

      res.status(201).json(volunteer);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE volunteer
router.put(
  "/volunteers/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            skills: req.body.skills,
            message: req.body.message,
            status: req.body.status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          message: "Volunteer not found"
        });
      }

      res.json(volunteer);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE volunteer status
router.patch(
  "/volunteers/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          message: "Volunteer not found"
        });
      }

      res.json(volunteer);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE volunteer
router.delete(
  "/volunteers/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndDelete(
          req.params.id
        );

      if (!volunteer) {
        return res.status(404).json({
          message: "Volunteer not found"
        });
      }

      res.json({
        message: "Volunteer deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete volunteer"
      });
    }
  }
);


/* =========================================================
   PARTNERS
========================================================= */

// 🔒 ADMIN: GET partners
router.get(
  "/partners",
  requireAdmin,
  async (req, res) => {
    try {
      const partners = await Partner.find()
        .sort({ createdAt: -1 });

      res.json(partners);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch partners"
      });
    }
  }
);


// 🔒 ADMIN: GET single partner
router.get(
  "/partners/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const partner =
        await Partner.findById(
          req.params.id
        );

      if (!partner) {
        return res.status(404).json({
          message: "Partner not found"
        });
      }

      res.json(partner);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch partner"
      });
    }
  }
);


// PUBLIC: CREATE partner application
router.post(
  "/partners",
  async (req, res) => {
    try {
      const partner =
        await Partner.create({
          organization: req.body.organization,
          type: req.body.type,
          contactName: req.body.contactName,
          email: req.body.email,
          phone: req.body.phone,
          website: req.body.website,
          description: req.body.description,
          logo: req.body.logo,
          status: "Active"
        });

      await createNotification({
        type: "partner",
        title: "New partner application",
        message:
          `${partner.organization} has submitted a partnership application.`,
        link: "/admin/partners"
      });

      res.status(201).json(partner);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE partner
router.put(
  "/partners/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const partner =
        await Partner.findByIdAndUpdate(
          req.params.id,
          {
            organization: req.body.organization,
            type: req.body.type,
            contactName: req.body.contactName,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,
            description: req.body.description,
            logo: req.body.logo,
            status: req.body.status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!partner) {
        return res.status(404).json({
          message: "Partner not found"
        });
      }

      res.json(partner);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE partner
router.delete(
  "/partners/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const partner =
        await Partner.findByIdAndDelete(
          req.params.id
        );

      if (!partner) {
        return res.status(404).json({
          message: "Partner not found"
        });
      }

      res.json({
        message: "Partner deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete partner"
      });
    }
  }
);


/* =========================================================
   DONATIONS
========================================================= */

// 🔒 ADMIN: GET donations
router.get(
  "/donations",
  requireAdmin,
  async (req, res) => {
    try {
      const donations = await Donation.find()
        .sort({ createdAt: -1 });

      res.json(donations);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch donations"
      });
    }
  }
);


// 🔒 ADMIN: GET single donation
router.get(
  "/donations/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const donation =
        await Donation.findById(
          req.params.id
        );

      if (!donation) {
        return res.status(404).json({
          message: "Donation not found"
        });
      }

      res.json(donation);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch donation"
      });
    }
  }
);


// PUBLIC: CREATE donation
router.post(
  "/donations",
  async (req, res) => {
    try {
      const donation =
        await Donation.create({
          donorName: req.body.donorName,
          email: req.body.email,
          phone: req.body.phone,
          amount: req.body.amount,
          method: req.body.method,
          reference: req.body.reference,
          message: req.body.message,
          status: "pending"
        });

      await createNotification({
        type: "donation",
        title: "New donation received",
        message:
          `A donation of UGX ${Number(
            donation.amount
          ).toLocaleString()} was submitted.`,
        link: "/admin/donations"
      });

      res.status(201).json(donation);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }

);






// 🔒 ADMIN: UPDATE donation status
router.patch(
  "/donations/:id/status",
  requireAdmin,
  async (req, res) => {

    try {

      const donation =
        await Donation.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!donation) {

        return res.status(404).json({
          message: "Donation not found"
        });

      }

      res.json(donation);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message: error.message
      });

    }

  }
);


// 🔒 ADMIN: DELETE donation
router.delete(
  "/donations/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const donation =
        await Donation.findByIdAndDelete(
          req.params.id
        );

      if (!donation) {
        return res.status(404).json({
          message: "Donation not found"
        });
      }

      res.json({
        message: "Donation deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete donation"
      });
    }
  }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

// 🔒 ADMIN: GET notifications
router.get(
  "/notifications",
  requireAdmin,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .sort({ createdAt: -1 })
          .limit(50);

      res.json(notifications);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch notifications"
      });
    }
  }
);


// 🔒 ADMIN: GET unread count
router.get(
  "/notifications/unread-count",
  requireAdmin,
  async (req, res) => {
    try {
      const count =
        await Notification.countDocuments({
          read: false
        });

      res.json({
        count
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch unread notification count"
      });
    }
  }
);


// 🔒 ADMIN: MARK notification as read
router.patch(
  "/notifications/:id/read",
  requireAdmin,
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true
          },
          {
            new: true
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json(notification);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message:
          "Failed to mark notification as read"
      });
    }
  }
);


// 🔒 ADMIN: MARK ALL notifications as read
router.patch(
  "/notifications/read-all",
  requireAdmin,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          read: false
        },
        {
          $set: {
            read: true
          }
        }
      );

      res.json({
        message:
          "All notifications marked as read"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to mark notifications as read"
      });
    }
  }
);


// 🔒 ADMIN: DELETE notification
router.delete(
  "/notifications/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndDelete(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found"
        });
      }

      res.json({
        message:
          "Notification deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete notification"
      });
    }
  }
);


/* =========================================================
   CONTACT MESSAGES
========================================================= */

// 🔒 ADMIN: GET messages
router.get(
  "/messages",
  requireAdmin,
  async (req, res) => {
    try {
      const messages = await Contact.find()
        .sort({ createdAt: -1 });

      res.json(messages);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch messages"
      });
    }
  }
);


// 🔒 ADMIN: GET single message
router.get(
  "/messages/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const message =
        await Contact.findById(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }

      res.json(message);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch message"
      });
    }
  }
);


// PUBLIC: CREATE contact message
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
          status: "new"
        });

      await createNotification({
        type: "message",
        title: "New contact message",
        message:
          `${message.name} sent a new message.`,
        link: "/admin/messages"
      });

      res.status(201).json(message);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: UPDATE message status
router.patch(
  "/messages/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const message =
        await Contact.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }

      res.json(message);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE message
router.delete(
  "/messages/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const message =
        await Contact.findByIdAndDelete(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }

      res.json({
        message:
          "Message deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete message"
      });
    }
  }
);


/* =========================================================
   NEWSLETTER
========================================================= */

// 🔒 ADMIN: GET subscribers
router.get(
  "/newsletter",
  requireAdmin,
  async (req, res) => {
    try {
      const subscribers =
        await Newsletter.find()
          .sort({ createdAt: -1 });

      res.json(subscribers);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch newsletter subscribers"
      });
    }
  }
);


// PUBLIC: CREATE subscriber
router.post(
  "/newsletter",
  async (req, res) => {
    try {
      const subscriber =
        await Newsletter.create({
          email: req.body.email
        });

      await createNotification({
        type: "newsletter",
        title: "New newsletter subscriber",
        message:
          `${subscriber.email} subscribed to the newsletter.`,
        link: "/admin/newsletter"
      });

      res.status(201).json(subscriber);
    } catch (error) {
      console.error(error);

      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "Email is already subscribed."
        });
      }

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// 🔒 ADMIN: DELETE subscriber
router.delete(
  "/newsletter/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const subscriber =
        await Newsletter.findByIdAndDelete(
          req.params.id
        );

      if (!subscriber) {
        return res.status(404).json({
          message:
            "Subscriber not found"
        });
      }

      res.json({
        message:
          "Subscriber deleted successfully"
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete subscriber"
      });
    }
  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

// PUBLIC: health check
router.get("/health", (req, res) => {

  res.json({
    success: true,
    message: "REHEMA API is working"
  });
  
});


export default router;