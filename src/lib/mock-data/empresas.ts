import { computeReputacao, type ReputacaoAgregada } from "./reputacao";

export interface Empresa {
  id: string;
  organizacao_id: string;
  nome: string;
  logo: string;
  setor: string;
  descricao: string;
  cidade: string;
  regiao: string;
  desde: string;
  reputacao_agregada: ReputacaoAgregada;
  tempo_medio_pagamento_dias?: number;
  contratos_publicados: number;
  contratos_fechados: number;
}

export const empresas: Empresa[] = [
  {
    id: "vale",
    organizacao_id: "org-vale",
    nome: "Vale S.A.",
    logo: "V",
    setor: "Mineração",
    descricao:
      "Uma das maiores mineradoras do mundo, com operações concentradas no complexo de Itabira. A Vale é referência global em minério de ferro e pelotas, com décadas de presença na região e forte compromisso com fornecedores locais.",
    cidade: "Itabira",
    regiao: "Itabira - MG",
    desde: "1942",
    reputacao_agregada: computeReputacao("org-vale", "empresa"),
    tempo_medio_pagamento_dias: 30,
    contratos_publicados: 8,
    contratos_fechados: 6,
  },
  {
    id: "usiminas",
    organizacao_id: "org-usiminas",
    nome: "Usiminas",
    logo: "U",
    setor: "Siderurgia",
    descricao:
      "Grupo siderúrgico com plantas em Ipatinga e João Monlevade, a Usiminas é um dos maiores produtores de aços planos do Brasil. Atua fortemente na contratação de serviços industriais especializados na região central de Minas Gerais.",
    cidade: "João Monlevade",
    regiao: "João Monlevade - MG",
    desde: "1956",
    reputacao_agregada: computeReputacao("org-usiminas", "empresa"),
    tempo_medio_pagamento_dias: 45,
    contratos_publicados: 3,
    contratos_fechados: 2,
  },
  {
    id: "arcelormittal",
    organizacao_id: "org-arcelormittal",
    nome: "ArcelorMittal",
    logo: "A",
    setor: "Siderurgia",
    descricao:
      "Maior produtora de aço do mundo, com unidade em João Monlevade dedicada à produção de aços longos. Contrata regularmente fornecedores locais para manutenção, segurança do trabalho, construção civil e logística industrial.",
    cidade: "João Monlevade",
    regiao: "João Monlevade - MG",
    desde: "1921",
    reputacao_agregada: computeReputacao("org-arcelormittal", "empresa"),
    tempo_medio_pagamento_dias: 30,
    contratos_publicados: 3,
    contratos_fechados: 2,
  },
  {
    id: "metalurgica-xyz",
    organizacao_id: "org-metalurgica-xyz",
    nome: "Metalúrgica XYZ",
    logo: "MX",
    setor: "Metalurgia",
    descricao:
      "Metalúrgica de médio porte que atua como compradora de serviços especializados (manutenção, ambiental, segurança) e também oferece usinagem e caldeiraria sob medida para a cadeia siderúrgica da região.",
    cidade: "João Monlevade",
    regiao: "João Monlevade - MG",
    desde: "1998",
    reputacao_agregada: computeReputacao("org-metalurgica-xyz", "empresa"),
    contratos_publicados: 0,
    contratos_fechados: 0,
  },
];

export function getEmpresaById(id: string): Empresa | undefined {
  return empresas.find((e) => e.id === id);
}

export function getEmpresaByOrganizacao(
  organizacao_id: string
): Empresa | undefined {
  return empresas.find((e) => e.organizacao_id === organizacao_id);
}
