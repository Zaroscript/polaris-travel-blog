import jwt from "jsonwebtoken";
import crypto from "crypto";

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const generateToken = (userId, res = null) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  if (res) {
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      secure: process.env.NODE_ENV !== "development",
    });
  }

  return token;
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
