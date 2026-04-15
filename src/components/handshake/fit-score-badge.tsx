"use client";

import { useState } from "react";
import { Check, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { fitScoreColor, type FitScoreBreakdown } from "@/lib/fit-score";

interface FitScoreBadgeProps {
  breakdown: FitScoreBreakdown;
  size?: "sm" | "lg";
  showHook?: boolean;
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
            <span className="sr-only">Por que meu fit é {breakdown.total}?</span>
          </Button>
          <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Por que meu fit é {breakdown.total}%?</DialogTitle>
                <DialogDescription>
                  O fit score compara o seu perfil com o projeto. Categoria e região pesam mais; capacidade declarada complementa.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-3 text-sm">
                <LinhaFit label="Categoria compatível" match={breakdown.categoria.match} peso={breakdown.categoria.peso} />
                <LinhaFit label="Região atendida" match={breakdown.regiao.match} peso={breakdown.regiao.peso} />
                <LinhaFit label="Capacidade declarada" match={breakdown.capacidade.match} peso={breakdown.capacidade.peso} />
              </ul>
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                O score é apenas um indicador leve. A decisão é sempre da empresa na triagem.
              </p>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

function LinhaFit({ label, match, peso }: { label: string; match: boolean; peso: number }) {
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
