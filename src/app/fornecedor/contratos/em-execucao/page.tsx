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

export default function FornecedorContratosExecucaoPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const ativos = useMemo(
    () => contratos.filter((c) => c.fornecedor_id === fornecedor?.id && c.status === "em_execucao"),
    [fornecedor]
  );

  return (
    <AppShell tipo="fornecedor" titulo="Contratos em execução">
      <div className="space-y-4">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Contratos em execução</h1>
            <p className="text-sm text-muted-foreground">
              {ativos.length} contrato(s) em andamento
            </p>
          </CardContent>
        </Card>
        <ContratosLista contratos={ativos} lado="fornecedor" />
      </div>
    </AppShell>
  );
}
