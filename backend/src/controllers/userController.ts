import type { RequestHandler } from "express";
import * as UserService from "../services/userService.js";
import Blacklist from "../models/Blacklist.js";
import { EmployeeModel } from "../models/UserModels.js";
import { AppError } from "../middleware/errorMiddleware.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import type { UserRole } from "../types/express.js";

// ---------- Small helpers ----------
const ok = (data?: unknown, message?: string) => ({
  status: "success" as const,
  ...(message && { message }),
  ...(data !== undefined && { data }),
});

const requireEmployer = (req: Parameters<RequestHandler>[0]) => {
  if (req.user?.role !== "employer" || !req.user.employerId) {
    throw new AppError("Forbidden", 403);
  }
  return { employerId: req.user.employerId, adminCode: req.user.adminCode };
};

// ---------- Session ----------
export const getMyToken: RequestHandler = (req, res) => {
  res.json(ok({ user: req.user }));
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.token as string | undefined;
    if (token) await Blacklist.create({ token });
    clearAuthCookie(res);
    res.json(ok(undefined, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

// ---------- Registration ----------
export const createEmployer: RequestHandler = async (req, res, next) => {
  try {
    await UserService.registerEmployer(req.body);
    res.status(201).json(ok(undefined, "Registration successful"));
  } catch (error) {
    next(error);
  }
};

export const createEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { adminCode } = requireEmployer(req);
    await UserService.registerEmployee(req.body, adminCode);
    res.status(201).json(ok(undefined, "Employee account created"));
  } catch (error) {
    next(error);
  }
};

// ---------- Auth (login / password reset) ----------
export const login =
  (type: UserRole): RequestHandler =>
  async (req, res, next) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const token = await UserService.loginUser(email, password, type);
      setAuthCookie(res, token);
      res.json(ok(undefined, "Login successful"));
    } catch (error) {
      next(error);
    }
  };

export const forgotPassword =
  (type: UserRole): RequestHandler =>
  async (req, res, next) => {
    try {
      const { email } = req.body as { email: string };
      await UserService.sendResetPasswordLink(email, type);
      // Same response regardless of whether the account exists
      res.json(
        ok(undefined, "If an account exists, a reset link has been sent.")
      );
    } catch (error) {
      next(error);
    }
  };

export const resetPassword =
  (type: UserRole): RequestHandler =>
  async (req, res, next) => {
    try {
      const { token, password } = req.body as { token: string; password: string };
      await UserService.resetPasswordService(token, password, type);
      res.json(ok(undefined, "Password updated. You can now sign in."));
    } catch (error) {
      next(error);
    }
  };

// ---------- Employer dashboard ----------
export const getEmployees: RequestHandler = async (req, res, next) => {
  try {
    const { employerId } = requireEmployer(req);
    const data = await UserService.getEmployerEmployees(employerId);
    res.json(ok(data));
  } catch (error) {
    next(error);
  }
};

export const updateRoleSalaries: RequestHandler = async (req, res, next) => {
  try {
    const { employerId } = requireEmployer(req);
    const { roleSalaries } = req.body as { roleSalaries: Record<string, number> };
    const employer = await UserService.updateRoleSalaries(employerId, roleSalaries);
    res.json(ok(employer.roleSalaries, "Role salaries updated successfully"));
  } catch (error) {
    next(error);
  }
};

// ---------- Employee self ----------
export const getEmployeeDetails: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== "employee" || !req.user.employeeId) {
      throw new AppError("Forbidden", 403);
    }
    const employee = await EmployeeModel.findById(req.user.employeeId);
    if (!employee) throw new AppError("Employee not found", 404);
    res.json(ok({ employee }));
  } catch (error) {
    next(error);
  }
};

// ---------- Employee management (employer-only, tenant-scoped) ----------
export const getEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { adminCode } = requireEmployer(req);
    const employee = await UserService.findEmployeeInTenant(String(req.params.id), adminCode);
    res.json(ok({ employee }));
  } catch (error) {
    next(error);
  }
};

export const updateEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { adminCode } = requireEmployer(req);
    // req.body is already whitelisted by validate(updateEmployeeSchema)
    const employee = await UserService.updateEmployeeInTenant(
      String(req.params.id),
      adminCode,
      req.body
    );
    res.json(ok({ employee }));
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { adminCode } = requireEmployer(req);
    await UserService.deleteEmployeeInTenant(String(req.params.id), adminCode);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
