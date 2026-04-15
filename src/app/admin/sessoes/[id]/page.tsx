"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  User,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorNotas } from "@/components/consultoria/editor-notas";
import { MarkdownSimples } from "@/components/consultoria/markdown-simples";
import {
  adicionarEntregavel,
  advisors,
  candidaturas,
  empresas,
  estudosDeCaso,
  fornecedores,
  getCatalogoById,
  getSessaoById,
  iniciarSessao,
  marcarSessaoEntregue,
  projetos,
  propostas,
  type EstudoDeCaso,
  type SessaoConsultoria,
} from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

type TipoEntregavel = SessaoConsultoria["entregaveis"][number]["tipo"];
type FaseEntregavel = "candidatura" | "proposta";

export default function WorkspaceSessaoPage({ params }: Props) {
  const { id } = use(params);
  const sessaoOpt = getSessaoById(id);
  if (!sessaoOpt) return notFound();
  const sessao = sessaoOpt;

  const [, rerender] = useState(0);
  const [tipo, setTipo] = useState<TipoEntregavel>("notas");
  const [fase, setFase] = useState<FaseEntregavel>("candidatura");
  const [sucessoEntrega, setSucessoEntrega] = useState(false);

  const catalogo = getCatalogoById(sessao.catalogo_id);
  const advisor = advisors.find((a) => a.id === sessao.advisor_id);
  const fornecedor = fornecedores.find((f) => f.id === sessao.fornecedor_id);
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const proposta = sessao.proposta_id
    ? propostas.find((p) => p.id === sessao.proposta_id)
    : undefined;

  const estudosSugeridos: EstudoDeCaso[] = estudosDeCaso.filter((e) => {
    if (!projeto) return false;
    return (
      e.contexto.categoria === projeto.categoria || e.contexto.regiao === projeto.regiao
    );
  });

  function forcarRerender() {
    rerender((x) => x + 1);
  }

  function handlePublicar(conteudo: string) {
    iniciarSessao(sessao.id);
    adicionarEntregavel(sessao.id, {
      tipo,
      fase,
      conteudo,
      criado_em: new Date().toISOString().slice(0, 10),
    });
    forcarRerender();
  }

  function handleAnexarEstudo(estudo: EstudoDeCaso) {
    iniciarSessao(sessao.id);
    adicionarEntregavel(sessao.id, {
      tipo: "estudo_caso",
      fase,
      conteudo: `Estudo de caso anexado: **${estudo.titulo}** — ${estudo.resumo} [${estudo.id}](/consultoria/estudos/${estudo.id})`,
      criado_em: new Date().toISOString().slice(0, 10),
    });
    forcarRerender();
  }

  function handleMarcarEntregue() {
    if (sessao.entregaveis.length === 0) return;
    marcarSessaoEntregue(sessao.id);
    setSucessoEntrega(true);
    forcarRerender();
  }

  const podeEntregar = sessao.status !== "entregue" && sessao.entregaveis.length > 0;

  return (
    <AppShell tipo="admin" titulo={`Workspace — ${catalogo?.nome ?? "Sessão"}`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="w-fit">
            <Link href="/admin/sessoes/solicitadas">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="capitalize">
              {sessao.status.replace("_", " ")}
            </Badge>
            {sessao.status === "entregue" ? (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-900">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Entregue
              </Badge>
            ) : (
              <Button
                size="sm"
                disabled={!podeEntregar}
                onClick={handleMarcarEntregue}
                title={
                  podeEntregar
                    ? "Marcar como entregue"
                    : "Adicione ao menos um entregável antes de marcar"
                }
              >
                Marcar como entregue
              </Button>
            )}
          </div>
        </div>

        {sucessoEntrega ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Sessão marcada como entregue — fornecedor será notificado.
          </div>
        ) : null}

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">
              Sessão #{sessao.id} — {catalogo?.nome}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Atribuída a {advisor?.nome ?? "aguardando"} — solicitada em {sessao.solicitada_em}
              {sessao.atribuida_em ? ` · atribuída em ${sessao.atribuida_em}` : ""}
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contexto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <User className="h-3 w-3" /> Fornecedor
                  </p>
                  <p className="font-medium">{fornecedor?.nome}</p>
                  <p className="text-muted-foreground">
                    {fornecedor?.regiao} · desde {fornecedor?.desde}
                  </p>
                  {fornecedor ? (
                    <Link
                      href={`/perfil/fornecedor/${fornecedor.organizacao_id}`}
                      className="text-xs text-primary underline"
                    >
                      Ver perfil completo
                    </Link>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Building2 className="h-3 w-3" /> Empresa
                  </p>
                  <p className="font-medium">{empresa?.nome ?? "—"}</p>
                  {empresa ? (
                    <Link
                      href={`/perfil/empresa/${empresa.organizacao_id}`}
                      className="text-xs text-primary underline"
                    >
                      Ver perfil completo
                    </Link>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FolderOpen className="h-3 w-3" /> Projeto
                  </p>
                  <p className="font-medium">{projeto?.titulo ?? "—"}</p>
                  {projeto ? (
                    <>
                      <p className="text-muted-foreground">
                        {projeto.orcamento} · prazo {projeto.prazo}
                      </p>
                      <p className="text-muted-foreground">
                        {projeto.categoria} · {projeto.regiao}
                      </p>
                    </>
                  ) : null}
                </div>

                {candidatura ? (
                  <div className="space-y-1 rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Candidatura ({candidatura.status})
                    </p>
                    <p className="text-muted-foreground line-clamp-3">{candidatura.pitch}</p>
                    {candidatura.faixa_preco_preliminar ? (
                      <p className="text-xs text-muted-foreground">
                        Faixa: {candidatura.faixa_preco_preliminar}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {proposta ? (
                  <div className="space-y-1 rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Proposta ({proposta.status})
                    </p>
                    <p className="text-muted-foreground">Preço final: {proposta.preco_final}</p>
                  </div>
                ) : null}

                {sessao.contexto_extra ? (
                  <div className="space-y-1 rounded-lg border border-dashed border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Contexto extra (do fornecedor)
                    </p>
                    <p className="text-muted-foreground">{sessao.contexto_extra}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="inline-flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4" /> Estudos sugeridos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {estudosSugeridos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum estudo de caso relacionado a esta categoria/região.
                  </p>
                ) : (
                  estudosSugeridos.map((estudo) => (
                    <div
                      key={estudo.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {estudo.titulo}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {estudo.contexto.categoria} · {estudo.contexto.regiao}
                        </p>
                      </div>
                      {sessao.status !== "entregue" ? (
                        <Button size="sm" variant="outline" onClick={() => handleAnexarEstudo(estudo)}>
                          Anexar
                        </Button>
                      ) : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Entregáveis publicados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessao.entregaveis.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum entregável ainda. Publique notas ou anexe um estudo para habilitar a
                    entrega.
                  </p>
                ) : (
                  sessao.entregaveis.map((entregavel, idx) => (
                    <div key={idx} className="rounded-lg border border-border p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span className="capitalize">{entregavel.tipo.replace("_", " ")}</span>
                        {entregavel.fase ? (
                          <Badge variant="outline" className="rounded-full text-xs">
                            fase {entregavel.fase}
                          </Badge>
                        ) : null}
                        <span className="ml-auto">Publicado em {entregavel.criado_em}</span>
                      </div>
                      <MarkdownSimples conteudo={entregavel.conteudo} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {sessao.status !== "entregue" ? (
              <Card className="rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Novo entregável</CardTitle>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <label className="flex items-center gap-1">
                      <span className="text-muted-foreground">Tipo:</span>
                      <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as TipoEntregavel)}
                        className="rounded-md border border-border bg-background px-2 py-1"
                      >
                        <option value="notas">Notas</option>
                        <option value="estudo_caso">Estudo de caso</option>
                        <option value="sessao_video">Sessão em vídeo</option>
                        <option value="outro">Outro</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-1">
                      <span className="text-muted-foreground">Fase:</span>
                      <select
                        value={fase}
                        onChange={(e) => setFase(e.target.value as FaseEntregavel)}
                        className="rounded-md border border-border bg-background px-2 py-1"
                      >
                        <option value="candidatura">Candidatura</option>
                        <option value="proposta">Proposta</option>
                      </select>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  <EditorNotas onPublicar={handlePublicar} />
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Comunicação com o fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
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
              <p className="text-sm italic text-muted-foreground">
                Vazio até o fornecedor responder a partir dos entregáveis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
