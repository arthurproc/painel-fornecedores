"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardCandidaturaTriagem } from "@/components/handshake/card-candidatura-triagem";
import { ModalDescarte } from "@/components/handshake/modal-descarte";
import { HeaderProjeto } from "@/components/handshake/header-projeto";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  candidaturas as candidaturasSeed,
  contratos,
  empresas,
  fornecedores,
  getMotivoDescarteById,
  projetos,
  type Candidatura,
  type CandidaturaStatus,
} from "@/lib/mock-data";
import { computeFitScore } from "@/lib/fit-score";

type Decisao = { id: string; status: CandidaturaStatus; motivoId?: string; comentario?: string };

export default function TriagemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id);
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;

  const [decisoesMemoria, setDecisoesMemoria] = useState<Record<string, Decisao>>({});
  const [aba, setAba] = useState<"pendentes" | "shortlist" | "descartadas">("pendentes");
  const [modalDescarte, setModalDescarte] = useState<Candidatura | null>(null);

  const listaBase = useMemo(() => {
    if (!projeto) return [];
    return candidaturasSeed.filter(
      (c) => c.projeto_id === projeto.id && c.status !== "rascunho"
    );
  }, [projeto]);

  function statusAtual(candidatura: Candidatura): CandidaturaStatus {
    const memoria = decisoesMemoria[candidatura.id];
    if (memoria) return memoria.status;
    return candidatura.status;
  }

  function handleShortlist(candidatura: Candidatura) {
    setDecisoesMemoria((prev) => ({
      ...prev,
      [candidatura.id]: { id: candidatura.id, status: "shortlistada" },
    }));
    setAba("shortlist");
  }

  function handleConfirmarDescarte(candidatura: Candidatura, motivoId: string, comentario: string) {
    setDecisoesMemoria((prev) => ({
      ...prev,
      [candidatura.id]: {
        id: candidatura.id,
        status: "descartada",
        motivoId,
        comentario,
      },
    }));
    setAba("descartadas");
  }

  if (!projeto) {
    return (
      <AppShell tipo="empresa" titulo="Triagem">
        <Card className="rounded-xl">
          <CardContent className="p-8 text-center">
            Projeto não encontrado.
            <Button variant="outline" className="ml-3" onClick={() => router.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const pendentes = listaBase.filter((c) => statusAtual(c) === "enviada");
  const shortlist = listaBase.filter((c) => statusAtual(c) === "shortlistada");
  const descartadas = listaBase.filter((c) => statusAtual(c) === "descartada");

  return (
    <AppShell tipo="empresa" titulo="Triagem do projeto">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/empresa/projeto/${projeto.id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao projeto
          </Link>
          <Badge variant="outline">
            {listaBase.length} candidatura(s) recebida(s)
          </Badge>
        </div>

        <HeaderProjeto projeto={projeto} empresa={empresa} />

        <Tabs value={aba} onValueChange={(v) => setAba(v as typeof aba)}>
          <TabsList className="flex w-full max-w-md">
            <TabsTrigger value="pendentes" className="flex-1">
              Pendentes ({pendentes.length})
            </TabsTrigger>
            <TabsTrigger value="shortlist" className="flex-1">
              Shortlist ({shortlist.length})
            </TabsTrigger>
            <TabsTrigger value="descartadas" className="flex-1">
              Descartadas ({descartadas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="mt-4 space-y-3">
            {pendentes.length === 0 ? (
              <Vazio mensagem="Todas as candidaturas pendentes já foram triadas." />
            ) : (
              pendentes.map((candidatura) =>
                renderCard(candidatura, {
                  handleShortlist,
                  setModalDescarte,
                  acoesAtivas: true,
                })
              )
            )}
          </TabsContent>

          <TabsContent value="shortlist" className="mt-4 space-y-3">
            {shortlist.length === 0 ? (
              <Vazio mensagem="Nenhuma candidatura na shortlist ainda." />
            ) : (
              <>
                <Card className="rounded-xl border-emerald-200 bg-emerald-50">
                  <CardContent className="flex items-center gap-3 p-4 text-sm text-emerald-900">
                    <CheckCircle2 className="h-4 w-4" />
                    Conversa foi aberta automaticamente com cada candidatura shortlistada. Os
                    fornecedores foram notificados a submeter proposta formal.
                  </CardContent>
                </Card>
                {shortlist.map((candidatura) =>
                  renderCard(candidatura, { acoesAtivas: false })
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="descartadas" className="mt-4 space-y-3">
            {descartadas.length === 0 ? (
              <Vazio mensagem="Nenhuma candidatura descartada até aqui." />
            ) : (
              descartadas.map((candidatura) => {
                const memoria = decisoesMemoria[candidatura.id];
                const motivoId = memoria?.motivoId ?? candidatura.motivo_descarte?.categoria_id;
                const comentario =
                  memoria?.comentario ?? candidatura.motivo_descarte?.comentario;
                const motivo = motivoId ? getMotivoDescarteById(motivoId) : undefined;
                return (
                  <div key={candidatura.id} className="space-y-1">
                    {renderCard(candidatura, { acoesAtivas: false })}
                    {motivo && (
                      <p className="pl-5 text-xs text-muted-foreground">
                        Motivo: <strong>{motivo.nome}</strong>
                        {comentario ? ` · ${comentario}` : ""}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {modalDescarte && (
          <ModalDescarte
            aberto={true}
            onOpenChange={(a) => {
              if (!a) setModalDescarte(null);
            }}
            fornecedorNome={
              fornecedores.find((f) => f.id === modalDescarte.fornecedor_id)?.nome ??
              "Fornecedor"
            }
            onConfirmar={(motivoId, comentario) => {
              handleConfirmarDescarte(modalDescarte, motivoId, comentario);
              setModalDescarte(null);
            }}
          />
        )}
      </div>
    </AppShell>
  );

  function renderCard(
    candidatura: Candidatura,
    opts: {
      handleShortlist?: (c: Candidatura) => void;
      setModalDescarte?: (c: Candidatura) => void;
      acoesAtivas: boolean;
    }
  ) {
    const fornecedor = fornecedores.find((f) => f.id === candidatura.fornecedor_id);
    if (!fornecedor || !projeto) return null;
    const breakdown = computeFitScore(projeto, fornecedor);
    const contratosDestacados = contratos.filter((c) =>
      candidatura.contratos_destacados.includes(c.id)
    );
    return (
      <CardCandidaturaTriagem
        key={candidatura.id}
        candidatura={candidatura}
        fornecedor={fornecedor}
        breakdown={breakdown}
        contratosDestacados={contratosDestacados}
        acoesAtivas={opts.acoesAtivas}
        onShortlist={() => opts.handleShortlist?.(candidatura)}
        onDescartar={() => opts.setModalDescarte?.(candidatura)}
      />
    );
  }
}

function Vazio({ mensagem }: { mensagem: string }) {
  return (
    <Card className="rounded-xl border-dashed">
      <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <XCircle className="h-4 w-4" /> {mensagem}
      </CardContent>
    </Card>
  );
}
