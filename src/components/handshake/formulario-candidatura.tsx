"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, FilePlus2, Gauge, Lightbulb, Link2, ShieldAlert } from "lucide-react";
import { CTAConsultoria } from "./cta-consultoria";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCredencialNome } from "@/lib/platform-credentials";
import { getCategoriaItemById, getUnidadeAbreviada } from "@/lib/platform-data";
import { cn } from "@/lib/utils";
import type {
  CapacidadeAlocada,
  Contrato,
  DocumentoCandidaturaAnexado,
  DocumentoEmpresa,
  DocumentoExigido,
  Fornecedor,
  Projeto,
} from "@/lib/mock-data";

interface FormularioCandidaturaProps {
  projeto: Projeto;
  fornecedor: Fornecedor | undefined;
  contratosDestacaveis: Contrato[];
  onSubmit: (payload: {
    pitch: string;
    capacidade_declarada: string;
    capacidade_alocada?: CapacidadeAlocada;
    observacao_disponibilidade?: string;
    faixa_preco_preliminar?: string;
    contratos_destacados: string[];
    documentos_anexados: DocumentoCandidaturaAnexado[];
    documentos_manuais_meta: Record<string, ManualDraft>;
  }) => void;
}

const MESES_DEFAULT_CONTRATO_TOTAL = 12;

function volumeRequeridoMensal(projeto: Projeto): number | undefined {
  const v = projeto.volume_estimado;
  if (!v) return undefined;
  if (v.periodicidade === "mensal") return v.quantidade;
  return v.quantidade / MESES_DEFAULT_CONTRATO_TOTAL;
}

function formatNumero(valor: number | undefined): string {
  if (valor === undefined) return "—";
  return Math.round(valor).toLocaleString("pt-BR");
}

const LIMITE_PITCH = 500;

interface ManualDraft {
  arquivoNome: string;
  validade: string;
  observacao: string;
}

function findDocumentoPerfilCompatível(
  fornecedor: Fornecedor | undefined,
  documento: DocumentoExigido
): DocumentoEmpresa | undefined {
  if (!fornecedor || !documento.credencial_relacionada_id) return undefined;
  return fornecedor.documentos_empresa.find(
    (item) =>
      item.credencial_id === documento.credencial_relacionada_id && item.status === "vigente"
  );
}

export function FormularioCandidatura({
  projeto,
  fornecedor,
  contratosDestacaveis,
  onSubmit,
}: FormularioCandidaturaProps) {
  const [pitch, setPitch] = useState(
    `Temos forte experiência em ${projeto.categoria.toLowerCase()} e podemos iniciar rapidamente após a aprovação.`
  );

  // Capacidade derivada do perfil — passo 6 do diagnóstico-capacidade-instalada.md
  const capacidadePerfil = useMemo(() => {
    if (!fornecedor || !projeto.categoria_item_id) return undefined;
    return fornecedor.capacidades_instaladas.find(
      (c) => c.categoria_item_id === projeto.categoria_item_id
    );
  }, [fornecedor, projeto.categoria_item_id]);

  const itemProjeto = projeto.categoria_item_id
    ? getCategoriaItemById(projeto.categoria_item_id)
    : undefined;
  const unidadeMensal = itemProjeto
    ? getUnidadeAbreviada(itemProjeto.unidade_medida)
    : undefined;
  const livreMensal = capacidadePerfil
    ? capacidadePerfil.capacidade_nominal_mensal *
      (1 - capacidadePerfil.percent_utilizacao_atual / 100)
    : undefined;
  const requeridoMensal = volumeRequeridoMensal(projeto);

  const alocacaoSugerida = (() => {
    if (requeridoMensal === undefined || livreMensal === undefined) return 0;
    return Math.min(requeridoMensal, livreMensal);
  })();

  const [valorAlocado, setValorAlocado] = useState(
    alocacaoSugerida > 0 ? String(Math.round(alocacaoSugerida)) : ""
  );
  const [observacaoDisponibilidade, setObservacaoDisponibilidade] = useState("");
  const [faixa, setFaixa] = useState("");
  const [contratosSelecionados, setContratosSelecionados] = useState<string[]>(
    contratosDestacaveis.slice(0, 2).map((contrato) => contrato.id)
  );
  const [documentosAnexados, setDocumentosAnexados] = useState<DocumentoCandidaturaAnexado[]>([]);
  const [manualAberto, setManualAberto] = useState<string | null>(null);
  const [manualDrafts, setManualDrafts] = useState<Record<string, ManualDraft>>({});

  const pitchValido = pitch.trim().length > 20 && pitch.length <= LIMITE_PITCH;
  const valorAlocadoNum = Number(valorAlocado) || 0;
  const nominalMensal = capacidadePerfil?.capacidade_nominal_mensal;
  // Bloqueia só quando alocação > teto físico (impossível na prática). Quando
  // alocação > livre atual, apenas mostra aviso amarelo (passo 8.5): pode ser
  // capacidade prevista para a data de início do projeto.
  const alocacaoExcedeNominal =
    capacidadePerfil !== undefined &&
    nominalMensal !== undefined &&
    valorAlocadoNum > nominalMensal + 0.5;
  const alocacaoExcedeLivre =
    capacidadePerfil !== undefined &&
    livreMensal !== undefined &&
    valorAlocadoNum > livreMensal + 0.5 &&
    !alocacaoExcedeNominal;
  const capacidadeValida =
    capacidadePerfil !== undefined && valorAlocadoNum > 0 && !alocacaoExcedeNominal;
  const formularioValido = pitchValido && capacidadeValida;

  const pendenciasObrigatorias = useMemo(
    () =>
      projeto.documentos_exigidos.filter(
        (documento) =>
          documento.obrigatorio &&
          !documentosAnexados.some((item) => item.documento_exigido_id === documento.id)
      ),
    [documentosAnexados, projeto.documentos_exigidos]
  );

  function toggleContrato(id: string) {
    setContratosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  }

  function anexarDoPerfil(documento: DocumentoExigido, documentoEmpresa: DocumentoEmpresa) {
    setDocumentosAnexados((prev) => [
      ...prev.filter((item) => item.documento_exigido_id !== documento.id),
      {
        documento_exigido_id: documento.id,
        documento_empresa_id: documentoEmpresa.id,
        nome: documentoEmpresa.nome,
        origem: "perfil",
        arquivo_caminho: documentoEmpresa.arquivo_caminho,
        status: "anexado",
      },
    ]);
    setManualAberto(null);
  }

  function atualizarDraft(documentoId: string, parcial: Partial<ManualDraft>) {
    setManualDrafts((prev) => ({
      ...prev,
      [documentoId]: {
        arquivoNome: prev[documentoId]?.arquivoNome ?? "",
        validade: prev[documentoId]?.validade ?? "",
        observacao: prev[documentoId]?.observacao ?? "",
        ...parcial,
      },
    }));
  }

  function removerAnexo(documentoId: string) {
    setDocumentosAnexados((prev) => prev.filter((item) => item.documento_exigido_id !== documentoId));
  }

  function confirmarAnexoManual(documento: DocumentoExigido) {
    const draft = manualDrafts[documento.id];
    if (!draft?.arquivoNome.trim()) return;

    const arquivoCaminho = `/mock-storage/fornecedores/${fornecedor?.id ?? "fornecedor"}/${draft.arquivoNome.trim()}`;

    setDocumentosAnexados((prev) => [
      ...prev.filter((item) => item.documento_exigido_id !== documento.id),
      {
        documento_exigido_id: documento.id,
        nome: documento.nome,
        origem: "manual",
        arquivo_caminho: arquivoCaminho,
        status: "anexado",
      },
    ]);
    setManualAberto(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formularioValido || !capacidadePerfil) return;
    const nominal = capacidadePerfil.capacidade_nominal_mensal;
    const capacidade_alocada: CapacidadeAlocada = {
      valor_nominal: valorAlocadoNum,
      percent_da_capacidade_total: nominal > 0 ? Math.round((valorAlocadoNum / nominal) * 100) : 0,
    };
    const unidadeStr = unidadeMensal ?? "";
    onSubmit({
      pitch: pitch.trim(),
      // Mantém o campo legado preenchido com a versão textual da alocação numérica
      // até que todos os consumers (triagem, listagens) migrem para `capacidade_alocada`.
      capacidade_declarada: `${formatNumero(valorAlocadoNum)} ${unidadeStr}`.trim(),
      capacidade_alocada,
      observacao_disponibilidade: observacaoDisponibilidade.trim() || undefined,
      faixa_preco_preliminar: faixa.trim() || undefined,
      contratos_destacados: contratosSelecionados,
      documentos_anexados: documentosAnexados,
      documentos_manuais_meta: manualDrafts,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Pitch curto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="pitch" className="sr-only">
            Pitch
          </Label>
          <Textarea
            id="pitch"
            rows={5}
            value={pitch}
            onChange={(event) => setPitch(event.target.value)}
            placeholder="Por que você é um bom parceiro para este projeto?"
            maxLength={LIMITE_PITCH + 20}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Seja direto: por que vocês são um bom parceiro para este projeto?</span>
            <span className={cn(pitch.length > LIMITE_PITCH && "text-red-600")}>
              {pitch.length}/{LIMITE_PITCH}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Contratos destacáveis do seu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {contratosDestacaveis.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Seu perfil ainda não tem contratos encerrados para destacar. Envie a candidatura normalmente.
            </p>
          ) : (
            <div className="space-y-2">
              {contratosDestacaveis.map((contrato) => {
                const ativo = contratosSelecionados.includes(contrato.id);
                return (
                  <button
                    type="button"
                    key={contrato.id}
                    onClick={() => toggleContrato(contrato.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      ativo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span>
                      Contrato #{contrato.id} - {contrato.valor_final} · {contrato.data_fechamento}
                    </span>
                    <Badge variant="secondary">{ativo ? "Selecionado" : "Selecionar"}</Badge>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" /> Capacidade alocada para este projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!projeto.categoria_item_id || requeridoMensal === undefined ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Este projeto ainda não tem item de catálogo nem volume estimado declarados, então
                não dá pra cruzar com sua capacidade. Você pode prosseguir, mas o fit-score ficará
                limitado.
              </span>
            </div>
          ) : !capacidadePerfil ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Você ainda não declarou capacidade em <strong>{itemProjeto?.nome}</strong>.
                  Sem isso, a empresa não consegue avaliar se você cabe no volume requerido (
                  {formatNumero(requeridoMensal)} {unidadeMensal}).
                </span>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/configuracoes">
                  <Gauge className="h-3.5 w-3.5" /> Cadastrar capacidade primeiro
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
                <p>
                  Você tem{" "}
                  <strong>
                    {formatNumero(capacidadePerfil.capacidade_nominal_mensal)} {unidadeMensal}
                  </strong>{" "}
                  instalados. Atualmente{" "}
                  <strong>{capacidadePerfil.percent_utilizacao_atual}% utilizado</strong> →{" "}
                  <strong>
                    {formatNumero(livreMensal)} {unidadeMensal}
                  </strong>{" "}
                  livres.
                </p>
                <p>
                  Volume requerido pelo projeto:{" "}
                  <strong>
                    {formatNumero(requeridoMensal)} {unidadeMensal}
                  </strong>
                  {projeto.volume_estimado?.periodicidade === "total"
                    ? ` (derivado de ${formatNumero(projeto.volume_estimado.quantidade)} ${unidadeMensal?.replace("/mês", "")} total ÷ ${MESES_DEFAULT_CONTRATO_TOTAL} meses)`
                    : ""}
                  .
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Quanto vai alocar neste projeto?</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={valorAlocado}
                    onChange={(event) => setValorAlocado(event.target.value)}
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {unidadeMensal}
                  </span>
                </div>
                {alocacaoExcedeNominal ? (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-900">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Valor maior que seu teto físico ({formatNumero(nominalMensal)}{" "}
                      {unidadeMensal}). Para alocar mais que isso, amplie sua capacidade
                      nominal em Configurações.
                    </span>
                  </div>
                ) : alocacaoExcedeLivre ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Você está alocando mais que tem livre hoje ({formatNumero(livreMensal)}{" "}
                      {unidadeMensal}). Se essa capacidade vai estar disponível na data de
                      início do projeto, prossiga e descreva o contexto no campo abaixo.
                    </span>
                  </div>
                ) : valorAlocadoNum > 0 && requeridoMensal !== undefined && valorAlocadoNum < requeridoMensal ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Alocação menor que o volume requerido. Você ainda pode candidatar, mas
                      sinaliza atendimento parcial.
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Observação sobre disponibilidade (opcional)</Label>
                <Textarea
                  value={observacaoDisponibilidade}
                  onChange={(event) => setObservacaoDisponibilidade(event.target.value)}
                  placeholder="Ex.: Em jun/2026 libero 40 TON com encerramento do contrato Vale-IT-23."
                  rows={2}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Use se você está alocando acima da capacidade livre hoje, ou se quiser
                  explicar mobilização e contexto. A empresa vê esta observação na triagem.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Faixa de preço preliminar (opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input value={faixa} onChange={(event) => setFaixa(event.target.value)} placeholder="Ex.: R$ 280.000 - R$ 320.000" />
          {!faixa.trim() ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Candidaturas com faixa de preço declarada tendem a avançar mais rápido para proposta formal.
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Documentos para esta candidatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projeto.documentos_exigidos.map((documento) => {
            const anexo = documentosAnexados.find((item) => item.documento_exigido_id === documento.id);
            const sugestaoPerfil = findDocumentoPerfilCompatível(fornecedor, documento);
            const temCredencialRelacionada = documento.credencial_relacionada_id
              ? fornecedor?.credenciais_ids.includes(documento.credencial_relacionada_id)
              : false;
            const draft = manualDrafts[documento.id] ?? { arquivoNome: "", validade: "", observacao: "" };

            const estado = anexo
              ? "Já anexado"
              : sugestaoPerfil
                ? "Sugestão pronta para anexar do perfil"
                : documento.credencial_relacionada_id && temCredencialRelacionada
                  ? "Credencial cadastrada, mas sem comprovante"
                  : "Sem correspondência automática";

            return (
              <div key={documento.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{documento.nome}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{documento.obrigatorio ? "Obrigatório" : "Opcional"}</span>
                      {documento.credencial_relacionada_id ? (
                        <span>Credencial relacionada: {getCredencialNome(documento.credencial_relacionada_id)}</span>
                      ) : null}
                    </div>
                    {documento.observacao ? (
                      <p className="mt-1 text-xs text-muted-foreground">{documento.observacao}</p>
                    ) : null}
                  </div>
                  <Badge variant="secondary">{estado}</Badge>
                </div>

                {anexo ? (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 p-3 text-sm">
                    <div>
                      <p className="font-medium">{anexo.nome}</p>
                      <p className="text-xs text-muted-foreground">{anexo.arquivo_caminho}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setManualAberto(documento.id)}>
                        Trocar anexo
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removerAnexo(documento.id)}>
                        Remover
                      </Button>
                    </div>
                  </div>
                ) : null}

                {!anexo ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sugestaoPerfil ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => anexarDoPerfil(documento, sugestaoPerfil)}>
                        <Link2 className="mr-1 h-4 w-4" /> Anexar do perfil
                      </Button>
                    ) : null}
                    <Button type="button" variant="outline" size="sm" onClick={() => setManualAberto(documento.id)}>
                      <FilePlus2 className="mr-1 h-4 w-4" /> Anexar manualmente
                    </Button>
                    <Button type="button" variant="ghost" size="sm" asChild>
                      <a href="/configuracoes">Ir para perfil</a>
                    </Button>
                  </div>
                ) : null}

                {manualAberto === documento.id ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-dashed border-border p-3">
                    <div className="space-y-2">
                      <Label>Nome do arquivo</Label>
                      <Input value={draft.arquivoNome} onChange={(event) => atualizarDraft(documento.id, { arquivoNome: event.target.value })} placeholder="Ex.: comprovante.pdf" />
                    </div>
                    <div className="space-y-2">
                      <Label>Validade (opcional)</Label>
                      <Input value={draft.validade} onChange={(event) => atualizarDraft(documento.id, { validade: event.target.value })} placeholder="Ex.: 2026-12-31" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Observação (opcional)</Label>
                      <Textarea rows={3} value={draft.observacao} onChange={(event) => atualizarDraft(documento.id, { observacao: event.target.value })} placeholder="Ex.: documento emitido pelo responsável técnico" />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setManualAberto(null)}>
                        Cancelar
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => confirmarAnexoManual(documento)}>
                        Confirmar anexo manual
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {pendenciasObrigatorias.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Há documentos obrigatórios pendentes, mas o envio continua liberado.</p>
              <p className="mt-1 text-xs">
                Pendências: {pendenciasObrigatorias.map((item) => item.nome).join(" · ")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!formularioValido ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {!pitchValido
              ? "Pitch precisa ter ao menos 20 caracteres."
              : !capacidadePerfil
                ? "Declare capacidade no item antes de enviar."
                : alocacaoExcedeNominal
                  ? "Alocação maior que seu teto físico — ajuste antes de enviar."
                  : "Informe quanto da capacidade vai alocar."}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <CTAConsultoria variante={1} />
        <Button type="submit" disabled={!formularioValido}>
          <CheckCircle2 className="mr-1 h-4 w-4" /> Enviar candidatura
        </Button>
      </div>
    </form>
  );
}
