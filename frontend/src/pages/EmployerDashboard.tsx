import { useMemo, useState } from "react";
import useSWR from "swr";
import { PortalShell } from "@/components/PortalShell";
import { WorkerCard } from "@/components/WorkerCard";
import { AddWorkerDialog } from "@/components/AddWorkerDialog";
import { PayrollSettingsModal } from "@/components/PayrollSettingsModal";
import { Input } from "@/components/ui/input";
import { api, ApiResponse, ListWorkersResponse } from "@/lib/api";
import { Search, Users, AlertCircle, DollarSign, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function EmployerDashboard() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);

const fetchWorkers = async (): Promise<ApiResponse<ListWorkersResponse>> => {
  const res = await api.listWorkers();

  return {
    ok: res.ok,
    message: res.message,
    data: res.data ?? undefined,
  };
};

  const { data, isLoading, error, mutate } = useSWR<
    ApiResponse<ListWorkersResponse>
  >("/employees", fetchWorkers);


  if (error) {
    return (
      <PortalShell kind="employer">
        <section className="container-app py-20">
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-border p-10 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 font-display text-xl font-semibold">Couldn't load your team</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error.message || "Something went wrong fetching employees."}
            </p>
            <button 
              onClick={() => mutate()} 
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 font-medium text-accent-foreground transition-base hover:bg-accent/90"
            >
              Try again
            </button>
          </div>
        </section>
      </PortalShell>
    );
  }

  const employer = data?.data?.employer;
  const stats = data?.data?.stats;
  const workers = data?.data?.employees || [];

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return workers;
    return workers.filter(w =>
      [w.name, w.role, w.email, w.phone, w.status].some(v =>
        (v || "").toLowerCase().includes(t)
      )
    );
  }, [q, workers]);

  const copyAdminCode = () => {
    if (!employer?.adminCode) return;
    navigator.clipboard.writeText(employer.adminCode);
    setCopied(true);
    toast.success("Admin code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PortalShell kind="employer">
      <section className="border-b border-border bg-secondary/30">
        <div className="container-app py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {employer?.name || "Workforce"}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Your team</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Manage your workforce, track payroll estimates, and onboard new staff.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PayrollSettingsModal
                roleSalaries={employer?.roleSalaries}
                mutate={mutate}
              />
              {employer?.adminCode && (
                <button 
                  onClick={copyAdminCode}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-base hover:bg-secondary"
                >
                  <span className="text-muted-foreground">Admin Code:</span>
                  <span className="font-mono font-bold text-accent">
                    {employer.adminCode}
                  </span>
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat 
              icon={Users} 
              label="Total workers" 
              value={stats?.totalEmployees?.toString() || "0"} 
            />
            <Stat 
              icon={AlertCircle} 
              label="Missing Info" 
              value={stats?.missingInfoCount?.toString() || "0"} 
              accent={Number(stats?.missingInfoCount) > 0}
            />
            <Stat 
              icon={DollarSign} 
              label="Est. Payroll" 
              value={`$${stats?.estimatedMonthlyPayroll?.toLocaleString() || "0"}`} 
              mono 
            />
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, role, email…"
              className="h-11 pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {workers.length}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface-card h-[260px] animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(w => (
              <WorkerCard key={w._id} worker={w} />
            ))}
            {/* Pass the employer's adminCode as the default */}
            <AddWorkerDialog 
              defaultAdminCode={employer?.adminCode || ""} 
              onCreated={() => mutate()} 
            />
          </div>
        )}

        {!isLoading && filtered.length === 0 && q && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg font-semibold">No workers match “{q}”</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different name, role or status.
            </p>
          </div>
        )}
      </section>
    </PortalShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
  mono,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="surface-card flex items-center gap-4 p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          accent ? "bg-red-500/10 text-red-500" : "bg-secondary text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className={`font-display text-2xl font-bold ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}