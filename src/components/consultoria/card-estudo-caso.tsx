import Link from "next/link";
import { BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { EstudoDeCaso } from "@/lib/mock-data";

interface CardEstudoCasoProps {
  estudo: EstudoDeCaso;
  basePath?: string;
}

export function CardEstudoCaso({ estudo, basePath = "/consultoria/estudos" }: CardEstudoCasoProps) {
  return (
    <Link href={`${basePath}/${estudo.id}`} className="block h-full">
      <Card className="flex h-full flex-col rounded-xl transition-colors hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Estudo de caso</span>
            {estudo.destaque ? (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                Destaque
              </Badge>
            ) : null}
          </div>
          <h3 className="text-sm font-semibold leading-snug">{estudo.titulo}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {estudo.resumo}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full">
              {estudo.contexto.categoria}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {estudo.contexto.regiao}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
