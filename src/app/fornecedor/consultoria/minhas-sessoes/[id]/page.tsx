"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  FolderOpen,
  MessageSquare,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MarkdownSimples } from "@/components/consultoria/markdown-simples";
import { ModalAvaliarAtendimento } from "@/components/consultoria/modal-avaliar-atendimento";
import {
  MEMBRO_LOGADO_ID,
  adicionarComentarioFornecedor,
  advisors,
  cancelarSessao,
  candidaturas,
  empresas,
  getCatalogoById,
  getMembroById,
  getSessaoById,
  marcarSessaoUtil,
  projetos,
} from "@/lib/mock-data";
import { useSessaoMock } from "@/lib/session";

interface Props {
  params: Promise<{ id: string }>;
}

export default function DetalheSessaoFornecedorPage({ params }: Props) {
  useSessaoMock();
  const { id } = use(params);
  const sessaoOpt = getSessaoById(id);
  if (!sessaoOpt) return notFound();
  const sessao = sessaoOpt;

  const catalogo = getCatalogoById(sessao.catalogo_id);
  const advisor = advisors.find((a) => a.id === sessao.advisor_id);
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);

  const [comentario, setComentario] = useState("");
  const [util, setUtil] = useState(Boolean(sessao.marcado_util));
  const [avaliarAberto, setAvaliarAberto] = useState(false);
  const [, rerender] = useState(0);

  function forcarRerender() {
    rerender((x) => x + 1);
  }

  function handleEnviarComentario() {
    if (!comentario.trim() || !membroLogado) return;
    adicionarComentarioFornecedor(sessao.id, membroLogado.id, comentario.trim());
    setComentario("");
    forcarRerender();
  }

  function handleToggleUtil() {
    const novo = !util;
    marcarSessaoUtil(sessao.id, novo);
    setUtil(novo);
  }

  function handleCancelar() {
    if (!confirm("Cancelar esta sessão? Ação sem custo antes da entrega.")) return;
    cancelarSessao(sessao.id);
    forcarRerender();
  }

  const podeCancelar = sessao.status !== "entregue" && sessao.status !== "cancelada";
  const jaAvaliou = Boolean(sessao.avaliacao_atendimento);

  return (
    <AppShell tipo="fornecedor" titulo={catalogo?.nome ?? "Sessão"}>
      <div className="max-w-4xl space-y-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/fornecedor/consultoria/minhas-sessoes">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Link>
        </Button>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">{catalogo?.nome}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {projeto?.titulo} · {empresa?.nome}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  sessao.status === "entregue" && "bg-emerald-100 text-emerald-900",
                  sessao.status === "em_andamento" && "bg-blue-100 text-blue-900",
                  sessao.status === "atribuida" && "bg-blue-100 text-blue-900",
                  sessao.status === "solicitada" && "bg-amber-100 text-amber-900",
                  sessao.status === "cancelada" && "bg-gray-100 text-gray-700"
                )}
              >
                {sessao.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p className="font-medium">Advisor</p>
              <p className="text-muted-foreground">
                {advisor?.nome ?? "Aguardando atribuição"}
              </p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">Preço</p>
              <p className="text-muted-foreground">{sessao.preco_snapshot}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">Solicitada</p>
              <p className="text-muted-foreground">{sessao.solicitada_em}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">Entregue</p>
              <p className="text-muted-foreground">{sessao.entregue_em ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        {sessao.contexto_extra ? (
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contexto enviado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{sessao.contexto_extra}</p>
            </CardContent>
          </Card>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Entregáveis</h2>
          {sessao.entregaveis.length === 0 ? (
            <Card className="rounded-xl border-dashed">
              <CardContent className="p-6 text-sm text-muted-foreground">
                {sessao.status === "cancelada"
                  ? "Sessão cancelada — sem entregáveis."
                  : "Entregáveis aparecem aqui assim que o advisor publicar."}
              </CardContent>
            </Card>
          ) : (
            sessao.entregaveis.map((entregavel, idx) => (
              <Card key={idx} className="rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="capitalize">{entregavel.tipo.replace("_", " ")}</span>
                    {entregavel.fase ? (
                      <Badge variant="outline" className="rounded-full text-xs">
                        fase {entregavel.fase}
                      </Badge>
                    ) : null}
                    <span className="ml-auto">Publicado em {entregavel.criado_em}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <MarkdownSimples conteudo={entregavel.conteudo} />
                </CardContent>
              </Card>
            ))
          )}
        </section>

        {sessao.status === "entregue" ? (
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={util ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleUtil}
                  className="gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {util ? "Marcada como útil" : "Marcar como útil"}
                </Button>
                <Button
                  variant={jaAvaliou ? "outline" : "default"}
                  size="sm"
                  onClick={() => setAvaliarAberto(true)}
                >
                  {jaAvaliou
                    ? `Avaliação: ${sessao.avaliacao_atendimento?.nota}/5`
                    : "Avaliar atendimento"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Comentários para o advisor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessao.comentarios_fornecedor && sessao.comentarios_fornecedor.length > 0 ? (
              <div className="space-y-2">
                {sessao.comentarios_fornecedor.map((c, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-3 text-sm">
                    <p className="text-muted-foreground">{c.conteudo}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      Enviado em {c.enviado_em}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum comentário enviado.</p>
            )}

            {sessao.status !== "cancelada" ? (
              <div className="space-y-2">
                <Textarea
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva uma dúvida ou comentário para o advisor"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleEnviarComentario}
                    disabled={!comentario.trim()}
                    className="gap-1"
                  >
                    <MessageSquare className="h-4 w-4" /> Enviar
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {projeto ? (
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href={`/fornecedor/projeto/${projeto.id}`}>
                  <FolderOpen className="h-3.5 w-3.5" /> Ver projeto
                </Link>
              </Button>
            ) : null}
            {empresa ? (
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href={`/perfil/empresa/${empresa.organizacao_id}`}>
                  <Building2 className="h-3.5 w-3.5" /> Ver empresa
                </Link>
              </Button>
            ) : null}
          </div>
          {podeCancelar ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelar}
              className="gap-1 text-muted-foreground hover:text-destructive"
            >
              {sessao.status === "cancelada" ? (
                <>
                  <Check className="h-4 w-4" /> Cancelada
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" /> Cancelar sessão
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <ModalAvaliarAtendimento
        sessao={sessao}
        open={avaliarAberto}
        onOpenChange={setAvaliarAberto}
        onSalvar={forcarRerender}
      />
    </AppShell>
  );
}
