import { Worker } from "@/lib/api";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const initials = (name: string) => {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join("");
}

export const WorkerCard = ({ worker }: { worker: Worker }) => {
  const isActive = (worker.status || "").toLowerCase() === "active";
  return (
    <Link to={`/employee/${worker._id}`} className="group block">
      <div className="surface-card relative h-full overflow-hidden p-5 transition-spring hover:-translate-y-1 hover:shadow-elevated">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary font-display text-sm font-bold text-foreground">
              {initials(worker.name) || "—"}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-bold capitalize text-foreground">{worker.name}</h3>
              <p className="truncate text-xs capitalize text-muted-foreground">{worker.role}</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Email</span>
            <span className="truncate text-foreground">{worker.email}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Phone</span>
            <span className="font-mono text-foreground">{worker.phone}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Rating</span>
            <span className="font-mono font-semibold text-accent">{worker.wkratings || "—"}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
            isActive ? "bg-accent-soft text-accent" : "bg-secondary text-muted-foreground"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-accent animate-pulse-dot" : "bg-muted-foreground"}`} />
            {worker.status}
          </span>
          {worker.adminCode && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{worker.adminCode}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
