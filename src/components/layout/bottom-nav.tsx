import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface BottomNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  return (
    <nav className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((n) => (
          <li key={n.to}>
            <Link
              to={n.to}
              activeOptions={{ exact: n.exact }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
            >
              <n.icon className="h-5 w-5" />
              <span>{n.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}