import type { PropostaStatus } from "./_shared";

export interface DocumentoAnexo {
  id: string;
  nome: string;
  url?: string;
  tipo_mime?: string;
  enviado_em: string;
  enviado_por_membro_id: string;
}

export interface Proposta {
  id: string;
  candidatura_id: string;

  escopo_detalhado: string;
  cronograma: {
    etapas: { titulo: string; prazo: string; descricao?: string }[];
  };
  preco_final: string;
  prazo_entrega: string;
  documentos_anexos: DocumentoAnexo[];
  observacoes?: string;

  status: PropostaStatus;

  revisada_consultoria: boolean;
  sessao_consultoria_id?: string;

  criada_em: string;
  enviada_em?: string;
  decidida_em?: string;
}

export const propostas: Proposta[] = [
  // Projeto 5 (em_propostas) — 1 rascunho, 1 enviada, 1 retirada
  {
    id: "prop-5-rascunho",
    candidatura_id: "cand-5b",
    escopo_detalhado:
      "Proposta em elaboração — estruturação de PPRA, PCMSO e plano de treinamentos.",
    cronograma: {
      etapas: [
        { titulo: "Diagnóstico inicial", prazo: "10 dias" },
        { titulo: "Elaboração dos programas", prazo: "30 dias" },
        { titulo: "Treinamentos", prazo: "20 dias" },
      ],
    },
    preco_final: "R$ 118.000,00",
    prazo_entrega: "60 dias",
    documentos_anexos: [],
    status: "rascunho",
    revisada_consultoria: false,
    criada_em: "2026-04-09",
  },
  {
    id: "prop-5-enviada",
    candidatura_id: "cand-5a",
    escopo_detalhado:
      "Consultoria completa: revisão de PPRA, PCMSO, treinamentos NR (NR-10, NR-35, NR-11), auditoria de conformidade e elaboração de plano de ação. Equipe fixa durante 90 dias.",
    cronograma: {
      etapas: [
        { titulo: "Kick-off e diagnóstico", prazo: "5 dias" },
        { titulo: "Elaboração dos programas", prazo: "25 dias" },
        { titulo: "Treinamentos presenciais", prazo: "45 dias" },
        { titulo: "Auditoria final", prazo: "15 dias" },
      ],
    },
    preco_final: "R$ 112.000,00",
    prazo_entrega: "90 dias",
    documentos_anexos: [
      {
        id: "doc-prop-5-1",
        nome: "Portfólio de clientes.pdf",
        enviado_em: "2026-04-08",
        enviado_por_membro_id: "mem-segwork-owner",
      },
    ],
    status: "enviada",
    revisada_consultoria: true,
    criada_em: "2026-04-08",
    enviada_em: "2026-04-08",
  },
  {
    id: "prop-5-retirada",
    candidatura_id: "cand-5c",
    escopo_detalhado: "Consultoria parcial focada em NR-35.",
    cronograma: {
      etapas: [{ titulo: "Proposta retirada", prazo: "-" }],
    },
    preco_final: "R$ 95.000,00",
    prazo_entrega: "45 dias",
    documentos_anexos: [],
    observacoes: "Retirada porque a equipe foi realocada para outro contrato.",
    status: "retirada",
    revisada_consultoria: false,
    criada_em: "2026-04-09",
    enviada_em: "2026-04-09",
    decidida_em: "2026-04-12",
  },
  {
    id: "prop-5d-rascunho",
    candidatura_id: "cand-5d",
    escopo_detalhado:
      "Rascunho de proposta formal para fabricação e instalação de proteções metálicas, enclausuramentos e suportes auxiliares do programa de SST.",
    cronograma: {
      etapas: [
        { titulo: "Levantamento em planta", prazo: "5 dias" },
        { titulo: "Fabricação das proteções", prazo: "18 dias" },
        { titulo: "Instalação e ajustes", prazo: "10 dias" },
      ],
    },
    preco_final: "R$ 119.000,00",
    prazo_entrega: "33 dias",
    documentos_anexos: [],
    observacoes: "Aguardando revisão final de escopo com parceiro de engenharia de segurança.",
    status: "rascunho",
    revisada_consultoria: true,
    criada_em: "2026-04-10",
  },
  {
    id: "prop-29-a",
    candidatura_id: "cand-29-a",
    escopo_detalhado:
      "Retrofit completo da rede principal de exaustão com substituição de dutos críticos, balanceamento, comissionamento assistido e relatório final de vazão.",
    cronograma: {
      etapas: [
        { titulo: "Engenharia executiva", prazo: "7 dias" },
        { titulo: "Fabricação dos dutos", prazo: "18 dias" },
        { titulo: "Parada e instalação", prazo: "6 dias" },
      ],
    },
    preco_final: "R$ 284.000,00",
    prazo_entrega: "31 dias",
    documentos_anexos: [],
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-10",
    enviada_em: "2026-04-10",
  },
  {
    id: "prop-29-b",
    candidatura_id: "cand-29-b",
    escopo_detalhado:
      "Pacote integrado de retrofit com ênfase em segurança operacional, balanceamento e atualização dos procedimentos de manutenção preventiva da fundição.",
    cronograma: {
      etapas: [
        { titulo: "Diagnóstico e medições", prazo: "5 dias" },
        { titulo: "Adequações físicas", prazo: "15 dias" },
        { titulo: "Validação e treinamento", prazo: "7 dias" },
      ],
    },
    preco_final: "R$ 268.000,00",
    prazo_entrega: "27 dias",
    documentos_anexos: [],
    status: "enviada",
    revisada_consultoria: true,
    criada_em: "2026-04-11",
    enviada_em: "2026-04-11",
  },
  {
    id: "prop-30-a",
    candidatura_id: "cand-30-a",
    escopo_detalhado:
      "Inspeção estrutural completa da ponte rolante, emissão de laudo, troca de itens críticos e acompanhamento da retomada operacional.",
    cronograma: {
      etapas: [{ titulo: "Execução integral", prazo: "18 dias" }],
    },
    preco_final: "R$ 164.000,00",
    prazo_entrega: "18 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-02-25",
    enviada_em: "2026-02-25",
    decidida_em: "2026-03-01",
  },
  {
    id: "prop-31-a",
    candidatura_id: "cand-31-a",
    escopo_detalhado:
      "Adequação das cabines de pintura com ventilação forçada, revisão de procedimentos e entrega de dossiê de controle ambiental e ocupacional.",
    cronograma: {
      etapas: [{ titulo: "Execução integral", prazo: "22 dias" }],
    },
    preco_final: "R$ 121.000,00",
    prazo_entrega: "22 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-01-27",
    enviada_em: "2026-01-27",
    decidida_em: "2026-02-04",
  },
  {
    id: "prop-ct-18",
    candidatura_id: "cand-ct-18",
    escopo_detalhado:
      "Usinagem seriada de eixos de transmissão com controle dimensional, inspeção final e entrega em lotes programados.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "30 dias" }],
    },
    preco_final: "R$ 42.000,00",
    prazo_entrega: "30 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2025-09-20",
    enviada_em: "2025-09-20",
    decidida_em: "2025-09-26",
  },
  {
    id: "prop-ct-31",
    candidatura_id: "cand-ct-31",
    escopo_detalhado:
      "Fabricação e montagem da plataforma metálica do pátio norte com inspeção de solda e entrega de memorial as built.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "26 dias" }],
    },
    preco_final: "R$ 94.000,00",
    prazo_entrega: "26 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-03-10",
    enviada_em: "2026-03-10",
    decidida_em: "2026-03-15",
  },
  // Contratos fechados — Propostas vencedoras
  {
    id: "prop-ct-7",
    candidatura_id: "cand-ct-7",
    escopo_detalhado:
      "Manutenção preventiva e corretiva de pontes rolantes — inclui lubrificação, troca de cabos, inspeção estrutural e alinhamento de trilhos. Equipe fixa durante 30 dias.",
    cronograma: {
      etapas: [{ titulo: "Execução integral", prazo: "30 dias" }],
    },
    preco_final: "R$ 145.000,00",
    prazo_entrega: "30 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-01-20",
    enviada_em: "2026-01-20",
    decidida_em: "2026-02-02",
  },
  {
    id: "prop-ct-8",
    candidatura_id: "cand-ct-8",
    escopo_detalhado:
      "Coleta, tratamento e destinação ambientalmente adequada dos resíduos industriais gerados no complexo de Itabira.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "20 dias" }],
    },
    preco_final: "R$ 275.000,00",
    prazo_entrega: "20 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-03-01",
    enviada_em: "2026-03-01",
    decidida_em: "2026-03-15",
  },
  {
    id: "prop-ct-9",
    candidatura_id: "cand-ct-9",
    escopo_detalhado:
      "Revisão completa de pontes rolantes, talhas e equipamentos de içamento da planta de João Monlevade.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "12 dias" }],
    },
    preco_final: "R$ 92.000,00",
    prazo_entrega: "12 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2025-12-20",
    enviada_em: "2025-12-20",
    decidida_em: "2026-01-05",
  },
  {
    id: "prop-ct-10",
    candidatura_id: "cand-ct-10",
    escopo_detalhado: "Elaboração do RIMA — Expansão Norte.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "45 dias" }],
    },
    preco_final: "R$ 185.000,00",
    prazo_entrega: "45 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2025-11-30",
    enviada_em: "2025-11-30",
    decidida_em: "2025-12-15",
  },
  {
    id: "prop-ct-11",
    candidatura_id: "cand-ct-11",
    escopo_detalhado:
      "Transporte especializado de equipamentos pesados durante parada geral. Frota dedicada.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "20 dias" }],
    },
    preco_final: "R$ 340.000,00",
    prazo_entrega: "20 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-02-05",
    enviada_em: "2026-02-05",
    decidida_em: "2026-02-20",
  },
  {
    id: "prop-ct-11-perdedora",
    candidatura_id: "cand-ct-11",
    escopo_detalhado:
      "Proposta concorrente para transporte especializado — perdeu por preço.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "25 dias" }],
    },
    preco_final: "R$ 375.000,00",
    prazo_entrega: "25 dias",
    documentos_anexos: [],
    status: "perdedora",
    revisada_consultoria: false,
    criada_em: "2026-02-08",
    enviada_em: "2026-02-08",
    decidida_em: "2026-02-20",
  },
  {
    id: "prop-ct-12",
    candidatura_id: "cand-ct-12",
    escopo_detalhado: "Ampliação do almoxarifado industrial com estrutura metálica e piso industrial.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "60 dias" }],
    },
    preco_final: "R$ 520.000,00",
    prazo_entrega: "60 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2025-12-15",
    enviada_em: "2025-12-15",
    decidida_em: "2026-01-10",
  },
  {
    id: "prop-ct-13",
    candidatura_id: "cand-ct-13",
    escopo_detalhado: "Implantação completa do PGR com inventário de riscos e plano de ação.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "45 dias" }],
    },
    preco_final: "R$ 130.000,00",
    prazo_entrega: "45 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-02-15",
    enviada_em: "2026-02-15",
    decidida_em: "2026-03-01",
  },
  {
    id: "prop-ct-14",
    candidatura_id: "cand-ct-14",
    escopo_detalhado: "Treinamento NR-35 para 120 colaboradores — teórico + prático + certificados.",
    cronograma: {
      etapas: [{ titulo: "Execução", prazo: "15 dias" }],
    },
    preco_final: "R$ 65.000,00",
    prazo_entrega: "15 dias",
    documentos_anexos: [],
    status: "vencedora",
    revisada_consultoria: false,
    criada_em: "2026-02-01",
    enviada_em: "2026-02-01",
    decidida_em: "2026-02-18",
  },
];

export function getPropostaById(id: string): Proposta | undefined {
  return propostas.find((p) => p.id === id);
}

export function getPropostasByCandidatura(candidatura_id: string): Proposta[] {
  return propostas.filter((p) => p.candidatura_id === candidatura_id);
}
