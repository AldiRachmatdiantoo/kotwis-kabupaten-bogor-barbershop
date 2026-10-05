import express from "express";
import { checkConnection } from "./connection.js";
import authRoute from "./auth.route.js";
import "dotenv/config";

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(authRoute);

app.listen(PORT, ()=> {
    console.log(`Listening in port ${PORT}`);
});

checkConnection();