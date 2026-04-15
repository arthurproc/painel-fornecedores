"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardSessao } from "@/components/consultoria/card-sessao";
import {
  MEMBRO_LOGADO_ID,
  getFornecedorByOrganizacao,
  getMembroById,
  getSessoesByFornecedor,
  type SessaoConsultoriaStatus,
} from "@/lib/mock-data";
import { useSessaoMock } from "@/lib/session";

type Filtro = "todas" | SessaoConsultoriaStatus;

const ABAS: { value: Filtro; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "solicitada", label: "Solicitadas" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "entregue", label: "Entregues" },
  { value: "cancelada", label: "Canceladas" },
];

export default function MinhasSessoesPage() {
  useSessaoMock();
  const [aba, setAba] = useState<Filtro>("todas");

  const membro = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membro?.organizacao_id ?? "");

  const todas = useMemo(() => {
    if (!fornecedor) return [];
    return getSessoesByFornecedor(fornecedor.id).sort((a, b) =>
      b.solicitada_em.localeCompare(a.solicitada_em)
    );
  }, [fornecedor]);

  const filtradas = useMemo(() => {
    if (aba === "todas") return todas;
    if (aba === "em_andamento") {
      return todas.filter((s) => s.status === "atribuida" || s.status === "em_andamento");
    }
    return todas.filter((s) => s.status === aba);
  }, [aba, todas]);

  return (
    <AppShell tipo="fornecedor" titulo="Minhas sessões de Consultoria">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h1 className="text-lg font-semibold">Minhas sessões</h1>
              <p className="text-sm text-muted-foreground">
                {todas.length} sessão(ões) no total
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/fornecedor/consultoria/catalogo">Ver catálogo</Link>
            </Button>
          </CardContent>
        </Card>

        <Tabs value={aba} onValueChange={(v) => setAba(v as Filtro)}>
          <TabsList className="flex h-auto flex-wrap">
            {ABAS.map((a) => (
              <TabsTrigger key={a.value} value={a.value}>
                {a.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={aba} className="mt-4 space-y-3">
            {filtradas.length === 0 ? (
              <Card className="rounded-xl border-dashed">
                <CardContent className="space-y-3 p-8 text-center text-sm text-muted-foreground">
                  <p>
                    {todas.length === 0
                      ? "Você ainda não contratou Consultoria."
                      : "Nenhuma sessão nesta aba."}
                  </p>
                  {todas.length === 0 ? (
                    <Button asChild size="sm">
                      <Link href="/fornecedor/consultoria/catalogo">Ver catálogo</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              filtradas.map((sessao) => (
                <CardSessao key={sessao.id} sessao={sessao} perspectiva="fornecedor" />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
