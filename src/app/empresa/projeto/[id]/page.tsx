"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Star,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Mail,
  Phone,
  ChevronUp,
  Archive,
  Globe,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  projetos,
  candidaturas,
  fornecedores,
  statusLabels,
  statusColors,
  type Candidatura,
  type Fornecedor,
  getContratoByProjeto,
} from "@/lib/mock-data";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground hover:text-amber-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

const visibilidadeOpcoes = [
  {
    value: "publico" as const,
    label: "Público",
    desc: "Qualquer visitante pode ver esta demanda arquivada",
    icon: Globe,
  },
  {
    value: "fornecedores" as const,
    label: "Apenas fornecedores",
    desc: "Visível a fornecedores cadastrados na plataforma",
    icon: Users,
  },
  {
    value: "privado" as const,
    label: "Privado",
    desc: "Visível apenas para sua empresa",
    icon: Lock,
  },
];

export default function ProjetoEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id) || projetos[0];
  const candidaturasProjeto = candidaturas
    .filter((c) => c.projeto_id === projeto.id)
    .map((candidatura) => ({
      candidatura,
      fornecedor: fornecedores.find((f) => f.id === candidatura.fornecedor_id),
    }))
    .filter(
      (x): x is { candidatura: Candidatura; fornecedor: Fornecedor } =>
        !!x.fornecedor
    );
  const contrato = getContratoByProjeto(projeto.id);

  const [selectedCandidatura, setSelectedCandidatura] =
    useState<{ candidatura: Candidatura; fornecedor: Fornecedor } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<
    string | null
  >(null);
  const [contatoVisivel, setContatoVisivel] = useState<Set<string>>(new Set());

  // Close-contract flow
  const [fecharDialog, setFecharDialog] = useState(false);
  const [contratoFechado, setContratoFechado] = useState(false);
  const [visibilidade, setVisibilidade] = useState<
    "publico" | "fornecedores" | "privado"
  >("publico");
  const [avaliacaoQualidade, setAvaliacaoQualidade] = useState(0);
  const [avaliacaoPrazo, setAvaliacaoPrazo] = useState(0);
  const [comentario, setComentario] = useState("");

  const candidaturaSelecionada = candidaturasProjeto.find(
    (x) => x.fornecedor.id === fornecedorSelecionado
  );

  const handleSelecionar = (
    item: { candidatura: Candidatura; fornecedor: Fornecedor }
  ) => {
    setSelectedCandidatura(item);
    setConfirmDialog(true);
  };

  const confirmarSelecao = () => {
    if (selectedCandidatura) {
      setFornecedorSelecionado(selectedCandidatura.fornecedor.id);
      setContatoVisivel((prev) =>
        new Set(prev).add(selectedCandidatura.candidatura.id)
      );
    }
    setConfirmDialog(false);
  };

  const confirmarFechamento = () => {
    setContratoFechado(true);
    setFecharDialog(false);
  };

  const toggleContato = (propostaId: string) => {
    setContatoVisivel((prev) => {
      const next = new Set(prev);
      if (next.has(propostaId)) {
        next.delete(propostaId);
      } else {
        next.add(propostaId);
      }
      return next;
    });
  };

  const podeFechar = avaliacaoQualidade > 0 && avaliacaoPrazo > 0;
  const isArquivado = projeto.status === "fechado" || contratoFechado;
  const statusAtual = isArquivado
    ? "fechado"
    : fornecedorSelecionado
    ? "em_propostas"
    : projeto.status;

  return (
    <AppShell tipo="empresa" titulo="Detalhes do Projeto">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/empresa/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>

        {/* Project Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{projeto.titulo}</h1>
                  <Badge
                    variant="secondary"
                    className={statusColors[statusAtual]}
                  >
                    {isArquivado
                      ? "Arquivado"
                      : fornecedorSelecionado
                      ? "Fornecedor Selecionado"
                      : statusLabels[projeto.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{projeto.descricao}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.categoria}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.regiao}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.orcamento}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Prazo: {projeto.prazo}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm font-medium mb-2">Requisitos</p>
              <div className="flex flex-wrap gap-2">
                {projeto.requisitos.map((req) => (
                  <Badge key={req} variant="secondary">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Archived banner */}
        {isArquivado && (
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Archive className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Esta demanda foi arquivada.
                </p>
                {candidaturaSelecionada && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    Contrato fechado com{" "}
                    <span className="font-medium">
                      {candidaturaSelecionada.fornecedor.nome}
                    </span>{" "}
                    —{" "}
                    {candidaturaSelecionada.candidatura.faixa_preco_preliminar ??
                      "valor não informado"}
                  </p>
                )}
                {contrato && !candidaturaSelecionada && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    Fechado em {contrato.data_fechamento} — {contrato.valor_final}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Propostas */}
        {!isArquivado && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Fornecedores Interessados ({candidaturasProjeto.length})
              </h2>
              {fornecedorSelecionado && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setFecharDialog(true)}
                >
                  <Archive className="w-4 h-4" /> Fechar Contrato
                </Button>
              )}
            </div>

            {fornecedorSelecionado && (
              <Card className="mb-4 border-emerald-200 bg-emerald-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-800">
                    Fornecedor selecionado com sucesso! O fornecedor será
                    notificado e poderá iniciar o projeto.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {candidaturasProjeto.map(({ candidatura, fornecedor }) => {
                const isSelected = fornecedorSelecionado === fornecedor.id;
                const isRejected =
                  fornecedorSelecionado && fornecedorSelecionado !== fornecedor.id;

                return (
                  <Card
                    key={candidatura.id}
                    className={
                      isSelected
                        ? "border-emerald-300 bg-emerald-50/50"
                        : isRejected
                        ? "opacity-50"
                        : ""
                    }
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {fornecedor.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{fornecedor.nome}</h3>
                                {isSelected && (
                                  <Badge className="bg-emerald-100 text-emerald-800">
                                    Selecionado
                                  </Badge>
                                )}
                                <Badge
                                  variant="secondary"
                                  className={statusColors[candidatura.status]}
                                >
                                  {statusLabels[candidatura.status]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {fornecedor.reputacao_agregada.total_reviews > 0
                                    ? fornecedor.reputacao_agregada.media_geral.toFixed(1)
                                    : "—"}
                                </span>
                                <span>
                                  {fornecedor.projetosRealizados} projetos
                                </span>
                                <span>{fornecedor.regiao}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {candidatura.faixa_preco_preliminar ?? "Sem faixa"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {candidatura.capacidade_declarada}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mt-3">
                            {candidatura.pitch}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {fornecedor.certificacoes.map((cert) => (
                              <Badge
                                key={cert}
                                variant="outline"
                                className="text-xs"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2 mt-4">
                            {!fornecedorSelecionado && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSelecionar({ candidatura, fornecedor })
                                }
                                className="gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Selecionar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => toggleContato(candidatura.id)}
                            >
                              {contatoVisivel.has(candidatura.id) ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" /> Ocultar contato
                                </>
                              ) : (
                                <>
                                  <Phone className="w-3.5 h-3.5" /> Ver contato
                                </>
                              )}
                            </Button>
                            <Link href={`/empresa/fornecedor/${fornecedor.id}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                <ExternalLink className="w-3.5 h-3.5" /> Ver perfil
                              </Button>
                            </Link>
                          </div>

                          {contatoVisivel.has(candidatura.id) && (
                            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/15 flex flex-col gap-2">
                              <p className="text-xs font-medium text-primary mb-1">
                                Dados para contato
                              </p>
                              <a
                                href={`mailto:${fornecedor.contato.email}`}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                              >
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                {fornecedor.contato.email}
                              </a>
                              <a
                                href={`tel:${fornecedor.contato.telefone}`}
                                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                              >
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                {fornecedor.contato.telefone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirm supplier selection */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Seleção de Fornecedor</DialogTitle>
            <DialogDescription>
              Você está selecionando o fornecedor{" "}
              <strong>{selectedCandidatura?.fornecedor.nome}</strong>
              {selectedCandidatura?.candidatura.faixa_preco_preliminar ? (
                <>
                  {" "}com faixa preliminar de{" "}
                  <strong>
                    {selectedCandidatura.candidatura.faixa_preco_preliminar}
                  </strong>
                </>
              ) : (
                <> (faixa não informada)</>
              )}
              . Proposta formal será solicitada em sequência.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarSelecao} className="gap-1">
              <CheckCircle2 className="w-4 h-4" /> Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close contract dialog */}
      <Dialog open={fecharDialog} onOpenChange={setFecharDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fechar Contrato</DialogTitle>
            <DialogDescription>
              Confirme os dados e avalie o fornecedor antes de arquivar esta
              demanda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Summary */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">{projeto.titulo}</p>
              {candidaturaSelecionada && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                      {candidaturaSelecionada.fornecedor.logo}
                    </div>
                    {candidaturaSelecionada.fornecedor.nome}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-muted-foreground">
                      Faixa preliminar:{" "}
                      <span className="font-medium text-foreground">
                        {candidaturaSelecionada.candidatura.faixa_preco_preliminar ??
                          "não informada"}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Capacidade:{" "}
                      <span className="font-medium text-foreground">
                        {candidaturaSelecionada.candidatura.capacidade_declarada}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Visibilidade após arquivamento
              </p>
              <div className="space-y-2">
                {visibilidadeOpcoes.map((opcao) => {
                  const Icon = opcao.icon;
                  return (
                    <div
                      key={opcao.value}
                      onClick={() => setVisibilidade(opcao.value)}
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 transition-colors flex items-start gap-3",
                        visibilidade === opcao.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 mt-0.5 shrink-0",
                          visibilidade === opcao.value
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">{opcao.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {opcao.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-4">
              <p className="text-sm font-medium">Avaliação do fornecedor</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    Qualidade do serviço
                  </p>
                  <StarRating
                    value={avaliacaoQualidade}
                    onChange={setAvaliacaoQualidade}
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    Cumprimento de prazo
                  </p>
                  <StarRating
                    value={avaliacaoPrazo}
                    onChange={setAvaliacaoPrazo}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  Comentário (opcional)
                </p>
                <Textarea
                  rows={3}
                  placeholder="Descreva sua experiência com este fornecedor..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
            </div>

            {!podeFechar && (
              <p className="text-xs text-muted-foreground">
                Avalie a qualidade e o prazo para habilitar o fechamento.
              </p>
            )}

            <div className="flex gap-3 justify-end pt-1">
              <Button
                variant="outline"
                onClick={() => setFecharDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarFechamento}
                disabled={!podeFechar}
                className="gap-1.5"
              >
                <Archive className="w-4 h-4" /> Fechar Contrato
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
