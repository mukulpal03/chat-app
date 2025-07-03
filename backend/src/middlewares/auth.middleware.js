import User from "../models/user.model";

export const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded._id);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
