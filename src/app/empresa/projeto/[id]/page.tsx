import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  FileText,
  Users,
} from "lucide-react";
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
import {
  computeContagensProjeto,
  getContratoByProjeto,
  getEmpresaById,
  projetos,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";
import type { Projeto } from "@/lib/mock-data";

interface AcaoContextual {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  descricao: string;
  variant?: "default" | "outline";
}

function acoesPorStatus(projeto: Projeto, contratoId?: string): AcaoContextual[] {
  switch (projeto.status) {
    case "rascunho":
      return [];
    case "publicado":
    case "em_triagem":
      return [
        {
          label: "Ver triagem",
          href: `/empresa/projeto/${projeto.id}/triagem`,
          icon: Users,
          descricao: "Avaliar candidaturas recebidas e promover para proposta formal.",
        },
      ];
    case "em_propostas":
      return [
        {
          label: "Comparar propostas",
          href: `/empresa/projeto/${projeto.id}/propostas`,
          icon: FileText,
          descricao: "Ver propostas formais recebidas e escolher vencedora.",
        },
        {
          label: "Ver triagem",
          href: `/empresa/projeto/${projeto.id}/triagem`,
          icon: Users,
          descricao: "Revisitar candidaturas selecionadas para proposta.",
          variant: "outline",
        },
      ];
    case "fechado":
      return contratoId
        ? [
            {
              label: "Ver contrato",
              href: `/empresa/contratos/${contratoId}`,
              icon: FileText,
              descricao: "Contrato vigente com o fornecedor selecionado.",
            },
          ]
        : [];
    case "cancelado":
    case "expirado":
      return [];
  }
}

export default function ProjetoEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);

  if (!projeto) {
    return (
      <AppShell tipo="empresa" titulo="Projeto não encontrado">
        <Card className="mx-auto max-w-xl rounded-xl">
          <CardContent className="space-y-3 p-6 text-sm">
            <p className="font-medium">Este projeto não existe ou foi removido.</p>
            <Button asChild variant="outline">
              <Link href="/empresa/projetos">Voltar para meus projetos</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const empresa = getEmpresaById(projeto.empresa_id);
  const contrato = getContratoByProjeto(projeto.id);
  const contagens = computeContagensProjeto(projeto.id);
  const acoes = acoesPorStatus(projeto, contrato?.id);

  return (
    <AppShell tipo="empresa" titulo="Detalhes do projeto">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/empresa/projetos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para meus projetos
        </Link>

        <HeaderProjeto projeto={projeto} empresa={empresa} />

        <Card className="rounded-xl">
          <CardContent className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{projeto.orcamento}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Prazo {projeto.prazo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {contagens.candidaturas} candidaturas · {contagens.shortlist}{" "}
                  selecionadas para proposta · {contagens.propostas} propostas
                </span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Descrição</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {projeto.descricao}
              </p>
            </div>
          </CardContent>
        </Card>

        {projeto.status === "rascunho" && (
          <Card className="rounded-xl border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-900">
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">Este projeto ainda está em rascunho.</p>
                <p className="mt-1 text-xs">
                  A edição de rascunho ainda não está disponível no mockup. Use o
                  formulário de novo projeto para criar outra versão.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(projeto.status === "cancelado" || projeto.status === "expirado") && (
          <Card className="rounded-xl border-gray-200 bg-gray-50">
            <CardContent className="flex items-start gap-3 p-4 text-sm text-gray-700">
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">
                  Projeto {statusLabels[projeto.status].toLowerCase()}.
                </p>
                <p className="mt-1 text-xs">
                  Este projeto não está mais aceitando candidaturas ou propostas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {acoes.length > 0 && (
          <Card className="rounded-xl">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Próximos passos</h2>
                <Badge variant="secondary" className={statusColors[projeto.status]}>
                  {statusLabels[projeto.status]}
                </Badge>
              </div>
              <div className="space-y-2">
                {acoes.map((acao) => (
                  <Link key={acao.href} href={acao.href} className="block">
                    <div className="group flex items-start justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5">
                      <div className="flex items-start gap-3">
                        <acao.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{acao.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {acao.descricao}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BlocoCriterios criterios={projeto.criterios_selecao} />
          <BlocoDocumentos documentos={projeto.documentos_exigidos} />
        </div>
        <BlocoRequisitos requisitos={projeto.requisitos} />

        {contrato && projeto.status === "fechado" && (
          <Card className="rounded-xl">
            <CardContent className="flex items-start justify-between gap-3 p-5 text-sm">
              <div>
                <p className="font-medium">Contrato vigente</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  #{contrato.id} · {contrato.valor_final} · fechado em{" "}
                  {contrato.data_fechamento}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/empresa/contratos/${contrato.id}`}>
                  Ver contrato <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
