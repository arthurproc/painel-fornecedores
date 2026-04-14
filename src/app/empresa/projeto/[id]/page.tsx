"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  projetos,
  propostas,
  statusLabels,
  statusColors,
  Proposta,
} from "@/lib/mock-data";

export default function ProjetoEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id) || projetos[0];
  const propostasProjeto = propostas.filter(
    (p) => p.projeto.id === projeto.id
  );
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string | null>(null);

  const handleSelecionar = (proposta: Proposta) => {
    setSelectedProposta(proposta);
    setConfirmDialog(true);
  };

  const confirmarSelecao = () => {
    if (selectedProposta) {
      setFornecedorSelecionado(selectedProposta.fornecedor.id);
    }
    setConfirmDialog(false);
  };

  return (
    <AppShell tipo="empresa" titulo="Detalhes do Projeto">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/empresa/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>

        {/* Project Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{projeto.titulo}</h1>
                  <Badge
                    variant="secondary"
                    className={statusColors[fornecedorSelecionado ? "em_andamento" : projeto.status]}
                  >
                    {fornecedorSelecionado
                      ? "Fornecedor Selecionado"
                      : statusLabels[projeto.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{projeto.descricao}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.categoria}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.regiao}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{projeto.orcamento}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Prazo: {projeto.prazo}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm font-medium mb-2">Requisitos</p>
              <div className="flex flex-wrap gap-2">
                {projeto.requisitos.map((req) => (
                  <Badge key={req} variant="secondary">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Propostas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Fornecedores Interessados ({propostasProjeto.length})
            </h2>
          </div>

          {fornecedorSelecionado && (
            <Card className="mb-4 border-emerald-200 bg-emerald-50">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  Fornecedor selecionado com sucesso! O fornecedor sera
                  notificado e podera iniciar o projeto.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {propostasProjeto.map((proposta) => {
              const isSelected =
                fornecedorSelecionado === proposta.fornecedor.id;
              const isRejected =
                fornecedorSelecionado &&
                fornecedorSelecionado !== proposta.fornecedor.id;

              return (
                <Card
                  key={proposta.id}
                  className={
                    isSelected
                      ? "border-emerald-300 bg-emerald-50/50"
                      : isRejected
                      ? "opacity-50"
                      : ""
                  }
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {proposta.fornecedor.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {proposta.fornecedor.nome}
                              </h3>
                              {isSelected && (
                                <Badge className="bg-emerald-100 text-emerald-800">
                                  Selecionado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {proposta.fornecedor.avaliacao}
                              </span>
                              <span>
                                {proposta.fornecedor.projetosRealizados}{" "}
                                projetos
                              </span>
                              <span>{proposta.fornecedor.regiao}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {proposta.valor}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Prazo: {proposta.prazoEntrega}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-3">
                          {proposta.mensagem}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {proposta.fornecedor.certificacoes.map((cert) => (
                            <Badge
                              key={cert}
                              variant="outline"
                              className="text-xs"
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>

                        {!fornecedorSelecionado && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => handleSelecionar(proposta)}
                              className="gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                              Selecionar
                            </Button>
                            <Link
                              href={`/fornecedor/perfil?id=${proposta.fornecedor.id}`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Ver
                                Perfil
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Selecao de Fornecedor</DialogTitle>
            <DialogDescription>
              Voce esta selecionando o fornecedor{" "}
              <strong>{selectedProposta?.fornecedor.nome}</strong> com proposta
              de <strong>{selectedProposta?.valor}</strong> e prazo de{" "}
              <strong>{selectedProposta?.prazoEntrega}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarSelecao} className="gap-1">
              <CheckCircle2 className="w-4 h-4" /> Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
