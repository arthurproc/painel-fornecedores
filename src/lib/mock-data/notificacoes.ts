import type { Severidade } from "./_shared";

export interface TriggerDef {
  severidade: Severidade;
  grupo_preferencia: string;
  agrupavel: boolean;
  descricao: string;
}

export const TRIGGER_CATALOG: Record<string, TriggerDef> = {
  // Empresa (E1-E11)
  E1: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Contrato fechado" },
  E2: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: true, descricao: "Nova candidatura recebida" },
  E3: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: true, descricao: "Nova proposta recebida" },
  E4: { severidade: "importante", grupo_preferencia: "importantes_comunicacao", agrupavel: true, descricao: "Nova mensagem de fornecedor" },
  E5: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: false, descricao: "Candidatura shortlistada requer próximo passo" },
  E6: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Candidatura expirou" },
  E7: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Review recebido após encerramento" },
  E8: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Novo membro na organização" },
  E9: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Alteração de role de membro" },
  E10: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: false, descricao: "Lembrete: candidatura aguarda decisão há 30 dias" },
  E11: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Atualização da identidade legal" },

  // Fornecedor (F1-F14)
  F1: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Candidatura shortlistada" },
  F2: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Candidatura descartada" },
  F3: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Contrato aceito" },
  F4: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Pedido de proposta formal" },
  F5: { severidade: "importante", grupo_preferencia: "importantes_comunicacao", agrupavel: true, descricao: "Nova mensagem da empresa" },
  F6: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Oferta de outreach recebida" },
  F7: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: true, descricao: "Comentário novo em sessão de consultoria" },
  F8: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: true, descricao: "Projeto compatível publicado" },
  F9: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: true, descricao: "Lead identificado" },
  F10: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Outcome observado" },
  F11: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Lembrete: candidatura aberta há 25d" },
  F12: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Novo membro no tenant" },
  F13: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Alteração de role" },
  F14: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Review recebido" },

  // Consultoria — para fornecedor (C1-C5)
  C1: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão atribuída" },
  C2: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão entregue" },
  C3: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Novo comentário do advisor" },
  C4: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Estudo de caso publicado" },
  C5: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Atualização no catálogo" },

  // Owner / Admin Consultoria (O1-O6)
  O1: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: true, descricao: "Nova sessão na fila" },
  O2: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "NPS baixo reportado" },
  O3: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Oferta de outreach aceita" },
  O4: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: true, descricao: "Novo lead identificado" },
  O5: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Sessão sem atribuição há 12h" },
  O6: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Advisor solicitou revisão de estudo" },

  // Sistema (X1-X4)
  X1: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Falha de envio de email" },
  X2: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Backup concluído" },
  X3: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Erro em processamento de contrato" },
  X4: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Manutenção programada" },
};

export interface Notificacao {
  id: string;
  destinatario_membro_id: string;
  tipo: string;
  severidade: Severidade;
  titulo: string;
  corpo?: string;
  acao_url: string;
  contexto_ref?: {
    entidade:
      | "projeto"
      | "candidatura"
      | "proposta"
      | "contrato"
      | "conversa"
      | "sessao_consultoria"
      | "review"
      | "membro"
      | "organizacao";
    id: string;
  };
  canais_enviados: ("in_app" | "email")[];
  canais_confirmados: ("in_app" | "email")[];
  lida: boolean;
  lida_em?: string;
  arquivada: boolean;
  agrupamento_chave?: string;
  agrupamento_count?: number;
  criada_em: string;
}

export const notificacoes: Notificacao[] = [
  // Críticas
  {
    id: "notif-1",
    destinatario_membro_id: "mem-segwork-owner",
    tipo: "F1",
    severidade: "critica",
    titulo: "Sua candidatura foi shortlistada pela ArcelorMittal",
    corpo: "Projeto: Consultoria em Segurança do Trabalho",
    acao_url: "/fornecedor/candidaturas/cand-5a",
    contexto_ref: { entidade: "candidatura", id: "cand-5a" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-07T09:00:00",
  },
  {
    id: "notif-2",
    destinatario_membro_id: "mem-techminas-owner",
    tipo: "F3",
    severidade: "critica",
    titulo: "Contrato aceito pela Vale S.A.",
    corpo: "Projeto 7 — Manutenção de Pontes Rolantes",
    acao_url: "/fornecedor/contratos/ct-7",
    contexto_ref: { entidade: "contrato", id: "ct-7" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: true,
    lida_em: "2026-02-02T10:00:00",
    arquivada: false,
    criada_em: "2026-02-02T09:00:00",
  },
  // Importantes
  {
    id: "notif-3",
    destinatario_membro_id: "mem-vale-admin",
    tipo: "E2",
    severidade: "importante",
    titulo: "2 novas candidaturas recebidas",
    corpo: "Projeto 1 — Manutenção Preventiva de Correias",
    acao_url: "/empresa/projeto/1",
    contexto_ref: { entidade: "projeto", id: "1" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "E2:projeto:1",
    agrupamento_count: 2,
    criada_em: "2026-04-11T14:00:00",
  },
  {
    id: "notif-4",
    destinatario_membro_id: "mem-arcelormittal-owner",
    tipo: "E4",
    severidade: "importante",
    titulo: "3 mensagens novas de fornecedores shortlistados",
    corpo: "Projeto 5 — Consultoria em SST",
    acao_url: "/empresa/projeto/5/mensagens",
    contexto_ref: { entidade: "projeto", id: "5" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "E4:projeto:5",
    agrupamento_count: 3,
    criada_em: "2026-04-10T11:00:00",
  },
  {
    id: "notif-5",
    destinatario_membro_id: "mem-ambiental-owner",
    tipo: "F6",
    severidade: "importante",
    titulo: "Nova oferta da Consultoria",
    corpo: "Acompanhamento completo sugerido pelo Celso",
    acao_url: "/fornecedor/consultoria/ofertas/oft-2",
    contexto_ref: { entidade: "sessao_consultoria", id: "oft-2" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: true,
    lida_em: "2026-04-09T10:00:00",
    arquivada: false,
    criada_em: "2026-04-08T09:00:00",
  },
  {
    id: "notif-6",
    destinatario_membro_id: "adv-celso",
    tipo: "O1",
    severidade: "importante",
    titulo: "2 sessões novas na fila",
    corpo: "Aguardando atribuição",
    acao_url: "/admin/sessoes",
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "O1:fila",
    agrupamento_count: 2,
    criada_em: "2026-04-12T08:00:00",
  },
  // Informativas
  {
    id: "notif-7",
    destinatario_membro_id: "mem-segwork-owner",
    tipo: "F8",
    severidade: "informativa",
    titulo: "Projeto compatível publicado",
    corpo: "Projeto 4 — Reforma de Refeitório Industrial (Usiminas)",
    acao_url: "/fornecedor/projeto/4",
    contexto_ref: { entidade: "projeto", id: "4" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-12T09:00:00",
  },
  {
    id: "notif-8",
    destinatario_membro_id: "mem-translog-owner",
    tipo: "F10",
    severidade: "informativa",
    titulo: "Candidatura expirou",
    corpo: "Projeto 2 — Monitoramento Ambiental (45 dias sem decisão)",
    acao_url: "/fornecedor/candidaturas/cand-expirada",
    contexto_ref: { entidade: "candidatura", id: "cand-expirada" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: true,
    lida_em: "2026-04-07T08:00:00",
    arquivada: false,
    criada_em: "2026-04-06T09:00:00",
  },
  {
    id: "notif-9",
    destinatario_membro_id: "mem-techminas-owner",
    tipo: "C4",
    severidade: "informativa",
    titulo: "Novo estudo de caso publicado",
    corpo: "Como uma manutenção preventiva bem precificada venceu 3 concorrentes",
    acao_url: "/fornecedor/consultoria/estudos/ec-1",
    contexto_ref: { entidade: "sessao_consultoria", id: "ec-1" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    criada_em: "2026-02-20T10:00:00",
  },
];

export function getNotificacoesPorMembro(
  membro_id: string,
  opts: { apenasNaoLidas?: boolean } = {}
): Notificacao[] {
  return notificacoes.filter((n) => {
    if (n.destinatario_membro_id !== membro_id) return false;
    if (opts.apenasNaoLidas && n.lida) return false;
    return true;
  });
}
