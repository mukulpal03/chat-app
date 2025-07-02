import { cookieOptions } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
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

    const existingUser = User.findOne({ email });

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

    const token = user.generateAuthToken();

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

export const login = (req, res) => {
  res.send("login");
};

export const logout = (req, res) => {
  res.send("logout");
};
