import * as authRepository from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";

export const handleLogin = async (rawData) => {
  const { name, password } = rawData;
  const getUser = await authRepository.findUser(name, password);

  if (!getUser) throw AppError.badRequest("Username atau password salah");
  return getUser;
};
export const handleRefreshToken = async (data, refreshToken) => {
  const insertToken = await authRepository.insertRefreshToken(
    data,
    refreshToken,
  );
  console.log("Succesfully store Refresh Token to Database");
  return insertToken;
};
export const handleRefresh = async (token) => {
  const checkToken = await authRepository.checkToken(token);
  if (!checkToken) throw AppError.badRequest("Token tidak cocok!");
  return checkToken;
};
export const handleLogout = async (token) => {
  if (!token) throw AppError.unauthorized("Token tidak ada!");
  const deleteToken = await authRepository.deleteToken(token);
  if (deleteToken === 0)
    throw AppError.badRequest("Gagal menghapus refresh token!");
  return deleteToken;
};
