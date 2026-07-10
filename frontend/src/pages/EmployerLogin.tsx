import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const EmployerLogin = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.loginEmployer(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success(res.message);
      queryClient.clear();
      nav("/employer");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <AuthShell side="employer" kicker="Employer portal" title="Welcome back." subtitle="Sign in to manage your team, roles and ratings.">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password?side=employer" className="text-xs font-semibold text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
      <div className="mt-7 space-y-2 text-sm text-muted-foreground">
        <p>New here? <Link to="/employer-register" className="font-semibold text-accent hover:underline">Create employer account</Link></p>
        <p>Are you an employee? <Link to="/login" className="font-semibold text-foreground hover:underline">Use the employee portal</Link></p>
      </div>
    </AuthShell>
  );
}

export default EmployerLogin;
