"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormularioCandidatura } from "@/components/handshake/formulario-candidatura";
import {
  MEMBRO_LOGADO_ID,
  contratos,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
} from "@/lib/mock-data";

export default function CandidatarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const [enviada, setEnviada] = useState(false);

  if (!projeto) {
    return (
      <AppShell tipo="fornecedor" titulo="Projeto não encontrado">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center">
            <p>Projeto não encontrado.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/fornecedor/projetos">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const contratosDestacaveis = fornecedor
    ? contratos.filter(
        (c) => c.fornecedor_id === fornecedor.id && c.status === "encerrado"
      )
    : [];

  function handleSubmit() {
    setEnviada(true);
    setTimeout(() => {
      router.push("/fornecedor/candidaturas");
    }, 1200);
  }

  return (
    <AppShell tipo="fornecedor" titulo="Enviar candidatura">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href={`/fornecedor/projeto/${projeto.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao projeto
        </Link>

        <Card className="rounded-xl">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Candidatura para</p>
            <h1 className="text-xl font-semibold leading-tight">{projeto.titulo}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {empresa?.nome ?? "Empresa"} · {projeto.cidade} · Prazo {projeto.prazo}
            </p>
          </CardContent>
        </Card>

        {enviada ? (
          <Card className="rounded-xl border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">Candidatura enviada!</p>
                <p className="mt-1 text-sm text-emerald-800">
                  Redirecionando para Minhas candidaturas… Você poderá editar enquanto estiver
                  aguardando triagem.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FormularioCandidatura
            projeto={projeto}
            fornecedor={fornecedor}
            contratosDestacaveis={contratosDestacaveis}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AppShell>
  );
}
