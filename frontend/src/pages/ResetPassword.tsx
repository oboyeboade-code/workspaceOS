import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const side = (params.get("side") === "employer" ? "employer" : "employee") as "employer" | "employee";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const copy = useMemo(
    () =>
      side === "employer"
        ? {
            kicker: "Employer portal",
            title: "Choose a new password.",
            subtitle: "Set a strong password to secure your employer account.",
            backTo: "/employer-login",
          }
        : {
            kicker: "Employee portal",
            title: "Set your new password.",
            subtitle: "Pick something only you would know — at least 8 characters.",
            backTo: "/login",
          },
    [side]
  );

  const tokenMissing = !token;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const res = await api.resetPassword(token, password, side);
    setLoading(false);
    if (res.ok) {
      toast.success(res.message);
      nav(copy.backTo);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <AuthShell side={side} kicker={copy.kicker} title={copy.title} subtitle={copy.subtitle}>
      {tokenMissing ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm">
            <p className="font-semibold text-destructive">Reset link missing or invalid</p>
            <p className="mt-1 text-muted-foreground">
              Open the link from your email exactly as it was sent, or request a new one.
            </p>
          </div>
          <Link
            to={`/forgot-password${side === "employer" ? "?side=employer" : ""}`}
            className="inline-flex font-semibold text-accent hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-base hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="h-12"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
          <div className="mt-7 text-sm text-muted-foreground">
            <Link to={copy.backTo} className="font-semibold text-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}

export default ResetPassword