import * as jwt  from "../utils/jwt.js";
import * as authRepository from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, res, next)=> {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  console.log(token);
  if (!token) throw AppError.forbidden("TIDAK BOLEH MASUK");
  try {
    // decoded = data
    const decoded = jwt.verifyAccessToken(token);
    const checkRevoked = await authRepository.checkRevokedToken(decoded.sessionId);
    if (!checkRevoked || checkRevoked.is_revoked) throw AppError.forbidden("Token Habis!");
    
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}