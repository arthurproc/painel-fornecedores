"use client";

import { Building2, CreditCard, EyeOff, Link2, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getEmpresaByOrganizacao,
  getFornecedorByOrganizacao,
  getMembrosByOrg,
} from "@/lib/mock-data";
import { useContextoAtivo, useSessaoMock } from "@/lib/session";

const roleLabel = {
  owner: "Owner",
  admin: "Admin",
  operador: "Operador",
};

export default function ConfiguracoesOrganizacaoPage() {
  const { membroLogado, organizacaoAtiva } = useSessaoMock();
  const contextoAtivo = useContextoAtivo();
  const tipoShell = contextoAtivo === "admin" ? "empresa" : contextoAtivo;
  const membros = getMembrosByOrg(organizacaoAtiva.id);
  const perfilEmpresa = getEmpresaByOrganizacao(organizacaoAtiva.id);
  const perfilFornecedor = getFornecedorByOrganizacao(organizacaoAtiva.id);

  const podeVerAbaEmpresa = organizacaoAtiva.perfil_empresa_ativo && Boolean(perfilEmpresa);
  const podeVerAbaFornecedor =
    organizacaoAtiva.perfil_fornecedor_ativo && Boolean(perfilFornecedor);
  const tabDefault = podeVerAbaEmpresa ? "perfil-empresa" : podeVerAbaFornecedor ? "perfil-fornecedor" : "organizacao";

  return (
    <AppShell tipo={tipoShell} titulo="Configurações da organização">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações da organização</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Informações do tenant e perfis ativos em modo somente leitura.
          </p>
        </div>

        <Tabs defaultValue={tabDefault}>
          <TabsList className="h-auto p-1 flex gap-1">
            <TabsTrigger value="organizacao" className="rounded-lg">Organização</TabsTrigger>
            <TabsTrigger value="membros" className="rounded-lg">Membros</TabsTrigger>
            {podeVerAbaEmpresa ? (
              <TabsTrigger value="perfil-empresa" className="rounded-lg">Perfil Empresa</TabsTrigger>
            ) : null}
            {podeVerAbaFornecedor ? (
              <TabsTrigger value="perfil-fornecedor" className="rounded-lg">Perfil Fornecedor</TabsTrigger>
            ) : null}
            <div title="Disponível após lançamento da camada de faturamento.">
              <TabsTrigger value="faturamento" disabled className="rounded-lg">
                Faturamento
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="organizacao" className="mt-4">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Identidade legal e perfis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Razão social</Label>
                    <Input value={organizacaoAtiva.razao_social} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input value={organizacaoAtiva.cnpj} readOnly className="bg-muted/50 font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Endereço fiscal</Label>
                  <Input value={organizacaoAtiva.endereco_fiscal} readOnly className="bg-muted/50" />
                </div>

                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <p className="text-sm font-semibold">Perfis ativos</p>
                  <div className="flex items-center gap-2">
                    {organizacaoAtiva.perfil_empresa_ativo ? (
                      <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                        <Building2 className="w-3 h-3" /> Empresa
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        <EyeOff className="w-3 h-3" /> Empresa inativa
                      </Badge>
                    )}
                    {organizacaoAtiva.perfil_fornecedor_ativo ? (
                      <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                        <ShieldCheck className="w-3 h-3" /> Fornecedor
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        <EyeOff className="w-3 h-3" /> Fornecedor inativo
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Linkage pública</p>
                    <p className="text-sm text-muted-foreground">
                      Exibe no perfil público que a organização atua nos dois lados.
                    </p>
                  </div>
                  <Button variant={organizacaoAtiva.linkage_publica ? "default" : "outline"} disabled>
                    <Link2 className="w-4 h-4" />
                    {organizacaoAtiva.linkage_publica ? "Ativada" : "Desativada"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membros" className="mt-4">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Membros da organização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {membros.map((membro) => (
                  <div
                    key={membro.id}
                    className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{membro.nome}</p>
                      <p className="text-xs text-muted-foreground">{membro.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        <Users className="w-3 h-3" /> {roleLabel[membro.role]}
                      </Badge>
                      {membro.id === membroLogado.id ? (
                        <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                          Você
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {podeVerAbaEmpresa ? (
            <TabsContent value="perfil-empresa" className="mt-4">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Perfil Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome público</Label>
                      <Input value={perfilEmpresa?.nome ?? ""} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Setor</Label>
                      <Input value={perfilEmpresa?.setor ?? ""} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input value={perfilEmpresa?.descricao ?? ""} readOnly className="bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input value={perfilEmpresa?.cidade ?? ""} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Região</Label>
                      <Input value={perfilEmpresa?.regiao ?? ""} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ) : null}

          {podeVerAbaFornecedor ? (
            <TabsContent value="perfil-fornecedor" className="mt-4">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Perfil Fornecedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome público</Label>
                      <Input value={perfilFornecedor?.nome ?? ""} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input value={perfilFornecedor?.cidade ?? ""} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Categorias atendidas</Label>
                    <Input value={perfilFornecedor?.categorias.join(" · ") ?? ""} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Regiões atendidas</Label>
                    <Input
                      value={perfilFornecedor?.regioes_atendidas.join(" · ") ?? ""}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificações</Label>
                    <Input value={perfilFornecedor?.certificacoes.join(" · ") ?? ""} readOnly className="bg-muted/50" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ) : null}

          <TabsContent value="faturamento" className="mt-4">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Esta aba será habilitada após o lançamento da camada de Consultoria.
                  </p>
                  <Badge variant="secondary" className="rounded-full">Em breve</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
