import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUsersForSideBar = async (req, res) => {
  const loggedInUserId = req.user._id;

  try {
    const users = await User.find({ _id: { $ne: loggedInUserId } });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const getAllMessagesForChat = async (req, res) => {
  const { id: recieverId } = req.params;
  const senderId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, recieverId },
        { senderId: recieverId, recieverId: senderId },
      ],
    });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  const { id: recieverId } = req.params;
  const senderId = req.user._id;
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).json({
      success: false,
      message: "Text or image is required",
    });
  }

  try {
    let imageURL;

    if (image) {
      const res = await cloudinary.uploader.upload(image);
      imageURL = res.secure_url;
    }

    const message = new Message({
      senderId,
      recieverId,
      text,
      image: imageURL,
    });

    await message.save();

    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};
