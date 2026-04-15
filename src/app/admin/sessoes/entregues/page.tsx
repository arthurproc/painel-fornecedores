import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { CardSessao } from "@/components/consultoria/card-sessao";
import { sessoesConsultoria } from "@/lib/mock-data";

export default function AdminSessoesEntreguesPage() {
  const entregues = sessoesConsultoria
    .filter((s) => s.status === "entregue")
    .sort((a, b) => (b.entregue_em ?? "").localeCompare(a.entregue_em ?? ""));

  return (
    <AppShell tipo="admin" titulo="Sessões entregues">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Entregues ({entregues.length})</h1>
            <p className="text-sm text-muted-foreground">
              Histórico de entregas. Outcomes e avaliações aparecem aqui após consolidação.
            </p>
          </CardContent>
        </Card>

        {entregues.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma sessão entregue ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entregues.map((sessao) => (
              <CardSessao key={sessao.id} sessao={sessao} perspectiva="advisor" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
