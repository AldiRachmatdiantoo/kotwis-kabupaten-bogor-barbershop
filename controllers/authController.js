import * as authService from "../services/authService.js";

export const login = async (req, res, next) => {
  const token = await authService.handleLogin(req.body);
  res.cookie("refreshtoken", token.refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken: token.accessToken });
};
export const refresh = async (req, res, next) => {
  const accessToken = await authService.handleRefresh(req.cookies.refreshtoken);
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
