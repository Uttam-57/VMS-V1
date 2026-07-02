/**
 * @file cloudinary.js
 * @description Utility helper for utils feature.
 */
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadStream = (buffer, folder = "vms") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts = url.split("/upload/");
    if (parts.length > 1) {
      const pathWithVersion = parts[1];
      const withoutVersion = pathWithVersion.split("/").slice(1).join("/");
      const publicId = withoutVersion.substring(
        0,
        withoutVersion.lastIndexOf("."),
      );
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

export default { uploadStream, deleteFromCloudinary };
