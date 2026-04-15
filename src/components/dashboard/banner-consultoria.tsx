import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type BannerConsultoriaEstado =
  | "descarte_recente"
  | "projeto_alto_fit"
  | "default";

interface BannerConsultoriaProps {
  estado: BannerConsultoriaEstado;
  projetoTitulo?: string;
  empresaNome?: string;
  fitScore?: number;
}

export function BannerConsultoria({
  estado,
  projetoTitulo,
  empresaNome,
  fitScore,
}: BannerConsultoriaProps) {
  const variante =
    estado === "descarte_recente"
      ? {
          titulo: "Sua candidatura foi descartada",
          descricao: projetoTitulo
            ? `No projeto ${projetoTitulo}. Quer entender o motivo e voltar mais forte?`
            : "Quer entender o motivo e voltar mais forte?",
          cta: "Falar com a Consultoria",
          href: "/fornecedor/consultoria/catalogo",
        }
      : estado === "projeto_alto_fit"
        ? {
            titulo: "Projeto com alta aderência para você",
            descricao:
              projetoTitulo && empresaNome
                ? `${projetoTitulo} em ${empresaNome}. Sua aderência estimada está em ${fitScore ?? 80}%.`
                : `Há um novo projeto com aderência estimada de ${fitScore ?? 80}% no seu perfil.`,
            cta: "Ver oportunidade",
            href: "/fornecedor/projetos",
          }
        : {
            titulo: "Aumente sua taxa de seleção para proposta",
            descricao:
              "Use a Consultoria para revisar candidatura e proposta formal antes de enviar.",
            cta: "Ver catálogo",
            href: "/fornecedor/consultoria/catalogo",
          };

  return (
    <Card className="rounded-xl border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold">{variante.titulo}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{variante.descricao}</p>
        <Button asChild size="sm">
          <Link href={variante.href}>{variante.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
