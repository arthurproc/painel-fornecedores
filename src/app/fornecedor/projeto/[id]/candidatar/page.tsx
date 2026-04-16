"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormularioCandidatura } from "@/components/handshake/formulario-candidatura";
import {
  MEMBRO_LOGADO_ID,
  addDocumentoEmpresa,
  candidaturas,
  contratos,
  createCandidatura,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
} from "@/lib/mock-data";

export default function CandidatarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const [enviada, setEnviada] = useState(false);
  const candidaturaAtiva = Boolean(
    projeto &&
      fornecedor &&
      candidaturas.find(
        (candidatura) =>
          candidatura.projeto_id === projeto.id &&
          candidatura.fornecedor_id === fornecedor.id &&
          ["rascunho", "enviada", "shortlistada"].includes(candidatura.status)
      )
  );

  if (!projeto) {
    return (
      <AppShell tipo="fornecedor" titulo="Projeto não encontrado">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center">
            <p>Projeto não encontrado.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/fornecedor/projetos">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const contratosDestacaveis = fornecedor
    ? contratos.filter(
        (c) => c.fornecedor_id === fornecedor.id && c.status === "encerrado"
      )
    : [];

  function handleSubmit(payload: {
    pitch: string;
    capacidade_declarada: string;
    faixa_preco_preliminar?: string;
    contratos_destacados: string[];
    documentos_anexados: import("@/lib/mock-data").DocumentoCandidaturaAnexado[];
    documentos_manuais_meta: Record<string, { arquivoNome: string; validade: string; observacao: string }>;
  }) {
    if (!fornecedor || !membroLogado || !projeto) return;

    const documentosAnexados = payload.documentos_anexados.map((documento) => {
      if (documento.origem === "manual" || !documento.documento_empresa_id) {
        const meta = payload.documentos_manuais_meta[documento.documento_exigido_id];
        const novoDocumento = addDocumentoEmpresa(fornecedor.id, {
          nome: documento.nome,
          tipo: documento.nome.toLowerCase().includes("portfólio") ? "portfolio" : "outro",
          arquivo_nome: meta?.arquivoNome || documento.nome,
          arquivo_caminho: documento.arquivo_caminho,
          validade: meta?.validade || undefined,
          status: "vigente",
          observacao: meta?.observacao || undefined,
        });

        return {
          ...documento,
          documento_empresa_id: novoDocumento?.id,
          arquivo_caminho: novoDocumento?.arquivo_caminho ?? documento.arquivo_caminho,
        };
      }

      return documento;
    });

    createCandidatura({
      projeto_id: projeto.id,
      fornecedor_id: fornecedor.id,
      autor_membro_id: membroLogado.id,
      pitch: payload.pitch,
      contratos_destacados: payload.contratos_destacados,
      capacidade_declarada: payload.capacidade_declarada,
      faixa_preco_preliminar: payload.faixa_preco_preliminar,
      documentos_anexados: documentosAnexados,
      status: "enviada",
      revisada_consultoria: false,
      criada_em: "2026-04-15",
      enviada_em: "2026-04-15",
    });

    setEnviada(true);
    setTimeout(() => {
      router.push("/fornecedor/candidaturas");
    }, 1200);
  }

  return (
    <AppShell tipo="fornecedor" titulo="Enviar candidatura">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href={`/fornecedor/projeto/${projeto.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao projeto
        </Link>

        <Card className="rounded-xl">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Candidatura para</p>
            <h1 className="text-xl font-semibold leading-tight">{projeto.titulo}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {empresa?.nome ?? "Empresa"} · {projeto.cidade} · Prazo {projeto.prazo}
            </p>
          </CardContent>
        </Card>

        {enviada ? (
          <Card className="rounded-xl border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">Candidatura enviada!</p>
                <p className="mt-1 text-sm text-emerald-800">
                  Redirecionando para Minhas candidaturas… Você poderá editar enquanto estiver
                  aguardando triagem.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          candidaturaAtiva ? (
            <Card className="rounded-xl border-amber-200 bg-amber-50">
              <CardContent className="p-5 text-sm text-amber-900">
                Já existe uma candidatura ativa sua para este projeto. Volte ao projeto ou consulte Minhas candidaturas.
              </CardContent>
            </Card>
          ) : (
            <FormularioCandidatura
              projeto={projeto}
              fornecedor={fornecedor}
              contratosDestacaveis={contratosDestacaveis}
              onSubmit={handleSubmit}
            />
          )
        )}
      </div>
    </AppShell>
  );
}
