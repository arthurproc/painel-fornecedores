import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { garantirOwner } from "@/components/consultoria/owner-gate";

interface Props {
  searchParams: Promise<{ advisor?: string | string[] }>;
}

const templates = [
  {
    id: "tpl-descarte",
    titulo: "Retorno pós-descarte",
    gatilho: "Candidatura descartada nos últimos 15 dias",
    corpo:
      "Olá {nome}, notamos que sua candidatura recente em {categoria} foi descartada. Posso te ajudar a entender o motivo e reposicionar com 20% de desconto em uma sessão de Retorno pós-descarte.",
    servico_sugerido: "Retorno pós-descarte",
  },
  {
    id: "tpl-shortlist",
    titulo: "Seleção para proposta em projeto estratégico",
    gatilho: "Fornecedor selecionado para proposta com valor > R$ 300k",
    corpo:
      "Parabéns pela seleção para proposta em {projeto}! Esse é o momento em que a proposta formal decide o contrato — posso acompanhar do pitch ao envio via Acompanhamento Completo.",
    servico_sugerido: "Acompanhamento completo",
  },
  {
    id: "tpl-nova-categoria",
    titulo: "Primeira candidatura em nova categoria",
    gatilho: "Primeira candidatura do fornecedor numa categoria",
    corpo:
      "Notei que essa é sua primeira candidatura em {categoria}. Antes de enviar, posso revisar o pitch com o olhar de quem conhece o segmento — revisão em 24-48h.",
    servico_sugerido: "Revisão de candidatura",
  },
];

export default async function AdminTemplatesOutreachPage({ searchParams }: Props) {
  const query = await searchParams;
  const advisorQuery = Array.isArray(query.advisor) ? query.advisor[0] : query.advisor;
  garantirOwner(advisorQuery);

  return (
    <AppShell tipo="admin" titulo="Templates de outreach">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Templates de outreach</h1>
              <p className="text-sm text-muted-foreground">
                Mensagens-modelo para ofertas proativas. Use variáveis como{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{"{nome}"}</code>,{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{"{categoria}"}</code>.
              </p>
            </div>
            <Button size="sm" disabled>
              Novo template
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{tpl.titulo}</CardTitle>
                  <Badge variant="outline">{tpl.servico_sugerido}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Gatilho: {tpl.gatilho}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="whitespace-pre-line rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                  {tpl.corpo}
                </p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" disabled>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    Desativar
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
