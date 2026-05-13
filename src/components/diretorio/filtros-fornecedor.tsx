"use client";

import { Award, Filter, Gauge, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriaItens, getCategoriaItemById, getUnidadeAbreviada } from "@/lib/platform-data";

export interface FiltrosFornecedorValue {
  busca: string;
  categoria: string;
  regiao: string;
  certificacao: string;
  /** ID de item do catálogo (`platform-data.categoriaItens`) ou "todas". */
  categoria_item_id: string;
  /** Capacidade livre mínima mensal na unidade do item escolhido. Vazio = sem filtro. */
  capacidade_livre_min: string;
}

export const FILTROS_FORNECEDOR_INICIAIS: FiltrosFornecedorValue = {
  busca: "",
  categoria: "todas",
  regiao: "todas",
  certificacao: "todas",
  categoria_item_id: "todas",
  capacidade_livre_min: "",
};

interface FiltrosFornecedorProps {
  value: FiltrosFornecedorValue;
  onChange: (value: FiltrosFornecedorValue) => void;
  categorias: readonly string[];
  regioes: readonly string[];
  certificacoes: readonly string[];
}

export function FiltrosFornecedor({
  value,
  onChange,
  categorias,
  regioes,
  certificacoes,
}: FiltrosFornecedorProps) {
  function patch(parcial: Partial<FiltrosFornecedorValue>) {
    onChange({ ...value, ...parcial });
  }

  const itemSelecionado =
    value.categoria_item_id !== "todas" ? getCategoriaItemById(value.categoria_item_id) : undefined;
  const unidadeAbrev = itemSelecionado ? getUnidadeAbreviada(itemSelecionado.unidade_medida) : "";

  return (
    <div className="space-y-3"><div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou descrição…"
          className="pl-9"
          value={value.busca}
          onChange={(event) => patch({ busca: event.target.value })}
        />
      </div>

      <Select
        value={value.categoria}
        onValueChange={(v) => v && patch({ categoria: v })}
      >
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

      <Select
        value={value.regiao}
        onValueChange={(v) => v && patch({ regiao: v })}
      >
        <SelectTrigger>
          <MapPin className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Região atendida" />
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

      <Select
        value={value.certificacao}
        onValueChange={(v) => v && patch({ certificacao: v })}
      >
        <SelectTrigger>
          <Award className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Certificação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as certificações</SelectItem>
          {certificacoes.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-1">
          <Label className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-3 w-3" /> Item do catálogo (capacidade declarada)
          </Label>
          <Select
            value={value.categoria_item_id}
            onValueChange={(v) =>
              v &&
              patch({
                categoria_item_id: v,
                // Resetar valor mínimo ao trocar de unidade
                capacidade_livre_min: v === value.categoria_item_id ? value.capacidade_livre_min : "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Qualquer item</SelectItem>
              {categoriaItens.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nome} ({getUnidadeAbreviada(item.unidade_medida)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Capacidade livre mínima {unidadeAbrev ? `(${unidadeAbrev})` : ""}
          </Label>
          <Input
            type="number"
            min={0}
            value={value.capacidade_livre_min}
            onChange={(event) => patch({ capacidade_livre_min: event.target.value })}
            placeholder={itemSelecionado ? "ex.: 100" : "escolha o item primeiro"}
            disabled={value.categoria_item_id === "todas"}
          />
        </div>
      </div>
    </div>
  );
}
