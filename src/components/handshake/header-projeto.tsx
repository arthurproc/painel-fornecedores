import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { statusColors, statusLabels, type Empresa, type Projeto } from "@/lib/mock-data";
import { FitScoreBadge } from "./fit-score-badge";
import type { FitScoreBreakdown } from "@/lib/fit-score";

interface HeaderProjetoProps {
  projeto: Projeto;
  empresa: Empresa | undefined;
  breakdown?: FitScoreBreakdown;
  empresaHref?: string;
}

export function HeaderProjeto({ projeto, empresa, breakdown, empresaHref }: HeaderProjetoProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-lg font-bold">
              {empresa?.logo ?? "?"}
            </div>
            <div>
              {empresaHref ? (
                <Link href={empresaHref} className="font-semibold hover:underline">
                  {empresa?.nome ?? "Empresa"}
                </Link>
              ) : (
                <p className="font-semibold">{empresa?.nome ?? "Empresa"}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {empresa?.setor ?? "Indústria"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {projeto.cidade} · {projeto.regiao}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className={statusColors[projeto.status]}>
              {statusLabels[projeto.status]}
            </Badge>
            {breakdown && <FitScoreBadge breakdown={breakdown} size="lg" />}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold leading-tight">{projeto.titulo}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Publicado em {projeto.dataPublicacao} · Prazo {projeto.prazo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
