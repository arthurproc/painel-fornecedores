import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  contratos,
  conversas,
  empresas,
  fornecedores,
  getMembroById,
  membros,
  mensagens,
  projetos,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";

const DATA_REFERENCIA = new Date("2026-04-15T12:00:00");

function parseDataPtBr(data: string): Date {
  const [dia, mes, ano] = data.split("/");
  return new Date(Number(ano), Number(mes) - 1, Number(dia), 12);
}

function parseDataIso(data: string): Date {
  return new Date(`${data}T12:00:00`);
}

function diasAtePrazo(prazo: string): number {
  const diffMs = parseDataPtBr(prazo).getTime() - DATA_REFERENCIA.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function primeiraPalavra(nome?: string): string {
  if (!nome) {
    return "Maria";
  }
  return nome.trim().split(" ")[0] ?? "Maria";
}

export default function EmpresaDashboard() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresaAtual = empresas.find(
    (empresa) => empresa.organizacao_id === membroLogado?.organizacao_id
  );
  const empresaId = empresaAtual?.id;

  const membrosEmpresaIds = new Set(
    membros
      .filter((membro) => membro.organizacao_id === membroLogado?.organizacao_id)
      .map((membro) => membro.id)
  );

  const projetosAtivos = projetos
    .filter(
      (projeto) =>
        projeto.empresa_id === empresaId &&
        (projeto.status === "publicado" ||
          projeto.status === "em_triagem" ||
          projeto.status === "em_propostas")
    )
    .sort((a, b) => parseDataPtBr(a.prazo).getTime() - parseDataPtBr(b.prazo).getTime());

  const projetoIdsAtivos = new Set(projetosAtivos.map((projeto) => projeto.id));

  const candidaturasPendentes = candidaturas.filter(
    (candidatura) =>
      projetoIdsAtivos.has(candidatura.projeto_id) && candidatura.status === "enviada"
  );

  const candidaturasPendentesPorProjeto = candidaturasPendentes.reduce<Record<string, number>>(
    (acumulador, candidatura) => {
      acumulador[candidatura.projeto_id] =
        (acumulador[candidatura.projeto_id] ?? 0) + 1;
      return acumulador;
    },
    {}
  );

  const triagemPendentes = projetosAtivos
    .map((projeto) => ({
      projeto,
      total: candidaturasPendentesPorProjeto[projeto.id] ?? 0,
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 2);

  const contratosEncerradosSemReview = contratos.filter(
    (contrato) =>
      contrato.empresa_id === empresaId &&
      contrato.status === "encerrado" &&
      !contrato.review_empresa_id
  );

  const contratosEmExecucao = contratos
    .filter(
      (contrato) => contrato.empresa_id === empresaId && contrato.status === "em_execucao"
    )
    .map((contrato) => {
      const fornecedor = fornecedores.find((item) => item.id === contrato.fornecedor_id);
      const projeto = projetos.find((item) => item.id === contrato.projeto_id);
      return { contrato, fornecedor, projeto };
    });

  const conversaIdsDaEmpresa = new Set(
    conversas
      .filter((conversa) =>
        conversa.empresa_membros_ids.some((membroId) => membrosEmpresaIds.has(membroId))
      )
      .map((conversa) => conversa.id)
  );

  const conversasPorId = new Map(conversas.map((conversa) => [conversa.id, conversa]));

  const mensagensNaoLidas = mensagens
    .filter(
      (mensagem) =>
        conversaIdsDaEmpresa.has(mensagem.conversa_id) &&
        !membrosEmpresaIds.has(mensagem.autor_membro_id) &&
        !mensagem.lida_em
    )
    .sort(
      (a, b) => parseDataIso(b.enviada_em).getTime() - parseDataIso(a.enviada_em).getTime()
    );

  const resumoMensagens = mensagensNaoLidas.slice(0, 2).map((mensagem) => {
    const conversa = conversasPorId.get(mensagem.conversa_id);
    const candidatura = candidaturas.find((item) => item.id === conversa?.candidatura_id);
    const fornecedor = fornecedores.find(
      (item) => item.id === candidatura?.fornecedor_id
    );
    return {
      id: mensagem.id,
      fornecedorNome: fornecedor?.nome ?? "Fornecedor",
      conteudo: mensagem.conteudo,
    };
  });

  return (
    <AppShell tipo="empresa" titulo="Dashboard">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xl font-semibold">
            Olá, {primeiraPalavra(membroLogado?.nome)}. Aqui está o que precisa da sua atenção.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Triagem pendente</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Importante
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {triagemPendentes.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {candidaturasPendentes.length} candidatura(s) aguardando decisão.
                  </p>
                  <ul className="space-y-2">
                    {triagemPendentes.map(({ projeto, total }) => (
                      <li key={projeto.id} className="flex items-center justify-between text-sm">
                        <span>{projeto.titulo}</span>
                        <span className="text-muted-foreground">{total} candidatura(s)</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma candidatura aguardando. Bom trabalho.
                </p>
              )}
              <Button asChild size="sm" className="mt-1">
                <Link href="/empresa/candidaturas">Ir para triagem</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Reviews pendentes</CardTitle>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Crítica
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {contratosEncerradosSemReview.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {contratosEncerradosSemReview.length} contrato(s) encerrado(s) sem avaliação.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Reviews aparecem quando contratos são encerrados.
                </p>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/empresa/reviews">Avaliar agora</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold">Projetos ativos</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Atenção
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projetosAtivos.length > 0 ? (
              projetosAtivos.slice(0, 3).map((projeto) => {
                const diasRestantes = diasAtePrazo(projeto.prazo);
                return (
                  <div key={projeto.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{projeto.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {candidaturasPendentesPorProjeto[projeto.id] ?? 0} candidatura(s) pendente(s)
                        </p>
                      </div>
                      <Badge variant="secondary" className={statusColors[projeto.status]}>
                        {statusLabels[projeto.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {diasRestantes >= 0
                        ? `${diasRestantes} dia(s) para o prazo final`
                        : "Prazo de resposta encerrado"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Bem-vindo. Comece publicando seu primeiro projeto.
              </p>
            )}
            <Button asChild size="sm" variant="outline">
              <Link href="/empresa/novo-projeto">Publicar novo projeto</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2 rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">Contratos em execução</CardTitle>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Informativa
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {contratosEmExecucao.length > 0 ? (
                contratosEmExecucao.map(({ contrato, fornecedor, projeto }) => (
                  <div key={contrato.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{projeto?.titulo ?? "Contrato em execução"}</p>
                    <p className="text-xs text-muted-foreground">
                      {fornecedor?.nome ?? "Fornecedor"} — Início {contrato.data_inicio ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Fim previsto {contrato.data_fim_estimada ?? contrato.data_fim_real ?? "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Quando uma proposta vencedora for aceita, o contrato aparece aqui.
                </p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/empresa/contratos/em-execucao">Abrir contratos</Link>
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
                  <p className="text-sm text-muted-foreground">
                    {mensagensNaoLidas.length} não lida(s).
                  </p>
                  {resumoMensagens.map((mensagem) => (
                    <div key={mensagem.id} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-medium">{mensagem.fornecedorNome}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {mensagem.conteudo}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Mensagens com fornecedores aparecem após a seleção para proposta.
                </p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href="/empresa/mensagens">Abrir</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
