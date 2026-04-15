import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reviewDimensoes, type ReputacaoAgregada } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ReputacaoAgregadaProps {
  reputacao: ReputacaoAgregada;
  tipo: "empresa" | "fornecedor";
  verTodasHref?: string;
  compact?: boolean;
  periodoLabel?: string;
}

export function ReputacaoAgregadaBloco({
  reputacao,
  tipo,
  verTodasHref,
  compact = false,
  periodoLabel = "últimos 12 meses",
}: ReputacaoAgregadaProps) {
  if (reputacao.total_reviews === 0) {
    if (compact) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5" />
          <span>Sem avaliações</span>
        </div>
      );
    }
    return (
      <Card className="rounded-xl">
        <CardContent className="space-y-2 p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Esta organização ainda não recebeu avaliações.
          </p>
          <p>
            Após o primeiro contrato encerrado, as avaliações liberadas aparecem aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Estrelas nota={reputacao.media_geral} size="sm" />
        <span className="font-semibold">{reputacao.media_geral.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">
          ({reputacao.total_reviews})
        </span>
      </div>
    );
  }

  const dimensoesOrdenadas = [...reviewDimensoes]
    .filter((d) => d.aplica_a === tipo && d.ativo)
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Estrelas nota={reputacao.media_geral} />
          <span className="text-2xl font-bold">
            {reputacao.media_geral.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({reputacao.total_reviews}{" "}
            {reputacao.total_reviews === 1 ? "review" : "reviews"} · {periodoLabel})
          </span>
        </div>

        <div className="space-y-2">
          {dimensoesOrdenadas.map((dim) => {
            const info = reputacao.por_dimensao[dim.id];
            const media = info?.media ?? 0;
            return (
              <div
                key={dim.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm"
              >
                <span className="text-muted-foreground">{dim.nome}</span>
                <BarraDimensao nota={media} />
                <span className="w-8 text-right font-medium tabular-nums">
                  {media.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        {verTodasHref ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={verTodasHref}>Ver todas as reviews</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function Estrelas({
  nota,
  size = "md",
}: {
  nota: number;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const estrelas = Array.from({ length: 5 }, (_, i) => {
    const valor = nota - i;
    if (valor >= 1) return "full" as const;
    if (valor >= 0.5) return "half" as const;
    return "empty" as const;
  });
  return (
    <div className="flex items-center gap-0.5">
      {estrelas.map((tipo, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            tipo === "empty" ? "text-muted-foreground/40" : "text-amber-400",
            tipo !== "empty" ? "fill-amber-400" : ""
          )}
        />
      ))}
    </div>
  );
}

function BarraDimensao({ nota }: { nota: number }) {
  const segmentos = 10;
  const preenchidos = Math.round(nota * 2);
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: segmentos }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-sm",
            i < preenchidos ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}
