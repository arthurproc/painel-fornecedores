"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
  propostaView,
  propostas,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";

export default function PropostasFornecedorPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const minhas = useMemo(() => {
    if (!fornecedor) return [];
    return propostas
      .map((proposta) => propostaView(proposta))
      .filter((view) => view.candidatura?.fornecedor_id === fornecedor.id)
      .sort((a, b) =>
        (b.proposta.enviada_em ?? b.proposta.criada_em).localeCompare(
          a.proposta.enviada_em ?? a.proposta.criada_em
        )
      );
  }, [fornecedor]);

  const shortlistSemProposta = useMemo(() => {
    if (!fornecedor) return [];
    return candidaturas
      .filter(
        (c) =>
          c.fornecedor_id === fornecedor.id &&
          c.status === "shortlistada" &&
          !propostas.some((p) => p.candidatura_id === c.id)
      )
      .map((candidatura) => {
        const projeto = projetos.find((p) => p.id === candidatura.projeto_id);
        const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
        return { candidatura, projeto, empresa };
      });
  }, [fornecedor]);

  return (
    <AppShell tipo="fornecedor" titulo="Propostas formais">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Propostas formais</h1>
            <p className="text-sm text-muted-foreground">
              {minhas.length} proposta(s) em andamento · {shortlistSemProposta.length} seleção(ões)
              para proposta aguardando envio
            </p>
          </CardContent>
        </Card>

        {shortlistSemProposta.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Selecionadas para proposta aguardando envio
            </h2>
            {shortlistSemProposta.map(({ candidatura, projeto, empresa }) => (
              <Card key={candidatura.id} className="rounded-xl border-amber-200 bg-amber-50/50">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{projeto?.titulo ?? "Projeto"}</p>
                    <p className="text-xs text-muted-foreground">
                      {empresa?.nome ?? "Empresa"} · prazo {projeto?.prazo ?? "—"}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/fornecedor/proposta/${candidatura.id}`}>Redigir proposta</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Propostas em andamento
          </h2>
          {minhas.length === 0 ? (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Nenhuma proposta formal submetida ainda.
              </CardContent>
            </Card>
          ) : (
            minhas.map(({ proposta, candidatura, projeto, empresa }) => (
              <Card key={proposta.id} className="rounded-xl">
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{projeto?.titulo ?? "Projeto"}</p>
                      <p className="text-xs text-muted-foreground">
                        {empresa?.nome ?? "Empresa"} · {proposta.preco_final} ·{" "}
                        {proposta.prazo_entrega}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusColors[proposta.status]}>
                      {statusLabels[proposta.status]}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {proposta.escopo_detalhado}
                  </p>
                  <div className="flex justify-end">
                    {candidatura && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/fornecedor/proposta/${candidatura.id}`}>
                          {proposta.status === "rascunho" ? "Continuar edição" : "Ver proposta"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </AppShell>
  );
}
