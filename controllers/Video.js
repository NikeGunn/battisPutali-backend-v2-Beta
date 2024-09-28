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

    // Log file path and type
    console.log("File path:", req.file.path);
    console.log("File type:", req.file.mimetype);

    // Upload the video using the file path (changed from upload_large to upload)
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "video",  // Ensure it's a video
      folder: "videos",
    });

    // Log the Cloudinary upload result to debug
    console.log("Cloudinary Upload Result:", result);

    // Check if Cloudinary returned a valid URL
    if (!result.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed. No URL returned.",
      });
    }

    // Create new video document
    const video = new Video({
      title,
      url: result.secure_url, // This is the secure URL from Cloudinary
      hashtags: hashtags.split(","),
      userId: req.user._id,  // Assuming the user is authenticated
    });

    // Save the video to the database
    await video.save();

    // Add video reference to the user model
    const user = await User.findById(req.user._id);
    user.videos.push(video._id);
    await user.save();

    // Respond with success
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
