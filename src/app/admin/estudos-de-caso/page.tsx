import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { advisors, estudosDeCaso } from "@/lib/mock-data";

export default function AdminEstudosDeCasoPage() {
  const estudos = [...estudosDeCaso].sort((a, b) =>
    b.publicado_em.localeCompare(a.publicado_em)
  );

  return (
    <AppShell tipo="admin" titulo="Estudos de caso">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Estudos de caso</h1>
              <p className="text-sm text-muted-foreground">
                Curadoria, publicação e despublicação.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/admin/estudos-de-caso/novo" className="gap-1">
                <Plus className="h-4 w-4" /> Novo estudo
              </Link>
            </Button>
          </CardContent>
        </Card>

        {estudos.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum estudo publicado.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {estudos.map((estudo) => {
              const autor = advisors.find((a) => a.id === estudo.autor_advisor_id);
              return (
                <Card key={estudo.id} className="rounded-xl">
                  <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{estudo.titulo}</p>
                        {estudo.destaque ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                            Destaque
                          </Badge>
                        ) : null}
                        <Badge variant="outline" className="rounded-full text-xs">
                          {estudo.visivel_para === "todos_publico"
                            ? "Público"
                            : "Fornecedores logados"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{estudo.resumo}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full">
                          {estudo.contexto.categoria}
                        </Badge>
                        <span>{estudo.contexto.regiao}</span>
                        <span>·</span>
                        <span>Publicado em {estudo.publicado_em}</span>
                        {autor ? (
                          <>
                            <span>·</span>
                            <span>{autor.nome}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/consultoria/estudos/${estudo.id}`}>Ler</Link>
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
