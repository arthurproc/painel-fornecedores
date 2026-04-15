"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardEstudoCaso } from "@/components/consultoria/card-estudo-caso";
import { categorias, estudosDeCaso, regioes } from "@/lib/mock-data";

export default function EstudosDeCasoBrowser() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");
  const [regiao, setRegiao] = useState<string>("todas");

  const filtrados = useMemo(() => {
    return estudosDeCaso.filter((e) => {
      if (categoria !== "todas" && e.contexto.categoria !== categoria) return false;
      if (regiao !== "todas" && e.contexto.regiao !== regiao) return false;
      if (busca.trim()) {
        const termo = busca.trim().toLowerCase();
        return (
          e.titulo.toLowerCase().includes(termo) ||
          e.resumo.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [busca, categoria, regiao]);

  return (
    <AppShell tipo="fornecedor" titulo="Estudos de caso">
      <div className="space-y-6">
        <Card className="rounded-xl">
          <CardContent className="space-y-4 p-5">
            <div>
              <h1 className="text-lg font-semibold">Estudos de caso</h1>
              <p className="text-sm text-muted-foreground">
                Casos curados pela equipe de Consultoria — aprendizados reais para ajustar sua
                estratégia.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="busca">Buscar</Label>
                <Input
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Título ou resumo"
                />
              </div>
              <div className="space-y-1">
                <Label>Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {categorias.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Região</Label>
                <Select value={regiao} onValueChange={setRegiao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {regioes.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filtrados.length === 0 ? (
          <Card className="rounded-xl border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum estudo com esses filtros.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((estudo) => (
              <CardEstudoCaso key={estudo.id} estudo={estudo} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
