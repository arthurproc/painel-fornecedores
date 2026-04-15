"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { NotificationCard } from "@/components/notifications/notification-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  groupNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
  useNotifications,
} from "@/lib/notifications";

interface DrawerNotificacoesProps {
  memberId: string;
}

export function DrawerNotificacoes({ memberId }: DrawerNotificacoesProps) {
  const router = useRouter();
  const notifications = useNotifications(memberId);
  const [open, setOpen] = useState(false);

  const activeItems = groupNotifications(notifications.filter((notification) => !notification.arquivada)).slice(0, 10);
  const unreadCount = notifications.filter((notification) => !notification.arquivada && !notification.lida).length;

  function handleOpen(url: string, ids: string[]) {
    markNotificationsAsRead(ids, true);
    setOpen(false);
    router.push(url);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center rounded-full">
              {Math.min(unreadCount, 9)}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] p-0 sm:max-w-[420px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6 pr-12">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SheetTitle>Notificações</SheetTitle>
                <SheetDescription>
                  {unreadCount > 0
                    ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""} no momento.`
                    : "Você está em dia com as notificações."}
                </SheetDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={unreadCount === 0}
                onClick={() => markAllNotificationsAsRead(memberId, false)}
              >
                Marcar todas como lidas
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {activeItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Nenhuma notificação no momento.
              </div>
            ) : (
              activeItems.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  mode="drawer"
                  onOpen={() => handleOpen(item.actionUrl, item.notificationIds)}
                  onToggleRead={() => markNotificationsAsRead(item.notificationIds, true)}
                />
              ))
            )}
          </div>

          <div className="border-t border-border p-6">
            <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
              <Link href="/notificacoes">Ver todas</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
