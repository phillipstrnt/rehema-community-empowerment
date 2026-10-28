import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cloudinary from "./cloudinary.js";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const localUploadDirectory = path.join(serverRoot, "uploads");

const extensionByMime = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export async function uploadMediaFile(file, { folder, resourceType }) {
  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (hasCloudinaryConfig) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(file.buffer);
    });
  }

  const extension = extensionByMime[file.mimetype];
  if (!extension) throw new Error("Unsupported file type.");
  await fs.mkdir(localUploadDirectory, { recursive: true });
  const filename = `${crypto.randomUUID()}${extension}`;
  await fs.writeFile(path.join(localUploadDirectory, filename), file.buffer, { flag: "wx" });
  const apiOrigin = (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, "");
  return {
    secure_url: `${apiOrigin}/uploads/${filename}`,
    public_id: filename,
    resource_type: resourceType,
  };
}
