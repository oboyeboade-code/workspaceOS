import crypto from "crypto";

/** SHA-256 hex digest — used to store password-reset tokens at rest. */
export const sha256 = (value: string): string =>
  crypto.createHash("sha256").update(value).digest("hex");

/** URL-safe random token (hex). */
export const randomToken = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString("hex");
