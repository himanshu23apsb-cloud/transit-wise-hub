import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/lib/mock/seed";

const flow: { key: ShipmentStatus; label: string }[] = [
  { key: "booked", label: "Booked" },
  { key: "assigned", label: "Driver Assigned" },
  { key: "picked_up", label: "Picked Up" },
  { key: "in_transit", label: "In Transit" },
  { key: "near_destination", label: "Near Destination" },
  { key: "delivered", label: "Delivered" },
];

export function ShipmentTimeline({ current }: { current: ShipmentStatus }) {
  const idx = flow.findIndex((s) => s.key === current);
  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute left-2 top-1 h-full w-0.5 bg-border" aria-hidden />
      {flow.map((step, i) => {
        const done = i <= idx;
        const active = i === idx;
        return (
          <li key={step.key} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 bg-background",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                active && "ring-4 ring-primary/20",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
            </span>
            <div className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</div>
            <div className="text-xs text-muted-foreground">
              {done ? (active ? "In progress" : "Completed") : "Pending"}
            </div>
          </li>
        );
      })}
    </ol>
  );
}