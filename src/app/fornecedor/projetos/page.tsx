"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projetos,
  categorias,
  regioes,
  statusLabels,
  statusColors,
  nomeEmpresa,
  logoEmpresa,
  candidaturasCountByProjeto,
} from "@/lib/mock-data";

export default function BuscarProjetosPage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("todas");
  const [busca, setBusca] = useState("");

  const projetosFiltrados = projetos.filter((p) => {
    if (
      categoriaSelecionada !== "todas" &&
      p.categoria !== categoriaSelecionada
    )
      return false;
    if (regiaoSelecionada !== "todas" && p.regiao !== regiaoSelecionada)
      return false;
    if (
      busca &&
      !p.titulo.toLowerCase().includes(busca.toLowerCase()) &&
      !p.descricao.toLowerCase().includes(busca.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <AppShell tipo="fornecedor" titulo="Buscar Projetos">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar projetos por titulo ou descricao..."
                  className="pl-9"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <Select
                value={categoriaSelecionada}
                onValueChange={(v) => v && setCategoriaSelecionada(v)}
              >
                <SelectTrigger className="w-52">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Categorias</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={regiaoSelecionada}
                onValueChange={(v) => v && setRegiaoSelecionada(v)}
              >
                <SelectTrigger className="w-52">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Regiao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Regioes</SelectItem>
                  {regioes.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              {projetosFiltrados.length}
            </strong>{" "}
            projetos encontrados
          </p>
          <Select defaultValue="recentes">
            <SelectTrigger className="w-44">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais Recentes</SelectItem>
              <SelectItem value="orcamento">Maior Orcamento</SelectItem>
              <SelectItem value="prazo">Prazo Mais Proximo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-2 gap-4">
          {projetosFiltrados.map((projeto) => (
            <Link
              key={projeto.id}
              href={`/fornecedor/projeto/${projeto.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                        {logoEmpresa(projeto)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {nomeEmpresa(projeto)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Publicado em {projeto.dataPublicacao}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={statusColors[projeto.status]}
                    >
                      {statusLabels[projeto.status]}
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2">{projeto.titulo}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {projeto.descricao}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-xs">{projeto.orcamento}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs">{projeto.regiao}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        Prazo: {projeto.prazo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {candidaturasCountByProjeto(projeto.id)} candidaturas
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {projeto.categoria}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
