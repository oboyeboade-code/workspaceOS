import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { DialogFooter } from "@/components/ui/dialog";

interface RoleSalary {
  id: string;
  role: string;
  salary: string;
}

interface PayrollSettingsProps {
  roleSalaries?: Record<string, number>;
  mutate?: () => void;
  onClose?: () => void;
}

export const PayrollSettings = ({
  roleSalaries,
  mutate,
  onClose,
}: PayrollSettingsProps) => {
  const [roles, setRoles] = useState<RoleSalary[]>([]);
  const [defaultSalary, setDefaultSalary] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!roleSalaries) return;

    const mapped: RoleSalary[] = Object.entries(roleSalaries)
     .filter(([key]) => key!== "default")
     .map(([role, salary]) => ({
        id: crypto.randomUUID(),
        role,
        salary: String(salary),
      }));

    setRoles(mapped);
    setDefaultSalary(String(roleSalaries.default?? ""));
  }, [roleSalaries]);

  const updateRole = (id: string, patch: Partial<RoleSalary>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id? {...r,...patch } : r))
    );
  };

  const addRole = () => {
    setRoles((prev) => [
     ...prev,
      { id: crypto.randomUUID(), role: "", salary: "" },
    ]);
  };

  const removeRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id!== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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
        onClose?.();
      } else {
        toast.error(res.message || "Failed to save payroll configuration");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-3">
        <div className="hidden gap-3 text-sm font-medium text-muted-foreground sm:grid sm:grid-cols-[1fr_160px_40px]">
          <span>Role</span>
          <span>Monthly salary</span>
          <span className="sr-only">Actions</span>
        </div>

        {roles.map((r) => (
          <div
            key={r.id}
            className="grid gap-3 sm:grid-cols-[1fr_160px_40px] sm:items-center"
          >
            <div className="space-y-1 sm:space-y-0">
              <Label className="text-xs text-muted-foreground sm:hidden">
                Role
              </Label>
              <Input
                placeholder="e.g. lead engineer"
                value={r.role}
                onChange={(e) =>
                  updateRole(r.id, { role: e.target.value })
                }
              />
            </div>

            <div className="space-y-1 sm:space-y-0">
              <Label className="text-xs text-muted-foreground sm:hidden">
                Monthly salary
              </Label>
              <Input
                type="number"
                min={0}
                value={r.salary}
                onChange={(e) =>
                  updateRole(r.id, { salary: e.target.value })
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRole(r.id)}
              aria-label="Remove role"
              className="justify-self-end sm:justify-self-center"
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

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};