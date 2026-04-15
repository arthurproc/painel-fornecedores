"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownSimples } from "./markdown-simples";

interface EditorNotasProps {
  valorInicial?: string;
  onPublicar: (conteudo: string) => void;
}

export function EditorNotas({ valorInicial = "", onPublicar }: EditorNotasProps) {
  const [modo, setModo] = useState<"editar" | "preview">("editar");
  const [valor, setValor] = useState(valorInicial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"ocioso" | "salvando" | "salvo">("ocioso");

  useEffect(() => {
    if (!dirty) return;
    const timerA = window.setTimeout(() => setStatus("salvando"), 0);
    const timerB = window.setTimeout(() => {
      setStatus("salvo");
      setDirty(false);
    }, 1200);
    return () => {
      window.clearTimeout(timerA);
      window.clearTimeout(timerB);
    };
  }, [dirty, valor]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValor(e.target.value);
    setDirty(true);
  }

  function handlePublicar() {
    if (!valor.trim()) return;
    onPublicar(valor.trim());
    setValor("");
    setDirty(false);
    setStatus("ocioso");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={modo === "editar" ? "default" : "outline"}
            onClick={() => setModo("editar")}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant={modo === "preview" ? "default" : "outline"}
            onClick={() => setModo("preview")}
          >
            Preview
          </Button>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {status === "salvando" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> salvando rascunho…
            </>
          ) : status === "salvo" ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" /> rascunho salvo
            </>
          ) : (
            <span>sem alterações</span>
          )}
        </div>
      </div>

      {modo === "editar" ? (
        <Textarea
          rows={10}
          value={valor}
          onChange={handleChange}
          placeholder={`# Pontos fortes\n\n- Seu pitch destaca corretamente...\n\n# O que melhorar\n\n- ...`}
          className="font-mono text-sm"
        />
      ) : (
        <div className="rounded-lg border border-border p-4">
          {valor.trim() ? (
            <MarkdownSimples conteudo={valor} />
          ) : (
            <p className="text-sm italic text-muted-foreground">Nada para visualizar ainda.</p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={handlePublicar} disabled={!valor.trim()}>
          Publicar entregável
        </Button>
      </div>
    </div>
  );
}
