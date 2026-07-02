import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-[color:var(--success)] p-12 text-primary-foreground lg:flex lg:flex-col">
        <Link to="/welcome"><Logo className="[&_.leading-tight>div:first-child]:text-white [&_.leading-tight>div:last-child]:text-white/70" /></Link>
        <div className="mt-auto max-w-md">
          <div className="text-3xl font-bold">Move the world, one shipment at a time.</div>
          <p className="mt-3 text-sm text-white/80">Freightly powers 12,000+ deliveries across India every month with live tracking, smart routing, and transparent pricing.</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://api.dicebear.com/7.x/initials/svg?seed=U${i}`} className="h-8 w-8 rounded-full border-2 border-white" alt="" />
              ))}
            </div>
            <div className="text-xs text-white/80">Trusted by shippers nationwide</div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-56 w-56 rounded-full bg-black/10 blur-3xl" />
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/welcome"><Logo tagline /></Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}