import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "./AppError.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_RAHASIUY, {
    expiresIn: "1d",
  });
};
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
  } catch (err) {
    if (err.name === "TokenExpiredError")
      throw AppError.forbidden("Token Habis! (expired)");
    if (err.name === "JsonWebTokenError")
      throw AppError.forbidden("Token Tidak Valid");
    throw err;
  }
};
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_RAHASIUY);
};
export const decodeRefreshToken = (token) => {
  return jwt.decode(token);
};
