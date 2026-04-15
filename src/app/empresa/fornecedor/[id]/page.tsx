"use client";

import { use } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { fornecedores, projetos, empresas } from "@/lib/mock-data";

function formatarMesAno(data: string): string {
  const [, mes, ano] = data.split("/");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${meses[parseInt(mes) - 1]} ${ano}`;
}

const projetosPorFornecedor: Record<
  string,
  { titulo: string; empresa: string; valor: string; data: string }[]
> = {
  "1": [
    { titulo: "Manutenção de Britadores — Mina de Cauê", empresa: "Vale S.A.", valor: "R$ 450.000", data: "2025" },
    { titulo: "Revisão Elétrica de Subestação", empresa: "Usiminas", valor: "R$ 180.000", data: "2025" },
    { titulo: "Instalação de Sensores de Vibração", empresa: "ArcelorMittal", valor: "R$ 95.000", data: "2024" },
    { titulo: "Manutenção Preventiva Anual — Planta Itabira", empresa: "Vale S.A.", valor: "R$ 620.000", data: "2024" },
  ],
  "2": [
    { titulo: "Licenciamento Ambiental — Expansão da Mina", empresa: "Vale S.A.", valor: "R$ 310.000", data: "2025" },
    { titulo: "Monitoramento de Efluentes Industriais", empresa: "ArcelorMittal", valor: "R$ 140.000", data: "2024" },
    { titulo: "Recuperação de Área Degradada — Setor Norte", empresa: "Vale S.A.", valor: "R$ 520.000", data: "2024" },
  ],
  "3": [
    { titulo: "Transporte de Minério — Rota Itabira/BH", empresa: "Vale S.A.", valor: "R$ 1.200.000", data: "2025" },
    { titulo: "Logística de Insumos — Contrato Anual", empresa: "Usiminas", valor: "R$ 860.000", data: "2025" },
    { titulo: "Transporte Especializado de Equipamentos", empresa: "ArcelorMittal", valor: "R$ 220.000", data: "2024" },
  ],
  "4": [
    { titulo: "Ampliação do Galpão Industrial", empresa: "Usiminas", valor: "R$ 780.000", data: "2025" },
    { titulo: "Reforma do Refeitório — Planta João Monlevade", empresa: "ArcelorMittal", valor: "R$ 245.000", data: "2024" },
    { titulo: "Construção de Guarita e Portaria", empresa: "Vale S.A.", valor: "R$ 95.000", data: "2024" },
  ],
  "5": [
    { titulo: "Implantação do PPRA/PCMSO", empresa: "Vale S.A.", valor: "R$ 130.000", data: "2026" },
    { titulo: "Auditoria de Conformidade NR — Planta Ipatinga", empresa: "ArcelorMittal", valor: "R$ 85.000", data: "2025" },
    { titulo: "Treinamentos NR-10, NR-35 e NR-22", empresa: "Usiminas", valor: "R$ 62.000", data: "2025" },
    { titulo: "Revisão do PGR — Complexo Minerador", empresa: "Vale S.A.", valor: "R$ 110.000", data: "2024" },
  ],
};

const taxaSucessoPorFornecedor: Record<string, number> = {
  "1": 92, "2": 89, "3": 95, "4": 87, "5": 98,
};

export default function PerfilFornecedorEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fornecedor = fornecedores.find((f) => f.id === id) ?? fornecedores[0];
  const projetosHistorico = projetosPorFornecedor[fornecedor.id] ?? [];

  const reviews: Array<{
    empresa: string;
    logo: string;
    qualidade: number;
    prazo: number;
    comentario: string;
    data: string;
  }> = [];
  void formatarMesAno;
  void projetos;
  void empresas;

  const avgQualidade =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.qualidade, 0) / reviews.length
      : 0;
  const avgPrazo =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.prazo, 0) / reviews.length
      : 0;
  const satisfacao = Math.round((avgQualidade / 5) * 100);
  const entregaNoPrazo = Math.round((avgPrazo / 5) * 100);
  const taxaSucesso = taxaSucessoPorFornecedor[fornecedor.id] ?? 90;

  return (
    <AppShell tipo="empresa" titulo="Perfil do Fornecedor">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/empresa/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>

        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                {fornecedor.logo}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {fornecedor.reputacao_agregada.total_reviews > 0
                      ? `${fornecedor.reputacao_agregada.media_geral.toFixed(1)} (${fornecedor.reputacao_agregada.total_reviews} avaliações)`
                      : "Sem avaliações ainda"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {fornecedor.regiao}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Desde {fornecedor.desde}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {fornecedor.descricao}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4">
              <a
                href={`mailto:${fornecedor.contato.email}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" />
                {fornecedor.contato.email}
              </a>
              <a
                href={`tel:${fornecedor.contato.telefone}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                {fornecedor.contato.telefone}
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                {fornecedor.projetosRealizados} projetos realizados
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Areas de atuacao */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Áreas de Atuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fornecedor.categorias.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-sm">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projetos realizados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Projetos Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projetosHistorico.map((proj) => (
                    <div
                      key={proj.titulo}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="font-medium text-sm">{proj.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {proj.empresa} &bull; {proj.data}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {proj.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avaliações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma avaliação registrada ainda.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {reviews.map((av, idx) => (
                      <div key={idx}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                            {av.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="font-medium text-sm">{av.empresa}</p>
                              <p className="text-xs text-muted-foreground">{av.data}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  Qualidade do serviço
                                </span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < av.qualidade
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  Cumprimento de prazo
                                </span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < av.prazo
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 ml-11">
                          {av.comentario}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificacoes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4" /> Certificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fornecedor.certificacoes.map((cert) => (
                    <div key={cert} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      {cert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatisticas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Taxa de Sucesso</span>
                    <span className="font-medium">{taxaSucesso}%</span>
                  </div>
                  <Progress value={taxaSucesso} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Entrega no Prazo</span>
                    <span className="font-medium">{entregaNoPrazo}%</span>
                  </div>
                  <Progress value={entregaNoPrazo} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Satisfação do Cliente</span>
                    <span className="font-medium">{satisfacao}%</span>
                  </div>
                  <Progress value={satisfacao} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
