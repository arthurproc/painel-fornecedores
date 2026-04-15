"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export type AppShellTipo = "empresa" | "fornecedor" | "admin";

interface AppShellProps {
  tipo: AppShellTipo;
  titulo: string;
  children: React.ReactNode;
}

export function AppShell({ tipo, titulo, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar tipo={tipo} />
      <div className="flex-1 flex flex-col">
        <Topbar tipo={tipo} />
        <main className="flex-1 p-6" data-page-title={titulo}>
          {children}
        </main>
      </div>
    </div>
  );
}
