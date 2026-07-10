import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

export const AuthShell = ({ children, side, kicker, title, subtitle }: {
  children: ReactNode;
  side: "employer" | "employee";
  kicker: string;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr,1.05fr]">
      {/* Left — form */}
      <div className="flex flex-col bg-background">
        <header className="container-app flex h-16 items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-base hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md animate-float-up">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{kicker}</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">{title}</h1>
            <p className="mt-3 text-[15px] text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>

      {/* Right — visual panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(hsl(var(--accent) / 0.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-accent/30 blur-3xl" aria-hidden />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div>
            <span className="chip border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground/70">
              {side === "employer" ? "Employer Portal" : "Employee Portal"}
            </span>
          </div>
          <div className="space-y-6">
            <p className="font-display text-3xl font-semibold leading-tight text-primary-foreground/90">
              {side === "employer"
                ? "“We replaced 4 spreadsheets and 3 group chats with one dashboard.”"
                : "“My credentials, my role, my ratings — all in one place.”"}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-grad" />
              <div>
                <p className="text-sm font-semibold">{side === "employer" ? "Sade A." : "Marcus T."}</p>
                <p className="text-xs text-primary-foreground/60">{side === "employer" ? "Founder, Northwind Logistics" : "Field Operations"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
