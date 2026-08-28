import mongoose from "mongoose";

// ===============================
// PROGRAM
// ===============================
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

// ===============================
// POST / BLOG
// ===============================
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
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// EVENT
// ===============================
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

// ===============================
// GALLERY
// ===============================
const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
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

// ===============================
// VOLUNTEER
// ===============================
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
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);


// ===============================
// PARTNER
// ===============================
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

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);


// ===============================
// DONATION
// ===============================
const donationSchema = new mongoose.Schema(
  {
    donorName: {
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
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "UGX",
      uppercase: true,
      trim: true,
    },

    method: {
      type: String,
      enum: [
        "card",
        "mobile_money",
        "bank",
      ],
      required: true,
    },

    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    transactionId: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "successful",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// NEWSLETTER
// ===============================
const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// CONTACT
// ===============================
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

    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// ===============================
// MODELS
// ===============================

export const Program = mongoose.model("Program", programSchema);

export const Post = mongoose.model("Post", postSchema);

export const Event = mongoose.model("Event", eventSchema);

export const Gallery = mongoose.model("Gallery", gallerySchema);

export const Volunteer = mongoose.model(
  "Volunteer",
  volunteerSchema
);

export const Partner = mongoose.model(
  "Partner",
  partnerSchema
);

export const Donation = mongoose.model(
  "Donation",
  donationSchema
);

export const Newsletter = mongoose.model(
  "Newsletter",
  newsletterSchema
);

export const Contact = mongoose.model(
  "Contact",
  contactSchema
);