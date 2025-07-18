export const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};
