import express from "express";
import User from "./routers/User.js"; // Single router for user and video routes
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload"; // For file uploads

// Initialize Express App
export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// // Use file upload middleware
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "./tmp/" // Make sure this path exists
// }));

// Use the single router (User.js)
app.use("/api/v1", User);

// Health check route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
