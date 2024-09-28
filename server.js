import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import cloudinary from "cloudinary";

// Load environment variables from config.env
config({
  path: "./config/config.env",
});

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// // Log Cloudinary config to ensure it's correct
// console.log({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// Connect to the database
connectDatabase();

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
