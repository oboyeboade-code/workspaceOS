import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";
import { AppError } from "./errorMiddleware.js";
/** Require a valid, non-blacklisted JWT in the `token` cookie. */
export const protect = async (req, _res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token)
            throw new AppError("Not authorized, no token provided", 401);
        const blacklisted = await Blacklist.exists({ token });
        if (blacklisted)
            throw new AppError("Session invalid, please log in again", 401);
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new AppError("Server misconfiguration", 500);
        req.user = jwt.verify(token, secret);
        next();
    }
    catch (error) {
        next(error);
    }
};
/** Require one of the listed roles. Use after `protect`. */
export const requireRole = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new AppError("Forbidden", 403));
    }
    next();
};
//# sourceMappingURL=authMiddleware.js.map