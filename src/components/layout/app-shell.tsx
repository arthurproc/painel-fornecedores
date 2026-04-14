"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  tipo: "empresa" | "fornecedor";
  titulo: string;
  children: React.ReactNode;
}

export function AppShell({ tipo, titulo, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar tipo={tipo} />
      <div className="flex-1 flex flex-col">
        <Topbar titulo={titulo} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
