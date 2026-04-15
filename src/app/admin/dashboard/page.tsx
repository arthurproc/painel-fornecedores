import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ADVISOR_LOGADO_ID,
  advisors,
  fornecedores,
  ofertasOutreach,
  sessoesConsultoria,
} from "@/lib/mock-data";

interface AdminDashboardProps {
  searchParams: Promise<{ advisor?: string | string[] }>;
}

function primeiraPalavra(nome?: string): string {
  if (!nome) {
    return "Celso";
  }
  return nome.trim().split(" ")[0] ?? "Celso";
}

function moedaBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

function extrairValorMonetario(valor: string): number {
  const match = valor.match(/R\$\s*([\d.]+,\d{2})/);
  if (!match) {
    return 0;
  }
  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const query = await searchParams;
  const advisorIdFromQuery = Array.isArray(query.advisor)
    ? query.advisor[0]
    : query.advisor;

  const advisorLogado =
    advisors.find((advisor) => advisor.id === advisorIdFromQuery) ??
    advisors.find((advisor) => advisor.id === ADVISOR_LOGADO_ID) ??
    advisors[0];

  const ownerView = advisorLogado?.role === "owner";

  const sessoesSolicitadas = sessoesConsultoria
    .filter((sessao) => sessao.status === "solicitada")
    .slice(0, 3)
    .map((sessao) => {
      const fornecedor = fornecedores.find((item) => item.id === sessao.fornecedor_id);
      return { sessao, fornecedor };
    });

  const cargaEquipe = advisors
    .filter((advisor) => advisor.ativo)
    .map((advisor) => ({
      advisor,
      ativas: sessoesConsultoria.filter(
        (sessao) =>
          sessao.advisor_id === advisor.id &&
          (sessao.status === "atribuida" || sessao.status === "em_andamento")
      ).length,
    }));

  const leadsOutreach = ofertasOutreach
    .filter((oferta) => oferta.status === "enviada" || oferta.status === "visualizada")
    .map((oferta) => {
      const fornecedor = fornecedores.find((item) => item.id === oferta.fornecedor_id);
      return { oferta, fornecedor };
    });

  const sessoesEntregues = sessoesConsultoria.filter((sessao) => sessao.status === "entregue");
  const receitaAcumulada = sessoesEntregues.reduce(
    (acc, sessao) => acc + extrairValorMonetario(sessao.preco_snapshot),
    0
  );

  const totalOutreach = ofertasOutreach.length;
  const outreachAceito = ofertasOutreach.filter((oferta) => oferta.status === "aceita").length;
  const conversaoOutreach = totalOutreach > 0 ? Math.round((outreachAceito / totalOutreach) * 100) : 0;

  const sessoesDoAdvisor = sessoesConsultoria
    .filter(
      (sessao) =>
        sessao.advisor_id === advisorLogado?.id &&
        (sessao.status === "atribuida" || sessao.status === "em_andamento")
    )
    .map((sessao) => {
      const fornecedor = fornecedores.find((item) => item.id === sessao.fornecedor_id);
      return { sessao, fornecedor };
    });

  const avaliacoesDoAdvisor = sessoesConsultoria
    .filter((sessao) => sessao.advisor_id === advisorLogado?.id && sessao.avaliacao_atendimento)
    .map((sessao) => {
      const fornecedor = fornecedores.find((item) => item.id === sessao.fornecedor_id);
      return { sessao, fornecedor };
    });

  return (
    <AppShell tipo="admin" titulo="Dashboard">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xl font-semibold">
            Olá, {primeiraPalavra(advisorLogado?.nome)}. {sessoesSolicitadas.length} sessão(ões) aguardando atribuição.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Fila de atribuição</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Importante
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessoesSolicitadas.length > 0 ? (
                sessoesSolicitadas.map(({ sessao, fornecedor }) => (
                  <div key={sessao.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{fornecedor?.nome ?? "Fornecedor"}</p>
                    <p className="text-xs text-muted-foreground">
                      {sessao.tipo.replaceAll("_", " ")} — solicitada em {sessao.solicitada_em}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tudo atribuído. Bom trabalho.</p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/sessoes/solicitadas">Atribuir agora</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Carga da equipe</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Operacional
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cargaEquipe.map(({ advisor, ativas }) => (
                <div key={advisor.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <p className="text-sm">{advisor.nome}</p>
                  <p className="text-xs text-muted-foreground">{ativas} ativas</p>
                </div>
              ))}
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/advisors">Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {ownerView ? (
          <>
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg font-semibold">Outreach proativo</CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Owner
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {leadsOutreach.length > 0 ? (
                  leadsOutreach.map(({ oferta, fornecedor }) => (
                    <div key={oferta.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">{fornecedor?.nome ?? "Fornecedor"}</p>
                      <p className="text-xs text-muted-foreground">{oferta.motivo_lead}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum fornecedor em risco no momento.</p>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/inteligencia/outreach-proativo">Abrir lista completa</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg font-semibold">Métricas do mês</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Owner
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Sessões entregues: <span className="font-medium text-foreground">{sessoesEntregues.length}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Receita acumulada: <span className="font-medium text-foreground">{moedaBRL(receitaAcumulada)}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Conversão de outreach: <span className="font-medium text-foreground">{conversaoOutreach}%</span>
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Suas sessões em andamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessoesDoAdvisor.length > 0 ? (
                  sessoesDoAdvisor.map(({ sessao, fornecedor }) => (
                    <div key={sessao.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">{fornecedor?.nome ?? "Fornecedor"}</p>
                      <p className="text-xs text-muted-foreground">{sessao.tipo.replaceAll("_", " ")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Você não possui sessões ativas no momento.</p>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/sessoes/minhas">Abrir minhas sessões</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Suas avaliações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {avaliacoesDoAdvisor.length > 0 ? (
                  avaliacoesDoAdvisor.map(({ sessao, fornecedor }) => (
                    <div key={sessao.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">{fornecedor?.nome ?? "Fornecedor"}</p>
                      <p className="text-xs text-muted-foreground">
                        Nota {sessao.avaliacao_atendimento?.nota}/5
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Suas avaliações aparecerão após entregas concluídas.</p>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/meu-perfil">Ver perfil</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!ownerView ? null : (
          <p className="text-xs text-muted-foreground">
            Dica de validação: use <code>?advisor=adv-ana</code> para simular o modo advisor.
          </p>
        )}
      </div>
    </AppShell>
  );
}
