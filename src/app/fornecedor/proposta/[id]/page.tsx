"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormularioProposta } from "@/components/handshake/formulario-proposta";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  empresas,
  fornecedores,
  projetos,
  propostas,
} from "@/lib/mock-data";
import { useAutoResolucaoNotificacao } from "@/lib/notifications";

export default function PropostaFormalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const candidatura = candidaturas.find((c) => c.id === id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const fornecedor = candidatura
    ? fornecedores.find((f) => f.id === candidatura.fornecedor_id)
    : undefined;
  const propostaExistente = candidatura
    ? propostas.find((p) => p.candidatura_id === candidatura.id)
    : undefined;

  const [enviada, setEnviada] = useState(false);

  useAutoResolucaoNotificacao({
    memberId: MEMBRO_LOGADO_ID,
    types: ["F3"],
    contextEntity: "candidatura",
    contextId: id,
  });

  if (!candidatura || !projeto) {
    return (
      <AppShell tipo="fornecedor" titulo="Proposta não encontrada">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center">
            <p>Candidatura não encontrada.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/fornecedor/candidaturas">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (candidatura.status !== "shortlistada") {
    return (
      <AppShell tipo="fornecedor" titulo="Proposta formal">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center space-y-3">
            <Badge variant="secondary">Aguardando shortlist</Badge>
            <p className="text-sm text-muted-foreground">
              Propostas formais só podem ser submetidas após a empresa confirmar a shortlist.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/fornecedor/candidaturas">Ver candidaturas</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  function handleSubmit() {
    setEnviada(true);
    setTimeout(() => router.push("/fornecedor/propostas"), 1200);
  }

  return (
    <AppShell tipo="fornecedor" titulo="Enviar proposta formal">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/fornecedor/candidaturas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar às candidaturas
        </Link>

        <Card className="rounded-xl">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs text-muted-foreground">Proposta formal para</p>
            <h1 className="text-xl font-semibold leading-tight">{projeto.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {empresa?.nome ?? "Empresa"} · {fornecedor?.nome ?? "Fornecedor"} · Prazo{" "}
              {projeto.prazo}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Faixa preliminar declarada: <strong>{candidatura.faixa_preco_preliminar ?? "—"}</strong>
            </p>
          </CardContent>
        </Card>

        {enviada ? (
          <Card className="rounded-xl border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">Proposta enviada!</p>
                <p className="mt-1 text-sm text-emerald-800">
                  Redirecionando para Propostas formais…
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FormularioProposta
            escopoInicial={propostaExistente?.escopo_detalhado}
            etapasIniciais={
              propostaExistente?.cronograma.etapas.map((etapa, index) => ({
                id: `etp-${index}`,
                titulo: etapa.titulo,
                prazo: etapa.prazo,
                descricao: etapa.descricao,
              })) ?? []
            }
            precoInicial={propostaExistente?.preco_final}
            prazoInicial={propostaExistente?.prazo_entrega}
            observacoesIniciais={propostaExistente?.observacoes}
            documentosIniciais={(propostaExistente?.documentos_anexos ?? []).map((doc) => ({
              id: doc.id,
              nome: doc.nome,
              enviado_em: doc.enviado_em,
            }))}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AppShell>
  );
}
