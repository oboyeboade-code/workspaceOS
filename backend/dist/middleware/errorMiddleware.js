export class AppError extends Error {
    statusCode;
    status;
    isOperational = true;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
const isDev = () => process.env.NODE_ENV === "development";
export const globalErrorHandler = (err, _req, res, _next) => {
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
export const notFoundHandler = (req, _res, next) => next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
//# sourceMappingURL=errorMiddleware.js.map