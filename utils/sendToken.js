export const sendToken = (res, user, statusCode, message) => {
  const token = user.getJWTToken();

  // Cookie options for token
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // Cookie expiration based on your environment settings
  };

  // Define the user data to be sent in the response
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    tasks: user.tasks, // Include any additional data you want to send
    verified: user.verified, // Verification flag set to true as OTP is no longer used
  };

  // Send token and user data in response
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, message, user: userData });
};
