"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModalAtribuirAdvisor } from "./modal-atribuir-advisor";
import {
  ADVISOR_LOGADO_ID,
  advisors,
  atribuirAdvisorASessao,
  candidaturas,
  empresas,
  fornecedores,
  getCargaAdvisor,
  getCatalogoById,
  projetos,
  type SessaoConsultoria,
} from "@/lib/mock-data";

interface CardSessaoAdminProps {
  sessao: SessaoConsultoria;
  onMudou?: () => void;
}

function sugerir(sessao: SessaoConsultoria) {
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const categoria = projeto?.categoria;
  const candidatos = advisors
    .filter((a) => a.ativo)
    .map((advisor) => {
      const match = advisor.especializacoes.some((esp) => esp.categoria === categoria);
      return { advisor, match, carga: getCargaAdvisor(advisor.id) };
    })
    .sort((a, b) => {
      if (a.match !== b.match) return a.match ? -1 : 1;
      return a.carga - b.carga;
    });
  return candidatos[0];
}

export function CardSessaoAdmin({ sessao, onMudou }: CardSessaoAdminProps) {
  const [aberto, setAberto] = useState(false);
  const catalogo = getCatalogoById(sessao.catalogo_id);
  const fornecedor = fornecedores.find((f) => f.id === sessao.fornecedor_id);
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const empresa = projeto ? empresas.find((e) => e.id === projeto.empresa_id) : undefined;
  const sugestao = sugerir(sessao);

  function atribuirAMim() {
    atribuirAdvisorASessao(sessao.id, ADVISOR_LOGADO_ID);
    onMudou?.();
  }

  return (
    <>
      <Card className="rounded-xl">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                  {catalogo?.nome ?? "Sessão"}
                </Badge>
                <span className="text-sm font-medium">{fornecedor?.nome}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Projeto: {projeto?.titulo ?? "—"} {empresa ? `(${empresa.nome})` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {projeto?.categoria} · {projeto?.regiao}
              </p>
              <p className="text-xs text-muted-foreground">
                Solicitada em {sessao.solicitada_em}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 rounded-full">
              {sessao.preco_snapshot}
            </Badge>
          </div>

          {sessao.contexto_extra ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Contexto enviado</p>
              <p className="mt-1">{sessao.contexto_extra}</p>
            </div>
          ) : null}

          {sugestao ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2 text-xs">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Sugestão:</span>
              <span className="font-medium">{sugestao.advisor.nome}</span>
              <span className="text-muted-foreground">
                (carga {sugestao.carga}
                {sugestao.advisor.carga_simultanea_max
                  ? `/${sugestao.advisor.carga_simultanea_max}`
                  : ""}
                {sugestao.match ? " · match especialização" : ""})
              </span>
            </div>
          ) : null}

          {sessao.tipo === "revisao_proposta" && candidatura?.status !== "shortlistada" ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Candidatura ainda não foi selecionada para proposta — verificar com o fornecedor.</span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/sessoes/${sessao.id}`}>Ver detalhes</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAberto(true)}>
              Atribuir a outro
            </Button>
            <Button size="sm" onClick={atribuirAMim}>
              Atribuir a mim
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModalAtribuirAdvisor
        sessao={sessao}
        open={aberto}
        onOpenChange={setAberto}
        onAtribuir={onMudou}
      />
    </>
  );
}
