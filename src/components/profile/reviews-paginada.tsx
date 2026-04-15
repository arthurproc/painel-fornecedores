"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewCard } from "./review-card";
import { reviewDimensoes, reviews, type Review } from "@/lib/mock-data";

interface ReviewsPaginadaProps {
  tipo: "empresa" | "fornecedor";
  organizacao_id: string;
  nomeAvaliado: string;
  hrefPerfil: string;
}

const PERIODOS = [
  { value: "12m", label: "Últimos 12 meses" },
  { value: "24m", label: "Últimos 24 meses" },
  { value: "todos", label: "Desde sempre" },
] as const;

const NOTAS = [
  { value: "todas", label: "Todas as notas" },
  { value: "5", label: "5 estrelas" },
  { value: "4", label: "4 estrelas ou mais" },
  { value: "3", label: "3 estrelas ou mais" },
  { value: "ate2", label: "2 estrelas ou menos" },
] as const;

const PAGINA_TAM = 5;

export function ReviewsPaginada({
  tipo,
  organizacao_id,
  nomeAvaliado,
  hrefPerfil,
}: ReviewsPaginadaProps) {
  const liberadas = useMemo(
    () =>
      reviews.filter(
        (r) =>
          r.status === "liberada" &&
          r.avaliado_org_tipo === tipo &&
          r.avaliado_org_id === organizacao_id
      ),
    [tipo, organizacao_id]
  );

  const dimensoes = useMemo(
    () =>
      [...reviewDimensoes]
        .filter((d) => d.aplica_a === tipo && d.ativo)
        .sort((a, b) => a.ordem - b.ordem),
    [tipo]
  );

  const [dimensao, setDimensao] = useState<string>("todas");
  const [nota, setNota] = useState<string>("todas");
  const [periodo, setPeriodo] = useState<string>("12m");
  const [pagina, setPagina] = useState(1);

  const { filtradas, fallbackAplicado } = useMemo(() => {
    const hoje = new Date("2026-04-15");
    const base = aplicarFiltros(liberadas, dimensao, nota, periodo, hoje);
    if (base.length === 0 && periodo !== "todos") {
      const alt = aplicarFiltros(liberadas, dimensao, nota, "todos", hoje);
      if (alt.length > 0) {
        return { filtradas: alt, fallbackAplicado: true as const };
      }
    }
    return { filtradas: base, fallbackAplicado: false as const };
  }, [liberadas, dimensao, nota, periodo]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGINA_TAM));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice(
    (paginaAtual - 1) * PAGINA_TAM,
    paginaAtual * PAGINA_TAM
  );

  function resetarFiltros() {
    setDimensao("todas");
    setNota("todas");
    setPeriodo("12m");
    setPagina(1);
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href={hrefPerfil}>
          <ArrowLeft className="h-4 w-4" /> Voltar ao perfil
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Reviews recebidas</h1>
        <p className="text-sm text-muted-foreground">
          Todas as avaliações liberadas de {nomeAvaliado}. Ordenadas da mais recente
          para a mais antiga.
        </p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={dimensao}
            onValueChange={(v) => {
              setDimensao(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Dimensão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as dimensões</SelectItem>
              {dimensoes.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={nota}
            onValueChange={(v) => {
              setNota(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Nota" />
            </SelectTrigger>
            <SelectContent>
              {NOTAS.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={periodo}
            onValueChange={(v) => {
              setPeriodo(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(dimensao !== "todas" || nota !== "todas" || periodo !== "12m") && (
            <Button variant="ghost" size="sm" onClick={resetarFiltros}>
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {fallbackAplicado ? (
        <Badge variant="secondary" className="rounded-full">
          Sem reviews no período selecionado. Mostrando &ldquo;desde sempre&rdquo;.
        </Badge>
      ) : null}

      {filtradas.length === 0 ? (
        <Card className="rounded-xl border-dashed">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma review corresponde aos filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {filtradas.length}{" "}
            {filtradas.length === 1 ? "review" : "reviews"} · página {paginaAtual}{" "}
            de {totalPaginas}
          </p>
          <div className="space-y-3">
            {visiveis.map((r) => (
              <ReviewCard key={r.id} review={r} viewerEhFornecedor />
            ))}
          </div>
          {totalPaginas > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                {paginaAtual} / {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              >
                Próxima
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function aplicarFiltros(
  lista: Review[],
  dimensao: string,
  nota: string,
  periodo: string,
  hoje: Date
): Review[] {
  return lista
    .filter((r) => dimensao === "todas" || r.notas[dimensao] !== undefined)
    .filter((r) => {
      const valor =
        dimensao === "todas"
          ? mediaReview(r)
          : r.notas[dimensao] ?? 0;
      if (nota === "todas") return true;
      if (nota === "5") return valor >= 5;
      if (nota === "4") return valor >= 4;
      if (nota === "3") return valor >= 3;
      if (nota === "ate2") return valor <= 2;
      return true;
    })
    .filter((r) => dentroDoPeriodo(r.liberada_em, periodo, hoje))
    .sort((a, b) => (b.liberada_em ?? "").localeCompare(a.liberada_em ?? ""));
}

function mediaReview(r: Review): number {
  const notas = Object.values(r.notas);
  if (notas.length === 0) return 0;
  return notas.reduce((a, b) => a + b, 0) / notas.length;
}

function dentroDoPeriodo(
  iso: string | undefined,
  periodo: string,
  hoje: Date
): boolean {
  if (!iso) return false;
  if (periodo === "todos") return true;
  const data = new Date(iso);
  const diffMeses =
    (hoje.getFullYear() - data.getFullYear()) * 12 +
    (hoje.getMonth() - data.getMonth());
  if (periodo === "12m") return diffMeses <= 12;
  if (periodo === "24m") return diffMeses <= 24;
  return true;
}
