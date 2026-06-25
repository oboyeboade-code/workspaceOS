import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

interface MongoLikeError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  statusCode?: number;
  status?: string;
}

const isDev = () => process.env.NODE_ENV === "development";

export const globalErrorHandler = (
  err: MongoLikeError & Partial<AppError>,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Mongoose validation
  if (err.name === "ValidationError" && err.errors) {
    res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  // Mongo duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    res.status(409).json({ status: "fail", message: `${field} already exists` });
    return;
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ status: "fail", message: "Invalid token. Please log in again." });
    return;
  }
  if (err.name === "TokenExpiredError") {
    res.status(401).json({ status: "fail", message: "Session expired. Please log in again." });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    status: err.status ?? "error",
    message: err.message || "Something went wrong",
    ...(isDev() && { stack: err.stack }),
  });
};

/** 404 for unmatched routes. */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) =>
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
