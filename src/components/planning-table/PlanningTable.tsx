"use client"

import { useState, useMemo, useCallback } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlanningOpportunity } from "@/types/opportunity"
import { planningMockData } from "@/data/planning-mock"
import { usePlanningColumns } from "./PlanningColumns"
import { PlanningFilters, PlanningFiltersState } from "./PlanningFilters"
import { DetailsDialog } from "./DetailsDialog"
import { InterestDialog } from "./InterestDialog"

const initialFilters: PlanningFiltersState = {
  empresa: "",
  local: "",
  dataInicio: "",
  dataFim: "",
  objeto: "",
}

export function PlanningTable() {
  const [data, setData] = useState<PlanningOpportunity[]>(planningMockData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<PlanningFiltersState>(initialFilters)

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<PlanningOpportunity | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [interestOpen, setInterestOpen] = useState(false)
  const [interestTarget, setInterestTarget] =
    useState<PlanningOpportunity | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const empresaOptions = useMemo(
    () => [...new Set(planningMockData.map((d) => d.entidadeOuEmpresa))].sort(),
    []
  )
  const localOptions = useMemo(
    () =>
      [...new Set(planningMockData.map((d) => d.localDeExecucaoDoServico))].sort(),
    []
  )

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filters.empresa && row.entidadeOuEmpresa !== filters.empresa) return false
      if (filters.local && row.localDeExecucaoDoServico !== filters.local) return false
      if (filters.objeto && !row.objeto.toLowerCase().includes(filters.objeto.toLowerCase()))
        return false
      if (filters.dataInicio) {
        const rowDate = new Date(row.dataDeNecessidadeDeInicioDosServicos)
        const from = new Date(filters.dataInicio)
        if (rowDate < from) return false
      }
      if (filters.dataFim) {
        const rowDate = new Date(row.dataDeNecessidadeDeInicioDosServicos)
        const to = new Date(filters.dataFim)
        if (rowDate > to) return false
      }
      return true
    })
  }, [data, filters])

  const handleViewDetails = useCallback((opportunity: PlanningOpportunity) => {
    setSelectedOpportunity(opportunity)
    setDetailsOpen(true)
  }, [])

  const handleManifestInterest = useCallback(
    (opportunity: PlanningOpportunity) => {
      setInterestTarget(opportunity)
      setInterestOpen(true)
    },
    []
  )

  const handleInterestSubmit = useCallback(
    (_message: string) => {
      if (!interestTarget) return
      setData((prev) =>
        prev.map((item) =>
          item.id === interestTarget.id
            ? { ...item, alreadyInterested: true }
            : item
        )
      )
      setInterestOpen(false)
      setInterestTarget(null)
      setSuccessMessage("Interesse manifestado com sucesso!")
      setTimeout(() => setSuccessMessage(null), 4000)
    },
    [interestTarget]
  )

  const columns = usePlanningColumns({
    onViewDetails: handleViewDetails,
    onManifestInterest: handleManifestInterest,
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-2xl font-bold text-center">Serviços e compras</h1>

      {successMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2">
          {successMessage}
        </div>
      )}

      <PlanningFilters
        filters={filters}
        onFilterChange={setFilters}
        empresaOptions={empresaOptions}
        localOptions={localOptions}
      />

      <div className="overflow-x-auto rounded-md border">
        <Table className="text-xs min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-blue-100 hover:bg-blue-100"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-blue-900 whitespace-normal px-2 py-2 min-w-[100px]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-1.5 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DetailsDialog
        opportunity={selectedOpportunity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <InterestDialog
        open={interestOpen}
        onOpenChange={setInterestOpen}
        onSubmit={handleInterestSubmit}
      />
    </div>
  )
}
