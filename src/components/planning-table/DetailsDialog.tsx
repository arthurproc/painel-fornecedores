"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { PlanningOpportunity } from "@/types/opportunity"

interface DetailsDialogProps {
  opportunity: PlanningOpportunity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

export function DetailsDialog({
  opportunity,
  open,
  onOpenChange,
}: DetailsDialogProps) {
  if (!opportunity) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {opportunity.objeto}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="dados-gerais">
          <TabsList className="w-full">
            <TabsTrigger value="dados-gerais" className="flex-1">
              Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex-1">
              Informações Financeiras
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex-1">
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-gerais" className="mt-4 space-y-3">
            <InfoRow label="ENTIDADE OU EMPRESA" value={opportunity.entidadeOuEmpresa} />
            <InfoRow label="TIPO DE AQUISIÇÃO" value={opportunity.tipoDeAquisicao} />
            <InfoRow label="TIPO DE CONTRATO" value={opportunity.tipoDeContrato} />
            <InfoRow
              label="GERENCIA OU SECRETARIA OU AUTARQUIA"
              value={opportunity.gerenciaOuSecretariaOuAutarquia}
            />
            <InfoRow label="OBJETO" value={opportunity.objeto} />
            <InfoRow
              label="LOCAL DE EXECUÇÃO DO SERVIÇO"
              value={opportunity.localDeExecucaoDoServico}
            />
            <InfoRow label="ORIGEM DA DEMANDA" value={opportunity.origemDaDemanda} />
            <InfoRow
              label="TERMINO DO CONTRATO VIGENTE"
              value={opportunity.terminoDoContratoVigente}
            />
            <InfoRow
              label="DATA DE NECESSIDADE DE INICIO DOS SERVIÇOS"
              value={opportunity.dataDeNecessidadeDeInicioDosServicos}
            />
            <InfoRow
              label="CONTRATO INTERNO?"
              value={opportunity.contratoInterno ? "SIM" : "NÃO"}
            />
            <InfoRow label="EFETIVO PREVISTO" value={String(opportunity.efetivoPrevisto)} />
            <InfoRow label="NÍVEL DE APROVAÇÃO DA RC" value={opportunity.nivelDeAprovacaoDaRC} />
          </TabsContent>

          <TabsContent value="financeiro" className="mt-4 space-y-3">
            <InfoRow
              label="VALOR PREVISTO"
              value={formatCurrency(opportunity.valorPrevisto)}
            />
            <InfoRow
              label="VIGÊNCIA (DIAS)"
              value={String(opportunity.vigenciaDias)}
            />
            <InfoRow
              label="PREVISÃO DE DESEMBOLSO 2026"
              value={opportunity.previsaoDeDesembolso2026}
            />
            <InfoRow label="TIPO DE GASTO" value={opportunity.tipoDeGasto} />
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Registro publicado em 02/02/2026</li>
              <li>Em análise interna</li>
              <li>Aguardando manifestações</li>
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
