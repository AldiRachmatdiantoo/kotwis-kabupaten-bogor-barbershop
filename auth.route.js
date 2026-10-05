import { Router } from "express";
import jwt from "jsonwebtoken";
import { conn as knex } from "./connection.js";

const route = Router();

route.post("/login", async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const findUser = await knex("users")
      .select("*")
      .where("name", name)
      .where("password", password)
      .first();
    if (!findUser)
      return res.status(403).json({
        status: false,
        message: "nama/password salah!",
      });
    const payload = {
      id: findUser.id,
      name: findUser.name,
      role: findUser.role,
    };

    // generate access token
    const accessToken = generateAccessToken(payload);

    // generate refresh token
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
    await knex("refresh_tokens").insert({
      user_id: decodedRefreshToken.id,
      token: refreshToken,
      expires_at: new Date(decodedRefreshToken.exp * 1000),
    });
    console.log("Succesfully store Refresh Token to Database");
    res.json({ accessToken: accessToken});
  } catch (err) {
    console.error(err.message);
  }
});
route.get("/dashboard", authenticate, (req, res, next) => {
  return res.json({
    status: true,
    message: "Welcome back! " + req.user.name,
    data: req.user,
  });
});
route.post("/refresh", async (req, res, next) => {
  const token = req.cookies.refreshtoken;
  try {
    const checkToken = await knex("refresh_tokens")
      .select("*")
      .where("token", token)
      .first();
    if (!checkToken) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_RAHASIUY);
    const payload = { id: decoded.id, name: decoded.name, role: decoded.role };
    const accessToken = generateAccessToken(payload);
    return res.json({ accessToken: accessToken });
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
});
route.put("/logout", async (req, res, next) => {
  const token = req.cookies.refreshtoken;
  try {
    if (!token)
      return res.status(402).json({ message: "Token tidak ditemukan!" });
    const deleteToken = await knex("refresh_tokens")
      .where("token", token)
      .update({
        is_revoked: true
      });
    if (deleteToken === 0)
      return res
        .status(403)
        .json({message: "gagal menghapus refresh token dari database!"});
    res.clearCookie("refreshtoken");

    return res.status(200).json({
      status: true,
      message: "Logout successfully!",
    });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};
function authenticate(req, res, next) {
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

export default route;
