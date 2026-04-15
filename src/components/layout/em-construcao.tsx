import { AppShell, type AppShellTipo } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmConstrucaoProps {
  tipo: AppShellTipo;
  titulo: string;
  descricao: string;
}

export function EmConstrucao({ tipo, titulo, descricao }: EmConstrucaoProps) {
  return (
    <AppShell tipo={tipo} titulo={titulo}>
      <div className="max-w-3xl">
        <Card className="rounded-xl">
          <CardHeader>
            <Badge variant="secondary" className="w-fit rounded-full mb-3">
              Em construção
            </Badge>
            <CardTitle className="text-xl font-semibold">{titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{descricao}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
