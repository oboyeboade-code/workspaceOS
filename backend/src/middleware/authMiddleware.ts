import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";
import { AppError } from "./errorMiddleware.js";
import type { AuthTokenPayload, UserRole } from "../types/express.js";

/** Require a valid, non-blacklisted JWT in the `token` cookie. */
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token as string | undefined;
    if (!token) throw new AppError("Not authorized, no token provided", 401);

    const blacklisted = await Blacklist.exists({ token });
    if (blacklisted) throw new AppError("Session invalid, please log in again", 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("Server misconfiguration", 500);

    req.user = jwt.verify(token, secret) as AuthTokenPayload;
    next();
  } catch (error) {
    next(error);
  }
};

/** Require one of the listed roles. Use after `protect`. */
export const requireRole =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
