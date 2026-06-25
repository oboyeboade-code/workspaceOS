import type { Response } from "express";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie("token", COOKIE_OPTIONS);
};
