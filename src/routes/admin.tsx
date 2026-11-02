import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Package, Truck, Users, Wallet, TrendingUp } from "lucide-react";
import { LiveFleetMap } from "@/components/map/live-fleet-map";
import { KpiCard } from "@/components/common/kpi-card";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/mock/auth";
import { useData } from "@/lib/mock/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard — SwiftShip" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const session = useAuth((s) => s.session);
  const login = useAuth((s) => s.login);
  const shipments = useData((s) => s.shipments);
  const drivers = useData((s) => s.drivers);
  const vehicles = useData((s) => s.vehicles);
  const customers = useData((s) => s.customers);

  useEffect(() => {
    if (!session) login("admin@swiftship.com", "demo", "admin");
  }, [session, login]);

  const revenue = useMemo(
    () => shipments.filter((s) => s.paymentStatus === "paid").reduce((a, s) => a + s.cost, 0),
    [shipments],
  );
  const active = shipments.filter((s) => ["assigned", "picked_up", "in_transit", "near_destination"].includes(s.status));

  return (
    <div className="min-h-screen mesh-bg">
      <DashHeader
        role="admin"
        name={session?.name ?? "Admin"}
        onSignOut={() => {
          useAuth.getState().logout();
          navigate({ to: "/welcome" });
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <PageHeader
          title="Operations control"
          description="Fleet-wide visibility across every shipment, driver, and vehicle."
          actions={
            <Button className="bg-gradient-to-r from-primary to-[color:var(--success)] text-white border-0">
              <TrendingUp className="mr-1 h-4 w-4" /> View reports
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Shipments" value={shipments.length} icon={Package} tone="primary" />
          <KpiCard label="Active" value={active.length} icon={Package} tone="warning" />
          <KpiCard label="Drivers" value={drivers.length} icon={Users} tone="success" />
          <KpiCard label="Vehicles" value={vehicles.length} icon={Truck} tone="primary" />
          <KpiCard label="Revenue" value={revenue} prefix="₹" icon={Wallet} tone="success" />
        </div>

        <div className="mt-8">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Fleet-wide live map</h2>
            <p className="text-sm text-muted-foreground">Every in-motion shipment across the network.</p>
          </div>
          <LiveFleetMap title="All fleet" height={580} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-4 soft-shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Recent shipments</h3>
              <span className="text-xs text-muted-foreground">{shipments.length} total</span>
            </div>
            <div className="space-y-2">
              {shipments.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="mt-1 text-sm">{s.pickup.city} → {s.delivery.city}</div>
                  </div>
                  <div className="text-sm font-bold">₹{s.cost.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-4 soft-shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Top drivers</h3>
              <span className="text-xs text-muted-foreground">{customers.length} customers served</span>
            </div>
            <div className="space-y-2">
              {[...drivers].sort((a, b) => b.rating - a.rating).slice(0, 6).map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <img src={d.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.city} · {d.deliveries} deliveries</div>
                  </div>
                  <div className="text-sm font-bold">{d.rating} ★</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashHeader({ role, name, onSignOut }: { role: string; name: string; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/welcome" className="text-lg font-black tracking-tight">SwiftShip</Link>
        <span className="ml-2 rounded-full border bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{role}</span>
        <nav className="ml-6 hidden gap-1 md:flex">
          <Link to="/customer" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Customer view</Link>
          <Link to="/driver" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Driver view</Link>
          <Link to="/admin" activeProps={{ className: "bg-muted text-foreground" }} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{name}</span>
          <Button variant="outline" size="sm" onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
    </header>
  );
}