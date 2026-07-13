import { useEffect, useRef, useState, useCallback } from "react";
import { Briefcase, UserRound, X, LogIn } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GuestLoginFabProps {
  disabled?: boolean;
  onEmployer?: () => void;
  onEmployee?: () => void;
}

/**
 * GuestLoginFab Component - Fully Responsive & Standardized
 * 
 * Responsiveness Strategy:
 * - Desktop (sm+): Expands horizontally to the left of the FAB.
 * - Mobile (<sm): Expands vertically ABOVE the FAB to avoid horizontal overflow and finger obstruction.
 */
export const GuestLoginFab = ({ 
  disabled = false, 
  onEmployer, 
  onEmployee 
}: GuestLoginFabProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleClose]);

  const handleAction = (callback?: () => void) => {
    handleClose();
    callback?.();
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        ref={containerRef}
        className={cn(
          "fixed z-50 flex flex-col sm:flex-row items-end sm:items-center justify-end transition-all duration-300",
          "bottom-4 right-4 sm:bottom-8 sm:right-8"
        )}
        role="region"
        aria-label="Demo login options"
      >
        {/* Options Panel - Adaptive Layout */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden",
            "border border-white/40 shadow-2xl",
            "bg-white/30 backdrop-blur-xl backdrop-saturate-150",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            // Layout & Shape
            "rounded-[24px] sm:rounded-full mb-3 sm:mb-0",
            // Animation States
            isOpen 
              ? "opacity-100 translate-y-0 sm:translate-x-0 scale-100 sm:w-auto w-48 p-1.5 sm:pr-20" 
              : "opacity-0 translate-y-10 sm:translate-y-0 sm:translate-x-10 scale-95 w-0 h-0 sm:h-auto pointer-events-none"
          )}
        >
          <div className={cn(
            "flex flex-col sm:flex-row w-full gap-1.5 transition-all duration-300",
            isOpen ? "opacity-100 delay-200" : "opacity-0"
          )}>
            <DemoLoginButton
              icon={<Briefcase className="h-4 w-4" />}
              label="Employer"
              onClick={() => handleAction(onEmployer)}
              disabled={disabled}
            />
            <DemoLoginButton
              icon={<UserRound className="h-4 w-4" />}
              label="Employee"
              onClick={() => handleAction(onEmployee)}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Main Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={isOpen ? "Close demo login menu" : "Open demo login menu"}
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setIsOpen((prev) => !prev)}
              disabled={disabled}
              className={cn(
                "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full",
                "border border-white/50 bg-white/40 backdrop-blur-xl backdrop-saturate-150",
                "shadow-xl transition-all duration-300",
                "hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:absolute sm:right-0 z-10"
              )}
            >
              {!isOpen && !disabled && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              )}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                {isOpen ? <X className="h-5 w-5 transition-transform duration-300 rotate-0" /> : <LogIn className="h-5 w-5" />}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="hidden sm:block bg-popover text-popover-foreground border-none shadow-md">
            <p className="text-xs font-medium">Quick Demo Login</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

interface DemoLoginButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}

const DemoLoginButton = ({ icon, label, onClick, disabled }: DemoLoginButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "group flex items-center gap-3 px-4 py-3 sm:py-2",
      "rounded-[18px] sm:rounded-full border border-white/50 bg-white/50",
      "text-sm font-semibold text-foreground/90",
      "transition-all duration-200 hover:bg-white/80 active:scale-[0.97]",
      "disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    )}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-primary shadow-sm group-hover:scale-110 transition-transform duration-200">
      {icon}
    </span>
    <span className="flex-1 text-left">{label}</span>
  </button>
);

export default GuestLoginFab;
