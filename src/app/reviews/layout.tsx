"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import {
  MEMBRO_LOGADO_ID,
  getEmpresaByOrganizacao,
  getFornecedorByOrganizacao,
  getMembroById,
} from "@/lib/mock-data";

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresa = getEmpresaByOrganizacao(membroLogado?.organizacao_id ?? "");
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const tipo: "empresa" | "fornecedor" = empresa && !fornecedor
    ? "empresa"
    : fornecedor && !empresa
      ? "fornecedor"
      : (membroLogado?.ultimo_contexto_usado ?? "fornecedor");

  const titulo = pathname.includes("/novo/")
    ? "Escrever review"
    : pathname.match(/^\/reviews\/[^/]+$/)
      ? "Detalhe da review"
      : "Reviews";

  return (
    <AppShell tipo={tipo} titulo={titulo}>
      <div className="mx-auto max-w-4xl">{children}</div>
    </AppShell>
  );
}
