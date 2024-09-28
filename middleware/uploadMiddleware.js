import multer from "multer";
import path from "path";

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

// File filter for video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv/; // Allowed video formats
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only video files are allowed."), false); // Reject the file
  }
};

// Set up the multer middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max file size is 100MB
  fileFilter: fileFilter,
});
