"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringCombobox } from "@/components/empresa/string-combobox";
import {
  criteriosSelecaoSugeridos,
  documentosProjetoSugeridos,
  requisitosTecnicosSugeridos,
} from "@/lib/project-form-options";
import { cn } from "@/lib/utils";
import { categorias, regioes } from "@/lib/platform-data";
import type { DocumentoExigido, Projeto, ProjetoStatus } from "@/lib/mock-data";

export interface ProjetoRascunhoPayload {
  titulo: string;
  descricao: string;
  categoria: string;
  regiao: string;
  cidade: string;
  orcamento_min: string;
  orcamento_max: string;
  orcamento: string;
  prazo: string;
  criterios_selecao: string[];
  documentos_exigidos: DocumentoExigido[];
  requisitos: string[];
  status: ProjetoStatus;
}

interface FormularioProjetoProps {
  empresaNome: string;
  empresaRegiao?: string;
  empresaCidade?: string;
  initial?: Partial<Projeto>;
  onSubmit: (payload: ProjetoRascunhoPayload) => void;
}

function formatBRL(valor: string): string {
  const digits = valor.replace(/\D/g, "");
  if (!digits) return "";
  const numero = Number(digits) / 100;
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function resumoOrcamento(min: string, max: string): string {
  const strip = (v: string) =>
    v.replace("R$", "").replace(/\s+/g, "").replace(/,\d{2}$/, "");
  if (!min && !max) return "—";
  if (min && max) return `R$ ${strip(min)} – R$ ${strip(max)}`;
  if (min) return `a partir de R$ ${strip(min)}`;
  return `até R$ ${strip(max)}`;
}

function isoToBR(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function FormularioProjeto({
  empresaNome,
  empresaRegiao,
  empresaCidade,
  initial,
  onSubmit,
}: FormularioProjetoProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [categoria, setCategoria] = useState(initial?.categoria ?? "");
  const [regiao, setRegiao] = useState(initial?.regiao ?? empresaRegiao ?? "");
  const [cidade, setCidade] = useState(initial?.cidade ?? empresaCidade ?? "");
  const [orcamentoMin, setOrcamentoMin] = useState(initial?.orcamento_min ?? "");
  const [orcamentoMax, setOrcamentoMax] = useState(initial?.orcamento_max ?? "");
  const [prazoIso, setPrazoIso] = useState("");

  const [requisitos, setRequisitos] = useState<string[]>(initial?.requisitos ?? []);
  const [novoRequisito, setNovoRequisito] = useState("");

  const [criterios, setCriterios] = useState<string[]>(initial?.criterios_selecao ?? []);
  const [novoCriterio, setNovoCriterio] = useState("");

  const [documentos, setDocumentos] = useState<DocumentoExigido[]>(
    initial?.documentos_exigidos ?? []
  );
  const [novoDocNome, setNovoDocNome] = useState("");
  const [novoDocObs, setNovoDocObs] = useState("");
  const [novoDocObrigatorio, setNovoDocObrigatorio] = useState(true);

  const orcamentoResumo = useMemo(
    () => resumoOrcamento(orcamentoMin, orcamentoMax),
    [orcamentoMin, orcamentoMax]
  );

  const erros = useMemo(() => {
    const list: string[] = [];
    if (titulo.trim().length < 5) list.push("Título do projeto (mín. 5 caracteres)");
    if (descricao.trim().length < 20)
      list.push("Descrição com pelo menos 20 caracteres");
    if (!categoria) list.push("Categoria");
    if (!regiao) list.push("Região");
    if (!cidade.trim()) list.push("Cidade");
    if (!orcamentoMin || !orcamentoMax) list.push("Orçamento (mín. e máx.)");
    if (!prazoIso) list.push("Prazo");
    if (criterios.length === 0)
      list.push("Ao menos um critério de seleção");
    return list;
  }, [
    titulo,
    descricao,
    categoria,
    regiao,
    cidade,
    orcamentoMin,
    orcamentoMax,
    prazoIso,
    criterios,
  ]);

  const valido = erros.length === 0;

  function addRequisito() {
    const v = novoRequisito.trim();
    if (!v || requisitos.includes(v)) return;
    setRequisitos((prev) => [...prev, v]);
    setNovoRequisito("");
  }

  function addCriterio() {
    const v = novoCriterio.trim();
    if (!v || criterios.includes(v)) return;
    setCriterios((prev) => [...prev, v]);
    setNovoCriterio("");
  }

  function addDocumento() {
    const nome = novoDocNome.trim();
    if (!nome || documentos.some((doc) => doc.nome === nome)) return;
    const obs = novoDocObs.trim();
    setDocumentos((prev) => [
      ...prev,
      {
        nome,
        obrigatorio: novoDocObrigatorio,
        ...(obs ? { observacao: obs } : {}),
      },
    ]);
    setNovoDocNome("");
    setNovoDocObs("");
    setNovoDocObrigatorio(true);
  }

  function removeDocumento(i: number) {
    setDocumentos((prev) => prev.filter((_, j) => j !== i));
  }

  function toggleObrigatorio(i: number) {
    setDocumentos((prev) =>
      prev.map((d, j) => (j === i ? { ...d, obrigatorio: !d.obrigatorio } : d))
    );
  }

  function submit(status: ProjetoStatus) {
    if (!valido) return;
    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria,
      regiao,
      cidade: cidade.trim(),
      orcamento_min: orcamentoMin,
      orcamento_max: orcamentoMax,
      orcamento: orcamentoResumo,
      prazo: isoToBR(prazoIso),
      criterios_selecao: criterios,
      documentos_exigidos: documentos,
      requisitos,
      status,
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit("publicado");
      }}
    >
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Informações do projeto</CardTitle>
          <p className="text-xs text-muted-foreground">
            Publicando por <span className="font-medium">{empresaNome}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Manutenção preventiva de correias"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Região</Label>
              <Select value={regiao} onValueChange={setRegiao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma região" />
                </SelectTrigger>
                <SelectContent>
                  {regioes.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex.: Itabira"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o escopo, contexto operacional e qualquer restrição relevante."
            />
            <p className="text-xs text-muted-foreground">
              {descricao.trim().length} caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Orçamento e prazo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orc-min">Orçamento mínimo</Label>
              <Input
                id="orc-min"
                value={orcamentoMin}
                onChange={(e) => setOrcamentoMin(formatBRL(e.target.value))}
                placeholder="R$ 0,00"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orc-max">Orçamento máximo</Label>
              <Input
                id="orc-max"
                value={orcamentoMax}
                onChange={(e) => setOrcamentoMax(formatBRL(e.target.value))}
                placeholder="R$ 0,00"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Preview exibido aos fornecedores:{" "}
            <span className="font-medium text-foreground">{orcamentoResumo}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazo">Prazo final para candidaturas</Label>
            <Input
              id="prazo"
              type="date"
              value={prazoIso}
              onChange={(e) => setPrazoIso(e.target.value)}
            />
            {prazoIso && (
              <p className="text-xs text-muted-foreground">
                Exibido como{" "}
                <span className="font-medium text-foreground">{isoToBR(prazoIso)}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Requisitos técnicos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Pré-requisitos que o fornecedor precisa ter para se candidatar.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <StringCombobox
              options={requisitosTecnicosSugeridos}
              value={novoRequisito}
              onValueChange={setNovoRequisito}
              onEnter={addRequisito}
              placeholder="Ex.: Certificação NR-22"
            />
            <Button type="button" variant="outline" size="icon" onClick={addRequisito}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {requisitos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {requisitos.map((r, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                  {r}
                  <button
                    type="button"
                    onClick={() =>
                      setRequisitos((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="ml-1 text-muted-foreground hover:text-destructive"
                    aria-label={`Remover ${r}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Critérios de seleção</CardTitle>
          <p className="text-xs text-muted-foreground">
            Como a triagem será decidida. Ex.: preço competitivo, histórico em mineração.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <StringCombobox
              options={criteriosSelecaoSugeridos}
              value={novoCriterio}
              onValueChange={setNovoCriterio}
              onEnter={addCriterio}
              placeholder="Ex.: Preço competitivo"
            />
            <Button type="button" variant="outline" size="icon" onClick={addCriterio}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {criterios.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {criterios.map((c, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pr-1">
                  {c}
                  <button
                    type="button"
                    onClick={() =>
                      setCriterios((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="ml-1 text-muted-foreground hover:text-destructive"
                    aria-label={`Remover ${c}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Documentos exigidos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Documentos que o fornecedor precisa anexar na proposta formal.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="doc-nome" className="text-xs">
                  Nome do documento
                </Label>
                <div id="doc-nome">
                  <StringCombobox
                    options={documentosProjetoSugeridos}
                    value={novoDocNome}
                    onValueChange={setNovoDocNome}
                    onEnter={addDocumento}
                    placeholder="Ex.: Certificado NR-22"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="doc-obs" className="text-xs">
                  Observação (opcional)
                </Label>
                <Input
                  id="doc-obs"
                  value={novoDocObs}
                  onChange={(e) => setNovoDocObs(e.target.value)}
                  placeholder="Ex.: vigente na data de abertura"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setNovoDocObrigatorio((v) => !v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  novoDocObrigatorio
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {novoDocObrigatorio ? "Obrigatório" : "Opcional"}
              </button>
              <Button type="button" variant="outline" onClick={addDocumento}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar documento
              </Button>
            </div>
          </div>

          {documentos.length > 0 && (
            <div className="space-y-2">
              {documentos.map((d, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{d.nome}</p>
                    {d.observacao && (
                      <p className="text-xs text-muted-foreground">{d.observacao}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleObrigatorio(i)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        d.obrigatorio
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {d.obrigatorio ? "Obrigatório" : "Opcional"}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocumento(i)}
                      aria-label={`Remover ${d.nome}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!valido && erros.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Campos pendentes para publicar:</p>
            <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs">
              {erros.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => submit("rascunho")}>
          Salvar rascunho
        </Button>
        <Button type="submit" disabled={!valido}>
          Publicar projeto
        </Button>
      </div>
    </form>
  );
}
