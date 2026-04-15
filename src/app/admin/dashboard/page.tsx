import Link from "next/link";
import {
  Building2,
  Users,
  FileText,
  Archive,
  TrendingUp,
  ArrowRight,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  projetos,
  fornecedores,
  empresas,
  candidaturas,
  contratos,
  statusLabels,
  statusColors,
  nomeEmpresa,
  logoEmpresa,
} from "@/lib/mock-data";

function parseData(d: string) {
  const [day, month, year] = d.split("/");
  return new Date(+year, +month - 1, +day).getTime();
}

export default function AdminDashboard() {
  const demandasAtivas = projetos.filter(
    (p) =>
      p.status === "publicado" ||
      p.status === "em_triagem" ||
      p.status === "em_propostas"
  );
  const contratosEncerrados = contratos.filter((c) => c.status === "encerrado");

  const volumeTotal = contratosEncerrados.reduce((acc, c) => {
    const raw = c.valor_final
      .replace("R$ ", "")
      .replace(/\./g, "")
      .replace(",", ".");
    return acc + parseFloat(raw);
  }, 0);

  const volumeFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(volumeTotal);

  const statsCards = [
    {
      titulo: "Organizações",
      valor: String(empresas.length + fornecedores.length),
      detalhe: `${empresas.length} empresas · ${fornecedores.length} fornecedores`,
      icon: Building2,
    },
    {
      titulo: "Demandas Ativas",
      valor: String(demandasAtivas.length),
      detalhe: `${candidaturas.filter((c) => c.status === "enviada").length} candidaturas em aberto`,
      icon: FileText,
    },
    {
      titulo: "Contratos Encerrados",
      valor: String(contratosEncerrados.length),
      detalhe: "desde o início da plataforma",
      icon: Archive,
    },
    {
      titulo: "Volume Transacionado",
      valor: volumeFormatado,
      detalhe: "valor total dos contratos",
      icon: TrendingUp,
    },
  ];

  const projetosRecentes = projetos
    .slice()
    .sort((a, b) => parseData(b.dataPublicacao) - parseData(a.dataPublicacao))
    .slice(0, 5);

  return (
    <AppShell tipo="admin" titulo="Dashboard">
      <div className="space-y-6">
        {/* KPIs */}
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
                <p className="text-xs text-muted-foreground mt-1">{stat.detalhe}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Demandas recentes */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Demandas Recentes</h2>
              <Link href="/admin/organizacoes">
                <Button size="sm" variant="outline" className="gap-1">
                  Ver organizações <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {projetosRecentes.map((projeto) => (
                <Card key={projeto.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {logoEmpresa(projeto)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{projeto.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {nomeEmpresa(projeto)} · {projeto.categoria} · {projeto.regiao}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="secondary"
                          className={statusColors[projeto.status]}
                        >
                          {statusLabels[projeto.status]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {projeto.dataPublicacao}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fornecedores ativos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Fornecedores</h2>
              <Link href="/admin/organizacoes">
                <Button size="sm" variant="ghost" className="gap-1 text-xs">
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {fornecedores.map((f) => (
                <Card key={f.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {f.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{f.nome}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {f.categorias[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">
                          {f.reputacao_agregada.total_reviews > 0
                            ? f.reputacao_agregada.media_geral.toFixed(1)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/admin/usuarios">
                <Button variant="outline" className="w-full gap-1" size="sm">
                  <Users className="w-4 h-4" /> Gerenciar usuários
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
