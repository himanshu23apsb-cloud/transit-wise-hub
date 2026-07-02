import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Package, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Freightly" },
      { name: "description", content: "Book, track, and manage shipments with a modern logistics platform." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-[color:var(--success)]/5">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo tagline />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/auth/login">Sign in</Link></Button>
          <Button asChild><Link to="/auth/register">Get started</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
              Live tracking · 30+ vehicles · 200+ shipments
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Ship anywhere,<br />track everything.
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              A modern logistics platform for customers, drivers, and administrators — book shipments, monitor fleets, and manage deliveries in real time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/auth/register">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth/login">I already have an account</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { k: "99.4%", v: "on-time" },
                { k: "12k+", v: "shipments" },
                { k: "4.8★", v: "rating" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border bg-card p-4">
                  <div className="text-2xl font-bold">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, title: "Real-time fleet", desc: "See every vehicle on a live map." },
                { icon: Package, title: "One-tap booking", desc: "Book a shipment in under a minute." },
                { icon: MapPin, title: "Route optimization", desc: "Auto-assign the closest driver." },
                { icon: ShieldCheck, title: "Secure payments", desc: "Card, UPI, and cash-on-delivery." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border bg-card p-5 soft-shadow transition-all hover:-translate-y-1">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 font-semibold">{f.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}