import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e: any) => e.message);
    message = errors.length > 0 ? errors.join(", ") : "Validation failed";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}`;
  } else {
    const isOperational = err.isOperational === true || statusCode < 500;
    if (!isOperational && process.env.NODE_ENV === "production") {
      message = "Server error";
    }
  }

  if (statusCode >= 500) {
    console.error("Unexpected error in request handler:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
