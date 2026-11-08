import express from "express";
import multer from "multer";
import { uploadMediaFile } from "./localUploads.js";
import { requireAdmin } from "./authMiddleware.js";

const router = express.Router();

router.use(requireAdmin);

/*
=========================================================
MULTER
=========================================================
*/

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Unsupported file type. Please upload an image or video."
        )
      );
    }
  },
});


/*
=========================================================
UPLOAD IMAGE OR VIDEO
=========================================================
*/

router.post(
  "/media",
  upload.single("media"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "Please select an image or video.",
        });

      }


      /*
      Determine Cloudinary resource type
      */

      const resourceType =
        req.file.mimetype.startsWith("video/")
          ? "video"
          : "image";


      /*
      Upload to Cloudinary
      */

      const result = await uploadMediaFile(req.file, {
        folder: "rehema/gallery",
        resourceType,
      });


      /*
      Return Cloudinary information
      */

      res.status(200).json({

        message:
          "Media uploaded successfully.",

        url:
          result.secure_url,

        public_id:
          result.public_id,

        resource_type:
          result.resource_type,

      });

    } catch (error) {

      console.error(
        "Media upload error:",
        error
      );


      res.status(500).json({

        message:
          error.message ||
          "Media upload failed.",

      });

    }

  }
);


/*
=========================================================
BACKWARD COMPATIBILITY
=========================================================

This keeps your existing /api/upload/image
endpoint working.
*/

router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "No image uploaded.",
        });

      }


      const result = await uploadMediaFile(req.file, {
        folder: "rehema",
        resourceType: "image",
      });


      res.json({

        message:
          "Image uploaded successfully.",

        url:
          result.secure_url,

        public_id:
          result.public_id,

      });

    } catch (error) {

      console.error(
        "Image upload error:",
        error
      );


      res.status(500).json({

        message:
          "Image upload failed.",

      });

    }

  }
);


/*
=========================================================
ERROR HANDLER FOR UPLOADS
=========================================================
*/

router.use(
  (error, req, res, next) => {

    console.error(
      "Upload error:",
      error
    );


    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code === "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({

          message:
            "File is too large. Maximum size is 50MB.",

        });

      }

    }


    res.status(400).json({

      message:
        error.message ||
        "File upload failed.",

    });

  }
);


export default router;