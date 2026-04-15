import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, Calendar, Lock, MapPin, ShieldCheck } from "lucide-react";
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
  candidaturas,
  contratos,
  fornecedores,
  getEmpresaById,
  getOrganizacaoById,
  projetos,
  reviews,
  type Empresa,
  type Organizacao,
} from "@/lib/mock-data";

export default async function PerfilPublicoEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresa = getEmpresaById(id);
  if (!empresa) notFound();

  const org = getOrganizacaoById(empresa.organizacao_id);
  if (!org) notFound();

  const contratosDaEmpresa = contratos.filter((c) => c.empresa_id === empresa.id);
  const encerrados = contratosDaEmpresa.filter((c) => c.status === "encerrado");
  const emExecucao = contratosDaEmpresa.filter((c) => c.status === "em_execucao");

  const projetosAtivos = projetos
    .filter(
      (p) =>
        p.empresa_id === empresa.id &&
        (p.status === "publicado" ||
          p.status === "em_triagem" ||
          p.status === "em_propostas")
    )
    .sort((a, b) => compararDataBR(b.dataPublicacao, a.dataPublicacao));

  const historicoContratos = [...encerrados, ...emExecucao]
    .sort((a, b) =>
      (b.data_fim_real ?? b.data_fechamento).localeCompare(
        a.data_fim_real ?? a.data_fechamento
      )
    )
    .slice(0, 5);

  const reviewsRecebidas = reviews
    .filter(
      (r) =>
        r.status === "liberada" &&
        r.avaliado_org_tipo === "empresa" &&
        r.avaliado_org_id === empresa.organizacao_id
    )
    .sort((a, b) => (b.liberada_em ?? "").localeCompare(a.liberada_em ?? ""))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <HeaderEmpresa empresa={empresa} organizacao={org} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Sobre
            </h2>
            <p className="leading-relaxed text-sm">{empresa.descricao}</p>
          </CardContent>
        </Card>

        <ReputacaoAgregadaBloco
          reputacao={empresa.reputacao_agregada}
          tipo="empresa"
          verTodasHref={`/perfil/empresa/${empresa.id}/reviews`}
        />
      </div>

      <Card className="rounded-xl">
        <CardContent className="grid grid-cols-2 gap-4 p-5 text-sm md:grid-cols-4">
          <Estatistica
            label="Contratos publicados"
            valor={empresa.contratos_publicados}
          />
          <Estatistica label="Encerrados" valor={encerrados.length} />
          <Estatistica label="Em execução" valor={emExecucao.length} />
          <Estatistica
            label="Tempo médio de pagamento"
            valor={
              empresa.tempo_medio_pagamento_dias
                ? `${empresa.tempo_medio_pagamento_dias} dias`
                : "—"
            }
          />
        </CardContent>
      </Card>

      <SectionTitle>Projetos ativos</SectionTitle>
      {projetosAtivos.length === 0 ? (
        <EstadoVazio mensagem="Nenhum projeto ativo no momento." />
      ) : (
        <div className="space-y-3">
          {projetosAtivos.slice(0, 3).map((p) => (
            <Card key={p.id} className="rounded-xl">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="font-semibold">{p.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.cidade} · {p.categoria} · {p.orcamento} · Publicado em{" "}
                    {p.dataPublicacao}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/fornecedor/projeto/${p.id}`}>
                    Ver projeto <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {projetosAtivos.length > 3 ? (
            <p className="text-xs text-muted-foreground">
              E mais {projetosAtivos.length - 3}{" "}
              {projetosAtivos.length - 3 === 1 ? "projeto" : "projetos"}.
            </p>
          ) : null}
        </div>
      )}

      <SectionTitle>Histórico de contratos</SectionTitle>
      {historicoContratos.length === 0 ? (
        <EstadoVazio mensagem="Ainda não há contratos fechados nesta organização." />
      ) : (
        <div className="space-y-3">
          {historicoContratos.map((c) => (
            <HistoricoContratoRow key={c.id} contratoId={c.id} />
          ))}
          {encerrados.length > 5 ? (
            <p className="text-xs text-muted-foreground">
              Ver histórico completo ({encerrados.length} encerrados)
            </p>
          ) : null}
        </div>
      )}

      <SectionTitle>Reviews recebidas</SectionTitle>
      {reviewsRecebidas.length === 0 ? (
        <EstadoVazio mensagem="Esta organização ainda não recebeu avaliações." />
      ) : (
        <div className="space-y-3">
          {reviewsRecebidas.map((r) => (
            <ReviewCard key={r.id} review={r} viewerEhFornecedor />
          ))}
          {empresa.reputacao_agregada.total_reviews > reviewsRecebidas.length ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/perfil/empresa/${empresa.id}/reviews`}>
                Ver todas as reviews
              </Link>
            </Button>
          ) : null}
        </div>
      )}

      {org.linkage_publica && org.perfil_fornecedor_ativo ? (
        <>
          <SectionTitle>Também atua como fornecedor</SectionTitle>
          <LinkageCruzada
            organizacao_id={empresa.organizacao_id}
            alvo="fornecedor"
          />
        </>
      ) : null}

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Interessado em contratar serviços aqui? Procure os projetos ativos da
        empresa ou busque fornecedores no{" "}
        <Link href="/empresa/diretorio" className="text-primary hover:underline">
          diretório
        </Link>
        .
      </div>
    </div>
  );
}

function HeaderEmpresa({
  empresa,
  organizacao,
}: {
  empresa: Empresa;
  organizacao: Organizacao;
}) {
  const temLinkageFornecedor =
    organizacao.linkage_publica && organizacao.perfil_fornecedor_ativo;
  const candidaturasAbertas = candidaturas.filter((c) => {
    const p = projetos.find((p) => p.id === c.projeto_id);
    return p?.empresa_id === empresa.id;
  }).length;

  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {empresa.logo}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{empresa.nome}</h1>
              <Badge variant="secondary" className="gap-1 rounded-full">
                <ShieldCheck className="h-3 w-3" /> CNPJ verificado
              </Badge>
              {temLinkageFornecedor ? (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-full border-primary/30 text-primary"
                >
                  Também atua como fornecedor
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{empresa.setor}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {empresa.cidade} · {empresa.regiao}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Desde {empresa.desde}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Building2 className="h-4 w-4" /> {organizacao.cnpj}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>
                Razão social:{" "}
                <span className="text-foreground">{organizacao.razao_social}</span>
              </span>
              <span>
                Candidaturas recebidas:{" "}
                <span className="text-foreground">{candidaturasAbertas}</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoricoContratoRow({ contratoId }: { contratoId: string }) {
  const contrato = contratos.find((c) => c.id === contratoId);
  if (!contrato) return null;

  if (contrato.visibilidade === "privado") {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          Contrato com visibilidade restrita.
        </CardContent>
      </Card>
    );
  }

  const fornecedor = fornecedores.find((f) => f.id === contrato.fornecedor_id);
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
            {fornecedor ? ` · Vencedor: ` : ""}
            {fornecedor ? (
              <Link
                href={`/perfil/fornecedor/${fornecedor.id}`}
                className="text-primary hover:underline"
              >
                {fornecedor.nome}
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

function compararDataBR(a: string, b: string): number {
  const [da, ma, ya] = a.split("/");
  const [db, mb, yb] = b.split("/");
  return (
    `${ya}${ma}${da}`.localeCompare(`${yb}${mb}${db}`)
  );
}
