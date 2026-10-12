import jwt  from "jsonwebtoken";
import * as authRepository from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, res, next)=> {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) throw AppError.forbidden("TIDAK BOLEH MASUK");
  try {
    // decoded = data
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const checkRevoked = await authRepository.checkRevokedToken(decoded.sessionId);
    if (!checkRevoked || checkRevoked.is_revoked) throw AppError.forbidden("Token Habis!");
    
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}