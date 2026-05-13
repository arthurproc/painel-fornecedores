import { computeReputacao, type ReputacaoAgregada } from "./reputacao";
import { getCredencialNome, resolveCredencialId } from "@/lib/platform-credentials";

export type DocumentoEmpresaTipo =
  | "credencial"
  | "portfolio"
  | "seguro"
  | "laudo"
  | "outro";

export type DocumentoEmpresaStatus = "vigente" | "vencido" | "em_analise";

export interface DocumentoEmpresa {
  id: string;
  nome: string;
  tipo: DocumentoEmpresaTipo;
  credencial_id?: string;
  arquivo_nome: string;
  arquivo_caminho: string;
  validade?: string;
  status: DocumentoEmpresaStatus;
  enviado_em: string;
  observacao?: string;
}

export type ClassificacaoCarga = "leve" | "medio" | "pesado";

export interface EquipamentoDeclarado {
  nome: string;
  quantidade: number;
}

/**
 * Capacidade instalada por item do catálogo. Inerente ao fornecedor — preenche
 * uma vez, reaproveita em toda candidatura. Ver docs/diagnostico-capacidade-instalada.md.
 */
export interface CapacidadeInstalada {
  id: string;
  categoria_item_id: string;
  classificacao?: ClassificacaoCarga;
  capacidade_nominal_mensal: number;
  /** 0-100. Privado por padrão — só exposto à empresa após candidatura. */
  percent_utilizacao_atual: number;
  equipamentos: EquipamentoDeclarado[];
  area_armazenamento_m2?: number;
  observacao?: string;
  atualizada_em: string;
}

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
  credenciais_ids: string[];
  documentos_empresa: DocumentoEmpresa[];
  /** @deprecated Migrar para `capacidades_instaladas`. Mantido durante transição. */
  capacidade_atual?: string;
  capacidades_instaladas: CapacidadeInstalada[];
  projetosRealizados: number;
  desde: string;
  contato: {
    email: string;
    telefone: string;
  };
  contratos_destacaveis_ids: string[];
  reputacao_agregada: ReputacaoAgregada;
}

function documentoEmpresa(seed: DocumentoEmpresa): DocumentoEmpresa {
  return seed;
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
     credenciais_ids: ["iso_9001", "nr_22", "nr_10", "nr_35"],
     documentos_empresa: [
       documentoEmpresa({
         id: "doc-tech-iso-9001",
         nome: "Certificado ISO 9001 vigente",
         tipo: "credencial",
         credencial_id: "iso_9001",
         arquivo_nome: "certificado-iso-9001-techminas.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/1/certificado-iso-9001-techminas.pdf",
         validade: "2026-12-31",
         status: "vigente",
         enviado_em: "2026-02-10",
       }),
       documentoEmpresa({
         id: "doc-tech-nr-22",
         nome: "Certificado NR-22 vigente",
         tipo: "credencial",
         credencial_id: "nr_22",
         arquivo_nome: "certificado-nr-22-techminas.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/1/certificado-nr-22-techminas.pdf",
         validade: "2026-11-10",
         status: "vigente",
         enviado_em: "2026-01-25",
       }),
     ],
     capacidade_atual: "15 técnicos disponíveis",
     capacidades_instaladas: [
       {
         id: "cap-tech-mec",
         categoria_item_id: "manut.preventiva-mecanica",
         classificacao: "pesado",
         capacidade_nominal_mensal: 2400,
         percent_utilizacao_atual: 65,
         equipamentos: [
           { nome: "Solda elétrica", quantidade: 6 },
           { nome: "Tornos portáteis", quantidade: 3 },
           { nome: "Talhas e guinchos", quantidade: 4 },
         ],
         observacao: "Equipe 15 técnicos com cobertura 24/7 para mineração.",
         atualizada_em: "2026-04-20",
       },
       {
         id: "cap-tech-correias",
         categoria_item_id: "manut.correias",
         classificacao: "pesado",
         capacidade_nominal_mensal: 1600,
         percent_utilizacao_atual: 70,
         equipamentos: [
           { nome: "Vulcanizadores", quantidade: 4 },
           { nome: "Alinhador a laser", quantidade: 2 },
         ],
         atualizada_em: "2026-04-20",
       },
       {
         id: "cap-tech-eletrica",
         categoria_item_id: "manut.eletrica-automacao",
         classificacao: "medio",
         capacidade_nominal_mensal: 1200,
         percent_utilizacao_atual: 50,
         equipamentos: [
           { nome: "Multímetros", quantidade: 8 },
           { nome: "Termovisor", quantidade: 2 },
         ],
         atualizada_em: "2026-04-20",
       },
     ],
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
     credenciais_ids: ["iso_14001", "licenca_ibama", "crea_mg"],
     documentos_empresa: [
       documentoEmpresa({
         id: "doc-amb-ibama",
         nome: "Licença IBAMA vigente",
         tipo: "credencial",
         credencial_id: "licenca_ibama",
         arquivo_nome: "licenca-ibama-ambiental-solutions.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/2/licenca-ibama-ambiental-solutions.pdf",
         validade: "2026-10-30",
         status: "vigente",
         enviado_em: "2026-01-18",
       }),
     ],
     capacidades_instaladas: [
       {
         id: "cap-amb-licenciamento",
         categoria_item_id: "amb.licenciamento-monitoramento",
         capacidade_nominal_mensal: 1800,
         percent_utilizacao_atual: 55,
         equipamentos: [
           { nome: "Estação meteorológica portátil", quantidade: 2 },
           { nome: "Kit coleta de águas", quantidade: 4 },
         ],
         atualizada_em: "2026-04-15",
       },
       {
         id: "cap-amb-residuos",
         categoria_item_id: "amb.tratamento-residuos",
         capacidade_nominal_mensal: 320,
         percent_utilizacao_atual: 40,
         equipamentos: [
           { nome: "Caminhões coletores", quantidade: 5 },
           { nome: "Caçambas estacionárias", quantidade: 20 },
         ],
         area_armazenamento_m2: 1200,
         atualizada_em: "2026-04-15",
       },
       {
         id: "cap-amb-supressao",
         categoria_item_id: "amb.supressao-vegetal",
         capacidade_nominal_mensal: 45000,
         percent_utilizacao_atual: 30,
         equipamentos: [
           { nome: "Motosserras", quantidade: 8 },
           { nome: "Triturador florestal", quantidade: 1 },
         ],
         atualizada_em: "2026-04-15",
       },
     ],
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
     credenciais_ids: ["rntrc", "iso_9001", "sassmaq"],
     documentos_empresa: [
       documentoEmpresa({
         id: "doc-trans-rntrc",
         nome: "Comprovante RNTRC vigente",
         tipo: "credencial",
         credencial_id: "rntrc",
         arquivo_nome: "rntrc-translog.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/3/rntrc-translog.pdf",
         validade: "2026-09-12",
         status: "vigente",
         enviado_em: "2026-03-04",
       }),
     ],
     capacidades_instaladas: [
       {
         id: "cap-trans-carga",
         categoria_item_id: "transp.carga-pesada",
         classificacao: "pesado",
         capacidade_nominal_mensal: 12000,
         percent_utilizacao_atual: 75,
         equipamentos: [
           { nome: "Carretas", quantidade: 40 },
           { nome: "Pranchas", quantidade: 6 },
           { nome: "Caminhões-truck", quantidade: 12 },
         ],
         area_armazenamento_m2: 4500,
         observacao: "Frota com rastreamento em tempo real e cobertura ES/MG.",
         atualizada_em: "2026-04-30",
       },
       {
         id: "cap-trans-pessoal",
         categoria_item_id: "transp.pessoal",
         capacidade_nominal_mensal: 18,
         percent_utilizacao_atual: 60,
         equipamentos: [
           { nome: "Ônibus", quantidade: 6 },
           { nome: "Microônibus", quantidade: 8 },
           { nome: "Vans", quantidade: 4 },
         ],
         atualizada_em: "2026-04-30",
       },
     ],
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
     credenciais_ids: ["crea_mg", "iso_9001", "pbqp_h"],
     documentos_empresa: [],
     capacidades_instaladas: [
       {
         id: "cap-cm-prediais",
         categoria_item_id: "civil.construcoes-prediais",
         capacidade_nominal_mensal: 3500,
         percent_utilizacao_atual: 80,
         equipamentos: [
           { nome: "Betoneiras", quantidade: 4 },
           { nome: "Andaimes (jogos)", quantidade: 30 },
           { nome: "Formas metálicas", quantidade: 200 },
         ],
         observacao: "Equipe completa de obra civil para reformas industriais.",
         atualizada_em: "2026-03-22",
       },
       {
         id: "cap-cm-concreto",
         categoria_item_id: "civil.volume-concreto",
         capacidade_nominal_mensal: 850,
         percent_utilizacao_atual: 70,
         equipamentos: [
           { nome: "Betoneiras", quantidade: 4 },
           { nome: "Bomba de concreto", quantidade: 1 },
           { nome: "Vibradores de concreto", quantidade: 6 },
         ],
         atualizada_em: "2026-03-22",
       },
     ],
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
     credenciais_ids: ["mte", "iso_45001"],
     documentos_empresa: [
       documentoEmpresa({
         id: "doc-seg-mte",
         nome: "Registro no MTE vigente",
         tipo: "credencial",
         credencial_id: "mte",
         arquivo_nome: "registro-mte-segwork.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/5/registro-mte-segwork.pdf",
         validade: "2026-08-20",
         status: "vigente",
         enviado_em: "2026-02-12",
       }),
     ],
     capacidades_instaladas: [
       {
         id: "cap-sw-consultoria",
         categoria_item_id: "sst.consultoria-laudos",
         capacidade_nominal_mensal: 1400,
         percent_utilizacao_atual: 60,
         equipamentos: [
           { nome: "Dosímetros de ruído", quantidade: 10 },
           { nome: "Bombas amostradoras", quantidade: 6 },
         ],
         observacao: "Equipe sênior multidisciplinar (engenharia, técnicos, médico).",
         atualizada_em: "2026-04-05",
       },
       {
         id: "cap-sw-treinamentos",
         categoria_item_id: "sst.treinamentos-nr",
         capacidade_nominal_mensal: 960,
         percent_utilizacao_atual: 45,
         equipamentos: [
           { nome: "Salas equipadas", quantidade: 3 },
         ],
         atualizada_em: "2026-04-05",
       },
     ],
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
     credenciais_ids: ["iso_9001", "crea_mg", "nr_10"],
     documentos_empresa: [
       documentoEmpresa({
         id: "doc-mx-iso-9001",
         nome: "Certificado ISO 9001 vigente",
         tipo: "credencial",
         credencial_id: "iso_9001",
         arquivo_nome: "certificado-iso-9001-metalurgica-xyz.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/6/certificado-iso-9001-metalurgica-xyz.pdf",
         validade: "2026-12-18",
         status: "vigente",
         enviado_em: "2026-03-18",
       }),
       documentoEmpresa({
         id: "doc-mx-crea",
         nome: "Registro CREA-MG vigente",
         tipo: "credencial",
         credencial_id: "crea_mg",
         arquivo_nome: "registro-crea-metalurgica-xyz.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/6/registro-crea-metalurgica-xyz.pdf",
         validade: "2026-11-30",
         status: "vigente",
         enviado_em: "2026-03-25",
       }),
       documentoEmpresa({
         id: "doc-mx-portfolio-contratos",
         nome: "Portfólio de contratos similares",
         tipo: "portfolio",
         arquivo_nome: "portfolio-contratos-metalurgica-xyz.pdf",
         arquivo_caminho: "/mock-storage/fornecedores/6/portfolio-contratos-metalurgica-xyz.pdf",
         status: "vigente",
         enviado_em: "2026-04-06",
         observacao: "Material salvo a partir de candidatura anterior para reaproveitamento.",
       }),
     ],
     capacidade_atual: "Em expansão",
     capacidades_instaladas: [
       {
         id: "cap-mx-caldeiraria",
         categoria_item_id: "estr-met.caldeiraria",
         classificacao: "pesado",
         capacidade_nominal_mensal: 95,
         percent_utilizacao_atual: 35,
         equipamentos: [
           { nome: "Calandra", quantidade: 1 },
           { nome: "Maçaricos", quantidade: 4 },
           { nome: "Solda elétrica", quantidade: 6 },
           { nome: "Plasma de corte", quantidade: 1 },
         ],
         observacao: "Em expansão — nova nave em fase final de montagem.",
         atualizada_em: "2026-04-12",
       },
       {
         id: "cap-mx-componentes",
         categoria_item_id: "estr-met.componentes-sob-medida",
         capacidade_nominal_mensal: 320,
         percent_utilizacao_atual: 50,
         equipamentos: [
           { nome: "Torno CNC", quantidade: 2 },
           { nome: "Fresadora", quantidade: 1 },
           { nome: "Inspeção dimensional", quantidade: 1 },
         ],
         atualizada_em: "2026-04-12",
       },
     ],
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

export function getFornecedorCredenciaisNomes(fornecedor: Fornecedor): string[] {
  return fornecedor.credenciais_ids.map((credencialId) => getCredencialNome(credencialId));
}

export function countDocumentosVigentes(fornecedor: Fornecedor): number {
  return fornecedor.documentos_empresa.filter((documento) => documento.status === "vigente").length;
}

export function countCredenciaisSemComprovante(fornecedor: Fornecedor): number {
  return fornecedor.credenciais_ids.filter((credencialId) => {
    return !fornecedor.documentos_empresa.some(
      (documento) => documento.credencial_id === credencialId && documento.status === "vigente"
    );
  }).length;
}

export function addCredencialToFornecedor(fornecedorId: string, credencialId: string) {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor || fornecedor.credenciais_ids.includes(credencialId)) {
    return fornecedor;
  }
  fornecedor.credenciais_ids.push(credencialId);
  return fornecedor;
}

export function removeCredencialFromFornecedor(fornecedorId: string, credencialId: string) {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor) return fornecedor;
  fornecedor.credenciais_ids = fornecedor.credenciais_ids.filter((id) => id !== credencialId);
  return fornecedor;
}

interface AddDocumentoEmpresaInput {
  nome: string;
  tipo: DocumentoEmpresaTipo;
  credencial_id?: string;
  arquivo_nome: string;
  arquivo_caminho?: string;
  validade?: string;
  status: DocumentoEmpresaStatus;
  enviado_em?: string;
  observacao?: string;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function addDocumentoEmpresa(
  fornecedorId: string,
  input: AddDocumentoEmpresaInput
): DocumentoEmpresa | undefined {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor) return undefined;

  const id = `doc-${fornecedorId}-${fornecedor.documentos_empresa.length + 1}`;
  const arquivoCaminho =
    input.arquivo_caminho ??
    `/mock-storage/fornecedores/${fornecedorId}/${slugify(input.arquivo_nome || input.nome)}`;

  const documento: DocumentoEmpresa = {
    id,
    nome: input.nome,
    tipo: input.tipo,
    credencial_id: input.credencial_id,
    arquivo_nome: input.arquivo_nome,
    arquivo_caminho: arquivoCaminho,
    validade: input.validade,
    status: input.status,
    enviado_em: input.enviado_em ?? "2026-04-15",
    observacao: input.observacao,
  };

  fornecedor.documentos_empresa.unshift(documento);
  if (input.credencial_id && !fornecedor.credenciais_ids.includes(input.credencial_id)) {
    fornecedor.credenciais_ids.push(input.credencial_id);
  }
  return documento;
}

// ---------------------------------------------------------------------------
// Mutations on capacidades_instaladas
// ---------------------------------------------------------------------------

export type CapacidadeInput = Omit<CapacidadeInstalada, "id" | "atualizada_em">;

export function addCapacidadeToFornecedor(
  fornecedorId: string,
  input: CapacidadeInput
): CapacidadeInstalada | undefined {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor) return undefined;
  const capacidade: CapacidadeInstalada = {
    ...input,
    id: `cap-${fornecedorId}-${fornecedor.capacidades_instaladas.length + 1}`,
    atualizada_em: hoje(),
  };
  fornecedor.capacidades_instaladas.push(capacidade);
  return capacidade;
}

export function updateCapacidadeOfFornecedor(
  fornecedorId: string,
  capacidadeId: string,
  patch: Partial<CapacidadeInput>
): CapacidadeInstalada | undefined {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor) return undefined;
  const idx = fornecedor.capacidades_instaladas.findIndex((c) => c.id === capacidadeId);
  if (idx < 0) return undefined;
  const atual = fornecedor.capacidades_instaladas[idx];
  fornecedor.capacidades_instaladas[idx] = {
    ...atual,
    ...patch,
    atualizada_em: hoje(),
  };
  return fornecedor.capacidades_instaladas[idx];
}

export function removeCapacidadeFromFornecedor(
  fornecedorId: string,
  capacidadeId: string
): void {
  const fornecedor = getFornecedorById(fornecedorId);
  if (!fornecedor) return;
  fornecedor.capacidades_instaladas = fornecedor.capacidades_instaladas.filter(
    (c) => c.id !== capacidadeId
  );
}

function hoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getCredencialIdsFromLegacyNames(names: string[]): string[] {
  return Array.from(
    new Set(
      names
        .map((name) => resolveCredencialId(name))
        .filter((value): value is string => Boolean(value))
    )
  );
}
