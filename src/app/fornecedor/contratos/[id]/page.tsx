"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetalheContrato } from "@/components/handshake/detalhe-contrato";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  getFornecedorByOrganizacao,
  getMembroById,
} from "@/lib/mock-data";

export default function DetalheContratoFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const contrato = contratos.find((c) => c.id === id);
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const podeEncerrar =
    contrato?.fornecedor_id === fornecedor?.id &&
    (membroLogado?.role === "owner" || membroLogado?.role === "admin");

  return (
    <AppShell tipo="fornecedor" titulo="Contrato">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link
          href="/fornecedor/contratos/em-execucao"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos contratos
        </Link>

        {contrato ? (
          <DetalheContrato contrato={contrato} lado="fornecedor" podeEncerrar={Boolean(podeEncerrar)} />
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-8 text-center space-y-3">
              <p>Contrato não encontrado.</p>
              <Button asChild variant="outline">
                <Link href="/fornecedor/contratos/em-execucao">Voltar</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
