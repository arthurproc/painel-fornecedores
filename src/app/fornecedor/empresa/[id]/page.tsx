import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Building2,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  empresas,
  projetos,
  fornecedores,
  statusLabels,
  statusColors,
} from "@/lib/mock-data";

export default function PerfilEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const empresa = empresas.find((e) => e.id === id) ?? empresas[0];

  const demandasAbertas = projetos.filter(
    (p) => p.empresa === empresa.nome && p.status !== "arquivado"
  );

  const contratosFechados = projetos.filter(
    (p) =>
      p.empresa === empresa.nome &&
      p.status === "arquivado" &&
      p.fechamento &&
      p.fechamento.visibilidade !== "privado"
  );

  return (
    <AppShell tipo="fornecedor" titulo="Perfil da Empresa">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/fornecedor/projetos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos Projetos
        </Link>

        {/* Cabeçalho */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                {empresa.logo}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{empresa.nome}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {empresa.setor}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {empresa.regiao}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Desde {empresa.desde}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {empresa.descricao}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {demandasAbertas.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Demandas abertas
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {contratosFechados.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Contratos na plataforma
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {new Set(contratosFechados.map((p) => p.fechamento!.fornecedorId)).size}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fornecedores contratados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demandas Abertas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Demandas Abertas</h2>
            <Badge variant="secondary" className="text-xs">
              {demandasAbertas.length}
            </Badge>
          </div>

          {demandasAbertas.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma demanda aberta no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {demandasAbertas.map((projeto) => (
                <Link
                  key={projeto.id}
                  href={`/fornecedor/projeto/${projeto.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
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

                      <h3 className="font-semibold text-sm mb-2 leading-snug">
                        {projeto.titulo}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {projeto.descricao}
                      </p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{projeto.orcamento}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Prazo: {projeto.prazo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{projeto.regiao}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span>{projeto.interessados} interessados</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          {projeto.categoria}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contratos Fechados */}
        {contratosFechados.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Contratos Fechados</h2>
              <Badge variant="secondary" className="text-xs">
                {contratosFechados.length}
              </Badge>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {contratosFechados.map((projeto) => {
                    const f = projeto.fechamento!;
                    const fornecedor = fornecedores.find(
                      (fn) => fn.id === f.fornecedorId
                    );
                    return (
                      <div
                        key={projeto.id}
                        className="flex items-center gap-4 px-5 py-4"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {projeto.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {fornecedor?.nome ?? "—"} · {projeto.categoria}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm ${f.valorFinal ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                            {f.valorFinal ?? "Valor não informado"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {f.dataFechamento}
                          </p>
                        </div>
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
