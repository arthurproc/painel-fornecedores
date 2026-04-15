import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { CardServicoConsultoria } from "@/components/consultoria/card-servico-consultoria";
import { CardEstudoCaso } from "@/components/consultoria/card-estudo-caso";
import { catalogoConsultoria, getEstudosDestaque } from "@/lib/mock-data";

export default function FornecedorConsultoriaCatalogoPage() {
  const servicos = catalogoConsultoria.filter((item) => item.ativo);
  const destaques = getEstudosDestaque();

  return (
    <AppShell tipo="fornecedor" titulo="Consultoria">
      <div className="space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-2xl font-semibold">Acelere suas chances</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Especialistas que entendem do mercado industrial brasileiro analisam sua candidatura,
            proposta ou histórico de descartes — e te ajudam a se posicionar melhor em cada
            oportunidade.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Catálogo</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {servicos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Catálogo em construção.</p>
            ) : (
              servicos.map((item) => <CardServicoConsultoria key={item.id} item={item} />)
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Estudos de caso em destaque</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/consultoria/estudos">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          {destaques.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Estudos de caso aparecem aqui à medida que advisors publicam.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {destaques.map((estudo) => (
                <CardEstudoCaso key={estudo.id} estudo={estudo} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
