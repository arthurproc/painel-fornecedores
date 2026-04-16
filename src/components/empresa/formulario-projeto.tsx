"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import { StringCombobox } from "@/components/empresa/string-combobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  credencialOptions,
  getCredencialNome,
  getDocumentoPadraoByCredencial,
  resolveCredencialId,
} from "@/lib/platform-credentials";
import {
  criteriosSelecaoSugeridos,
  documentosProjetoSugeridos,
  requisitosTecnicosSugeridos,
} from "@/lib/project-form-options";
import { categorias, regioes } from "@/lib/platform-data";
import { cn } from "@/lib/utils";
import type {
  CredencialExigida,
  DocumentoExigido,
  Projeto,
  ProjetoStatus,
} from "@/lib/mock-data";

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
  requisitos_tecnicos: string[];
  credenciais_exigidas: CredencialExigida[];
  documentos_exigidos: DocumentoExigido[];
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
  if (!min && !max) return "-";
  if (min && max) return `R$ ${strip(min)} - R$ ${strip(max)}`;
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

  const [requisitosTecnicos, setRequisitosTecnicos] = useState<string[]>(
    initial?.requisitos_tecnicos ?? []
  );
  const [novoRequisito, setNovoRequisito] = useState("");

  const [credenciaisExigidas, setCredenciaisExigidas] = useState<CredencialExigida[]>(
    initial?.credenciais_exigidas ?? []
  );
  const [novaCredencial, setNovaCredencial] = useState("");

  const [criterios, setCriterios] = useState<string[]>(initial?.criterios_selecao ?? []);
  const [novoCriterio, setNovoCriterio] = useState("");

  const [documentos, setDocumentos] = useState<DocumentoExigido[]>(
    initial?.documentos_exigidos ?? []
  );
  const [novoDocNome, setNovoDocNome] = useState("");
  const [novoDocObs, setNovoDocObs] = useState("");
  const [novoDocObrigatorio, setNovoDocObrigatorio] = useState(true);
  const [novaCredencialRelacionadaId, setNovaCredencialRelacionadaId] = useState("none");

  const orcamentoResumo = useMemo(
    () => resumoOrcamento(orcamentoMin, orcamentoMax),
    [orcamentoMin, orcamentoMax]
  );

  const erros = useMemo(() => {
    const list: string[] = [];
    if (titulo.trim().length < 5) list.push("Título do projeto (mín. 5 caracteres)");
    if (descricao.trim().length < 20) {
      list.push("Descrição com pelo menos 20 caracteres");
    }
    if (!categoria) list.push("Categoria");
    if (!regiao) list.push("Região");
    if (!cidade.trim()) list.push("Cidade");
    if (!orcamentoMin || !orcamentoMax) list.push("Orçamento (mín. e máx.)");
    if (!prazoIso) list.push("Prazo");
    if (criterios.length === 0) list.push("Ao menos um critério de seleção");
    return list;
  }, [titulo, descricao, categoria, regiao, cidade, orcamentoMin, orcamentoMax, prazoIso, criterios]);

  function addRequisito() {
    const valor = novoRequisito.trim();
    if (!valor || requisitosTecnicos.includes(valor)) return;
    setRequisitosTecnicos((prev) => [...prev, valor]);
    setNovoRequisito("");
  }

  function addCredencial() {
    const credencialId = resolveCredencialId(novaCredencial);
    if (!credencialId || credenciaisExigidas.some((item) => item.credencial_id === credencialId)) {
      return;
    }
    setCredenciaisExigidas((prev) => [...prev, { credencial_id: credencialId, obrigatoria: true }]);
    setNovaCredencial("");
  }

  function addCriterio() {
    const valor = novoCriterio.trim();
    if (!valor || criterios.includes(valor)) return;
    setCriterios((prev) => [...prev, valor]);
    setNovoCriterio("");
  }

  function addDocumento() {
    const nome = novoDocNome.trim();
    if (!nome) return;
    const credencialRelacionadaId =
      novaCredencialRelacionadaId === "none" ? undefined : novaCredencialRelacionadaId;
    setDocumentos((prev) => [
      ...prev,
      {
        id: `novo-doc-${prev.length + 1}`,
        nome,
        obrigatorio: novoDocObrigatorio,
        observacao: novoDocObs.trim() || undefined,
        credencial_relacionada_id: credencialRelacionadaId,
      },
    ]);
    setNovoDocNome("");
    setNovoDocObs("");
    setNovoDocObrigatorio(true);
    setNovaCredencialRelacionadaId("none");
  }

  function submit(status: ProjetoStatus) {
    if (erros.length > 0) return;
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
      requisitos_tecnicos: requisitosTecnicos,
      credenciais_exigidas: credenciaisExigidas,
      documentos_exigidos: documentos,
      status,
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
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
              onChange={(event) => setTitulo(event.target.value)}
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
                  {categorias.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
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
                  {regioes.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
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
              onChange={(event) => setCidade(event.target.value)}
              placeholder="Ex.: Itabira"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={5}
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descreva o escopo, contexto operacional e qualquer restrição relevante."
            />
            <p className="text-xs text-muted-foreground">{descricao.trim().length} caracteres</p>
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
                onChange={(event) => setOrcamentoMin(formatBRL(event.target.value))}
                placeholder="R$ 0,00"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orc-max">Orçamento máximo</Label>
              <Input
                id="orc-max"
                value={orcamentoMax}
                onChange={(event) => setOrcamentoMax(formatBRL(event.target.value))}
                placeholder="R$ 0,00"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Preview exibido aos fornecedores: <span className="font-medium text-foreground">{orcamentoResumo}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazo">Prazo final para candidaturas</Label>
            <Input id="prazo" type="date" value={prazoIso} onChange={(event) => setPrazoIso(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Requisitos técnicos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Condições operacionais e técnicas que o fornecedor precisa atender.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <StringCombobox
              options={requisitosTecnicosSugeridos}
              value={novoRequisito}
              onValueChange={setNovoRequisito}
              onEnter={addRequisito}
              placeholder="Ex.: Experiência em exaustão industrial pesada"
            />
            <Button type="button" variant="outline" size="icon" onClick={addRequisito}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {requisitosTecnicos.map((item, index) => (
              <Badge key={item} variant="secondary" className="gap-1 pr-1">
                {item}
                <button
                  type="button"
                  onClick={() =>
                    setRequisitosTecnicos((prev) => prev.filter((_, current) => current !== index))
                  }
                  aria-label={`Remover ${item}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Credenciais exigidas</CardTitle>
          <p className="text-xs text-muted-foreground">
            Selecione apenas credenciais do catálogo canônico da plataforma.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <StringCombobox
              options={credencialOptions}
              value={novaCredencial}
              onValueChange={setNovaCredencial}
              onEnter={addCredencial}
              placeholder="Ex.: CREA-MG"
            />
            <Button type="button" variant="outline" size="icon" onClick={addCredencial}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {credenciaisExigidas.map((credencial) => (
              <div
                key={credencial.credencial_id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{getCredencialNome(credencial.credencial_id)}</p>
                  {credencial.observacao ? (
                    <p className="text-xs text-muted-foreground">{credencial.observacao}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCredenciaisExigidas((prev) =>
                        prev.map((item) =>
                          item.credencial_id === credencial.credencial_id
                            ? { ...item, obrigatoria: !item.obrigatoria }
                            : item
                        )
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      credencial.obrigatoria
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {credencial.obrigatoria ? "Obrigatória" : "Opcional"}
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCredenciaisExigidas((prev) =>
                        prev.filter((item) => item.credencial_id !== credencial.credencial_id)
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Critérios de seleção</CardTitle>
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
          <div className="flex flex-wrap gap-2">
            {criterios.map((item, index) => (
              <Badge key={item} variant="secondary" className="gap-1 pr-1">
                {item}
                <button
                  type="button"
                  onClick={() => setCriterios((prev) => prev.filter((_, current) => current !== index))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Documentos exigidos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Configure o nome do documento, obrigatoriedade, observação e credencial relacionada.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Credencial relacionada</Label>
                <Select
                  value={novaCredencialRelacionadaId}
                  onValueChange={(value) => {
                    setNovaCredencialRelacionadaId(value);
                    if (value !== "none" && !novoDocNome.trim()) {
                      setNovoDocNome(getDocumentoPadraoByCredencial(value) ?? "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {credenciaisExigidas.map((credencial) => (
                      <SelectItem key={credencial.credencial_id} value={credencial.credencial_id}>
                        {getCredencialNome(credencial.credencial_id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Observação</Label>
                <Input
                  value={novoDocObs}
                  onChange={(event) => setNovoDocObs(event.target.value)}
                  placeholder="Ex.: vigente na data de abertura"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nome do documento</Label>
              <StringCombobox
                options={documentosProjetoSugeridos}
                value={novoDocNome}
                onValueChange={setNovoDocNome}
                onEnter={addDocumento}
                placeholder="Ex.: Certificado NR-22 vigente"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setNovoDocObrigatorio((prev) => !prev)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  novoDocObrigatorio
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {novoDocObrigatorio ? "Obrigatório" : "Opcional"}
              </button>
              <Button type="button" variant="outline" onClick={addDocumento}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar documento
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {documentos.map((documento) => (
              <div
                key={documento.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{documento.nome}</p>
                  {documento.credencial_relacionada_id ? (
                    <p className="text-xs text-muted-foreground">
                      Relacionado à credencial {getCredencialNome(documento.credencial_relacionada_id)}
                    </p>
                  ) : null}
                  {documento.observacao ? (
                    <p className="text-xs text-muted-foreground">{documento.observacao}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {documento.obrigatorio ? "Obrigatório" : "Opcional"}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setDocumentos((prev) => prev.filter((item) => item.id !== documento.id))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {erros.length > 0 ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Campos pendentes para publicar:</p>
            <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs">
              {erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => submit("rascunho")}>
          Salvar rascunho
        </Button>
        <Button type="submit" disabled={erros.length > 0}>
          Publicar projeto
        </Button>
      </div>
    </form>
  );
}
