import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { CardSessao } from "@/components/consultoria/card-sessao";
import { sessoesConsultoria } from "@/lib/mock-data";

export default function AdminSessoesAndamentoPage() {
  const emAndamento = sessoesConsultoria
    .filter((s) => s.status === "atribuida" || s.status === "em_andamento")
    .sort((a, b) => b.solicitada_em.localeCompare(a.solicitada_em));

  return (
    <AppShell tipo="admin" titulo="Sessões em andamento">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h1 className="text-lg font-semibold">Em andamento ({emAndamento.length})</h1>
            <p className="text-sm text-muted-foreground">
              Sessões atribuídas e sendo executadas por consultores.
            </p>
          </CardContent>
        </Card>

        {emAndamento.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma sessão em andamento.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {emAndamento.map((sessao) => (
              <CardSessao key={sessao.id} sessao={sessao} perspectiva="advisor" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
