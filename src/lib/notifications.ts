"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getMembroById,
  notificacoes,
  PREFERENCIAS_NOTIFICACAO_DEFAULT,
  type Notificacao,
  type PreferenciasNotificacao,
  type Severidade,
} from "@/lib/mock-data";

export type NotificationContext = "empresa" | "fornecedor" | "consultoria" | "sistema";
export type NotificationPeriod = "todos" | "7d" | "30d" | "90d";
type NotificationEntity = NonNullable<Notificacao["contexto_ref"]>["entidade"];

export interface NotificationListItem {
  id: string;
  notificationIds: string[];
  type: string;
  severity: Severidade;
  title: string;
  body?: string;
  actionUrl: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
  count: number;
  context: NotificationContext;
}

export const notificationPreferenceGroups = [
  {
    id: "criticas_handshake",
    titulo: "Shortlist, proposta formal e contratos",
    descricao: "Eventos críticos do handshake comercial.",
  },
  {
    id: "criticas_consultoria",
    titulo: "Sessões críticas da Consultoria",
    descricao: "Atribuição e entrega de sessões de Consultoria.",
  },
  {
    id: "importantes_comunicacao",
    titulo: "Novas mensagens",
    descricao: "Conversas ativas com empresas e fornecedores.",
  },
  {
    id: "importantes_empresa",
    titulo: "Candidaturas e reviews do contexto empresa",
    descricao: "Triagem, lembretes operacionais e avaliação pós-contrato.",
  },
  {
    id: "importantes_fornecedor",
    titulo: "Atualizações do contexto fornecedor",
    descricao: "Descarte, outreach, feedback e revisões da contraparte.",
  },
  {
    id: "importantes_admin",
    titulo: "Operação da Consultoria",
    descricao: "Fila de sessões, outcomes e alertas do owner/advisor.",
  },
  {
    id: "informativas_descoberta",
    titulo: "Descoberta e oportunidades",
    descricao: "Projetos compatíveis, leads e marcos informativos.",
  },
  {
    id: "informativas_conteudo",
    titulo: "Conteúdo e estudos de caso",
    descricao: "Estudos publicados, avaliações e aprendizados.",
  },
  {
    id: "informativas_tenant",
    titulo: "Tenant e organização",
    descricao: "Membros, roles e mudanças estruturais da organização.",
  },
] as const;

const listeners = new Set<() => void>();
const MOCK_NOW = new Date("2026-04-15T12:00:00");
const AUTO_ARCHIVE_DAYS = 90;
let snapshotVersion = 0;
const notificationsByMemberCache = new Map<string, { version: number; value: Notificacao[] }>();
const preferencesByMemberCache = new Map<
  string,
  { version: number; value: PreferenciasNotificacao }
>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  autoArchiveNotifications();
  snapshotVersion += 1;
  notificationsByMemberCache.clear();
  preferencesByMemberCache.clear();
  listeners.forEach((listener) => listener());
}

function clonePreferences(preferences: PreferenciasNotificacao): PreferenciasNotificacao {
  return {
    atualizado_em: preferences.atualizado_em,
    preferencias: Object.fromEntries(
      Object.entries(preferences.preferencias).map(([group, value]) => [group, { ...value }])
    ),
  };
}

function toDate(value: string) {
  if (value.includes("T")) {
    return new Date(value);
  }

  return new Date(`${value}T12:00:00`);
}

function diffDays(date: Date) {
  return (MOCK_NOW.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function autoArchiveNotifications() {
  notificacoes.forEach((notification) => {
    if (!notification.lida || notification.arquivada) {
      return;
    }

    if (diffDays(toDate(notification.criada_em)) >= AUTO_ARCHIVE_DAYS) {
      notification.arquivada = true;
    }
  });
}

function getNotificationsSnapshot() {
  autoArchiveNotifications();
  return notificacoes;
}

function getPreferencesSnapshot(memberId: string) {
  const cached = preferencesByMemberCache.get(memberId);
  if (cached && cached.version === snapshotVersion) {
    return cached.value;
  }

  const member = getMembroById(memberId);
  const value = member?.preferencias_notificacao ?? clonePreferences(PREFERENCIAS_NOTIFICACAO_DEFAULT);
  preferencesByMemberCache.set(memberId, { version: snapshotVersion, value });
  return value;
}

function getNotificationsByMemberSnapshot(memberId: string) {
  const cached = notificationsByMemberCache.get(memberId);
  if (cached && cached.version === snapshotVersion) {
    return cached.value;
  }

  const value = getNotificationsSnapshot().filter(
    (notification) => notification.destinatario_membro_id === memberId
  );
  notificationsByMemberCache.set(memberId, { version: snapshotVersion, value });
  return value;
}

export function getNotificationContext(tipo: string): NotificationContext {
  if (tipo.startsWith("E")) {
    return "empresa";
  }
  if (tipo.startsWith("F")) {
    return "fornecedor";
  }
  if (tipo.startsWith("C") || tipo.startsWith("O")) {
    return "consultoria";
  }
  return "sistema";
}

function stripBold(value: string) {
  return value.replace(/\*\*/g, "").trim();
}

function buildGroupedTitle(base: Notificacao, count: number) {
  if (count <= 1) {
    return stripBold(base.titulo);
  }

  const target = stripBold(base.corpo ?? "este item");
  if (base.tipo === "E1") {
    return `${count} novas candidaturas em ${target}`;
  }
  if (base.tipo === "E5" || base.tipo === "F4") {
    return `${count} novas mensagens em ${target}`;
  }
  if (base.tipo === "F9") {
    return `${count} projetos compatíveis hoje`;
  }
  if (base.tipo === "O2") {
    return `${count} leads novos para outreach`;
  }

  return stripBold(base.titulo);
}

export function formatNotificationRelativeTime(createdAt: string) {
  const diffMs = MOCK_NOW.getTime() - toDate(createdAt).getTime();
  const minutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `há ${hours}h`;
  }

  const days = Math.round(hours / 24);
  return `há ${days}d`;
}

export function groupNotifications(items: Notificacao[]) {
  const groups = new Map<string, Notificacao[]>();

  items
    .slice()
    .sort((a, b) => toDate(b.criada_em).getTime() - toDate(a.criada_em).getTime())
    .forEach((notification) => {
      const key = notification.agrupamento_chave ?? notification.id;
      const group = groups.get(key);
      if (group) {
        group.push(notification);
        return;
      }
      groups.set(key, [notification]);
    });

  return Array.from(groups.values())
    .map((group): NotificationListItem => {
      const sortedGroup = group
        .slice()
        .sort((a, b) => toDate(b.criada_em).getTime() - toDate(a.criada_em).getTime());
      const base = sortedGroup[0];
      const count =
        sortedGroup.length > 1 ? sortedGroup.length : Math.max(base.agrupamento_count ?? 1, 1);

      return {
        id: base.id,
        notificationIds: sortedGroup.map((notification) => notification.id),
        type: base.tipo,
        severity: base.severidade,
        title: buildGroupedTitle(base, count),
        body: stripBold(base.corpo ?? ""),
        actionUrl: base.acao_url,
        read: sortedGroup.every((notification) => notification.lida),
        archived: sortedGroup.every((notification) => notification.arquivada),
        createdAt: base.criada_em,
        count,
        context: getNotificationContext(base.tipo),
      };
    })
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
}

export function filterNotificationItems(
  items: NotificationListItem[],
  {
    query,
    severity,
    context,
    period,
  }: {
    query: string;
    severity: Severidade | "todas";
    context: NotificationContext | "todos";
    period: NotificationPeriod;
  }
) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (severity !== "todas" && item.severity !== severity) {
      return false;
    }
    if (context !== "todos" && item.context !== context) {
      return false;
    }
    if (period !== "todos") {
      const maxDays = period === "7d" ? 7 : period === "30d" ? 30 : 90;
      if (diffDays(toDate(item.createdAt)) > maxDays) {
        return false;
      }
    }
    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${item.title} ${item.body ?? ""}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function useNotifications(memberId: string) {
  return useSyncExternalStore(
    subscribe,
    () => getNotificationsByMemberSnapshot(memberId),
    () => getNotificationsByMemberSnapshot(memberId)
  );
}

export function markNotificationsAsRead(ids: string[], read = true) {
  let changed = false;
  notificacoes.forEach((notification) => {
    if (!ids.includes(notification.id)) {
      return;
    }
    notification.lida = read;
    notification.lida_em = read ? MOCK_NOW.toISOString() : undefined;
    changed = true;
  });

  if (changed) {
    emitChange();
  }
}

export function markAllNotificationsAsRead(memberId: string, archived?: boolean) {
  const targetIds = getNotificationsSnapshot()
    .filter((notification) => {
      if (notification.destinatario_membro_id !== memberId) {
        return false;
      }
      if (notification.lida) {
        return false;
      }
      if (typeof archived === "boolean" && notification.arquivada !== archived) {
        return false;
      }
      return true;
    })
    .map((notification) => notification.id);

  markNotificationsAsRead(targetIds, true);
}

export function setNotificationArchived(ids: string[], archived: boolean) {
  let changed = false;
  notificacoes.forEach((notification) => {
    if (!ids.includes(notification.id)) {
      return;
    }
    notification.arquivada = archived;
    changed = true;
  });

  if (changed) {
    emitChange();
  }
}

export function useNotificationPreferences(memberId: string) {
  return useSyncExternalStore(
    subscribe,
    () => getPreferencesSnapshot(memberId),
    () => getPreferencesSnapshot(memberId)
  );
}

export function updateNotificationPreference(
  memberId: string,
  groupId: string,
  channel: "in_app" | "email",
  enabled: boolean
) {
  const member = getMembroById(memberId);
  if (!member) {
    return;
  }

  const current = member.preferencias_notificacao ?? clonePreferences(PREFERENCIAS_NOTIFICACAO_DEFAULT);
  const next = clonePreferences(current);
  next.preferencias[groupId] = next.preferencias[groupId] ?? { in_app: true, email: false };
  next.preferencias[groupId][channel] = enabled;
  next.atualizado_em = MOCK_NOW.toISOString();
  member.preferencias_notificacao = next;
  emitChange();
}

export function restoreNotificationPreferences(memberId: string) {
  const member = getMembroById(memberId);
  if (!member) {
    return;
  }

  member.preferencias_notificacao = clonePreferences(PREFERENCIAS_NOTIFICACAO_DEFAULT);
  emitChange();
}

export function resolveNotifications(params: {
  memberId: string;
  types: string[];
  contextEntity?: NotificationEntity;
  contextId?: string;
}) {
  const targetIds = getNotificationsSnapshot()
    .filter((notification) => {
      if (notification.destinatario_membro_id !== params.memberId) {
        return false;
      }
      if (!params.types.includes(notification.tipo) || notification.lida) {
        return false;
      }
      if (params.contextEntity && notification.contexto_ref?.entidade !== params.contextEntity) {
        return false;
      }
      if (params.contextId && notification.contexto_ref?.id !== params.contextId) {
        return false;
      }
      return true;
    })
    .map((notification) => notification.id);

  if (targetIds.length > 0) {
    markNotificationsAsRead(targetIds, true);
  }
}

export function useAutoResolucaoNotificacao(params: {
  memberId: string;
  types: string[];
  contextEntity?: NotificationEntity;
  contextId?: string;
}) {
  useEffect(() => {
    resolveNotifications(params);
  }, [params]);
}
