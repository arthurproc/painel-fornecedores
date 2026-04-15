"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardLeadOutreach, type Lead } from "@/components/consultoria/card-lead-outreach";
import {
  ADVISOR_LOGADO_ID,
  advisors,
  candidaturas,
  fornecedores,
  getOfertasPorFornecedor,
  ofertasOutreach,
} from "@/lib/mock-data";

function computarLeads(): Lead[] {
  const leads: Lead[] = [];

  for (const fornecedor of fornecedores) {
    const cDescartadas = candidaturas
      .filter((c) => c.fornecedor_id === fornecedor.id && c.status === "descartada")
      .sort((a, b) => (b.decidida_em ?? "").localeCompare(a.decidida_em ?? ""));

    if (cDescartadas.length >= 1) {
      leads.push({
        fornecedor,
        sinal:
          cDescartadas.length >= 2
            ? `${cDescartadas.length} candidaturas descartadas recentemente`
            : "Candidatura descartada recentemente",
        detalhes: cDescartadas.slice(0, 3).map(
          (c) =>
            `Candidatura ${c.id}${c.motivo_descarte?.categoria_id ? ` — motivo: ${c.motivo_descarte.categoria_id}` : ""}`
        ),
        sugestao_catalogo_id: "cat-retorno-descarte",
        recencia: cDescartadas[0].decidida_em ?? "recente",
      });
      continue;
    }

    const shortlist = candidaturas.filter(
      (c) => c.fornecedor_id === fornecedor.id && c.status === "shortlistada"
    );
    if (shortlist.length > 0) {
      leads.push({
        fornecedor,
        sinal: "Candidatura shortlistada aguardando proposta",
        detalhes: shortlist.slice(0, 2).map((c) => `Candidatura ${c.id}`),
        sugestao_catalogo_id: "cat-revisao-proposta",
        recencia: shortlist[0].enviada_em ?? "recente",
      });
    }
  }

  return leads.filter(
    (lead) => getOfertasPorFornecedor(lead.fornecedor.id).filter((o) => o.status === "enviada").length === 0
  );
}

export default function AdminOutreachProativoPage() {
  const [tick, setTick] = useState(0);

  const advisor = advisors.find((a) => a.id === ADVISOR_LOGADO_ID) ?? advisors[0];
  if (advisor?.role !== "owner") {
    redirect("/admin/dashboard");
  }

  const leads = useMemo(() => computarLeads(), [tick]);
  const historico = useMemo(
    () => [...ofertasOutreach].sort((a, b) => b.enviada_em.localeCompare(a.enviada_em)).slice(0, 10),
    [tick]
  );

  return (
    <AppShell tipo="admin" titulo="Outreach proativo">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Outreach proativo</h1>
              <p className="text-sm text-muted-foreground">
                Fornecedores com sinais — ofereça Consultoria personalizada.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/templates-outreach">Templates</Link>
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">
            Leads identificados ({leads.length})
          </h2>
          {leads.length === 0 ? (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Nenhum fornecedor em risco/oportunidade no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <CardLeadOutreach
                  key={lead.fornecedor.id}
                  lead={lead}
                  onEnviou={() => setTick((t) => t + 1)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">Ofertas recentes</h2>
          {historico.length === 0 ? (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Nenhuma oferta enviada ainda.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {historico.map((oferta) => {
                const fornecedor = fornecedores.find((f) => f.id === oferta.fornecedor_id);
                return (
                  <Card key={oferta.id} className="rounded-xl">
                    <CardContent className="flex items-start justify-between gap-3 p-4 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{fornecedor?.nome ?? "Fornecedor"}</p>
                        <p className="text-xs text-muted-foreground">
                          {oferta.motivo_lead} · enviado em {oferta.enviada_em}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          oferta.status === "aceita"
                            ? "bg-emerald-100 text-emerald-900"
                            : oferta.status === "visualizada"
                              ? "bg-blue-100 text-blue-900"
                              : oferta.status === "ignorada"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-amber-100 text-amber-900"
                        }
                      >
                        {oferta.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
