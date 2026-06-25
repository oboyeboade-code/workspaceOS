import type { JwtPayload } from "jsonwebtoken";

export type UserRole = "employer" | "employee";

export interface AuthTokenPayload extends JwtPayload {
  role: UserRole;
  employerId?: string;
  employeeId?: string;
  adminCode: string; // tenant key — present on every token
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
