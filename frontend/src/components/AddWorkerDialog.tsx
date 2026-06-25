import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Copy, Check, KeyRound, X, RotateCcw } from "lucide-react";
import { api, generatePassword } from "@/lib/api";
import { toast } from "sonner";

type Form = { name: string; role: string; email: string; phone: string; address: string; adminCode: string; };
const empty: Form = { name: "", role: "", email: "", phone: "", address: "", adminCode: "" };

export function AddWorkerDialog({ 
  defaultAdminCode, 
  onCreated 
}: { 
  defaultAdminCode: string; 
  onCreated: () => void 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const update = (k: keyof Form, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Auto-fill the admin code when the dialog opens
  useEffect(() => {
    if (open && defaultAdminCode && !form.adminCode) {
      update("adminCode", defaultAdminCode);
    }
  }, [open, defaultAdminCode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const password = generatePassword(8);
    const res = await api.createWorker({ ...form, status: "active", password });
    setLoading(false);
    if (res.ok) {
      setCreated({ email: form.email, password });
      setForm(empty);
      onCreated();
    } else {
      toast.error(res.errors?.[0] || res.message);
    }
  };

  const copy = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(`Email: ${created.email}\nPassword: ${created.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => { setCreated(null); setForm(empty); }, 200);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="surface-card group flex h-full min-h-[260px] flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-secondary/40 p-6 text-muted-foreground transition-spring hover:-translate-y-1 hover:border-accent hover:bg-accent-soft hover:text-accent hover:shadow-emerald"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card transition-base group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
          <Plus className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="font-display text-base font-bold text-foreground">Add a worker</p>
          <p className="text-xs">Generate credentials in seconds</p>
        </div>
      </button>

      <Dialog open={open} onOpenChange={(o) => o ? setOpen(true) : close()}>
        <DialogContent className="max-w-lg">
          {!created ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Add a worker</DialogTitle>
                <DialogDescription>We'll generate a secure password and show it once so you can share it.</DialogDescription>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Full name</Label><Input required maxLength={20} value={form.name} onChange={e => update("name", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Role</Label><Input required maxLength={50} value={form.role} onChange={e => update("role", e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={e => update("email", e.target.value)} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Phone (11 digits)</Label><Input required pattern="\d{11}" maxLength={11} value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>Admin code</Label>
                      {form.adminCode !== defaultAdminCode && (
                        <button 
                          type="button"
                          onClick={() => update("adminCode", defaultAdminCode)}
                          className="text-[10px] text-accent hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="h-2 w-2" /> Reset to mine
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        required 
                        maxLength={6} 
                        minLength={6} 
                        pattern="[A-Za-z0-9]{6}" 
                        value={form.adminCode} 
                        onChange={e => update("adminCode", e.target.value.toUpperCase())} 
                        className="font-mono uppercase tracking-widest" 
                        placeholder="REQUIRED"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => update("adminCode", "")}
                        title="Clear code"
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {form.adminCode === defaultAdminCode 
                        ? "Defaulting to your organization." 
                        : form.adminCode === "" 
                          ? "Enter the co-employer's 6-digit code."
                          : "Linking to a different organization."}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5"><Label>Address (optional)</Label><Input value={form.address} onChange={e => update("address", e.target.value)} /></div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="ghost" onClick={close} disabled={loading}>Cancel</Button>
                  <Button type="submit" variant="hero" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create worker"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <KeyRound className="h-5 w-5" />
                </div>
                <DialogTitle className="text-center font-display text-2xl">Worker created</DialogTitle>
                <DialogDescription className="text-center">Share these credentials securely. We won't show the password again.</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-border bg-secondary/50 p-5">
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">email</span><span className="truncate">{created.email}</span></div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">password</span><span className="font-bold text-accent">{created.password}</span></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={copy} className="flex-1">
                  {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy credentials</>}
                </Button>
                <Button variant="hero" onClick={close} className="flex-1">Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}