"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormularioProjeto,
  type ProjetoRascunhoPayload,
} from "@/components/empresa/formulario-projeto";
import {
  MEMBRO_LOGADO_ID,
  getEmpresaByOrganizacao,
  getMembroById,
} from "@/lib/mock-data";

export default function NovoProjetoPage() {
  const router = useRouter();
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresaAtiva = getEmpresaByOrganizacao(membroLogado?.organizacao_id ?? "");
  const [salvoComo, setSalvoComo] = useState<ProjetoRascunhoPayload | null>(null);

  if (!empresaAtiva) {
    return (
      <AppShell tipo="empresa" titulo="Novo projeto">
        <Card className="mx-auto max-w-xl rounded-xl">
          <CardContent className="space-y-3 p-6 text-sm">
            <p className="font-medium">Organização sem perfil de empresa ativo.</p>
            <p className="text-muted-foreground">
              Ative o perfil de empresa em Configurações antes de publicar um projeto.
            </p>
            <Button asChild variant="outline">
              <Link href="/configuracoes">Ir para Configurações</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  function handleSubmit(payload: ProjetoRascunhoPayload) {
    setSalvoComo(payload);
    setTimeout(() => {
      router.push("/empresa/projetos");
    }, 1200);
  }

  return (
    <AppShell tipo="empresa" titulo="Novo projeto">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/empresa/projetos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para meus projetos
        </Link>

        {salvoComo ? (
          <Card className="rounded-xl border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">
                  {salvoComo.status === "publicado"
                    ? "Projeto publicado (mock)"
                    : "Projeto salvo em rascunho (mock)"}
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  Redirecionando para Meus projetos…
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FormularioProjeto
            empresaNome={empresaAtiva.nome}
            empresaRegiao={empresaAtiva.regiao}
            empresaCidade={empresaAtiva.cidade}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AppShell>
  );
}
