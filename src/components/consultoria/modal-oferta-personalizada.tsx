"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ADVISOR_LOGADO_ID,
  catalogoConsultoria,
  criarOfertaOutreach,
  type Fornecedor,
} from "@/lib/mock-data";

interface ModalOfertaPersonalizadaProps {
  fornecedor: Fornecedor;
  motivoLead: string;
  catalogoSugeridoId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnviar?: () => void;
}

export function ModalOfertaPersonalizada({
  fornecedor,
  motivoLead,
  catalogoSugeridoId,
  open,
  onOpenChange,
  onEnviar,
}: ModalOfertaPersonalizadaProps) {
  const [selecionado, setSelecionado] = useState<string>(
    catalogoSugeridoId ?? catalogoConsultoria[0]?.id ?? ""
  );
  const [mensagem, setMensagem] = useState(
    `Olá ${fornecedor.nome}, notamos um movimento recente no seu perfil e acredito que uma sessão pode ajudar.`
  );
  const [desconto, setDesconto] = useState<string>("");
  const [sucesso, setSucesso] = useState(false);

  function handleEnviar() {
    if (!selecionado || !mensagem.trim()) return;
    const descontoNum = desconto ? Number(desconto) : undefined;
    criarOfertaOutreach({
      fornecedor_id: fornecedor.id,
      owner_id: ADVISOR_LOGADO_ID,
      mensagem: mensagem.trim(),
      catalogo_sugerido_id: selecionado,
      desconto_percentual: Number.isFinite(descontoNum) ? descontoNum : undefined,
      motivo_lead: motivoLead,
    });
    setSucesso(true);
    window.setTimeout(() => {
      setSucesso(false);
      onOpenChange(false);
      onEnviar?.();
    }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle>Enviar oferta personalizada</DialogTitle>
          </div>
          <DialogDescription>
            Mensagem será entregue como notificação in-app ao fornecedor.
          </DialogDescription>
        </DialogHeader>

        {sucesso ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Oferta enviada para {fornecedor.nome}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
              <p className="font-medium text-foreground">Sinal detectado</p>
              <p className="mt-1 text-muted-foreground">{motivoLead}</p>
            </div>

            <div className="space-y-2">
              <Label>Serviço sugerido</Label>
              <div className="space-y-1">
                {catalogoConsultoria
                  .filter((c) => c.ativo)
                  .map((c) => {
                    const ativo = selecionado === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelecionado(c.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          ativo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        )}
                      >
                        <span>{c.nome}</span>
                        <span className="text-xs text-muted-foreground">{c.preco_valor}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desconto">Desconto (% opcional)</Label>
              <Input
                id="desconto"
                type="number"
                min={0}
                max={100}
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                placeholder="Ex.: 20"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEnviar} disabled={!selecionado || !mensagem.trim()}>
                Enviar oferta
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
