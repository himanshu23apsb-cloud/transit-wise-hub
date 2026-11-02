import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { LiveFleetMap } from "@/components/map/live-fleet-map";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live fleet tracking — SwiftShip" },
      { name: "description", content: "Watch every shipment move in real time with animated markers and live status updates." },
      { property: "og:title", content: "Live fleet tracking — SwiftShip" },
      { property: "og:description", content: "Interactive live map with animated trucks, routes, and one-tap status advancement." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  return (
    <div className="relative min-h-screen mesh-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/welcome"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
          </Button>
          <Logo />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border glass px-3 py-1.5 text-xs">
          <Radio className="h-3.5 w-3.5 text-[color:var(--success)]" />
          <span className="font-semibold">Realtime demo</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live fleet <span className="text-gradient">tracking</span>
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Interactive map with animated markers, curved routes, and live status updates. Click any shipment to focus and advance its status.
          </p>
        </div>
        <LiveFleetMap height={620} />
      </main>
    </div>
  );
}