"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { avaliarAtendimento, type SessaoConsultoria } from "@/lib/mock-data";

interface ModalAvaliarAtendimentoProps {
  sessao: SessaoConsultoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSalvar?: () => void;
}

export function ModalAvaliarAtendimento({
  sessao,
  open,
  onOpenChange,
  onSalvar,
}: ModalAvaliarAtendimentoProps) {
  const [nota, setNota] = useState<1 | 2 | 3 | 4 | 5>(
    (sessao.avaliacao_atendimento?.nota as 1 | 2 | 3 | 4 | 5) ?? 5
  );
  const [comentario, setComentario] = useState(sessao.avaliacao_atendimento?.comentario ?? "");

  function handleSalvar() {
    avaliarAtendimento(sessao.id, nota, comentario.trim() || undefined);
    onSalvar?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar atendimento</DialogTitle>
          <DialogDescription>
            Seu feedback interno é visto pelo time da Consultoria e ajuda a melhorar sessões futuras.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nota</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((valor) => {
                const ativo = valor <= nota;
                return (
                  <button
                    type="button"
                    key={valor}
                    onClick={() => setNota(valor as 1 | 2 | 3 | 4 | 5)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        ativo ? "fill-amber-400 stroke-amber-500" : "stroke-muted-foreground"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario-avaliacao">Comentário (opcional)</Label>
            <Textarea
              id="comentario-avaliacao"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que foi útil? O que poderia melhorar?"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>Salvar avaliação</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
