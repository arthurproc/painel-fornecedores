"use client";

import { useMemo, useState } from "react";
import { Clock, Mail, Shield, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  advisors,
  getOrganizacaoById,
  membros,
  organizacoes,
  type Membro,
  type Organizacao,
} from "@/lib/mock-data";

type MembroRole = Membro["role"];

const roleLabels: Record<MembroRole, string> = {
  owner: "Owner",
  admin: "Admin",
  operador: "Operador",
};

const roleColors: Record<MembroRole, string> = {
  owner: "bg-primary/10 text-primary",
  admin: "bg-blue-100 text-blue-800",
  operador: "bg-gray-100 text-gray-700",
};

function perfilLabel(org: Organizacao | undefined): string {
  if (!org) return "—";
  if (org.perfil_empresa_ativo && org.perfil_fornecedor_ativo) return "Empresa + Fornecedor";
  if (org.perfil_empresa_ativo) return "Empresa";
  if (org.perfil_fornecedor_ativo) return "Fornecedor";
  return "Sem perfil ativo";
}

function iniciais(nome: string): string {
  const parts = nome.split(" ").filter(Boolean);
  return (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "");
}

function formatarData(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export default function AdminUsuariosPage() {
  const [filtroRole, setFiltroRole] = useState<"todos" | MembroRole>("todos");
  const [filtroTenant, setFiltroTenant] = useState<string>("todos");

  const membrosFiltrados = useMemo(
    () =>
      membros.filter((m) => {
        if (filtroRole !== "todos" && m.role !== filtroRole) return false;
        if (filtroTenant !== "todos" && m.organizacao_id !== filtroTenant)
          return false;
        return true;
      }),
    [filtroRole, filtroTenant]
  );

  const porOrganizacao = useMemo(() => {
    const mapa = new Map<string, Membro[]>();
    for (const m of membrosFiltrados) {
      const bucket = mapa.get(m.organizacao_id) ?? [];
      bucket.push(m);
      mapa.set(m.organizacao_id, bucket);
    }
    return [...mapa.entries()].sort(([a], [b]) => {
      const orgA = getOrganizacaoById(a)?.razao_social ?? a;
      const orgB = getOrganizacaoById(b)?.razao_social ?? b;
      return orgA.localeCompare(orgB);
    });
  }, [membrosFiltrados]);

  const ownerCount = membros.filter((m) => m.role === "owner").length;
  const adminCount = membros.filter((m) => m.role === "admin").length;
  const operadorCount = membros.filter((m) => m.role === "operador").length;

  return (
    <AppShell tipo="admin" titulo="Usuários">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{membros.length}</span>{" "}
            membros cadastrados em {organizacoes.length} organizações
          </span>
          <span>
            <span className="font-semibold text-foreground">{ownerCount}</span>{" "}
            owners ·{" "}
            <span className="font-semibold text-foreground">{adminCount}</span>{" "}
            admins ·{" "}
            <span className="font-semibold text-foreground">{operadorCount}</span>{" "}
            operadores
          </span>
          <span>
            <span className="font-semibold text-foreground">{advisors.length}</span>{" "}
            advisors (tenant interno)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Role</span>
            <Select
              value={filtroRole}
              onValueChange={(v) => setFiltroRole(v as typeof filtroRole)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Organização</span>
            <Select value={filtroTenant} onValueChange={setFiltroTenant}>
              <SelectTrigger className="w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as organizações</SelectItem>
                {organizacoes.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {porOrganizacao.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Nenhum membro corresponde aos filtros selecionados.
              </CardContent>
            </Card>
          ) : (
            porOrganizacao.map(([orgId, lista]) => {
              const org = getOrganizacaoById(orgId);
              return (
                <Card key={orgId} className="rounded-xl">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                      <div className="flex items-center gap-2">
                        <UsersRound className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {org?.razao_social ?? orgId}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {perfilLabel(org)}
                        </Badge>
                        {org && !org.ativo && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-xs text-gray-600"
                          >
                            Inativa
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {lista.length} membro{lista.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="divide-y divide-border">
                      {lista.map((m) => (
                        <div
                          key={m.id}
                          className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 px-5 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {iniciais(m.nome)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {m.nome}
                              </p>
                              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                                <Mail className="h-3 w-3 shrink-0" />
                                {m.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {m.cargo}
                          </div>
                          <div>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${roleColors[m.role]}`}
                            >
                              {roleLabels[m.role]}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              desde {formatarData(m.desde)}
                            </span>
                            <Badge
                              variant="secondary"
                              className={
                                m.ativo
                                  ? "bg-emerald-100 text-xs text-emerald-800"
                                  : "bg-gray-100 text-xs text-gray-600"
                              }
                            >
                              {m.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Advisors — tenant interno</h2>
            <Badge variant="secondary" className="text-xs">
              ConectaFornece Consultoria
            </Badge>
          </div>
          <Card className="rounded-xl">
            <CardContent className="divide-y divide-border p-0">
              {advisors.map((a) => (
                <div
                  key={a.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {iniciais(a.nome)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.nome}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        {a.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.especializacoes.length} especialização
                    {a.especializacoes.length === 1 ? "" : "es"}
                  </div>
                  <div>
                    <Badge
                      variant="secondary"
                      className={
                        a.role === "owner"
                          ? "bg-primary/10 text-xs text-primary"
                          : "bg-blue-100 text-xs text-blue-800"
                      }
                    >
                      {a.role === "owner" ? "Owner" : "Advisor"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      desde {formatarData(a.desde)}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        a.ativo
                          ? "bg-emerald-100 text-xs text-emerald-800"
                          : "bg-gray-100 text-xs text-gray-600"
                      }
                    >
                      {a.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
