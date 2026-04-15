import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEMBRO_LOGADO_ID,
  getEmpresaByOrganizacao,
  getMembroById,
} from "@/lib/mock-data";

export default function EmpresaPerfilPublicoPage() {
  const membroLogado = getMembroById(MEMBRO_LOGADO_ID);
  const empresaAtiva = getEmpresaByOrganizacao(
    membroLogado?.organizacao_id ?? ""
  );
  const rotaFutura = empresaAtiva
    ? `/perfil/empresa/${empresaAtiva.id}`
    : "/perfil/empresa/[id]";

  return (
    <AppShell tipo="empresa" titulo="Perfil público da empresa">
      <div className="max-w-3xl">
        <Card className="rounded-xl">
          <CardHeader>
            <Badge variant="secondary" className="mb-3 w-fit rounded-full">
              Em construção
            </Badge>
            <CardTitle className="text-xl font-semibold">
              Perfil público da empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              O perfil público da empresa será construído em{" "}
              <code className="font-mono text-foreground">{rotaFutura}</code> na
              Fase 5 (perfis públicos). Aquela rota passará a ser o lugar canônico
              onde fornecedores e visitantes enxergam a reputação agregada, os
              contratos públicos e a linkagem cruzada das organizações.
            </p>
            <p>
              Por enquanto, esta página serve apenas como ponto de entrada a
              partir da sidebar.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href={rotaFutura}>
                  Ver esqueleto <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
