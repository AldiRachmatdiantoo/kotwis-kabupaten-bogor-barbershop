import express from "express";
import { checkConnection } from "./connection.js";
import route from "./route.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { handleError } from "./middlewares/errorHandler.js";
import "./crons/doneCron.js";
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  if (req.method === "GET") delete req.headers["content-type"];
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(route);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}`);
});

checkConnection();
