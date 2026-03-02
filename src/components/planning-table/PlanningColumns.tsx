"use client"

import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./StatusBadge"
import { PlanningOpportunity } from "@/types/opportunity"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

function SortableHeader({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 text-xs font-semibold hover:bg-transparent whitespace-normal text-left leading-tight"
      onClick={onClick}
    >
      {label}
      <ArrowUpDown className="ml-1 h-3 w-3 shrink-0" />
    </Button>
  )
}

interface UseColumnsProps {
  onViewDetails: (opportunity: PlanningOpportunity) => void
  onManifestInterest: (opportunity: PlanningOpportunity) => void
}

export function usePlanningColumns({
  onViewDetails,
  onManifestInterest,
}: UseColumnsProps): ColumnDef<PlanningOpportunity>[] {
  return useMemo(
    () => [
      {
        accessorKey: "entidadeOuEmpresa",
        header: ({ column }) => (
          <SortableHeader
            label="ENTIDADE OU EMPRESA"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "tipoDeAquisicao",
        header: ({ column }) => (
          <SortableHeader
            label="TIPO DE AQUISIÇÃO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "tipoDeContrato",
        header: ({ column }) => (
          <SortableHeader
            label="TIPO DE CONTRATO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "gerenciaOuSecretariaOuAutarquia",
        header: ({ column }) => (
          <SortableHeader
            label="GERENCIA OU SECRETARIA OU AUTARQUIA"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "objeto",
        header: ({ column }) => (
          <SortableHeader
            label="OBJETO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs max-w-[200px] block truncate" title={getValue<string>()}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "localDeExecucaoDoServico",
        header: ({ column }) => (
          <SortableHeader
            label="LOCAL DE EXECUÇÃO DO SERVIÇO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "origemDaDemanda",
        header: ({ column }) => (
          <SortableHeader
            label="ORIGEM DA DEMANDA"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "terminoDoContratoVigente",
        header: ({ column }) => (
          <SortableHeader
            label="TERMINO DO CONTRATO VIGENTE"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: (a, b) =>
          new Date(a.original.terminoDoContratoVigente).getTime() -
          new Date(b.original.terminoDoContratoVigente).getTime(),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "dataDeNecessidadeDeInicioDosServicos",
        header: ({ column }) => (
          <SortableHeader
            label="DATA DE NECESSIDADE DE INICIO DOS SERVIÇOS"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: (a, b) =>
          new Date(a.original.dataDeNecessidadeDeInicioDosServicos).getTime() -
          new Date(b.original.dataDeNecessidadeDeInicioDosServicos).getTime(),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "valorPrevisto",
        header: ({ column }) => (
          <SortableHeader
            label="VALOR PREVISTO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: "basic",
        cell: ({ getValue }) => (
          <span className="text-xs whitespace-nowrap">
            {formatCurrency(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "vigenciaDias",
        header: ({ column }) => (
          <SortableHeader
            label="VIGÊNCIA (DIAS)"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: "basic",
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "contratoInterno",
        header: ({ column }) => (
          <SortableHeader
            label="CONTRATO INTERNO?"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: (a, b) =>
          Number(a.original.contratoInterno) - Number(b.original.contratoInterno),
        cell: ({ getValue }) =>
          getValue<boolean>() ? (
            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">
              SIM
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              NÃO
            </Badge>
          ),
      },
      {
        accessorKey: "efetivoPrevisto",
        header: ({ column }) => (
          <SortableHeader
            label="EFETIVO PREVISTO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        sortingFn: "basic",
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "tipoDeGasto",
        header: ({ column }) => (
          <SortableHeader
            label="TIPO DE GASTO"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "previsaoDeDesembolso2026",
        header: ({ column }) => (
          <SortableHeader
            label="PREVISÃO DE DESEMBOLSO 2026"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs whitespace-nowrap">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "nivelDeAprovacaoDaRC",
        header: ({ column }) => (
          <SortableHeader
            label="NÍVEL DE APROVAÇÃO DA RC"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-xs">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader
            label="STATUS"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "acoes",
        header: () => (
          <span className="text-xs font-semibold">AÇÕES</span>
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const opportunity = row.original
          const canManifest =
            opportunity.status === "OPEN" && !opportunity.alreadyInterested

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => onViewDetails(opportunity)}
              >
                Ver detalhes
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-6 text-xs px-2"
                disabled={!canManifest}
                onClick={() => onManifestInterest(opportunity)}
              >
                {opportunity.alreadyInterested
                  ? "Interesse enviado"
                  : "Manifestar"}
              </Button>
            </div>
          )
        },
      },
    ],
    [onViewDetails, onManifestInterest]
  )
}
