import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
    

export function PortalShell({ kind, children }: { kind: "employer" | "employee"; children: ReactNode }) {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const onLogout = async () => {
    await api.logout();
    toast.success("Signed out");
    queryClient.clear();
    nav(kind === "employer" ? "/employer-login" : "/login");
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container-app flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="hidden text-sm font-medium text-muted-foreground sm:block">
              {kind === "employer" ? "Employer console" : "Employee portal"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {kind === "employer" && (
              <Link to="/employer"><Button variant="ghost" size="sm">Workers</Button></Link>
            )}
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
