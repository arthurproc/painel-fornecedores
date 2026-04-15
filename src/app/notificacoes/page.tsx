"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { NotificationCard } from "@/components/notifications/notification-card";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADVISOR_LOGADO_ID } from "@/lib/mock-data";
import {
  filterNotificationItems,
  getNotificationContext,
  groupNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
  setNotificationArchived,
  useNotifications,
  type NotificationContext,
  type NotificationPeriod,
} from "@/lib/notifications";
import { useContextoAtivo, useSessaoMock } from "@/lib/session";

export default function NotificacoesPage() {
  const router = useRouter();
  const { membroLogado } = useSessaoMock();
  const contextoAtivo = useContextoAtivo();
  const [aba, setAba] = useState<"ativas" | "arquivadas">("ativas");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<"todas" | "critica" | "importante" | "informativa">("todas");
  const [context, setContext] = useState<"todos" | NotificationContext>("todos");
  const [period, setPeriod] = useState<NotificationPeriod>("todos");

  const tipoShell = contextoAtivo;
  const memberId = contextoAtivo === "admin" ? ADVISOR_LOGADO_ID : membroLogado.id;
  const notifications = useNotifications(memberId);
  const groupedItems = groupNotifications(
    notifications.filter((notification) => notification.arquivada === (aba === "arquivadas"))
  );
  const filteredItems = filterNotificationItems(groupedItems, { query, severity, context, period });
  const activeUnreadCount = notifications.filter((notification) => !notification.arquivada && !notification.lida).length;
  const archivedCount = notifications.filter((notification) => notification.arquivada).length;

  function handleOpen(actionUrl: string, ids: string[]) {
    markNotificationsAsRead(ids, true);
    router.push(actionUrl);
  }

  return (
    <AppShell tipo={tipoShell} titulo="Notificações">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe tudo o que exige ação, filtre por contexto e mantenha o histórico arquivado.
            </p>
          </div>
          <Button onClick={() => markAllNotificationsAsRead(memberId, false)} disabled={activeUnreadCount === 0}>
            Marcar não lidas como lidas
          </Button>
        </div>

        <Card className="rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold">Caixa de notificações</CardTitle>
              <Tabs value={aba} onValueChange={(value) => setAba(value as "ativas" | "arquivadas")}> 
                <TabsList>
                  <TabsTrigger value="ativas">
                    Ativas <Badge variant="secondary" className="ml-2">{activeUnreadCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="arquivadas">
                    Arquivadas <Badge variant="secondary" className="ml-2">{archivedCount}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-[1.4fr_repeat(3,200px)] gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por projeto, fornecedor, ação ou contexto"
                  className="pl-9"
                />
              </div>

              <Select value={severity} onValueChange={(value) => setSeverity(value as typeof severity)}>
                <SelectTrigger>
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as severidades</SelectItem>
                  <SelectItem value="critica">Críticas</SelectItem>
                  <SelectItem value="importante">Importantes</SelectItem>
                  <SelectItem value="informativa">Informativas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={context} onValueChange={(value) => setContext(value as typeof context)}>
                <SelectTrigger>
                  <SelectValue placeholder="Contexto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os contextos</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="sistema">Sistema</SelectItem>
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={(value) => setPeriod(value as NotificationPeriod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Desde sempre</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                {query
                  ? "Nenhuma notificação encontrada."
                  : aba === "arquivadas"
                    ? "Nada arquivado por enquanto."
                    : "Você está em dia com as notificações 🎯"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={{ ...item, context: getNotificationContext(item.type) }}
                    mode="page"
                    onOpen={() => handleOpen(item.actionUrl, item.notificationIds)}
                    onToggleRead={() => markNotificationsAsRead(item.notificationIds, !item.read)}
                    onToggleArchive={() => setNotificationArchived(item.notificationIds, !item.archived)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
