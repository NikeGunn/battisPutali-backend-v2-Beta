// controllers/videoController.js
import cloudinary from "cloudinary";
import Video from "../models/Video.js";
import { User } from "../models/users.js";

// Controller for uploading video
export const uploadVideo = async (req, res) => {
  try {
    const { title, hashtags } = req.body;

    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded.",
      });
    }

    // Upload the video using the file buffer
    const result = await cloudinary.v2.uploader.upload_large(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,  // Convert buffer to base64
      {
        resource_type: "video",
        folder: "videos",
      }
    );

    // Create new video document
    const video = new Video({
      title,
      url: result.secure_url,
      hashtags: hashtags.split(","),
      userId: req.user._id,  // Assuming the user is authenticated
    });

    await video.save();

    // Add video reference to the user model
    const user = await User.findById(req.user._id);
    user.videos.push(video._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully.",
      video,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the video.",
    });
  }
};

// Fetch User Videos
export const getUserVideos = async (req, res) => {
  try {
    const userId = req.user._id;
    const videos = await Video.find({ userId });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching videos.",
    });
  }
};


// Controller to get all videos posted in the app
export const getAllVideos = async (req, res) => {
  try {
    // Fetch all video records from the database
    const videos = await Video.find();

    // If no videos are found, send a message
    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No videos found',
      });
    }

    // Respond with the list of videos
    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({
      success: false,
      message: 'Server error, unable to fetch videos',
      error: error.message,
    });
  }
};


// Controller to delete a video by its ID
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params; // Get video ID from request params

    // Find the video by ID in the database
    const video = await Video.findById(id);

    // If no video is found, send a 404 response
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Delete the video from the database
    await video.remove();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: 'Server error, unable to delete video',
      error: error.message,
    });
  }
};
