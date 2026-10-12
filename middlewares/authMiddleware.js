import jwt  from "jsonwebtoken";

export const authenticate = (req, res, next)=> {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.sendStatus(403);
  try {
    // decoded = data
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
}