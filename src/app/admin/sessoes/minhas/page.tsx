import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardSessao } from "@/components/consultoria/card-sessao";
import {
  ADVISOR_LOGADO_ID,
  advisors,
  getSessoesByAdvisor,
} from "@/lib/mock-data";

export default function AdminSessoesMinhasPage() {
  const advisor = advisors.find((a) => a.id === ADVISOR_LOGADO_ID) ?? advisors[0];
  const minhas = getSessoesByAdvisor(advisor.id).sort((a, b) =>
    b.solicitada_em.localeCompare(a.solicitada_em)
  );

  return (
    <AppShell tipo="admin" titulo="Sessões atribuídas a mim">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Atribuídas a {advisor.nome}</h1>
              <p className="text-sm text-muted-foreground">
                {minhas.length} sessão(ões)
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/sessoes/solicitadas">Ver fila de solicitações</Link>
            </Button>
          </CardContent>
        </Card>

        {minhas.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Você ainda não tem sessões atribuídas.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {minhas.map((sessao) => (
              <CardSessao key={sessao.id} sessao={sessao} perspectiva="advisor" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
