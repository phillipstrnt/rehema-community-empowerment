import "dotenv/config";

import {
  connectDB
} from "./db.js";


import {
  Program,
  Post,
  Event,
  Gallery
} from "./models.js";


const programs = [

  {
    title:
      "Medical Camps",

    slug:
      "medical-camps",

    shortDescription:
      "Free and accessible community medical outreach.",

    description:
      "REHEMA organizes medical outreach and community health activities that connect people to essential health information, screening and referral services.",

    image:
      ""
  },


  {
    title:
      "HIV Prevention & PrEP",

    slug:
      "hiv-prep",

    shortDescription:
      "Community education, prevention and referral support.",

    description:
      "We support communities with accurate HIV prevention information, linkage to services and health education.",

    image:
      ""
  },


  {
    title:
      "Family Planning",

    slug:
      "family-planning",

    shortDescription:
      "Information and access to family planning services.",

    description:
      "REHEMA promotes informed choices and access to family planning information and appropriate services.",

    image:
      ""
  },


  {
    title:
      "Maternal Health",

    slug:
      "maternal-health",

    shortDescription:
      "Supporting healthier mothers and families.",

    description:
      "We promote maternal health education, early care-seeking and community referral pathways.",

    image:
      ""
  },


  {
    title:
      "Community Health Education",

    slug:
      "health-education",

    shortDescription:
      "Practical health information for communities.",

    description:
      "We use community engagement and education to improve health knowledge and encourage healthy decisions.",

    image:
      ""
  }

];


const posts = [

  {

    title:
      "REHEMA Free Medical Camp — 13 August 2025",

    slug:
      "rehema-free-medical-camp-13-august-2025",

    excerpt:
      "A look back at REHEMA's community medical outreach.",

    content:
      "REHEMA held a successful free medical camp on 13 August 2025. Replace this starter text with the approved report, photographs, outcomes and stories from the original WordPress content.",

    author:
      "REHEMA",

    publishedAt:
      new Date("2025-08-13")

  },


  {

    title:
      "Building Stronger Community Health Systems",

    slug:
      "building-stronger-community-health-systems",

    excerpt:
      "How community engagement can strengthen health outcomes.",

    content:
      "Replace this sample article with approved REHEMA content migrated from the existing blog.",

    author:
      "REHEMA"

  }

];


const events = [

  {

    title:
      "Annual Community Health Campaign",

    description:
      "Upcoming campaign details will be published here.",

    date:
      new Date("2026-12-01"),

    location:
      "Mbale, Uganda",

    active:
      true

  }

];


const gallery = [

  {

    title:
      "REHEMA Medical Outreach",

    type:
      "image",

    url:
      "https://placehold.co/1200x800?text=REHEMA+Medical+Camp",

    caption:
      "Replace with an approved REHEMA photograph.",

    date:
      new Date("2025-08-13")

  }

];


await connectDB();


await Promise.all([

  Program.deleteMany({}),

  Post.deleteMany({}),

  Event.deleteMany({}),

  Gallery.deleteMany({})

]);


await Program.insertMany(
  programs
);


await Post.insertMany(
  posts
);


await Event.insertMany(
  events
);


await Gallery.insertMany(
  gallery
);


console.log(
  "REHEMA database seeded."
);


process.exit(0);