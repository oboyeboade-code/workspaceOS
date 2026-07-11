import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center w-24 ${className}`}>
      <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
        Workspace<span className="text-accent">OS</span>
      </span>
    </Link>
  );
}