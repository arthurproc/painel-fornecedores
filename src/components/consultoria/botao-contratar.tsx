"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalContratacaoSessao } from "./modal-contratacao-sessao";
import type { CatalogoConsultoria } from "@/lib/mock-data";

interface BotaoContratarProps {
  catalogo: CatalogoConsultoria;
  candidaturaPreSelecionada?: string;
  propostaPreSelecionada?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function BotaoContratar({
  catalogo,
  candidaturaPreSelecionada,
  propostaPreSelecionada,
  size = "default",
  className,
}: BotaoContratarProps) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Button size={size} className={className} onClick={() => setAberto(true)}>
        Contratar agora
      </Button>
      <ModalContratacaoSessao
        catalogo={catalogo}
        open={aberto}
        onOpenChange={setAberto}
        candidaturaPreSelecionada={candidaturaPreSelecionada}
        propostaPreSelecionada={propostaPreSelecionada}
      />
    </>
  );
}
