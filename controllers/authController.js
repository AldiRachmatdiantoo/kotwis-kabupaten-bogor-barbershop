import * as authService from "../services/authService.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

export const login = async (req, res, next) => {
  const findUser = await authService.handleLogin(req.body);
  const payload = {
    id: findUser.id,
    name: findUser.name,
    role: findUser.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_RAHASIUY, {
    expiresIn: "1d",
  });
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  const decodedRefreshToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_RAHASIUY,
  );
  await authService.handleRefreshToken(decodedRefreshToken, refreshToken);

  res.json({ accessToken: accessToken });
};
export const dashboard = async (req, res, next) => {
  return res.json({
    status: true,
    message: "Welcome back! " + req.user.name,
    data: req.user,
  });
};
export const refresh = async (req, res, next) => {
  const token = await authService.handleRefresh(req.cookies.refreshtoken);

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_RAHASIUY);
  const payload = { id: decoded.id, name: decoded.name, role: decoded.role };
  const accessToken = generateAccessToken(payload);
  return res.json({ accessToken: accessToken });
};
export const logout = async (req, res, next) => {
  await authService.handleLogout(req.cookies.refreshtoken);
  res.clearCookie("refreshtoken");
  return res.status(200).json({
    status: true,
    message: "Logout successfully!",
  });
};
