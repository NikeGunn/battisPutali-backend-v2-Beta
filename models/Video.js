import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  hashtags: {
    type: [String],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: true,
  },
}, { timestamps: true });

// Correctly export the Video model as default
const Video = mongoose.model("Video", videoSchema);

export default Video;
