"use client";

import { Award, Filter, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FiltrosFornecedorValue {
  busca: string;
  categoria: string;
  regiao: string;
  certificacao: string;
}

export const FILTROS_FORNECEDOR_INICIAIS: FiltrosFornecedorValue = {
  busca: "",
  categoria: "todas",
  regiao: "todas",
  certificacao: "todas",
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

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
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
  );
}
