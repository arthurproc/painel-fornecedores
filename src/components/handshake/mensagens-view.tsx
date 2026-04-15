"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  candidaturas,
  conversas,
  empresas,
  fornecedores,
  getMembroById,
  mensagens as mensagensSeed,
  projetos,
  templatesPergunta,
  type Conversa,
  type Mensagem,
  type TemplatePergunta,
} from "@/lib/mock-data";

interface MensagensViewProps {
  lado: "empresa" | "fornecedor";
  filtrarConversa: (conversa: Conversa) => boolean;
}

let localMessageCounter = 0;

function createLocalMessageId(prefix: string) {
  localMessageCounter += 1;
  return `${prefix}-${localMessageCounter}`;
}

export function MensagensView({ lado, filtrarConversa }: MensagensViewProps) {
  const conversasDisponiveis = useMemo(
    () =>
      conversas
        .filter(filtrarConversa)
        .sort((a, b) =>
          (b.ultima_mensagem_em ?? b.criada_em).localeCompare(a.ultima_mensagem_em ?? a.criada_em)
        ),
    [filtrarConversa]
  );

  const [conversaAtivaId, setConversaAtivaId] = useState<string | null>(
    conversasDisponiveis[0]?.id ?? null
  );
  const [mensagensLocais, setMensagensLocais] = useState<Mensagem[]>([]);
  const [rascunho, setRascunho] = useState("");
  const [drawerAberto, setDrawerAberto] = useState(false);

  const conversaAtiva = conversasDisponiveis.find((c) => c.id === conversaAtivaId) ?? null;

  const mensagensDaConversa = useMemo(() => {
    if (!conversaAtiva) return [];
    return [...mensagensSeed, ...mensagensLocais]
      .filter((m) => m.conversa_id === conversaAtiva.id)
      .sort((a, b) => a.enviada_em.localeCompare(b.enviada_em));
  }, [conversaAtiva, mensagensLocais]);

  function enviarLivre() {
    if (!conversaAtiva || !rascunho.trim()) return;
    const novaMsg: Mensagem = {
      id: createLocalMessageId("local"),
      conversa_id: conversaAtiva.id,
      autor_membro_id: obterAutorId(lado, conversaAtiva),
      tipo: "livre",
      conteudo: rascunho.trim(),
      enviada_em: new Date().toISOString().slice(0, 19),
    };
    setMensagensLocais((prev) => [...prev, novaMsg]);
    setRascunho("");
  }

  function usarTemplate(template: TemplatePergunta) {
    if (!conversaAtiva) return;
    const novaMsg: Mensagem = {
      id: createLocalMessageId("local-tpl"),
      conversa_id: conversaAtiva.id,
      autor_membro_id: obterAutorId(lado, conversaAtiva),
      tipo: "template_pergunta",
      conteudo: template.pergunta,
      template_id: template.id,
      enviada_em: new Date().toISOString().slice(0, 19),
    };
    setMensagensLocais((prev) => [...prev, novaMsg]);
    setDrawerAberto(false);
  }

  function responderTemplate(mensagemPergunta: Mensagem, resposta: string) {
    if (!conversaAtiva || !resposta.trim()) return;
    const novaMsg: Mensagem = {
      id: createLocalMessageId("local-rep"),
      conversa_id: conversaAtiva.id,
      autor_membro_id: obterAutorId(lado, conversaAtiva),
      tipo: "template_resposta",
      conteudo: resposta.trim(),
      template_id: mensagemPergunta.template_id,
      resposta_a_mensagem_id: mensagemPergunta.id,
      enviada_em: new Date().toISOString().slice(0, 19),
    };
    setMensagensLocais((prev) => [...prev, novaMsg]);
  }

  if (conversasDisponiveis.length === 0) {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="p-10 text-center">
          <p className="font-medium">Nenhuma conversa ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Conversas são abertas automaticamente quando uma candidatura é selecionada para proposta.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr]">
      <Card className="rounded-xl lg:overflow-hidden">
        <CardContent className="flex h-full flex-col p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Conversas</p>
            <p className="text-xs text-muted-foreground">
              {conversasDisponiveis.length} conversa(s)
            </p>
          </div>
          <ul className="flex-1 divide-y divide-border overflow-y-auto">
            {conversasDisponiveis.map((conversa) => {
              const info = infoConversa(conversa, lado);
              const ativo = conversa.id === conversaAtivaId;
              return (
                <li key={conversa.id}>
                  <button
                    type="button"
                    onClick={() => setConversaAtivaId(conversa.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                      ativo ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {info.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{info.contraparte}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {info.projetoTitulo}
                      </p>
                    </div>
                    {conversa.status !== "ativa" && (
                      <Badge variant="outline" className="text-[10px]">
                        {conversa.status}
                      </Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl lg:overflow-hidden">
        <CardContent className="flex h-full flex-col p-0">
          {conversaAtiva ? (
            <>
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div>
                  <p className="text-sm font-semibold">
                    {infoConversa(conversaAtiva, lado).contraparte}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {infoConversa(conversaAtiva, lado).projetoTitulo}
                  </p>
                </div>
                <Sheet open={drawerAberto} onOpenChange={setDrawerAberto}>
                  <SheetTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Sparkles className="h-4 w-4" /> Usar template
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-96 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Templates de pergunta</SheetTitle>
                      <SheetDescription>
                        Selecione um template pronto — a resposta do outro lado vem estruturada.
                      </SheetDescription>
                    </SheetHeader>
                    <ul className="mt-6 space-y-2">
                      {templatesPergunta
                        .filter((t) => t.ativo)
                        .map((template) => (
                          <li key={template.id}>
                            <button
                              type="button"
                              onClick={() => usarTemplate(template)}
                              className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                            >
                              <p className="text-sm font-medium">{template.titulo}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {template.pergunta}
                              </p>
                              <Badge variant="outline" className="mt-2 text-[10px]">
                                {template.categoria}
                              </Badge>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {mensagensDaConversa.map((mensagem) => (
                  <MensagemItem
                    key={mensagem.id}
                    mensagem={mensagem}
                    lado={lado}
                    conversa={conversaAtiva}
                    onResponderTemplate={(resposta) => responderTemplate(mensagem, resposta)}
                    respostas={mensagensDaConversa.filter(
                      (m) => m.resposta_a_mensagem_id === mensagem.id
                    )}
                  />
                ))}
              </div>

              <div className="border-t border-border bg-muted/30 p-4">
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    enviarLivre();
                  }}
                >
                  <Input
                    value={rascunho}
                    onChange={(event) => setRascunho(event.target.value)}
                    placeholder="Escreva uma mensagem…"
                  />
                  <Button type="submit" className="gap-2" disabled={!rascunho.trim()}>
                    <Send className="h-4 w-4" /> Enviar
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              <ChevronLeft className="mr-2 h-4 w-4" /> Selecione uma conversa
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function infoConversa(conversa: Conversa, lado: "empresa" | "fornecedor") {
  const candidatura = candidaturas.find((c) => c.id === conversa.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const fornecedor = candidatura
    ? fornecedores.find((f) => f.id === candidatura.fornecedor_id)
    : undefined;
  const contraparte =
    lado === "empresa"
      ? fornecedor?.nome ?? "Fornecedor"
      : empresa?.nome ?? "Empresa";
  const avatar = lado === "empresa" ? fornecedor?.logo ?? "?" : empresa?.logo ?? "?";
  return {
    contraparte,
    avatar,
    projetoTitulo: projeto?.titulo ?? "Projeto",
  };
}

function obterAutorId(lado: "empresa" | "fornecedor", conversa: Conversa): string {
  if (lado === "empresa") {
    return conversa.empresa_membros_ids[0] ?? "membro-empresa";
  }
  return conversa.fornecedor_membros_ids[0] ?? "membro-fornecedor";
}

function MensagemItem({
  mensagem,
  lado,
  conversa,
  respostas,
  onResponderTemplate,
}: {
  mensagem: Mensagem;
  lado: "empresa" | "fornecedor";
  conversa: Conversa;
  respostas: Mensagem[];
  onResponderTemplate: (resposta: string) => void;
}) {
  const autor = getMembroById(mensagem.autor_membro_id);
  const autorLado = conversa.empresa_membros_ids.includes(mensagem.autor_membro_id)
    ? "empresa"
    : "fornecedor";
  const meu = autorLado === lado;
  const [respostaTemplate, setRespostaTemplate] = useState("");
  const resposta = respostas.find((r) => r.tipo === "template_resposta");

  if (mensagem.tipo === "template_resposta") {
    return null;
  }

  return (
    <div className={cn("flex w-full", meu ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
          meu
            ? "bg-primary text-primary-foreground"
            : mensagem.tipo === "template_pergunta"
              ? "border border-amber-300 bg-amber-50 text-amber-900"
              : "bg-muted"
        )}
      >
        {mensagem.tipo === "template_pergunta" && (
          <p className={cn("mb-1 text-[10px] font-medium uppercase", meu ? "text-primary-foreground/80" : "text-amber-700")}>
            Template · Pergunta estruturada
          </p>
        )}
        <p className="whitespace-pre-wrap">{mensagem.conteudo}</p>
        <p className={cn("mt-1 text-[10px]", meu ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {autor?.nome ?? "Membro"} · {mensagem.enviada_em.replace("T", " ").slice(0, 16)}
        </p>

        {mensagem.tipo === "template_pergunta" && (
          <div className="mt-3 space-y-2 border-t border-amber-200 pt-2">
            {resposta ? (
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-amber-900">
                <p className="mb-1 font-medium">Resposta</p>
                <p>{resposta.conteudo}</p>
              </div>
            ) : !meu ? (
              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  onResponderTemplate(respostaTemplate);
                  setRespostaTemplate("");
                }}
              >
                <Input
                  value={respostaTemplate}
                  onChange={(event) => setRespostaTemplate(event.target.value)}
                  placeholder="Responder…"
                  className="h-8 text-xs"
                />
                <Button size="sm" type="submit" disabled={!respostaTemplate.trim()}>
                  Responder
                </Button>
              </form>
            ) : (
              <p className="text-[10px] italic text-amber-800/80">Aguardando resposta…</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
