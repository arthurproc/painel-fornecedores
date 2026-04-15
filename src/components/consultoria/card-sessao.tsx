import Link from "next/link";
import { BookOpen, Check, Clock, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  advisors,
  candidaturas,
  getCatalogoById,
  projetos,
  type SessaoConsultoria,
  type SessaoConsultoriaStatus,
} from "@/lib/mock-data";

interface CardSessaoProps {
  sessao: SessaoConsultoria;
  perspectiva: "fornecedor" | "advisor";
}

const statusMeta: Record<
  SessaoConsultoriaStatus,
  { label: string; cor: string; ponto: string; Icon: typeof Clock }
> = {
  solicitada: {
    label: "Solicitada",
    cor: "bg-amber-100 text-amber-900",
    ponto: "bg-amber-500",
    Icon: Clock,
  },
  atribuida: {
    label: "Atribuída",
    cor: "bg-blue-100 text-blue-900",
    ponto: "bg-blue-500",
    Icon: Sparkles,
  },
  em_andamento: {
    label: "Em andamento",
    cor: "bg-blue-100 text-blue-900",
    ponto: "bg-blue-500",
    Icon: Sparkles,
  },
  entregue: {
    label: "Entregue",
    cor: "bg-emerald-100 text-emerald-900",
    ponto: "bg-emerald-500",
    Icon: Check,
  },
  cancelada: {
    label: "Cancelada",
    cor: "bg-gray-100 text-gray-700",
    ponto: "bg-gray-400",
    Icon: XCircle,
  },
};

export function CardSessao({ sessao, perspectiva }: CardSessaoProps) {
  const catalogo = getCatalogoById(sessao.catalogo_id);
  const advisor = advisors.find((a) => a.id === sessao.advisor_id);
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;

  const meta = statusMeta[sessao.status];

  const href =
    perspectiva === "fornecedor"
      ? `/fornecedor/consultoria/minhas-sessoes/${sessao.id}`
      : `/admin/sessoes/${sessao.id}`;

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold">
              {catalogo?.nome ?? "Sessão de Consultoria"} ·{" "}
              <span className="font-normal text-muted-foreground">
                {projeto?.titulo ?? "Projeto"}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", meta.ponto)} />
              <Badge variant="secondary" className={meta.cor}>
                {meta.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Solicitada em {sessao.solicitada_em}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 rounded-full text-xs">
            {sessao.preco_snapshot}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            {advisor ? (
              <span>Consultor: <span className="text-foreground">{advisor.nome}</span></span>
            ) : (
              <span className="italic">Aguardando atribuição</span>
            )}
          </div>
          <div className="text-right">
            {sessao.entregue_em ? (
              <span>Entregue em {sessao.entregue_em}</span>
            ) : sessao.atribuida_em ? (
              <span>Atribuída em {sessao.atribuida_em}</span>
            ) : null}
          </div>
        </div>

        {sessao.status === "entregue" ? (
          <div className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            {sessao.entregaveis.length} entregável(eis) disponíveis
          </div>
        ) : null}

        <div className="flex items-center justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={href}>Ver sessão</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
