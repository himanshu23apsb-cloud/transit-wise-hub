import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shipment, ShipmentStatus } from "@/lib/mock/seed";

const FLOW: { key: ShipmentStatus; label: string }[] = [
  { key: "booked", label: "Booked" },
  { key: "assigned", label: "Driver assigned" },
  { key: "picked_up", label: "Picked up" },
  { key: "in_transit", label: "In transit" },
  { key: "near_destination", label: "Near destination" },
  { key: "delivered", label: "Delivered" },
];

export function ShipmentTimeline({ shipment }: { shipment: Shipment }) {
  const currentIdx = FLOW.findIndex((s) => s.key === shipment.status);
  return (
    <ol className="space-y-4">
      {FLOW.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const at = shipment.timeline.find((t) => t.status === step.key)?.at;
        return (
          <li key={step.key} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border-2 transition-colors",
                  done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 bg-background",
                  active && "ring-4 ring-primary/20",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
              </div>
              {i < FLOW.length - 1 ? (
                <div className={cn("mt-1 h-8 w-0.5", i < currentIdx ? "bg-primary" : "bg-muted-foreground/20")} />
              ) : null}
            </div>
            <div className="flex-1 pb-4">
              <div className={cn("text-sm font-medium", done ? "" : "text-muted-foreground")}>{step.label}</div>
              {at ? <div className="text-xs text-muted-foreground">{new Date(at).toLocaleString()}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}