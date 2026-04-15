"use client";

import { Archive, BellRing, CheckCheck, CircleAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatNotificationRelativeTime,
  type NotificationListItem,
} from "@/lib/notifications";

interface NotificationCardProps {
  item: NotificationListItem;
  mode: "drawer" | "page";
  onOpen: () => void;
  onToggleRead?: () => void;
  onToggleArchive?: () => void;
}

function severityStyles(severity: NotificationListItem["severity"]) {
  if (severity === "critica") {
    return {
      container: "bg-destructive/10 text-destructive border-destructive/20",
      icon: CircleAlert,
      label: "Crítica",
    };
  }
  if (severity === "importante") {
    return {
      container: "bg-chart-4/15 text-foreground border-chart-4/30",
      icon: BellRing,
      label: "Importante",
    };
  }
  return {
    container: "bg-muted text-muted-foreground border-border",
    icon: Info,
    label: "Informativa",
  };
}

export function NotificationCard({ item, mode, onOpen, onToggleRead, onToggleArchive }: NotificationCardProps) {
  const severity = severityStyles(item.severity);
  const Icon = severity.icon;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-colors",
        item.read ? "opacity-80" : "border-primary/20 bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border", severity.container)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                {item.count > 1 ? <Badge variant="secondary">{item.count}</Badge> : null}
                {!item.read ? <Badge className="rounded-full">Nova</Badge> : null}
              </div>
              {item.body ? <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p> : null}
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">{formatNotificationRelativeTime(item.createdAt)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {severity.label}
            </Badge>
            <Button size="sm" onClick={onOpen}>
              Abrir
            </Button>
            {mode === "page" && onToggleRead ? (
              <Button size="sm" variant="outline" onClick={onToggleRead}>
                <CheckCheck className="h-4 w-4" />
                {item.read ? "Marcar como não lida" : "Marcar como lida"}
              </Button>
            ) : null}
            {mode === "page" && onToggleArchive ? (
              <Button size="sm" variant="ghost" onClick={onToggleArchive}>
                <Archive className="h-4 w-4" />
                {item.archived ? "Desarquivar" : "Arquivar"}
              </Button>
            ) : null}
            {mode === "drawer" && !item.read && onToggleRead ? (
              <Button size="sm" variant="ghost" onClick={onToggleRead}>
                Marcar como lida
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
