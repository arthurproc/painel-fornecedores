"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Briefcase,
  Building2,
  Send,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projetos, statusLabels, statusColors } from "@/lib/mock-data";

export default function ProjetoFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projeto = projetos.find((p) => p.id === id) || projetos[0];
  const [showForm, setShowForm] = useState(false);
  const [enviado, setEnviado] = useState(false);

  return (
    <AppShell tipo="fornecedor" titulo="Detalhes do Projeto">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/fornecedor/projetos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos Projetos
        </Link>

        {/* Success message */}
        {enviado && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">
                  Proposta enviada com sucesso!
                </p>
                <p className="text-sm text-emerald-700">
                  A empresa sera notificada e voce pode acompanhar o status no
                  seu dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Info */}
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-lg font-bold">
              {projeto.empresaLogo}
            </div>
            <div>
              <p className="font-semibold text-lg">{projeto.empresa}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Mineracao e Siderurgia
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {projeto.regiao}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{projeto.titulo}</h1>
                  <Badge
                    variant="secondary"
                    className={statusColors[projeto.status]}
                  >
                    {statusLabels[projeto.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Publicado em {projeto.dataPublicacao}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {projeto.descricao}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Orcamento</p>
                  <p className="font-medium text-sm">{projeto.orcamento}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Prazo para Propostas
                  </p>
                  <p className="font-medium text-sm">{projeto.prazo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Categoria</p>
                  <p className="font-medium text-sm">{projeto.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Interessados</p>
                  <p className="font-medium text-sm">
                    {projeto.interessados} fornecedores
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            <div>
              <h3 className="font-semibold mb-3">
                Requisitos do Fornecedor
              </h3>
              <div className="space-y-2">
                {projeto.requisitos.map((req) => (
                  <div
                    key={req}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-5" />

            {/* CTA */}
            {!enviado && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setShowForm(true)}
                >
                  <Send className="w-4 h-4" /> Manifestar Interesse
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manifest Interest Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manifestar Interesse</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium">{projeto.titulo}</p>
              <p className="text-xs text-muted-foreground">
                {projeto.empresa} &bull; Orcamento: {projeto.orcamento}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor da Proposta</Label>
                <Input placeholder="R$ 0,00" defaultValue="R$ 320.000,00" />
              </div>
              <div className="space-y-2">
                <Label>Prazo de Entrega</Label>
                <Input
                  placeholder="Ex: 45 dias"
                  defaultValue="45 dias"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mensagem para a Empresa</Label>
              <Textarea
                rows={4}
                placeholder="Descreva sua experiencia, diferenciais e como pode atender a demanda..."
                defaultValue="Nossa equipe possui ampla experiencia na area e podemos iniciar os trabalhos em ate 7 dias apos a aprovacao. Dispomos de todos os equipamentos necessarios e equipe certificada."
              />
            </div>

            <div className="space-y-2">
              <Label>Certificacoes Relevantes</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">ISO 9001</Badge>
                <Badge variant="secondary">NR-22</Badge>
                <Badge variant="secondary">NR-10</Badge>
                <Badge variant="secondary">NR-35</Badge>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                className="gap-2"
                onClick={() => {
                  setShowForm(false);
                  setEnviado(true);
                }}
              >
                <Send className="w-4 h-4" /> Enviar Proposta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
