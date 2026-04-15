import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Eye,
  CheckCircle2,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  projetos,
  candidaturas,
  statusLabels,
  statusColors,
  nomeEmpresa,
  logoEmpresa,
  candidaturaView,
} from "@/lib/mock-data";

const statsCards = [
  {
    titulo: "Propostas Enviadas",
    valor: "12",
    variacao: "+3 esta semana",
    icon: Send,
  },
  {
    titulo: "Propostas Aceitas",
    valor: "8",
    variacao: "67% taxa de sucesso",
    icon: CheckCircle2,
  },
  {
    titulo: "Avaliacao Media",
    valor: "4.8",
    variacao: "Baseado em 47 avaliacoes",
    icon: Star,
  },
  {
    titulo: "Projetos em Andamento",
    valor: "3",
    variacao: "Prazo medio: 45 dias",
    icon: Clock,
  },
];

const projetosRecomendados = projetos
  .filter((p) => p.status === "publicado")
  .slice(0, 3);

const minhasCandidaturas = candidaturas
  .filter((c) => c.fornecedor_id === "1")
  .slice(0, 3)
  .map(candidaturaView);

export default function FornecedorDashboard() {
  return (
    <AppShell tipo="fornecedor" titulo="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
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
                <p className="text-xs text-emerald-600 mt-1">
                  {stat.variacao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Completeness */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Perfil Completo</h3>
                <p className="text-sm text-muted-foreground">
                  Complete seu perfil para aumentar sua visibilidade
                </p>
              </div>
              <span className="text-2xl font-bold text-primary">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                Dados basicos
              </Badge>
              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                Certificacoes
              </Badge>
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                Portfolio pendente
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Projetos Recomendados */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Projetos Recomendados para Voce
              </h2>
              <Link href="/fornecedor/projetos">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver Todos <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {projetosRecomendados.map((projeto) => (
                <Link
                  key={projeto.id}
                  href={`/fornecedor/projeto/${projeto.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-bold">
                              {logoEmpresa(projeto)}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                {projeto.titulo}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {nomeEmpresa(projeto)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {projeto.descricao}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {projeto.categoria}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {projeto.regiao}
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {projeto.orcamento}
                            </span>
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Minhas Candidaturas */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Minhas Candidaturas</h2>
            <div className="space-y-3">
              {minhasCandidaturas.map(({ candidatura, projeto }) => (
                <Card key={candidatura.id}>
                  <CardContent className="p-4">
                    <p className="font-medium text-sm line-clamp-1 mb-1">
                      {projeto?.titulo ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {projeto ? nomeEmpresa(projeto) : "—"} &bull; Enviada em{" "}
                      {candidatura.enviada_em ?? "—"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {candidatura.faixa_preco_preliminar ?? "Sem faixa informada"}
                      </span>
                      <Badge
                        variant="secondary"
                        className={statusColors[candidatura.status]}
                      >
                        {statusLabels[candidatura.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
