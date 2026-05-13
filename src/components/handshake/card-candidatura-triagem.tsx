"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, HelpCircle, MessageSquare, Star, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FitScoreBadge } from "./fit-score-badge";
import {
  capacidadeStatusBadgeClass,
  capacidadeStatusLabel,
  type CapacidadeMatchStatus,
  type FitScoreBreakdown,
} from "@/lib/fit-score";
import { cn } from "@/lib/utils";
import {
  statusColors,
  statusLabels,
  type Candidatura,
  type Contrato,
  type Fornecedor,
} from "@/lib/mock-data";

interface CardCandidaturaTriagemProps {
  candidatura: Candidatura;
  fornecedor: Fornecedor;
  breakdown: FitScoreBreakdown;
  contratosDestacados: Contrato[];
  onShortlist: () => void;
  onDescartar: () => void;
  acoesAtivas: boolean;
}

export function CardCandidaturaTriagem({
  candidatura,
  fornecedor,
  breakdown,
  contratosDestacados,
  onShortlist,
  onDescartar,
  acoesAtivas,
}: CardCandidaturaTriagemProps) {
  const reputacao = fornecedor.reputacao_agregada;

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/perfil/fornecedor/${fornecedor.id}`}
            className="flex min-w-0 items-center gap-3 hover:underline"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {fornecedor.logo}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fornecedor.nome}</p>
              <p className="truncate text-xs text-muted-foreground">
                {fornecedor.cidade} · {fornecedor.projetosRealizados} projetos realizados
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <FitScoreBadge breakdown={breakdown} />
            <Badge variant="secondary" className={statusColors[candidatura.status]}>
              {statusLabels[candidatura.status]}
            </Badge>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{candidatura.pitch}</p>

        <BlocoCapacidade candidatura={candidatura} breakdown={breakdown} />

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {reputacao.total_reviews > 0 ? reputacao.media_geral.toFixed(1) : "—"}{" "}
            <span>({reputacao.total_reviews} avaliações)</span>
          </span>
          <span>
            Faixa preliminar:{" "}
            <strong className="text-foreground">
              {candidatura.faixa_preco_preliminar ?? "não informada"}
            </strong>
          </span>
        </div>

        {contratosDestacados.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Contratos destacados pelo fornecedor
            </p>
            <div className="flex flex-wrap gap-2">
              {contratosDestacados.map((contrato) => (
                <Badge key={contrato.id} variant="outline">
                  #{contrato.id} · {contrato.valor_final}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-red-600 hover:text-red-700"
            disabled={!acoesAtivas}
            onClick={onDescartar}
          >
            <XCircle className="h-3.5 w-3.5" /> Descartar
          </Button>
          <Button size="sm" className="gap-1" disabled={!acoesAtivas} onClick={onShortlist}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Selecionar para proposta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function iconePorStatus(status: CapacidadeMatchStatus) {
  switch (status) {
    case "compatible":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />;
    case "tight":
      return <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />;
    case "insufficient":
      return <XCircle className="h-3.5 w-3.5 text-red-700" />;
    case "unknown":
      return <HelpCircle className="h-3.5 w-3.5 text-gray-700" />;
  }
}

function formatNumero(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return Math.round(valor).toLocaleString("pt-BR");
}

interface BlocoCapacidadeProps {
  candidatura: Candidatura;
  breakdown: FitScoreBreakdown;
}

function BlocoCapacidade({ candidatura, breakdown }: BlocoCapacidadeProps) {
  const { capacidade } = breakdown;
  const { status, nominal_mensal, utilizacao_percent, livre_mensal, volume_requerido_mensal, unidade } = capacidade;
  const alocada = candidatura.capacidade_alocada;

  return (
    <div className="space-y-1.5 rounded-lg bg-muted/30 p-3 text-xs">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
            capacidadeStatusBadgeClass(status)
          )}
        >
          {iconePorStatus(status)}
          {capacidadeStatusLabel(status)}
        </span>
        {alocada && unidade ? (
          <span className="text-muted-foreground">
            Alocação para este projeto:{" "}
            <strong className="text-foreground">
              {formatNumero(alocada.valor_nominal)} {unidade}
            </strong>{" "}
            <span className="text-muted-foreground/80">
              ({alocada.percent_da_capacidade_total}% da capacidade total)
            </span>
          </span>
        ) : candidatura.capacidade_declarada ? (
          <span className="text-muted-foreground">
            Declarada:{" "}
            <strong className="text-foreground">{candidatura.capacidade_declarada}</strong>
          </span>
        ) : null}
      </div>
      {nominal_mensal !== undefined && unidade && volume_requerido_mensal !== undefined ? (
        <>
          <p className="text-muted-foreground">
            Teto: <strong className="text-foreground">{formatNumero(nominal_mensal)} {unidade}</strong>{" "}
            · projeto pede{" "}
            <strong className="text-foreground">
              {formatNumero(volume_requerido_mensal)} {unidade}
            </strong>
          </p>
          {utilizacao_percent !== undefined && livre_mensal !== undefined ? (
            <p className="text-[11px] text-muted-foreground/70">
              Hoje {utilizacao_percent}% utilizado · {formatNumero(livre_mensal)} {unidade} livres
              no momento (informativo)
            </p>
          ) : null}
        </>
      ) : status === "unknown" ? (
        <p className="text-muted-foreground">
          Fornecedor não declarou capacidade neste item, ou o projeto não tem volume estimado.
        </p>
      ) : null}
      {candidatura.observacao_disponibilidade ? (
        <div className="flex items-start gap-1.5 rounded-md bg-background/60 px-2 py-1.5 text-[11px] text-muted-foreground">
          <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
          <span className="italic">&ldquo;{candidatura.observacao_disponibilidade}&rdquo;</span>
        </div>
      ) : null}
    </div>
  );
}
