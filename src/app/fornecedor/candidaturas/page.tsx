"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CardCandidatura } from "@/components/handshake/card-candidatura";
import { CTAConsultoria } from "@/components/handshake/cta-consultoria";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
  type Candidatura,
  type CandidaturaStatus,
} from "@/lib/mock-data";

type FiltroFornecedor = "todas" | CandidaturaStatus;

const ABAS: { value: FiltroFornecedor; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "rascunho", label: "Rascunhos" },
  { value: "enviada", label: "Aguardando triagem" },
  { value: "shortlistada", label: "Selecionadas para proposta" },
  { value: "descartada", label: "Descartadas" },
  { value: "retirada", label: "Retiradas" },
  { value: "expirada", label: "Expiradas" },
];

export default function MinhasCandidaturasPage() {
  const [aba, setAba] = useState<FiltroFornecedor>("todas");
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const lista = useMemo(() => {
    if (!fornecedor) return [] as Candidatura[];
    return candidaturas
      .filter((c) => c.fornecedor_id === fornecedor.id)
      .sort((a, b) => {
        const da = a.enviada_em ?? a.criada_em;
        const db = b.enviada_em ?? b.criada_em;
        return db.localeCompare(da);
      });
  }, [fornecedor]);

  const filtradas = lista.filter((c) => aba === "todas" || c.status === aba);

  return (
    <AppShell tipo="fornecedor" titulo="Minhas candidaturas">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Minhas candidaturas</h1>
              <p className="text-sm text-muted-foreground">
                {lista.length} candidatura(s) — enviadas e em rascunho
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/fornecedor/projetos">Descobrir novos projetos</Link>
            </Button>
          </CardContent>
        </Card>

        <Tabs value={aba} onValueChange={(v) => setAba(v as FiltroFornecedor)}>
          <TabsList className="flex h-auto flex-wrap">
            {ABAS.map((a) => (
              <TabsTrigger key={a.value} value={a.value}>
                {a.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={aba} className="mt-4 space-y-3">
            {filtradas.length === 0 ? (
              <Card className="rounded-xl border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  Nenhuma candidatura nesta aba.
                </CardContent>
              </Card>
            ) : (
              filtradas.map((candidatura) => {
                const projeto = projetos.find((p) => p.id === candidatura.projeto_id);
                const empresa = projeto
                  ? empresas.find((e) => e.id === projeto.empresa_id)
                  : undefined;
                const acao =
                  candidatura.status === "descartada" ? (
                    <CTAConsultoria variante={3} size="sm" />
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/fornecedor/projeto/${candidatura.projeto_id}`}>
                        Ver projeto
                      </Link>
                    </Button>
                  );
                return (
                  <CardCandidatura
                    key={candidatura.id}
                    candidatura={candidatura}
                    projeto={projeto}
                    empresa={empresa}
                    fornecedor={fornecedor}
                    ladoDireito="empresa"
                    acao={acao}
                  />
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
