/**
 * Platform-level reference data managed by the ConectaFornece admin team.
 * These are canonical lists shared across all modules (empresa, fornecedor, admin).
 * In the real system these would be admin-editable; for the mockup they live here.
 */

export const regioes = [
  "Itabira - MG",
  "João Monlevade - MG",
  "Nova Era - MG",
  "Santa Maria de Itabira - MG",
  "Barão de Cocais - MG",
  "São Gonçalo do Rio Abaixo - MG",
  "Belo Horizonte - MG",
  "Ipatinga - MG",
];

// ---------------------------------------------------------------------------
// Hierarchical service catalog: setor → categoriaItem.
//
// Seeded from the FIEMG/PDIF "Diagnóstico de Capacidade Instalada"
// (see docs/diagnostico-capacidade-instalada.md). Each item carries the
// unit of measure (m³, HH, TON, …) used to declare and match capacity.
// ---------------------------------------------------------------------------

export type UnidadeMedida =
  | "HH" // Homem-hora
  | "TON" // Tonelada
  | "m3" // Metro cúbico
  | "m2" // Metro quadrado
  | "pecas"
  | "refeicao_dia"
  | "leitos"
  | "veiculos"
  | "km"
  | "servico"; // genérico para itens sem unidade dimensional clara

export interface UnidadeMedidaInfo {
  id: UnidadeMedida;
  label: string;
  abreviacao: string;
}

export const unidadesMedida: Record<UnidadeMedida, UnidadeMedidaInfo> = {
  HH: { id: "HH", label: "Homem-hora", abreviacao: "HH/mês" },
  TON: { id: "TON", label: "Tonelada", abreviacao: "ton/mês" },
  m3: { id: "m3", label: "Metro cúbico", abreviacao: "m³/mês" },
  m2: { id: "m2", label: "Metro quadrado", abreviacao: "m²/mês" },
  pecas: { id: "pecas", label: "Peças", abreviacao: "peças/mês" },
  refeicao_dia: { id: "refeicao_dia", label: "Refeição/dia", abreviacao: "refeições/dia" },
  leitos: { id: "leitos", label: "Leitos", abreviacao: "leitos" },
  veiculos: { id: "veiculos", label: "Veículos", abreviacao: "veículos" },
  km: { id: "km", label: "Quilômetro", abreviacao: "km/mês" },
  servico: { id: "servico", label: "Serviço", abreviacao: "contratos/mês" },
};

export interface Setor {
  id: string;
  nome: string;
}

export interface CategoriaItem {
  id: string;
  setor_id: string;
  nome: string;
  unidade_medida: UnidadeMedida;
  tem_classificacao_carga: boolean;
  equipamentos_sugeridos?: string[];
  tem_area_armazenamento?: boolean;
}

export const setores: Setor[] = [
  { id: "manutencao", nome: "Manutenção Industrial" },
  { id: "construcao-civil", nome: "Construção Civil" },
  { id: "estrutura-metalica", nome: "Estrutura Metálica e Caldeiraria" },
  { id: "engenharia-projetos", nome: "Engenharia e Projetos" },
  { id: "transporte-logistica", nome: "Transporte e Logística" },
  { id: "servicos-ambientais", nome: "Serviços Ambientais" },
  { id: "seguranca-trabalho", nome: "Segurança do Trabalho" },
  { id: "tecnologia-informacao", nome: "Tecnologia da Informação" },
  { id: "servicos-operacionais", nome: "Serviços Operacionais" },
  { id: "locacoes", nome: "Locações e Aluguéis" },
  { id: "uniformes-epis", nome: "Uniformes e EPIs" },
  { id: "alimentacao-hospedagem", nome: "Alimentação e Hospedagem" },
];

export const categoriaItens: CategoriaItem[] = [
  // --- Manutenção Industrial ---
  {
    id: "manut.preventiva-mecanica",
    setor_id: "manutencao",
    nome: "Manutenção Mecânica",
    unidade_medida: "HH",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: ["Ferramentas pneumáticas", "Tornos portáteis", "Solda elétrica", "Talhas e guinchos"],
  },
  {
    id: "manut.eletrica-automacao",
    setor_id: "manutencao",
    nome: "Manutenção Elétrica e Automação",
    unidade_medida: "HH",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: ["Multímetros", "Termovisor", "Analisador de qualidade", "Maleta de testes"],
  },
  {
    id: "manut.correias",
    setor_id: "manutencao",
    nome: "Manutenção de Correias Transportadoras",
    unidade_medida: "HH",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: ["Vulcanizadores", "Alinhador a laser", "Prensa de emenda"],
  },
  {
    id: "manut.predios-industriais",
    setor_id: "manutencao",
    nome: "Manutenção de Equipamentos e Prédios Industriais",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },

  // --- Construção Civil ---
  {
    id: "civil.terraplanagem",
    setor_id: "construcao-civil",
    nome: "Terraplanagem",
    unidade_medida: "m3",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: [
      "Tratores de esteira",
      "Motoniveladora",
      "Retroescavadeira",
      "Escavadeira",
      "Compactador Pé de Carneiro",
      "Compactador Liso",
      "Caminhões basculantes",
    ],
  },
  {
    id: "civil.construcoes-prediais",
    setor_id: "construcao-civil",
    nome: "Construções Prediais",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Betoneira", "Escoras metálicas", "Formas metálicas", "Vibrador de concreto"],
  },
  {
    id: "civil.volume-concreto",
    setor_id: "construcao-civil",
    nome: "Volume de Concreto",
    unidade_medida: "m3",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Betoneira", "Bomba de concreto", "Vibrador de concreto"],
  },
  {
    id: "civil.area-forma",
    setor_id: "construcao-civil",
    nome: "Área de Forma",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Formas metálicas", "Escoras metálicas"],
  },
  {
    id: "civil.areia-brita",
    setor_id: "construcao-civil",
    nome: "Areia e Brita",
    unidade_medida: "m3",
    tem_classificacao_carga: false,
  },
  {
    id: "civil.estradas",
    setor_id: "construcao-civil",
    nome: "Estradas Rodoviárias",
    unidade_medida: "km",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Usina de asfalto", "Motoniveladora", "Rolo Tander", "Rolo de Pneus"],
  },

  // --- Estrutura Metálica e Caldeiraria ---
  {
    id: "estr-met.estrutura-metalica",
    setor_id: "estrutura-metalica",
    nome: "Estrutura Metálica",
    unidade_medida: "TON",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: ["Pontes rolantes", "Cabines de pintura", "Jateamento", "Solda MIG/TIG"],
  },
  {
    id: "estr-met.caldeiraria",
    setor_id: "estrutura-metalica",
    nome: "Caldeiraria",
    unidade_medida: "TON",
    tem_classificacao_carga: true,
    equipamentos_sugeridos: ["Calandra", "Maçaricos", "Solda elétrica", "Plasma de corte"],
  },
  {
    id: "estr-met.componentes-sob-medida",
    setor_id: "estrutura-metalica",
    nome: "Componentes e Peças Sob Medida",
    unidade_medida: "pecas",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Torno CNC", "Fresadora", "Centro de usinagem", "Inspeção dimensional"],
  },
  {
    id: "estr-met.montagem-industrial",
    setor_id: "estrutura-metalica",
    nome: "Montagem Industrial",
    unidade_medida: "HH",
    tem_classificacao_carga: true,
  },

  // --- Engenharia e Projetos ---
  {
    id: "eng.gerenciamento-projetos",
    setor_id: "engenharia-projetos",
    nome: "Gerenciamento de Projetos e Obras",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "eng.basica-detalhamento",
    setor_id: "engenharia-projetos",
    nome: "Engenharia Básica e Detalhamento",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "eng.diligenciamento-inspecao",
    setor_id: "engenharia-projetos",
    nome: "Diligenciamento e Inspeção",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "eng.topografia",
    setor_id: "engenharia-projetos",
    nome: "Topografia",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Estação total", "GPS RTK", "Nível óptico", "Drone para topografia"],
  },

  // --- Transporte e Logística ---
  {
    id: "transp.carga-pesada",
    setor_id: "transporte-logistica",
    nome: "Transporte de Cargas Pesadas",
    unidade_medida: "TON",
    tem_classificacao_carga: true,
    tem_area_armazenamento: true,
    equipamentos_sugeridos: ["Carretas", "Pranchas", "Caminhões-truck"],
  },
  {
    id: "transp.pessoal",
    setor_id: "transporte-logistica",
    nome: "Transporte de Pessoal",
    unidade_medida: "veiculos",
    tem_classificacao_carga: false,
    equipamentos_sugeridos: ["Ônibus", "Microônibus", "Vans"],
  },
  {
    id: "transp.armazenamento",
    setor_id: "transporte-logistica",
    nome: "Armazenamento e Movimentação",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
    tem_area_armazenamento: true,
    equipamentos_sugeridos: ["Empilhadeiras", "Paleteiras", "Estanteria pesada"],
  },

  // --- Serviços Ambientais ---
  {
    id: "amb.tratamento-residuos",
    setor_id: "servicos-ambientais",
    nome: "Tratamento de Resíduos",
    unidade_medida: "TON",
    tem_classificacao_carga: false,
    tem_area_armazenamento: true,
  },
  {
    id: "amb.licenciamento-monitoramento",
    setor_id: "servicos-ambientais",
    nome: "Licenciamento e Monitoramento Ambiental",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "amb.supressao-vegetal",
    setor_id: "servicos-ambientais",
    nome: "Supressão Vegetal e Recuperação de Áreas",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
  },

  // --- Segurança do Trabalho ---
  {
    id: "sst.consultoria-laudos",
    setor_id: "seguranca-trabalho",
    nome: "Consultoria, Laudos e Programas SST",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "sst.treinamentos-nr",
    setor_id: "seguranca-trabalho",
    nome: "Treinamentos NR",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },

  // --- Tecnologia da Informação ---
  {
    id: "ti.desenvolvimento-suporte",
    setor_id: "tecnologia-informacao",
    nome: "Desenvolvimento e Suporte",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "ti.infra-redes",
    setor_id: "tecnologia-informacao",
    nome: "Infraestrutura e Redes",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },

  // --- Serviços Operacionais ---
  {
    id: "ops.vigilancia",
    setor_id: "servicos-operacionais",
    nome: "Vigilância",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "ops.limpeza-industrial",
    setor_id: "servicos-operacionais",
    nome: "Limpeza Industrial",
    unidade_medida: "HH",
    tem_classificacao_carga: true,
  },
  {
    id: "ops.limpeza-predial",
    setor_id: "servicos-operacionais",
    nome: "Limpeza Predial",
    unidade_medida: "HH",
    tem_classificacao_carga: false,
  },
  {
    id: "ops.jardinagem",
    setor_id: "servicos-operacionais",
    nome: "Jardinagem e Paisagismo",
    unidade_medida: "m2",
    tem_classificacao_carga: false,
  },

  // --- Locações e Aluguéis ---
  {
    id: "loc.veiculos",
    setor_id: "locacoes",
    nome: "Locação de Veículos",
    unidade_medida: "veiculos",
    tem_classificacao_carga: true,
  },
  {
    id: "loc.equipamentos",
    setor_id: "locacoes",
    nome: "Locação de Equipamentos Pesados",
    unidade_medida: "pecas",
    tem_classificacao_carga: true,
  },

  // --- Uniformes e EPIs ---
  {
    id: "unif.uniformes",
    setor_id: "uniformes-epis",
    nome: "Confecção de Uniformes",
    unidade_medida: "pecas",
    tem_classificacao_carga: false,
  },
  {
    id: "unif.epis",
    setor_id: "uniformes-epis",
    nome: "Fornecimento de EPIs",
    unidade_medida: "pecas",
    tem_classificacao_carga: false,
    tem_area_armazenamento: true,
  },

  // --- Alimentação e Hospedagem ---
  {
    id: "alim.restaurante",
    setor_id: "alimentacao-hospedagem",
    nome: "Restaurante e Refeições Industriais",
    unidade_medida: "refeicao_dia",
    tem_classificacao_carga: false,
  },
  {
    id: "alim.hotel",
    setor_id: "alimentacao-hospedagem",
    nome: "Hotel e Hospedagem",
    unidade_medida: "leitos",
    tem_classificacao_carga: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getSetorById(id: string): Setor | undefined {
  return setores.find((s) => s.id === id);
}

export function getCategoriaItemById(id: string): CategoriaItem | undefined {
  return categoriaItens.find((c) => c.id === id);
}

export function getItensBySetor(setorId: string): CategoriaItem[] {
  return categoriaItens.filter((c) => c.setor_id === setorId);
}

export function getUnidadeAbreviada(unidade: UnidadeMedida): string {
  return unidadesMedida[unidade]?.abreviacao ?? unidade;
}

// ---------------------------------------------------------------------------
// Legacy flat list — kept verbatim while consumers are migrated to the
// hierarchy above. Existing mock projects and suppliers reference these
// strings; do not edit until consumers are updated.
// TODO(capacidade-passo-N): remove once all consumers reference categoriaItens.
// ---------------------------------------------------------------------------

export const categorias = [
  "Manutenção Industrial",
  "Transporte e Logística",
  "Equipamentos de Mineração",
  "Serviços Ambientais",
  "Construção Civil",
  "Tecnologia da Informação",
  "Consultoria",
  "Segurança do Trabalho",
  "Elétrica e Automação",
  "Alimentação e Catering",
];
