import { Router } from "express";
import { catchAsyncError } from "./middlewares/errorHandler.js";
import { authenticate } from "./middlewares/authMiddleware.js";
import * as authController from "./controllers/authController.js";

const route = Router();

route.post("/login", catchAsyncError(authController.login));
route.get("/dashboard", authenticate, authController.dashboard);
route.post("/refresh", catchAsyncError(authController.refresh));
route.put("/logout", catchAsyncError(authController.logout));

export default route;
