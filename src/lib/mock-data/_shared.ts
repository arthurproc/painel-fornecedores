export type Id = string;
export type IsoDate = string;

export type StatusLabel = string;
export type StatusColor = string;

export type ProjetoStatus =
  | "rascunho"
  | "publicado"
  | "em_triagem"
  | "em_propostas"
  | "fechado"
  | "cancelado"
  | "expirado";

export type CandidaturaStatus =
  | "rascunho"
  | "enviada"
  | "shortlistada"
  | "descartada"
  | "expirada"
  | "retirada";

export type PropostaStatus =
  | "rascunho"
  | "enviada"
  | "vencedora"
  | "perdedora"
  | "retirada";

export type ContratoStatus = "em_execucao" | "encerrado" | "cancelado";

export type ReviewStatus = "rascunho" | "submetida" | "liberada";

export type SessaoConsultoriaStatus =
  | "solicitada"
  | "atribuida"
  | "em_andamento"
  | "entregue"
  | "cancelada";

export type Severidade = "critica" | "importante" | "informativa";
