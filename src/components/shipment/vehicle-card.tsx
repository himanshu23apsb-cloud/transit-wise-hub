import { Bike, Car, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VehicleType } from "@/lib/mock/seed";

export interface VehicleOption {
  type: VehicleType;
  capacity: string;
  eta: string;
  price: number;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { type: "Motorcycle", capacity: "up to 20 kg", eta: "1–2 hrs", price: 250 },
  { type: "Car", capacity: "up to 200 kg", eta: "2–4 hrs", price: 650 },
  { type: "Mini Van", capacity: "up to 500 kg", eta: "3–5 hrs", price: 1200 },
  { type: "Van", capacity: "up to 1.2 t", eta: "4–8 hrs", price: 2400 },
  { type: "Truck", capacity: "up to 5 t", eta: "6–12 hrs", price: 5500 },
  { type: "Heavy Truck", capacity: "up to 15 t", eta: "12–24 hrs", price: 12500 },
];

function icon(type: VehicleType) {
  if (type === "Motorcycle") return Bike;
  if (type === "Car") return Car;
  return Truck;
}

export function VehicleCard({
  option,
  selected,
  onClick,
}: {
  option: VehicleOption;
  selected?: boolean;
  onClick?: () => void;
}) {
  const Icon = icon(option.type);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
        selected && "border-primary ring-2 ring-primary/20 bg-primary/5",
      )}
    >
      <div className={cn("grid h-14 w-14 place-items-center rounded-xl bg-muted transition-colors", selected && "bg-primary text-primary-foreground")}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{option.type}</div>
        <div className="text-xs text-muted-foreground">{option.capacity} · {option.eta}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-muted-foreground">From</div>
        <div className="font-semibold">₹{option.price.toLocaleString()}</div>
      </div>
    </button>
  );
}