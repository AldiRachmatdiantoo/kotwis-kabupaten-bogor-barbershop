import * as authService from "../services/authService.js";
import * as jwt from "../utils/jwt.js";

export const login = async (req, res, next) => {
  const findUser = await authService.handleLogin(req.body);
  const sessionId = crypto.randomUUID();
  const payload = {
    id: findUser.id,
    name: findUser.name,
    role: findUser.role,
    sessionId: sessionId,
  };

  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);
  const decode = jwt.decodeRefreshToken(refreshToken);

  await authService.insertRefreshToken(decode, refreshToken);

  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

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
  const decoded = jwt.verifyRefreshToken(token.token);
  const payload = {
    id: decoded.id,
    name: decoded.name,
    role: decoded.role,
    sessionId: decoded.sessionId
  };
  const accessToken = jwt.generateAccessToken(payload);
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
