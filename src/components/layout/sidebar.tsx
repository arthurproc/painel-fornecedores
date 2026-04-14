"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  FolderPlus,
  Search,
  User,
  LogOut,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  tipo: "empresa" | "fornecedor";
}

const empresaLinks = [
  { href: "/empresa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresa/novo-projeto", label: "Novo Projeto", icon: FolderPlus },
  { href: "/empresa/projeto/1", label: "Meus Projetos", icon: Briefcase },
];

const fornecedorLinks = [
  { href: "/fornecedor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fornecedor/projetos", label: "Buscar Projetos", icon: Search },
  { href: "/fornecedor/perfil", label: "Meu Perfil", icon: User },
];

export function Sidebar({ tipo }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const links = tipo === "empresa" ? empresaLinks : fornecedorLinks;
  const nome = tipo === "empresa" ? "Vale S.A." : "TechMinas Serviços";
  const iniciais = tipo === "empresa" ? "V" : "TM";

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
          {iniciais}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{nome}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {tipo}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <ChevronLeft className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && <span>Recolher</span>}
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </div>
    </aside>
  );
}
