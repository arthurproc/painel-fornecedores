"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ContratosLista } from "@/components/handshake/contratos-lista";
import { Card, CardContent } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  getFornecedorByOrganizacao,
  getMembroById,
} from "@/lib/mock-data";

export default function FornecedorContratosHistoricoPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const historico = useMemo(
    () =>
      contratos.filter(
        (c) =>
          c.fornecedor_id === fornecedor?.id &&
          (c.status === "encerrado" || c.status === "cancelado")
      ),
    [fornecedor]
  );

  return (
    <AppShell tipo="fornecedor" titulo="Histórico de contratos">
      <div className="space-y-4">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Histórico de contratos</h1>
            <p className="text-sm text-muted-foreground">
              {historico.length} contrato(s) encerrado(s) ou cancelado(s)
            </p>
          </CardContent>
        </Card>
        <ContratosLista contratos={historico} lado="fornecedor" />
      </div>
    </AppShell>
  );
}
