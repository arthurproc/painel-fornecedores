"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motivosDescarte } from "@/lib/mock-data";

interface ModalDescarteProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  fornecedorNome: string;
  onConfirmar: (motivoId: string, comentario: string) => void;
}

export function ModalDescarte({
  aberto,
  onOpenChange,
  fornecedorNome,
  onConfirmar,
}: ModalDescarteProps) {
  const [motivo, setMotivo] = useState<string>("");
  const [comentario, setComentario] = useState("");

  function reset() {
    setMotivo("");
    setComentario("");
  }

  function handleConfirmar() {
    if (!motivo) return;
    onConfirmar(motivo, comentario);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Descartar candidatura</DialogTitle>
          <DialogDescription>
            Estamos descartando a candidatura de <strong>{fornecedorNome}</strong>. O motivo é
            obrigatório — ele alimenta o feedback estruturado e a inteligência da plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Motivo do descarte</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivosDescarte
                  .filter((m) => m.ativo)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Comentário (opcional)</Label>
            <Textarea
              rows={3}
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              placeholder="Detalhe o motivo — ajuda o fornecedor a se reposicionar para próximas oportunidades."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmar} disabled={!motivo}>
            Descartar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
