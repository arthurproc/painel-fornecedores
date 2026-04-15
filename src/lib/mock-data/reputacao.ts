import { reviews } from "./reviews";

export interface ReputacaoAgregada {
  media_geral: number;
  total_reviews: number;
  por_dimensao: {
    [dimensao_id: string]: { media: number; total: number };
  };
  ultima_atualizacao: string;
}

export const REPUTACAO_VAZIA: ReputacaoAgregada = {
  media_geral: 0,
  total_reviews: 0,
  por_dimensao: {},
  ultima_atualizacao: "",
};

export function computeReputacao(
  organizacao_id: string,
  tipo: "empresa" | "fornecedor"
): ReputacaoAgregada {
  const liberadas = reviews.filter(
    (r) =>
      r.status === "liberada" &&
      r.avaliado_org_tipo === tipo &&
      r.avaliado_org_id === organizacao_id
  );

  if (liberadas.length === 0) {
    return { ...REPUTACAO_VAZIA };
  }

  const porDimensao: Record<string, { soma: number; total: number }> = {};
  let somaGeral = 0;
  let totalGeral = 0;
  let ultima = "";

  for (const r of liberadas) {
    if (r.liberada_em && r.liberada_em > ultima) ultima = r.liberada_em;
    for (const [dim, nota] of Object.entries(r.notas)) {
      porDimensao[dim] ??= { soma: 0, total: 0 };
      porDimensao[dim].soma += nota;
      porDimensao[dim].total += 1;
      somaGeral += nota;
      totalGeral += 1;
    }
  }

  const por_dimensao: ReputacaoAgregada["por_dimensao"] = {};
  for (const [dim, { soma, total }] of Object.entries(porDimensao)) {
    por_dimensao[dim] = { media: soma / total, total };
  }

  return {
    media_geral: totalGeral > 0 ? somaGeral / totalGeral : 0,
    total_reviews: liberadas.length,
    por_dimensao,
    ultima_atualizacao: ultima,
  };
}
