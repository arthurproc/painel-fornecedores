"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categorias, regioes } from "@/lib/mock-data";

const etapas = [
  "Informacoes Basicas",
  "Detalhes e Requisitos",
  "Revisao e Publicacao",
];

export default function NovoProjetoPage() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [requisitos, setRequisitos] = useState<string[]>([
    "Certificacao NR-22",
    "Experiencia minima de 3 anos",
  ]);
  const [novoRequisito, setNovoRequisito] = useState("");
  const [publicado, setPublicado] = useState(false);

  const adicionarRequisito = () => {
    if (novoRequisito.trim()) {
      setRequisitos([...requisitos, novoRequisito.trim()]);
      setNovoRequisito("");
    }
  };

  if (publicado) {
    return (
      <AppShell tipo="empresa" titulo="Novo Projeto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-10 pb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Projeto Publicado!</h2>
              <p className="text-muted-foreground mb-6">
                Seu projeto foi publicado com sucesso e ja esta visivel para
                fornecedores da regiao.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/empresa/projeto/1">
                  <Button>Ver Projeto</Button>
                </Link>
                <Link href="/empresa/dashboard">
                  <Button variant="outline">Voltar ao Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell tipo="empresa" titulo="Novo Projeto">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {etapas.map((etapa, i) => (
            <div key={etapa} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 ${
                  i <= etapaAtual
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i < etapaAtual
                      ? "bg-primary text-primary-foreground"
                      : i === etapaAtual
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < etapaAtual ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {etapa}
                </span>
              </div>
              {i < etapas.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    i < etapaAtual ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {etapaAtual === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Informacoes Basicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Titulo do Projeto</Label>
                <Input
                  placeholder="Ex: Manutencao Preventiva de Equipamentos"
                  defaultValue="Instalacao de Sistema de Iluminacao LED"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select defaultValue="Elétrica e Automação">
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label>Regiao</Label>
                  <Select defaultValue="Itabira - MG">
                    <SelectTrigger>
                      <SelectValue />
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
                <Label>Descricao do Projeto</Label>
                <Textarea
                  placeholder="Descreva o projeto em detalhes..."
                  rows={5}
                  defaultValue="Projeto para substituicao do sistema de iluminacao convencional por LED em toda a area operacional da planta de Itabira. Inclui fornecimento de materiais, mao de obra e projeto eletrico. Estimativa de 500 pontos de luz."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {etapaAtual === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes e Requisitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Orcamento Estimado (Min)</Label>
                  <Input
                    placeholder="R$ 0,00"
                    defaultValue="R$ 200.000,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Orcamento Estimado (Max)</Label>
                  <Input
                    placeholder="R$ 0,00"
                    defaultValue="R$ 350.000,00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prazo para Propostas</Label>
                <Input type="date" defaultValue="2026-05-30" />
              </div>

              <div className="space-y-2">
                <Label>Requisitos do Fornecedor</Label>
                <div className="flex gap-2">
                  <Input
                    value={novoRequisito}
                    onChange={(e) => setNovoRequisito(e.target.value)}
                    placeholder="Adicionar requisito..."
                    onKeyDown={(e) =>
                      e.key === "Enter" && adicionarRequisito()
                    }
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={adicionarRequisito}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {requisitos.map((req, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {req}
                      <button
                        onClick={() =>
                          setRequisitos(requisitos.filter((_, j) => j !== i))
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 - Review */}
        {etapaAtual === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Revisao do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Titulo</p>
                  <p className="font-medium">
                    Instalacao de Sistema de Iluminacao LED
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">Eletrica e Automacao</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regiao</p>
                  <p className="font-medium">Itabira - MG</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orcamento</p>
                  <p className="font-medium">R$ 200.000 - R$ 350.000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">30/05/2026</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descricao</p>
                <p className="text-sm">
                  Projeto para substituicao do sistema de iluminacao
                  convencional por LED em toda a area operacional da planta de
                  Itabira. Inclui fornecimento de materiais, mao de obra e
                  projeto eletrico. Estimativa de 500 pontos de luz.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Requisitos</p>
                <div className="flex flex-wrap gap-2">
                  {requisitos.map((req, i) => (
                    <Badge key={i} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setEtapaAtual(Math.max(0, etapaAtual - 1))}
            disabled={etapaAtual === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </Button>
          {etapaAtual < 2 ? (
            <Button
              onClick={() => setEtapaAtual(etapaAtual + 1)}
              className="gap-1"
            >
              Proximo <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={() => setPublicado(true)} className="gap-1">
              <CheckCircle2 className="w-4 h-4" /> Publicar Projeto
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
