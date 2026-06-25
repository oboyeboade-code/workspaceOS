import jwt from "jsonwebtoken";
import { EmployeeModel, EmployerModel, } from "../models/UserModels.js";
import { AppError } from "../middleware/errorMiddleware.js";
import transporter from "../utils/sendEmail.js";
import { sha256, randomToken } from "../utils/hash.js";
// ---------- Token helper ----------
const signToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("Server misconfiguration: JWT_SECRET missing", 500);
    }
    const options = { expiresIn: "1d" };
    return jwt.sign(payload, secret, options);
};
// ---------- Registration ----------
export const registerEmployer = (data) => EmployerModel.create(data);
const MAX_EMPLOYEES_PER_TENANT = 5000;
/**
 * Create an employee under the caller's tenant.
 * `adminCode` is taken from the authenticated employer — NEVER from request body.
 */
export const registerEmployee = async (data, employerAdminCode) => {
    const employer = await EmployerModel.findOne({
        adminCode: employerAdminCode,
    });
    if (!employer) {
        throw new AppError("Employer not found", 404);
    }
    if (employer.employees.length >= MAX_EMPLOYEES_PER_TENANT) {
        throw new AppError("Maximum employee limit reached", 403);
    }
    const employee = await EmployeeModel.create({
        ...data,
        adminCode: employer.adminCode,
    });
    await EmployerModel.updateOne({ _id: employer._id }, { $addToSet: { employees: employee._id } });
    return employee;
};
// ---------- Login ----------
export const loginUser = async (email, password, type) => {
    const user = type === "employer"
        ? await EmployerModel.findOne({ email }).select("+password")
        : await EmployeeModel.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid email or password", 401);
    }
    const payload = type === "employer"
        ? {
            employerId: String(user._id),
            role: "employer",
            adminCode: user.adminCode,
        }
        : {
            employeeId: String(user._id),
            role: "employee",
            adminCode: user.adminCode,
        };
    return signToken(payload);
};
const computeStats = (employees, roleSalaries) => employees.reduce((acc, emp) => {
    const salary = roleSalaries[emp.role.toLowerCase()] ??
        roleSalaries["default"] ??
        0;
    acc.totalPayroll += salary;
    if (!emp.address || !emp.phone) {
        acc.missingInfoCount += 1;
    }
    return acc;
}, {
    totalPayroll: 0,
    missingInfoCount: 0,
});
export const getEmployerEmployees = async (employerId) => {
    const employer = await EmployerModel.findById(employerId).populate("employees");
    if (!employer) {
        throw new AppError("Employer not found", 404);
    }
    const employees = employer.employees ?? [];
    const roleSalaries = employer.roleSalaries ?? {
        default: 0,
    };
    const stats = computeStats(employees, roleSalaries);
    return {
        employer: {
            adminCode: employer.adminCode,
            name: employer.name,
            email: employer.email,
            roleSalaries,
        },
        stats: {
            totalEmployees: employees.length,
            missingInfoCount: stats.missingInfoCount,
            estimatedMonthlyPayroll: stats.totalPayroll,
        },
        employees,
    };
};
export const updateRoleSalaries = async (employerId, roleSalaries) => {
    const employer = await EmployerModel.findById(employerId);
    if (!employer) {
        throw new AppError("Employer not found", 404);
    }
    employer.roleSalaries = {
        ...(employer.roleSalaries ?? {}),
        ...roleSalaries,
    };
    await employer.save();
    return employer;
};
// ---------- Tenant-scoped employee access ----------
/** Find an employee that belongs to the caller's tenant; 404 on miss (no existence leak). */
export const findEmployeeInTenant = async (employeeId, adminCode) => {
    const employee = await EmployeeModel.findOne({
        _id: employeeId,
        adminCode,
    });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    return employee;
};
export const updateEmployeeInTenant = async (employeeId, adminCode, updates) => {
    const employee = await EmployeeModel.findOneAndUpdate({
        _id: employeeId,
        adminCode,
    }, updates, {
        new: true,
        runValidators: true,
    });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    return employee;
};
export const deleteEmployeeInTenant = async (employeeId, adminCode) => {
    const employee = await EmployeeModel.findOneAndDelete({
        _id: employeeId,
        adminCode,
    });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    await EmployerModel.updateOne({ adminCode }, {
        $pull: {
            employees: employee._id,
        },
    });
    return employee;
};
// ---------- Password reset ----------
const RESET_TTL_MS = 5 * 60 * 1000;
/**
 * Generate a reset link and email it.
 * Silently no-ops if the address is unknown — prevents account-enumeration.
 */
export const sendResetPasswordLink = async (email, type) => {
    const user = type === "employer"
        ? await EmployerModel.findOne({ email })
        : await EmployeeModel.findOne({ email });
    // Prevent account enumeration
    if (!user)
        return;
    const rawToken = randomToken(32);
    user.resetPasswordToken = sha256(rawToken);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TTL_MS);
    await user.save();
    const resetLink = `${process.env.FRONTEND_URL}` +
        `/reset-password?token=${rawToken}&side=${type}`;
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Reset",
        html: `
      <h2>Password Reset</h2>

      <p>
        Click the link below to reset your password.
        It expires in 5 minutes.
      </p>

      <a href="${resetLink}">
        Reset Password
      </a>
    `,
    });
};
export const resetPasswordService = async (rawToken, newPassword, type) => {
    const tokenHash = sha256(rawToken);
    const user = type === "employer"
        ? await EmployerModel.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        }).select("+password")
        : await EmployeeModel.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        }).select("+password");
    if (!user) {
        throw new AppError("Token is invalid or has expired", 400);
    }
    // pre-save hook re-hashes password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};
//# sourceMappingURL=userService.js.map