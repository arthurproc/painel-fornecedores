"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MensagensView } from "@/components/handshake/mensagens-view";
import {
  MEMBRO_LOGADO_ID,
  getMembroById,
  membros,
} from "@/lib/mock-data";

export default function MensagensFornecedorPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const orgId = membroLogado?.organizacao_id ?? "";
  const membrosFornecedor = useMemo(
    () => new Set(membros.filter((m) => m.organizacao_id === orgId).map((m) => m.id)),
    [orgId]
  );

  return (
    <AppShell tipo="fornecedor" titulo="Mensagens">
      <MensagensView
        lado="fornecedor"
        filtrarConversa={(conversa) =>
          conversa.fornecedor_membros_ids.some((id) => membrosFornecedor.has(id))
        }
      />
    </AppShell>
  );
}
