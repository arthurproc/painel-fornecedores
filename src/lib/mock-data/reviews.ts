import type { ReviewStatus } from "./_shared";

export interface Review {
  id: string;
  contrato_id: string;
  autor_membro_id: string;
  avaliado_org_tipo: "empresa" | "fornecedor";
  avaliado_org_id: string;
  notas: { [dimensao_id: string]: 1 | 2 | 3 | 4 | 5 };
  comentario: string;
  status: ReviewStatus;
  submetida_em?: string;
  liberada_em?: string;
}

export const reviews: Review[] = [
  // ct-7 — par liberado
  {
    id: "rev-ct-7-empresa",
    contrato_id: "ct-7",
    autor_membro_id: "mem-vale-admin",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-techminas",
    notas: {
      execucao: 5,
      prazo_execucao: 5,
      seguranca: 5,
      comunicacao_fornecedor: 5,
      relacionamento_fornecedor: 5,
    },
    comentario:
      "Excelente equipe, serviço entregue no prazo e dentro das especificações. Recomendamos fortemente.",
    status: "liberada",
    submetida_em: "2026-03-13",
    liberada_em: "2026-03-15",
  },
  {
    id: "rev-ct-7-fornecedor",
    contrato_id: "ct-7",
    autor_membro_id: "mem-techminas-owner",
    avaliado_org_tipo: "empresa",
    avaliado_org_id: "org-vale",
    notas: {
      pagamento: 5,
      clareza_escopo: 5,
      respeito_cronograma: 4,
      comunicacao_empresa: 5,
      relacionamento_empresa: 5,
    },
    comentario: "Processo muito organizado. Pagamento dentro do combinado.",
    status: "liberada",
    submetida_em: "2026-03-14",
    liberada_em: "2026-03-15",
  },
  // ct-10 — par liberado
  {
    id: "rev-ct-10-empresa",
    contrato_id: "ct-10",
    autor_membro_id: "mem-arcelormittal-owner",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-ambiental-solutions",
    notas: {
      execucao: 4,
      prazo_execucao: 5,
      seguranca: 4,
      comunicacao_fornecedor: 4,
      relacionamento_fornecedor: 5,
    },
    comentario:
      "Entregaram o RIMA dentro do prazo com documentação completa e precisa. Recomendamos.",
    status: "liberada",
    submetida_em: "2026-03-16",
    liberada_em: "2026-03-18",
  },
  {
    id: "rev-ct-10-fornecedor",
    contrato_id: "ct-10",
    autor_membro_id: "mem-ambiental-owner",
    avaliado_org_tipo: "empresa",
    avaliado_org_id: "org-arcelormittal",
    notas: {
      pagamento: 5,
      clareza_escopo: 4,
      respeito_cronograma: 5,
      comunicacao_empresa: 4,
      relacionamento_empresa: 5,
    },
    comentario: "Escopo podia ser mais detalhado inicialmente, mas suporte da equipe foi ótimo.",
    status: "liberada",
    submetida_em: "2026-03-17",
    liberada_em: "2026-03-18",
  },
  // ct-11 — apenas 1 submetida (aguardando par)
  {
    id: "rev-ct-11-empresa",
    contrato_id: "ct-11",
    autor_membro_id: "mem-vale-admin",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-translog",
    notas: {
      execucao: 5,
      prazo_execucao: 5,
      seguranca: 5,
      comunicacao_fornecedor: 4,
      relacionamento_fornecedor: 5,
    },
    comentario:
      "Transporte especializado executado com perfeição. Equipamentos chegaram sem nenhum incidente e no prazo exato.",
    status: "submetida",
    submetida_em: "2026-04-08",
  },
  // ct-12 — ambas em rascunho
  {
    id: "rev-ct-12-empresa",
    contrato_id: "ct-12",
    autor_membro_id: "mem-usiminas-admin",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-construminas",
    notas: {
      execucao: 4,
      prazo_execucao: 3,
      seguranca: 4,
      comunicacao_fornecedor: 3,
      relacionamento_fornecedor: 4,
    },
    comentario:
      "Qualidade boa, mas houve atrasos que impactaram o cronograma. Comunicação poderia melhorar.",
    status: "rascunho",
  },
  {
    id: "rev-ct-12-fornecedor",
    contrato_id: "ct-12",
    autor_membro_id: "mem-construminas-owner",
    avaliado_org_tipo: "empresa",
    avaliado_org_id: "org-usiminas",
    notas: {
      pagamento: 3,
      clareza_escopo: 3,
      respeito_cronograma: 3,
      comunicacao_empresa: 3,
      relacionamento_empresa: 4,
    },
    comentario: "Pagamentos com atraso prejudicaram o cronograma de compras.",
    status: "rascunho",
  },
  // ct-13 — par liberado
  {
    id: "rev-ct-13-empresa",
    contrato_id: "ct-13",
    autor_membro_id: "mem-vale-admin",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-segwork",
    notas: {
      execucao: 5,
      prazo_execucao: 5,
      seguranca: 5,
      comunicacao_fornecedor: 5,
      relacionamento_fornecedor: 5,
    },
    comentario:
      "PGR implementado com excelência técnica. Equipe extremamente qualificada e proativa em todo o processo.",
    status: "liberada",
    submetida_em: "2026-04-10",
    liberada_em: "2026-04-11",
  },
  {
    id: "rev-ct-13-fornecedor",
    contrato_id: "ct-13",
    autor_membro_id: "mem-segwork-owner",
    avaliado_org_tipo: "empresa",
    avaliado_org_id: "org-vale",
    notas: {
      pagamento: 5,
      clareza_escopo: 5,
      respeito_cronograma: 5,
      comunicacao_empresa: 5,
      relacionamento_empresa: 5,
    },
    comentario: "Parceria excelente — engajamento total do time da Vale.",
    status: "liberada",
    submetida_em: "2026-04-10",
    liberada_em: "2026-04-11",
  },
  // ct-14 — par liberado
  {
    id: "rev-ct-14-empresa",
    contrato_id: "ct-14",
    autor_membro_id: "mem-arcelormittal-owner",
    avaliado_org_tipo: "fornecedor",
    avaliado_org_id: "org-segwork",
    notas: {
      execucao: 5,
      prazo_execucao: 5,
      seguranca: 5,
      comunicacao_fornecedor: 5,
      relacionamento_fornecedor: 5,
    },
    comentario:
      "Treinamento impecável. Todos os colaboradores aprovados na primeira tentativa. Instrutores muito didáticos.",
    status: "liberada",
    submetida_em: "2026-03-09",
    liberada_em: "2026-03-11",
  },
  {
    id: "rev-ct-14-fornecedor",
    contrato_id: "ct-14",
    autor_membro_id: "mem-segwork-owner",
    avaliado_org_tipo: "empresa",
    avaliado_org_id: "org-arcelormittal",
    notas: {
      pagamento: 5,
      clareza_escopo: 5,
      respeito_cronograma: 5,
      comunicacao_empresa: 5,
      relacionamento_empresa: 5,
    },
    comentario: "Logística da ArcelorMittal excelente. Recebemos tudo o necessário no prazo.",
    status: "liberada",
    submetida_em: "2026-03-10",
    liberada_em: "2026-03-11",
  },
];

export function getReviewsByContrato(contrato_id: string): Review[] {
  return reviews.filter((r) => r.contrato_id === contrato_id);
}

export function getReviewsByAvaliado(
  avaliado_org_id: string,
  tipo: "empresa" | "fornecedor"
): Review[] {
  return reviews.filter(
    (r) =>
      r.avaliado_org_id === avaliado_org_id &&
      r.avaliado_org_tipo === tipo &&
      r.status === "liberada"
  );
}
