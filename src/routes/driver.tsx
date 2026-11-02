import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Package, CheckCircle2, Star, Wallet, Navigation } from "lucide-react";
import { LiveFleetMap } from "@/components/map/live-fleet-map";
import { KpiCard } from "@/components/common/kpi-card";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/mock/auth";
import { useData } from "@/lib/mock/store";

export const Route = createFileRoute("/driver")({
  head: () => ({ meta: [{ title: "Driver dashboard — SwiftShip" }] }),
  component: DriverDashboard,
});

function DriverDashboard() {
  const navigate = useNavigate();
  const session = useAuth((s) => s.session);
  const login = useAuth((s) => s.login);
  const shipments = useData((s) => s.shipments);
  const drivers = useData((s) => s.drivers);

  useEffect(() => {
    if (!session) login("driver@swiftship.com", "demo", "driver");
  }, [session, login]);

  // Pick a driver that actually has shipments assigned.
  const driver = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of shipments) if (s.driverId) counts.set(s.driverId, (counts.get(s.driverId) ?? 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    return drivers.find((d) => d.id === top) ?? drivers[0]!;
  }, [shipments, drivers]);

  const mine = useMemo(() => shipments.filter((s) => s.driverId === driver.id), [shipments, driver.id]);
  const active = mine.filter((s) => ["assigned", "picked_up", "in_transit", "near_destination"].includes(s.status));
  const delivered = mine.filter((s) => s.status === "delivered");

  return (
    <div className="min-h-screen mesh-bg">
      <DashHeader
        role="driver"
        name={session?.name ?? driver.name}
        onSignOut={() => {
          useAuth.getState().logout();
          navigate({ to: "/welcome" });
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <PageHeader
          title={`Ready to roll, ${(session?.name ?? driver.name).split(" ")[0]} 🚚`}
          description={`${driver.city} · License ${driver.license} · ${driver.experience} yrs experience`}
          actions={
            <Button variant="outline"><Navigation className="mr-1 h-4 w-4" /> Go online</Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Active jobs" value={active.length} icon={Package} tone="primary" />
          <KpiCard label="Deliveries" value={delivered.length} icon={CheckCircle2} tone="success" />
          <KpiCard label="Rating" value={driver.rating} suffix=" ★" icon={Star} tone="warning" />
          <KpiCard label="Earnings" value={driver.earnings} prefix="₹" icon={Wallet} tone="primary" />
        </div>

        <div className="mt-8">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">My routes</h2>
            <p className="text-sm text-muted-foreground">Your assigned shipments with live navigation and status advance.</p>
          </div>
          <LiveFleetMap shipments={mine} title="Assigned to me" height={560} />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Job queue</h2>
          <div className="rounded-2xl border bg-card soft-shadow">
            {active.slice(0, 8).map((s, i) => (
              <div key={s.id} className={"flex items-center justify-between p-4 " + (i > 0 ? "border-t" : "")}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="mt-1 text-sm font-semibold">{s.pickup.city} → {s.delivery.city}</div>
                  <div className="text-xs text-muted-foreground">{s.distanceKm} km · {s.package.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">₹{s.cost.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.priority.replace("_", " ")}</div>
                </div>
              </div>
            ))}
            {active.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No active jobs.</div>}
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
          <Link to="/driver" activeProps={{ className: "bg-muted text-foreground" }} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Dashboard</Link>
          <Link to="/admin" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Admin view</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{name}</span>
          <Button variant="outline" size="sm" onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
    </header>
  );
}