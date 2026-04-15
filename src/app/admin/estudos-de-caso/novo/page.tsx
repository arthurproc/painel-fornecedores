"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ADVISOR_LOGADO_ID,
  contratos,
  criarEstudoDeCaso,
  empresas,
  fornecedores,
  projetos,
  type EstudoDeCaso,
} from "@/lib/mock-data";

type Passo = 1 | 2 | 3 | 4;

const totalPassos = 4;

export default function WizardEstudoDeCaso() {
  const router = useRouter();
  const [passo, setPasso] = useState<Passo>(1);
  const [contratoId, setContratoId] = useState<string>("");
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [aprendizadosRaw, setAprendizadosRaw] = useState("");
  const [anonFornecedor, setAnonFornecedor] =
    useState<EstudoDeCaso["anonimizacao"]["fornecedor"]>("identificado");
  const [anonEmpresa, setAnonEmpresa] =
    useState<EstudoDeCaso["anonimizacao"]["empresa"]>("identificado");
  const [consentimentoOk, setConsentimentoOk] = useState(false);
  const [visivelPara, setVisivelPara] =
    useState<EstudoDeCaso["visivel_para"]>("fornecedores_logados");
  const [destaque, setDestaque] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const contratosEncerrados = useMemo(
    () => contratos.filter((c) => c.status === "encerrado"),
    []
  );

  const contratoEscolhido = contratos.find((c) => c.id === contratoId);
  const fornecedor = contratoEscolhido
    ? fornecedores.find((f) => f.id === contratoEscolhido.fornecedor_id)
    : undefined;
  const empresa = contratoEscolhido
    ? empresas.find((e) => e.id === contratoEscolhido.empresa_id)
    : undefined;
  const projeto = contratoEscolhido
    ? projetos.find((p) => p.id === contratoEscolhido.projeto_id)
    : undefined;

  const precisaConsentimento = anonFornecedor === "identificado" || anonEmpresa === "identificado";

  const passoValido: Record<Passo, boolean> = {
    1: Boolean(contratoId),
    2: titulo.trim().length >= 10 && resumo.trim().length >= 15 && corpo.trim().length >= 30,
    3: true,
    4: !precisaConsentimento || consentimentoOk,
  };

  function avancar() {
    if (!passoValido[passo]) return;
    if (passo < totalPassos) setPasso((passo + 1) as Passo);
  }

  function voltar() {
    if (passo > 1) setPasso((passo - 1) as Passo);
  }

  function publicar() {
    if (!contratoEscolhido || !projeto) return;
    const aprendizados = aprendizadosRaw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const novo = criarEstudoDeCaso({
      titulo: titulo.trim(),
      resumo: resumo.trim(),
      contrato_id_origem: contratoEscolhido.id,
      contexto: {
        categoria: projeto.categoria,
        regiao: projeto.regiao,
        porte_fornecedor: "medio",
        porte_empresa: "grande",
      },
      corpo: corpo.trim(),
      aprendizados,
      anonimizacao: { fornecedor: anonFornecedor, empresa: anonEmpresa },
      autor_advisor_id: ADVISOR_LOGADO_ID,
      visivel_para: visivelPara,
      destaque,
    });
    setSucesso(novo.id);
    window.setTimeout(() => {
      router.push(`/consultoria/estudos/${novo.id}`);
    }, 1200);
  }

  return (
    <AppShell tipo="admin" titulo="Novo estudo de caso">
      <div className="max-w-3xl space-y-5">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/admin/estudos-de-caso">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Link>
        </Button>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Novo estudo de caso</CardTitle>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4].map((n) => {
                const ativo = n === passo;
                const completo = n < passo;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                        ativo && "border-primary bg-primary text-primary-foreground",
                        completo && "border-emerald-500 bg-emerald-500 text-white",
                        !ativo && !completo && "border-border text-muted-foreground"
                      )}
                    >
                      {completo ? <Check className="h-3.5 w-3.5" /> : n}
                    </div>
                    {n < totalPassos ? <span className="h-px w-6 bg-border" /> : null}
                  </div>
                );
              })}
              <span className="ml-3 text-xs text-muted-foreground">
                Passo {passo} de {totalPassos}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {passo === 1 ? (
              <div className="space-y-3">
                <h2 className="text-base font-semibold">Escolha um contrato encerrado</h2>
                <p className="text-sm text-muted-foreground">
                  O estudo será ancorado nesse contrato. Campos de contexto (categoria/região) são
                  pré-populados.
                </p>
                <div className="space-y-2">
                  {contratosEncerrados.map((c) => {
                    const emp = empresas.find((e) => e.id === c.empresa_id);
                    const forn = fornecedores.find((f) => f.id === c.fornecedor_id);
                    const proj = projetos.find((p) => p.id === c.projeto_id);
                    const ativo = contratoId === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setContratoId(c.id)}
                        className={cn(
                          "flex w-full flex-col gap-1 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                          ativo
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="font-medium">{proj?.titulo ?? c.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {forn?.nome} × {emp?.nome} · encerrado em {c.data_fechamento}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {passo === 2 ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold">Narrativa</h2>
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex.: Como uma fornecedora pequena venceu contrato em Itabira"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumo">Resumo (1-2 frases)</Label>
                  <Textarea
                    id="resumo"
                    rows={2}
                    value={resumo}
                    onChange={(e) => setResumo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corpo">Corpo (markdown permitido)</Label>
                  <Textarea
                    id="corpo"
                    rows={6}
                    value={corpo}
                    onChange={(e) => setCorpo(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aprendizados">Aprendizados (um por linha)</Label>
                  <Textarea
                    id="aprendizados"
                    rows={4}
                    value={aprendizadosRaw}
                    onChange={(e) => setAprendizadosRaw(e.target.value)}
                    placeholder="Diferenciais técnicos devem aparecer no cronograma&#10;Compliance supera preço em auditoria próxima"
                  />
                </div>
              </div>
            ) : null}

            {passo === 3 ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold">Anonimização</h2>
                <p className="text-sm text-muted-foreground">
                  Decida se o fornecedor e a empresa serão identificados ou anonimizados. Se
                  identificado, será solicitado consentimento à parte no passo 4.
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <div className="space-y-1">
                      {(["identificado", "anonimo"] as const).map((valor) => (
                        <label
                          key={valor}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                            anonFornecedor === valor ? "border-primary bg-primary/5" : "border-border"
                          )}
                        >
                          <input
                            type="radio"
                            name="anon-fornecedor"
                            checked={anonFornecedor === valor}
                            onChange={() => setAnonFornecedor(valor)}
                          />
                          <span className="capitalize">{valor}</span>
                        </label>
                      ))}
                    </div>
                    {anonFornecedor === "anonimo" && fornecedor ? (
                      <p className="text-xs text-muted-foreground">
                        Exibirá como:{" "}
                        <span className="italic">
                          Fornecedora média de {projeto?.categoria.toLowerCase()}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <div className="space-y-1">
                      {(["identificado", "anonimo"] as const).map((valor) => (
                        <label
                          key={valor}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                            anonEmpresa === valor ? "border-primary bg-primary/5" : "border-border"
                          )}
                        >
                          <input
                            type="radio"
                            name="anon-empresa"
                            checked={anonEmpresa === valor}
                            onChange={() => setAnonEmpresa(valor)}
                          />
                          <span className="capitalize">{valor}</span>
                        </label>
                      ))}
                    </div>
                    {anonEmpresa === "anonimo" ? (
                      <p className="text-xs text-muted-foreground">
                        Exibirá como:{" "}
                        <span className="italic">Grande contratante industrial</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {passo === 4 ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold">Consentimento e publicação</h2>
                {precisaConsentimento ? (
                  <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-medium">Solicitar consentimento</p>
                    <p>
                      Será enviada uma notificação in-app para{" "}
                      {anonFornecedor === "identificado" ? fornecedor?.nome : null}
                      {anonFornecedor === "identificado" && anonEmpresa === "identificado"
                        ? " e "
                        : null}
                      {anonEmpresa === "identificado" ? empresa?.nome : null}.
                    </p>
                    <label className="mt-2 flex items-center gap-2 text-amber-900">
                      <input
                        type="checkbox"
                        checked={consentimentoOk}
                        onChange={(e) => setConsentimentoOk(e.target.checked)}
                      />
                      <span>Consentimento obtido (mock) — pode publicar</span>
                    </label>
                  </div>
                ) : null}

                <div className="space-y-3 rounded-lg border border-border p-3">
                  <div className="space-y-2">
                    <Label>Visibilidade</Label>
                    <div className="space-y-1">
                      {(
                        [
                          { v: "fornecedores_logados", label: "Somente fornecedores logados" },
                          { v: "todos_publico", label: "Público (incluindo não-logados)" },
                        ] as const
                      ).map((op) => (
                        <label
                          key={op.v}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                            visivelPara === op.v ? "border-primary bg-primary/5" : "border-border"
                          )}
                        >
                          <input
                            type="radio"
                            name="visivel-para"
                            checked={visivelPara === op.v}
                            onChange={() => setVisivelPara(op.v)}
                          />
                          <span>{op.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={destaque}
                      onChange={(e) => setDestaque(e.target.checked)}
                    />
                    <span>Marcar como destaque (aparece no catálogo)</span>
                  </label>
                </div>

                {sucesso ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                    Estudo publicado. Redirecionando…
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <Button variant="outline" onClick={voltar} disabled={passo === 1 || Boolean(sucesso)}>
                Voltar
              </Button>
              {passo < totalPassos ? (
                <Button onClick={avancar} disabled={!passoValido[passo]}>
                  Avançar
                </Button>
              ) : (
                <Button onClick={publicar} disabled={!passoValido[passo] || Boolean(sucesso)}>
                  Publicar estudo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {contratoEscolhido ? (
          <div className="text-xs text-muted-foreground">
            Contexto derivado: {projeto?.categoria} · {projeto?.regiao} · Fornecedor{" "}
            <Badge variant="outline" className="rounded-full text-xs">
              {fornecedor?.nome}
            </Badge>{" "}
            × Empresa{" "}
            <Badge variant="outline" className="rounded-full text-xs">
              {empresa?.nome}
            </Badge>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
