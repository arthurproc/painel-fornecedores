export interface Projeto {
  id: string;
  titulo: string;
  empresa: string;
  empresaLogo: string;
  descricao: string;
  categoria: string;
  regiao: string;
  orcamento: string;
  prazo: string;
  dataPublicacao: string;
  status: "aberto" | "em_analise" | "em_andamento" | "concluido";
  interessados: number;
  requisitos: string[];
}

export interface Fornecedor {
  id: string;
  nome: string;
  logo: string;
  descricao: string;
  categorias: string[];
  regiao: string;
  avaliacao: number;
  projetosRealizados: number;
  certificacoes: string[];
  desde: string;
  contato: {
    email: string;
    telefone: string;
  };
}

export interface Proposta {
  id: string;
  fornecedor: Fornecedor;
  projeto: Projeto;
  valor: string;
  prazoEntrega: string;
  mensagem: string;
  dataEnvio: string;
  status: "pendente" | "aceita" | "recusada";
}

export { categorias, regioes } from "@/lib/platform-data";

export const projetos: Projeto[] = [
  {
    id: "1",
    titulo: "Manutenção Preventiva de Correias Transportadoras",
    empresa: "Vale S.A.",
    empresaLogo: "V",
    descricao:
      "Serviço de manutenção preventiva e corretiva em correias transportadoras do complexo minerador de Itabira. Inclui inspeção periódica, substituição de rolos e alinhamento de correias. Necessário experiência comprovada em mineração.",
    categoria: "Manutenção Industrial",
    regiao: "Itabira - MG",
    orcamento: "R$ 250.000 - R$ 400.000",
    prazo: "15/06/2026",
    dataPublicacao: "10/04/2026",
    status: "aberto",
    interessados: 5,
    requisitos: [
      "Certificação NR-22",
      "Experiência mínima de 5 anos em mineração",
      "Equipe técnica com no mínimo 10 profissionais",
      "Seguro de responsabilidade civil",
    ],
  },
  {
    id: "2",
    titulo: "Implantação de Sistema de Monitoramento Ambiental",
    empresa: "Vale S.A.",
    empresaLogo: "V",
    descricao:
      "Projeto para implantação de sistema integrado de monitoramento ambiental em tempo real nas áreas de mineração do complexo de Itabira. Sensores de qualidade do ar, água e ruído.",
    categoria: "Serviços Ambientais",
    regiao: "Itabira - MG",
    orcamento: "R$ 500.000 - R$ 800.000",
    prazo: "30/08/2026",
    dataPublicacao: "08/04/2026",
    status: "aberto",
    interessados: 3,
    requisitos: [
      "Licença ambiental vigente",
      "Experiência em monitoramento ambiental",
      "Certificação ISO 14001",
      "Equipe com engenheiro ambiental",
    ],
  },
  {
    id: "3",
    titulo: "Transporte de Minério - Rota Itabira/Porto",
    empresa: "Vale S.A.",
    empresaLogo: "V",
    descricao:
      "Contratação de serviço de transporte rodoviário de minério de ferro da unidade de Itabira até o terminal portuário. Volume estimado de 5.000 toneladas/mês.",
    categoria: "Transporte e Logística",
    regiao: "Itabira - MG",
    orcamento: "R$ 1.200.000 - R$ 1.800.000",
    prazo: "01/07/2026",
    dataPublicacao: "05/04/2026",
    status: "em_analise",
    interessados: 8,
    requisitos: [
      "Frota mínima de 20 veículos",
      "RNTRC regularizado",
      "Seguro de carga",
      "Rastreamento veicular em tempo real",
    ],
  },
  {
    id: "4",
    titulo: "Reforma de Refeitório Industrial",
    empresa: "Usiminas",
    empresaLogo: "U",
    descricao:
      "Reforma completa do refeitório industrial da planta de João Monlevade. Inclui parte elétrica, hidráulica, revestimentos, mobiliário e adequação às normas sanitárias.",
    categoria: "Construção Civil",
    regiao: "João Monlevade - MG",
    orcamento: "R$ 180.000 - R$ 300.000",
    prazo: "20/07/2026",
    dataPublicacao: "12/04/2026",
    status: "aberto",
    interessados: 2,
    requisitos: [
      "CREA regularizado",
      "Alvará de construção",
      "Experiência em obras industriais",
      "Cumprimento de normas ANVISA",
    ],
  },
  {
    id: "5",
    titulo: "Consultoria em Segurança do Trabalho",
    empresa: "ArcelorMittal",
    empresaLogo: "A",
    descricao:
      "Consultoria especializada para revisão e atualização dos programas de segurança do trabalho. Inclui PPRA, PCMSO, treinamentos NR e auditoria de conformidade.",
    categoria: "Segurança do Trabalho",
    regiao: "João Monlevade - MG",
    orcamento: "R$ 80.000 - R$ 150.000",
    prazo: "30/05/2026",
    dataPublicacao: "01/04/2026",
    status: "em_andamento",
    interessados: 6,
    requisitos: [
      "Registro no MTE",
      "Equipe multidisciplinar",
      "Experiência no setor metalúrgico",
      "Certificação OHSAS 18001",
    ],
  },
  {
    id: "6",
    titulo: "Fornecimento de EPIs para Operação Minerária",
    empresa: "Vale S.A.",
    empresaLogo: "V",
    descricao:
      "Fornecimento mensal de equipamentos de proteção individual para aproximadamente 2.000 colaboradores do complexo minerador de Itabira.",
    categoria: "Segurança do Trabalho",
    regiao: "Itabira - MG",
    orcamento: "R$ 350.000 - R$ 500.000",
    prazo: "15/05/2026",
    dataPublicacao: "28/03/2026",
    status: "aberto",
    interessados: 10,
    requisitos: [
      "Certificado de Aprovação (CA) vigente",
      "Capacidade de entrega mensal",
      "Estoque mínimo de segurança",
      "Laudo técnico dos produtos",
    ],
  },
];

export const fornecedores: Fornecedor[] = [
  {
    id: "1",
    nome: "TechMinas Serviços Industriais",
    logo: "TM",
    descricao:
      "Empresa especializada em manutenção industrial com foco no setor de mineração. Atuamos há mais de 15 anos na região de Itabira oferecendo soluções completas em manutenção preventiva, preditiva e corretiva.",
    categorias: ["Manutenção Industrial", "Elétrica e Automação"],
    regiao: "Itabira - MG",
    avaliacao: 4.8,
    projetosRealizados: 47,
    certificacoes: ["ISO 9001", "NR-22", "NR-10", "NR-35"],
    desde: "2011",
    contato: {
      email: "contato@techminas.com.br",
      telefone: "(31) 3831-0000",
    },
  },
  {
    id: "2",
    nome: "Ambiental Solutions Ltda",
    logo: "AS",
    descricao:
      "Consultoria e serviços ambientais para o setor de mineração e indústria pesada. Especialistas em licenciamento ambiental, monitoramento e recuperação de áreas degradadas.",
    categorias: ["Serviços Ambientais", "Consultoria"],
    regiao: "Itabira - MG",
    avaliacao: 4.6,
    projetosRealizados: 32,
    certificacoes: ["ISO 14001", "Licença IBAMA", "CREA-MG"],
    desde: "2014",
    contato: {
      email: "contato@ambientalsolutions.com.br",
      telefone: "(31) 3831-1111",
    },
  },
  {
    id: "3",
    nome: "TransLog MG Transportes",
    logo: "TL",
    descricao:
      "Empresa de transporte rodoviário de cargas especializada em minério e produtos siderúrgicos. Frota própria com mais de 50 veículos rastreados.",
    categorias: ["Transporte e Logística"],
    regiao: "Itabira - MG",
    avaliacao: 4.4,
    projetosRealizados: 85,
    certificacoes: ["RNTRC", "ISO 9001", "SASSMAQ"],
    desde: "2008",
    contato: {
      email: "operacoes@translogmg.com.br",
      telefone: "(31) 3831-2222",
    },
  },
  {
    id: "4",
    nome: "Construminas Engenharia",
    logo: "CM",
    descricao:
      "Construtora e incorporadora com expertise em obras industriais. Atuação em construção civil, reformas e adequações de plantas industriais em toda região central de Minas Gerais.",
    categorias: ["Construção Civil", "Manutenção Industrial"],
    regiao: "João Monlevade - MG",
    avaliacao: 4.5,
    projetosRealizados: 63,
    certificacoes: ["CREA-MG", "ISO 9001", "PBQP-H"],
    desde: "2005",
    contato: {
      email: "projetos@construminas.com.br",
      telefone: "(31) 3852-3333",
    },
  },
  {
    id: "5",
    nome: "SegWork Consultoria",
    logo: "SW",
    descricao:
      "Consultoria em segurança e saúde do trabalho. Elaboração de laudos, programas de segurança, treinamentos NR e gestão de SST para indústrias e mineradoras.",
    categorias: ["Segurança do Trabalho", "Consultoria"],
    regiao: "Itabira - MG",
    avaliacao: 4.9,
    projetosRealizados: 120,
    certificacoes: ["MTE", "OHSAS 18001", "ISO 45001"],
    desde: "2010",
    contato: {
      email: "atendimento@segwork.com.br",
      telefone: "(31) 3831-4444",
    },
  },
];

export const propostas: Proposta[] = [
  {
    id: "1",
    fornecedor: fornecedores[0],
    projeto: projetos[0],
    valor: "R$ 320.000,00",
    prazoEntrega: "45 dias",
    mensagem:
      "Nossa equipe possui ampla experiência em manutenção de correias transportadoras em complexos mineradores. Dispomos de equipe de 15 técnicos certificados e equipamentos próprios. Podemos iniciar em até 7 dias após a aprovação.",
    dataEnvio: "11/04/2026",
    status: "pendente",
  },
  {
    id: "2",
    fornecedor: fornecedores[4],
    projeto: projetos[0],
    valor: "R$ 290.000,00",
    prazoEntrega: "60 dias",
    mensagem:
      "Temos experiência consolidada em manutenção industrial no setor de mineração. Oferecemos garantia de 12 meses em todos os serviços executados e equipe disponível 24/7.",
    dataEnvio: "11/04/2026",
    status: "pendente",
  },
  {
    id: "3",
    fornecedor: fornecedores[1],
    projeto: projetos[1],
    valor: "R$ 680.000,00",
    prazoEntrega: "90 dias",
    mensagem:
      "Somos especialistas em monitoramento ambiental e possuímos todas as certificações exigidas. Já implantamos sistemas similares em outras unidades da região.",
    dataEnvio: "09/04/2026",
    status: "pendente",
  },
  {
    id: "4",
    fornecedor: fornecedores[2],
    projeto: projetos[2],
    valor: "R$ 1.450.000,00",
    prazoEntrega: "Contrato anual",
    mensagem:
      "Dispomos de frota própria com 52 veículos equipados com rastreamento em tempo real. Capacidade imediata para atender o volume solicitado com margem de segurança.",
    dataEnvio: "06/04/2026",
    status: "aceita",
  },
  {
    id: "5",
    fornecedor: fornecedores[3],
    projeto: projetos[3],
    valor: "R$ 245.000,00",
    prazoEntrega: "75 dias",
    mensagem:
      "Temos vasta experiência em reformas industriais na região. Garantimos cumprimento de prazos e normas ANVISA. Equipe completa com engenheiro civil e técnicos especializados.",
    dataEnvio: "13/04/2026",
    status: "pendente",
  },
];

export const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_analise: "Em Análise",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  pendente: "Pendente",
  aceita: "Aceita",
  recusada: "Recusada",
};

export const statusColors: Record<string, string> = {
  aberto: "bg-emerald-100 text-emerald-800",
  em_analise: "bg-amber-100 text-amber-800",
  em_andamento: "bg-blue-100 text-blue-800",
  concluido: "bg-gray-100 text-gray-800",
  pendente: "bg-amber-100 text-amber-800",
  aceita: "bg-emerald-100 text-emerald-800",
  recusada: "bg-red-100 text-red-800",
};
