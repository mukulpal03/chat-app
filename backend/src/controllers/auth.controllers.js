import cloudinary from "../lib/cloudinary.js";
import { cookieOptions } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });

  if (password.length < 6)
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const user = new User({
      fullName,
      email,
      password,
    });

    await user.save();

    const token = await user.generateAuthToken();

    res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({ success: true, user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const token = await user.generateAuthToken();

    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ success: true, user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic)
    return res
      .status(400)
      .json({ success: false, message: "profilePic is required" });

  try {
    const res = await cloudinary.uploader.upload(profilePic);

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: res.secure_url },
      { new: true }
    );

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const checkAuth = async (req, res) =>
  res.status(200).json({ success: true, user: req.user });
