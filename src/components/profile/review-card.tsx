import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Estrelas } from "./reputacao-agregada";
import { MembroPopover } from "./membro-popover";
import {
  getContratoById,
  getEmpresaByOrganizacao,
  getFornecedorByOrganizacao,
  getMembroById,
  getOrganizacaoById,
  projetos,
  reviewDimensoes,
  type Review,
} from "@/lib/mock-data";

function formatarDataBR(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

interface ReviewCardProps {
  review: Review;
  viewerEhFornecedor?: boolean;
}

export function ReviewCard({ review, viewerEhFornecedor = false }: ReviewCardProps) {
  const autor = getMembroById(review.autor_membro_id);
  const contrato = getContratoById(review.contrato_id);
  const projeto = contrato ? projetos.find((p) => p.id === contrato.projeto_id) : undefined;

  const orgAutora = autor ? getOrganizacaoById(autor.organizacao_id) : undefined;
  const empresaAutora = orgAutora ? getEmpresaByOrganizacao(orgAutora.id) : undefined;
  const fornecedorAutor = orgAutora ? getFornecedorByOrganizacao(orgAutora.id) : undefined;

  const nomeOrgAutora =
    empresaAutora?.nome ?? fornecedorAutor?.nome ?? orgAutora?.razao_social ?? "";
  const hrefOrgAutora = empresaAutora
    ? `/perfil/empresa/${empresaAutora.id}`
    : fornecedorAutor
      ? `/perfil/fornecedor/${fornecedorAutor.id}`
      : undefined;

  const visibilidadeContrato = contrato?.visibilidade ?? "publico";
  const valorVisivel =
    visibilidadeContrato === "publico" ||
    (visibilidadeContrato === "fornecedores" && viewerEhFornecedor);

  const dimensoes = [...reviewDimensoes]
    .filter((d) => d.aplica_a === review.avaliado_org_tipo && d.ativo)
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {autor ? (
              <MembroPopover membro={autor}>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {autor.nome.charAt(0)}
                </button>
              </MembroPopover>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                ?
              </div>
            )}
            <div className="text-sm">
              <p className="font-semibold">{autor?.nome ?? "Autor"}</p>
              <p className="text-xs text-muted-foreground">
                {autor?.cargo}
                {hrefOrgAutora && nomeOrgAutora ? (
                  <>
                    {" · "}
                    <Link
                      href={hrefOrgAutora}
                      className="text-primary hover:underline"
                    >
                      {nomeOrgAutora}
                    </Link>
                  </>
                ) : (
                  nomeOrgAutora && ` · ${nomeOrgAutora}`
                )}
              </p>
              {contrato ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  ✓ Contrato encerrado em{" "}
                  {contrato.data_fim_real
                    ? formatarDataBR(contrato.data_fim_real)
                    : contrato.data_fechamento}
                  {valorVisivel ? ` — ${contrato.valor_final}` : ""}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-1.5 text-sm sm:grid-cols-2">
          {dimensoes.map((dim) => {
            const nota = review.notas[dim.id] ?? 0;
            return (
              <div key={dim.id} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{dim.nome}</span>
                <Estrelas nota={nota} size="sm" />
              </div>
            );
          })}
        </div>

        {review.comentario ? (
          <p className="rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">
            &ldquo;{review.comentario}&rdquo;
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Liberada em {formatarDataBR(review.liberada_em)}</span>
          {projeto ? (
            <span>
              Contrato:{" "}
              <span className="text-foreground">{projeto.titulo}</span>
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
