import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-ink shadow-sm">
        <span className="absolute inset-0.5 rounded-md bg-emerald-grad opacity-90" />
        <span className="relative font-display text-[15px] font-bold text-accent-foreground">W</span>
      </span> */}
      <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
        Workspace<span className="text-accent">OS</span>
      </span>
    </Link>
  );
}
