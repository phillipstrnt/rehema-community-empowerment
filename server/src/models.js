import mongoose from "mongoose";


/* =========================================================
   PROGRAM
========================================================= */

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   POST / NEWS
========================================================= */

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
      default: "REHEMA Foundation",
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    published: {
      type: Boolean,
      default: true,
    },

    facebook: {
      published: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "not_published",
          "published",
          "failed",
        ],
        default: "not_published",
      },

      postId: {
        type: String,
        trim: true,
        default: "",
      },

      publishedAt: {
        type: Date,
      },

      error: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   EVENT
========================================================= */

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
    },

    registrationUrl: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   GALLERY
========================================================= */

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "image",
        "video",
      ],
      default: "image",
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   VOLUNTEER
========================================================= */

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    skills: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,

      /*
       * These values MUST match the statuses
       * used by the Admin Volunteers page.
       */
      enum: [
        "new",
        "contacted",
        "approved",
        "rejected",
      ],

      default: "new",
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   PARTNER
========================================================= */

const partnerSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "NGO / Organization",
        "Corporate",
        "Government",
        "Community",
        "Other",
      ],
      default: "NGO / Organization",
    },

    contactName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "new",
      ],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   DONATION
========================================================= */

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    method: {
      type: String,
      enum: [
        "mobile_money",
        "bank",
        "flutterwave",
      ],
      required: true,
    },

    reference: {
      type: String,
      trim: true,
    },

    currency: { type: String, uppercase: true, default: "UGX" },

    gatewayTransactionId: { type: String, trim: true },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "unsubscribed",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   CONTACT / MESSAGES
========================================================= */

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "new",
        "read",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   NOTIFICATION
========================================================= */

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "message",
        "volunteer",
        "donation",
        "newsletter",
        "partner",
        "event",
        "program",
        "post",
        "gallery",
        "default",
      ],
      default: "default",
    },

    link: {
      type: String,
      trim: true,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   MONGOOSE MODELS
========================================================= */

export const Program =
  mongoose.models.Program ||
  mongoose.model(
    "Program",
    programSchema
  );


export const Post =
  mongoose.models.Post ||
  mongoose.model(
    "Post",
    postSchema
  );


export const Event =
  mongoose.models.Event ||
  mongoose.model(
    "Event",
    eventSchema
  );


export const Gallery =
  mongoose.models.Gallery ||
  mongoose.model(
    "Gallery",
    gallerySchema
  );


export const Volunteer =
  mongoose.models.Volunteer ||
  mongoose.model(
    "Volunteer",
    volunteerSchema
  );


export const Partner =
  mongoose.models.Partner ||
  mongoose.model(
    "Partner",
    partnerSchema
  );


export const Donation =
  mongoose.models.Donation ||
  mongoose.model(
    "Donation",
    donationSchema
  );


export const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model(
    "Newsletter",
    newsletterSchema
  );


export const Contact =
  mongoose.models.Contact ||
  mongoose.model(
    "Contact",
    contactSchema
  );


export const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );