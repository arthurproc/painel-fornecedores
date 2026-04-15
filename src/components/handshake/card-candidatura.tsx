import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getMotivoDescarteById,
  statusColors,
  statusLabels,
  type Candidatura,
  type Empresa,
  type Fornecedor,
  type Projeto,
} from "@/lib/mock-data";

interface CardCandidaturaProps {
  candidatura: Candidatura;
  projeto?: Projeto;
  empresa?: Empresa;
  fornecedor?: Fornecedor;
  ladoDireito?: "empresa" | "fornecedor";
  acao?: React.ReactNode;
}

export function CardCandidatura({
  candidatura,
  projeto,
  empresa,
  fornecedor,
  ladoDireito = "empresa",
  acao,
}: CardCandidaturaProps) {
  const motivo = candidatura.motivo_descarte
    ? getMotivoDescarteById(candidatura.motivo_descarte.categoria_id)
    : undefined;

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{projeto?.titulo ?? "Projeto"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ladoDireito === "empresa"
                ? empresa?.nome ?? "Empresa"
                : fornecedor?.nome ?? "Fornecedor"}
              {projeto?.cidade ? ` · ${projeto.cidade}` : ""}
            </p>
          </div>
          <Badge variant="secondary" className={cn(statusColors[candidatura.status])}>
            {statusLabels[candidatura.status]}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{candidatura.pitch}</p>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {candidatura.faixa_preco_preliminar && (
            <span>
              Faixa preliminar:{" "}
              <strong className="text-foreground">{candidatura.faixa_preco_preliminar}</strong>
            </span>
          )}
          <span>Capacidade: {candidatura.capacidade_declarada}</span>
          <span>
            {candidatura.enviada_em ? `Enviada em ${candidatura.enviada_em}` : "Em rascunho"}
          </span>
        </div>

        {candidatura.status === "descartada" && motivo && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <p className="font-medium">Motivo do descarte: {motivo.nome}</p>
            {candidatura.motivo_descarte?.comentario && (
              <p className="mt-1 text-xs">{candidatura.motivo_descarte.comentario}</p>
            )}
          </div>
        )}

        {acao && <div className="flex justify-end gap-2 pt-2">{acao}</div>}
      </CardContent>
    </Card>
  );
}
