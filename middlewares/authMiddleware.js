import * as jwt from "../utils/jwt.js";
import * as authRepository from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (!token) throw AppError.forbidden("TIDAK BOLEH MASUK");

    // decoded = data
    const decoded = jwt.verifyAccessToken(token);
    const checkRevoked = await authRepository.checkRevokedToken(
      decoded.sessionId,
    );
    if (!checkRevoked || checkRevoked.is_revoked)
      throw AppError.forbidden("Token Habis! (Logout)");
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyRole = allowedRole => {
  return (req, res, next) => {
    if (!allowedRole.includes(req.user.role)){
      return next(AppError.forbidden(`Role ${req.user.role} Tidak boleh masuk`));
    }
    next();
  };
};
