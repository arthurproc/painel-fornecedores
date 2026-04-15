export interface Organizacao {
  id: string;
  razao_social: string;
  cnpj: string;
  endereco_fiscal: string;
  perfil_empresa_ativo: boolean;
  perfil_fornecedor_ativo: boolean;
  perfil_primeiro_escolhido: "empresa" | "fornecedor";
  linkage_publica: boolean;
  slug?: string;
  desde: string;
  ativo: boolean;
}

export const organizacoes: Organizacao[] = [
  {
    id: "org-vale",
    razao_social: "Vale S.A.",
    cnpj: "33.592.510/0001-54",
    endereco_fiscal: "Av. Dante Micheline, 5500 — Ponta de Areia, Itabira/MG",
    perfil_empresa_ativo: true,
    perfil_fornecedor_ativo: false,
    perfil_primeiro_escolhido: "empresa",
    linkage_publica: true,
    slug: "vale",
    desde: "1942",
    ativo: true,
  },
  {
    id: "org-usiminas",
    razao_social: "Usinas Siderúrgicas de Minas Gerais S.A.",
    cnpj: "60.894.730/0001-05",
    endereco_fiscal: "Rua Prof. José Vieira de Mendonça, 3011 — Belo Horizonte/MG",
    perfil_empresa_ativo: true,
    perfil_fornecedor_ativo: false,
    perfil_primeiro_escolhido: "empresa",
    linkage_publica: true,
    slug: "usiminas",
    desde: "1956",
    ativo: true,
  },
  {
    id: "org-arcelormittal",
    razao_social: "ArcelorMittal Brasil S.A.",
    cnpj: "17.469.701/0001-77",
    endereco_fiscal: "Av. Carandaí, 1115 — Belo Horizonte/MG",
    perfil_empresa_ativo: true,
    perfil_fornecedor_ativo: false,
    perfil_primeiro_escolhido: "empresa",
    linkage_publica: true,
    slug: "arcelormittal",
    desde: "1921",
    ativo: true,
  },
  {
    id: "org-techminas",
    razao_social: "TechMinas Serviços Industriais Ltda.",
    cnpj: "12.345.678/0001-01",
    endereco_fiscal: "Rua Sete de Setembro, 420 — Centro, Itabira/MG",
    perfil_empresa_ativo: false,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "techminas",
    desde: "2011",
    ativo: true,
  },
  {
    id: "org-ambiental-solutions",
    razao_social: "Ambiental Solutions Consultoria Ltda.",
    cnpj: "22.345.678/0001-02",
    endereco_fiscal: "Av. Mauro Ribeiro Lage, 185 — Centro, Itabira/MG",
    perfil_empresa_ativo: false,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "ambiental-solutions",
    desde: "2014",
    ativo: true,
  },
  {
    id: "org-translog",
    razao_social: "TransLog MG Transportes Ltda.",
    cnpj: "32.345.678/0001-03",
    endereco_fiscal: "Rodovia BR-381, Km 362 — Distrito Industrial, Itabira/MG",
    perfil_empresa_ativo: false,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "translog",
    desde: "2008",
    ativo: true,
  },
  {
    id: "org-construminas",
    razao_social: "Construminas Engenharia Ltda.",
    cnpj: "42.345.678/0001-04",
    endereco_fiscal: "Av. Getúlio Vargas, 1200 — Centro, João Monlevade/MG",
    perfil_empresa_ativo: false,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "construminas",
    desde: "2005",
    ativo: true,
  },
  {
    id: "org-segwork",
    razao_social: "SegWork Consultoria em Segurança do Trabalho Ltda.",
    cnpj: "52.345.678/0001-05",
    endereco_fiscal: "Rua Coronel Aristides, 330 — Centro, Itabira/MG",
    perfil_empresa_ativo: false,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "segwork",
    desde: "2010",
    ativo: true,
  },
  {
    id: "org-metalurgica-xyz",
    razao_social: "Metalúrgica XYZ Indústria e Comércio Ltda.",
    cnpj: "62.345.678/0001-06",
    endereco_fiscal: "Distrito Industrial Quadra 12 — João Monlevade/MG",
    perfil_empresa_ativo: true,
    perfil_fornecedor_ativo: true,
    perfil_primeiro_escolhido: "fornecedor",
    linkage_publica: true,
    slug: "metalurgica-xyz",
    desde: "1998",
    ativo: true,
  },
  {
    id: "org-consultoria-interna",
    razao_social: "ConectaFornece Consultoria — tenant interno",
    cnpj: "72.345.678/0001-07",
    endereco_fiscal: "Rua Principal, 100 — Itabira/MG",
    perfil_empresa_ativo: true,
    perfil_fornecedor_ativo: false,
    perfil_primeiro_escolhido: "empresa",
    linkage_publica: false,
    slug: "consultoria-interna",
    desde: "2025",
    ativo: true,
  },
];

export function getOrganizacaoById(id: string): Organizacao | undefined {
  return organizacoes.find((o) => o.id === id);
}
