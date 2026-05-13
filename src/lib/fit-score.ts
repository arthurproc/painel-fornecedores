import type { Fornecedor, Projeto } from "@/lib/mock-data";
import { getCategoriaItemById } from "@/lib/platform-data";

/**
 * Status do match de capacidade comparando o **teto físico** do fornecedor
 * (capacidade nominal mensal) com o volume estimado do projeto.
 *
 * Por que nominal e não livre (= nominal × (1 - utilização))? Porque o snapshot
 * de utilização atual é volátil — fornecedor 95% ocupado hoje pode estar 30%
 * em 60 dias quando o projeto começar. Penalizar com base nisso geraria falsos
 * negativos sistemáticos. Nominal é o teto estável da operação e dá uma
 * resposta honesta a "esse fornecedor consegue fisicamente esse volume?".
 *
 * A utilização e o cálculo de "livre" continuam expostos no breakdown como
 * contexto informativo para a UI, mas não entram no critério.
 *
 * - `compatible`  → nominal cobre folgadamente (≥ volume × 1.0)
 * - `tight`       → nominal apertado (entre 80% e 100% do volume)
 * - `insufficient`→ nominal não cobre fisicamente (< 80% do volume)
 * - `unknown`     → não dá pra comparar (projeto sem categoria_item_id/volume,
 *                   ou fornecedor sem capacidade declarada nesse item)
 */
export type CapacidadeMatchStatus = "compatible" | "tight" | "insufficient" | "unknown";

export interface CapacidadeBreakdown {
  status: CapacidadeMatchStatus;
  peso: number;
  /** Capacidade nominal mensal do fornecedor naquele item (na unidade do item). */
  nominal_mensal?: number;
  /** % atual de utilização declarado pelo fornecedor (0-100). */
  utilizacao_percent?: number;
  /** Capacidade livre mensal = nominal × (1 − utilização). */
  livre_mensal?: number;
  /** Volume requerido pelo projeto, normalizado para base mensal. */
  volume_requerido_mensal?: number;
  /** Unidade abreviada (HH/mês, TON/mês, …). Útil para a UI. */
  unidade?: string;
}

export interface FitScoreBreakdown {
  total: number;
  categoria: { peso: number; match: boolean };
  regiao: { peso: number; match: boolean };
  capacidade: CapacidadeBreakdown;
}

const PESO_CATEGORIA_MATCH = 45;
const PESO_CATEGORIA_NEUTRO = 10;
const PESO_REGIAO_MATCH = 35;
const PESO_REGIAO_NEUTRO = 10;

// Pesos da dimensão capacidade:
//  compatible → benefício pleno
//  tight      → benefício parcial (sinaliza que o fornecedor cabe mas com pouca folga)
//  insufficient → penaliza
//  unknown    → neutro (nem ajuda nem prejudica fortemente, evita travar o sistema
//               quando o projeto/fornecedor ainda não declarou os números)
const PESO_CAPACIDADE_COMPATIBLE = 20;
const PESO_CAPACIDADE_TIGHT = 12;
const PESO_CAPACIDADE_INSUFFICIENT = 0;
const PESO_CAPACIDADE_UNKNOWN = 6;

/**
 * Default mensal-equivalente para projetos com periodicidade "total".
 * Sem campo de duração do contrato no schema atual, assumimos 12 meses como base
 * heurística de comparação. Quando a duração for adicionada ao Projeto, trocar
 * este número pela duração real do contrato.
 */
const MESES_DEFAULT_CONTRATO_TOTAL = 12;

function volumeRequeridoMensal(projeto: Projeto): number | undefined {
  const volume = projeto.volume_estimado;
  if (!volume) return undefined;
  if (volume.periodicidade === "mensal") return volume.quantidade;
  return volume.quantidade / MESES_DEFAULT_CONTRATO_TOTAL;
}

function pesoCapacidade(status: CapacidadeMatchStatus): number {
  switch (status) {
    case "compatible":
      return PESO_CAPACIDADE_COMPATIBLE;
    case "tight":
      return PESO_CAPACIDADE_TIGHT;
    case "insufficient":
      return PESO_CAPACIDADE_INSUFFICIENT;
    case "unknown":
      return PESO_CAPACIDADE_UNKNOWN;
  }
}

export function computeCapacidadeBreakdown(
  projeto: Projeto,
  fornecedor: Fornecedor | undefined
): CapacidadeBreakdown {
  if (!fornecedor || !projeto.categoria_item_id || !projeto.volume_estimado) {
    return { status: "unknown", peso: PESO_CAPACIDADE_UNKNOWN };
  }

  const capacidade = fornecedor.capacidades_instaladas.find(
    (c) => c.categoria_item_id === projeto.categoria_item_id
  );
  if (!capacidade) {
    return { status: "unknown", peso: PESO_CAPACIDADE_UNKNOWN };
  }

  const item = getCategoriaItemById(projeto.categoria_item_id);
  const unidade = item?.unidade_medida;
  const nominal = capacidade.capacidade_nominal_mensal;
  const utilizacao = capacidade.percent_utilizacao_atual;
  const livre = nominal * (1 - utilizacao / 100);
  const requerido = volumeRequeridoMensal(projeto) ?? 0;

  // Compara o **teto** (nominal) com o volume requerido, não o livre atual.
  // Ver comentário do tipo CapacidadeMatchStatus acima.
  let status: CapacidadeMatchStatus;
  if (nominal >= requerido) status = "compatible";
  else if (nominal >= requerido * 0.8) status = "tight";
  else status = "insufficient";

  return {
    status,
    peso: pesoCapacidade(status),
    nominal_mensal: nominal,
    utilizacao_percent: utilizacao,
    livre_mensal: livre,
    volume_requerido_mensal: requerido,
    unidade: unidade ? `${unidade}/mês` : undefined,
  };
}

export function computeFitScore(
  projeto: Projeto,
  fornecedor: Fornecedor | undefined
): FitScoreBreakdown {
  if (!fornecedor) {
    return {
      total: 50,
      categoria: { peso: 0, match: false },
      regiao: { peso: 0, match: false },
      capacidade: { status: "unknown", peso: 0 },
    };
  }

  const categoriaMatch = fornecedor.categorias.includes(projeto.categoria);
  const regiaoMatch =
    fornecedor.regioes_atendidas.includes(projeto.regiao) ||
    fornecedor.regiao === projeto.regiao;

  const categoriaPeso = categoriaMatch ? PESO_CATEGORIA_MATCH : PESO_CATEGORIA_NEUTRO;
  const regiaoPeso = regiaoMatch ? PESO_REGIAO_MATCH : PESO_REGIAO_NEUTRO;
  const capacidade = computeCapacidadeBreakdown(projeto, fornecedor);

  const total = Math.min(categoriaPeso + regiaoPeso + capacidade.peso, 99);

  return {
    total,
    categoria: { peso: categoriaPeso, match: categoriaMatch },
    regiao: { peso: regiaoPeso, match: regiaoMatch },
    capacidade,
  };
}

export function fitScoreColor(total: number): string {
  if (total >= 80) return "text-emerald-700 bg-emerald-100";
  if (total >= 60) return "text-amber-700 bg-amber-100";
  return "text-gray-700 bg-gray-100";
}

export function capacidadeStatusLabel(status: CapacidadeMatchStatus): string {
  switch (status) {
    case "compatible":
      return "Capacidade compatível";
    case "tight":
      return "Capacidade apertada";
    case "insufficient":
      return "Capacidade insuficiente";
    case "unknown":
      return "Capacidade não declarada";
  }
}

export function capacidadeStatusBadgeClass(status: CapacidadeMatchStatus): string {
  switch (status) {
    case "compatible":
      return "text-emerald-700 bg-emerald-100";
    case "tight":
      return "text-amber-700 bg-amber-100";
    case "insufficient":
      return "text-red-700 bg-red-100";
    case "unknown":
      return "text-gray-700 bg-gray-100";
  }
}
