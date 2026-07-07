import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { Truck, MapPin, Navigation, Package, CheckCircle2, Clock, Zap, ChevronRight, RefreshCw, Filter, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useData } from "@/lib/mock/store";
import type { Shipment, ShipmentStatus } from "@/lib/mock/seed";
import { cn } from "@/lib/utils";

/* ---------- icons ---------- */
const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative"><div style="width:22px;height:22px;border-radius:9999px;background:oklch(0.62 0.19 258);box-shadow:0 0 0 6px color-mix(in oklab, oklch(0.62 0.19 258) 25%, transparent);display:grid;place-items:center;color:white;font-weight:700;font-size:10px;border:2px solid white">P</div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:9999px;background:oklch(0.72 0.17 152);box-shadow:0 0 0 6px color-mix(in oklab, oklch(0.72 0.17 152) 25%, transparent);display:grid;place-items:center;color:white;font-weight:700;font-size:10px;border:2px solid white">D</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
function truckIcon(active: boolean, priorityColor: string) {
  const size = active ? 42 : 34;
  const ring = active
    ? `<span style="position:absolute;inset:-6px;border-radius:14px;background:${priorityColor};opacity:.35;animation:pulse-ring 2s cubic-bezier(.22,1,.36,1) infinite"></span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px">${ring}<div style="position:relative;width:${size}px;height:${size}px;border-radius:12px;background:linear-gradient(135deg,${priorityColor},color-mix(in oklab, ${priorityColor} 60%, white));box-shadow:0 8px 20px -6px rgba(0,0,0,.35), 0 0 0 2px white;display:grid;place-items:center;color:white">
      <svg xmlns="http://www.w3.org/2000/svg" width="${active ? 20 : 16}" height="${active ? 20 : 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
    </div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/* ---------- helpers ---------- */
function bezierRoute(a: [number, number], b: [number, number], steps = 60): [number, number][] {
  const midLat = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.08;
  const midLng = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.08;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * midLat + t * t * b[0];
    const lng = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * midLng + t * t * b[1];
    pts.push([lat, lng]);
  }
  return pts;
}

const statusProgress: Record<ShipmentStatus, number> = {
  booked: 0,
  assigned: 0.05,
  picked_up: 0.15,
  in_transit: 0.55,
  near_destination: 0.9,
  delivered: 1,
  cancelled: 0,
};

const flow: ShipmentStatus[] = ["booked", "assigned", "picked_up", "in_transit", "near_destination", "delivered"];
function nextStatus(s: ShipmentStatus): ShipmentStatus | null {
  const i = flow.indexOf(s);
  if (i === -1 || i === flow.length - 1) return null;
  return flow[i + 1]!;
}

function priorityColor(p: Shipment["priority"]): string {
  if (p === "same_day") return "oklch(0.65 0.22 25)";
  if (p === "express") return "oklch(0.75 0.16 65)";
  return "oklch(0.62 0.19 258)";
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, 7, { duration: 0.9 });
  }, [map, target]);
  return null;
}

function FitAll({ points }: { points: [number, number][] }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || points.length < 2) return;
    map.fitBounds(points as L.LatLngBoundsLiteral, { padding: [50, 50] });
    done.current = true;
  }, [map, points]);
  return null;
}

/* ---------- main ---------- */
export function LiveFleetMap({
  shipments: propShipments,
  height = 520,
  title = "Live fleet",
}: {
  shipments?: Shipment[];
  height?: number;
  title?: string;
}) {
  const storeShipments = useData((s) => s.shipments);
  const updateShipmentStatus = useData((s) => s.updateShipmentStatus);

  const ACTIVE_STATUSES: ShipmentStatus[] = ["assigned", "picked_up", "in_transit", "near_destination"];
  const PRIORITIES: Shipment["priority"][] = ["standard", "express", "same_day"];

  const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>(ACTIVE_STATUSES);
  const [priorityFilter, setPriorityFilter] = useState<Shipment["priority"][]>([...PRIORITIES]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const baseActive = useMemo(() => {
    const all = propShipments ?? storeShipments;
    return all.filter((s) => ACTIVE_STATUSES.includes(s.status));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propShipments, storeShipments]);

  const active = useMemo(() => {
    return baseActive
      .filter((s) => statusFilter.includes(s.status))
      .filter((s) => priorityFilter.includes(s.priority))
      .filter((s) => {
        if (!dateFrom && !dateTo) return true;
        const t = new Date(s.createdAt).getTime();
        if (dateFrom && t < dateFrom.setHours(0, 0, 0, 0)) return false;
        if (dateTo && t > new Date(dateTo).setHours(23, 59, 59, 999)) return false;
        return true;
      })
      .slice(0, 12);
  }, [baseActive, statusFilter, priorityFilter, dateFrom, dateTo]);

  const toggle = <T,>(arr: T[], setArr: (v: T[]) => void, v: T) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filterCount =
    (statusFilter.length !== ACTIVE_STATUSES.length ? 1 : 0) +
    (priorityFilter.length !== PRIORITIES.length ? 1 : 0) +
    (dateFrom || dateTo ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter(ACTIVE_STATUSES);
    setPriorityFilter([...PRIORITIES]);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const [selectedId, setSelectedId] = useState<string | null>(active[0]?.id ?? null);
  useEffect(() => {
    if (active.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !active.some((s) => s.id === selectedId)) {
      setSelectedId(active[0]!.id);
    }
  }, [active, selectedId]);

  // Per-shipment animated progress (0..1)
  const [tMap, setTMap] = useState<Record<string, number>>({});
  useEffect(() => {
    setTMap((prev) => {
      const next = { ...prev };
      for (const s of active) {
        if (next[s.id] == null) next[s.id] = statusProgress[s.status];
      }
      return next;
    });
  }, [active]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTMap((prev) => {
        const next = { ...prev };
        for (const s of active) {
          const cap = Math.min(0.98, statusProgress[s.status] + 0.35);
          const cur = next[s.id] ?? statusProgress[s.status];
          next[s.id] = cur >= cap ? statusProgress[s.status] : Math.min(cap, cur + 0.004);
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [active]);

  const routes = useMemo(() => {
    const map: Record<string, [number, number][]> = {};
    for (const s of active) {
      map[s.id] = bezierRoute([s.pickup.lat, s.pickup.lng], [s.delivery.lat, s.delivery.lng]);
    }
    return map;
  }, [active]);

  const selected = active.find((s) => s.id === selectedId) ?? null;
  const flyTarget: [number, number] | null = selected
    ? (() => {
        const r = routes[selected.id];
        if (!r) return null;
        const t = tMap[selected.id] ?? statusProgress[selected.status];
        return r[Math.floor(t * (r.length - 1))]!;
      })()
    : null;

  const allEndpoints: [number, number][] = active.flatMap((s) => [
    [s.pickup.lat, s.pickup.lng],
    [s.delivery.lat, s.delivery.lng],
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      {/* map */}
      <div className="relative overflow-hidden rounded-3xl border soft-shadow" style={{ height }}>
        {/* top overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-start justify-between p-4">
          <div className="pointer-events-auto rounded-2xl border glass px-3 py-2 text-sm shadow-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] animate-pulse-ring" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--success)]" />
              </span>
              <span className="font-semibold">{title}</span>
              <span className="text-muted-foreground">· {active.length} active</span>
            </div>
          </div>
          <div className="pointer-events-auto flex gap-2">
            <div className="rounded-2xl border glass px-3 py-2 text-xs shadow-lg flex items-center gap-3">
              <LegendDot color="oklch(0.62 0.19 258)" label="Standard" />
              <LegendDot color="oklch(0.75 0.16 65)" label="Express" />
              <LegendDot color="oklch(0.65 0.22 25)" label="Same-day" />
            </div>
          </div>
        </div>

        <MapContainer
          center={[22.5, 79]}
          zoom={5}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitAll points={allEndpoints} />
          <FlyTo target={flyTarget} />
          {active.map((s) => {
            const r = routes[s.id];
            if (!r) return null;
            const t = tMap[s.id] ?? statusProgress[s.status];
            const idx = Math.min(r.length - 1, Math.floor(t * (r.length - 1)));
            const pos = r[idx]!;
            const done = r.slice(0, idx + 1);
            const remaining = r.slice(idx);
            const isSel = s.id === selectedId;
            const color = priorityColor(s.priority);
            return (
              <span key={s.id}>
                <Polyline
                  positions={done}
                  pathOptions={{ color, weight: isSel ? 5 : 3, opacity: isSel ? 0.9 : 0.55 }}
                />
                <Polyline
                  positions={remaining}
                  pathOptions={{ color, weight: isSel ? 4 : 2.5, opacity: isSel ? 0.5 : 0.25, dashArray: "4 8" }}
                />
                <Marker position={[s.pickup.lat, s.pickup.lng]} icon={pickupIcon} eventHandlers={{ click: () => setSelectedId(s.id) }} />
                <Marker position={[s.delivery.lat, s.delivery.lng]} icon={destIcon} eventHandlers={{ click: () => setSelectedId(s.id) }} />
                <Marker position={pos} icon={truckIcon(isSel, color)} eventHandlers={{ click: () => setSelectedId(s.id) }} />
              </span>
            );
          })}
        </MapContainer>

        {/* selected shipment floating card */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 z-[500] md:right-auto md:w-[420px]">
            <SelectedCard
              shipment={selected}
              progress={tMap[selected.id] ?? statusProgress[selected.status]}
              onAdvance={() => {
                const n = nextStatus(selected.status);
                if (n) updateShipmentStatus(selected.id, n);
              }}
            />
          </div>
        )}
      </div>

      {/* side list */}
      <div className="flex flex-col rounded-3xl border bg-card soft-shadow" style={{ height }}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Active shipments</div>
            <div className="text-xs text-muted-foreground">
              {active.length} of {baseActive.length} shown · updates live
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative h-8 gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                  {filterCount > 0 && (
                    <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {filterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">Filter shipments</div>
                  {filterCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ACTIVE_STATUSES.map((s) => {
                      const on = statusFilter.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggle(statusFilter, setStatusFilter, s)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs capitalize transition-colors",
                            on ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted",
                          )}
                        >
                          {s.replace("_", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRIORITIES.map((p) => {
                      const on = priorityFilter.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => toggle(priorityFilter, setPriorityFilter, p)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs capitalize transition-colors",
                            on ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted",
                          )}
                        >
                          {p.replace("_", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Booked date</div>
                  <div className="grid grid-cols-2 gap-2">
                    <DateField label="From" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="To" value={dateTo} onChange={setDateTo} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={() => setTMap({})} title="Reset animations">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {filterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-b bg-muted/30 px-3 py-2">
            {statusFilter.length !== ACTIVE_STATUSES.length &&
              statusFilter.map((s) => (
                <Chip key={s} label={s.replace("_", " ")} onClear={() => toggle(statusFilter, setStatusFilter, s)} />
              ))}
            {priorityFilter.length !== PRIORITIES.length &&
              priorityFilter.map((p) => (
                <Chip key={p} label={p.replace("_", " ")} onClear={() => toggle(priorityFilter, setPriorityFilter, p)} />
              ))}
            {dateFrom && <Chip label={`From ${format(dateFrom, "MMM d")}`} onClear={() => setDateFrom(undefined)} />}
            {dateTo && <Chip label={`To ${format(dateTo, "MMM d")}`} onClear={() => setDateTo(undefined)} />}
          </div>
        )}
        <div className="flex-1 overflow-auto p-2">
          {active.length === 0 && (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <Package className="mx-auto mb-2 h-6 w-6 opacity-50" />
                {baseActive.length === 0 ? "No active shipments right now." : "No shipments match your filters."}
                {filterCount > 0 && (
                  <button onClick={resetFilters} className="mt-2 block w-full text-xs text-primary hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
          {active.map((s) => {
            const t = tMap[s.id] ?? statusProgress[s.status];
            const color = priorityColor(s.priority);
            const isSel = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={cn(
                  "group w-full rounded-2xl border p-3 text-left transition-all mb-2",
                  isSel ? "border-primary bg-primary/5 shadow-sm" : "border-transparent hover:bg-muted/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="grid h-8 w-8 place-items-center rounded-lg text-white"
                      style={{ background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 60%, white))` }}
                    >
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.id}</div>
                      <div className="text-[11px] text-muted-foreground">{s.pickup.city} → {s.delivery.city}</div>
                    </div>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isSel && "translate-x-0.5 text-primary")} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <StatusBadge status={s.status} />
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.priority.replace("_", " ")}</div>
                </div>
                <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{ width: `${Math.round(t * 100)}%`, background: `linear-gradient(90deg, ${color}, oklch(0.72 0.17 152))` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function SelectedCard({
  shipment,
  progress,
  onAdvance,
}: {
  shipment: Shipment;
  progress: number;
  onAdvance: () => void;
}) {
  const n = nextStatus(shipment.status);
  const nLabel: Record<ShipmentStatus, string> = {
    booked: "Assign",
    assigned: "Mark picked up",
    picked_up: "Start transit",
    in_transit: "Approaching",
    near_destination: "Mark delivered",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return (
    <div className="rounded-2xl border glass p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{shipment.id}</span>
            <StatusBadge status={shipment.status} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {shipment.pickup.city}
            <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
            {shipment.delivery.city}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ETA</div>
          <div className="text-sm font-bold">{Math.max(1, Math.round((1 - progress) * 8))}h {Math.floor(Math.random() * 60)}m</div>
        </div>
      </div>

      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-[color:var(--success)] transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{Math.round(progress * 100)}% complete</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> updated just now</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Mini label="Distance" value={`${shipment.distanceKm} km`} icon={<Navigation className="h-3 w-3" />} />
        <Mini label="Weight" value={`${shipment.package.weight} kg`} icon={<Package className="h-3 w-3" />} />
        <Mini label="Price" value={`₹${shipment.cost}`} icon={<Zap className="h-3 w-3" />} />
      </div>

      <div className="mt-3 flex gap-2">
        <Button size="sm" className="flex-1" onClick={onAdvance} disabled={!n}>
          {n ? (
            <>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {nLabel[shipment.status]}
            </>
          ) : (
            "Completed"
          )}
        </Button>
      </div>
    </div>
  );
}

function Mini({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/60 p-2">
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-muted-foreground">{icon}{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value?: Date; onChange: (d?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-9 justify-start gap-1.5 font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="h-3.5 w-3.5" />
          {value ? format(value, "MMM d") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[11px] capitalize">
      {label}
      <button onClick={onClear} className="grid h-3.5 w-3.5 place-items-center rounded-full hover:bg-muted">
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}