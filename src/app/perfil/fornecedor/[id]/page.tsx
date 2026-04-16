import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Building2,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LinkageCruzada,
  ReputacaoAgregadaBloco,
  ReviewCard,
} from "@/components/profile";
import {
  contratos,
  empresas,
  getFornecedorById,
  getFornecedorCredenciaisNomes,
  getOrganizacaoById,
  projetos,
  reviews,
  type Fornecedor,
  type Organizacao,
} from "@/lib/mock-data";

export default async function PerfilPublicoFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fornecedor = getFornecedorById(id);
  if (!fornecedor) notFound();

  const org = getOrganizacaoById(fornecedor.organizacao_id);
  if (!org) notFound();

  const contratosDoFornecedor = contratos.filter(
    (c) => c.fornecedor_id === fornecedor.id
  );
  const encerrados = contratosDoFornecedor.filter(
    (c) => c.status === "encerrado"
  );
  const emExecucao = contratosDoFornecedor.filter(
    (c) => c.status === "em_execucao"
  );

  const idsDestacados = new Set(fornecedor.contratos_destacaveis_ids);
  const contratosDestacaveisOrdenados = fornecedor.contratos_destacaveis_ids.length
    ? fornecedor.contratos_destacaveis_ids
        .map((cid) => contratosDoFornecedor.find((c) => c.id === cid))
        .filter((c): c is (typeof contratos)[number] => !!c)
        .filter((c) => c.visibilidade !== "privado")
    : encerrados
        .filter((c) => c.visibilidade !== "privado")
        .sort((a, b) =>
          (b.data_fim_real ?? b.data_fechamento).localeCompare(
            a.data_fim_real ?? a.data_fechamento
          )
        )
        .slice(0, 4);

  const reviewsRecebidas = reviews
    .filter(
      (r) =>
        r.status === "liberada" &&
        r.avaliado_org_tipo === "fornecedor" &&
        r.avaliado_org_id === fornecedor.organizacao_id
    )
    .sort((a, b) => (b.liberada_em ?? "").localeCompare(a.liberada_em ?? ""))
    .slice(0, 5);

  const credenciais = getFornecedorCredenciaisNomes(fornecedor);

  return (
    <div className="space-y-6">
      <HeaderFornecedor fornecedor={fornecedor} organizacao={org} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Sobre
            </h2>
            <p className="text-sm leading-relaxed">{fornecedor.descricao}</p>
          </CardContent>
        </Card>

        <ReputacaoAgregadaBloco
          reputacao={fornecedor.reputacao_agregada}
          tipo="fornecedor"
          verTodasHref={`/perfil/fornecedor/${fornecedor.id}/reviews`}
        />
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Atuação
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Categorias: </span>
              {fornecedor.categorias.map((c) => (
                <Badge key={c} variant="secondary" className="mr-1.5 rounded-full">
                  {c}
                </Badge>
              ))}
            </div>
            <div>
              <span className="text-muted-foreground">Regiões atendidas: </span>
              {fornecedor.regioes_atendidas.map((r) => (
                <Badge key={r} variant="outline" className="mr-1.5 rounded-full">
                  {r}
                </Badge>
              ))}
            </div>
            {fornecedor.capacidade_atual ? (
              <div>
                <span className="text-muted-foreground">Capacidade atual: </span>
                <span>{fornecedor.capacidade_atual}</span>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Award className="h-4 w-4" /> Credenciais
          </h3>
          {credenciais.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma credencial cadastrada.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {credenciais.map((credencial) => (
                <Badge key={credencial} className="rounded-full" variant="secondary">
                  {credencial}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="grid grid-cols-2 gap-4 p-5 text-sm md:grid-cols-3">
          <Estatistica
            label="Contratos realizados"
            valor={encerrados.length}
          />
          <Estatistica label="Em execução" valor={emExecucao.length} />
          <Estatistica
            label="Projetos realizados"
            valor={fornecedor.projetosRealizados}
          />
        </CardContent>
      </Card>

      <SectionTitle>
        {idsDestacados.size > 0 ? "Contratos destacáveis" : "Contratos recentes"}
      </SectionTitle>
      {contratosDestacaveisOrdenados.length === 0 ? (
        <EstadoVazio mensagem="Este fornecedor ainda não destacou nenhum contrato." />
      ) : (
        <div className="space-y-3">
          {contratosDestacaveisOrdenados.map((c) => (
            <ContratoDestacavelRow key={c.id} contratoId={c.id} />
          ))}
          {encerrados.length > contratosDestacaveisOrdenados.length ? (
            <p className="text-xs text-muted-foreground">
              Ver todos os contratos públicos ({encerrados.length})
            </p>
          ) : null}
        </div>
      )}

      <SectionTitle>Avaliações recebidas</SectionTitle>
      {reviewsRecebidas.length === 0 ? (
        <EstadoVazio mensagem="Esta organização ainda não recebeu avaliações." />
      ) : (
        <div className="space-y-3">
          {reviewsRecebidas.map((r) => (
            <ReviewCard key={r.id} review={r} viewerEhFornecedor />
          ))}
          {fornecedor.reputacao_agregada.total_reviews > reviewsRecebidas.length ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/perfil/fornecedor/${fornecedor.id}/reviews`}>
                Ver todas as avaliações
              </Link>
            </Button>
          ) : null}
        </div>
      )}

      {org.linkage_publica && org.perfil_empresa_ativo ? (
        <>
          <SectionTitle>Também atua como empresa</SectionTitle>
          <LinkageCruzada
            organizacao_id={fornecedor.organizacao_id}
            alvo="empresa"
          />
        </>
      ) : null}
    </div>
  );
}

function HeaderFornecedor({
  fornecedor,
  organizacao,
}: {
  fornecedor: Fornecedor;
  organizacao: Organizacao;
}) {
  const temLinkageEmpresa =
    organizacao.linkage_publica && organizacao.perfil_empresa_ativo;

  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {fornecedor.logo}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
              <Badge variant="secondary" className="gap-1 rounded-full">
                <ShieldCheck className="h-3 w-3" /> CNPJ verificado
              </Badge>
              {temLinkageEmpresa ? (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-full border-primary/30 text-primary"
                >
                  Também atua como empresa
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {fornecedor.cidade} ·{" "}
                {fornecedor.regiao}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Desde {fornecedor.desde}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Building2 className="h-4 w-4" /> {organizacao.cnpj}
              </span>
            </div>
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground">
              Razão social:{" "}
              <span className="text-foreground">{organizacao.razao_social}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContratoDestacavelRow({ contratoId }: { contratoId: string }) {
  const contrato = contratos.find((c) => c.id === contratoId);
  if (!contrato || contrato.visibilidade === "privado") return null;

  const empresa = empresas.find((e) => e.id === contrato.empresa_id);
  const projeto = projetos.find((p) => p.id === contrato.projeto_id);

  return (
    <Card className="rounded-xl">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {projeto?.titulo ?? `Contrato #${contrato.id}`}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {contrato.valor_final} ·{" "}
            {contrato.data_fim_real ?? contrato.data_fechamento}
            {empresa ? ` · Contratante: ` : ""}
            {empresa ? (
              <Link
                href={`/perfil/empresa/${empresa.id}`}
                className="text-primary hover:underline"
              >
                {empresa.nome}
              </Link>
            ) : null}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full text-xs">
          {contrato.status === "encerrado" ? "Encerrado" : "Em execução"}
        </Badge>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

function Estatistica({
  label,
  valor,
}: {
  label: string;
  valor: string | number;
}) {
  return (
    <div>
      <p className="text-2xl font-bold tabular-nums">{valor}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <Card className="rounded-xl border-dashed">
      <CardContent className="p-6 text-center text-sm text-muted-foreground">
        {mensagem}
      </CardContent>
    </Card>
  );
}
