import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/lib/mock/seed";

const map: Record<ShipmentStatus, { label: string; className: string }> = {
  booked: { label: "Booked", className: "bg-muted text-foreground" },
  assigned: { label: "Assigned", className: "bg-primary/10 text-primary" },
  picked_up: { label: "Picked Up", className: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" },
  in_transit: { label: "In Transit", className: "bg-primary/10 text-primary" },
  near_destination: { label: "Near Destination", className: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" },
  delivered: { label: "Delivered", className: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

export function StatusBadge({ status, className }: { status: ShipmentStatus; className?: string }) {
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", m.className, className)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}