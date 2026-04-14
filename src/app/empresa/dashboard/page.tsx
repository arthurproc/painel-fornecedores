import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  Archive,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  projetos,
  propostas,
  fornecedores,
  statusLabels,
  statusColors,
} from "@/lib/mock-data";

const visibilidadeLabels: Record<string, string> = {
  publico: "Público",
  fornecedores: "Apenas fornecedores",
  privado: "Privado",
};

const visibilidadeColors: Record<string, string> = {
  publico: "bg-emerald-100 text-emerald-800",
  fornecedores: "bg-blue-100 text-blue-800",
  privado: "bg-gray-100 text-gray-800",
};

const statsCards = [
  {
    titulo: "Projetos Ativos",
    valor: "4",
    variacao: "+2 este mes",
    icon: Briefcase,
  },
  {
    titulo: "Propostas Recebidas",
    valor: "24",
    variacao: "+8 esta semana",
    icon: Users,
  },
  {
    titulo: "Taxa de Resposta",
    valor: "92%",
    variacao: "+5% vs mes anterior",
    icon: TrendingUp,
  },
  {
    titulo: "Tempo Medio de Contratacao",
    valor: "12 dias",
    variacao: "-3 dias vs media",
    icon: Clock,
  },
];

export default function EmpresaDashboard() {
  const meusProjetos = projetos.filter(
    (p) => ["Vale S.A."].includes(p.empresa) && p.status !== "arquivado"
  );
  const projetosFechados = projetos.filter(
    (p) => ["Vale S.A."].includes(p.empresa) && p.status === "arquivado"
  );
  const propostasRecentes = propostas.filter((p) => p.status === "pendente").slice(0, 3);

  return (
    <AppShell tipo="empresa" titulo="Dashboard">
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

        <div className="grid grid-cols-3 gap-6">
          {/* Meus Projetos */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Meus Projetos</h2>
              <Link href="/empresa/novo-projeto">
                <Button size="sm" className="gap-1">
                  Novo Projeto <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {meusProjetos.map((projeto) => (
                <Link key={projeto.id} href={`/empresa/projeto/${projeto.id}`}>
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">
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
                            {projeto.categoria} &bull; {projeto.regiao} &bull;{" "}
                            {projeto.orcamento}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {projeto.interessados}
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

          {/* Propostas Recentes */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Propostas Recentes</h2>
            <div className="space-y-3">
              {propostasRecentes.map((proposta) => (
                <Card key={proposta.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {proposta.fornecedor.logo}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {proposta.fornecedor.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {proposta.dataEnvio}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {proposta.projeto.titulo}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        {proposta.valor}
                      </span>
                      <Badge variant="secondary" className={statusColors[proposta.status]}>
                        {statusLabels[proposta.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contratos Fechados */}
        {projetosFechados.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Contratos Fechados</h2>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 text-xs"
              >
                {projetosFechados.length}
              </Badge>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {projetosFechados.map((projeto) => {
                    const f = projeto.fechamento!;
                    const fornecedor = fornecedores.find(
                      (fn) => fn.id === f.fornecedorId
                    );
                    return (
                      <div
                        key={projeto.id}
                        className="flex items-center gap-4 px-5 py-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {projeto.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fornecedor?.nome ?? "—"} · {projeto.categoria}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-primary">
                            {f.valorFinal}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {f.dataFechamento}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={visibilidadeColors[f.visibilidade]}
                        >
                          {visibilidadeLabels[f.visibilidade]}
                        </Badge>
                        <Link href={`/empresa/projeto/${projeto.id}`}>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Eye className="w-3.5 h-3.5" /> Ver
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
