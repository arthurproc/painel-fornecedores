"use client";

import { Lock, ShieldCheck, UserCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContextoAtivo, useSessaoMock } from "@/lib/session";

export default function ConfiguracoesPessoaisPage() {
  const { membroLogado } = useSessaoMock();
  const contextoAtivo = useContextoAtivo();
  const tipoShell = contextoAtivo === "admin" ? "empresa" : contextoAtivo;

  return (
    <AppShell tipo={tipoShell} titulo="Configurações pessoais">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Configurações pessoais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preferências de conta e segurança do membro logado.
          </p>
        </div>

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
            <div className="rounded-xl border border-border p-4 flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle2 className="w-4 h-4" />
              Preferências de notificações serão centralizadas aqui na Fase 7.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
