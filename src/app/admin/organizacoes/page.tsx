"use client";

import { MapPin, Calendar, Star, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { empresas, fornecedores, projetos, propostas } from "@/lib/mock-data";

export default function AdminOrganizacoes() {
  return (
    <AppShell tipo="admin" titulo="Organizações">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {empresas.length + fornecedores.length} organizações cadastradas na plataforma
        </p>

        <Tabs defaultValue="empresas">
          <TabsList>
            <TabsTrigger value="empresas">
              Empresas Contratantes ({empresas.length})
            </TabsTrigger>
            <TabsTrigger value="fornecedores">
              Fornecedores ({fornecedores.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresas" className="mt-4 space-y-3">
            {empresas.map((empresa) => {
              const demandasEmpresa = projetos.filter(
                (p) => p.empresa === empresa.nome
              );
              const ativas = demandasEmpresa.filter(
                (p) => p.status !== "arquivado"
              ).length;
              const fechadas = demandasEmpresa.filter(
                (p) => p.status === "arquivado"
              ).length;

              return (
                <Card key={empresa.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {empresa.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{empresa.nome}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {empresa.setor}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {empresa.regiao}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            desde {empresa.desde}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 shrink-0">
                        <div className="text-center">
                          <p className="text-xl font-bold text-primary">{ativas}</p>
                          <p className="text-xs text-muted-foreground">ativas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{fechadas}</p>
                          <p className="text-xs text-muted-foreground">fechadas</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="fornecedores" className="mt-4 space-y-3">
            {fornecedores.map((fornecedor) => {
              const propostasFornecedor = propostas.filter(
                (p) => p.fornecedor.id === fornecedor.id
              );

              return (
                <Card key={fornecedor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {fornecedor.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{fornecedor.nome}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {fornecedor.categorias[0]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {fornecedor.regiao}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            desde {fornecedor.desde}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 shrink-0">
                        <div className="text-center">
                          <p className="text-xl font-bold">{fornecedor.projetosRealizados}</p>
                          <p className="text-xs text-muted-foreground">contratos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">propostas</p>
                          <p className="text-xl font-bold">{propostasFornecedor.length}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-xl font-bold">{fornecedor.avaliacao}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
