export interface Conversa {
  id: string;
  projeto_id: string;
  candidatura_id: string;
  empresa_membros_ids: string[];
  fornecedor_membros_ids: string[];
  status: "ativa" | "arquivada" | "encerrada";
  ultima_mensagem_em?: string;
  criada_em: string;
}

export const conversas: Conversa[] = [
  // Projeto 5 (em_propostas) — 3 candidaturas shortlistadas
  {
    id: "conv-5a",
    projeto_id: "5",
    candidatura_id: "cand-5a",
    empresa_membros_ids: ["mem-arcelormittal-owner"],
    fornecedor_membros_ids: ["mem-segwork-owner", "mem-segwork-operador"],
    status: "ativa",
    ultima_mensagem_em: "2026-04-10T10:30:00",
    criada_em: "2026-04-07T09:00:00",
  },
  {
    id: "conv-5b",
    projeto_id: "5",
    candidatura_id: "cand-5b",
    empresa_membros_ids: ["mem-arcelormittal-owner"],
    fornecedor_membros_ids: ["mem-ambiental-owner"],
    status: "ativa",
    ultima_mensagem_em: "2026-04-09T14:15:00",
    criada_em: "2026-04-08T09:15:00",
  },
  {
    id: "conv-5c",
    projeto_id: "5",
    candidatura_id: "cand-5c",
    empresa_membros_ids: ["mem-arcelormittal-owner"],
    fornecedor_membros_ids: ["mem-techminas-owner"],
    status: "arquivada",
    ultima_mensagem_em: "2026-04-12T11:00:00",
    criada_em: "2026-04-08T10:00:00",
  },
  // Contratos encerrados — conversas encerradas
  {
    id: "conv-ct-7",
    projeto_id: "7",
    candidatura_id: "cand-ct-7",
    empresa_membros_ids: ["mem-vale-admin"],
    fornecedor_membros_ids: ["mem-techminas-owner"],
    status: "encerrada",
    ultima_mensagem_em: "2026-03-12T17:00:00",
    criada_em: "2026-01-28T09:00:00",
  },
  {
    id: "conv-ct-9",
    projeto_id: "9",
    candidatura_id: "cand-ct-9",
    empresa_membros_ids: ["mem-usiminas-owner"],
    fornecedor_membros_ids: ["mem-techminas-owner"],
    status: "ativa",
    ultima_mensagem_em: "2026-04-08T09:45:00",
    criada_em: "2026-01-05T11:00:00",
  },
  {
    id: "conv-5d",
    projeto_id: "5",
    candidatura_id: "cand-5d",
    empresa_membros_ids: ["mem-arcelormittal-owner"],
    fornecedor_membros_ids: ["mem-metalurgica-xyz-admin", "mem-metalurgica-xyz-operador"],
    status: "ativa",
    ultima_mensagem_em: "2026-04-15T09:10:00",
    criada_em: "2026-04-09T14:00:00",
  },
  {
    id: "conv-29-a",
    projeto_id: "29",
    candidatura_id: "cand-29-a",
    empresa_membros_ids: ["mem-metalurgica-xyz-admin", "mem-metalurgica-xyz-owner"],
    fornecedor_membros_ids: ["mem-techminas-owner"],
    status: "ativa",
    ultima_mensagem_em: "2026-04-15T08:40:00",
    criada_em: "2026-04-10T09:20:00",
  },
];

export function getConversaById(id: string): Conversa | undefined {
  return conversas.find((c) => c.id === id);
}

export function getConversaByCandidatura(candidatura_id: string): Conversa | undefined {
  return conversas.find((c) => c.candidatura_id === candidatura_id);
}
