import type { ContratoStatus } from "./_shared";

export interface Contrato {
  id: string;
  projeto_id: string;
  proposta_id: string;
  empresa_id: string;
  fornecedor_id: string;
  valor_final: string;
  data_fechamento: string;
  data_inicio?: string;
  data_fim_estimada?: string;
  data_fim_real?: string;
  visibilidade: "publico" | "fornecedores" | "privado";
  status: ContratoStatus;
  review_empresa_id?: string;
  review_fornecedor_id?: string;
  reviews_liberadas_em?: string;
}

export const contratos: Contrato[] = [
  {
    id: "ct-7",
    projeto_id: "7",
    proposta_id: "prop-ct-7",
    empresa_id: "vale",
    fornecedor_id: "1",
    valor_final: "R$ 145.000,00",
    data_fechamento: "14/02/2026",
    data_inicio: "2026-02-16",
    data_fim_real: "2026-03-12",
    visibilidade: "publico",
    status: "encerrado",
  },
  {
    id: "ct-8",
    projeto_id: "8",
    proposta_id: "prop-ct-8",
    empresa_id: "vale",
    fornecedor_id: "2",
    valor_final: "R$ 275.000,00",
    data_fechamento: "20/03/2026",
    data_inicio: "2026-03-22",
    visibilidade: "fornecedores",
    status: "cancelado",
  },
  {
    id: "ct-9",
    projeto_id: "9",
    proposta_id: "prop-ct-9",
    empresa_id: "usiminas",
    fornecedor_id: "1",
    valor_final: "R$ 92.000,00",
    data_fechamento: "18/01/2026",
    data_inicio: "2026-01-20",
    data_fim_estimada: "2026-04-30",
    visibilidade: "publico",
    status: "em_execucao",
  },
  {
    id: "ct-10",
    projeto_id: "10",
    proposta_id: "prop-ct-10",
    empresa_id: "arcelormittal",
    fornecedor_id: "2",
    valor_final: "R$ 185.000,00",
    data_fechamento: "25/01/2026",
    data_inicio: "2026-01-27",
    data_fim_real: "2026-03-15",
    visibilidade: "publico",
    status: "encerrado",
  },
  {
    id: "ct-11",
    projeto_id: "11",
    proposta_id: "prop-ct-11",
    empresa_id: "vale",
    fornecedor_id: "3",
    valor_final: "R$ 340.000,00",
    data_fechamento: "14/03/2026",
    data_inicio: "2026-03-16",
    data_fim_real: "2026-04-05",
    visibilidade: "publico",
    status: "encerrado",
  },
  {
    id: "ct-12",
    projeto_id: "12",
    proposta_id: "prop-ct-12",
    empresa_id: "usiminas",
    fornecedor_id: "4",
    valor_final: "R$ 520.000,00",
    data_fechamento: "18/02/2026",
    data_inicio: "2026-02-20",
    data_fim_real: "2026-04-01",
    visibilidade: "publico",
    status: "encerrado",
  },
  {
    id: "ct-13",
    projeto_id: "13",
    proposta_id: "prop-ct-13",
    empresa_id: "vale",
    fornecedor_id: "5",
    valor_final: "R$ 130.000,00",
    data_fechamento: "28/03/2026",
    data_inicio: "2026-03-30",
    data_fim_real: "2026-04-10",
    visibilidade: "publico",
    status: "encerrado",
  },
  {
    id: "ct-14",
    projeto_id: "14",
    proposta_id: "prop-ct-14",
    empresa_id: "arcelormittal",
    fornecedor_id: "5",
    valor_final: "R$ 65.000,00",
    data_fechamento: "19/02/2026",
    data_inicio: "2026-02-22",
    data_fim_real: "2026-03-08",
    visibilidade: "publico",
    status: "encerrado",
  },
];

export function getContratoById(id: string): Contrato | undefined {
  return contratos.find((c) => c.id === id);
}

export function getContratoByProjeto(projeto_id: string): Contrato | undefined {
  return contratos.find((c) => c.projeto_id === projeto_id);
}

export function getContratosByFornecedor(fornecedor_id: string): Contrato[] {
  return contratos.filter((c) => c.fornecedor_id === fornecedor_id);
}

export function getContratosByEmpresa(empresa_id: string): Contrato[] {
  return contratos.filter((c) => c.empresa_id === empresa_id);
}
