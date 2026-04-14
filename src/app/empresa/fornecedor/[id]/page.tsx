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
import { fornecedores } from "@/lib/mock-data";

const avaliacoesPorFornecedor: Record<
  string,
  { empresa: string; logo: string; nota: number; comentario: string; data: string }[]
> = {
  "1": [
    {
      empresa: "Vale S.A.",
      logo: "V",
      nota: 5,
      comentario:
        "Excelente trabalho na manutenção das correias. Equipe muito profissional e dentro do prazo.",
      data: "Mar 2026",
    },
    {
      empresa: "Usiminas",
      logo: "U",
      nota: 5,
      comentario:
        "Serviço impecável. Recomendo para qualquer trabalho de manutenção industrial.",
      data: "Fev 2026",
    },
    {
      empresa: "ArcelorMittal",
      logo: "A",
      nota: 4,
      comentario:
        "Bom trabalho, cumpriu com os requisitos do contrato. Prazo ligeiramente ultrapassado.",
      data: "Jan 2026",
    },
  ],
  "2": [
    {
      empresa: "Vale S.A.",
      logo: "V",
      nota: 5,
      comentario:
        "Monitoramento ambiental implantado com precisão e dentro do cronograma. Equipe técnica de alto nível.",
      data: "Mar 2026",
    },
    {
      empresa: "ArcelorMittal",
      logo: "A",
      nota: 4,
      comentario:
        "Bom serviço de licenciamento, comunicação poderia ser mais ágil.",
      data: "Jan 2026",
    },
  ],
  "3": [
    {
      empresa: "Vale S.A.",
      logo: "V",
      nota: 4,
      comentario:
        "Transporte confiável, frota bem mantida e rastreamento em tempo real funcionou perfeitamente.",
      data: "Fev 2026",
    },
    {
      empresa: "Usiminas",
      logo: "U",
      nota: 5,
      comentario:
        "Parceria excelente. Cumpriram todos os volumes acordados sem intercorrências.",
      data: "Dez 2025",
    },
  ],
  "4": [
    {
      empresa: "Usiminas",
      logo: "U",
      nota: 5,
      comentario:
        "Reforma do refeitório entregue no prazo com acabamento de qualidade. Muito satisfeitos.",
      data: "Mar 2026",
    },
    {
      empresa: "ArcelorMittal",
      logo: "A",
      nota: 4,
      comentario:
        "Trabalho sólido em construção civil industrial. Equipe bem preparada.",
      data: "Nov 2025",
    },
  ],
  "5": [
    {
      empresa: "Vale S.A.",
      logo: "V",
      nota: 5,
      comentario:
        "Consultoria em SST absolutamente completa. Programas de segurança entregues dentro do prazo e com alto rigor técnico.",
      data: "Abr 2026",
    },
    {
      empresa: "ArcelorMittal",
      logo: "A",
      nota: 5,
      comentario:
        "Melhor consultoria de segurança do trabalho com quem já trabalhamos. Recomendo sem reservas.",
      data: "Fev 2026",
    },
    {
      empresa: "Usiminas",
      logo: "U",
      nota: 5,
      comentario:
        "Treinamentos NR ministrados com excelência. Equipe extremamente qualificada.",
      data: "Jan 2026",
    },
  ],
};

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

const estatisticasPorFornecedor: Record<
  string,
  { taxaSucesso: number; entregaNoPrazo: number; satisfacao: number }
> = {
  "1": { taxaSucesso: 92, entregaNoPrazo: 88, satisfacao: 96 },
  "2": { taxaSucesso: 89, entregaNoPrazo: 91, satisfacao: 94 },
  "3": { taxaSucesso: 95, entregaNoPrazo: 93, satisfacao: 91 },
  "4": { taxaSucesso: 87, entregaNoPrazo: 84, satisfacao: 93 },
  "5": { taxaSucesso: 98, entregaNoPrazo: 97, satisfacao: 99 },
};

export default function PerfilFornecedorEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fornecedor = fornecedores.find((f) => f.id === id) ?? fornecedores[0];
  const avaliacoes = avaliacoesPorFornecedor[fornecedor.id] ?? [];
  const projetos = projetosPorFornecedor[fornecedor.id] ?? [];
  const stats = estatisticasPorFornecedor[fornecedor.id] ?? { taxaSucesso: 90, entregaNoPrazo: 88, satisfacao: 92 };

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
                    {fornecedor.avaliacao} ({fornecedor.projetosRealizados} avaliações)
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
                  {projetos.map((proj) => (
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

            {/* Avaliacoes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {avaliacoes.map((av) => (
                    <div key={`${av.empresa}-${av.data}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                          {av.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{av.empresa}</p>
                            <p className="text-xs text-muted-foreground">{av.data}</p>
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < av.nota
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        {av.comentario}
                      </p>
                    </div>
                  ))}
                </div>
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
                    <span className="font-medium">{stats.taxaSucesso}%</span>
                  </div>
                  <Progress value={stats.taxaSucesso} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Entrega no Prazo</span>
                    <span className="font-medium">{stats.entregaNoPrazo}%</span>
                  </div>
                  <Progress value={stats.entregaNoPrazo} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Satisfação do Cliente</span>
                    <span className="font-medium">{stats.satisfacao}%</span>
                  </div>
                  <Progress value={stats.satisfacao} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
