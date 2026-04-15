import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { garantirOwner } from "@/components/consultoria/owner-gate";
import { advisors, getCargaAdvisor } from "@/lib/mock-data";

interface Props {
  searchParams: Promise<{ advisor?: string | string[] }>;
}

export default async function AdminAdvisorsPage({ searchParams }: Props) {
  const query = await searchParams;
  const advisorQuery = Array.isArray(query.advisor) ? query.advisor[0] : query.advisor;
  garantirOwner(advisorQuery);

  return (
    <AppShell tipo="admin" titulo="Advisors">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Equipe de advisors</h1>
              <p className="text-sm text-muted-foreground">
                Convide, desative e ajuste carga simultânea máxima.
              </p>
            </div>
            <Button size="sm" disabled title="Convite de novos advisors disponível em produção">
              Convidar advisor
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {advisors.map((advisor) => {
            const carga = getCargaAdvisor(advisor.id);
            return (
              <Card key={advisor.id} className="rounded-xl">
                <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">{advisor.nome}</p>
                      <Badge variant="secondary" className="capitalize">
                        {advisor.role}
                      </Badge>
                      {!advisor.ativo ? (
                        <Badge variant="outline">inativo</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{advisor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {advisor.especializacoes.map((esp, idx) => (
                        <Badge key={idx} variant="outline" className="rounded-full text-xs">
                          {esp.categoria}
                          {esp.regiao ? ` · ${esp.regiao}` : ""}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {advisor.email} · desde {advisor.desde}
                    </div>
                  </div>
                  <div className="shrink-0 space-y-1 text-right text-sm">
                    <p>
                      Carga:{" "}
                      <span className="font-medium text-foreground">
                        {carga}
                        {advisor.carga_simultanea_max ? `/${advisor.carga_simultanea_max}` : ""}
                      </span>
                    </p>
                    {advisor.avaliacao_media ? (
                      <p>
                        Nota média:{" "}
                        <span className="font-medium text-foreground">
                          {advisor.avaliacao_media.toFixed(1)}
                        </span>
                      </p>
                    ) : null}
                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                      <Button size="sm" variant="outline" disabled>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        {advisor.ativo ? "Desativar" : "Reativar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Dica de validação: adicione <code>?advisor=adv-ana</code> — advisor não-owner é
          redirecionado para o dashboard.
        </p>
      </div>
    </AppShell>
  );
}
