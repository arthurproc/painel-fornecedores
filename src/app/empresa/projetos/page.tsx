import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clock,
  FileText,
  Inbox,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  candidaturasCountByProjeto,
  getEmpresaByOrganizacao,
  getMembroById,
  projetos,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";

export default function EmpresaProjetosPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresaAtiva = getEmpresaByOrganizacao(membroLogado?.organizacao_id ?? "");

  if (!empresaAtiva) {
    return (
      <AppShell tipo="empresa" titulo="Meus projetos">
        <Card className="mx-auto max-w-xl rounded-xl">
          <CardContent className="space-y-3 p-6 text-sm">
            <p className="font-medium">
              Sua organização ainda não tem perfil de empresa ativo.
            </p>
            <p className="text-muted-foreground">
              Ative o perfil em Configurações para publicar e acompanhar projetos.
            </p>
            <Button asChild variant="outline">
              <Link href="/configuracoes">Ir para Configurações</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const meusProjetos = projetos.filter((p) => p.empresa_id === empresaAtiva.id);

  const publicados = meusProjetos.filter((p) => p.status === "publicado").length;
  const emTriagem = meusProjetos.filter((p) => p.status === "em_triagem").length;
  const emPropostas = meusProjetos.filter((p) => p.status === "em_propostas").length;
  const fechados = meusProjetos.filter((p) => p.status === "fechado").length;
  const rascunhos = meusProjetos.filter((p) => p.status === "rascunho").length;

  const totalCandidaturas = meusProjetos.reduce(
    (acc, p) => acc + candidaturasCountByProjeto(p.id),
    0
  );

  const statsCards = [
    {
      titulo: "Total de projetos",
      valor: String(meusProjetos.length),
      descricao: "Carteira de " + empresaAtiva.nome,
      icon: Briefcase,
    },
    {
      titulo: "Publicados",
      valor: String(publicados),
      descricao: "Recebendo candidaturas",
      icon: Clock,
    },
    {
      titulo: "Em triagem",
      valor: String(emTriagem),
      descricao: "Avaliando candidaturas",
      icon: TrendingUp,
    },
    {
      titulo: "Candidaturas",
      valor: String(totalCandidaturas),
      descricao: "Fornecedores interessados",
      icon: Users,
    },
  ];

  return (
    <AppShell tipo="empresa" titulo="Meus projetos">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.titulo}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.titulo}</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.valor}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lista de projetos</h2>
              <Link href="/empresa/novo-projeto">
                <Button size="sm" className="gap-1">
                  Novo projeto <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {meusProjetos.length === 0 ? (
              <Card className="rounded-xl">
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">Nenhum projeto publicado ainda</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Publique seu primeiro projeto para começar a receber candidaturas
                    de fornecedores da região.
                  </p>
                  <Button asChild>
                    <Link href="/empresa/novo-projeto">Publicar primeiro projeto</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {meusProjetos.map((projeto) => (
                  <Link
                    key={projeto.id}
                    href={`/empresa/projeto/${projeto.id}`}
                    className="block"
                  >
                    <Card className="cursor-pointer transition-shadow hover:shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="text-sm font-medium">
                                {projeto.titulo}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={statusColors[projeto.status]}
                              >
                                {statusLabels[projeto.status]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {projeto.categoria} · {projeto.cidade} · {projeto.orcamento}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Publicado em {projeto.dataPublicacao} · Prazo {projeto.prazo}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {candidaturasCountByProjeto(projeto.id)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Resumo por status</h2>
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rascunhos</span>
                  <span className="text-sm font-semibold">{rascunhos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Publicados</span>
                  <span className="text-sm font-semibold">{publicados}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Em triagem</span>
                  <span className="text-sm font-semibold">{emTriagem}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Em propostas</span>
                  <span className="text-sm font-semibold">{emPropostas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fechados</span>
                  <span className="text-sm font-semibold">{fechados}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  Acompanhe propostas formais na tela{" "}
                  <Link
                    href="/empresa/candidaturas"
                    className="font-medium text-foreground hover:underline"
                  >
                    Candidaturas
                  </Link>
                  .
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
