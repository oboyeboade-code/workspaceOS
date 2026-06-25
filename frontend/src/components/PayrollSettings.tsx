import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoleSalary {
  id: string;
  role: string;
  salary: string;
}

export function PayrollSettings({
  roleSalaries,
  mutate,
}: {
  roleSalaries?: Record<string, number>;
  mutate?: () => void;
}) {
  const [roles, setRoles] = useState<RoleSalary[]>([]);
  const [defaultSalary, setDefaultSalary] = useState<string>("");

  useEffect(() => {
    if (!roleSalaries) return;

    const mapped: RoleSalary[] = Object.entries(roleSalaries)
      .filter(([key]) => key !== "default")
      .map(([role, salary]) => ({
        id: crypto.randomUUID(),
        role,
        salary: String(salary),
      }));

    setRoles(mapped);
    setDefaultSalary(String(roleSalaries.default ?? ""));
  }, [roleSalaries]);

  const updateRole = (id: string, patch: Partial<RoleSalary>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const addRole = () => {
    setRoles((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "", salary: "" },
    ]);
  };

  const removeRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = async () => {
    const payload = {
      roleSalaries: {
        ...Object.fromEntries(
          roles
            .filter((r) => r.role.trim().length > 0)
            .map((r) => [
              r.role.trim().toLowerCase(),
              Number(r.salary) || 0,
            ])
        ),
        default: Number(defaultSalary) || 0,
      },
    };

    try {
      const res = await api.updateRoleSalaries(payload.roleSalaries);

      if (res.ok) {
        toast.success("Payroll configuration saved successfully");
        mutate?.();
      } else {
        toast.error(res.message || "Failed to save payroll configuration");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payroll Configuration</CardTitle>
        <CardDescription>
          Set the monthly salary for each role. The default salary applies to
          any role not listed below.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_180px_40px] gap-3 text-sm font-medium text-muted-foreground">
            <span>Role</span>
            <span>Monthly salary</span>
            <span className="sr-only">Actions</span>
          </div>

          {roles.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[1fr_180px_40px] items-center gap-3"
            >
              <Input
                placeholder="e.g. lead engineer"
                value={r.role}
                onChange={(e) =>
                  updateRole(r.id, { role: e.target.value })
                }
              />

              <Input
                type="number"
                min={0}
                value={r.salary}
                onChange={(e) =>
                  updateRole(r.id, { salary: e.target.value })
                }
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRole(r.id)}
                aria-label="Remove role"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addRole}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add role
          </Button>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label htmlFor="default-salary">Default salary</Label>

          <Input
            id="default-salary"
            type="number"
            min={0}
            value={defaultSalary}
            onChange={(e) => setDefaultSalary(e.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            Applied to employees whose role isn't configured above.
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save configuration
        </Button>
      </CardContent>
    </Card>
  );
}