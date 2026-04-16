import type { CandidaturaStatus } from "./_shared";
export interface DocumentoCandidaturaAnexado {
  documento_exigido_id: string;
  documento_empresa_id?: string;
  nome: string;
  origem: "perfil" | "manual";
  arquivo_caminho: string;
  status: "anexado" | "pendente";
}

export interface Candidatura {
  id: string;
  projeto_id: string;
  fornecedor_id: string;
  autor_membro_id: string;
  pitch: string;
  contratos_destacados: string[];
  capacidade_declarada: string;
  faixa_preco_preliminar?: string;
  documentos_anexados: DocumentoCandidaturaAnexado[];
  status: CandidaturaStatus;
  motivo_descarte?: {
    categoria_id: string;
    comentario?: string;
  };
  revisada_consultoria: boolean;
  sessao_consultoria_id?: string;
  aviso_30d_enviado_em?: string;
  criada_em: string;
  enviada_em?: string;
  decidida_em?: string;
  expirada_em?: string;
}

interface CandidaturaSeed extends Omit<Candidatura, "documentos_anexados"> {
  documentos_anexados?: DocumentoCandidaturaAnexado[];
}

function normalizeCandidatura(seed: CandidaturaSeed): Candidatura {
  return {
    ...seed,
    documentos_anexados: seed.documentos_anexados ?? [],
  };
}

const candidaturaSeeds: CandidaturaSeed[] = [
  {
    id: "cand-1",
    projeto_id: "1",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "Nossa equipe possui ampla experiência em manutenção de correias transportadoras em complexos mineradores. Dispomos de 15 técnicos certificados e equipamentos próprios. Podemos iniciar em até 7 dias após a aprovação.",
    contratos_destacados: ["ct-7", "ct-9"],
    capacidade_declarada: "Equipe 15 técnicos + engenheiro responsável",
    faixa_preco_preliminar: "R$ 300.000 - R$ 360.000",
    documentos_anexados: [
      {
        documento_exigido_id: "proj-1-doc-nr22",
        documento_empresa_id: "doc-tech-nr-22",
        nome: "Certificado NR-22 vigente",
        origem: "perfil",
        arquivo_caminho: "/mock-storage/fornecedores/1/certificado-nr-22-techminas.pdf",
        status: "anexado",
      },
    ],
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-11",
    enviada_em: "2026-04-11",
  },
  {
    id: "cand-2",
    projeto_id: "1",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch:
      "Temos experiência consolidada em manutenção industrial no setor de mineração. Oferecemos garantia de 12 meses em todos os serviços executados e equipe disponível 24/7.",
    contratos_destacados: ["ct-13", "ct-14"],
    capacidade_declarada: "Equipe 10 técnicos",
    faixa_preco_preliminar: "R$ 280.000 - R$ 320.000",
    status: "enviada",
    revisada_consultoria: true,
    criada_em: "2026-04-11",
    enviada_em: "2026-04-11",
  },
  {
    id: "cand-3",
    projeto_id: "2",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch:
      "Somos especialistas em monitoramento ambiental e possuímos todas as certificações exigidas. Já implantamos sistemas similares em outras unidades da região.",
    contratos_destacados: ["ct-10"],
    capacidade_declarada: "Equipe multidisciplinar 12 profissionais",
    faixa_preco_preliminar: "R$ 650.000 - R$ 780.000",
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-09",
    enviada_em: "2026-04-09",
  },
  {
    id: "cand-expirada",
    projeto_id: "2",
    fornecedor_id: "3",
    autor_membro_id: "mem-translog-owner",
    pitch:
      "Podemos fornecer a parte logística do projeto. Aguardando retorno há mais de 45 dias.",
    contratos_destacados: [],
    capacidade_declarada: "Logística e mobilização",
    status: "expirada",
    revisada_consultoria: false,
    criada_em: "2026-02-20",
    enviada_em: "2026-02-20",
    expirada_em: "2026-04-06",
  },
  {
    id: "cand-4",
    projeto_id: "3",
    fornecedor_id: "3",
    autor_membro_id: "mem-translog-owner",
    pitch:
      "Dispomos de frota própria com 52 veículos equipados com rastreamento em tempo real. Capacidade imediata para atender o volume solicitado com margem de segurança.",
    contratos_destacados: ["ct-11"],
    capacidade_declarada: "Frota 52 veículos",
    faixa_preco_preliminar: "R$ 1.400.000 - R$ 1.600.000",
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-06",
    enviada_em: "2026-04-06",
  },
  {
    id: "cand-descartada",
    projeto_id: "3",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-admin",
    pitch:
      "Podemos apoiar com fabricação de componentes auxiliares e suporte logístico local.",
    contratos_destacados: [],
    capacidade_declarada: "Fabricação sob medida",
    status: "descartada",
    motivo_descarte: {
      categoria_id: "fora_escopo",
      comentario: "Escopo solicitado é transporte rodoviário puro; fabricação não se aplica.",
    },
    revisada_consultoria: false,
    criada_em: "2026-04-05",
    enviada_em: "2026-04-05",
    decidida_em: "2026-04-08",
  },
  {
    id: "cand-5",
    projeto_id: "4",
    fornecedor_id: "4",
    autor_membro_id: "mem-construminas-owner",
    pitch:
      "Temos vasta experiência em reformas industriais na região. Garantimos cumprimento de prazos e normas ANVISA. Equipe completa com engenheiro civil e técnicos especializados.",
    contratos_destacados: ["ct-12"],
    capacidade_declarada: "Equipe 20 profissionais + engenheiro",
    faixa_preco_preliminar: "R$ 220.000 - R$ 260.000",
    status: "enviada",
    revisada_consultoria: true,
    criada_em: "2026-04-13",
    enviada_em: "2026-04-13",
  },
  {
    id: "cand-5a",
    projeto_id: "5",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch:
      "Consultoria completa em SST com foco no setor metalúrgico. Equipe multidisciplinar com médico do trabalho e engenheiro de segurança.",
    contratos_destacados: ["ct-13", "ct-14"],
    capacidade_declarada: "Equipe 8 profissionais",
    faixa_preco_preliminar: "R$ 95.000 - R$ 120.000",
    status: "shortlistada",
    revisada_consultoria: true,
    criada_em: "2026-04-02",
    enviada_em: "2026-04-02",
    decidida_em: "2026-04-07",
  },
  {
    id: "cand-5b",
    projeto_id: "5",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch:
      "Ambiental Solutions atua em SST há mais de uma década. Proposta em elaboração com foco em compliance completo.",
    contratos_destacados: ["ct-10"],
    capacidade_declarada: "Equipe multidisciplinar 6 profissionais",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-04-02",
    enviada_em: "2026-04-02",
    decidida_em: "2026-04-08",
  },
  {
    id: "cand-5c",
    projeto_id: "5",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "Apoiamos a ArcelorMittal desde 2018. Candidatura foi retirada porque a equipe foi realocada para outro contrato.",
    contratos_destacados: ["ct-7"],
    capacidade_declarada: "Equipe sênior",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-04-03",
    enviada_em: "2026-04-03",
    decidida_em: "2026-04-08",
  },
  {
    id: "cand-rascunho",
    projeto_id: "6",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-operador",
    pitch:
      "Candidatura em elaboração. Preparando documentação técnica e proposta preliminar de fornecimento.",
    contratos_destacados: [],
    capacidade_declarada: "Em definição",
    status: "rascunho",
    revisada_consultoria: false,
    criada_em: "2026-04-12",
  },
  {
    id: "cand-retirada",
    projeto_id: "6",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-operador",
    pitch:
      "Havíamos manifestado interesse mas após análise interna decidimos não prosseguir com esta candidatura.",
    contratos_destacados: [],
    capacidade_declarada: "N/A",
    status: "retirada",
    revisada_consultoria: false,
    criada_em: "2026-04-01",
    enviada_em: "2026-04-01",
    decidida_em: "2026-04-04",
  },
  {
    id: "cand-mx-enviada",
    projeto_id: "1",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-operador",
    pitch:
      "Nossa divisão de manutenção atende plantas siderúrgicas com equipe própria de usinagem e caldeiraria. Podemos apoiar na manutenção das correias com mobilização local e peças de reposição produzidas internamente.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe 6 técnicos + suporte de usinagem",
    faixa_preco_preliminar: "R$ 310.000 - R$ 355.000",
    documentos_anexados: [
      {
        documento_exigido_id: "proj-1-doc-art",
        documento_empresa_id: "doc-mx-portfolio-contratos",
        nome: "Portfólio de contratos similares",
        origem: "manual",
        arquivo_caminho: "/mock-storage/fornecedores/6/portfolio-contratos-metalurgica-xyz.pdf",
        status: "anexado",
      },
    ],
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-13",
    enviada_em: "2026-04-13",
  },
  {
    id: "cand-5d",
    projeto_id: "5",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-admin",
    pitch:
      "Podemos executar adequações pontuais de segurança e fabricar suportes, enclausuramentos e proteções metálicas sob medida como complemento à frente de SST. Proposta formal em elaboração com parceiro técnico homologado.",
    contratos_destacados: ["ct-18"],
    capacidade_declarada: "Equipe de caldeiraria + parceiro de engenharia de segurança",
    faixa_preco_preliminar: "R$ 102.000 - R$ 128.000",
    status: "shortlistada",
    revisada_consultoria: true,
    criada_em: "2026-04-04",
    enviada_em: "2026-04-04",
    decidida_em: "2026-04-09",
  },
  {
    id: "cand-mx-expirada",
    projeto_id: "2",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-operador",
    pitch:
      "Montaríamos a infraestrutura metálica e os abrigos dos sensores ambientais. A candidatura expirou sem retorno da empresa contratante.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe de instalação metálica",
    status: "expirada",
    revisada_consultoria: false,
    criada_em: "2026-02-18",
    enviada_em: "2026-02-18",
    expirada_em: "2026-04-04",
  },
  {
    id: "cand-mx-retirada",
    projeto_id: "6",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-operador",
    pitch:
      "Iniciamos a candidatura para fornecimento de suportes metálicos para armazenagem de EPIs, mas decidimos retirar ao identificar limitação de estoque homologado.",
    contratos_destacados: [],
    capacidade_declarada: "Em revisão de capacidade",
    status: "retirada",
    revisada_consultoria: false,
    criada_em: "2026-03-27",
    enviada_em: "2026-03-28",
    decidida_em: "2026-04-02",
  },
  {
    id: "cand-ct-7",
    projeto_id: "7",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch: "Proposta vencedora para manutenção de pontes rolantes - execução concluída.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe 12 técnicos",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-01-10",
    enviada_em: "2026-01-10",
    decidida_em: "2026-01-28",
  },
  {
    id: "cand-ct-8",
    projeto_id: "8",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch: "Proposta vencedora para gestão de resíduos industriais.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe 8 profissionais",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-02-15",
    enviada_em: "2026-02-15",
    decidida_em: "2026-03-10",
  },
  {
    id: "cand-ct-9",
    projeto_id: "9",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch: "Revisão geral de equipamentos de içamento - contrato em execução.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe 10 técnicos",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2025-12-10",
    enviada_em: "2025-12-10",
    decidida_em: "2026-01-05",
  },
  {
    id: "cand-ct-10",
    projeto_id: "10",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch: "Elaboração do RIMA - contrato encerrado.",
    contratos_destacados: [],
    capacidade_declarada: "Engenheiro ambiental + biólogos",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2025-11-15",
    enviada_em: "2025-11-15",
    decidida_em: "2025-12-10",
  },
  {
    id: "cand-ct-11",
    projeto_id: "11",
    fornecedor_id: "3",
    autor_membro_id: "mem-translog-owner",
    pitch: "Transporte especializado de equipamentos pesados.",
    contratos_destacados: [],
    capacidade_declarada: "Frota especial 10 veículos",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-01-25",
    enviada_em: "2026-01-25",
    decidida_em: "2026-02-15",
  },
  {
    id: "cand-ct-12",
    projeto_id: "12",
    fornecedor_id: "4",
    autor_membro_id: "mem-construminas-owner",
    pitch: "Ampliação do almoxarifado industrial.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe completa de obra civil",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2025-10-20",
    enviada_em: "2025-10-20",
    decidida_em: "2025-12-05",
  },
  {
    id: "cand-ct-13",
    projeto_id: "13",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch: "Implantação do PGR com equipe multidisciplinar.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe 6 profissionais",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-01-15",
    enviada_em: "2026-01-15",
    decidida_em: "2026-02-10",
  },
  {
    id: "cand-29-a",
    projeto_id: "29",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "A TechMinas executa retrofits de exaustão em áreas quentes e propõe parada curta com plano detalhado de comissionamento e monitoramento de vazão.",
    contratos_destacados: ["ct-7", "ct-9"],
    capacidade_declarada: "Equipe 9 técnicos + engenheiro mecânico",
    faixa_preco_preliminar: "R$ 248.000 - R$ 290.000",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-04-05",
    enviada_em: "2026-04-05",
    decidida_em: "2026-04-09",
  },
  {
    id: "cand-29-b",
    projeto_id: "29",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch:
      "A SegWork entra com parceiro homologado de ventilação industrial e foca no pacote de segurança, validação de fluxo e procedimento operacional pós-retrofit.",
    contratos_destacados: ["ct-13", "ct-14"],
    capacidade_declarada: "Coordenação SST + parceiro técnico de ventilação",
    faixa_preco_preliminar: "R$ 232.000 - R$ 276.000",
    status: "shortlistada",
    revisada_consultoria: true,
    criada_em: "2026-04-06",
    enviada_em: "2026-04-06",
    decidida_em: "2026-04-10",
  },
  {
    id: "cand-30-a",
    projeto_id: "30",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "Equipe certificada para inspeção e recuperação de pontes rolantes com entrega de laudo dimensional e plano de correção executado em janela curta.",
    contratos_destacados: ["ct-7", "ct-9"],
    capacidade_declarada: "Equipe 12 técnicos",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-02-18",
    enviada_em: "2026-02-18",
    decidida_em: "2026-02-26",
  },
  {
    id: "cand-31-a",
    projeto_id: "31",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch:
      "A Ambiental Solutions atuou com parceiro de ventilação para adequar as cabines de pintura e revisar os controles de exposição ocupacional.",
    contratos_destacados: ["ct-10"],
    capacidade_declarada: "Coordenação técnica + parceiro de montagem",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-01-18",
    enviada_em: "2026-01-18",
    decidida_em: "2026-01-28",
  },
  {
    id: "cand-ct-18",
    projeto_id: "32",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-owner",
    pitch: "Usinagem e entrega de eixos de transmissão com rastreabilidade completa do material.",
    contratos_destacados: [],
    capacidade_declarada: "Torno CNC + inspeção dimensional",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2025-09-12",
    enviada_em: "2025-09-12",
    decidida_em: "2025-09-26",
  },
  {
    id: "cand-ct-31",
    projeto_id: "33",
    fornecedor_id: "6",
    autor_membro_id: "mem-metalurgica-xyz-owner",
    pitch: "Fabricação e montagem de plataforma metálica com memorial de cálculo e inspeção de solda.",
    contratos_destacados: ["ct-18"],
    capacidade_declarada: "Equipe de caldeiraria e montagem",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-03-02",
    enviada_em: "2026-03-02",
    decidida_em: "2026-03-12",
  },
  {
    id: "cand-18-a",
    projeto_id: "18",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "Atendemos manutenção de fornos de indução há mais de 10 anos. Equipe própria com inspetor mecânico e eletricista NR-10 SEP certificados. Podemos mobilizar em 10 dias.",
    contratos_destacados: ["ct-7", "ct-9"],
    capacidade_declarada: "Equipe 8 técnicos + engenheiro",
    faixa_preco_preliminar: "R$ 170.000 - R$ 195.000",
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-11",
    enviada_em: "2026-04-11",
  },
  {
    id: "cand-18-b",
    projeto_id: "18",
    fornecedor_id: "4",
    autor_membro_id: "mem-construminas-owner",
    pitch:
      "Nossa divisão de manutenção industrial atende plantas metalúrgicas da região central. Portfólio inclui contratos similares em Usiminas. Proposta inclui reposição de refratário com fornecedor homologado.",
    contratos_destacados: ["ct-12"],
    capacidade_declarada: "Equipe 12 profissionais",
    status: "enviada",
    revisada_consultoria: true,
    criada_em: "2026-04-12",
    enviada_em: "2026-04-12",
  },
  {
    id: "cand-19-a",
    projeto_id: "19",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch:
      "Especializados em adequação NR-12 em linhas de prensas. Já entregamos dossiê técnico para 3 clientes do setor metalúrgico em 2025. Engenheiro de segurança dedicado ao projeto.",
    contratos_destacados: ["ct-13", "ct-14"],
    capacidade_declarada: "Engenheiro sênior + 3 técnicos",
    faixa_preco_preliminar: "R$ 205.000 - R$ 240.000",
    status: "shortlistada",
    revisada_consultoria: true,
    criada_em: "2026-04-03",
    enviada_em: "2026-04-03",
    decidida_em: "2026-04-09",
  },
  {
    id: "cand-19-b",
    projeto_id: "19",
    fornecedor_id: "2",
    autor_membro_id: "mem-ambiental-owner",
    pitch:
      "Ampliamos recentemente nossa atuação em segurança do trabalho. Podemos apoiar com parceria técnica em NR-12, mas o escopo principal é ambiental.",
    contratos_destacados: ["ct-10"],
    capacidade_declarada: "Equipe parceira via consórcio",
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-06",
    enviada_em: "2026-04-06",
  },
  {
    id: "cand-19-c",
    projeto_id: "19",
    fornecedor_id: "1",
    autor_membro_id: "mem-techminas-owner",
    pitch:
      "Podemos apoiar com a parte elétrica da adequação. Segurança documental ficaria por conta do cliente.",
    contratos_destacados: [],
    capacidade_declarada: "Equipe elétrica 4 técnicos",
    status: "descartada",
    motivo_descarte: {
      categoria_id: "fora_escopo",
      comentario:
        "Escopo exige entrega completa com dossiê NR-12 assinado por engenheiro de segurança - proposta parcial não atende.",
    },
    revisada_consultoria: false,
    criada_em: "2026-04-04",
    enviada_em: "2026-04-04",
    decidida_em: "2026-04-08",
  },
  {
    id: "cand-20-a",
    projeto_id: "20",
    fornecedor_id: "4",
    autor_membro_id: "mem-construminas-owner",
    pitch:
      "Temos fornecedor homologado de consumíveis com fábrica em Contagem. Podemos garantir entregas mensais com laudo e FISPQ por lote, suporte técnico local.",
    contratos_destacados: ["ct-12"],
    capacidade_declarada: "Logística própria + fornecedor homologado",
    faixa_preco_preliminar: "R$ 110.000 - R$ 130.000",
    status: "enviada",
    revisada_consultoria: false,
    criada_em: "2026-04-13",
    enviada_em: "2026-04-13",
  },
  {
    id: "cand-ct-14",
    projeto_id: "14",
    fornecedor_id: "5",
    autor_membro_id: "mem-segwork-owner",
    pitch: "Treinamento NR-35 para 120 colaboradores.",
    contratos_destacados: [],
    capacidade_declarada: "Instrutor sênior + monitor",
    status: "shortlistada",
    revisada_consultoria: false,
    criada_em: "2026-01-10",
    enviada_em: "2026-01-10",
    decidida_em: "2026-01-30",
  },
];

export const candidaturas: Candidatura[] = candidaturaSeeds.map(normalizeCandidatura);

export function getCandidaturaById(id: string): Candidatura | undefined {
  return candidaturas.find((c) => c.id === id);
}

export function getCandidaturasByProjeto(projeto_id: string): Candidatura[] {
  return candidaturas.filter((c) => c.projeto_id === projeto_id);
}

export function getCandidaturasByFornecedor(fornecedor_id: string): Candidatura[] {
  return candidaturas.filter((c) => c.fornecedor_id === fornecedor_id);
}

export function createCandidatura(input: Omit<Candidatura, "id">): Candidatura {
  const candidatura: Candidatura = {
    ...input,
    id: `cand-${input.fornecedor_id}-${input.projeto_id}-${candidaturas.length + 1}`,
  };
  candidaturas.unshift(candidatura);
  return candidatura;
}
