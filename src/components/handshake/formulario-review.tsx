"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reviewDimensoes, type ReviewDimensao } from "@/lib/mock-data";

export type LadoReview = "empresa" | "fornecedor";

interface FormularioReviewProps {
  avaliadoLado: LadoReview;
  onSubmit: (resultado: { notas: Record<string, number>; comentario: string }) => void;
}

export function FormularioReview({ avaliadoLado, onSubmit }: FormularioReviewProps) {
  const dimensoes = reviewDimensoes
    .filter((d) => d.ativo && d.aplica_a === avaliadoLado)
    .sort((a, b) => a.ordem - b.ordem);
  const [notas, setNotas] = useState<Record<string, number>>({});
  const [comentario, setComentario] = useState("");

  const completo =
    dimensoes.every((d) => (notas[d.id] ?? 0) > 0) && comentario.trim().length > 20;

  function setNota(dimensao: ReviewDimensao, valor: number) {
    setNotas((prev) => ({ ...prev, [dimensao.id]: valor }));
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!completo) return;
        onSubmit({ notas, comentario });
      }}
    >
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">
            Notas — dimensões aplicáveis a {avaliadoLado === "fornecedor" ? "fornecedor" : "empresa"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dimensoes.map((dimensao) => (
            <div key={dimensao.id} className="flex items-center justify-between gap-3">
              <p className="text-sm">{dimensao.nome}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((valor) => {
                  const ativa = (notas[dimensao.id] ?? 0) >= valor;
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setNota(dimensao, valor)}
                      className="focus:outline-none"
                      aria-label={`${dimensao.nome}: ${valor} estrelas`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          ativa ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-300"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Comentário</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="sr-only" htmlFor="comentario-review">
            Comentário
          </Label>
          <Textarea
            id="comentario-review"
            rows={4}
            value={comentario}
            onChange={(event) => setComentario(event.target.value)}
            placeholder="Resuma a experiência: o que funcionou bem e onde pode melhorar."
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Mínimo 20 caracteres — será visível no perfil público depois do release.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="submit" disabled={!completo}>
           Enviar avaliação
          </Button>
      </div>
    </form>
  );
}
