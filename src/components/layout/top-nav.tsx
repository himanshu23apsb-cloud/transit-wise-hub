import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { SearchBar } from "@/components/common/search-bar";
import { NotificationBell } from "@/components/common/notification-bell";
import { ProfileMenu } from "@/components/common/profile-menu";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useState } from "react";

interface NavItem {
  to: string;
  label: string;
}

export function TopNav({ items, profilePath }: { items: NavItem[]; profilePath: string }) {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/"><Logo /></Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {items.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/customer" || n.to === "/driver" || n.to === "/admin" }}
              activeProps={{ className: "bg-muted text-foreground" }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-72 md:block">
          <SearchBar value={q} onChange={setQ} />
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <ThemeToggle />
          <NotificationBell />
          <ProfileMenu profilePath={profilePath} />
        </div>
      </div>
    </header>
  );
}