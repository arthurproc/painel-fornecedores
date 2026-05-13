"use client";

import { useState } from "react";
import { AlertTriangle, Check, HelpCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  capacidadeStatusLabel,
  fitScoreColor,
  type CapacidadeBreakdown,
  type CapacidadeMatchStatus,
  type FitScoreBreakdown,
} from "@/lib/fit-score";

interface FitScoreBadgeProps {
  breakdown: FitScoreBreakdown;
  size?: "sm" | "lg";
  showHook?: boolean;
}

function formatNumero(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return Math.round(valor).toLocaleString("pt-BR");
}

export function FitScoreBadge({ breakdown, size = "sm", showHook = true }: FitScoreBadgeProps) {
  const [aberto, setAberto] = useState(false);
  const cor = fitScoreColor(breakdown.total);

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          cor,
          size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"
        )}
      >
        Fit {breakdown.total}%
      </span>
      {showHook && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setAberto(true);
            }}
          >
            <Info className="h-3.5 w-3.5" />
            <span className="sr-only">Por que minha aderência é {breakdown.total}?</span>
          </Button>
          <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Por que minha aderência é {breakdown.total}%?</DialogTitle>
                <DialogDescription>
                  A aderência compara o seu perfil com o projeto. Categoria e região definem
                  se você está no setor certo; capacidade compara o teto da sua operação com
                  o volume requerido. Sua utilização atual aparece como contexto, mas não
                  entra no fit.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-3 text-sm">
                <LinhaFitBoolean
                  label="Categoria compatível"
                  match={breakdown.categoria.match}
                  peso={breakdown.categoria.peso}
                />
                <LinhaFitBoolean
                  label="Região atendida"
                  match={breakdown.regiao.match}
                  peso={breakdown.regiao.peso}
                />
                <LinhaFitCapacidade capacidade={breakdown.capacidade} />
              </ul>
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Essa pontuação é apenas um indicador leve. A decisão é sempre da empresa na triagem.
              </p>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

function LinhaFitBoolean({ label, match, peso }: { label: string; match: boolean; peso: number }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="flex items-center gap-2">
        {match ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground" />
        )}
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">+{peso}</span>
    </li>
  );
}

function iconePorStatus(status: CapacidadeMatchStatus) {
  switch (status) {
    case "compatible":
      return <Check className="h-4 w-4 text-emerald-600" />;
    case "tight":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "insufficient":
      return <X className="h-4 w-4 text-red-600" />;
    case "unknown":
      return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function LinhaFitCapacidade({ capacidade }: { capacidade: CapacidadeBreakdown }) {
  const {
    status,
    peso,
    nominal_mensal,
    utilizacao_percent,
    livre_mensal,
    volume_requerido_mensal,
    unidade,
  } = capacidade;
  const detalhe =
    nominal_mensal !== undefined && volume_requerido_mensal !== undefined && unidade
      ? `Teto: ${formatNumero(nominal_mensal)} ${unidade} · projeto pede ${formatNumero(volume_requerido_mensal)} ${unidade}`
      : status === "unknown"
        ? "Sem números para comparar — declare capacidade nesse item para subir o fit."
        : "—";
  const contexto =
    utilizacao_percent !== undefined && livre_mensal !== undefined && unidade
      ? `Hoje ${utilizacao_percent}% utilizado · ${formatNumero(livre_mensal)} ${unidade} livres (informativo, não afeta o fit)`
      : undefined;

  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <span className="flex items-start gap-2">
        <span className="mt-0.5">{iconePorStatus(status)}</span>
        <span className="flex flex-col">
          <span>{capacidadeStatusLabel(status)}</span>
          <span className="text-xs text-muted-foreground">{detalhe}</span>
          {contexto ? (
            <span className="text-[11px] text-muted-foreground/70">{contexto}</span>
          ) : null}
        </span>
      </span>
      <span className="text-sm font-medium text-foreground">+{peso}</span>
    </li>
  );
}
