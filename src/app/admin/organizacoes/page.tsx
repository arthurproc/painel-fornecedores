import { Building2, Calendar, Globe, Lock, Star, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getContratosPorOrg,
  getEmpresaByOrganizacao,
  getFornecedorByOrganizacao,
  getMembrosByOrg,
  organizacoes,
  projetos,
} from "@/lib/mock-data";

export default function AdminOrganizacoesPage() {
  const ativas = organizacoes.filter((o) => o.ativo).length;
  const dualRole = organizacoes.filter(
    (o) => o.perfil_empresa_ativo && o.perfil_fornecedor_ativo
  ).length;
  const somenteEmpresa = organizacoes.filter(
    (o) => o.perfil_empresa_ativo && !o.perfil_fornecedor_ativo
  ).length;
  const somenteFornecedor = organizacoes.filter(
    (o) => !o.perfil_empresa_ativo && o.perfil_fornecedor_ativo
  ).length;

  const ordenadas = [...organizacoes].sort((a, b) =>
    a.razao_social.localeCompare(b.razao_social)
  );

  return (
    <AppShell tipo="admin" titulo="Organizações">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{organizacoes.length}</span>{" "}
            organizações cadastradas ·{" "}
            <span className="font-semibold text-foreground">{ativas}</span> ativas
          </span>
          <span>
            <span className="font-semibold text-foreground">{somenteEmpresa}</span>{" "}
            empresa ·{" "}
            <span className="font-semibold text-foreground">{somenteFornecedor}</span>{" "}
            fornecedor ·{" "}
            <span className="font-semibold text-foreground">{dualRole}</span>{" "}
            dual-role
          </span>
        </div>

        <div className="space-y-3">
          {ordenadas.map((org) => {
            const empresa = org.perfil_empresa_ativo
              ? getEmpresaByOrganizacao(org.id)
              : undefined;
            const fornecedor = org.perfil_fornecedor_ativo
              ? getFornecedorByOrganizacao(org.id)
              : undefined;
            const membrosOrg = getMembrosByOrg(org.id);
            const contratosOrg = getContratosPorOrg(org.id);
            const projetosEmpresa = empresa
              ? projetos.filter((p) => p.empresa_id === empresa.id)
              : [];
            const contratosFechados = contratosOrg.filter(
              (c) => c.status === "encerrado"
            ).length;
            const isDual =
              org.perfil_empresa_ativo && org.perfil_fornecedor_ativo;

            const rep =
              fornecedor?.reputacao_agregada ?? empresa?.reputacao_agregada;

            return (
              <Card key={org.id} className="rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {empresa?.logo ?? fornecedor?.logo ?? <Building2 className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{org.razao_social}</h3>
                        {isDual && (
                          <Badge className="bg-amber-100 text-xs text-amber-800">
                            Dual-role
                          </Badge>
                        )}
                        {org.perfil_empresa_ativo && (
                          <Badge
                            variant="secondary"
                            className="bg-amber-50 text-xs text-amber-800"
                          >
                            Perfil empresa
                          </Badge>
                        )}
                        {org.perfil_fornecedor_ativo && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-xs text-emerald-800"
                          >
                            Perfil fornecedor
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {org.linkage_publica ? (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" /> Linkage pública
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Linkage privada
                            </span>
                          )}
                        </Badge>
                        {!org.ativo && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-xs text-gray-600"
                          >
                            Inativa
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        CNPJ {org.cnpj} · {org.endereco_fiscal}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> desde {org.desde}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {membrosOrg.length} membro
                          {membrosOrg.length === 1 ? "" : "s"}
                        </span>
                        <span>
                          Perfil inicial:{" "}
                          <span className="font-medium text-foreground">
                            {org.perfil_primeiro_escolhido}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-3 gap-5 text-center">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          {projetosEmpresa.length}
                        </p>
                        <p className="text-xs text-muted-foreground">projetos</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{contratosOrg.length}</p>
                        <p className="text-xs text-muted-foreground">
                          contratos
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-xl font-bold">
                            {rep && rep.total_reviews > 0
                              ? rep.media_geral.toFixed(1)
                              : "—"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rep?.total_reviews ?? 0} avaliações
                        </p>
                      </div>
                    </div>
                  </div>

                  {isDual && (
                    <div className="mt-3 rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Esta organização opera <strong>como empresa</strong> (
                      {projetosEmpresa.length} projeto
                      {projetosEmpresa.length === 1 ? "" : "s"}) e{" "}
                      <strong>como fornecedor</strong> (
                      {fornecedor?.categorias.length ?? 0} categoria
                      {(fornecedor?.categorias.length ?? 0) === 1 ? "" : "s"}) ao
                      mesmo tempo. Contratos encerrados: {contratosFechados}.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
