import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Eye, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  projetos,
  statusColors,
  statusLabels,
  candidaturasCountByProjeto,
} from "@/lib/mock-data";

const empresaId = "vale";

export default function EmpresaProjetosPage() {
  const meusProjetos = projetos.filter((projeto) => projeto.empresa_id === empresaId);

  const totalInteressados = meusProjetos.reduce(
    (acc, projeto) => acc + candidaturasCountByProjeto(projeto.id),
    0
  );

  const publicados = meusProjetos.filter((projeto) => projeto.status === "publicado").length;
  const emTriagem = meusProjetos.filter((projeto) => projeto.status === "em_triagem").length;
  const emPropostas = meusProjetos.filter(
    (projeto) => projeto.status === "em_propostas"
  ).length;
  const fechados = meusProjetos.filter(
    (projeto) => projeto.status === "fechado"
  ).length;

  const statsCards = [
    {
      titulo: "Total de Projetos",
      valor: String(meusProjetos.length),
      descricao: "Visão geral da carteira",
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
      valor: String(totalInteressados),
      descricao: "Total de fornecedores",
      icon: Users,
    },
  ];

  return (
    <AppShell tipo="empresa" titulo="Meus Projetos">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.titulo}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.titulo}</p>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.valor}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lista de Projetos</h2>
              <Link href="/empresa/novo-projeto">
                <Button size="sm" className="gap-1">
                  Novo Projeto <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {meusProjetos.map((projeto) => (
                <Link
                  key={projeto.id}
                  href={`/empresa/projeto/${projeto.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{projeto.titulo}</h3>
                            <Badge variant="secondary" className={statusColors[projeto.status]}>
                              {statusLabels[projeto.status]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {projeto.categoria} &bull; {projeto.regiao} &bull; {projeto.orcamento}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Publicado em {projeto.dataPublicacao}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {candidaturasCountByProjeto(projeto.id)}
                          </span>
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Resumo por Status</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
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
          </div>
        </div>
      </div>
    </AppShell>
  );
}
