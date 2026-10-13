import * as authRepository from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";
import * as jwt from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const handleLogin = async (rawData) => {
  const { name, password } = rawData;
  const getUser = await authRepository.findUser(name);

  if (!getUser) throw AppError.badRequest("Username atau password salah");
  const checkPassword = await bcrypt.compare(password, getUser.password);
  if (!checkPassword) throw AppError.badRequest("Nama/Password salah!");
  const sessionId = crypto.randomUUID();
  const payload = {
    id: getUser.id,
    name: getUser.name,
    role: getUser.role,
    sessionId: sessionId,
  };
  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);
  const decode = jwt.decodeRefreshToken(refreshToken);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await authRepository.insertRefreshToken(decode, hashedRefreshToken);
  console.log("Succesfully stored Refresh Token to Database");

  return { accessToken, refreshToken };
};
export const handleRefresh = async (token) => {
  const decoded = jwt.verifyRefreshToken(token);
  const getToken = await authRepository.checkToken(decoded.sessionId);
  if (!getToken || getToken.is_revoked) {
    throw AppError.unauthorized("Sesi anda habis!");
  }
  const checkToken = await bcrypt.compare(token, getToken.token);
  if (!checkToken) throw AppError.badRequest("Token tidak cocok!");
  const payload = {
    id: decoded.id,
    name: decoded.name,
    role: decoded.role,
    sessionId: decoded.sessionId,
  };
  return jwt.generateAccessToken(payload);
};
export const handleLogout = async (token) => {
  if (!token) throw AppError.unauthorized("Token tidak ada!");
  const decoded = jwt.verifyRefreshToken(token);
  const deleteToken = await authRepository.deleteToken(decoded.sessionId);
  if (deleteToken === 0)
    throw AppError.badRequest("Gagal menghapus refresh token!");
  return deleteToken;
};
