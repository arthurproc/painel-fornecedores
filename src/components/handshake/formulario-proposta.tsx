"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CTAConsultoria } from "./cta-consultoria";

interface Etapa {
  id: string;
  titulo: string;
  prazo: string;
  descricao?: string;
}

interface DocumentoMock {
  id: string;
  nome: string;
  enviado_em: string;
}

interface FormularioPropostaProps {
  escopoInicial?: string;
  etapasIniciais?: Etapa[];
  precoInicial?: string;
  prazoInicial?: string;
  observacoesIniciais?: string;
  documentosIniciais?: DocumentoMock[];
  onSubmit: () => void;
}

export function FormularioProposta({
  escopoInicial = "",
  etapasIniciais = [],
  precoInicial = "",
  prazoInicial = "",
  observacoesIniciais = "",
  documentosIniciais = [],
  onSubmit,
}: FormularioPropostaProps) {
  const [escopo, setEscopo] = useState(escopoInicial);
  const [preco, setPreco] = useState(precoInicial);
  const [prazo, setPrazo] = useState(prazoInicial);
  const [observacoes, setObservacoes] = useState(observacoesIniciais);
  const [etapas, setEtapas] = useState<Etapa[]>(
    etapasIniciais.length > 0
      ? etapasIniciais
      : [{ id: `etp-${Date.now()}`, titulo: "", prazo: "" }]
  );
  const [documentos, setDocumentos] = useState<DocumentoMock[]>(documentosIniciais);

  function adicionarEtapa() {
    setEtapas((prev) => [...prev, { id: `etp-${Date.now()}`, titulo: "", prazo: "" }]);
  }

  function removerEtapa(id: string) {
    setEtapas((prev) => (prev.length <= 1 ? prev : prev.filter((etapa) => etapa.id !== id)));
  }

  function atualizarEtapa(id: string, campo: keyof Etapa, valor: string) {
    setEtapas((prev) =>
      prev.map((etapa) => (etapa.id === id ? { ...etapa, [campo]: valor } : etapa))
    );
  }

  function adicionarDocumentoMock() {
    const numero = documentos.length + 1;
    setDocumentos((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        nome: `anexo-tecnico-${numero}.pdf`,
        enviado_em: new Date().toISOString().slice(0, 10),
      },
    ]);
  }

  function removerDocumento(id: string) {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
  }

  const valido =
    escopo.trim().length > 20 &&
    preco.trim().length > 0 &&
    prazo.trim().length > 0 &&
    etapas.every((etapa) => etapa.titulo.trim().length > 0 && etapa.prazo.trim().length > 0);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valido) return;
        onSubmit();
      }}
    >
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Escopo detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={6}
            value={escopo}
            onChange={(event) => setEscopo(event.target.value)}
            placeholder="Descreva o escopo com clareza: o que está incluído, premissas e premissas técnicas."
          />
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Cronograma em etapas</CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={adicionarEtapa}
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar etapa
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {etapas.map((etapa, index) => (
            <div key={etapa.id} className="rounded-lg border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Etapa {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removerEtapa(etapa.id)}
                  disabled={etapas.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
                <Input
                  value={etapa.titulo}
                  onChange={(event) => atualizarEtapa(etapa.id, "titulo", event.target.value)}
                  placeholder="Ex.: Kick-off e diagnóstico"
                />
                <Input
                  value={etapa.prazo}
                  onChange={(event) => atualizarEtapa(etapa.id, "prazo", event.target.value)}
                  placeholder="Ex.: 10 dias"
                />
              </div>
              <Textarea
                rows={2}
                className="mt-2"
                value={etapa.descricao ?? ""}
                onChange={(event) => atualizarEtapa(etapa.id, "descricao", event.target.value)}
                placeholder="Descrição opcional da etapa"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Preço final</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={preco}
              onChange={(event) => setPreco(event.target.value)}
              placeholder="R$ 112.000,00"
            />
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Prazo de entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={prazo}
              onChange={(event) => setPrazo(event.target.value)}
              placeholder="Ex.: 60 dias"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Documentos anexos</CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={adicionarDocumentoMock}
          >
            <Upload className="h-3.5 w-3.5" /> Anexar documento (mock)
          </Button>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum documento anexado. Upload real entra em fase posterior — aqui apenas metadata.
            </p>
          ) : (
            <ul className="space-y-2">
              {documentos.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.nome}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {doc.enviado_em}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removerDocumento(doc.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={observacoes}
            onChange={(event) => setObservacoes(event.target.value)}
            placeholder="Premissas comerciais, condições de pagamento, etc."
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <CTAConsultoria variante={2} />
        <Button type="submit" disabled={!valido}>
          Enviar proposta
        </Button>
      </div>

      {!valido && (
        <p className="text-right text-xs text-muted-foreground">
          Preencha escopo, preço, prazo e pelo menos uma etapa de cronograma.
        </p>
      )}
    </form>
  );
}
