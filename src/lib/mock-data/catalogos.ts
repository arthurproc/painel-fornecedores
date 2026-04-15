export interface MotivoDescarte {
  id: string;
  nome: string;
  ativo: boolean;
}

export const motivosDescarte: MotivoDescarte[] = [
  { id: "fora_escopo", nome: "Fora de escopo", ativo: true },
  { id: "sem_capacidade", nome: "Sem capacidade", ativo: true },
  { id: "preco_fora", nome: "Preço fora", ativo: true },
  { id: "documentacao", nome: "Documentação incompleta", ativo: true },
  { id: "outro", nome: "Outro motivo", ativo: true },
];

export function getMotivoDescarteById(id: string): MotivoDescarte | undefined {
  return motivosDescarte.find((m) => m.id === id);
}

// Catálogo gerenciado pela admin Consultoria (decisão U1.6).
export interface TemplatePergunta {
  id: string;
  titulo: string;
  pergunta: string;
  categoria: string;
  ativo: boolean;
}

export const templatesPergunta: TemplatePergunta[] = [
  {
    id: "tpl-visita-tecnica",
    titulo: "Disponibilidade para visita técnica",
    pergunta: "Tem disponibilidade para visita técnica em [data]?",
    categoria: "Logística",
    ativo: true,
  },
  {
    id: "tpl-inicio-imediato",
    titulo: "Prazo de início",
    pergunta: "Qual a sua previsão de início após a assinatura?",
    categoria: "Logística",
    ativo: true,
  },
  {
    id: "tpl-documentacao",
    titulo: "Documentação faltante",
    pergunta: "Pode anexar [documento]? Precisamos para seguir com a avaliação.",
    categoria: "Documentação",
    ativo: true,
  },
  {
    id: "tpl-garantias",
    titulo: "Política de garantia",
    pergunta: "Qual garantia vocês oferecem para este tipo de serviço?",
    categoria: "Comercial",
    ativo: true,
  },
  {
    id: "tpl-referencias",
    titulo: "Referências de clientes",
    pergunta: "Podem compartilhar 2-3 referências de clientes do setor?",
    categoria: "Comercial",
    ativo: true,
  },
  {
    id: "tpl-certificacoes",
    titulo: "Certificações do time",
    pergunta: "Quais certificações atualmente vigentes a equipe do contrato terá?",
    categoria: "Técnica",
    ativo: true,
  },
  {
    id: "tpl-equipe",
    titulo: "Tamanho da equipe",
    pergunta: "Quantos profissionais serão alocados exclusivamente neste projeto?",
    categoria: "Técnica",
    ativo: true,
  },
  {
    id: "tpl-condicoes-pagamento",
    titulo: "Condições de pagamento",
    pergunta: "Quais as condições de pagamento aceitas?",
    categoria: "Comercial",
    ativo: true,
  },
  {
    id: "tpl-cronograma",
    titulo: "Cronograma detalhado",
    pergunta: "Podem enviar cronograma detalhado com marcos semanais?",
    categoria: "Logística",
    ativo: true,
  },
];

export function getTemplatePerguntaById(id: string): TemplatePergunta | undefined {
  return templatesPergunta.find((t) => t.id === id);
}

export interface ReviewDimensao {
  id: string;
  nome: string;
  aplica_a: "empresa" | "fornecedor";
  ordem: number;
  ativo: boolean;
}

export const reviewDimensoes: ReviewDimensao[] = [
  { id: "execucao", nome: "Execução / qualidade técnica", aplica_a: "fornecedor", ordem: 1, ativo: true },
  { id: "prazo_execucao", nome: "Cumprimento de prazo", aplica_a: "fornecedor", ordem: 2, ativo: true },
  { id: "seguranca", nome: "Segurança", aplica_a: "fornecedor", ordem: 3, ativo: true },
  { id: "comunicacao_fornecedor", nome: "Comunicação", aplica_a: "fornecedor", ordem: 4, ativo: true },
  { id: "relacionamento_fornecedor", nome: "Relacionamento geral", aplica_a: "fornecedor", ordem: 5, ativo: true },
  { id: "pagamento", nome: "Pagamento", aplica_a: "empresa", ordem: 1, ativo: true },
  { id: "clareza_escopo", nome: "Clareza de escopo", aplica_a: "empresa", ordem: 2, ativo: true },
  { id: "respeito_cronograma", nome: "Respeito ao cronograma", aplica_a: "empresa", ordem: 3, ativo: true },
  { id: "comunicacao_empresa", nome: "Comunicação", aplica_a: "empresa", ordem: 4, ativo: true },
  { id: "relacionamento_empresa", nome: "Relacionamento geral", aplica_a: "empresa", ordem: 5, ativo: true },
];

export function getReviewDimensao(id: string): ReviewDimensao | undefined {
  return reviewDimensoes.find((d) => d.id === id);
}
