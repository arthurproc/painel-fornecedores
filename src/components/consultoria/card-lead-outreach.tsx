"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModalOfertaPersonalizada } from "./modal-oferta-personalizada";
import type { Fornecedor } from "@/lib/mock-data";

export interface Lead {
  fornecedor: Fornecedor;
  sinal: string;
  detalhes: string[];
  sugestao_catalogo_id: string;
  recencia: string;
}

interface CardLeadOutreachProps {
  lead: Lead;
  onEnviou?: () => void;
}

export function CardLeadOutreach({ lead, onEnviou }: CardLeadOutreachProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Card className="rounded-xl">
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-base font-semibold">{lead.fornecedor.nome}</p>
              <p className="text-xs text-muted-foreground">
                {lead.fornecedor.categorias.join(" · ")} · {lead.fornecedor.regiao}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              {lead.recencia}
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <p className="font-medium">Sinal: {lead.sinal}</p>
            {lead.detalhes.length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {lead.detalhes.map((d, idx) => (
                  <li key={idx}>▸ {d}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" disabled>
              Ignorar 30d
            </Button>
            <Button size="sm" onClick={() => setAberto(true)}>
              Enviar oferta personalizada
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModalOfertaPersonalizada
        fornecedor={lead.fornecedor}
        motivoLead={lead.sinal}
        catalogoSugeridoId={lead.sugestao_catalogo_id}
        open={aberto}
        onOpenChange={setAberto}
        onEnviar={onEnviou}
      />
    </>
  );
}
