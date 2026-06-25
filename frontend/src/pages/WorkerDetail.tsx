import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PortalShell } from "@/components/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, Worker } from "@/lib/api";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// -------------------------
// SAFE UPDATE PAYLOAD TYPE
// -------------------------
type UpdateWorkerPayload = {
  name?: string;
  phone?: string;
  address?: string;
  role?: string;
  status?: "active" | "inactive" | "suspended";
  wkratings?: number;
};

// -------------------------
// HELPERS
// -------------------------
function buildWorkerForm(worker: Worker): UpdateWorkerPayload {
  return {
    name: worker.name,
    phone: worker.phone,
    address: worker.address,
    role: worker.role,
    status: worker.status,
    wkratings: worker.wkratings,
  };
}

export default function WorkerDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<UpdateWorkerPayload>({});

  // -------------------------
  // LOAD WORKER
  // -------------------------
  const load = async () => {
    setLoading(true);

    try {
      const res = await api.getWorker(id);

      if (!res.ok || !res.data) {
        toast.error(res.message || "Failed to load worker");
        setWorker(null);
        return;
      }

      setWorker(res.data);
      setForm(buildWorkerForm(res.data));
    } catch (err: any) {
      toast.error(err.message || "Failed to load worker");
      setWorker(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // -------------------------
  // SAVE EDIT
  // -------------------------
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.updateWorker(id, form);

      if (!res.ok || !res.data) {
        toast.error(res.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated");
      setWorker(res.data);
      setForm(buildWorkerForm(res.data));

      setEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // DELETE WORKER
  // -------------------------
  const remove = async () => {
    setDeleting(true);

    try {
      const res = await api.deleteWorker(id);

      if (!res.ok) {
        toast.error(res.message || "Failed to delete worker");
        return;
      }

      toast.success("Worker removed");
      setDelOpen(false);

      nav("/employer");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete worker");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------
  // LOADING UI
  // -------------------------
  if (loading) {
    return (
      <PortalShell kind="employer">
        <div className="container-app py-20">
          <div className="surface-card h-80 animate-shimmer" />
        </div>
      </PortalShell>
    );
  }

  // -------------------------
  // NOT FOUND UI
  // -------------------------
  if (!worker) {
    return (
      <PortalShell kind="employer">
        <div className="container-app py-20 text-center">
          <p className="font-display text-3xl font-bold">
            Worker not found
          </p>

          <Link to="/employer">
            <Button variant="outline" className="mt-6">
              <ArrowLeft className="h-4 w-4" />
              Back to team
            </Button>
          </Link>
        </div>
      </PortalShell>
    );
  }

  // -------------------------
  // DERIVED VALUES
  // -------------------------
  const isActive = worker.status?.toLowerCase() === "active";

  const initials = worker.name
    ?.split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <PortalShell kind="employer">
      <div className="container-app py-8">
        <Link
          to="/employer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-base hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to team
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          {/* MAIN */}
          <div className="surface-card overflow-hidden">
            <div className="relative h-32 bg-ink">
              <div className="absolute inset-0 grid-bg opacity-30" />

              <div className="absolute -bottom-12 left-7 flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-grad font-display text-3xl font-bold text-accent-foreground shadow-elevated">
                {initials || "?"}
              </div>
            </div>

            <div className="px-7 pb-7 pt-16">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-bold capitalize">
                    {worker.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="chip capitalize">
                      {worker.role}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        isActive
                          ? "bg-accent-soft text-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-accent animate-pulse-dot"
                            : "bg-muted-foreground"
                        }`}
                      />

                      {worker.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm(buildWorkerForm(worker));
                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDelOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Field
                  icon={Mail}
                  label="Email"
                  value={worker.email}
                />

                <Field
                  icon={Phone}
                  label="Phone"
                  value={worker.phone}
                  mono
                />

                <Field
                  icon={MapPin}
                  label="Address"
                  value={worker.address || "Not provided"}
                />

                <Field
                  icon={Calendar}
                  label="Joined"
                  value={
                    worker.createdAt
                      ? new Date(worker.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "—"
                  }
                />
              </div>
            </div>
          </div>

          {/* SIDE */}
          <div className="space-y-6">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Weekly rating
                </p>

                <Star className="h-4 w-4 text-accent" />
              </div>

              <p className="mt-2 font-display text-5xl font-bold text-gradient-emerald">
                {worker.wkratings ?? "null"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest performance signal from this employee.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />

                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Admin code
                </p>
              </div>

              <p className="mt-2 font-mono text-2xl font-bold uppercase tracking-[0.3em]">
                {worker.adminCode || "—"}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Scopes this worker to your organization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Edit worker
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                value={form.name || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                  }))
                }
                placeholder="Name"
              />

              <Input
                value={form.role || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value,
                  }))
                }
                placeholder="Role"
              />
            </div>

            <Input
              value={form.phone || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phone: e.target.value,
                }))
              }
              placeholder="Phone"
            />

            <Input
              value={form.address || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  address: e.target.value,
                }))
              }
              placeholder="Address"
            />

            <Input
              type="number"
              value={form.wkratings ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  wkratings:
                    e.target.value === ""
                      ? null
                      : Number(e.target.value),
                }))
              }
              placeholder="No rating yet"
              min={0}
              max={10}
              step={0.1}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove this worker?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This permanently deletes{" "}
              <span className="font-semibold capitalize">
                {worker.name}
              </span>{" "}
              from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={remove}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PortalShell>
  );
}

// -------------------------
// FIELD COMPONENT
// -------------------------
function Field({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: any;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-xs uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-1.5 truncate text-sm font-semibold ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}