"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type CTAConsultoriaVariante = 1 | 2 | 3;

interface CTAConsultoriaProps {
  variante: CTAConsultoriaVariante;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const textos: Record<CTAConsultoriaVariante, { titulo: string; descricao: string; botao: string }> = {
  1: {
    titulo: "Revisão de candidatura",
    descricao:
      "Um especialista da Consultoria lê sua candidatura, o projeto e o perfil da empresa, e devolve notas em até 48h para você ajustar antes de enviar.",
    botao: "Quer revisar com a Consultoria?",
  },
  2: {
    titulo: "Revisão de proposta formal",
    descricao:
      "Leitura profunda da sua proposta — escopo, precificação, cronograma e documentos. Disponível como pacote success-fee contingente à vitória.",
    botao: "Revisar proposta com a Consultoria",
  },
  3: {
    titulo: "Retorno pós-descarte",
    descricao:
      "Uma sessão diagnóstica para entender por que a candidatura não avançou e como reposicionar narrativa para as próximas.",
    botao: "Entender o descarte com a Consultoria",
  },
};

export function CTAConsultoria({ variante, className, size = "default" }: CTAConsultoriaProps) {
  const [aberto, setAberto] = useState(false);
  const texto = textos[variante];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        className={cn("gap-2 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100", className)}
        onClick={() => setAberto(true)}
      >
        <Sparkles className="h-4 w-4" /> {texto.botao}
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <DialogTitle>{texto.titulo}</DialogTitle>
            </div>
            <DialogDescription>{texto.descricao}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/50 p-4 text-sm text-amber-900">
            <p className="font-medium">Em construção</p>
            <p className="mt-1 text-amber-800">
              O catálogo e a contratação de sessões de Consultoria entram na Fase 6.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setAberto(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
