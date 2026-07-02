import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  delta?: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive";
  className?: string;
}

function useCounter(target: number, duration = 800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

export function KpiCard({ label, value, suffix, prefix, delta, icon: Icon, tone = "primary", className }: Props) {
  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, "")) || 0;
  const shown = typeof value === "number" ? useCounter(numeric) : value;
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className={cn("group rounded-2xl border bg-card p-5 soft-shadow transition-all hover:-translate-y-0.5 hover:shadow-lg", className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {prefix}
            {typeof value === "number" ? shown.toLocaleString() : shown}
            {suffix}
          </div>
          {typeof delta === "number" ? (
            <div className={cn("mt-1 text-xs font-medium", delta >= 0 ? "text-[color:var(--success)]" : "text-destructive")}>
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs last week
            </div>
          ) : null}
        </div>
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-110", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}