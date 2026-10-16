import { Router } from "express";
import { catchAsyncError } from "./middlewares/errorHandler.js";
import { authenticate, verifyRole } from "./middlewares/authMiddleware.js";
import * as authController from "./controllers/authController.js";
import * as serviceController from "./controllers/serviceController.js";

const route = Router();

// Login Router
route.post("/login", catchAsyncError(authController.login));
route.get("/refresh", catchAsyncError(authController.refresh));
route.put("/logout", authenticate, catchAsyncError(authController.logout));

// Service
route.get("/services", authenticate, verifyRole(['admin', 'user']), catchAsyncError(serviceController.index));
route.get("/services/:id", authenticate, verifyRole(['admin', 'user']), catchAsyncError(serviceController.show));
route.post("/services", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.store));
route.put("/services/:id", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.update));
route.delete("/services/:id", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.destroy));

// Admin


export default route;
