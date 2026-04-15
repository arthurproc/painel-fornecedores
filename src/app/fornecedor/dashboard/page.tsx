import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { BannerConsultoria, type BannerConsultoriaEstado } from "@/components/dashboard/banner-consultoria";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  contratos,
  conversas,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  membros,
  mensagens,
  projetos,
  propostas,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";

const DATA_REFERENCIA = new Date("2026-04-15T12:00:00");

function parseDataIso(data: string): Date {
  return new Date(`${data}T12:00:00`);
}

function diasDesde(dataIso?: string): number | null {
  if (!dataIso) {
    return null;
  }
  const diffMs = DATA_REFERENCIA.getTime() - parseDataIso(dataIso).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function primeiraPalavra(nome?: string): string {
  if (!nome) {
    return "Pedro";
  }
  return nome.trim().split(" ")[0] ?? "Pedro";
}

function calcularFitScore(categoriaProjeto: string, regiaoProjeto: string, regioesFornecedor: string[]): number {
  let score = 40;
  if (regioesFornecedor.includes(regiaoProjeto)) {
    score += 25;
  }
  if (categoriaProjeto) {
    score += 35;
  }
  return Math.min(score, 96);
}

export default function FornecedorDashboard() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedorAtual = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const fornecedorId = fornecedorAtual?.id;
  const fornecedorCategorias = fornecedorAtual?.categorias ?? [];
  const fornecedorRegioes = fornecedorAtual?.regioes_atendidas ?? [];

  const projetoPorId = new Map(projetos.map((projeto) => [projeto.id, projeto]));
  const empresaPorId = new Map(empresas.map((empresa) => [empresa.id, empresa]));
  const candidaturaPorId = new Map(candidaturas.map((candidatura) => [candidatura.id, candidatura]));

  const propostasAEnviar = propostas
    .filter((proposta) => {
      const candidatura = candidaturaPorId.get(proposta.candidatura_id);
      return candidatura?.fornecedor_id === fornecedorId && proposta.status === "rascunho";
    })
    .map((proposta) => {
      const candidatura = candidaturaPorId.get(proposta.candidatura_id);
      const projeto = candidatura ? projetoPorId.get(candidatura.projeto_id) : undefined;
      const empresa = projeto ? empresaPorId.get(projeto.empresa_id) : undefined;
      return { proposta, projeto, empresa };
    })
    .slice(0, 2);

  const minhasCandidaturas = candidaturas
    .filter(
      (candidatura) => candidatura.fornecedor_id === fornecedorId && candidatura.status !== "rascunho"
    )
    .sort((a, b) => {
      const dataA = a.enviada_em ?? a.criada_em;
      const dataB = b.enviada_em ?? b.criada_em;
      return parseDataIso(dataB).getTime() - parseDataIso(dataA).getTime();
    })
    .map((candidatura) => {
      const projeto = projetoPorId.get(candidatura.projeto_id);
      const empresa = projeto ? empresaPorId.get(projeto.empresa_id) : undefined;
      return { candidatura, projeto, empresa };
    });

  const projetosRecomendados = projetos
    .filter(
      (projeto) =>
        (projeto.status === "publicado" || projeto.status === "em_triagem") &&
        fornecedorCategorias.some((categoria) => categoria === projeto.categoria)
    )
    .map((projeto) => {
      const empresa = empresaPorId.get(projeto.empresa_id);
      return {
        projeto,
        empresa,
        fitScore: calcularFitScore(projeto.categoria, projeto.regiao, fornecedorRegioes),
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 2);

  const candidaturaDescartadaRecente = candidaturas
    .filter(
      (candidatura) => candidatura.fornecedor_id === fornecedorId && candidatura.status === "descartada"
    )
    .sort((a, b) => parseDataIso(b.decidida_em ?? b.criada_em).getTime() - parseDataIso(a.decidida_em ?? a.criada_em).getTime())
    .find((candidatura) => {
      const dataReferencia = candidatura.decidida_em ?? candidatura.enviada_em ?? candidatura.criada_em;
      const dias = diasDesde(dataReferencia);
      return dias !== null && dias <= 14;
    });

  const projetoAltoFit = projetosRecomendados.find((item) => item.fitScore >= 80);

  const estadoBanner: BannerConsultoriaEstado = candidaturaDescartadaRecente
    ? "descarte_recente"
    : projetoAltoFit
      ? "projeto_alto_fit"
      : "default";

  const projetoDoDescarte = candidaturaDescartadaRecente
    ? projetoPorId.get(candidaturaDescartadaRecente.projeto_id)
    : undefined;

  const contratosEmExecucao = contratos
    .filter(
      (contrato) => contrato.fornecedor_id === fornecedorId && contrato.status === "em_execucao"
    )
    .map((contrato) => {
      const projeto = projetoPorId.get(contrato.projeto_id);
      const empresa = projeto ? empresaPorId.get(projeto.empresa_id) : undefined;
      return { contrato, projeto, empresa };
    });

  const membrosFornecedorIds = new Set(
    membros
      .filter((membro) => membro.organizacao_id === membroLogado?.organizacao_id)
      .map((membro) => membro.id)
  );

  const conversaIdsFornecedor = new Set(
    conversas
      .filter((conversa) =>
        conversa.fornecedor_membros_ids.some((membroId) => membrosFornecedorIds.has(membroId))
      )
      .map((conversa) => conversa.id)
  );

  const conversaPorId = new Map(conversas.map((conversa) => [conversa.id, conversa]));

  const mensagensNaoLidas = mensagens
    .filter(
      (mensagem) =>
        conversaIdsFornecedor.has(mensagem.conversa_id) &&
        !membrosFornecedorIds.has(mensagem.autor_membro_id) &&
        !mensagem.lida_em
    )
    .sort(
      (a, b) => parseDataIso(b.enviada_em).getTime() - parseDataIso(a.enviada_em).getTime()
    );

  const resumoMensagens = mensagensNaoLidas.slice(0, 2).map((mensagem) => {
    const conversa = conversaPorId.get(mensagem.conversa_id);
    const candidatura = conversa ? candidaturaPorId.get(conversa.candidatura_id) : undefined;
    const projeto = candidatura ? projetoPorId.get(candidatura.projeto_id) : undefined;
    const empresa = projeto ? empresaPorId.get(projeto.empresa_id) : undefined;
    return {
      id: mensagem.id,
      empresaNome: empresa?.nome ?? "Empresa",
      conteudo: mensagem.conteudo,
    };
  });

  return (
    <AppShell tipo="fornecedor" titulo="Dashboard">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xl font-semibold">
            Olá, {primeiraPalavra(membroLogado?.nome)}. Veja onde sua atenção pode render mais.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Propostas a enviar</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Importante
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {propostasAEnviar.length > 0 ? (
                propostasAEnviar.map(({ proposta, projeto, empresa }) => (
                  <div key={proposta.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{projeto?.titulo ?? "Projeto"}</p>
                    <p className="text-xs text-muted-foreground">
                      {empresa?.nome ?? "Empresa"} — prazo {projeto?.prazo ?? "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Propostas formais aparecem quando você é shortlisted.
                </p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/fornecedor/propostas">Ir para propostas</Link>
              </Button>
            </CardContent>
          </Card>

          <BannerConsultoria
            estado={estadoBanner}
            projetoTitulo={projetoDoDescarte?.titulo ?? projetoAltoFit?.projeto.titulo}
            empresaNome={projetoAltoFit?.empresa?.nome}
            fitScore={projetoAltoFit?.fitScore}
          />
        </div>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold">Minhas candidaturas</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Acompanhamento
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {minhasCandidaturas.length > 0 ? (
              minhasCandidaturas.slice(0, 3).map(({ candidatura, projeto, empresa }) => {
                const dias = diasDesde(candidatura.enviada_em ?? candidatura.criada_em);
                return (
                  <div key={candidatura.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{projeto?.titulo ?? "Projeto"}</p>
                        <p className="text-xs text-muted-foreground">{empresa?.nome ?? "Empresa"}</p>
                      </div>
                      <Badge variant="secondary" className={statusColors[candidatura.status]}>
                        {statusLabels[candidatura.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {dias !== null ? `${dias} dia(s) desde a última atualização` : "Sem data"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Quando você se candidatar a um projeto, ele aparece aqui.
              </p>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href="/fornecedor/candidaturas">Ver todas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold">Projetos recomendados para você</CardTitle>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Oportunidade
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projetosRecomendados.length > 0 ? (
              projetosRecomendados.map(({ projeto, empresa, fitScore }) => (
                <div key={projeto.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{projeto.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {empresa?.nome ?? "Empresa"} — {projeto.cidade}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fit score: <span className="font-medium text-foreground">{fitScore}%</span> — {projeto.orcamento}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum projeto encontrado. Tente ampliar categorias ou regiões.
              </p>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href="/fornecedor/projetos">Descobrir mais projetos</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Contratos em execução</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Em andamento
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {contratosEmExecucao.length > 0 ? (
                contratosEmExecucao.map(({ contrato, projeto, empresa }) => (
                  <div key={contrato.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{projeto?.titulo ?? "Contrato"}</p>
                    <p className="text-xs text-muted-foreground">{empresa?.nome ?? "Empresa"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Início {contrato.data_inicio ?? "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Quando um contrato for iniciado, ele aparece aqui.
                </p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/fornecedor/contratos/em-execucao">Abrir contratos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Mensagens</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Importante
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mensagensNaoLidas.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">{mensagensNaoLidas.length} não lida(s).</p>
                  {resumoMensagens.map((mensagem) => (
                    <div key={mensagem.id} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-medium">{mensagem.empresaNome}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {mensagem.conteudo}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Mensagens com empresas aparecem após shortlist.
                </p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/fornecedor/mensagens">Abrir</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
