import { Post } from "./models.js";

// Unpublished editorial starters. They contain no invented event or impact claims.
const samplePosts = [
  {
    title: "Community health outreach: a planning guide for local teams",
    slug: "community-health-outreach-planning-guide",
    excerpt: "An unpublished editorial draft listing the details to confirm before sharing a community health update.",
    content: `DRAFT — CONFIRM DETAILS WITH THE REHEMA TEAM BEFORE PUBLISHING.

A useful outreach update helps community members understand what support is available, where to find it, and how to ask questions. Before publication, add the confirmed date and location, the services offered, accessibility information, and an approved contact for follow-up.

Use only details approved by the programme team. Add photographs or participant comments only after permission has been documented.

EDITOR CHECKLIST: [confirm date] · [confirm location] · [confirm services] · [add approved contact] · [attach approved images]`,
    author: "REHEMA Foundation",
    published: false,
  },
  {
    title: "Maternal and child health: preparing an accurate community update",
    slug: "maternal-child-health-community-update-draft",
    excerpt: "An unpublished framework for sharing reviewed maternal and child health information with families.",
    content: `DRAFT — REQUIRES PROGRAMME AND HEALTH CONTENT REVIEW.

Families need information that is practical, respectful, and easy to verify. A community update can explain which services are available, how families can access them, and where to seek qualified support.

Confirm the service details, dates, locations, eligibility information, and referral contacts with the programme team. Health guidance must be reviewed by a qualified professional. Do not add personal stories without informed consent.

EDITOR CHECKLIST: [confirm approved service information] · [confirm referral contact] · [review health guidance] · [check consent for any story or image]`,
    author: "REHEMA Foundation",
    published: false,
  },
  {
    title: "Safe water and hygiene: community information update",
    slug: "safe-water-hygiene-community-update-draft",
    excerpt: "An unpublished editorial starter for a verified water, sanitation, and hygiene programme update.",
    content: `DRAFT — ADD VERIFIED PROJECT DETAILS BEFORE PUBLICATION.

Clear water and hygiene information works best when it reflects local conditions and gives people useful next steps. Adapt this draft to explain the focus of a REHEMA activity, the community it serves, and where readers can find current guidance.

Confirm project status, locations, dates, and technical advice with the responsible team. Do not include unverified impact figures or imply service availability before it is confirmed.

EDITOR CHECKLIST: [confirm project details] · [review technical information] · [confirm service availability] · [add approved contact and images]`,
    author: "REHEMA Foundation",
    published: false,
  },
];

export async function ensureSamplePosts() {
  for (const post of samplePosts) {
    await Post.updateOne(
      { slug: post.slug },
      { $setOnInsert: post },
      { upsert: true },
    );
  }
}
