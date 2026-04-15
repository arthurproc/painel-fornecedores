import type { StatusColor, StatusLabel } from "./_shared";

export const statusLabels: Record<string, StatusLabel> = {
  // Projeto
  rascunho: "Rascunho",
  publicado: "Publicado",
  em_triagem: "Em triagem",
  em_propostas: "Em propostas",
  fechado: "Fechado",
  cancelado: "Cancelado",
  expirado: "Expirado",
  // Proposta / Candidatura (legado mock + novos)
  enviada: "Enviada",
  shortlistada: "Shortlistada",
  descartada: "Descartada",
  expirada: "Expirada",
  retirada: "Retirada",
  vencedora: "Vencedora",
  perdedora: "Perdedora",
  // Contrato
  em_execucao: "Em execução",
  encerrado: "Encerrado",
  // Review
  submetida: "Submetida",
  liberada: "Liberada",
  // Legado (paredão mock antigo de Proposta)
  pendente: "Pendente",
  aceita: "Aceita",
  recusada: "Recusada",
};

export const statusColors: Record<string, StatusColor> = {
  rascunho: "bg-gray-100 text-gray-700",
  publicado: "bg-emerald-100 text-emerald-800",
  em_triagem: "bg-amber-100 text-amber-800",
  em_propostas: "bg-blue-100 text-blue-800",
  fechado: "bg-gray-200 text-gray-800",
  cancelado: "bg-red-100 text-red-800",
  expirado: "bg-gray-100 text-gray-600",
  enviada: "bg-blue-100 text-blue-800",
  shortlistada: "bg-emerald-100 text-emerald-800",
  descartada: "bg-red-100 text-red-800",
  expirada: "bg-gray-100 text-gray-600",
  retirada: "bg-gray-100 text-gray-700",
  vencedora: "bg-emerald-100 text-emerald-800",
  perdedora: "bg-red-100 text-red-800",
  em_execucao: "bg-blue-100 text-blue-800",
  encerrado: "bg-gray-200 text-gray-800",
  submetida: "bg-amber-100 text-amber-800",
  liberada: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  aceita: "bg-emerald-100 text-emerald-800",
  recusada: "bg-red-100 text-red-800",
};
