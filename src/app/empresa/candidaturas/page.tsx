"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardCandidatura } from "@/components/handshake/card-candidatura";
import { cn } from "@/lib/utils";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  empresas,
  fornecedores,
  getEmpresaByOrganizacao,
  getMembroById,
  projetos,
  statusColors,
  statusLabels,
  type CandidaturaStatus,
} from "@/lib/mock-data";

const FILTRO_OPCOES: { value: "todas" | CandidaturaStatus; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "enviada", label: "Aguardando triagem" },
  { value: "shortlistada", label: "Selecionadas para proposta" },
  { value: "descartada", label: "Descartadas" },
  { value: "retirada", label: "Retiradas" },
  { value: "expirada", label: "Expiradas" },
];

export default function CandidaturasEmpresaPage() {
  const [filtroStatus, setFiltroStatus] = useState<"todas" | CandidaturaStatus>("todas");
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresaAtiva = getEmpresaByOrganizacao(membroLogado?.organizacao_id ?? "");

  const projetosDaEmpresa = useMemo(() => {
    if (!empresaAtiva) return [];
    return projetos.filter((p) => p.empresa_id === empresaAtiva.id);
  }, [empresaAtiva]);

  const candidaturasPorProjeto = useMemo(() => {
    return projetosDaEmpresa.map((projeto) => {
      const itens = candidaturas
        .filter(
          (c) =>
            c.projeto_id === projeto.id &&
            c.status !== "rascunho" &&
            (filtroStatus === "todas" || c.status === filtroStatus)
        )
        .sort((a, b) => (b.enviada_em ?? "").localeCompare(a.enviada_em ?? ""));
      return { projeto, itens };
    });
  }, [projetosDaEmpresa, filtroStatus]);

  const empresaSaudacao = empresas.find((e) => e.id === empresaAtiva?.id);

  function toggle(id: string) {
    setExpandidos((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }

  return (
    <AppShell tipo="empresa" titulo="Candidaturas recebidas">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Candidaturas recebidas</h1>
              <p className="text-sm text-muted-foreground">
                Agrupadas por projeto · {empresaSaudacao?.nome ?? "Empresa"}
              </p>
            </div>
            <Select
              value={filtroStatus}
              onValueChange={(v) => setFiltroStatus(v as typeof filtroStatus)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTRO_OPCOES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {candidaturasPorProjeto.length === 0 && (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum projeto publicado ainda.
            </CardContent>
          </Card>
        )}

        {candidaturasPorProjeto.map(({ projeto, itens }) => {
          const aberto = expandidos[projeto.id] ?? true;
          return (
            <Card key={projeto.id} className="rounded-xl">
              <CardContent className="p-0">
                <button
                  type="button"
                  onClick={() => toggle(projeto.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-t-xl px-5 py-4 text-left hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    {aberto ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">{projeto.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        Prazo {projeto.prazo} · {projeto.categoria}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn(statusColors[projeto.status])}>
                      {statusLabels[projeto.status]}
                    </Badge>
                    <Badge variant="outline">{itens.length} candidatura(s)</Badge>
                    <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/empresa/projeto/${projeto.id}/triagem`}>Triagem</Link>
                    </Button>
                  </div>
                </button>

                {aberto && (
                  <div className="space-y-3 border-t border-border p-5">
                    {itens.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma candidatura neste filtro para o projeto.
                      </p>
                    ) : (
                      itens.map((candidatura) => {
                        const fornecedor = fornecedores.find(
                          (f) => f.id === candidatura.fornecedor_id
                        );
                        const acao = (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/empresa/projeto/${projeto.id}/triagem`}>
                              Abrir na triagem
                            </Link>
                          </Button>
                        );
                        return (
                          <CardCandidatura
                            key={candidatura.id}
                            candidatura={candidatura}
                            projeto={projeto}
                            empresa={empresaSaudacao}
                            fornecedor={fornecedor}
                            ladoDireito="fornecedor"
                            acao={acao}
                          />
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
