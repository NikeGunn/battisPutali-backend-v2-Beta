// middleware/upload.js
import multer from "multer";

// Define multer storage settings for extracting the file only
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv/; // Allowed video formats
  const extname = allowedTypes.test(file.originalname.toLowerCase());

  if (extname) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only video files are allowed."), false); // Reject the file
  }
};

// Set up the multer middleware
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max file size is 100MB
  fileFilter,
});
