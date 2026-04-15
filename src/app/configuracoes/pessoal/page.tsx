"use client";

import { BellRing, Lock, ShieldCheck, UserCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  notificationPreferenceGroups,
  restoreNotificationPreferences,
  updateNotificationPreference,
  useNotificationPreferences,
} from "@/lib/notifications";
import { useContextoAtivo, useSessaoMock } from "@/lib/session";

export default function ConfiguracoesPessoaisPage() {
  const { membroLogado } = useSessaoMock();
  const contextoAtivo = useContextoAtivo();
  const tipoShell = contextoAtivo;
  const preferencias = useNotificationPreferences(membroLogado.id);

  return (
    <AppShell tipo={tipoShell} titulo="Configurações pessoais">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Configurações pessoais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preferências de conta e segurança do membro logado.
          </p>
        </div>

        <Tabs defaultValue="perfil" className="space-y-4">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome completo</Label>
                    <Input value={membroLogado.nome} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input value={membroLogado.cargo} readOnly className="bg-muted/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input value={membroLogado.email} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={membroLogado.telefone ?? "Não informado"} readOnly className="bg-muted/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em dois fatores</p>
                    <p className="text-sm text-muted-foreground">Disponível nas próximas fases do mockup.</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Em breve
                  </Badge>
                </div>
                <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Alteração de senha desabilitada no mockup</span>
                  </div>
                  <Badge variant="outline" className="rounded-full">Somente leitura</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card className="rounded-xl">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold">Preferências de notificação</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ajuste os canais por grupo. As alterações são salvas em memória automaticamente.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationPreferenceGroups.map((group) => {
                  const value = preferencias.preferencias[group.id] ?? { in_app: true, email: false };

                  return (
                    <div key={group.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{group.titulo}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{group.descricao}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={value.in_app ? "default" : "outline"}
                            onClick={() =>
                              updateNotificationPreference(membroLogado.id, group.id, "in_app", !value.in_app)
                            }
                          >
                            <BellRing className="w-4 h-4" /> In-app
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={value.email ? "default" : "outline"}
                            onClick={() =>
                              updateNotificationPreference(membroLogado.id, group.id, "email", !value.email)
                            }
                          >
                            E-mail
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle2 className="w-4 h-4" />
                    Última atualização: {new Date(preferencias.atualizado_em).toLocaleDateString("pt-BR")}
                  </div>
                  <Button type="button" variant="outline" onClick={() => restoreNotificationPreferences(membroLogado.id)}>
                    Restaurar padrões
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
