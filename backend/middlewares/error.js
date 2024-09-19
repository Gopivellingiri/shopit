import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let errorDetails = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  // Handle Invalid Mongoose ID Error
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid: ${err?.path}`;
    errorDetails = new ErrorHandler(message, 404);
  }

  // Handle Validation Errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    errorDetails = new ErrorHandler(message, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}. Please use a unique value.`;
    errorDetails = new ErrorHandler(message, 409);
  }

  // Handle wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try Again!!!";
    errorDetails = new ErrorHandler(message, 400);
  }

  // Handle expired JWT Error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Try Again!!!";
    errorDetails = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(errorDetails.statusCode).json({
      message: errorDetails.message,
      error: err,
      stack: err?.stack,
    });
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(errorDetails.statusCode).json({
      message: errorDetails.message,
    });
  }
};
