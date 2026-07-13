import { useEffect, useRef, useState } from "react";
import { Briefcase, UserRound, X, LogIn } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  disabled?: boolean;
  onEmployer?: () => void;
  onEmployee?: () => void;
};

export const GuestLoginFab = ({ disabled, onEmployer, onEmployee }: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        ref={containerRef}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-end px-4 sm:px-0"
      >
        {/* Expanded Cards Container - Responsive */}
        <div
          className={[
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 overflow-hidden rounded-2xl sm:rounded-full",
            "border border-white/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]",
            "bg-white/30 backdrop-blur-xl backdrop-saturate-150",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "opacity-100 visible sm:w-auto w-full sm:pl-2 sm:pr-16"
              : "opacity-0 invisible sm:visible sm:w-0 sm:pl-0 sm:pr-16 pointer-events-none sm:pointer-events-auto",
          ].join(" ")}
          style={{
            height: open ? "auto" : "0",
            minHeight: open ? "auto" : "0",
            paddingTop: open ? "0.5rem" : "0",
            paddingBottom: open ? "0.5rem" : "0",
          }}
        >
          <div
            className={[
              "flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-2 transition-all duration-300",
              open
                ? "translate-y-0 sm:translate-x-0 opacity-100 delay-150"
                : "-translate-y-2 sm:-translate-x-4 opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onEmployer?.();
              }}
              className="flex flex-1 items-center justify-center sm:justify-start gap-2 rounded-lg sm:rounded-full border border-white/50 bg-white/40 px-4 py-3 sm:px-3 sm:py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-white/70 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="truncate">Employer</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onEmployee?.();
              }}
              className="flex flex-1 items-center justify-center sm:justify-start gap-2 rounded-lg sm:rounded-full border border-white/50 bg-white/40 px-4 py-3 sm:px-3 sm:py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-white/70 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <UserRound className="h-4 w-4 shrink-0" />
              <span className="truncate">Employee</span>
            </button>
          </div>
        </div>

        {/* FAB Button - Always Visible */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={open ? "Close demo login" : "Demo login"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              disabled={disabled}
              className={[
                "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full",
                "border border-white/50 bg-white/40 backdrop-blur-xl backdrop-saturate-150",
                "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] transition-transform duration-300",
                "hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:absolute sm:right-0 flex-shrink-0",
              ].join(" ")}
            >
              {!open && !disabled && (
                <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-primary/20" />
              )}
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-inner">
                {open ? <X className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p className="text-xs">Demo login — skip registration</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default GuestLoginFab;
