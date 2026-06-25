import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { api, generatePassword } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

export default function EmployerRegister() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", adminCode: "",
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const genCode = () => update("adminCode", generatePassword(6).toUpperCase());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.registerEmployer(form);
    setLoading(false);
    if (res.ok) {
      toast.success(res.message);
      nav("/employer-login");
    } else {
      toast.error(res.errors?.[0] || res.message);
    }
  };

  return (
    <AuthShell side="employer" kicker="Get started" title="Create your employer account." subtitle="Spin up your workspace in under a minute. You can invite your team right after.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company / your name</Label>
          <Input id="name" value={form.name} onChange={e => update("name", e.target.value)} required maxLength={20} className="h-11" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={e => update("email", e.target.value)} required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (11 digits)</Label>
            <Input id="phone" value={form.phone} onChange={e => update("phone", e.target.value)} required maxLength={11} pattern="\d{11}" className="h-11" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" value={form.password} onChange={e => update("password", e.target.value)} required minLength={8} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminCode">Admin code (6 chars)</Label>
          <div className="flex gap-2">
            <Input id="adminCode" value={form.adminCode} onChange={e => update("adminCode", e.target.value.toUpperCase())} required maxLength={6} minLength={6} pattern="[A-Za-z0-9]{6}" className="h-11 font-mono uppercase tracking-widest" />
            <Button type="button" variant="outline" size="default" onClick={genCode} className="shrink-0">
              <RefreshCw className="h-4 w-4" /> Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Share this code with your employees so they (and other employers) can scope accounts to your org.</p>
        </div>

        <Button type="submit" variant="hero" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
      <p className="mt-7 text-sm text-muted-foreground">
        Already have an account? <Link to="/employer-login" className="font-semibold text-accent hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
