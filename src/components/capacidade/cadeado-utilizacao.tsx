"use client";

import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CadeadoUtilizacaoProps {
  className?: string;
}

/**
 * Lock icon shown next to capacity utilization values. Exposes a tooltip that
 * explains the privacy rule: a supplier's utilization percentage is only
 * revealed to a contracting company once the supplier applies to one of its
 * projects — until then it stays private.
 */
export function CadeadoUtilizacao({ className }: CadeadoUtilizacaoProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            role="img"
            aria-label="Privado: utilização visível à empresa apenas após você se candidatar"
            className="inline-flex cursor-help align-middle"
          >
            <Lock className={cn("h-2.5 w-2.5", className)} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          Privado. A empresa contratante só vê este percentual depois que você se
          candidata a um projeto dela.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
