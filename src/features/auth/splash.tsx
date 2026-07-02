import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { useAuth, roleHome } from "@/lib/mock/auth";

export function Splash() {
  const navigate = useNavigate();
  const { session } = useAuth();
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (session) navigate({ to: roleHome(session.role) });
      else navigate({ to: "/welcome" });
    }, 1200);
    return () => window.clearTimeout(t);
  }, [navigate, session]);
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-primary/10 via-background to-[color:var(--success)]/10">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-[color:var(--success)] text-primary-foreground soft-shadow">
          <Truck className="h-10 w-10" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold tracking-tight">Freightly</div>
          <div className="text-sm text-muted-foreground">Smart Transportation & Logistics</div>
        </div>
        <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}