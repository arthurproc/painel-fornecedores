"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, Calendar, CheckCircle2, ClipboardList, FileText, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  candidaturas,
  empresas,
  fornecedores,
  projetos,
  propostas,
  reviews,
  statusColors,
  statusLabels,
  type Contrato,
} from "@/lib/mock-data";

interface DetalheContratoProps {
  contrato: Contrato;
  lado: "empresa" | "fornecedor";
  podeEncerrar: boolean;
}

export function DetalheContrato({ contrato, lado, podeEncerrar }: DetalheContratoProps) {
  const [encerrado, setEncerrado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const projeto = useMemo(() => projetos.find((p) => p.id === contrato.projeto_id), [contrato]);
  const empresa = useMemo(
    () => empresas.find((e) => e.id === contrato.empresa_id),
    [contrato]
  );
  const fornecedor = useMemo(
    () => fornecedores.find((f) => f.id === contrato.fornecedor_id),
    [contrato]
  );
  const proposta = useMemo(
    () => propostas.find((p) => p.id === contrato.proposta_id),
    [contrato]
  );
  const candidatura = useMemo(
    () =>
      proposta
        ? candidaturas.find((c) => c.id === proposta.candidatura_id)
        : undefined,
    [proposta]
  );

  const reviewsContrato = useMemo(
    () => reviews.filter((r) => r.contrato_id === contrato.id),
    [contrato]
  );

  const statusAtual = encerrado ? "encerrado" : contrato.status;
  const ambosSubmetidos =
    reviewsContrato.length >= 2 &&
    reviewsContrato.every((r) => r.status === "liberada" || r.status === "submetida");
  const podeAvaliar = statusAtual === "encerrado";

  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Contrato #{contrato.id}</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight">
              {projeto?.titulo ?? "Projeto"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {empresa?.nome ?? "Empresa"} ↔ {fornecedor?.nome ?? "Fornecedor"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className={statusColors[statusAtual]}>
              {statusLabels[statusAtual]}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Fechado em {contrato.data_fechamento}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCelula icone={<Calendar className="h-4 w-4 text-primary" />} label="Início" value={contrato.data_inicio ?? "—"} />
        <InfoCelula
          icone={<Calendar className="h-4 w-4 text-primary" />}
          label={contrato.data_fim_real ? "Encerrado em" : "Fim previsto"}
          value={contrato.data_fim_real ?? contrato.data_fim_estimada ?? "—"}
        />
        <InfoCelula
          icone={<ClipboardList className="h-4 w-4 text-primary" />}
          label="Valor final"
          value={contrato.valor_final}
        />
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Cronograma</CardTitle>
        </CardHeader>
        <CardContent>
          {proposta ? (
            <ol className="space-y-2 text-sm">
              {proposta.cronograma.etapas.map((etapa, index) => (
                <li key={`${etapa.titulo}-${index}`} className="rounded-lg border border-border p-3">
                  <p className="font-medium">
                    {index + 1}. {etapa.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">{etapa.prazo}</p>
                  {etapa.descricao && (
                    <p className="mt-1 text-xs text-muted-foreground">{etapa.descricao}</p>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Cronograma não disponível.</p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {!proposta || proposta.documentos_anexos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem documentos anexados à proposta.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {proposta.documentos_anexos.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {doc.nome}
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    {doc.enviado_em}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-semibold">Avaliação do parceiro</p>
            <p className="text-xs text-muted-foreground">
              {podeAvaliar
                ? ambosSubmetidos
                  ? "Reviews liberadas após submissão dupla."
                  : "Encerre o contrato para destravar sua review."
                : "Disponível somente após o contrato encerrar."}
            </p>
          </div>
          <div className="flex gap-2">
            {podeAvaliar && (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/reviews/novo/${contrato.id}`}>
                  <Star className="h-3.5 w-3.5" /> Avaliar parceiro
                </Link>
              </Button>
            )}
            {statusAtual === "em_execucao" && podeEncerrar && (
              <Button size="sm" className="gap-1.5" onClick={() => setConfirmando(true)}>
                <Archive className="h-3.5 w-3.5" /> Marcar como encerrado
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {encerrado && (
        <Card className="rounded-xl border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-start gap-3 p-4 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
            Contrato encerrado. Vocês dois podem escrever a review — o release acontece quando
            ambos os lados submeterem.
          </CardContent>
        </Card>
      )}

      <Separator />

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Contexto</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Proposta vinculada:{" "}
            <strong className="text-foreground">{proposta?.escopo_detalhado ?? "—"}</strong>
          </p>
          {candidatura && (
            <p>
              Candidatura inicial de {fornecedor?.nome ?? "Fornecedor"}:{" "}
              <em>{candidatura.pitch}</em>
            </p>
          )}
          {lado === "empresa" && fornecedor && (
            <Link
              href={`/organizacao/fornecedor/${fornecedor.id}`}
              className="text-primary hover:underline"
            >
              Ver perfil público do fornecedor →
            </Link>
          )}
          {lado === "fornecedor" && empresa && (
            <Link
              href={`/organizacao/empresa/${empresa.id}`}
              className="text-primary hover:underline"
            >
              Ver perfil público da empresa →
            </Link>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmando} onOpenChange={setConfirmando}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar contrato como encerrado?</DialogTitle>
            <DialogDescription>
              Isso libera o formulário de review para os dois lados. As notas ficam bloqueadas
              até que a outra parte também submeta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setEncerrado(true);
                setConfirmando(false);
              }}
            >
              Confirmar encerramento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCelula({
  icone,
  label,
  value,
}: {
  icone: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex items-center gap-3 p-4">
        {icone}
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
