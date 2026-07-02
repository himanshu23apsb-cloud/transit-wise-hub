import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  UserCog,
  ClipboardList,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

const items: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/shipments", label: "Shipments", icon: Package },
  { to: "/admin/drivers", label: "Drivers", icon: UserCog },
  { to: "/admin/vehicles", label: "Vehicles", icon: Truck },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-16 items-center border-b px-5">
        <Logo tagline />
      </div>
      <nav className="p-3">
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Manage</div>
        <ul className="mt-1 space-y-0.5">
          {items.map((it) => (
            <li key={it.to}>
              <Link
                to={it.to}
                activeOptions={{ exact: it.exact }}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}