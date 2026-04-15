"use client";

import { useState } from "react";
import { AlertCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Contrato, Fornecedor, Projeto } from "@/lib/mock-data";
import { CTAConsultoria } from "./cta-consultoria";

interface FormularioCandidaturaProps {
  projeto: Projeto;
  fornecedor: Fornecedor | undefined;
  contratosDestacaveis: Contrato[];
  onSubmit: () => void;
}

const LIMITE_PITCH = 500;

export function FormularioCandidatura({
  projeto,
  fornecedor,
  contratosDestacaveis,
  onSubmit,
}: FormularioCandidaturaProps) {
  const [pitch, setPitch] = useState(
    `Temos forte experiência em ${projeto.categoria.toLowerCase()} e podemos iniciar rapidamente após a aprovação.`
  );
  const [capacidade, setCapacidade] = useState(fornecedor?.capacidade_atual ?? "");
  const [faixa, setFaixa] = useState("");
  const [contratosSelecionados, setContratosSelecionados] = useState<string[]>(
    contratosDestacaveis.slice(0, 2).map((c) => c.id)
  );
  const [certificacoesSelecionadas, setCertificacoesSelecionadas] = useState<string[]>(
    fornecedor?.certificacoes ?? []
  );

  function toggleContrato(id: string) {
    setContratosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleCertificacao(cert: string) {
    setCertificacoesSelecionadas((prev) =>
      prev.includes(cert) ? prev.filter((x) => x !== cert) : [...prev, cert]
    );
  }

  const pitchValido = pitch.trim().length > 20 && pitch.length <= LIMITE_PITCH;
  const formularioValido = pitchValido && capacidade.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formularioValido) return;
    onSubmit();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Pitch curto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="pitch" className="sr-only">
            Pitch
          </Label>
          <Textarea
            id="pitch"
            rows={5}
            value={pitch}
            onChange={(event) => setPitch(event.target.value)}
            placeholder="Por que você é um bom parceiro para este projeto?"
            maxLength={LIMITE_PITCH + 20}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Seja direto: por que vocês são um bom parceiro para este projeto?</span>
            <span className={cn(pitch.length > LIMITE_PITCH && "text-red-600")}>
              {pitch.length}/{LIMITE_PITCH}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Contratos destacáveis do seu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {contratosDestacaveis.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Seu perfil ainda não tem contratos encerrados para destacar. Envie a candidatura
              normalmente — a empresa avalia também o pitch.
            </p>
          ) : (
            <div className="space-y-2">
              {contratosDestacaveis.map((contrato) => {
                const ativo = contratosSelecionados.includes(contrato.id);
                return (
                  <button
                    type="button"
                    key={contrato.id}
                    onClick={() => toggleContrato(contrato.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      ativo
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span>
                      Contrato #{contrato.id} — {contrato.valor_final} ·{" "}
                      {contrato.data_fechamento}
                    </span>
                    <Badge variant="secondary">{ativo ? "Selecionado" : "Selecionar"}</Badge>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Capacidade declarada</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={capacidade}
            onChange={(event) => setCapacidade(event.target.value)}
            placeholder="Ex.: Equipe de 12 técnicos + engenheiro responsável — disponível em 7 dias"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Descreva objetivamente o tamanho da equipe e o prazo de mobilização.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Faixa de preço preliminar (opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            value={faixa}
            onChange={(event) => setFaixa(event.target.value)}
            placeholder="Ex.: R$ 280.000 – R$ 320.000"
          />
          {faixa.trim().length === 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Candidaturas que declaram faixa de preço preliminar têm mais chance de avançar.
                Você pode ajustar na proposta formal.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Certificações aplicáveis</CardTitle>
        </CardHeader>
        <CardContent>
          {(fornecedor?.certificacoes ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cadastre certificações no seu perfil para destacá-las aqui.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {fornecedor?.certificacoes.map((cert) => {
                const ativo = certificacoesSelecionadas.includes(cert);
                return (
                  <button
                    type="button"
                    key={cert}
                    onClick={() => toggleCertificacao(cert)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      ativo
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {cert}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {!formularioValido && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Preencha pitch (mínimo 20 caracteres) e capacidade declarada antes de enviar.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <CTAConsultoria variante={1} />
        <Button type="submit" disabled={!formularioValido}>
          Enviar candidatura
        </Button>
      </div>
    </form>
  );
}
