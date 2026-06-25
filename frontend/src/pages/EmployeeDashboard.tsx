import { useEffect, useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { api, Worker } from "@/lib/api";
import { Mail, Phone, MapPin, Calendar, Star, ShieldCheck, Briefcase } from "lucide-react";

export default function EmployeeDashboard() {
  const [me, setMe] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me().then(res => {
      if (res.ok && res.data) {
        setMe(res.data);
      } else {
        setMe(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <PortalShell kind="employee"><div className="container-app py-20"><div className="surface-card h-72 animate-shimmer" /></div></PortalShell>;
  if (!me) return <PortalShell kind="employee"><div className="container-app py-20 text-center"><p className="font-display text-2xl font-bold">We couldn't load your profile.</p></div></PortalShell>;

  const isActive = (me.status || "").toLowerCase() === "active";
  const initials = me.name.split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()).join("");
  const rating = me.wkratings;

  return (
    <PortalShell kind="employee">
      {/* Hero card */}
      <section className="container-app pt-10">
        <div className="surface-card relative overflow-hidden p-8 sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-grad font-display text-3xl font-bold text-accent-foreground shadow-emerald">
              {initials || "?"}
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Welcome back</p>
              <h1 className="mt-1 font-display text-4xl font-bold capitalize tracking-tight sm:text-5xl">{me.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip capitalize"><Briefcase className="h-3 w-3" /> {me.role}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${isActive ? "bg-accent-soft text-accent" : "bg-secondary text-muted-foreground"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-accent animate-pulse-dot" : "bg-muted-foreground"}`} />
                  {me.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app grid gap-6 py-8 lg:grid-cols-[1.5fr,1fr]">
        <div className="surface-card p-7">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Your details</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Profile</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Field icon={Mail} label="Email" value={me.email} />
            <Field icon={Phone} label="Phone" value={me.phone} mono />
            <Field icon={MapPin} label="Address" value={me.address || "Not provided"} />
            <Field icon={Calendar} label="Joined" value={me.createdAt ? new Date(me.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-7">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">This week's rating</p>
              <Star className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-3 font-display text-6xl font-bold text-gradient-emerald">{me.wkratings || "null"}</p>
            {!isNaN(rating) && (
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-emerald-grad transition-spring" style={{ width: `${Math.min(100, rating * 10)}%` }} />
              </div>
            )}
            <p className="mt-3 text-sm text-muted-foreground">Set by your employer. Updated weekly.</p>
          </div>

          <div className="surface-card p-7">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Your admin code</p>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold uppercase tracking-[0.3em]">{me.adminCode || "—"}</p>
            <p className="mt-2 text-xs text-muted-foreground">Scopes you to your employer's organization.</p>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}

function Field({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1.5 truncate text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
