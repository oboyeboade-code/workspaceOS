import { z } from "zod";
import { AppError } from "../middleware/errorMiddleware.js";
// ---------- Reusable primitives ----------
const email = z.string().trim().toLowerCase().email().max(50);
const password = z.string().min(8).max(128);
const phone = z.string().trim().regex(/^\d{11}$/, "Phone must be 11 digits");
const adminCode = z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6}$/, "Admin code must be 6 alphanumeric chars");
const name = z.string().trim().toLowerCase().min(1).max(20);
// ---------- Auth ----------
export const registerEmployerSchema = z.object({
    name,
    email,
    phone,
    password,
    adminCode,
});
export const registerEmployeeSchema = z.object({
    name,
    email,
    phone,
    password,
    role: z.string().trim().toLowerCase().min(1).max(50),
    address: z.string().trim().max(200).optional(),
});
export const loginSchema = z.object({ email, password });
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({
    token: z.string().min(10).max(200),
    password,
});
// ---------- Employee management ----------
/** Fields an employer is allowed to mutate on an employee. */
export const updateEmployeeSchema = z
    .object({
    name: name.optional(),
    phone: phone.optional(),
    address: z.string().trim().max(200).optional(),
    role: z.string().trim().toLowerCase().min(1).max(50).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    wkratings: z.number().min(0).max(10).nullable().optional(),
})
    .strict(); // reject unknown keys → blocks password/email/adminCode injection
export const updateRoleSalariesSchema = z.object({
    roleSalaries: z.record(z.string().min(1).max(50), z.number().min(0).max(1e9)),
});
export const validate = (schema, source = "body") => (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        return next(new AppError(`Invalid input: ${messages.join("; ")}`, 400));
    }
    // Replace with parsed (sanitized) data
    req[source] = result.data;
    next();
};
//# sourceMappingURL=schemas.js.map