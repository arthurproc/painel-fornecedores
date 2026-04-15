"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MensagensView } from "@/components/handshake/mensagens-view";
import {
  MEMBRO_LOGADO_ID,
  getMembroById,
  membros,
} from "@/lib/mock-data";

export default function MensagensEmpresaPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const orgId = membroLogado?.organizacao_id ?? "";

  const membrosEmpresa = useMemo(
    () => new Set(membros.filter((m) => m.organizacao_id === orgId).map((m) => m.id)),
    [orgId]
  );

  return (
    <AppShell tipo="empresa" titulo="Mensagens">
      <MensagensView
        lado="empresa"
        filtrarConversa={(conversa) =>
          conversa.empresa_membros_ids.some((id) => membrosEmpresa.has(id))
        }
      />
    </AppShell>
  );
}
