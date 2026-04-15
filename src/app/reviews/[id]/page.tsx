"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Hourglass, Lock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  contratos,
  empresas,
  fornecedores,
  getMembroById,
  getReviewDimensao,
  projetos,
  reviews,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";

export default function ReviewDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    return (
      <Card className="rounded-xl">
        <CardContent className="p-8 text-center">Review não encontrada.</CardContent>
      </Card>
    );
  }

  const contrato = contratos.find((c) => c.id === review.contrato_id);
  const projeto = contrato ? projetos.find((p) => p.id === contrato.projeto_id) : undefined;
  const autor = getMembroById(review.autor_membro_id);
  const empresa = contrato ? empresas.find((e) => e.id === contrato.empresa_id) : undefined;
  const fornecedor = contrato ? fornecedores.find((f) => f.id === contrato.fornecedor_id) : undefined;
  const outraReview = reviews.find(
    (r) => r.contrato_id === review.contrato_id && r.id !== review.id
  );

  const bloqueada = review.status === "submetida";
  const rascunho = review.status === "rascunho";

  return (
    <div className="space-y-5">
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <Card className="rounded-xl">
        <CardContent className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Review</p>
              <h1 className="text-xl font-semibold leading-tight">{projeto?.titulo ?? "Projeto"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {empresa?.nome} ↔ {fornecedor?.nome} · Autor {autor?.nome ?? "—"}
              </p>
            </div>
            <Badge variant="secondary" className={statusColors[review.status]}>
              {statusLabels[review.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {bloqueada && (
        <Card className="rounded-xl border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-900">
            <Hourglass className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">Aguardando a contraparte</p>
              <p className="mt-1 text-amber-800">
                Sua review foi submetida em {review.submetida_em ?? "—"}. Ela será liberada
                publicamente quando a outra parte submeter (ou em até 14 dias).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {rascunho && (
        <Card className="rounded-xl border-muted">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
            <Lock className="mt-0.5 h-4 w-4" />
            Esta review está em rascunho. Abra pelo contrato para finalizar.
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {Object.entries(review.notas).map(([dimensaoId, valor]) => {
              const dimensao = getReviewDimensao(dimensaoId);
              return (
                <li
                  key={dimensaoId}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span>{dimensao?.nome ?? dimensaoId}</span>
                  <span className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <Star
                        key={nota}
                        className={cn(
                          "h-4 w-4",
                          nota <= valor
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Comentário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{review.comentario}</p>
        </CardContent>
      </Card>

      {outraReview && (
        <Card className="rounded-xl">
          <CardContent className="flex items-center justify-between gap-3 p-4 text-sm">
            <p>
              Review da contraparte:{" "}
              <Badge variant="secondary" className={statusColors[outraReview.status]}>
                {statusLabels[outraReview.status]}
              </Badge>
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/reviews/${outraReview.id}`}>Abrir</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {contrato && (
        <Button asChild variant="outline" className="w-full">
          <Link href={`/empresa/contratos/${contrato.id}`}>Abrir contrato relacionado</Link>
        </Button>
      )}
    </div>
  );
}
