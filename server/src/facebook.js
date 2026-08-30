
import express from "express";
import { Post } from "./models.js";

const router = express.Router();

/*
=========================================================
FACEBOOK CONFIGURATION
=========================================================
These values MUST be placed in server/.env

FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_GRAPH_VERSION=v23.0

Never put the access token inside React/client code.
=========================================================
*/


function getFacebookConfig() {
  const pageId =
    process.env.FACEBOOK_PAGE_ID;

  const accessToken =
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const graphVersion =
    process.env.FACEBOOK_GRAPH_VERSION ||
    "v23.0";

  if (!pageId) {
    throw new Error(
      "FACEBOOK_PAGE_ID is not configured in server/.env"
    );
  }

  if (!accessToken) {
    throw new Error(
      "FACEBOOK_PAGE_ACCESS_TOKEN is not configured in server/.env"
    );
  }

  return {
    pageId,
    accessToken,
    graphVersion,
  };
}


/*
=========================================================
PUBLISH A POST TO FACEBOOK
=========================================================
POST
/api/admin/facebook/posts/:id
=========================================================
*/

router.post(
  "/posts/:id",
  async (req, res) => {
    try {
      const post =
        await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          message:
            "News story was not found.",
        });
      }


      const {
        pageId,
        accessToken,
        graphVersion,
      } = getFacebookConfig();


      /*
      -----------------------------------------------------
      PREVENT DUPLICATE FACEBOOK POSTS
      -----------------------------------------------------
      */

      if (post.facebook?.published) {
        return res.status(400).json({
          message:
            "This story has already been published to Facebook.",
          facebookPostId:
            post.facebook.postId || null,
        });
      }


      /*
      -----------------------------------------------------
      CREATE FACEBOOK MESSAGE
      -----------------------------------------------------
      */

      const websiteUrl =
        process.env.CLIENT_URL ||
        "http://localhost:5173";


      const postUrl =
        post.slug
          ? `${websiteUrl}/news/${post.slug}`
          : websiteUrl;


      const messageParts = [];


      if (post.title) {
        messageParts.push(
          post.title
        );
      }


      if (post.excerpt) {
        messageParts.push(
          post.excerpt
        );
      }


      messageParts.push(
        `Read the full story: ${postUrl}`
      );


      messageParts.push(
        "\n#REHEMA #CommunityHealth #Uganda"
      );


      const message =
        messageParts.join("\n\n");


      /*
      -----------------------------------------------------
      FACEBOOK GRAPH API
      -----------------------------------------------------
      */

      const endpoint =
        `https://graph.facebook.com/${graphVersion}/${pageId}/feed`;


      const facebookResponse =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },

            body:
              new URLSearchParams({
                message,
                access_token:
                  accessToken,
              }),
          }
        );


      const facebookData =
        await facebookResponse.json();


      /*
      -----------------------------------------------------
      FACEBOOK ERROR
      -----------------------------------------------------
      */

      if (!facebookResponse.ok) {
        console.error(
          "FACEBOOK API ERROR:",
          facebookData
        );


        post.facebook = {
          published: false,
          status: "failed",
          error:
            facebookData?.error?.message ||
            "Facebook publishing failed.",
        };


        await post.save();


        return res.status(400).json({
          message:
            facebookData?.error?.message ||
            "Facebook publishing failed.",

          facebook:
            facebookData,
        });
      }


      /*
      -----------------------------------------------------
      SAVE FACEBOOK RESULT
      -----------------------------------------------------
      */

      post.facebook = {
        published: true,
        status: "published",
        postId:
          facebookData.id || null,
        publishedAt:
          new Date(),
        error: "",
      };


      await post.save();


      return res.json({
        success: true,

        message:
          "Story published to Facebook successfully.",

        facebookPostId:
          facebookData.id || null,

        post,
      });


    } catch (error) {

      console.error(
        "FACEBOOK PUBLISH ERROR:",
        error
      );


      return res.status(500).json({
        message:
          error.message ||
          "Unable to publish story to Facebook.",
      });
    }
  }
);


/*
=========================================================
GET FACEBOOK STATUS FOR A POST
=========================================================
*/

router.get(
  "/posts/:id/status",
  async (req, res) => {

    try {

      const post =
        await Post.findById(req.params.id)
          .select("facebook title");

      if (!post) {
        return res.status(404).json({
          message:
            "News story was not found.",
        });
      }


      return res.json({
        success: true,

        title:
          post.title,

        facebook:
          post.facebook || {
            published: false,
            status: "not_published",
          },
      });


    } catch (error) {

      console.error(
        "FACEBOOK STATUS ERROR:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to retrieve Facebook status.",
      });
    }
  }
);


export default router;