"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Star,
  Ticket,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { cn } from "@/lib/utils";
import { type AppShellTipo } from "./app-shell";

interface SidebarProps {
  tipo: AppShellTipo;
}

interface SidebarItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  children?: Array<{ href: string; label: string }>;
}

interface SidebarConfig {
  headerTitle: string;
  headerSubtitle: string;
  topItems: SidebarItem[];
  footerItems: SidebarItem[];
}

const sidebarByType: Record<AppShellTipo, SidebarConfig> = {
  empresa: {
    headerTitle: "ConectaFornece",
    headerSubtitle: "Empresa",
    topItems: [
      { href: "/empresa/dashboard", label: "Início", icon: LayoutDashboard },
      {
        href: "/empresa/projetos",
        label: "Projetos",
        icon: FolderOpen,
        children: [
          { href: "/empresa/projetos", label: "Meus projetos" },
          { href: "/empresa/novo-projeto", label: "Novo projeto" },
        ],
      },
      { href: "/empresa/candidaturas", label: "Candidaturas recebidas", icon: Ticket },
      {
        href: "/empresa/contratos/em-execucao",
        label: "Contratos",
        icon: Briefcase,
        children: [
          { href: "/empresa/contratos/em-execucao", label: "Em execução" },
          { href: "/empresa/contratos/historico", label: "Histórico" },
        ],
      },
      { href: "/empresa/mensagens", label: "Mensagens", icon: MessageSquare },
      { href: "/empresa/diretorio", label: "Diretório", icon: Search },
      { href: "/reviews", label: "Avaliações", icon: Star },
    ],
    footerItems: [
      { href: "/empresa/perfil-publico", label: "Perfil público", icon: Building2 },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
  fornecedor: {
    headerTitle: "ConectaFornece",
    headerSubtitle: "Fornecedor",
    topItems: [
      { href: "/fornecedor/dashboard", label: "Início", icon: LayoutDashboard },
      { href: "/fornecedor/projetos", label: "Descobrir projetos", icon: Compass },
      { href: "/fornecedor/candidaturas", label: "Minhas candidaturas", icon: Ticket },
      { href: "/fornecedor/propostas", label: "Propostas formais", icon: BookOpen },
      {
        href: "/fornecedor/contratos/em-execucao",
        label: "Contratos",
        icon: Briefcase,
        children: [
          { href: "/fornecedor/contratos/em-execucao", label: "Em execução" },
          { href: "/fornecedor/contratos/historico", label: "Histórico" },
        ],
      },
      { href: "/fornecedor/mensagens", label: "Mensagens", icon: MessageSquare },
      {
        href: "/fornecedor/consultoria/catalogo",
        label: "Consultoria",
        icon: Sparkles,
        children: [
          { href: "/fornecedor/consultoria/catalogo", label: "Catálogo" },
          { href: "/fornecedor/consultoria/minhas-sessoes", label: "Minhas sessões" },
        ],
      },
      { href: "/reviews", label: "Avaliações", icon: Star },
    ],
    footerItems: [
      { href: "/fornecedor/perfil", label: "Perfil público", icon: User },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
  admin: {
    headerTitle: "ConectaFornece",
    headerSubtitle: "Admin Consultoria",
    topItems: [
      { href: "/admin/dashboard", label: "Início", icon: LayoutDashboard },
      {
        href: "/admin/sessoes/solicitadas",
        label: "Sessões",
        icon: Ticket,
        children: [
          { href: "/admin/sessoes/solicitadas", label: "Solicitadas" },
          { href: "/admin/sessoes/minhas", label: "Atribuídas a mim" },
          { href: "/admin/sessoes/em-andamento", label: "Em andamento" },
          { href: "/admin/sessoes/entregues", label: "Entregues" },
        ],
      },
      { href: "/admin/advisors", label: "Advisors", icon: Users },
      { href: "/admin/catalogo-servicos", label: "Catálogo de serviços", icon: Wallet },
      { href: "/admin/estudos-de-caso", label: "Estudos de caso", icon: BookOpen },
      {
        href: "/admin/inteligencia/funil-conversao",
        label: "Inteligência",
        icon: Gauge,
        children: [
          { href: "/admin/inteligencia/funil-conversao", label: "Funil de conversão" },
          { href: "/admin/inteligencia/outreach-proativo", label: "Outreach proativo" },
          { href: "/admin/inteligencia/fornecedores-em-risco", label: "Fornecedores em risco" },
        ],
      },
    ],
    footerItems: [
      { href: "/admin/organizacoes", label: "Organizações", icon: Building2 },
      {
        href: "/admin/configuracoes-plataforma",
        label: "Configurações da plataforma",
        icon: Settings,
      },
    ],
  },
};

function linkAtivo(pathname: string, href: string) {
  if (href === pathname) {
    return true;
  }
  return pathname.startsWith(`${href}/`);
}

export function Sidebar({ tipo }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const config = sidebarByType[tipo];

  function isGroupOpen(item: SidebarItem) {
    if (!item.children) {
      return false;
    }
    const fromPath = item.children.some((child) => linkAtivo(pathname, child.href));
    return openGroups[item.href] ?? fromPath;
  }

  function toggleGroup(itemHref: string) {
    setOpenGroups((previous) => ({
      ...previous,
      [itemHref]: !(previous[itemHref] ?? false),
    }));
  }

  function renderItem(item: SidebarItem) {
    const active =
      linkAtivo(pathname, item.href) ||
      Boolean(item.children?.some((child) => linkAtivo(pathname, child.href)));
    const open = isGroupOpen(item);

    if (!item.children) {
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          {!collapsed ? <span>{item.label}</span> : null}
        </Link>
      );
    }

    return (
      <div key={item.href} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleGroup(item.href)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          {!collapsed ? (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", open ? "rotate-0" : "-rotate-90")}
              />
            </>
          ) : null}
        </button>

        {!collapsed && open ? (
          <div className="space-y-1 pl-9">
            {item.children.map((child) => {
              const childActive = linkAtivo(pathname, child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-xs transition-colors",
                    childActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
          CF
        </div>
        {!collapsed ? (
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{config.headerTitle}</p>
            <p className="text-xs text-sidebar-foreground/60">{config.headerSubtitle}</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {config.topItems.map((item) => renderItem(item))}
      </nav>

      <div className="px-3 pb-3 pt-2 border-t border-sidebar-border space-y-1">
        {config.footerItems.map((item) => renderItem(item))}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
          {!collapsed ? <span>Recolher</span> : null}
        </button>
      </div>
    </aside>
  );
}
