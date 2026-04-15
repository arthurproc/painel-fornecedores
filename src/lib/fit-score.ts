import type { Fornecedor, Projeto } from "@/lib/mock-data";

export interface FitScoreBreakdown {
  total: number;
  categoria: { peso: number; match: boolean };
  regiao: { peso: number; match: boolean };
  capacidade: { peso: number; match: boolean };
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
      capacidade: { peso: 0, match: false },
    };
  }

  const categoriaMatch = fornecedor.categorias.includes(projeto.categoria);
  const regiaoMatch =
    fornecedor.regioes_atendidas.includes(projeto.regiao) ||
    fornecedor.regiao === projeto.regiao;
  const capacidadeMatch = Boolean(fornecedor.capacidade_atual);

  const categoriaPeso = categoriaMatch ? 45 : 10;
  const regiaoPeso = regiaoMatch ? 35 : 10;
  const capacidadePeso = capacidadeMatch ? 15 : 5;

  const total = Math.min(categoriaPeso + regiaoPeso + capacidadePeso, 99);

  return {
    total,
    categoria: { peso: categoriaPeso, match: categoriaMatch },
    regiao: { peso: regiaoPeso, match: regiaoMatch },
    capacidade: { peso: capacidadePeso, match: capacidadeMatch },
  };
}

export function fitScoreColor(total: number): string {
  if (total >= 80) return "text-emerald-700 bg-emerald-100";
  if (total >= 60) return "text-amber-700 bg-amber-100";
  return "text-gray-700 bg-gray-100";
}
