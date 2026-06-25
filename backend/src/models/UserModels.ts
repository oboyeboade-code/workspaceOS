import mongoose, { Document, Model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

const { model } = mongoose;

// Shared method type
interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Employee
export interface IEmployee extends Document, UserMethods {
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  role: string;
  phone: string;
  password: string;
  adminCode: string;
  address: string;
  wkratings: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type EmployeeModelType = Model<IEmployee>;

const EmployeeSchema = new Schema<IEmployee, EmployeeModelType>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      minLength: [1, "Name cannot be empty"],
      maxLength: [20, "Name cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [5, "Email is too short"],
      maxLength: [50, "Email cannot exceed 50 characters"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["active", "inactive", "suspended"],
        message: "{VALUE} is not a supported status",
      },
      default: "active",
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      lowercase: true,
      minLength: [1, "Role cannot be empty"],
      maxLength: [50, "Role cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{11}$/, "Phone number must be exactly 11 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    adminCode: {
      type: String,
      required: [true, "Admin code is required"],
      trim: true,
      match: [/^[A-Za-z0-9]{6}$/, "Admin code must be 6 alphanumeric characters"],
    },
    address: {
      type: String,
      default: "Not provided",
      trim: true,
    },
    wkratings: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [10, "Rating cannot exceed 10"],
      default: null,
      set: (v: number | null) => {
        if (v === null || v === undefined) return null;
        return Math.round(v * 10) / 10;
      },
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Employer
export interface IEmployer extends Document, UserMethods {
  name: string;
  email: string;
  phone: string;
  password: string;
  adminCode: string;
  roleSalaries: Record<string, number>;
  employees: Types.ObjectId[] | IEmployee[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type EmployerModelType = Model<IEmployer>;

const EmployerSchema = new Schema<IEmployer, EmployerModelType>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      minLength: [1, "Name cannot be empty"],
      maxLength: [20, "Name cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [5, "Email is too short"],
      maxLength: [50, "Email cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{11}$/, "Phone number must be exactly 11 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    adminCode: {
      type: String,
      required: [true, "Admin code is required"],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9]{6}$/, "Admin code must be 6 alphanumeric characters"],
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    roleSalaries: {
      type: Object,
      default: {},
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Password Hashing Hook
async function hashPassword(this: IEmployee | IEmployer): Promise<void> {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}

EmployeeSchema.pre("save", hashPassword);
EmployerSchema.pre("save", hashPassword);

// Password Comparison Method
async function comparePassword(
  this: IEmployee | IEmployer,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
}

EmployeeSchema.methods.comparePassword = comparePassword;
EmployerSchema.methods.comparePassword = comparePassword;

export const EmployeeModel = model<IEmployee>("Employee", EmployeeSchema);
export const EmployerModel = model<IEmployer>("Employer", EmployerSchema);
