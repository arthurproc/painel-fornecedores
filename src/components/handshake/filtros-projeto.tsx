"use client";

import { Filter, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FiltrosProjetoValue {
  busca: string;
  categoria: string;
  regiao: string;
  faixaValor: string;
  prazo: string;
}

export const FAIXAS_VALOR = [
  { value: "todas", label: "Todas as faixas" },
  { value: "ate_100k", label: "Até R$ 100 mil" },
  { value: "100k_300k", label: "R$ 100 mil – R$ 300 mil" },
  { value: "300k_800k", label: "R$ 300 mil – R$ 800 mil" },
  { value: "acima_800k", label: "Acima de R$ 800 mil" },
] as const;

export const FAIXAS_PRAZO = [
  { value: "todos", label: "Qualquer prazo" },
  { value: "30d", label: "Próximos 30 dias" },
  { value: "60d", label: "Próximos 60 dias" },
  { value: "90d", label: "Próximos 90 dias" },
] as const;

interface FiltrosProjetoProps {
  value: FiltrosProjetoValue;
  onChange: (value: FiltrosProjetoValue) => void;
  categorias: readonly string[];
  regioes: readonly string[];
}

export function FiltrosProjeto({ value, onChange, categorias, regioes }: FiltrosProjetoProps) {
  function patch(parcial: Partial<FiltrosProjetoValue>) {
    onChange({ ...value, ...parcial });
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou descrição…"
          className="pl-9"
          value={value.busca}
          onChange={(event) => patch({ busca: event.target.value })}
        />
      </div>

      <Select value={value.categoria} onValueChange={(v) => v && patch({ categoria: v })}>
        <SelectTrigger>
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as categorias</SelectItem>
          {categorias.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.regiao} onValueChange={(v) => v && patch({ regiao: v })}>
        <SelectTrigger>
          <MapPin className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Região" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as regiões</SelectItem>
          {regioes.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.faixaValor} onValueChange={(v) => v && patch({ faixaValor: v })}>
        <SelectTrigger>
          <SelectValue placeholder="Faixa de valor" />
        </SelectTrigger>
        <SelectContent>
          {FAIXAS_VALOR.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.prazo} onValueChange={(v) => v && patch({ prazo: v })}>
        <SelectTrigger>
          <SelectValue placeholder="Prazo" />
        </SelectTrigger>
        <SelectContent>
          {FAIXAS_PRAZO.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const FILTROS_INICIAIS: FiltrosProjetoValue = {
  busca: "",
  categoria: "todas",
  regiao: "todas",
  faixaValor: "todas",
  prazo: "todos",
};

export function filtroCorrespondeOrcamento(orcamentoMax: number, faixa: string): boolean {
  switch (faixa) {
    case "ate_100k":
      return orcamentoMax <= 100_000;
    case "100k_300k":
      return orcamentoMax > 100_000 && orcamentoMax <= 300_000;
    case "300k_800k":
      return orcamentoMax > 300_000 && orcamentoMax <= 800_000;
    case "acima_800k":
      return orcamentoMax > 800_000;
    default:
      return true;
  }
}

export function orcamentoMaxNumerico(projeto: { orcamento_max?: string; orcamento: string }): number {
  const raw = projeto.orcamento_max ?? projeto.orcamento.split("-").pop() ?? projeto.orcamento;
  const digitos = raw.replace(/[^0-9,]/g, "").replace(",", ".");
  const num = Number.parseFloat(digitos);
  return Number.isFinite(num) ? num : 0;
}

export function filtroCorrespondePrazo(prazoDDMMYYYY: string, faixa: string, hoje: Date): boolean {
  if (faixa === "todos") return true;
  const [dd, mm, yyyy] = prazoDDMMYYYY.split("/");
  if (!dd || !mm || !yyyy) return true;
  const data = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const diff = (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return false;
  if (faixa === "30d") return diff <= 30;
  if (faixa === "60d") return diff <= 60;
  if (faixa === "90d") return diff <= 90;
  return true;
}
