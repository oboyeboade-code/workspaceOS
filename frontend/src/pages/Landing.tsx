import { Link } from "react-router-dom";
import { ArrowRight, Users, ShieldCheck, KeyRound, Sparkles, Building2, BadgeCheck, Workflow, LineChart, Mail, MessageCircle, Twitter, Github, Linkedin, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Loader2 } from "lucide-react"

const features = [
  { icon: Users, title: "Onboard in seconds", text: "Create employee accounts with auto-generated, copy-to-clipboard credentials. No spreadsheets, no friction." },
  { icon: ShieldCheck, title: "Admin code security", text: "Every account is bound to a 6-character admin code, so workforce data stays where it belongs." },
  { icon: Workflow, title: "Cross-org employees", text: "Manage workers who report to multiple employers — admin codes keep boundaries clean." },
  { icon: LineChart, title: "Performance ratings", text: "Track weekly ratings inline on each profile. Review history and movement at a glance." },
];

const steps = [
  { n: "01", t: "Create your employer account", d: "Register with your business email and a unique 6-character admin code." },
  { n: "02", t: "Add your team", d: "Spin up worker accounts. Credentials are generated and ready to share securely." },
  { n: "03", t: "Manage from one place", d: "Edit roles, ratings, status. Workers log in to their own portal to view details." },
];

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    // value: "support@workspaceos.app",
    value: "support@workspace.app",
    description: "We typically reply within a business day.",
    href: "mailto:noreplyworkspaceos@gmail.com",
    cta: "Send email",
  },
  {
    icon: MessageCircle,
    label: "Live chat",
    value: "Chat with the team",
    description: "Mon-Fri, 9am-6pm WAT. Real humans, no bots.",
    href: "mailto:noreplyworkspaceos@gmail.com?subject=Live%20chat%20request",
    cta: "Start a chat",
  },
  {
    icon: Twitter,
    label: "X / Twitter",
    value: "@workspaceos",
    description: "Product updates, changelog, and quick replies.",
    href: "https://twitter.com/workspaceos",
    cta: "Follow us",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "workspaceos",
    description: "Report issues, request features, peek at the roadmap.",
    href: "https://github.com/workspaceos",
    cta: "Open an issue",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="container-app relative grid items-center gap-12 py-20 lg:grid-cols-[1.1fr,1fr] lg:py-32">
          <div className="animate-float-up">
            {/* <span className="chip-accent mb-6">
              <Sparkles className="h-3.5 w-3.5" />v2 — now with cross-org admin codes
            </span> */}
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              The <span className="text-gradient-emerald">workforce OS</span> built for fast-moving employers.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Provision employee accounts, share credentials, and manage your team — all from one elegant dashboard. Designed for employers who run lean and scale fast.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/employer-register">
                <Button variant="hero" size="xl" className="group">
                  Start as an employer
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">I'm an employee</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" /> Free to start</div>
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" /> No credit card</div>
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" /> Built for teams of 1–500</div>
            </div>
          </div>

          {/* HERO MOCK */}
          <div className="relative animate-float-up" style={{ animationDelay: "120ms" }}>
            <div className="relative rounded-2xl border border-border bg-card p-3 shadow-elevated">
              <div className="flex items-center gap-1.5 px-2 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">workspace-os.app/dashboard</span>
              </div>
              <div className="rounded-xl bg-background p-5">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Workers</p>
                    <p className="font-display text-3xl font-bold">128 active</p>
                  </div>
                  <span className="chip-accent"><span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" /> Live</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Ada Lovelace", role: "Lead Engineer", r: "9.4" },
                    { name: "Kenji Watanabe", role: "Product Designer", r: "8.7" },
                    { name: "Amara Okafor", role: "Operations", r: "9.1" },
                  ].map((w, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-foreground">
                          {w.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{w.name}</p>
                          <p className="text-xs text-muted-foreground">{w.role}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-accent">{w.r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 hidden rotate-3 rounded-xl border border-border bg-card p-4 shadow-card md:block">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-accent" />
                <p className="text-xs font-semibold">Credential generated</p>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">pwd: aB3kQ9</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container-app py-24">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Everything you need</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A complete portal for both sides of the desk.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="surface-card min-w-0 group p-6 sm:p-7 transition-base hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-base group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-y border-border bg-secondary/40">
        <div className="container-app py-24">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">How it works</p>
              <h2 className="mt-2 max-w-xl font-display text-4xl font-bold tracking-tight">From signup to staffed in under a minute.</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="surface-card min-w-0 p-6 sm:p-7">
                <p className="font-mono text-sm font-semibold text-accent">{s.n}</p>
                <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="container-app py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-6 sm:p-10 lg:p-16 text-primary-foreground shadow-elevated">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Building2 className="mb-4 h-7 w-7 text-accent" />
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Run your team like a product team.</h2>
              <p className="mt-4 text-lg text-primary-foreground/70">No setup fees. No seat minimums. Onboard your first employee in the next 60 seconds.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/employer-register" className="w-full sm:w-auto"><Button variant="hero" size="xl" className="w-full sm:w-auto"><span className="max-[340px]:hidden">Create employer account</span><span className="hidden max-[340px]:inline max-[340px]:px-1.5">Employer signup</span></Button></Link>
              <Link to="/employer-login" className="w-full sm:w-auto"><Button variant="outline" size="xl" className="w-full sm:w-auto border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">I already have one</Button></Link>
            </div>
          </div>
        </div>
      </section>
      {/* CONTACT */}
      <section id="contact" className="border-t border-border bg-secondary/40">
        <div className="container-app py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr,1.4fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Get in touch</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Talk to the team <span className="text-gradient-emerald">directly</span>.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Questions, feedback, or bug reports are reviewed by the team. — pick whichever channel works for you.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Remote-first · Built from Lagos, Nigeria</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Linkedin className="h-4 w-4 text-accent" />
                <a href="https://www.linkedin.com/company/workspaceos" className="hover:text-foreground transition-base">
                  /company/workspaceos
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactChannels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="surface-card min-w-0 group flex flex-col p-5 sm:p-6 transition-base hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-base group-hover:scale-110">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-1 font-display text-lg font-bold">{c.value}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    {c.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:py-10 sm:text-left">
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-3">
            <span className="font-mono">© {new Date().getFullYear()} WorkspaceOS</span>
            <span>·</span>
            <span>Built for employers and the people they trust.</span>
          </div>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground">Employee</Link>
            <Link to="/employer-login" className="hover:text-foreground">Employer</Link>
            <Link to="/employer-register" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FullPageLoadingProps = {
  text?: string;
};

const FullPageLoading = ({ text = "Loading..." }: FullPageLoadingProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />

      {text && (
<p className="mt-4 text-sm font-medium text-foreground/80 tracking-wide relative">
  <span className="inline-flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
    {text}
  </span>
</p>
      )}
    </div>
  );
};

const Home = () => {
  const { loading } = useAuthRedirect();

  if (loading) return <FullPageLoading />;

  return (
    <div>
      <Landing />
    </div>
  );
}
export default Home