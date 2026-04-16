"use client";

import Link from "next/link";
import {
  Award,
  Briefcase,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MEMBRO_LOGADO_ID,
  getContratosByFornecedor,
  getFornecedorCredenciaisNomes,
  getFornecedorByOrganizacao,
  getMembroById,
  countCredenciaisSemComprovante,
  countDocumentosVigentes,
} from "@/lib/mock-data";

export default function PerfilFornecedorPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(
    membroLogado?.organizacao_id ?? ""
  );

  if (!fornecedor) {
    return (
      <AppShell tipo="fornecedor" titulo="Meu perfil">
        <Card className="mx-auto max-w-xl rounded-xl">
          <CardContent className="space-y-3 p-6 text-sm">
            <p className="font-medium">
              Sua organização ainda não tem perfil de fornecedor ativo.
            </p>
            <p className="text-muted-foreground">
              Ative o perfil em Configurações para começar a receber convites e se
              candidatar a projetos.
            </p>
            <Button asChild variant="outline">
              <Link href="/configuracoes">Ir para Configurações</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const contratosEncerrados = getContratosByFornecedor(fornecedor.id).filter(
    (c) => c.status === "encerrado"
  );

  const { reputacao_agregada: rep } = fornecedor;
  const mediaGeral = rep.total_reviews > 0 ? rep.media_geral : 0;
  const notaPctGeral = Math.round((mediaGeral / 5) * 100);
  const credenciais = getFornecedorCredenciaisNomes(fornecedor);

  return (
    <AppShell tipo="fornecedor" titulo="Meu perfil">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {fornecedor.logo}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {rep.total_reviews > 0
                        ? `${mediaGeral.toFixed(1)} (${rep.total_reviews} avaliações)`
                        : "Sem avaliações ainda"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {fornecedor.cidade} · {fornecedor.regiao}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Desde {fornecedor.desde}
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/configuracoes">
                  <Edit className="h-3.5 w-3.5" /> Gerenciar em Configurações
                </Link>
              </Button>
            </div>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              {fornecedor.descricao}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {fornecedor.contato.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {fornecedor.contato.telefone}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {contratosEncerrados.length} contratos encerrados
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Áreas de atuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fornecedor.categorias.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-sm">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Regiões atendidas: {fornecedor.regioes_atendidas.join(" · ")}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contratos encerrados</CardTitle>
              </CardHeader>
              <CardContent>
                {contratosEncerrados.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum contrato encerrado ainda. Assim que fecharem contratos,
                    eles aparecerão aqui para compor o portfólio público.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contratosEncerrados.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            Contrato #{c.id} · projeto {c.projeto_id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Fechado em {c.data_fechamento}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {c.valor_final}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avaliações recebidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A listagem detalhada de avaliações será exibida na Fase 5 (perfis
                  públicos). Por enquanto a reputação agregada aparece ao lado.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-4 w-4" /> Credenciais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {credenciais.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma credencial cadastrada.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {credenciais.map((credencial) => (
                        <div key={credencial} className="flex items-center gap-2 text-sm">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          {credencial}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cobertura documental</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{fornecedor.credenciais_ids.length} credenciais cadastradas</p>
                <p>{countDocumentosVigentes(fornecedor)} comprovantes vigentes</p>
                <p>{countCredenciaisSemComprovante(fornecedor)} credenciais sem comprovante</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reputação agregada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rep.total_reviews === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem avaliações suficientes para calcular.
                  </p>
                ) : (
                  <>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Média geral</span>
                        <span className="font-medium">
                          {mediaGeral.toFixed(1)} / 5
                        </span>
                      </div>
                      <Progress value={notaPctGeral} className="h-2" />
                    </div>
                    {Object.entries(rep.por_dimensao).map(([dim, info]) => (
                      <div key={dim}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {dim.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium">
                            {info.media.toFixed(1)} / 5
                          </span>
                        </div>
                        <Progress
                          value={Math.round((info.media / 5) * 100)}
                          className="h-2"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Calculado com {rep.total_reviews} avaliação
                       {rep.total_reviews === 1 ? "" : "s"} liberada
                       {rep.total_reviews === 1 ? "" : "s"}.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
