// Import statements using ES6 syntax
import express from "express";
import {
  addListing,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  updateTask,
  resetPassword,
  updatePassword,
  updateProfile,
  postItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
  getAllListings,
  getSingleTask,
  getUserListings,
  deleteUserListing,
  updateUserListing,
  getSingleItemListings,
} from "../controllers/User.js";

import { isAuthenticated } from "../middleware/auth.js";

import { uploadVideo, getUserVideos, getAllVideos, deleteVideo } from "../controllers/Video.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/singletask/:taskId").get(isAuthenticated, getSingleTask);

router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);

// Item routes
router.route("/addlisting").post(isAuthenticated, addListing);
router.route("/getlistings").get(isAuthenticated, getAllListings);
router.route("/getuserlistings").get(isAuthenticated, getUserListings);

router
  .route("/getuserlistings/:id")
  .get(isAuthenticated, getSingleItemListings)
  .delete(isAuthenticated, deleteUserListing)
  .put(isAuthenticated, updateUserListing);



// Route to upload a video
router.post("/upload", isAuthenticated, upload.single("video"), uploadVideo);

// Route to get user's videos
router.get("/my-videos", isAuthenticated, getUserVideos);

// Route to get all videos
router.get("/all-videos", getAllVideos);

// Define the route for deleting a video by ID
router.delete("/videos/:id", isAuthenticated, deleteVideo);


export default router;
