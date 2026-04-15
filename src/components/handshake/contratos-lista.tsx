import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  empresas,
  fornecedores,
  projetos,
  statusColors,
  statusLabels,
  type Contrato,
} from "@/lib/mock-data";

interface ContratosListaProps {
  contratos: Contrato[];
  lado: "empresa" | "fornecedor";
  vazio?: React.ReactNode;
}

export function ContratosLista({ contratos, lado, vazio }: ContratosListaProps) {
  if (contratos.length === 0) {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          {vazio ?? "Nenhum contrato nesta aba."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {contratos.map((contrato) => {
        const projeto = projetos.find((p) => p.id === contrato.projeto_id);
        const empresa = empresas.find((e) => e.id === contrato.empresa_id);
        const fornecedor = fornecedores.find((f) => f.id === contrato.fornecedor_id);
        const contraparte = lado === "empresa" ? fornecedor?.nome : empresa?.nome;
        return (
          <Card key={contrato.id} className="rounded-xl">
            <CardContent className="flex flex-wrap items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="font-semibold">{projeto?.titulo ?? "Projeto"}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {contraparte ?? "Contraparte"} · Início {contrato.data_inicio ?? "—"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    Valor: <strong className="text-foreground">{contrato.valor_final}</strong>
                  </span>
                  <span>
                    {contrato.data_fim_real
                      ? `Encerrado em ${contrato.data_fim_real}`
                      : contrato.data_fim_estimada
                        ? `Previsto para ${contrato.data_fim_estimada}`
                        : "Sem data final prevista"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary" className={statusColors[contrato.status]}>
                  {statusLabels[contrato.status]}
                </Badge>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${lado}/contratos/${contrato.id}`}>Abrir contrato</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
