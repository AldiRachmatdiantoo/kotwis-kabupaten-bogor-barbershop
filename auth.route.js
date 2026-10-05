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
    if (!findUser) return res.status(403).json({
        status: false,
        message: "nama/password salah!"
    });
    const payload = {id: findUser.id, name: findUser.name, role: findUser.role};

    // generate access token
    const accessToken = generateAccessToken(payload);
    
    // generate refresh token
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_RAHASIUY, {expiresIn: "1d"});
    
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_RAHASIUY);
    await knex("refresh_tokens").insert({
        user_id: decodedRefreshToken.id,
        token: refreshToken,
        expires_at: new Date(decodedRefreshToken.exp * 1000)
    })
    console.log("Succesfully store Refresh Token to Database");
    res.json({accessToken: accessToken, refreshToken: refreshToken});
  } catch (err) {
    console.error(err.message);
  }
});
route.get('/dashboard', authenticate, (req, res, next)=> {
    return res.json({
        status: true,
        message: "Welcome back! " + req.user.name,
        data: req.user
    });
})
route.post('/refresh', async (req, res, next)=> {
    if (!req.body.token) return res.sendStatus(401);
    try {
        const checkToken = await knex("refresh_tokens").select("*").where("token", req.body.token).first();
        if (!checkToken) return res.sendStatus(401);

        const decoded = jwt.verify(req.body.token, process.env.REFRESH_TOKEN_RAHASIUY);
        const payload = {id: decoded.id, name: decoded.name, role: decoded.role};
        const accessToken = generateAccessToken(payload);
        return res.json({accessToken: accessToken});
    } catch(err){
        console.error(err);
        return res.sendStatus(403);

    }
});
route.delete('/logout', authenticate, async (req, res, next)=> { 
    await knex("refresh_tokens").where("token", req.body.token).del();
    return res.status(200).json({
        status: true,
        message: "Logout Successfully"
    });
    
});
const generateAccessToken = (payload)=> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: "30s"});
}
function authenticate(req, res, next) {
    const header = req.headers['authorization'];
    const token = header && header.split(" ")[1];
    if (!token) return res.sendStatus(403);
    try {
        // decoded = data
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    next();
    } catch(err){
        return res.status(403).json({message: err.message});
    }
}

export default route;
