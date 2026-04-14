"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Truck, Handshake, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regioes, categorias } from "@/lib/mock-data";

type Tipo = null | "empresa" | "fornecedor";

export default function RegistroPage() {
  const [tipo, setTipo] = useState<Tipo>(null);

  if (tipo === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Handshake className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ConectaFornece</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Criar Conta</h1>
            <p className="text-muted-foreground mt-1">
              Como voce deseja utilizar a plataforma?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
              onClick={() => setTipo("empresa")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Sou uma Empresa</h2>
                <p className="text-muted-foreground text-sm">
                  Quero publicar projetos e encontrar fornecedores qualificados
                  para minha empresa.
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
              onClick={() => setTipo("fornecedor")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Sou um Fornecedor
                </h2>
                <p className="text-muted-foreground text-sm">
                  Quero oferecer meus servicos e participar de projetos de
                  grandes empresas.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Ja tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Handshake className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ConectaFornece</span>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <button
              onClick={() => setTipo(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <h1 className="text-2xl font-bold">
              Cadastro de {tipo === "empresa" ? "Empresa" : "Fornecedor"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Preencha os dados para criar sua conta
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  {tipo === "empresa" ? "Razao Social" : "Nome da Empresa"}
                </Label>
                <Input placeholder={tipo === "empresa" ? "Vale S.A." : "TechMinas Ltda"} />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input placeholder="00.000.000/0000-00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <Input type="email" placeholder="contato@empresa.com.br" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(31) 0000-0000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Regiao</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua regiao" />
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

            {tipo === "fornecedor" && (
              <div className="space-y-2">
                <Label>Categoria Principal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
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
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>

            <Link
              href={
                tipo === "empresa"
                  ? "/empresa/dashboard"
                  : "/fornecedor/dashboard"
              }
              className="block pt-2"
            >
              <Button className="w-full gap-2" size="lg">
                Criar Conta <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-center text-sm text-muted-foreground">
              Ja tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
