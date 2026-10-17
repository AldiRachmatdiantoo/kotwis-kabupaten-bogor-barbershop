import { Router } from "express"
import { catchAsyncError } from "./middlewares/errorHandler.js"
import { authenticate, verifyRole } from "./middlewares/authMiddleware.js"
import * as authController from "./controllers/authController.js"
import * as serviceController from "./controllers/serviceController.js"
import * as bookingController from "./controllers/bookingController.js"
const route = Router();

// Authentication
route.post("/login", catchAsyncError(authController.login));
route.get("/refresh", catchAsyncError(authController.refresh));
route.put("/logout", authenticate, catchAsyncError(authController.logout));

// Service
route.get("/services", authenticate, verifyRole(['admin', 'customer']), catchAsyncError(serviceController.index));
route.get("/services/:id", authenticate, verifyRole(['admin', 'customer']), catchAsyncError(serviceController.show));
route.post("/services", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.store));
route.put("/services/:id", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.update));
route.delete("/services/:id", authenticate, verifyRole(['admin']), catchAsyncError(serviceController.destroy));

// Booking
route.get("/bookings", authenticate, verifyRole(['customer']), catchAsyncError(bookingController.index));
route.get("/bookings/:id", authenticate, verifyRole(['customer']), catchAsyncError(bookingController.show))
route.post("/bookings", authenticate, verifyRole(['customer']), catchAsyncError(bookingController.store));


export default route;
