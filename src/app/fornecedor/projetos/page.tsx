"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FILTROS_INICIAIS,
  FiltrosProjeto,
  type FiltrosProjetoValue,
  filtroCorrespondeOrcamento,
  filtroCorrespondePrazo,
  orcamentoMaxNumerico,
} from "@/components/handshake/filtros-projeto";
import { FitScoreBadge } from "@/components/handshake/fit-score-badge";
import {
  MEMBRO_LOGADO_ID,
  categorias,
  empresas,
  getFornecedorByOrganizacao,
  getMembroById,
  logoEmpresa,
  nomeEmpresa,
  projetos,
  regioes,
  statusColors,
  statusLabels,
} from "@/lib/mock-data";
import { computeFitScore } from "@/lib/fit-score";

const HOJE = new Date("2026-04-15T12:00:00");

export default function DescobrirProjetosPage() {
  const [filtros, setFiltros] = useState<FiltrosProjetoValue>(FILTROS_INICIAIS);

  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membroLogado?.organizacao_id ?? "");

  const projetosAbertos = useMemo(
    () => projetos.filter((p) => p.status === "publicado" || p.status === "em_triagem"),
    []
  );

  const filtrados = useMemo(() => {
    return projetosAbertos
      .filter((projeto) => {
        if (
          filtros.busca &&
          !projeto.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) &&
          !projeto.descricao.toLowerCase().includes(filtros.busca.toLowerCase())
        ) {
          return false;
        }
        if (filtros.categoria !== "todas" && projeto.categoria !== filtros.categoria) {
          return false;
        }
        if (filtros.regiao !== "todas" && projeto.regiao !== filtros.regiao) {
          return false;
        }
        if (!filtroCorrespondeOrcamento(orcamentoMaxNumerico(projeto), filtros.faixaValor)) {
          return false;
        }
        if (!filtroCorrespondePrazo(projeto.prazo, filtros.prazo, HOJE)) {
          return false;
        }
        return true;
      })
      .map((projeto) => {
        const empresa = empresas.find((e) => e.id === projeto.empresa_id);
        const breakdown = computeFitScore(projeto, fornecedor);
        return { projeto, empresa, breakdown };
      })
      .sort((a, b) => b.breakdown.total - a.breakdown.total);
  }, [filtros, projetosAbertos, fornecedor]);

  return (
    <AppShell tipo="fornecedor" titulo="Descobrir projetos">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <FiltrosProjeto
              value={filtros}
              onChange={setFiltros}
              categorias={categorias}
              regioes={regioes}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{filtrados.length}</strong> projeto(s) aberto(s)
            para candidatura — ordenados por aderência.
          </p>
          {filtros !== FILTROS_INICIAIS && (
            <Button variant="ghost" size="sm" onClick={() => setFiltros(FILTROS_INICIAIS)}>
              Limpar filtros
            </Button>
          )}
        </div>

        {filtrados.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-10 text-center">
              <p className="font-medium">Nenhum projeto encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar filtros ou ampliar categorias/regiões atendidas pelo seu perfil.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtrados.map(({ projeto, empresa, breakdown }) => (
              <Link
                key={projeto.id}
                href={`/fornecedor/projeto/${projeto.id}`}
                className="block"
              >
                <Card className="h-full cursor-pointer rounded-xl transition-shadow hover:shadow-md">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                          {logoEmpresa(projeto)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{nomeEmpresa(projeto)}</p>
                          <p className="text-xs text-muted-foreground">
                            Publicado em {projeto.dataPublicacao}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className={statusColors[projeto.status]}>
                          {statusLabels[projeto.status]}
                        </Badge>
                        <FitScoreBadge breakdown={breakdown} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold leading-snug">{projeto.titulo}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {projeto.descricao}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" /> {projeto.orcamento}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {projeto.cidade}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Prazo {projeto.prazo}
                      </span>
                      <span className="truncate">
                        {empresa?.setor ?? "Indústria"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {projeto.categoria}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {projeto.regiao}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
