"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  empresas,
  fornecedores,
  getMembroById,
  membros,
  projetos,
  reviews,
  statusColors,
  statusLabels,
  type Review,
} from "@/lib/mock-data";

export default function ReviewsHubPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const orgId = membroLogado?.organizacao_id ?? "";

  const membrosDaOrg = useMemo(
    () => new Set(membros.filter((m) => m.organizacao_id === orgId).map((m) => m.id)),
    [orgId]
  );
  const empresa = empresas.find((e) => e.organizacao_id === orgId);
  const fornecedor = fornecedores.find((f) => f.organizacao_id === orgId);

  const contratosDaOrg = useMemo(
    () =>
      contratos.filter(
        (c) =>
          (empresa && c.empresa_id === empresa.id) ||
          (fornecedor && c.fornecedor_id === fornecedor.id)
      ),
    [empresa, fornecedor]
  );
  const contratoIds = new Set(contratosDaOrg.map((c) => c.id));

  const dadas = reviews.filter(
    (r) => membrosDaOrg.has(r.autor_membro_id) && r.status !== "rascunho"
  );
  const pendentes = contratosDaOrg
    .filter(
      (c) =>
        c.status === "encerrado" &&
        !reviews.some(
          (r) =>
            r.contrato_id === c.id &&
            membrosDaOrg.has(r.autor_membro_id) &&
            r.status !== "rascunho"
        )
    )
    .map((contrato) => {
      const projeto = projetos.find((p) => p.id === contrato.projeto_id);
      const empresaC = empresas.find((e) => e.id === contrato.empresa_id);
      const fornecedorC = fornecedores.find((f) => f.id === contrato.fornecedor_id);
      return { contrato, projeto, empresaC, fornecedorC };
    });
  const recebidas = reviews.filter(
    (r) =>
      contratoIds.has(r.contrato_id) &&
      !membrosDaOrg.has(r.autor_membro_id) &&
      r.status === "liberada"
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <CardContent className="p-5">
          <h1 className="text-lg font-semibold">Avaliações</h1>
          <p className="text-sm text-muted-foreground">
            Pendentes, dadas e recebidas da sua organização
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="dadas">Dadas ({dadas.length})</TabsTrigger>
          <TabsTrigger value="recebidas">Recebidas ({recebidas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-4 space-y-3">
          {pendentes.length === 0 ? (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Nenhuma review pendente. Contratos encerrados disparam o formulário automaticamente.
              </CardContent>
            </Card>
          ) : (
            pendentes.map(({ contrato, projeto, empresaC, fornecedorC }) => (
              <Card key={contrato.id} className="rounded-xl">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{projeto?.titulo ?? "Projeto"}</p>
                    <p className="text-xs text-muted-foreground">
                      {empresaC?.nome} ↔ {fornecedorC?.nome} · Encerrado em{" "}
                      {contrato.data_fim_real ?? contrato.data_fechamento}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/reviews/novo/${contrato.id}`}>Escrever review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="dadas" className="mt-4 space-y-3">
          {dadas.length === 0 ? (
            <VazioMensagem mensagem="Nenhuma review enviada ainda." />
          ) : (
            dadas.map((review) => <CardReview key={review.id} review={review} perspective="autor" />)
          )}
        </TabsContent>

        <TabsContent value="recebidas" className="mt-4 space-y-3">
          {recebidas.length === 0 ? (
            <VazioMensagem mensagem="Nenhuma review liberada para sua organização ainda." />
          ) : (
            recebidas.map((review) => <CardReview key={review.id} review={review} perspective="avaliado" />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VazioMensagem({ mensagem }: { mensagem: string }) {
  return (
    <Card className="rounded-xl border-dashed">
      <CardContent className="p-8 text-center text-sm text-muted-foreground">
        {mensagem}
      </CardContent>
    </Card>
  );
}

function CardReview({ review, perspective }: { review: Review; perspective: "autor" | "avaliado" }) {
  const contrato = contratos.find((c) => c.id === review.contrato_id);
  const projeto = contrato ? projetos.find((p) => p.id === contrato.projeto_id) : undefined;
  const autor = membros.find((m) => m.id === review.autor_membro_id);
  const notaMedia =
    Object.values(review.notas).reduce((a, b) => a + b, 0) / Math.max(Object.keys(review.notas).length, 1);

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{projeto?.titulo ?? "Projeto"}</p>
            <p className="text-xs text-muted-foreground">
              {perspective === "autor"
                ? `Avaliada por ${autor?.nome ?? "você"}`
                : `Recebida de ${autor?.nome ?? "parceiro"}`}
              {review.submetida_em ? ` · ${review.submetida_em}` : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className={statusColors[review.status]}>
              {statusLabels[review.status]}
            </Badge>
            <p className="text-sm font-medium">{notaMedia.toFixed(1)} / 5</p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{review.comentario}</p>
        <div className="flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={`/reviews/${review.id}`}>Ver detalhe</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
