import mongoose from "mongoose";


const programSchema =
  new mongoose.Schema(

    {
      title: {
        type: String,
        required: true,
        trim: true
      },

      slug: {
        type: String,
        required: true,
        unique: true
      },

      shortDescription:
        String,

      description:
        String,

      image:
        String,

      active: {
        type: Boolean,
        default: true
      }
    },

    {
      timestamps: true
    }

  );


const postSchema =
  new mongoose.Schema(

    {
      title: {
        type: String,
        required: true,
        trim: true
      },

      slug: {
        type: String,
        required: true,
        unique: true
      },

      excerpt:
        String,

      content: {
        type: String,
        required: true
      },

      image:
        String,

      author:
        String,

      publishedAt: {
        type: Date,
        default: Date.now
      },

      published: {
        type: Boolean,
        default: true
      }
    },

    {
      timestamps: true
    }

  );


const eventSchema =
  new mongoose.Schema(

    {
      title: {
        type: String,
        required: true
      },

      description:
        String,

      date:
        Date,

      location:
        String,

      registrationUrl:
        String,

      image:
        String,

      active: {
        type: Boolean,
        default: true
      }
    },

    {
      timestamps: true
    }

  );


const gallerySchema =
  new mongoose.Schema(

    {
      title:
        String,

      type: {
        type: String,

        enum: [
          "image",
          "video"
        ],

        default: "image"
      },

      url: {
        type: String,
        required: true
      },

      caption:
        String,

      date:
        Date
    },

    {
      timestamps: true
    }

  );


const volunteerSchema =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true
      },

      email: {
        type: String,
        required: true
      },

      phone:
        String,

      skills:
        String,

      message:
        String,

      status: {
        type: String,
        default: "new"
      }
    },

    {
      timestamps: true
    }

  );


const partnerSchema =
  new mongoose.Schema(

    {
      organization: {
        type: String,
        required: true
      },

      contactName:
        String,

      email: {
        type: String,
        required: true
      },

      phone:
        String,

      message:
        String,

      status: {
        type: String,
        default: "new"
      }
    },

    {
      timestamps: true
    }

  );

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    currency: {
      type: String,
      default: "UGX",
      uppercase: true
    },

    method: {
      type: String,

      enum: [
        "card",
        "mobile_money",
        "bank"
      ],

      required: true
    },

    reference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    transactionId: {
      type: String,
      trim: true
    },

    status: {
      type: String,

      enum: [
        "pending",
        "successful",
        "failed",
        "cancelled"
      ],

      default: "pending"
    },

    message: {
      type: String,
      trim: true
    },

    paidAt: {
      type: Date
    }
  },

  {
    timestamps: true
  }
);

const newsletterSchema =
  new mongoose.Schema(

    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      }
    },

    {
      timestamps: true
    }

  );


const contactSchema =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true
      },

      email: {
        type: String,
        required: true
      },

      phone:
        String,

      subject:
        String,

      message: {
        type: String,
        required: true
      },

      status: {
        type: String,
        default: "new"
      }
    },

    {
      timestamps: true
    }

  );


export const Program =
  mongoose.model(
    "Program",
    programSchema
  );


export const Post =
  mongoose.model(
    "Post",
    postSchema
  );


export const Event =
  mongoose.model(
    "Event",
    eventSchema
  );


export const Gallery =
  mongoose.model(
    "Gallery",
    gallerySchema
  );


export const Volunteer =
  mongoose.model(
    "Volunteer",
    volunteerSchema
  );


export const Partner =
  mongoose.model(
    "Partner",
    partnerSchema
  );


export const Donation =
  mongoose.model(
    "Donation",
    donationSchema
  );


export const Newsletter =
  mongoose.model(
    "Newsletter",
    newsletterSchema
  );


export const Contact =
  mongoose.model(
    "Contact",
    contactSchema
  );