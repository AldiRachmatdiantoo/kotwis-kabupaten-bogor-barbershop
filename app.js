import express from "express";
import { checkConnection } from "./connection.js";
import authRoute from "./auth.route.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { handleError } from "./middlewares/errorHandler.js";
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(authRoute);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}`);
});

checkConnection();
