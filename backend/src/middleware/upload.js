/**
 * @file upload.js
 * @description Middleware for in-memory file uploads using Multer.
 */
import multer from "multer";

const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default { uploadMemory };
