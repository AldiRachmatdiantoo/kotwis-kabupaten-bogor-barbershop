import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_RAHASIUY, {expiresIn: "1d"});
}
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
}
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_RAHASIUY);
}
export const decodeRefreshToken = (token) => {
    return jwt.decode(token);
}