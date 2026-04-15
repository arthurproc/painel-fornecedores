import type { SessaoConsultoriaStatus } from "./_shared";

export interface Advisor {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  bio: string;
  role: "owner" | "advisor";
  especializacoes: { categoria: string; regiao?: string }[];
  carga_simultanea_max?: number;
  avaliacao_media?: number;
  ativo: boolean;
  desde: string;
}

export const advisors: Advisor[] = [
  {
    id: "adv-celso",
    nome: "Celso Marinho",
    email: "celso@conectafornece.com.br",
    bio:
      "Fundador da ConectaFornece. 20+ anos em operações de compras em mineração e siderurgia na região de Itabira.",
    role: "owner",
    especializacoes: [
      { categoria: "Manutenção Industrial" },
      { categoria: "Serviços Ambientais" },
    ],
    carga_simultanea_max: 8,
    avaliacao_media: 4.9,
    ativo: true,
    desde: "2025-06-01",
  },
  {
    id: "adv-ana",
    nome: "Ana Mendes",
    email: "ana@conectafornece.com.br",
    bio:
      "Consultora sênior em segurança do trabalho e licenciamento ambiental. Ex-ArcelorMittal.",
    role: "advisor",
    especializacoes: [
      { categoria: "Segurança do Trabalho", regiao: "João Monlevade - MG" },
      { categoria: "Serviços Ambientais" },
    ],
    carga_simultanea_max: 6,
    avaliacao_media: 4.8,
    ativo: true,
    desde: "2025-08-15",
  },
  {
    id: "adv-bruno",
    nome: "Bruno Lima",
    email: "bruno@conectafornece.com.br",
    bio: "Especialista em logística industrial e fornecimento de EPIs. 12 anos na Vale.",
    role: "advisor",
    especializacoes: [
      { categoria: "Transporte e Logística" },
      { categoria: "Manutenção Industrial", regiao: "Itabira - MG" },
    ],
    carga_simultanea_max: 6,
    avaliacao_media: 4.7,
    ativo: true,
    desde: "2025-09-10",
  },
];

export interface CatalogoConsultoria {
  id: string;
  tipo:
    | "revisao_candidatura"
    | "revisao_proposta"
    | "acompanhamento_completo"
    | "retorno_pos_descarte";
  nome: string;
  descricao: string;
  preco_modelo: "fixo" | "success_fee" | "hibrido";
  preco_valor?: string;
  preco_observacao?: string;
  prazo_entrega_estimado: string;
  ativo: boolean;
}

export const catalogoConsultoria: CatalogoConsultoria[] = [
  {
    id: "cat-revisao-candidatura",
    tipo: "revisao_candidatura",
    nome: "Revisão de Candidatura",
    descricao: "Revisão técnica e estratégica do pitch de candidatura antes do envio.",
    preco_modelo: "fixo",
    preco_valor: "R$ 450,00",
    prazo_entrega_estimado: "24-48h",
    ativo: true,
  },
  {
    id: "cat-revisao-proposta",
    tipo: "revisao_proposta",
    nome: "Revisão de Proposta Formal",
    descricao:
      "Estruturação de escopo, cronograma e precificação da proposta formal para maximizar taxa de conversão.",
    preco_modelo: "fixo",
    preco_valor: "R$ 1.200,00",
    prazo_entrega_estimado: "48h",
    ativo: true,
  },
  {
    id: "cat-acompanhamento",
    tipo: "acompanhamento_completo",
    nome: "Acompanhamento Completo",
    descricao:
      "Pacote bundled cobrindo Candidatura + Proposta de uma mesma oportunidade, com advisor dedicado.",
    preco_modelo: "hibrido",
    preco_valor: "R$ 1.500,00 + success fee",
    preco_observacao:
      "R$ 1.500 adiantado + 3% do valor do contrato fechado em caso de sucesso.",
    prazo_entrega_estimado: "durante todo o ciclo",
    ativo: true,
  },
  {
    id: "cat-retorno-descarte",
    tipo: "retorno_pos_descarte",
    nome: "Retorno pós-descarte",
    descricao:
      "Análise do motivo do descarte + plano de ação para próximas candidaturas no setor.",
    preco_modelo: "fixo",
    preco_valor: "R$ 300,00",
    prazo_entrega_estimado: "72h",
    ativo: true,
  },
];

export interface SessaoConsultoria {
  id: string;
  catalogo_id: string;
  tipo:
    | "revisao_candidatura"
    | "revisao_proposta"
    | "acompanhamento_completo"
    | "retorno_pos_descarte";
  fornecedor_id: string;
  solicitante_membro_id: string;
  candidatura_id?: string;
  proposta_id?: string;
  advisor_id?: string;
  contexto_extra?: string;
  status: SessaoConsultoriaStatus;
  preco_snapshot: string;
  entregaveis: {
    tipo: "notas" | "estudo_caso" | "sessao_video" | "outro";
    fase?: "candidatura" | "proposta";
    conteudo: string;
    criado_em: string;
  }[];
  solicitada_em: string;
  atribuida_em?: string;
  entregue_em?: string;
  comentarios_fornecedor?: {
    autor_membro_id: string;
    conteudo: string;
    referencia_entregavel_idx?: number;
    enviado_em: string;
  }[];
  marcado_util?: boolean;
  avaliacao_atendimento?: { nota: 1 | 2 | 3 | 4 | 5; comentario?: string; criada_em: string };
  outcome?: {
    tipo:
      | "candidatura_shortlist"
      | "candidatura_descartada"
      | "proposta_venceu"
      | "proposta_perdeu"
      | "pendente";
    observado_em?: string;
  };
}

export const sessoesConsultoria: SessaoConsultoria[] = [
  {
    id: "sess-1",
    catalogo_id: "cat-revisao-candidatura",
    tipo: "revisao_candidatura",
    fornecedor_id: "2",
    solicitante_membro_id: "mem-ambiental-owner",
    candidatura_id: "cand-3",
    status: "solicitada",
    preco_snapshot: "R$ 450,00",
    entregaveis: [],
    solicitada_em: "2026-04-09",
  },
  {
    id: "sess-2",
    catalogo_id: "cat-revisao-candidatura",
    tipo: "revisao_candidatura",
    fornecedor_id: "5",
    solicitante_membro_id: "mem-segwork-owner",
    candidatura_id: "cand-2",
    advisor_id: "adv-ana",
    status: "atribuida",
    preco_snapshot: "R$ 450,00",
    entregaveis: [],
    solicitada_em: "2026-04-11",
    atribuida_em: "2026-04-11",
  },
  {
    id: "sess-3",
    catalogo_id: "cat-revisao-proposta",
    tipo: "revisao_proposta",
    fornecedor_id: "5",
    solicitante_membro_id: "mem-segwork-owner",
    candidatura_id: "cand-5a",
    proposta_id: "prop-5-enviada",
    advisor_id: "adv-ana",
    status: "em_andamento",
    preco_snapshot: "R$ 1.200,00",
    entregaveis: [
      {
        tipo: "notas",
        fase: "proposta",
        conteudo:
          "Rascunho de revisão enviado — reforçar diferenciais de pós-venda e acrescentar case ArcelorMittal.",
        criado_em: "2026-04-08",
      },
    ],
    solicitada_em: "2026-04-07",
    atribuida_em: "2026-04-07",
  },
  {
    id: "sess-4",
    catalogo_id: "cat-acompanhamento",
    tipo: "acompanhamento_completo",
    fornecedor_id: "4",
    solicitante_membro_id: "mem-construminas-owner",
    candidatura_id: "cand-5",
    advisor_id: "adv-bruno",
    status: "em_andamento",
    preco_snapshot: "R$ 1.500,00 + success fee",
    entregaveis: [
      {
        tipo: "notas",
        fase: "candidatura",
        conteudo: "Pitch revisado + sugestão de 3 diferenciais-chave para obra ANVISA.",
        criado_em: "2026-04-13",
      },
    ],
    solicitada_em: "2026-04-12",
    atribuida_em: "2026-04-12",
  },
  {
    id: "sess-5",
    catalogo_id: "cat-revisao-proposta",
    tipo: "revisao_proposta",
    fornecedor_id: "1",
    solicitante_membro_id: "mem-techminas-owner",
    candidatura_id: "cand-ct-7",
    proposta_id: "prop-ct-7",
    advisor_id: "adv-celso",
    status: "entregue",
    preco_snapshot: "R$ 1.200,00",
    entregaveis: [
      {
        tipo: "estudo_caso",
        fase: "proposta",
        conteudo: "Entregue — proposta vencedora, contrato ct-7 fechado em 14/02.",
        criado_em: "2026-01-25",
      },
    ],
    comentarios_fornecedor: [
      {
        autor_membro_id: "mem-techminas-owner",
        conteudo: "Excelente material. Ajudou muito a estruturar o cronograma.",
        enviado_em: "2026-01-28",
      },
    ],
    marcado_util: true,
    avaliacao_atendimento: {
      nota: 5,
      comentario: "Advisor muito experiente, feedback cirúrgico.",
      criada_em: "2026-03-16",
    },
    outcome: { tipo: "proposta_venceu", observado_em: "2026-02-02" },
    solicitada_em: "2026-01-22",
    atribuida_em: "2026-01-22",
    entregue_em: "2026-01-25",
  },
  {
    id: "sess-6",
    catalogo_id: "cat-retorno-descarte",
    tipo: "retorno_pos_descarte",
    fornecedor_id: "6",
    solicitante_membro_id: "mem-metalurgica-xyz-admin",
    candidatura_id: "cand-descartada",
    advisor_id: "adv-bruno",
    status: "cancelada",
    preco_snapshot: "R$ 300,00",
    entregaveis: [],
    solicitada_em: "2026-04-09",
  },
];

export interface EstudoDeCaso {
  id: string;
  titulo: string;
  resumo: string;
  contrato_id_origem: string;
  contexto: {
    categoria: string;
    regiao: string;
    porte_fornecedor: "pequeno" | "medio" | "grande";
    porte_empresa: "pequeno" | "medio" | "grande";
  };
  corpo: string;
  aprendizados: string[];
  anonimizacao: {
    fornecedor: "identificado" | "anonimo";
    empresa: "identificado" | "anonimo";
  };
  autor_advisor_id: string;
  publicado_em: string;
  destaque: boolean;
  visivel_para: "fornecedores_logados" | "todos_publico";
}

export const estudosDeCaso: EstudoDeCaso[] = [
  {
    id: "ec-1",
    titulo: "Como uma manutenção preventiva bem precificada venceu 3 concorrentes",
    resumo:
      "TechMinas fechou contrato de R$ 145.000 com a Vale após revisão de proposta pela Consultoria.",
    contrato_id_origem: "ct-7",
    contexto: {
      categoria: "Manutenção Industrial",
      regiao: "Itabira - MG",
      porte_fornecedor: "medio",
      porte_empresa: "grande",
    },
    corpo:
      "A TechMinas procurou a Consultoria antes de enviar a proposta formal. Nossa análise destacou 3 diferenciais da empresa que não apareciam no pitch original: time certificado NR-22, tempo médio de mobilização, e caso anterior em mineração de minério. Ao incluir essas referências em forma de marcos do cronograma, a proposta ganhou credibilidade técnica e justificou o preço acima do concorrente mais barato.",
    aprendizados: [
      "Diferenciais técnicos devem aparecer no cronograma, não só na bio.",
      "Em mineração, segurança vale mais que desconto.",
      "Casos anteriores específicos geram confiança imediata.",
    ],
    anonimizacao: { fornecedor: "identificado", empresa: "identificado" },
    autor_advisor_id: "adv-celso",
    publicado_em: "2026-02-20",
    destaque: true,
    visivel_para: "todos_publico",
  },
  {
    id: "ec-2",
    titulo: "Treinamento NR-35 — eficiência operacional no primeiro ciclo",
    resumo:
      "SegWork executou treinamento com 100% de aprovação — case curto sobre estruturação logística.",
    contrato_id_origem: "ct-14",
    contexto: {
      categoria: "Segurança do Trabalho",
      regiao: "João Monlevade - MG",
      porte_fornecedor: "medio",
      porte_empresa: "grande",
    },
    corpo:
      "A SegWork propôs logística simples: 3 turmas em 5 dias, material digital prévio + prática em campo. O escopo claro e o preço competitivo vieram junto com garantia de reaplicação. Resultado: 120/120 aprovados, contrato encerrado com review 5/5 dos dois lados.",
    aprendizados: [
      "Clareza de logística vence sofisticação pedagógica.",
      "Garantia de reaplicação reduz risco percebido pela empresa.",
    ],
    anonimizacao: { fornecedor: "identificado", empresa: "identificado" },
    autor_advisor_id: "adv-ana",
    publicado_em: "2026-03-18",
    destaque: true,
    visivel_para: "fornecedores_logados",
  },
  {
    id: "ec-3",
    titulo: "Monitoramento ambiental: quando o diferencial não é preço",
    resumo:
      "Fornecedor anônimo venceu RFP mesmo não sendo o mais barato — foco em compliance.",
    contrato_id_origem: "ct-10",
    contexto: {
      categoria: "Serviços Ambientais",
      regiao: "João Monlevade - MG",
      porte_fornecedor: "medio",
      porte_empresa: "grande",
    },
    corpo:
      "Candidato focou em cobertura total de não-conformidades potenciais (NR-13, NR-23, licença IBAMA vigente) e incluiu plano de contingência. Preço 15% acima do 2º colocado, mas contratante priorizou compliance devido a auditoria próxima.",
    aprendizados: [
      "Em auditoria iminente, compliance supera preço.",
      "Plano de contingência é diferencial tangível na tomada de decisão.",
    ],
    anonimizacao: { fornecedor: "anonimo", empresa: "anonimo" },
    autor_advisor_id: "adv-ana",
    publicado_em: "2026-04-05",
    destaque: false,
    visivel_para: "fornecedores_logados",
  },
];

export interface OfertaOutreach {
  id: string;
  fornecedor_id: string;
  owner_id: string;
  mensagem: string;
  catalogo_sugerido_id: string;
  desconto_percentual?: number;
  status: "enviada" | "visualizada" | "aceita" | "ignorada";
  motivo_lead: string;
  enviada_em: string;
  visualizada_em?: string;
  resolvida_em?: string;
}

export const ofertasOutreach: OfertaOutreach[] = [
  {
    id: "oft-1",
    fornecedor_id: "6",
    owner_id: "adv-celso",
    mensagem:
      "Notamos que a Metalúrgica XYZ teve candidatura descartada recentemente em Transporte/Manutenção. Posso apoiar com sessão de retorno pós-descarte com 20% de desconto.",
    catalogo_sugerido_id: "cat-retorno-descarte",
    desconto_percentual: 20,
    status: "enviada",
    motivo_lead: "1 candidatura descartada nos últimos 15d",
    enviada_em: "2026-04-10",
  },
  {
    id: "oft-2",
    fornecedor_id: "2",
    owner_id: "adv-celso",
    mensagem:
      "Ambiental Solutions está shortlistada no projeto 5 ArcelorMittal. Posso apoiar na proposta formal com acompanhamento completo.",
    catalogo_sugerido_id: "cat-acompanhamento",
    status: "visualizada",
    motivo_lead: "Candidatura shortlistada em projeto de SST",
    enviada_em: "2026-04-08",
    visualizada_em: "2026-04-09",
  },
  {
    id: "oft-3",
    fornecedor_id: "3",
    owner_id: "adv-celso",
    mensagem:
      "TransLog, percebemos que vocês têm histórico forte em logística. Posso apoiar próxima candidatura para descontos em transporte pesado.",
    catalogo_sugerido_id: "cat-revisao-candidatura",
    desconto_percentual: 10,
    status: "ignorada",
    motivo_lead: "Fornecedor ativo no setor sem sessão recente",
    enviada_em: "2026-03-25",
    resolvida_em: "2026-04-05",
  },
];

export function getAdvisorById(id: string): Advisor | undefined {
  return advisors.find((a) => a.id === id);
}

export function getCatalogoById(id: string): CatalogoConsultoria | undefined {
  return catalogoConsultoria.find((c) => c.id === id);
}

export function getSessaoById(id: string): SessaoConsultoria | undefined {
  return sessoesConsultoria.find((s) => s.id === id);
}

export function getEstudoDeCasoById(id: string): EstudoDeCaso | undefined {
  return estudosDeCaso.find((e) => e.id === id);
}
