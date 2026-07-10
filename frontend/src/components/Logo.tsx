import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
        Workspace<span className="text-accent">OS</span>
      </span>
    </Link>
  );
}