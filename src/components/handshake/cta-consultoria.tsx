"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalContratacaoSessao } from "@/components/consultoria/modal-contratacao-sessao";
import { cn } from "@/lib/utils";
import { getCatalogoByTipo, type CatalogoConsultoria } from "@/lib/mock-data";

export type CTAConsultoriaVariante = 1 | 2 | 3;

interface CTAConsultoriaProps {
  variante: CTAConsultoriaVariante;
  className?: string;
  size?: "sm" | "default" | "lg";
  candidaturaId?: string;
  propostaId?: string;
}

const tipoPorVariante: Record<CTAConsultoriaVariante, CatalogoConsultoria["tipo"]> = {
  1: "revisao_candidatura",
  2: "revisao_proposta",
  3: "retorno_pos_descarte",
};

const botaoPorVariante: Record<CTAConsultoriaVariante, string> = {
  1: "Quer revisar com a Consultoria?",
  2: "Revisar proposta com a Consultoria",
  3: "Entender o descarte com a Consultoria",
};

export function CTAConsultoria({
  variante,
  className,
  size = "default",
  candidaturaId,
  propostaId,
}: CTAConsultoriaProps) {
  const catalogo = getCatalogoByTipo(tipoPorVariante[variante]);
  const [aberto, setAberto] = useState(false);

  if (!catalogo) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        className={cn(
          "gap-2 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100",
          className
        )}
        onClick={() => setAberto(true)}
      >
        <Sparkles className="h-4 w-4" /> {botaoPorVariante[variante]}
      </Button>

      <ModalContratacaoSessao
        catalogo={catalogo}
        open={aberto}
        onOpenChange={setAberto}
        candidaturaPreSelecionada={candidaturaId}
        propostaPreSelecionada={propostaId}
      />
    </>
  );
}
