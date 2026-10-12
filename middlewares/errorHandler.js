import { AppError } from "../utils/AppError.js";

// catch error
export const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
export const handleError = (err, req, res, next)=>{
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Something went wrong!"
    })
}
