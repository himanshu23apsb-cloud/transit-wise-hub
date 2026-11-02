import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Package, CheckCircle2, Clock, Wallet, Plus, ArrowRight } from "lucide-react";
import { LiveFleetMap } from "@/components/map/live-fleet-map";
import { KpiCard } from "@/components/common/kpi-card";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/mock/auth";
import { useData } from "@/lib/mock/store";

export const Route = createFileRoute("/customer")({
  head: () => ({ meta: [{ title: "Customer dashboard — SwiftShip" }] }),
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const navigate = useNavigate();
  const session = useAuth((s) => s.session);
  const login = useAuth((s) => s.login);
  const shipments = useData((s) => s.shipments);
  const customers = useData((s) => s.customers);

  useEffect(() => {
    if (!session) login("customer@swiftship.com", "demo", "customer");
  }, [session, login]);

  // Demo: bind current session to the first seeded customer so there are shipments.
  const customer = customers[0]!;
  const mine = useMemo(
    () => shipments.filter((s) => s.customerId === customer.id),
    [shipments, customer.id],
  );

  const active = mine.filter((s) => !["delivered", "cancelled"].includes(s.status));
  const delivered = mine.filter((s) => s.status === "delivered");
  const spent = mine.reduce((sum, s) => sum + (s.paymentStatus === "paid" ? s.cost : 0), 0);

  return (
    <div className="min-h-screen mesh-bg">
      <DashHeader
        role="customer"
        name={session?.name ?? customer.name}
        onSignOut={() => {
          useAuth.getState().logout();
          navigate({ to: "/welcome" });
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <PageHeader
          title={`Hi ${(session?.name ?? customer.name).split(" ")[0]} 👋`}
          description="Track your shipments live, review deliveries, and book new ones."
          actions={
            <Button className="bg-gradient-to-r from-primary to-[color:var(--success)] text-white border-0">
              <Plus className="mr-1 h-4 w-4" /> New shipment
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Active" value={active.length} icon={Package} tone="primary" />
          <KpiCard label="Delivered" value={delivered.length} icon={CheckCircle2} tone="success" />
          <KpiCard label="In transit" value={mine.filter((s) => s.status === "in_transit").length} icon={Clock} tone="warning" />
          <KpiCard label="Total spent" value={spent} prefix="₹" icon={Wallet} tone="primary" />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Live tracking</h2>
              <p className="text-sm text-muted-foreground">Your active shipments on the map, updating in real time.</p>
            </div>
          </div>
          <LiveFleetMap shipments={mine} title="My shipments" height={520} />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Recent orders</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {mine.slice(0, 6).map((s) => (
              <div key={s.id} className="rounded-2xl border bg-card p-4 soft-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-2 text-sm font-semibold">
                  {s.pickup.city} <ArrowRight className="inline h-3 w-3 text-muted-foreground" /> {s.delivery.city}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.package.name} · {s.package.weight} kg</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold">₹{s.cost.toLocaleString()}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.priority.replace("_", " ")}</span>
                </div>
              </div>
            ))}
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
        <Link to="/welcome" className="text-lg font-black tracking-tight">SwiftShip Logistics</Link>
        <span className="ml-2 rounded-full border bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{role}</span>
        <nav className="ml-6 hidden gap-1 md:flex">
          <Link to="/customer" activeProps={{ className: "bg-muted text-foreground" }} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Dashboard</Link>
          <Link to="/driver" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Driver view</Link>
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