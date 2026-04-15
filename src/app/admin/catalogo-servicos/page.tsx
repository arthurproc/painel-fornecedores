import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { garantirOwner } from "@/components/consultoria/owner-gate";
import { catalogoConsultoria } from "@/lib/mock-data";

interface Props {
  searchParams: Promise<{ advisor?: string | string[] }>;
}

export default async function AdminCatalogoServicosPage({ searchParams }: Props) {
  const query = await searchParams;
  const advisorQuery = Array.isArray(query.advisor) ? query.advisor[0] : query.advisor;
  garantirOwner(advisorQuery);

  return (
    <AppShell tipo="admin" titulo="Catálogo de serviços">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Catálogo de Consultoria</h1>
              <p className="text-sm text-muted-foreground">
                Ative/desative serviços e ajuste pricing. Mudanças aqui não afetam sessões já
                contratadas — o preço é congelado por sessão.
              </p>
            </div>
            <Button size="sm" disabled>
              Novo serviço
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {catalogoConsultoria.map((item) => (
            <Card key={item.id} className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{item.nome}</CardTitle>
                  <Badge variant={item.ativo ? "secondary" : "outline"}>
                    {item.ativo ? "Ativo" : "Pausado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{item.descricao}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">
                      Preço ({item.preco_modelo})
                    </p>
                    <p className="mt-1">{item.preco_valor ?? "—"}</p>
                    {item.preco_observacao ? (
                      <p className="mt-1 text-muted-foreground">{item.preco_observacao}</p>
                    ) : null}
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-muted-foreground">
                      Prazo
                    </p>
                    <p className="mt-1">{item.prazo_entrega_estimado}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <Button size="sm" variant="outline" disabled>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    {item.ativo ? "Pausar" : "Ativar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
