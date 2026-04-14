"use client";

import { useState } from "react";
import { Mail, Clock, UserMinus, UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Funcao = "gestor" | "visualizador";
type Status = "ativo" | "pendente";

interface Membro {
  id: string;
  nome: string;
  email: string;
  funcao: Funcao;
  status: Status;
  desde: string;
}

const membrosIniciais: Membro[] = [
  {
    id: "m1",
    nome: "Ricardo Barbosa",
    email: "rbarbosa@vale.com",
    funcao: "gestor",
    status: "ativo",
    desde: "10/01/2026",
  },
  {
    id: "m2",
    nome: "Fernanda Lima",
    email: "flima@vale.com",
    funcao: "visualizador",
    status: "ativo",
    desde: "15/01/2026",
  },
  {
    id: "m3",
    nome: "—",
    email: "compras@novaaciaria.com.br",
    funcao: "gestor",
    status: "pendente",
    desde: "13/04/2026",
  },
];

const funcaoLabels: Record<Funcao, string> = {
  gestor: "Gestor",
  visualizador: "Visualizador",
};

const funcaoColors: Record<Funcao, string> = {
  gestor: "bg-primary/10 text-primary",
  visualizador: "bg-muted text-muted-foreground",
};

const statusColors: Record<Status, string> = {
  ativo: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
};

const statusLabels: Record<Status, string> = {
  ativo: "Ativo",
  pendente: "Convite pendente",
};

function Iniciais({ nome }: { nome: string }) {
  if (nome === "—") return <span className="text-muted-foreground text-xs">?</span>;
  const parts = nome.trim().split(" ");
  return (
    <span>
      {parts[0][0]}
      {parts[1]?.[0] ?? ""}
    </span>
  );
}

const MEU_ID = "m1";

export default function EmpresaMembros() {
  const [membros, setMembros] = useState<Membro[]>(membrosIniciais);
  const [dialogConvidar, setDialogConvidar] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [funcaoConvite, setFuncaoConvite] = useState<Funcao>("visualizador");
  const [membroRemover, setMembroRemover] = useState<Membro | null>(null);

  const ativos = membros.filter((m) => m.status === "ativo").length;
  const pendentes = membros.filter((m) => m.status === "pendente").length;

  function enviarConvite() {
    if (!emailConvite.trim()) return;
    const novo: Membro = {
      id: `m${Date.now()}`,
      nome: "—",
      email: emailConvite.trim(),
      funcao: funcaoConvite,
      status: "pendente",
      desde: new Date().toLocaleDateString("pt-BR"),
    };
    setMembros((prev) => [...prev, novo]);
    setEmailConvite("");
    setFuncaoConvite("visualizador");
    setDialogConvidar(false);
  }

  function confirmarRemocao() {
    if (!membroRemover) return;
    setMembros((prev) => prev.filter((m) => m.id !== membroRemover.id));
    setMembroRemover(null);
  }

  return (
    <AppShell tipo="empresa" titulo="Membros da organização">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{membros.length}</span> membros
            </span>
            <span>
              <span className="font-semibold text-emerald-700">{ativos}</span> ativos
            </span>
            {pendentes > 0 && (
              <span>
                <span className="font-semibold text-amber-700">{pendentes}</span>{" "}
                {pendentes === 1 ? "convite pendente" : "convites pendentes"}
              </span>
            )}
          </div>
          <Button onClick={() => setDialogConvidar(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar membro
          </Button>
        </div>

        {/* Lista */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Cabeçalho da tabela */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Membro</span>
                <span>Função</span>
                <span>Membro desde</span>
                <span>Status</span>
                <span />
              </div>

              {/* Linhas */}
              {membros.map((m) => {
                const isVoce = m.id === MEU_ID;
                return (
                  <div
                    key={m.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 items-center px-5 py-4"
                  >
                    {/* Membro */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        <Iniciais nome={m.nome} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {m.nome !== "—" ? m.nome : "Convite enviado"}
                          </p>
                          {isVoce && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-muted text-muted-foreground shrink-0"
                            >
                              você
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {m.email}
                        </p>
                      </div>
                    </div>

                    {/* Função */}
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${funcaoColors[m.funcao]}`}
                      >
                        {funcaoLabels[m.funcao]}
                      </Badge>
                    </div>

                    {/* Desde */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {m.desde}
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${statusColors[m.status]}`}
                      >
                        {statusLabels[m.status]}
                      </Badge>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-end">
                      {!isVoce && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setMembroRemover(m)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog: convidar membro */}
      <Dialog open={dialogConvidar} onOpenChange={setDialogConvidar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
            <DialogDescription>
              O convite será enviado por e-mail. O usuário precisa aceitar para entrar na
              organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email-convite">E-mail</Label>
              <Input
                id="email-convite"
                type="email"
                placeholder="nome@empresa.com.br"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funcao-convite">Função</Label>
              <Select
                value={funcaoConvite}
                onValueChange={(v) => setFuncaoConvite(v as Funcao)}
              >
                <SelectTrigger id="funcao-convite">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gestor">
                    Gestor — pode criar e gerenciar projetos
                  </SelectItem>
                  <SelectItem value="visualizador">
                    Visualizador — acesso somente leitura
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogConvidar(false)}>
              Cancelar
            </Button>
            <Button onClick={enviarConvite} disabled={!emailConvite.trim()}>
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: confirmar remoção */}
      <Dialog
        open={!!membroRemover}
        onOpenChange={(open) => {
          if (!open) setMembroRemover(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {membroRemover?.status === "pendente" ? "Cancelar convite" : "Remover membro"}
            </DialogTitle>
            <DialogDescription>
              {membroRemover?.status === "pendente"
                ? `O convite para ${membroRemover.email} será cancelado.`
                : `${membroRemover?.nome} perderá o acesso à organização imediatamente.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMembroRemover(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarRemocao}>
              {membroRemover?.status === "pendente" ? "Cancelar convite" : "Remover membro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
