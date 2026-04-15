export interface PreferenciasNotificacao {
  preferencias: {
    [grupo: string]: { in_app: boolean; email: boolean };
  };
  atualizado_em: string;
}

export const PREFERENCIAS_NOTIFICACAO_DEFAULT: PreferenciasNotificacao = {
  preferencias: {
    criticas_handshake: { in_app: true, email: true },
    criticas_consultoria: { in_app: true, email: true },
    importantes_comunicacao: { in_app: true, email: false },
    importantes_empresa: { in_app: true, email: true },
    importantes_fornecedor: { in_app: true, email: false },
    importantes_admin: { in_app: true, email: true },
    informativas_descoberta: { in_app: true, email: false },
    informativas_conteudo: { in_app: true, email: false },
    informativas_tenant: { in_app: true, email: false },
  },
  atualizado_em: "2026-01-01",
};

export interface Membro {
  id: string;
  organizacao_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  role: "owner" | "admin" | "operador";
  foto?: string;
  ultimo_contexto_usado?: "empresa" | "fornecedor";
  visivel_publicamente?: boolean;
  preferencias_notificacao?: PreferenciasNotificacao;
  ativo: boolean;
  desde: string;
}

export const membros: Membro[] = [
  {
    id: "mem-vale-owner",
    organizacao_id: "org-vale",
    nome: "Ricardo Almeida",
    email: "ricardo.almeida@vale.com",
    telefone: "(31) 98100-0001",
    cargo: "Diretor de Suprimentos",
    role: "owner",
    ultimo_contexto_usado: "empresa",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-03-15",
  },
  {
    id: "mem-vale-admin",
    organizacao_id: "org-vale",
    nome: "Carolina Ferreira",
    email: "carolina.ferreira@vale.com",
    cargo: "Gerente de Compras",
    role: "admin",
    ultimo_contexto_usado: "empresa",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-06-01",
  },
  {
    id: "mem-vale-operador",
    organizacao_id: "org-vale",
    nome: "Tiago Nunes",
    email: "tiago.nunes@vale.com",
    cargo: "Analista de Contratos",
    role: "operador",
    ultimo_contexto_usado: "empresa",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-09-10",
  },
  {
    id: "mem-usiminas-owner",
    organizacao_id: "org-usiminas",
    nome: "Fernanda Barreto",
    email: "fernanda.barreto@usiminas.com",
    cargo: "Diretora Industrial",
    role: "owner",
    ultimo_contexto_usado: "empresa",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-02-12",
  },
  {
    id: "mem-usiminas-admin",
    organizacao_id: "org-usiminas",
    nome: "Paulo Machado",
    email: "paulo.machado@usiminas.com",
    cargo: "Coordenador de Compras",
    role: "admin",
    ultimo_contexto_usado: "empresa",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-05-20",
  },
  {
    id: "mem-arcelormittal-owner",
    organizacao_id: "org-arcelormittal",
    nome: "Juliana Costa",
    email: "juliana.costa@arcelormittal.com",
    cargo: "Head de Procurement",
    role: "owner",
    ultimo_contexto_usado: "empresa",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2023-11-05",
  },
  {
    id: "mem-arcelormittal-operador",
    organizacao_id: "org-arcelormittal",
    nome: "Henrique Duarte",
    email: "henrique.duarte@arcelormittal.com",
    cargo: "Analista de Fornecedores",
    role: "operador",
    ultimo_contexto_usado: "empresa",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2024-08-18",
  },
  {
    id: "mem-techminas-owner",
    organizacao_id: "org-techminas",
    nome: "Marcelo Siqueira",
    email: "marcelo@techminas.com.br",
    telefone: "(31) 3831-0000",
    cargo: "Sócio-Diretor",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2011-04-01",
  },
  {
    id: "mem-techminas-admin",
    organizacao_id: "org-techminas",
    nome: "Aline Rodrigues",
    email: "aline@techminas.com.br",
    cargo: "Gestora Comercial",
    role: "admin",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2019-10-15",
  },
  {
    id: "mem-ambiental-owner",
    organizacao_id: "org-ambiental-solutions",
    nome: "Rodrigo Paiva",
    email: "rodrigo@ambientalsolutions.com.br",
    cargo: "Sócio-Fundador",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2014-01-20",
  },
  {
    id: "mem-translog-owner",
    organizacao_id: "org-translog",
    nome: "Sérgio Moreira",
    email: "sergio@translogmg.com.br",
    cargo: "Diretor de Operações",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2008-06-10",
  },
  {
    id: "mem-construminas-owner",
    organizacao_id: "org-construminas",
    nome: "Beatriz Andrade",
    email: "beatriz@construminas.com.br",
    cargo: "Sócia-Engenheira",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2005-09-05",
  },
  {
    id: "mem-segwork-owner",
    organizacao_id: "org-segwork",
    nome: "Luciano Freitas",
    email: "luciano@segwork.com.br",
    cargo: "Sócio-Diretor",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2010-03-22",
  },
  {
    id: "mem-segwork-operador",
    organizacao_id: "org-segwork",
    nome: "Patrícia Nogueira",
    email: "patricia@segwork.com.br",
    cargo: "Consultora Sênior",
    role: "operador",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2016-07-11",
  },
  {
    id: "mem-metalurgica-xyz-owner",
    organizacao_id: "org-metalurgica-xyz",
    nome: "Augusto Ribeiro",
    email: "augusto@metalurgicaxyz.com.br",
    cargo: "Diretor-Presidente",
    role: "owner",
    ultimo_contexto_usado: "fornecedor",
    visivel_publicamente: true,
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "1998-05-18",
  },
  {
    id: "mem-metalurgica-xyz-admin",
    organizacao_id: "org-metalurgica-xyz",
    nome: "Isabela Martins",
    email: "isabela@metalurgicaxyz.com.br",
    cargo: "Gerente Comercial",
    role: "admin",
    ultimo_contexto_usado: "empresa",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2015-02-09",
  },
  {
    id: "mem-metalurgica-xyz-operador",
    organizacao_id: "org-metalurgica-xyz",
    nome: "Rafael Lemos",
    email: "rafael@metalurgicaxyz.com.br",
    cargo: "Analista de Projetos",
    role: "operador",
    ultimo_contexto_usado: "fornecedor",
    preferencias_notificacao: PREFERENCIAS_NOTIFICACAO_DEFAULT,
    ativo: true,
    desde: "2021-11-30",
  },
];

export function getMembrosByOrg(organizacao_id: string): Membro[] {
  return membros.filter((m) => m.organizacao_id === organizacao_id);
}

export function getMembroById(id: string): Membro | undefined {
  return membros.find((m) => m.id === id);
}
