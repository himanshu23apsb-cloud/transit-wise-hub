import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, Palette, User, Shield } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/mock/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SwiftShip Logistics" }] }),
  component: Settings,
});

function Settings() {
  const session = useAuth((s) => s.session);
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  const toggleDark = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("swiftship-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  const prefs = [
    { icon: Bell, label: "Shipment notifications", desc: "Status updates for every movement", defaultChecked: true },
    { icon: Shield, label: "Two-factor sign-in", desc: "Extra security for your account", defaultChecked: false },
    { icon: User, label: "Public profile", desc: "Show your name to carriers", defaultChecked: true },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      <header className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <PageHeader
          title="Settings"
          description="Preferences for your SwiftShip Logistics account."
        />
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border bg-card p-5 soft-shadow">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3">
              <div>
                <Label className="text-sm">Dark mode</Label>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5 soft-shadow">
            <div className="text-sm font-semibold">Notifications & security</div>
            <div className="mt-4 space-y-3">
              {prefs.map((p) => (
                <div key={p.label} className="flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <p.icon className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <Label className="text-sm">{p.label}</Label>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={p.defaultChecked} />
                </div>
              ))}
            </div>
          </div>
          {session ? (
            <p className="text-center text-xs text-muted-foreground">Signed in as {session.email}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
