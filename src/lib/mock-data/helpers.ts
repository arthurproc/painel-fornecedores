import { candidaturas, type Candidatura } from "./candidaturas";
import { contratos, type Contrato } from "./contratos";
import { conversas, type Conversa } from "./conversas";
import { empresas, type Empresa } from "./empresas";
import { fornecedores, type Fornecedor } from "./fornecedores";
import { projetos, type Projeto, _registrarContagensProjeto } from "./projetos";
import { propostas, type Proposta } from "./propostas";

export function nomeEmpresa(projeto: Projeto): string {
  return empresas.find((e) => e.id === projeto.empresa_id)?.nome ?? "Empresa";
}

export function logoEmpresa(projeto: Projeto): string {
  return empresas.find((e) => e.id === projeto.empresa_id)?.logo ?? "?";
}

export function logoFornecedor(id: string): string {
  return fornecedores.find((f) => f.id === id)?.logo ?? "?";
}

export interface CandidaturaView {
  candidatura: Candidatura;
  fornecedor: Fornecedor | undefined;
  projeto: Projeto | undefined;
  empresa: Empresa | undefined;
}

export function candidaturaView(candidatura: Candidatura): CandidaturaView {
  const projeto = projetos.find((p) => p.id === candidatura.projeto_id);
  const empresa = projeto
    ? empresas.find((e) => e.id === projeto.empresa_id)
    : undefined;
  const fornecedor = fornecedores.find((f) => f.id === candidatura.fornecedor_id);
  return { candidatura, fornecedor, projeto, empresa };
}

export interface PropostaView {
  proposta: Proposta;
  candidatura: Candidatura | undefined;
  fornecedor: Fornecedor | undefined;
  projeto: Projeto | undefined;
  empresa: Empresa | undefined;
}

export function propostaView(proposta: Proposta): PropostaView {
  const candidatura = candidaturas.find((c) => c.id === proposta.candidatura_id);
  const projeto = candidatura
    ? projetos.find((p) => p.id === candidatura.projeto_id)
    : undefined;
  const empresa = projeto
    ? empresas.find((e) => e.id === projeto.empresa_id)
    : undefined;
  const fornecedor = candidatura
    ? fornecedores.find((f) => f.id === candidatura.fornecedor_id)
    : undefined;
  return { proposta, candidatura, fornecedor, projeto, empresa };
}

// Registra contagens de projeto computadas das candidaturas/propostas reais.
function _bootstrap() {
  const candCount: Record<string, number> = {};
  const propCount: Record<string, number> = {};
  const shortCount: Record<string, number> = {};
  for (const c of candidaturas) {
    if (c.status === "enviada" || c.status === "shortlistada") {
      candCount[c.projeto_id] = (candCount[c.projeto_id] ?? 0) + 1;
    }
    if (c.status === "shortlistada") {
      shortCount[c.projeto_id] = (shortCount[c.projeto_id] ?? 0) + 1;
    }
  }
  for (const p of propostas) {
    const cand = candidaturas.find((c) => c.id === p.candidatura_id);
    if (cand && p.status !== "rascunho") {
      propCount[cand.projeto_id] = (propCount[cand.projeto_id] ?? 0) + 1;
    }
  }
  _registrarContagensProjeto(candCount, propCount, shortCount);
}

_bootstrap();

export function getCandidaturasPorProjeto(projeto_id: string): Candidatura[] {
  return candidaturas.filter((c) => c.projeto_id === projeto_id);
}

export function getPropostasPorProjeto(projeto_id: string): Proposta[] {
  return propostas.filter((p) => {
    const cand = candidaturas.find((c) => c.id === p.candidatura_id);
    return cand?.projeto_id === projeto_id;
  });
}

export function getContratosPorOrg(organizacao_id: string): Contrato[] {
  const empresa = empresas.find((e) => e.organizacao_id === organizacao_id);
  const fornecedor = fornecedores.find((f) => f.organizacao_id === organizacao_id);
  return contratos.filter(
    (c) =>
      (empresa && c.empresa_id === empresa.id) ||
      (fornecedor && c.fornecedor_id === fornecedor.id)
  );
}

export function getConversasPorCandidatura(candidatura_id: string): Conversa[] {
  return conversas.filter((c) => c.candidatura_id === candidatura_id);
}

export function computeContagensProjeto(projeto_id: string): {
  candidaturas: number;
  shortlist: number;
  propostas: number;
} {
  const cands = candidaturas.filter((c) => c.projeto_id === projeto_id);
  const shortlist = cands.filter((c) => c.status === "shortlistada").length;
  const props = propostas.filter((p) => {
    const cand = candidaturas.find((c) => c.id === p.candidatura_id);
    return cand?.projeto_id === projeto_id && p.status !== "rascunho";
  }).length;
  return {
    candidaturas: cands.filter(
      (c) => c.status === "enviada" || c.status === "shortlistada"
    ).length,
    shortlist,
    propostas: props,
  };
}
