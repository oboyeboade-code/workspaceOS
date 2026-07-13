import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

const API_URL = import.meta.env.VITE_HEROKU_API_URL;
// ======================================================
// Types
// ======================================================

export type Worker = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  address?: string;
  wkratings?: number;
  adminCode?: string;
  createdAt?: string;
};

export type EmployerStats = {
  totalEmployees: number;
  missingInfoCount: number;
  estimatedMonthlyPayroll: number;
};

export type EmployerInfo = {
  adminCode: string;
  name: string;
  email: string;
  roleSalaries?: Record<string, number>;
};

export type ListWorkersResponse = {
  employer: EmployerInfo;
  stats: EmployerStats;
  employees: Worker[];
};

export type RoleSalaries = Record<string, number>;

export type ApiResponse<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
};

export type AuthUser = {
  employerId?: string;
  employeeId?: string;
  role: "employer" | "employee";
};

// ======================================================
// Helpers
// ======================================================

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const request = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get("content-type") || "";

    // Backend redirected to HTML instead of JSON
    if (!contentType.includes("application/json") && res.redirected) {
      return {
        ok: false,
        message: "Unexpected server response",
      };
    }

    const payload = await res.json().catch(() => ({}));

    return {
      ok: res.ok,
      message:
        payload?.message ||
        (res.ok ? "Request successful" : "Request failed"),
      data: payload?.data,
      errors: payload?.errors,
    };
  } catch {
    return {
      ok: false,
      message: "Network error. Please check your connection.",
    };
  }
}

// ======================================================
// Utilities
// ======================================================

export const generatePassword = (length = 8) => {
  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let out = "";

  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }

  return out;
}

// ======================================================
// API
// ======================================================

export const api = {
  // ====================================================
  // Auth
  // ====================================================

  async getMe(): Promise<AuthUser | null> {
    const res = await request<{ user: AuthUser }>("/api/v1/me", {
      method: "GET",
    });

    if (!res.ok || !res.data?.user) {
      return null;
    }

    const user = res.data.user;

    const hasValidId = user.employerId || user.employeeId;

    if (!hasValidId || !user.role) {
      return null;
    }

    return user;
  },

  async loginEmployer(
    email: string,
    password: string
  ): Promise<ApiResponse> {
    return request("/api/v1/login-employer", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  async loginEmployee(
    email: string,
    password: string
  ): Promise<ApiResponse> {
    return request("/api/v1/login-employee", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  async registerEmployer(
    payload: Record<string, string>
  ): Promise<ApiResponse> {
    return request("/api/v1/register-employer", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<ApiResponse> {
    return request("/api/v1/logout", {
      method: "POST",
    });
  },

  async forgotPassword(
    email: string,
    kind: "employer" | "employee"
  ): Promise<ApiResponse> {
    if (!validateEmail(email)) {
      return {
        ok: false,
        message: "Please enter a valid email",
      };
    }

    return request(`/api/v1/forgot-password-${kind}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(
    token: string,
    password: string,
    kind: "employer" | "employee"
  ): Promise<ApiResponse> {
    if (!token) {
      return {
        ok: false,
        message: "Reset token is missing or invalid",
      };
    }

    if (!password || password.length < 8) {
      return {
        ok: false,
        message: "Password must be at least 8 characters",
      };
    }

    return request(`/api/v1/reset-password-${kind}`, {
      method: "POST",
      body: JSON.stringify({
        token,
        password,
      }),
    });
  },

  // ====================================================
  // Workers
  // ====================================================

  async createWorker(
    payload: Omit<Worker, "_id" | "createdAt"> & {
      password: string;
    }
  ): Promise<ApiResponse> {
    return request("/api/v1/register-employee", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async listWorkers(): Promise<ApiResponse<ListWorkersResponse>> {
    return request<ListWorkersResponse>("/api/v1/employees", {
      method: "GET",
    });
  },

  async getWorker(id: string): Promise<ApiResponse<Worker>> {
    const res = await request<{ employee: Worker }>(
      `/api/v1/employees/${id}`,
      {
        method: "GET",
      }
    );

    return {
      ok: res.ok,
      message: res.message,
      data: res.data?.employee,
      errors: res.errors,
    };
  },

  async updateWorker(
    id: string,
    payload: Partial<Worker>
  ): Promise<ApiResponse<Worker>> {
    const res = await request<{ employee: Worker }>(
      `/api/v1/employees/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return {
      ok: res.ok,
      message: res.message,
      data: res.data?.employee,
      errors: res.errors,
    };
  },

  async deleteWorker(id: string): Promise<ApiResponse> {
    return request(`/api/v1/employees/${id}`, {
      method: "DELETE",
    });
  },

  async me(): Promise<ApiResponse<Worker>> {
    const res = await request<{ employee: Worker }>(
      "/api/v1/employees/me",
      {
        method: "GET",
      }
    );

    return {
      ok: res.ok,
      message: res.message,
      data: res.data?.employee,
      errors: res.errors,
    };
  },

  // ====================================================
  // Employer
  // ====================================================

  async updateRoleSalaries(
    roleSalaries: RoleSalaries
  ): Promise<ApiResponse<RoleSalaries>> {
    return request<RoleSalaries>(
      "/api/v1/employer/role-salaries",
      {
        method: "PUT",
        body: JSON.stringify({ roleSalaries }),
      }
    );
  },
};


// Handles demo login via FAB: logs in with hardcoded credentials for employer/employee
// and redirects to the appropriate dashboard. Toasts are positioned bottom-left to appear near FAB.

type DemoRole = "employer" | "employee";

const DEMO_CREDS = {
  employer: { email: 'demo-employer@workspace.com', password: '12348765' },
  employee: { email: 'demo-employee@workspace.com', password: '12348765' },
} as const

type DemoLoginParams = {
  role: DemoRole;
  setLoading: (v: boolean) => void;
  navigate: NavigateFunction;
};

export const handleDemoLogin = async ({
  role,
  setLoading,
  navigate,
}: DemoLoginParams) => {
  try {
    setLoading(true);
    const creds = DEMO_CREDS[role];

    const res = role === 'employer'
   ? await api.loginEmployer(creds.email, creds.password)
      : await api.loginEmployee(creds.email, creds.password);

    if (!res.ok) {
      toast.error("Demo login failed", {
        description: res.message || "Could not log in as demo user",
      });
      return;
    }

    toast.success("Welcome to demo", {
      description: `Logged in as ${role}`,
    });

    // Redirect based on role
    const route = role === 'employer'? '/employer' : '/employee';
    navigate(route, { replace: true });

  } catch (err: any) {
    toast.error("Error", {
      description: err.message || "Something went wrong",
    });
  } finally {
    setLoading(false);
  }
};