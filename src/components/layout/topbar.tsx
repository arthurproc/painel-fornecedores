"use client";

import Link from "next/link";
import { Bell, ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContextSwitcher } from "@/components/layout/context-switcher";
import { type AppShellTipo } from "@/components/layout/app-shell";
import {
  ADVISOR_LOGADO_ID,
  advisors,
  notificacoes,
} from "@/lib/mock-data";
import { isMembroAdvisor, isOwnerAdvisor, useSessaoMock } from "@/lib/session";

interface TopbarProps {
  tipo: AppShellTipo;
}

function iniciaisDoNome(nome: string) {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) {
    return "CF";
  }
  return `${partes[0][0] ?? ""}${partes[1]?.[0] ?? ""}`.toUpperCase();
}

export function Topbar({ tipo }: TopbarProps) {
  const { membroLogado, organizacaoAtiva, contextosTenantDisponiveis } = useSessaoMock();
  const advisorLogado = advisors.find((advisor) => advisor.id === ADVISOR_LOGADO_ID);
  const possuiAcessoAdmin = isMembroAdvisor(membroLogado);
  const totalContextosDisponiveis =
    contextosTenantDisponiveis.length + (possuiAcessoAdmin ? 1 : 0);

  const perfilUnicoLabel =
    contextosTenantDisponiveis[0] === "empresa"
      ? "Empresa"
      : contextosTenantDisponiveis[0] === "fornecedor"
        ? "Fornecedor"
        : null;

  const notificacoesNaoLidas = notificacoes.filter((notificacao) => {
    if (notificacao.lida) {
      return false;
    }
    if (tipo === "admin") {
      return notificacao.destinatario_membro_id === ADVISOR_LOGADO_ID;
    }
    return notificacao.destinatario_membro_id === membroLogado.id;
  }).length;

  const homeHref =
    tipo === "admin"
      ? "/admin/dashboard"
      : tipo === "empresa"
        ? "/empresa/dashboard"
        : "/fornecedor/dashboard";

  const nomeExibicao = tipo === "admin" ? (advisorLogado?.nome ?? "Celso Marinho") : membroLogado.nome;
  const cargoExibicao =
    tipo === "admin"
      ? isOwnerAdvisor(advisorLogado)
        ? "Owner da Consultoria"
        : "Advisor da Consultoria"
      : membroLogado.cargo;
  const avatarFallback = iniciaisDoNome(nomeExibicao);
  const rotaMeuPerfil =
    tipo === "admin"
      ? "/admin/meu-perfil"
      : tipo === "empresa"
        ? "/empresa/perfil-publico"
        : "/fornecedor/perfil";

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Link href={homeHref} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            CF
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-none">Tenant ativo</p>
            <p className="text-sm font-semibold leading-none mt-1">
              {tipo === "admin" ? "ConectaFornece Consultoria" : organizacaoAtiva.razao_social}
            </p>
          </div>
        </Link>

        {tipo === "admin" || totalContextosDisponiveis > 1 ? (
          <ContextSwitcher tipoAtual={tipo} />
        ) : perfilUnicoLabel ? (
          <Badge variant="secondary" className="rounded-full px-3">
            {perfilUnicoLabel}
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {notificacoesNaoLidas > 0 ? (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full">
              {Math.min(notificacoesNaoLidas, 9)}
            </Badge>
          ) : null}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 pl-2 pr-1 gap-2 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={tipo === "admin" ? advisorLogado?.foto : membroLogado.foto} alt={nomeExibicao} />
                <AvatarFallback className="text-xs font-semibold">{avatarFallback}</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{nomeExibicao}</p>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">{cargoExibicao}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={rotaMeuPerfil}>
                <UserCircle2 className="w-4 h-4" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes/pessoal">
                <Settings className="w-4 h-4" />
                Configurações pessoais
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="w-4 h-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
