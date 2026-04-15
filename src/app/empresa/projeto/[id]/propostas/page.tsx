"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle2, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeaderProjeto } from "@/components/handshake/header-projeto";
import { cn } from "@/lib/utils";
import {
  candidaturas,
  empresas,
  fornecedores,
  projetos,
  propostas as propostasSeed,
  statusColors,
  statusLabels,
  type Proposta,
  type PropostaStatus,
} from "@/lib/mock-data";

export default function ComparacaoPropostasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;

  const [vencedoraLocal, setVencedoraLocal] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<Proposta | null>(null);

  const propostasDoProjeto = useMemo(() => {
    if (!projeto) return [];
    return propostasSeed
      .map((proposta) => {
        const candidatura = candidaturas.find((c) => c.id === proposta.candidatura_id);
        if (candidatura?.projeto_id !== projeto.id) return null;
        const fornecedor = candidatura
          ? fornecedores.find((f) => f.id === candidatura.fornecedor_id)
          : undefined;
        return { proposta, candidatura, fornecedor };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.proposta.status !== "rascunho");
  }, [projeto]);

  function statusEfetivo(proposta: Proposta): PropostaStatus {
    if (vencedoraLocal) {
      if (proposta.id === vencedoraLocal) return "vencedora";
      if (proposta.status === "vencedora" || proposta.status === "enviada") return "perdedora";
    }
    return proposta.status;
  }

  if (!projeto) {
    return (
      <AppShell tipo="empresa" titulo="Comparar propostas">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center">Projeto não encontrado.</CardContent>
        </Card>
      </AppShell>
    );
  }

  const propostaVencedoraExistente = propostasDoProjeto.find(
    (p) => p.proposta.status === "vencedora"
  );

  return (
    <AppShell tipo="empresa" titulo="Comparar propostas">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href={`/empresa/projeto/${projeto.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao projeto
        </Link>

        <HeaderProjeto projeto={projeto} empresa={empresa} />

        {(vencedoraLocal || propostaVencedoraExistente) && (
          <Card className="rounded-xl border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-center gap-3 p-4 text-sm text-emerald-900">
              <Award className="h-4 w-4" />
              Vencedora selecionada — contrato criado automaticamente. Acompanhe em{" "}
              <Link
                href="/empresa/contratos/em-execucao"
                className="font-medium underline underline-offset-2"
              >
                Contratos em execução
              </Link>
              .
            </CardContent>
          </Card>
        )}

        {propostasDoProjeto.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma proposta formal recebida para este projeto.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[720px] grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] gap-3">
              <HeaderLinha label="" />
              {propostasDoProjeto.map(({ proposta, fornecedor }) => {
                const statusLocal = statusEfetivo(proposta);
                const vencedor = statusLocal === "vencedora";
                return (
                  <Card
                    key={proposta.id}
                    className={cn("rounded-xl", vencedor && "border-emerald-400 bg-emerald-50/50")}
                  >
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {fornecedor?.logo ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {fornecedor?.nome ?? "Fornecedor"}
                          </p>
                          <Badge variant="secondary" className={statusColors[statusLocal]}>
                            {statusLabels[statusLocal]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {[
                { label: "Preço final", render: (p: Proposta) => p.preco_final },
                { label: "Prazo de entrega", render: (p: Proposta) => p.prazo_entrega },
                {
                  label: "Etapas do cronograma",
                  render: (p: Proposta) => `${p.cronograma.etapas.length} etapas`,
                },
                {
                  label: "Documentos anexos",
                  render: (p: Proposta) =>
                    p.documentos_anexos.length === 0
                      ? "—"
                      : `${p.documentos_anexos.length} documento(s)`,
                },
                {
                  label: "Revisada pela Consultoria?",
                  render: (p: Proposta) => (p.revisada_consultoria ? "Sim" : "Não"),
                },
                {
                  label: "Escopo",
                  render: (p: Proposta) => p.escopo_detalhado,
                  multiline: true,
                },
              ].map((linha) => (
                <LinhaComparacao
                  key={linha.label}
                  label={linha.label}
                  propostas={propostasDoProjeto.map((x) => x.proposta)}
                  render={linha.render}
                  multiline={linha.multiline}
                />
              ))}

              <HeaderLinha label="" />
              {propostasDoProjeto.map(({ proposta }) => {
                const statusLocal = statusEfetivo(proposta);
                const podeSelecionar = !vencedoraLocal && !propostaVencedoraExistente;
                return (
                  <div key={proposta.id} className="rounded-xl border border-border bg-card p-3">
                    {statusLocal === "vencedora" ? (
                      <Badge className="w-full justify-center bg-emerald-100 text-emerald-800">
                        Vencedora
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1"
                        disabled={!podeSelecionar}
                        onClick={() => setConfirmando(proposta)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Selecionar
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Dialog open={Boolean(confirmando)} onOpenChange={(v) => !v && setConfirmando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar proposta vencedora</DialogTitle>
            <DialogDescription>
              As demais propostas serão marcadas como perdedoras e um contrato será criado
              automaticamente.
            </DialogDescription>
          </DialogHeader>
          {confirmando && (
            <div className="rounded-lg border border-border p-3 text-sm">
              <p className="font-semibold">
                {fornecedores.find((f) => {
                  const candidatura = candidaturas.find((c) => c.id === confirmando.candidatura_id);
                  return candidatura && f.id === candidatura.fornecedor_id;
                })?.nome ?? "Fornecedor"}
              </p>
              <p className="text-muted-foreground">
                {confirmando.preco_final} · {confirmando.prazo_entrega}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmando(null)}>
              <X className="mr-1 h-4 w-4" /> Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmando) {
                  setVencedoraLocal(confirmando.id);
                  setConfirmando(null);
                }
              }}
              className="gap-1"
            >
              <Award className="h-4 w-4" /> Confirmar vencedora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function HeaderLinha({ label }: { label: string }) {
  return (
    <div className="flex items-center px-2 text-sm font-semibold text-foreground">{label}</div>
  );
}

function LinhaComparacao({
  label,
  propostas,
  render,
  multiline,
}: {
  label: string;
  propostas: Proposta[];
  render: (p: Proposta) => string;
  multiline?: boolean;
}) {
  return (
    <>
      <div className="flex items-start px-2 py-3 text-xs font-medium uppercase text-muted-foreground">
        {label}
      </div>
      {propostas.map((proposta) => (
        <div
          key={proposta.id + label}
          className={cn(
            "rounded-xl border border-border bg-card p-3 text-sm",
            multiline ? "whitespace-pre-wrap" : "truncate"
          )}
        >
          {render(proposta)}
        </div>
      ))}
    </>
  );
}
