import express from "express";
import * as UserController from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate, registerEmployerSchema, registerEmployeeSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateEmployeeSchema, updateRoleSalariesSchema, } from "../utils/schemas.js";
const router = express.Router();
// ----- Public auth (rate-limited) -----
router.post("/register-employer", authLimiter, validate(registerEmployerSchema), UserController.createEmployer);
router.post("/login-employee", authLimiter, validate(loginSchema), UserController.login("employee"));
router.post("/login-employer", authLimiter, validate(loginSchema), UserController.login("employer"));
router.post("/forgot-password-employer", authLimiter, validate(forgotPasswordSchema), UserController.forgotPassword("employer"));
router.post("/forgot-password-employee", authLimiter, validate(forgotPasswordSchema), UserController.forgotPassword("employee"));
router.post("/reset-password-employer", authLimiter, validate(resetPasswordSchema), UserController.resetPassword("employer"));
router.post("/reset-password-employee", authLimiter, validate(resetPasswordSchema), UserController.resetPassword("employee"));
// ----- Session -----
router.post("/logout", protect, UserController.logout);
router.get("/me", protect, UserController.getMyToken);
// ----- Employee self -----
router.get("/employees/me", protect, requireRole("employee"), UserController.getEmployeeDetails);
// ----- Employer-only employee management -----
router.post("/register-employee", protect, requireRole("employer"), validate(registerEmployeeSchema), UserController.createEmployee);
router.get("/employees", protect, requireRole("employer"), UserController.getEmployees);
router.get("/employees/:id", protect, requireRole("employer"), UserController.getEmployee);
router.put("/employees/:id", protect, requireRole("employer"), validate(updateEmployeeSchema), UserController.updateEmployee);
router.delete("/employees/:id", protect, requireRole("employer"), UserController.deleteEmployee);
router.put("/employer/role-salaries", protect, requireRole("employer"), validate(updateRoleSalariesSchema), UserController.updateRoleSalaries);
export default router;
//# sourceMappingURL=userRoutes.js.map