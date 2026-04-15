"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronDown, Settings, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isMembroAdvisor,
  setContextoAtivo,
  useContextoAtivo,
  useSessaoMock,
  type ContextoAtivo,
} from "@/lib/session";

interface ContextSwitcherProps {
  tipoAtual: ContextoAtivo;
}

const contextoConfig = {
  empresa: { label: "Empresa", icon: Building2 },
  fornecedor: { label: "Fornecedor", icon: Wrench },
  admin: { label: "Admin Consultoria", icon: ShieldCheck },
};

export function ContextSwitcher({ tipoAtual }: ContextSwitcherProps) {
  const router = useRouter();
  const { contextosTenantDisponiveis, organizacaoAtiva, membroLogado } = useSessaoMock();
  const contextoAtivo = useContextoAtivo();
  const possuiAcessoAdmin = isMembroAdvisor(membroLogado);
  const totalContextos = contextosTenantDisponiveis.length + (possuiAcessoAdmin ? 1 : 0);

  if (tipoAtual !== "admin" && totalContextos < 2) {
    return null;
  }

  const contextos: ContextoAtivo[] =
    tipoAtual === "admin"
      ? ["admin"]
      : [
          ...(contextosTenantDisponiveis as ContextoAtivo[]),
          ...(possuiAcessoAdmin ? (["admin"] as ContextoAtivo[]) : []),
        ];

  const contextoSelecionado = tipoAtual === "admin" ? "admin" : contextoAtivo;
  const atual = contextoConfig[contextoSelecionado];
  const IconAtual = atual.icon;

  function trocarContexto(contexto: ContextoAtivo) {
    if (contexto === contextoAtivo) {
      return;
    }
    setContextoAtivo(contexto);
    router.push(`/${contexto}/dashboard`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-lg">
          <IconAtual className="w-4 h-4" />
          <span>Atuando como: {atual.label}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {contextos.map((contexto) => {
          const item = contextoConfig[contexto];
          const Icon = item.icon;
          const ativo = contexto === contextoAtivo;
          return (
            <DropdownMenuItem key={contexto} onClick={() => trocarContexto(contexto)}>
              <div className="flex items-center gap-2 w-full">
                <div className="w-4 flex justify-center">
                  {ativo ? <Check className="w-4 h-4 text-primary" /> : null}
                </div>
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {tipoAtual !== "admin" && contexto !== "admin" ? (
                  <span className="text-muted-foreground">— {organizacaoAtiva.razao_social}</span>
                ) : null}
              </div>
            </DropdownMenuItem>
          );
        })}
        {tipoAtual !== "admin" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracoes" className="cursor-pointer">
                <Settings className="w-4 h-4" />
                Configurações da organização
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
