import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";

export default function forgotPassword() {
  const [params] = useSearchParams();
  const side = (params.get("side") === "employer" ? "employer" : "employee") as "employer" | "employee";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const copy = useMemo(
    () =>
      side === "employer"
        ? {
            kicker: "Employer portal",
            title: "Reset your password.",
            subtitle: "Enter the email tied to your employer account and we'll send a reset link.",
            backTo: "/employer-login",
            backLabel: "Back to employer sign in",
          }
        : {
            kicker: "Employee portal",
            title: "forgot your password?",
            subtitle: "Enter your work email and we'll send a link to reset it.",
            backTo: "/login",
            backLabel: "Back to sign in",
          },
    [side]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.forgotPassword(email, side);
    setLoading(false);
    if (res.ok) {
      setSent(true);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <AuthShell side={side} kicker={copy.kicker} title={copy.title} subtitle={copy.subtitle}>
      {sent ? (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-5">
            <MailCheck className="mt-0.5 h-5 w-5 text-accent" />
            <div className="space-y-1">
              <p className="font-semibold">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a reset link. The link will expire in 30 minutes.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Didn't get it? Check spam or try again in a minute.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="self-start font-semibold text-accent hover:underline"
            >
              Use a different email
            </button>
          </div>
          <Link
            to={copy.backTo}
            className="inline-flex font-semibold text-foreground hover:underline"
          >
            {copy.backLabel}
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </Button>
          </form>
          <div className="mt-7 space-y-2 text-sm text-muted-foreground">
            <p>
              Remembered it?{" "}
              <Link to={copy.backTo} className="font-semibold text-accent hover:underline">
                {copy.backLabel}
              </Link>
            </p>
            {side === "employee" ? (
              <p>
                Are you an employer?{" "}
                <Link to="/forgot-password?side=employer" className="font-semibold text-foreground hover:underline">
                  Reset employer password
                </Link>
              </p>
            ) : (
              <p>
                Are you an employee?{" "}
                <Link to="/forgot-password" className="font-semibold text-foreground hover:underline">
                  Reset employee password
                </Link>
              </p>
            )}
          </div>
        </>
      )}
    </AuthShell>
  );
}
