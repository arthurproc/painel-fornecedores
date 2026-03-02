import { Suspense } from "react";
import { AppTopbar } from "@/components/app-topbar";
import { PlanningTable } from "@/components/planning-table/PlanningTable";

const tabs = [
  { label: "Visão Geral", value: "visao-geral" },
  { label: "Catálogo", value: "catalogo" },
  { label: "Relatórios", value: "relatorios" },
];

export default function FornecedorDashboardPage() {
  return (
    <>
      <Suspense>
        <AppTopbar tabs={tabs} />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-auto">
        <PlanningTable />
      </div>
    </>
  );
}
