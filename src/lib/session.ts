"use client";

import { useSyncExternalStore } from "react";
import {
  MEMBRO_LOGADO_ID,
  getMembroById,
  getOrganizacaoById,
  type Membro,
  type Organizacao,
} from "@/lib/mock-data";

export type ContextoAtivo = "empresa" | "fornecedor" | "admin";

type ContextoTenant = Exclude<ContextoAtivo, "admin">;

interface SessaoSnapshot {
  membroLogado: Membro;
  organizacaoAtiva: Organizacao;
  contextosTenantDisponiveis: ContextoTenant[];
  contextoAtivo: ContextoAtivo;
}

const fallbackMembro: Membro = {
  id: "fallback",
  organizacao_id: "org-metalurgica-xyz",
  nome: "Membro Mock",
  email: "membro.mock@conectafornece.com.br",
  cargo: "Administrador",
  role: "admin",
  ultimo_contexto_usado: "empresa",
  ativo: true,
  desde: "2026-01-01",
};

const membroLogado = getMembroById(MEMBRO_LOGADO_ID) ?? fallbackMembro;

const fallbackOrganizacao: Organizacao = {
  id: "org-metalurgica-xyz",
  razao_social: "Metalúrgica XYZ Indústria e Comércio Ltda.",
  cnpj: "62.345.678/0001-06",
  endereco_fiscal: "Distrito Industrial Quadra 12 — João Monlevade/MG",
  perfil_empresa_ativo: true,
  perfil_fornecedor_ativo: true,
  perfil_primeiro_escolhido: "empresa",
  linkage_publica: true,
  slug: "metalurgica-xyz",
  desde: "1998",
  ativo: true,
};

const organizacaoAtiva =
  getOrganizacaoById(membroLogado.organizacao_id) ?? fallbackOrganizacao;

const contextosTenantDisponiveis: ContextoTenant[] = [];
if (organizacaoAtiva.perfil_empresa_ativo) {
  contextosTenantDisponiveis.push("empresa");
}
if (organizacaoAtiva.perfil_fornecedor_ativo) {
  contextosTenantDisponiveis.push("fornecedor");
}

let contextoAtivo: ContextoAtivo =
  membroLogado.ultimo_contexto_usado ??
  contextosTenantDisponiveis[0] ??
  organizacaoAtiva.perfil_primeiro_escolhido;

const sessaoSnapshot: SessaoSnapshot = {
  membroLogado,
  organizacaoAtiva,
  contextosTenantDisponiveis,
  contextoAtivo,
};

const listeners = new Set<() => void>();

function emitirAtualizacao() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SessaoSnapshot {
  return sessaoSnapshot;
}

export function setContextoAtivo(novoContexto: ContextoAtivo) {
  if (novoContexto === "admin") {
    contextoAtivo = novoContexto;
    sessaoSnapshot.contextoAtivo = novoContexto;
    emitirAtualizacao();
    return;
  }

  if (!contextosTenantDisponiveis.includes(novoContexto)) {
    return;
  }

  contextoAtivo = novoContexto;
  membroLogado.ultimo_contexto_usado = novoContexto;
  sessaoSnapshot.contextoAtivo = novoContexto;
  emitirAtualizacao();
}

export function useSessaoMock() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useContextoAtivo() {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().contextoAtivo,
    () => getSnapshot().contextoAtivo
  );
}
