import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lightbulb, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownSimples } from "@/components/consultoria/markdown-simples";
import {
  advisors,
  contratos,
  empresas,
  estudosDeCaso,
  fornecedores,
  getEstudoDeCasoById,
  type EstudoDeCaso,
} from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

function placeholderFornecedor(estudo: EstudoDeCaso): string {
  const porte = estudo.contexto.porte_fornecedor;
  const label = porte === "pequeno" ? "pequena" : porte === "medio" ? "média" : "grande";
  return `Fornecedora ${label} de ${estudo.contexto.categoria.toLowerCase()}`;
}

function placeholderEmpresa(estudo: EstudoDeCaso): string {
  const categoria = estudo.contexto.categoria;
  if (/ambiental|seguran/i.test(categoria)) return "Grande siderúrgica regional";
  if (/manuten|log/i.test(categoria)) return "Grande mineradora";
  return "Grande contratante industrial";
}

export function generateStaticParams() {
  return estudosDeCaso.map((e) => ({ id: e.id }));
}

export default async function EstudoDeCasoPage({ params }: Props) {
  const { id } = await params;
  const estudo = getEstudoDeCasoById(id);
  if (!estudo) return notFound();

  const contrato = contratos.find((c) => c.id === estudo.contrato_id_origem);
  const fornecedor = contrato ? fornecedores.find((f) => f.id === contrato.fornecedor_id) : undefined;
  const empresa = contrato ? empresas.find((e) => e.id === contrato.empresa_id) : undefined;
  const autor = advisors.find((a) => a.id === estudo.autor_advisor_id);

  const nomeFornecedor =
    estudo.anonimizacao.fornecedor === "anonimo"
      ? placeholderFornecedor(estudo)
      : fornecedor?.nome ?? placeholderFornecedor(estudo);
  const nomeEmpresa =
    estudo.anonimizacao.empresa === "anonimo"
      ? placeholderEmpresa(estudo)
      : empresa?.nome ?? placeholderEmpresa(estudo);

  return (
    <AppShell tipo="fornecedor" titulo={estudo.titulo}>
      <div className="max-w-3xl space-y-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/consultoria/estudos">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Link>
        </Button>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full">
              {estudo.contexto.categoria}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {estudo.contexto.regiao}
            </span>
            {estudo.destaque ? (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                Destaque
              </Badge>
            ) : null}
          </div>
          <h1 className="text-2xl font-semibold">{estudo.titulo}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{estudo.resumo}</p>
          <p className="text-xs text-muted-foreground">
            Publicado em {estudo.publicado_em}
            {autor ? ` por ${autor.nome}` : ""}
          </p>
        </div>

        <Card className="rounded-xl">
          <CardContent className="grid grid-cols-2 gap-4 p-5 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fornecedor
              </p>
              <p className="mt-1 font-medium">{nomeFornecedor}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Empresa
              </p>
              <p className="mt-1 font-medium">{nomeEmpresa}</p>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">O caso</h2>
          <MarkdownSimples conteudo={estudo.corpo} />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold inline-flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Aprendizados
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {estudo.aprendizados.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
