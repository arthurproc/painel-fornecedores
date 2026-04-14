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
import { fornecedores, projetos } from "@/lib/mock-data";

function formatarMesAno(data: string): string {
  const [, mes, ano] = data.split("/");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${meses[parseInt(mes) - 1]} ${ano}`;
}

const projetosRealizados = [
  {
    titulo: "Manutenção de Britadores — Mina de Cauê",
    empresa: "Vale S.A.",
    valor: "R$ 450.000",
    data: "2025",
  },
  {
    titulo: "Revisão Elétrica de Subestação",
    empresa: "Usiminas",
    valor: "R$ 180.000",
    data: "2025",
  },
  {
    titulo: "Instalação de Sensores de Vibração",
    empresa: "ArcelorMittal",
    valor: "R$ 95.000",
    data: "2024",
  },
  {
    titulo: "Manutenção Preventiva Anual — Planta Itabira",
    empresa: "Vale S.A.",
    valor: "R$ 620.000",
    data: "2024",
  },
];

export default function PerfilFornecedorPage() {
  const fornecedor = fornecedores[0]; // TechMinas

  const reviews = projetos
    .filter((p) => p.fechamento?.fornecedorId === fornecedor.id)
    .map((p) => ({
      empresa: p.empresa,
      logo: p.empresaLogo,
      qualidade: p.fechamento!.avaliacao.qualidade,
      prazo: p.fechamento!.avaliacao.prazo,
      comentario: p.fechamento!.avaliacao.comentario,
      data: formatarMesAno(p.fechamento!.dataFechamento),
    }));

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

  return (
    <AppShell tipo="fornecedor" titulo="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho do perfil */}
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
                      avaliações)
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
            {/* Áreas de Atuação */}
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

            {/* Projetos Realizados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Projetos Realizados</CardTitle>
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

          {/* Coluna lateral */}
          <div className="space-y-6">
            {/* Certificações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4" /> Certificações
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

            {/* Estatísticas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Taxa de Sucesso</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Entrega no Prazo
                    </span>
                    <span className="font-medium">{entregaNoPrazo}%</span>
                  </div>
                  <Progress value={entregaNoPrazo} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Satisfação do Cliente
                    </span>
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
