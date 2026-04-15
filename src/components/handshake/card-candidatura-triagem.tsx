"use client";

import Link from "next/link";
import { CheckCircle2, Star, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FitScoreBadge } from "./fit-score-badge";
import type { FitScoreBreakdown } from "@/lib/fit-score";
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
          <span>Capacidade: {candidatura.capacidade_declarada}</span>
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
            <CheckCircle2 className="h-3.5 w-3.5" /> Shortlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
