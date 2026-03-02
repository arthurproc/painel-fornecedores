"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface PlanningFiltersState {
  empresa: string
  local: string
  dataInicio: string
  dataFim: string
  objeto: string
}

interface PlanningFiltersProps {
  filters: PlanningFiltersState
  onFilterChange: (filters: PlanningFiltersState) => void
  empresaOptions: string[]
  localOptions: string[]
}

export function PlanningFilters({
  filters,
  onFilterChange,
  empresaOptions,
  localOptions,
}: PlanningFiltersProps) {
  function handleClear() {
    onFilterChange({ empresa: "", local: "", dataInicio: "", dataFim: "", objeto: "" })
  }

  return (
    <div className="flex flex-wrap items-end gap-2 py-3">
      <Select
        value={filters.empresa}
        onValueChange={(v) => onFilterChange({ ...filters, empresa: v === "_all" ? "" : v })}
      >
        <SelectTrigger className="w-48 text-xs h-8">
          <SelectValue placeholder="Empresa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todas as empresas</SelectItem>
          {empresaOptions.map((e) => (
            <SelectItem key={e} value={e}>
              {e}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.local}
        onValueChange={(v) => onFilterChange({ ...filters, local: v === "_all" ? "" : v })}
      >
        <SelectTrigger className="w-48 text-xs h-8">
          <SelectValue placeholder="Local de Execução" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todos os locais</SelectItem>
          {localOptions.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Input
          type="date"
          className="h-8 text-xs w-36"
          aria-label="Data início"
          value={filters.dataInicio}
          onChange={(e) => onFilterChange({ ...filters, dataInicio: e.target.value })}
        />
        <span className="text-xs text-muted-foreground">até</span>
        <Input
          type="date"
          className="h-8 text-xs w-36"
          aria-label="Data fim"
          value={filters.dataFim}
          onChange={(e) => onFilterChange({ ...filters, dataFim: e.target.value })}
        />
      </div>

      <Input
        className="h-8 text-xs w-48"
        placeholder="Buscar objeto..."
        aria-label="Buscar objeto"
        value={filters.objeto}
        onChange={(e) => onFilterChange({ ...filters, objeto: e.target.value })}
      />

      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleClear}>
        Limpar
      </Button>
    </div>
  )
}
