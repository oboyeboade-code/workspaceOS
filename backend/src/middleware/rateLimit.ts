import rateLimit from "express-rate-limit";

/** Strict limiter for auth-sensitive endpoints (login, password reset, register). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many attempts. Please try again later." },
});

/** Sane default for everything else. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests. Please slow down." },
});
