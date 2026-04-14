import {
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  Edit,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { fornecedores } from "@/lib/mock-data";

const avaliacoes = [
  {
    empresa: "Vale S.A.",
    logo: "V",
    nota: 5,
    comentario:
      "Excelente trabalho na manutencao das correias. Equipe muito profissional e dentro do prazo.",
    data: "Mar 2026",
  },
  {
    empresa: "Usiminas",
    logo: "U",
    nota: 5,
    comentario:
      "Servico impecavel. Recomendo para qualquer trabalho de manutencao industrial.",
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
];

const projetosRealizados = [
  {
    titulo: "Manutencao de Britadores - Mina de Cauê",
    empresa: "Vale S.A.",
    valor: "R$ 450.000",
    data: "2025",
  },
  {
    titulo: "Revisao Eletrica de Subestacao",
    empresa: "Usiminas",
    valor: "R$ 180.000",
    data: "2025",
  },
  {
    titulo: "Instalacao de Sensores de Vibracao",
    empresa: "ArcelorMittal",
    valor: "R$ 95.000",
    data: "2024",
  },
  {
    titulo: "Manutencao Preventiva Anual - Planta Itabira",
    empresa: "Vale S.A.",
    valor: "R$ 620.000",
    data: "2024",
  },
];

export default function PerfilFornecedorPage() {
  const fornecedor = fornecedores[0]; // TechMinas

  return (
    <AppShell tipo="fornecedor" titulo="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {fornecedor.logo}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {fornecedor.avaliacao} ({fornecedor.projetosRealizados}{" "}
                      avaliacoes)
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
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="w-3.5 h-3.5" /> Editar Perfil
              </Button>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {fornecedor.descricao}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {fornecedor.contato.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {fornecedor.contato.telefone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                {fornecedor.projetosRealizados} projetos realizados
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Categorias */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Areas de Atuacao</CardTitle>
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

            {/* Projetos Realizados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Projetos Realizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projetosRealizados.map((proj) => (
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
                <CardTitle className="text-base">Avaliacoes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {avaliacoes.map((av) => (
                    <div key={av.data}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                          {av.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{av.empresa}</p>
                            <p className="text-xs text-muted-foreground">
                              {av.data}
                            </p>
                          </div>
                          <div className="flex gap-0.5">
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
                  <Award className="w-4 h-4" /> Certificacoes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fornecedor.certificacoes.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {cert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estatisticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Taxa de Sucesso
                    </span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Entrega no Prazo
                    </span>
                    <span className="font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Satisfacao do Cliente
                    </span>
                    <span className="font-medium">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
