"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, ExternalLink, Send } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderProjeto } from "@/components/handshake/header-projeto";
import {
  BlocoCriterios,
  BlocoDocumentos,
  BlocoRequisitos,
} from "@/components/handshake/blocos-projeto";
import { CTAConsultoria } from "@/components/handshake/cta-consultoria";
import {
  MEMBRO_LOGADO_ID,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
  candidaturas,
} from "@/lib/mock-data";
import { computeFitScore } from "@/lib/fit-score";

export default function ProjetoFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);

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

  const empresa = empresas.find((e) => e.id === projeto.empresa_id);
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");
  const breakdown = computeFitScore(projeto, fornecedor);

  const candidaturaExistente = candidaturas.find(
    (c) => c.projeto_id === projeto.id && c.fornecedor_id === fornecedor?.id
  );

  const podeCandidatar =
    (projeto.status === "publicado" || projeto.status === "em_triagem") &&
    !candidaturaExistente;

  return (
    <AppShell tipo="fornecedor" titulo="Detalhes do projeto">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/fornecedor/projetos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para descobrir projetos
        </Link>

        <HeaderProjeto
          projeto={projeto}
          empresa={empresa}
          breakdown={breakdown}
          empresaHref={empresa ? `/perfil/empresa/${empresa.id}` : undefined}
        />

        <Card className="rounded-xl">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="text-base font-semibold">Descrição do escopo</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {projeto.descricao}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <InfoCelula
                icone={<DollarSign className="h-4 w-4 text-primary" />}
                label="Orçamento"
                value={projeto.orcamento}
              />
              <InfoCelula
                icone={<Calendar className="h-4 w-4 text-primary" />}
                label="Prazo para propostas"
                value={projeto.prazo}
              />
              <InfoCelula label="Categoria" value={projeto.categoria} />
              <InfoCelula label="Cidade" value={projeto.cidade} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BlocoCriterios criterios={projeto.criterios_selecao} />
          <BlocoDocumentos documentos={projeto.documentos_exigidos} />
        </div>

        <BlocoRequisitos requisitos={projeto.requisitos} />

        <Card className="rounded-xl bg-muted/40">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h3 className="text-base font-semibold">Pronto para se candidatar?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A candidatura é leve e serve como manifestação de interesse. Se ela for
                selecionada para proposta, você será convidado a enviar a proposta formal.
              </p>
              {candidaturaExistente && (
                <Badge variant="secondary" className="mt-2">
                  Você já enviou uma candidatura
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {empresa && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/perfil/empresa/${empresa.id}`}>
                    <ExternalLink className="h-3.5 w-3.5" /> Ver perfil da empresa
                  </Link>
                </Button>
              )}
              {podeCandidatar ? (
                <Button asChild className="gap-2">
                  <Link href={`/fornecedor/projeto/${projeto.id}/candidatar`}>
                    <Send className="h-4 w-4" /> Candidatar-se
                  </Link>
                </Button>
              ) : (
                <Button disabled className="gap-2">
                  <Send className="h-4 w-4" />{" "}
                  {candidaturaExistente ? "Candidatura enviada" : "Projeto fechado"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-amber-200 bg-amber-50/50">
          <CardContent className="flex flex-col items-start justify-between gap-3 p-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-medium text-amber-900">
                Quer um especialista revisando antes de enviar?
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Revisão de candidatura da Consultoria, com foco em aumentar sua chance de
                seleção para proposta.
              </p>
            </div>
            <CTAConsultoria variante={1} size="sm" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function InfoCelula({
  icone,
  label,
  value,
}: {
  icone?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      {icone}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
