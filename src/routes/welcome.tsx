import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Package, ShieldCheck, Truck, Zap, BarChart3, Route as RouteIcon, Star, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — SwiftShip" },
      { name: "description", content: "Book, track, and manage shipments with a modern logistics platform." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden mesh-bg">
      {/* Animated aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/30 blur-3xl animate-aurora" />
        <div className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-[color:var(--success)]/25 blur-3xl animate-drift" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl animate-float-slow" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-60" />

      {/* Nav */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border glass px-4 py-3 sm:px-6">
          <Logo tagline />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link to="/auth/login">Sign in</Link></Button>
            <Button asChild className="bg-gradient-to-r from-primary to-[color:var(--success)] text-white hover:opacity-90 border-0">
              <Link to="/auth/register">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* HERO */}
        <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-gradient font-semibold">New</span>
              <span className="text-muted-foreground">Live fleet tracking with AI routing</span>
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
              Ship anywhere,
              <br />
              <span className="text-gradient animate-gradient-pan">track everything.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              A modern logistics platform for customers, drivers, and administrators — book shipments, monitor fleets, and manage deliveries in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="group relative overflow-hidden bg-gradient-to-r from-primary to-[color:var(--success)] text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all border-0">
                <Link to="/auth/register">
                  Start free
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="backdrop-blur bg-card/50">
                <Link to="/auth/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/adventurer/svg?seed=SwiftShip${i}`} alt="" className="h-9 w-9 rounded-full border-2 border-background bg-muted" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-[color:var(--warning)] text-[color:var(--warning)]" />)}
                  <span className="ml-1 font-semibold">4.8</span>
                </div>
                <div className="text-xs text-muted-foreground">from 12,000+ shippers</div>
              </div>
            </div>
          </div>

          {/* Hero visual: floating tracking card */}
          <div className="relative animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-[color:var(--success)]/30 blur-2xl" />
            <div className="relative rounded-3xl border glass p-6 soft-shadow animate-float">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] animate-pulse-ring" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--success)]" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Live</span>
                </div>
                <div className="text-xs text-muted-foreground">FR-2081-DL</div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-muted-foreground">FROM</div>
                  <div className="font-semibold">Mumbai</div>
                </div>
                <div className="relative flex-1 mx-3 h-1 rounded-full bg-muted overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-gradient-to-r from-primary to-[color:var(--success)]" />
                  <div className="absolute -top-1.5 left-[58%] h-4 w-4 rounded-full border-2 border-background bg-primary shadow" />
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted-foreground">TO</div>
                  <div className="font-semibold">Bengaluru</div>
                </div>
              </div>
              {/* mini map */}
              <div className="relative mt-4 h-44 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-[color:var(--success)]/10">
                <div className="absolute inset-0 grid-bg opacity-70" />
                <svg viewBox="0 0 400 180" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="rt" x1="0" x2="1">
                      <stop offset="0" stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--success)" />
                    </linearGradient>
                  </defs>
                  <path d="M 30 140 C 120 40, 220 180, 370 40" stroke="url(#rt)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
                  <circle cx="30" cy="140" r="6" fill="var(--primary)" />
                  <circle cx="370" cy="40" r="6" fill="var(--success)" />
                </svg>
                <div className="absolute left-[58%] top-[38%] -translate-x-1/2 -translate-y-1/2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-[color:var(--success)] text-white shadow-lg glow-primary">
                    <Truck className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-muted/60 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">ETA</div>
                  <div className="text-sm font-bold">4h 12m</div>
                </div>
                <div className="rounded-xl bg-muted/60 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">Distance</div>
                  <div className="text-sm font-bold">986 km</div>
                </div>
                <div className="rounded-xl bg-muted/60 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">Progress</div>
                  <div className="text-sm font-bold text-[color:var(--success)]">58%</div>
                </div>
              </div>
            </div>
            {/* floating badges */}
            <div className="absolute -left-6 top-16 rounded-2xl border glass px-3 py-2 text-xs soft-shadow animate-float-slow">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />
                <span className="font-semibold">Delivered</span>
              </div>
              <div className="text-muted-foreground">FR-1044 · 12 min ago</div>
            </div>
            <div className="absolute -right-4 bottom-8 rounded-2xl border glass px-3 py-2 text-xs soft-shadow animate-float">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[color:var(--warning)]" />
                <span className="font-semibold">AI routed</span>
              </div>
              <div className="text-muted-foreground">Saved 18 km · ₹240</div>
            </div>
          </div>
        </section>

        {/* Logo marquee */}
        <section className="py-4">
          <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams shipping across India</div>
          <div className="relative mt-6 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex w-max animate-marquee gap-12 py-2">
              {[...Array(2)].flatMap((_, k) =>
                ["Kirana Co.", "Vega Retail", "Nimbus Foods", "Atlas Textiles", "Solvex Chem", "Hexa Motors", "Bloom & Co", "Perch Studios"].map((n, i) => (
                  <div key={`${k}-${i}`} className="text-2xl font-black text-muted-foreground/50 whitespace-nowrap">{n}</div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Platform
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">One platform. <span className="text-gradient">Every role.</span></h2>
            <p className="mt-3 text-muted-foreground">Customers, drivers, and administrators — each get a purpose-built experience.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            {/* big card */}
            <div className="group relative overflow-hidden rounded-3xl border p-6 md:col-span-4 md:row-span-2 bg-gradient-to-br from-primary/10 via-card to-[color:var(--success)]/10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-[color:var(--success)] text-white glow-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-2xl font-bold">Live fleet map</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">Every truck, every route, every stop — on a beautiful real-time map with smooth animated markers.</p>
                <div className="mt-6 relative h-52 overflow-hidden rounded-2xl border bg-background/60">
                  <div className="absolute inset-0 grid-bg opacity-70" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <div className="absolute top-1/2 -translate-y-1/2 animate-truck">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-[color:var(--success)] text-white shadow-xl">
                      <Truck className="h-5 w-5" />
                    </div>
                  </div>
                  {[
                    { l: "20%", t: "30%" }, { l: "60%", t: "25%" }, { l: "80%", t: "70%" }, { l: "35%", t: "75%" },
                  ].map((p, i) => (
                    <div key={i} className="absolute h-2.5 w-2.5 rounded-full bg-primary" style={{ left: p.l, top: p.t }}>
                      <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <FeatureCard icon={Package} title="One-tap booking" desc="Book a shipment in under a minute with smart quotes." accent="primary" />
            <FeatureCard icon={RouteIcon} title="AI routing" desc="Auto-assign the closest driver and best route." accent="success" />
            <FeatureCard icon={BarChart3} title="Analytics" desc="Revenue, on-time %, and fleet utilization at a glance." accent="warning" />
            <FeatureCard icon={ShieldCheck} title="Secure payments" desc="Card, UPI, and COD — with encrypted receipts." accent="primary" />
          </div>
        </section>

        {/* Roles */}
        <section id="how" className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Made for <span className="text-gradient">every role</span></h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: "Customer", desc: "Book, pay, and track deliveries.", accent: "from-primary to-primary/60", icon: Package, points: ["Instant quotes", "Live tracking", "Delivery proof"] },
              { title: "Driver", desc: "Pick up jobs and log progress.", accent: "from-[color:var(--success)] to-[color:var(--success)]/60", icon: Truck, points: ["Route guidance", "One-tap status", "Earnings ledger"] },
              { title: "Admin", desc: "Orchestrate the entire fleet.", accent: "from-[color:var(--warning)] to-[color:var(--warning)]/60", icon: BarChart3, points: ["Live dispatch", "Full analytics", "Driver assignment"] },
            ].map((r) => (
              <div key={r.title} className="group relative overflow-hidden rounded-3xl border bg-card p-6 soft-shadow transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${r.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
                <div className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${r.accent} text-white`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="py-16">
          <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-primary via-primary/90 to-[color:var(--success)] p-10 text-primary-foreground soft-shadow">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-drift" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-black/20 blur-3xl animate-aurora" />
            <div className="relative grid gap-8 sm:grid-cols-4">
              {[
                { k: "99.4%", v: "on-time delivery" },
                { k: "12k+", v: "shipments monthly" },
                { k: "4.8★", v: "customer rating" },
                { k: "24/7", v: "live dispatch" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-4xl font-black tracking-tight sm:text-5xl">{s.k}</div>
                  <div className="mt-1 text-sm text-white/80">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Loved by <span className="text-gradient">shippers</span></h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "Priya S.", r: "Ops Lead, Vega Retail", q: "We cut dispatch time by 40%. The live map alone paid for itself." },
              { n: "Rahul K.", r: "Founder, Nimbus Foods", q: "Booking a shipment now takes 30 seconds. Our drivers love the app." },
              { n: "Anita D.", r: "Fleet Manager", q: "The admin analytics are gorgeous — I finally know where every rupee goes." },
            ].map((t, i) => (
              <div key={t.n} className="rounded-3xl border bg-card p-6 soft-shadow">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[color:var(--warning)] text-[color:var(--warning)]" />)}
                </div>
                <p className="mt-3 text-sm">&ldquo;{t.q}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=T${i}`} alt="" className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <div className="text-sm font-semibold">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="relative overflow-hidden rounded-[2rem] border p-10 text-center soft-shadow mesh-bg">
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="relative">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Ready to ship smarter?</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">Create a free account in 30 seconds — no credit card required.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-[color:var(--success)] text-white border-0 shadow-lg shadow-primary/30">
                  <Link to="/auth/register">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/live">See live map</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo tagline />
            <div className="text-xs text-muted-foreground">© 2026 SwiftShip. Built as a demo — every pixel handcrafted.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }: { icon: any; title: string; desc: string; accent: "primary" | "success" | "warning" }) {
  const accentClass =
    accent === "primary" ? "from-primary/20 to-primary/5 text-primary" :
    accent === "success" ? "from-[color:var(--success)]/20 to-[color:var(--success)]/5 text-[color:var(--success)]" :
    "from-[color:var(--warning)]/20 to-[color:var(--warning)]/5 text-[color:var(--warning)]";
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-card p-5 md:col-span-2 soft-shadow transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accentClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}