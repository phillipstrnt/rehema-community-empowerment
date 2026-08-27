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


const router = express.Router();


/* =========================================================
   POSTS / NEWS
========================================================= */

// GET all posts
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


// GET single post by slug
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


// CREATE post
router.post("/posts", async (req, res) => {

  try {

    const post = await Post.create(req.body);

    res.status(201).json(post);

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: error.message
    });

  }

});


// UPDATE post
router.put("/posts/:id", async (req, res) => {

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

});


// DELETE post
router.delete("/posts/:id", async (req, res) => {

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

});


/* =========================================================
   PROGRAMS
========================================================= */

// GET programs
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


// GET single program
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


// CREATE program
router.post("/programs", async (req, res) => {

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

});


// UPDATE program
router.put("/programs/:id", async (req, res) => {

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

});


// DELETE program
router.delete("/programs/:id", async (req, res) => {

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

});


/* =========================================================
   EVENTS
========================================================= */

// GET events
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


// GET single event
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


// CREATE event
router.post("/events", async (req, res) => {

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

});


// UPDATE event
router.put("/events/:id", async (req, res) => {

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

});


// DELETE event
router.delete("/events/:id", async (req, res) => {

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

});


/* =========================================================
   GALLERY
========================================================= */

// GET gallery
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


// GET single gallery item
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


// CREATE gallery item
router.post("/gallery", async (req, res) => {

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

});


// UPDATE gallery item
router.put("/gallery/:id", async (req, res) => {

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

});


// DELETE gallery item
router.delete("/gallery/:id", async (req, res) => {

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

});


/* =========================================================
   DONATIONS
========================================================= */

// GET donations
router.get("/donations", async (req, res) => {

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

});


// CREATE donation
router.post("/donations", async (req, res) => {

  try {

    const donation = await Donation.create({
      donorName: req.body.donorName,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
      method: req.body.method,
      reference: req.body.reference,
      message: req.body.message,
      status: "pending"
    });

    res.status(201).json(donation);

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: error.message
    });

  }

});


// UPDATE donation status
router.patch(
  "/donations/:id/status",
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


// DELETE donation
router.delete("/donations/:id", async (req, res) => {

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

});


/* =========================================================
   HEALTH CHECK
========================================================= */

router.get("/health", (req, res) => {

  res.json({
    success: true,
    message: "REHEMA API is working"
  });

});


export default router;