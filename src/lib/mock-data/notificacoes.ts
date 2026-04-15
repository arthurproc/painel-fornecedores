import type { Severidade } from "./_shared";

export interface TriggerDef {
  severidade: Severidade;
  grupo_preferencia: string;
  agrupavel: boolean;
  descricao: string;
}

export const TRIGGER_CATALOG: Record<string, TriggerDef> = {
  // Empresa (E1-E11)
  E1: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: true, descricao: "Nova candidatura recebida" },
  E2: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Projeto atingiu 5 candidaturas" },
  E3: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: false, descricao: "Candidatura aguardando decisão há 30 dias" },
  E4: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Candidatura expirada" },
  E5: { severidade: "importante", grupo_preferencia: "importantes_comunicacao", agrupavel: true, descricao: "Nova mensagem em conversa ativa" },
  E6: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Nova proposta formal recebida" },
  E7: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Contrato fechado" },
  E8: { severidade: "importante", grupo_preferencia: "importantes_empresa", agrupavel: false, descricao: "Contrato encerrado aguardando avaliação" },
  E9: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Avaliação liberada" },
  E10: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Novo membro aceitou convite" },
  E11: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Perfil fornecedor ativado" },

  // Fornecedor (F1-F14)
  F1: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Candidatura selecionada para proposta" },
  F2: { severidade: "importante", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Candidatura descartada" },
  F3: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Empresa pediu proposta formal" },
  F4: { severidade: "importante", grupo_preferencia: "importantes_comunicacao", agrupavel: true, descricao: "Nova mensagem da empresa" },
  F5: { severidade: "critica", grupo_preferencia: "criticas_handshake", agrupavel: false, descricao: "Proposta vencedora" },
  F6: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Proposta não selecionada" },
  F7: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Contrato encerrado aguardando avaliação" },
  F8: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Avaliação da empresa liberada" },
  F9: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: true, descricao: "Novo projeto compatível" },
  F10: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Candidatura aguardando há 15 dias" },
  F11: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Oferta de outreach recebida" },
  F12: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão de Consultoria atribuída" },
  F13: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão de Consultoria entregue" },
  F14: { severidade: "importante", grupo_preferencia: "importantes_fornecedor", agrupavel: false, descricao: "Consultor comentou em entregável" },

  // Consultoria — para fornecedor (C1-C5)
  C1: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão atribuída" },
  C2: { severidade: "critica", grupo_preferencia: "criticas_consultoria", agrupavel: false, descricao: "Sessão vencendo em 6h" },
  C3: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Fornecedor comentou em entregável" },
  C4: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Sessão avaliada" },
  C5: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Outcome observado" },

  // Owner / Admin Consultoria (O1-O6)
  O1: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Sessões aguardando atribuição" },
  O2: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: true, descricao: "Lead de outreach identificado" },
  O3: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Oferta de outreach aceita" },
  O4: { severidade: "informativa", grupo_preferencia: "informativas_descoberta", agrupavel: false, descricao: "Meta mensal de receita atingida" },
  O5: { severidade: "importante", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Sessão sem atribuição há 12h" },
  O6: { severidade: "informativa", grupo_preferencia: "informativas_conteudo", agrupavel: false, descricao: "Estudo de caso publicado" },

  // Sistema (X1-X4)
  X1: { severidade: "critica", grupo_preferencia: "importantes_admin", agrupavel: false, descricao: "Convite para ser membro" },
  X2: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Identidade legal da organização alterada" },
  X3: { severidade: "importante", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Role do membro alterado" },
  X4: { severidade: "informativa", grupo_preferencia: "informativas_tenant", agrupavel: false, descricao: "Membro desativado" },
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
    titulo: "Sua candidatura foi selecionada para proposta pela ArcelorMittal",
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
    titulo: "3 mensagens novas de fornecedores selecionados para proposta",
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
  {
    id: "notif-10",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E5",
    severidade: "importante",
    titulo: "Nova mensagem de fornecedor em **Retrofit do Sistema de Exaustão da Fundição**",
    corpo: "Retrofit do Sistema de Exaustão da Fundição",
    acao_url: "/empresa/mensagens",
    contexto_ref: { entidade: "conversa", id: "conv-29-a" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "mensagem:conv-29-a",
    criada_em: "2026-04-15T10:10:00",
  },
  {
    id: "notif-11",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E5",
    severidade: "importante",
    titulo: "Nova mensagem de fornecedor em **Retrofit do Sistema de Exaustão da Fundição**",
    corpo: "Retrofit do Sistema de Exaustão da Fundição",
    acao_url: "/empresa/mensagens",
    contexto_ref: { entidade: "conversa", id: "conv-29-a" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "mensagem:conv-29-a",
    criada_em: "2026-04-15T09:35:00",
  },
  {
    id: "notif-12",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E5",
    severidade: "importante",
    titulo: "Nova mensagem de fornecedor em **Retrofit do Sistema de Exaustão da Fundição**",
    corpo: "Retrofit do Sistema de Exaustão da Fundição",
    acao_url: "/empresa/mensagens",
    contexto_ref: { entidade: "conversa", id: "conv-29-a" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    agrupamento_chave: "mensagem:conv-29-a",
    criada_em: "2026-04-15T08:55:00",
  },
  {
    id: "notif-13",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E1",
    severidade: "importante",
    titulo: "Nova candidatura em **Manutenção Preventiva de Fornos de Indução**",
    corpo: "TechMinas enviou material técnico completo para triagem.",
    acao_url: "/empresa/projeto/18/triagem",
    contexto_ref: { entidade: "projeto", id: "18" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-15T07:40:00",
  },
  {
    id: "notif-14",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E8",
    severidade: "importante",
    titulo: "Contrato encerrado com **Ambiental Solutions**. Avalie em 14 dias.",
    corpo: "A avaliação do contrato ct-30 ajuda a fortalecer o histórico de parceria da sua organização.",
    acao_url: "/reviews/novo/ct-30",
    contexto_ref: { entidade: "contrato", id: "ct-30" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-14T18:15:00",
  },
  {
    id: "notif-15",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E11",
    severidade: "informativa",
    titulo: "Perfil fornecedor ativado. Configure o perfil público.",
    corpo: "Sua organização agora pode concorrer em oportunidades como fornecedora.",
    acao_url: "/configuracoes",
    contexto_ref: { entidade: "organizacao", id: "org-metalurgica-xyz" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-13T16:00:00",
  },
  {
    id: "notif-16",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "F9",
    severidade: "informativa",
    titulo: "Novo projeto compatível: **Manutenção Preventiva de Correias Transportadoras**",
    corpo: "Fit alto para o perfil fornecedor da Metalúrgica XYZ.",
    acao_url: "/fornecedor/projeto/1",
    contexto_ref: { entidade: "projeto", id: "1" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-12T10:20:00",
  },
  {
    id: "notif-17",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "F3",
    severidade: "critica",
    titulo: "**ArcelorMittal** solicitou proposta formal em **Consultoria em SST**",
    corpo: "Abra o formulário e envie a proposta formal desta seleção para proposta.",
    acao_url: "/fornecedor/proposta/cand-5d",
    contexto_ref: { entidade: "candidatura", id: "cand-5d" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-11T11:10:00",
  },
  {
    id: "notif-18",
    destinatario_membro_id: "mem-metalurgica-xyz-admin",
    tipo: "E10",
    severidade: "informativa",
    titulo: "**Marina Queiroz** entrou na organização",
    corpo: "Novo membro do time comercial já pode acompanhar os projetos ativos.",
    acao_url: "/configuracoes",
    contexto_ref: { entidade: "membro", id: "mem-metalurgica-xyz-operador" },
    canais_enviados: ["in_app"],
    canais_confirmados: ["in_app"],
    lida: true,
    lida_em: "2026-01-11T08:30:00",
    arquivada: false,
    criada_em: "2026-01-10T09:00:00",
  },
  {
    id: "notif-19",
    destinatario_membro_id: "adv-celso",
    tipo: "C1",
    severidade: "critica",
    titulo: "Nova sessão atribuída: **Revisão de Proposta** para **TechMinas**",
    corpo: "Abra a área de trabalho para começar a estruturar os entregáveis.",
    acao_url: "/admin/sessoes/sess-5",
    contexto_ref: { entidade: "sessao_consultoria", id: "sess-5" },
    canais_enviados: ["in_app", "email"],
    canais_confirmados: ["in_app", "email"],
    lida: false,
    arquivada: false,
    criada_em: "2026-04-15T07:15:00",
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
