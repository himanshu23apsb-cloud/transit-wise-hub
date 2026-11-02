import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground soft-shadow">
        <Truck className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-bold tracking-tight">SwiftShip</div>
        {tagline ? <div className="text-[11px] text-muted-foreground">Smart Logistics</div> : null}
      </div>
    </div>
  );
}