"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormularioReview, type LadoReview } from "@/components/handshake/formulario-review";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  empresas,
  fornecedores,
  getMembroById,
  projetos,
  reviews,
} from "@/lib/mock-data";
import { useAutoResolucaoNotificacao } from "@/lib/notifications";

export default function NovoReviewPage({
  params,
}: {
  params: Promise<{ contratoId: string }>;
}) {
  const { contratoId } = use(params);
  const contrato = contratos.find((c) => c.id === contratoId);
  const projeto = contrato ? projetos.find((p) => p.id === contrato.projeto_id) : undefined;
  const empresa = contrato ? empresas.find((e) => e.id === contrato.empresa_id) : undefined;
  const fornecedor = contrato ? fornecedores.find((f) => f.id === contrato.fornecedor_id) : undefined;
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);

  const [submetida, setSubmetida] = useState(false);

  useAutoResolucaoNotificacao({
    memberId: MEMBRO_LOGADO_ID,
    types: ["E8", "F7"],
    contextEntity: "contrato",
    contextId: contratoId,
  });

  if (!contrato) {
    return (
      <Card className="rounded-xl">
        <CardContent className="p-8 text-center">Contrato não encontrado.</CardContent>
      </Card>
    );
  }

  const meuLadoEhEmpresa = membroLogado?.organizacao_id === empresa?.organizacao_id;
  const meuLadoEhFornecedor = membroLogado?.organizacao_id === fornecedor?.organizacao_id;
  const eusouEmpresa = meuLadoEhEmpresa && !meuLadoEhFornecedor;
  const eusouFornecedor = meuLadoEhFornecedor && !meuLadoEhEmpresa;

  const avaliadoLado: LadoReview = eusouEmpresa
    ? "fornecedor"
    : eusouFornecedor
      ? "empresa"
      : "fornecedor";

  const reviewPar = reviews.find(
    (r) => r.contrato_id === contrato.id && r.avaliado_org_tipo !== avaliadoLado
  );
  const parJaSubmeteu = reviewPar?.status === "submetida" || reviewPar?.status === "liberada";

  return (
    <div className="space-y-6">
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar às reviews
      </Link>

      <Card className="rounded-xl">
        <CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Review do contrato</p>
          <h1 className="text-xl font-semibold leading-tight">{projeto?.titulo ?? "Projeto"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Avaliando: {avaliadoLado === "empresa" ? empresa?.nome : fornecedor?.nome} · Contrato{" "}
            {contrato.id}
          </p>
          {parJaSubmeteu && (
            <p className="mt-2 text-xs text-emerald-800">
              O parceiro já submeteu a review dele — assim que você enviar, ambas são liberadas
              juntas.
            </p>
          )}
        </CardContent>
      </Card>

      {submetida ? (
        <Card className="rounded-xl border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-start gap-3 p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-900">Review submetida!</p>
              <p className="mt-1 text-sm text-emerald-800">
                Status “aguardando contraparte” — ela aparece na aba Dadas. Reviews são reveladas
                quando ambos submetem (ou em 14 dias, o que vier primeiro).
              </p>
              <Button asChild className="mt-3" size="sm" variant="outline">
                <Link href="/reviews">Voltar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <FormularioReview avaliadoLado={avaliadoLado} onSubmit={() => setSubmetida(true)} />
      )}
    </div>
  );
}
