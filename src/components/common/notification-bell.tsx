import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/lib/mock/store";

export function NotificationBell() {
  const { notifications, markAllRead } = useData();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <div className="text-sm font-semibold">Notifications</div>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark all read
          </Button>
        </div>
        <ScrollArea className="h-80">
          <ul className="divide-y">
            {notifications.slice(0, 20).map((n) => (
              <li key={n.id} className="p-3 hover:bg-muted/50">
                <div className="flex items-start gap-3">
                  <span
                    className={
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full " +
                      (n.type === "success"
                        ? "bg-[color:var(--success)]"
                        : n.type === "warning"
                          ? "bg-[color:var(--warning)]"
                          : "bg-primary")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      {!n.read ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{n.message}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}