"use client";

import Link from "next/link";
import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Handshake className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ConectaFornece</span>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para acessar a plataforma
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com.br"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input id="senha" type="password" placeholder="••••••••" />
            </div>

            <Link href="/empresa/dashboard" className="block">
              <Button className="w-full" size="lg">
                Entrar como Empresa
              </Button>
            </Link>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                ou
              </span>
            </div>

            <Link href="/fornecedor/dashboard" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Entrar como Fornecedor
              </Button>
            </Link>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Ainda nao tem uma conta?{" "}
              <Link href="/registro" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
