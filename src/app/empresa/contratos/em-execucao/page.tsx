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

export default function EmpresaContratosExecucaoPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresa = empresas.find((e) => e.organizacao_id === membroLogado?.organizacao_id);

  const ativos = useMemo(
    () => contratos.filter((c) => c.empresa_id === empresa?.id && c.status === "em_execucao"),
    [empresa]
  );

  return (
    <AppShell tipo="empresa" titulo="Contratos em execução">
      <div className="space-y-4">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Contratos em execução</h1>
            <p className="text-sm text-muted-foreground">
              {ativos.length} contrato(s) em andamento
            </p>
          </CardContent>
        </Card>
        <ContratosLista
          contratos={ativos}
          lado="empresa"
          vazio="Nenhum contrato em execução. Selecione um fornecedor na comparação de propostas para iniciar um."
        />
      </div>
    </AppShell>
  );
}
