"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReputacaoAgregadaBloco } from "@/components/profile";
import {
  FILTROS_FORNECEDOR_INICIAIS,
  FiltrosFornecedor,
  type FiltrosFornecedorValue,
} from "@/components/diretorio/filtros-fornecedor";
import {
  categorias,
  contratos,
  fornecedores,
  getFornecedorCredenciaisNomes,
  regioes,
} from "@/lib/mock-data";

export default function DiretorioFornecedoresPage() {
  const [filtros, setFiltros] = useState<FiltrosFornecedorValue>(
    FILTROS_FORNECEDOR_INICIAIS
  );

  const certificacoes = useMemo(() => {
    const set = new Set<string>();
    fornecedores.forEach((fornecedor) =>
      getFornecedorCredenciaisNomes(fornecedor).forEach((credencial) => set.add(credencial))
    );
    return Array.from(set).sort();
  }, []);

  const contratosEncerradosPorFornecedor = useMemo(() => {
    const mapa: Record<string, number> = {};
    contratos.forEach((c) => {
      if (c.status === "encerrado") {
        mapa[c.fornecedor_id] = (mapa[c.fornecedor_id] ?? 0) + 1;
      }
    });
    return mapa;
  }, []);

  const lista = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase();
    return fornecedores.filter((f) => {
      if (termo) {
        const texto = `${f.nome} ${f.descricao}`.toLowerCase();
        if (!texto.includes(termo)) return false;
      }
      if (filtros.categoria !== "todas" && !f.categorias.includes(filtros.categoria))
        return false;
      if (
        filtros.regiao !== "todas" &&
        !f.regioes_atendidas.includes(filtros.regiao)
      )
        return false;
      if (
        filtros.certificacao !== "todas" &&
        !getFornecedorCredenciaisNomes(f).includes(filtros.certificacao)
      )
        return false;
      return true;
    });
  }, [filtros]);

  return (
    <AppShell tipo="empresa" titulo="Diretório de fornecedores">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Diretório de fornecedores</h1>
          <p className="text-sm text-muted-foreground">
            Busca e leitura de perfis públicos de fornecedores da região. Clique em
            um card para ver o perfil completo.
          </p>
        </div>

        <FiltrosFornecedor
          value={filtros}
          onChange={setFiltros}
          categorias={categorias}
          regioes={regioes}
          certificacoes={certificacoes}
        />

        <p className="text-xs text-muted-foreground">
          {lista.length} {lista.length === 1 ? "fornecedor" : "fornecedores"}
        </p>

        {lista.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum fornecedor encontrado. Ajuste os filtros para ampliar a busca.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((f) => {
              const total =
                contratosEncerradosPorFornecedor[f.id] ?? 0;
              return (
                <Link
                  key={f.id}
                  href={`/perfil/fornecedor/${f.id}`}
                  className="group block"
                >
                  <Card className="h-full rounded-xl transition-shadow hover:shadow-md">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                          {f.logo}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold group-hover:text-primary">
                            {f.nome}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {f.cidade}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {f.categorias.slice(0, 2).map((c) => (
                          <Badge
                            key={c}
                            variant="secondary"
                            className="rounded-full text-[11px]"
                          >
                            {c}
                          </Badge>
                        ))}
                        {f.categorias.length > 2 ? (
                          <Badge
                            variant="outline"
                            className="rounded-full text-[11px]"
                          >
                            +{f.categorias.length - 2}
                          </Badge>
                        ) : null}
                      </div>
                      <ReputacaoAgregadaBloco
                        reputacao={f.reputacao_agregada}
                        tipo="fornecedor"
                        compact
                      />
                      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                        <span>
                          {total} {total === 1 ? "contrato" : "contratos"}{" "}
                          encerrado{total === 1 ? "" : "s"}
                        </span>
                        <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Ver perfil <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
