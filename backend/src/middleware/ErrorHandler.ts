import { ErrorRequestHandler } from "express";


export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true || statusCode < 500;
  const message = isOperational ? err.message : "Server error" ;
  
  if (statusCode >= 500) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message  ,
  });
};
