"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ContratosLista } from "@/components/handshake/contratos-lista";
import { Card, CardContent } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  empresas,
  getMembroById,
} from "@/lib/mock-data";

export default function EmpresaContratosHistoricoPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresa = empresas.find((e) => e.organizacao_id === membroLogado?.organizacao_id);

  const historico = useMemo(
    () =>
      contratos.filter(
        (c) =>
          c.empresa_id === empresa?.id &&
          (c.status === "encerrado" || c.status === "cancelado")
      ),
    [empresa]
  );

  return (
    <AppShell tipo="empresa" titulo="Histórico de contratos">
      <div className="space-y-4">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Histórico de contratos</h1>
            <p className="text-sm text-muted-foreground">
              {historico.length} contrato(s) encerrado(s) ou cancelado(s)
            </p>
          </CardContent>
        </Card>
        <ContratosLista contratos={historico} lado="empresa" />
      </div>
    </AppShell>
  );
}
