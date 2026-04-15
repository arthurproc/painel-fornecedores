import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CatalogoConsultoria } from "@/lib/mock-data";

interface CardServicoConsultoriaProps {
  item: CatalogoConsultoria;
}

function precoDisplay(item: CatalogoConsultoria): string {
  if (item.preco_modelo === "fixo" && item.preco_valor) {
    const base = item.preco_valor.replace(/,00$/, "");
    return `A partir de ${base}`;
  }
  return item.preco_valor ?? item.preco_observacao ?? "Sob consulta";
}

function quandoFazSentido(tipo: CatalogoConsultoria["tipo"]): string {
  switch (tipo) {
    case "revisao_candidatura":
      return "Antes de enviar uma candidatura.";
    case "revisao_proposta":
      return "Quando for selecionado para proposta e precisar fechar a proposta formal.";
    case "acompanhamento_completo":
      return "Cobertura das duas fases — economia vs. comprar separado.";
    case "retorno_pos_descarte":
      return "Para entender o motivo do descarte e reposicionar.";
  }
}

export function CardServicoConsultoria({ item }: CardServicoConsultoriaProps) {
  return (
    <Card className="flex h-full flex-col rounded-xl transition-colors hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold">{item.nome}</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="bg-amber-50 text-amber-900">
            {precoDisplay(item)}
          </Badge>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {item.prazo_entrega_estimado}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{item.descricao}</p>
          <p className="text-xs text-muted-foreground italic">{quandoFazSentido(item.tipo)}</p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href={`/fornecedor/consultoria/${item.tipo}`}>
            Ver detalhes <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
