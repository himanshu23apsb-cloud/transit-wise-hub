import { NotificationBell } from "@/components/common/notification-bell";
import { ProfileMenu } from "@/components/common/profile-menu";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Logo } from "@/components/brand/logo";

export function MobileHeader({ profilePath }: { profilePath: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
      <Logo />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <ProfileMenu profilePath={profilePath} />
      </div>
    </header>
  );
}