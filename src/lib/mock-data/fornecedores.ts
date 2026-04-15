import { computeReputacao, type ReputacaoAgregada } from "./reputacao";

export interface Fornecedor {
  id: string;
  organizacao_id: string;
  nome: string;
  logo: string;
  descricao: string;
  categorias: string[];
  cidade: string;
  regiao: string;
  regioes_atendidas: string[];
  certificacoes: string[];
  capacidade_atual?: string;
  projetosRealizados: number;
  desde: string;
  contato: {
    email: string;
    telefone: string;
  };
  contratos_destacaveis_ids: string[];
  reputacao_agregada: ReputacaoAgregada;
}

export const fornecedores: Fornecedor[] = [
  {
    id: "1",
    organizacao_id: "org-techminas",
    nome: "TechMinas Serviços Industriais",
    logo: "TM",
    descricao:
      "Empresa especializada em manutenção industrial com foco no setor de mineração. Atuamos há mais de 15 anos na região de Itabira oferecendo soluções completas em manutenção preventiva, preditiva e corretiva.",
    categorias: ["Manutenção Industrial", "Elétrica e Automação"],
    cidade: "Itabira",
    regiao: "Itabira - MG",
    regioes_atendidas: ["Itabira - MG", "João Monlevade - MG"],
    certificacoes: ["ISO 9001", "NR-22", "NR-10", "NR-35"],
    capacidade_atual: "15 técnicos disponíveis",
    projetosRealizados: 47,
    desde: "2011",
    contato: {
      email: "contato@techminas.com.br",
      telefone: "(31) 3831-0000",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-techminas", "fornecedor"),
  },
  {
    id: "2",
    organizacao_id: "org-ambiental-solutions",
    nome: "Ambiental Solutions Ltda",
    logo: "AS",
    descricao:
      "Consultoria e serviços ambientais para o setor de mineração e indústria pesada. Especialistas em licenciamento ambiental, monitoramento e recuperação de áreas degradadas.",
    categorias: ["Serviços Ambientais", "Consultoria"],
    cidade: "Itabira",
    regiao: "Itabira - MG",
    regioes_atendidas: ["Itabira - MG", "João Monlevade - MG", "Belo Horizonte - MG"],
    certificacoes: ["ISO 14001", "Licença IBAMA", "CREA-MG"],
    projetosRealizados: 32,
    desde: "2014",
    contato: {
      email: "contato@ambientalsolutions.com.br",
      telefone: "(31) 3831-1111",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-ambiental-solutions", "fornecedor"),
  },
  {
    id: "3",
    organizacao_id: "org-translog",
    nome: "TransLog MG Transportes",
    logo: "TL",
    descricao:
      "Empresa de transporte rodoviário de cargas especializada em minério e produtos siderúrgicos. Frota própria com mais de 50 veículos rastreados.",
    categorias: ["Transporte e Logística"],
    cidade: "Itabira",
    regiao: "Itabira - MG",
    regioes_atendidas: ["Itabira - MG", "João Monlevade - MG", "Vitória - ES"],
    certificacoes: ["RNTRC", "ISO 9001", "SASSMAQ"],
    projetosRealizados: 85,
    desde: "2008",
    contato: {
      email: "operacoes@translogmg.com.br",
      telefone: "(31) 3831-2222",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-translog", "fornecedor"),
  },
  {
    id: "4",
    organizacao_id: "org-construminas",
    nome: "Construminas Engenharia",
    logo: "CM",
    descricao:
      "Construtora e incorporadora com expertise em obras industriais. Atuação em construção civil, reformas e adequações de plantas industriais em toda região central de Minas Gerais.",
    categorias: ["Construção Civil", "Manutenção Industrial"],
    cidade: "João Monlevade",
    regiao: "João Monlevade - MG",
    regioes_atendidas: ["João Monlevade - MG", "Itabira - MG"],
    certificacoes: ["CREA-MG", "ISO 9001", "PBQP-H"],
    projetosRealizados: 63,
    desde: "2005",
    contato: {
      email: "projetos@construminas.com.br",
      telefone: "(31) 3852-3333",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-construminas", "fornecedor"),
  },
  {
    id: "5",
    organizacao_id: "org-segwork",
    nome: "SegWork Consultoria",
    logo: "SW",
    descricao:
      "Consultoria em segurança e saúde do trabalho. Elaboração de laudos, programas de segurança, treinamentos NR e gestão de SST para indústrias e mineradoras.",
    categorias: ["Segurança do Trabalho", "Consultoria"],
    cidade: "Itabira",
    regiao: "Itabira - MG",
    regioes_atendidas: ["Itabira - MG", "João Monlevade - MG"],
    certificacoes: ["MTE", "OHSAS 18001", "ISO 45001"],
    projetosRealizados: 120,
    desde: "2010",
    contato: {
      email: "atendimento@segwork.com.br",
      telefone: "(31) 3831-4444",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-segwork", "fornecedor"),
  },
  {
    id: "6",
    organizacao_id: "org-metalurgica-xyz",
    nome: "Metalúrgica XYZ — Usinagem e Caldeiraria",
    logo: "MX",
    descricao:
      "Braço prestador da Metalúrgica XYZ. Oferece usinagem de precisão, caldeiraria pesada e fabricação de peças sob medida para siderurgia e mineração da região.",
    categorias: ["Manutenção Industrial", "Fabricação Sob Medida"],
    cidade: "João Monlevade",
    regiao: "João Monlevade - MG",
    regioes_atendidas: ["João Monlevade - MG", "Itabira - MG"],
    certificacoes: ["ISO 9001", "CREA-MG"],
    capacidade_atual: "Em expansão",
    projetosRealizados: 8,
    desde: "2020",
    contato: {
      email: "comercial@metalurgicaxyz.com.br",
      telefone: "(31) 3852-9999",
    },
    contratos_destacaveis_ids: [],
    reputacao_agregada: computeReputacao("org-metalurgica-xyz", "fornecedor"),
  },
];

export function getFornecedorById(id: string): Fornecedor | undefined {
  return fornecedores.find((f) => f.id === id);
}

export function getFornecedorByOrganizacao(
  organizacao_id: string
): Fornecedor | undefined {
  return fornecedores.find((f) => f.organizacao_id === organizacao_id);
}
