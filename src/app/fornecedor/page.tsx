import { Suspense } from "react";
import { AppTopbar } from "@/components/app-topbar";

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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <span className="text-4xl">🏪</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard do Fornecedor
        </h1>
        <p className="text-center text-sm">
          Bem-vindo ao seu painel. Em breve, seus dados aparecerão aqui.
        </p>
      </div>
    </>
  );
}
