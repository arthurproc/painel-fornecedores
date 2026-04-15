import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotaoContratar } from "@/components/consultoria/botao-contratar";
import { CardEstudoCaso } from "@/components/consultoria/card-estudo-caso";
import {
  catalogoConsultoria,
  estudosDeCaso,
  getCatalogoByTipo,
} from "@/lib/mock-data";

interface Props {
  params: Promise<{ tipo: string }>;
}

const tiposValidos = [
  "revisao_candidatura",
  "revisao_proposta",
  "acompanhamento_completo",
  "retorno_pos_descarte",
] as const;
type TipoValido = (typeof tiposValidos)[number];

const conteudoPorTipo: Record<
  TipoValido,
  {
    oQueRecebe: string[];
    quandoFazSentido: string;
    faq: { pergunta: string; resposta: string }[];
  }
> = {
  revisao_candidatura: {
    oQueRecebe: [
      "Leitura do seu perfil + perfil da empresa contratante",
      "Análise do projeto e dos critérios de seleção",
      "Recomendações específicas para o seu pitch",
      "Contratos similares e como outros fornecedores se posicionaram",
      "Notas escritas + uma sessão opcional de tira-dúvidas",
    ],
    quandoFazSentido:
      "Antes de enviar uma candidatura para projetos onde você tem menos histórico ou que envolvem categorias novas para você.",
    faq: [
      {
        pergunta: "Em quanto tempo recebo a revisão?",
        resposta:
          "Dentro de 24-48h após a atribuição de um consultor. Em 100% dos casos ajustados em projetos parecidos.",
      },
      {
        pergunta: "Consigo revisar mais de uma candidatura?",
        resposta:
          "Sim. Cada sessão cobre uma candidatura. Para cobrir também a proposta, considere o pacote Acompanhamento Completo.",
      },
    ],
  },
  revisao_proposta: {
    oQueRecebe: [
      "Análise completa de escopo, cronograma e precificação",
      "Sugestões específicas para aumentar taxa de conversão",
      "Comparação com estrutura de propostas vencedoras",
      "Checagem de documentos e atestados",
      "Notas escritas + 1 sessão opcional de tira-dúvidas",
    ],
    quandoFazSentido:
      "Quando você foi selecionado para proposta e precisa fechar uma proposta formal competitiva. Investir aqui aumenta muito a taxa de vitória.",
    faq: [
      {
        pergunta: "Preciso ter proposta pronta?",
        resposta:
          "Não. O consultor pode revisar ideias iniciais ou ajudar a estruturar do zero dentro do escopo da sessão.",
      },
      {
        pergunta: "Posso combinar com revisão de candidatura?",
        resposta: "Sim — nesse caso o Acompanhamento Completo economiza em relação à contratação separada.",
      },
    ],
  },
  acompanhamento_completo: {
    oQueRecebe: [
      "Revisão de candidatura + revisão de proposta formal com um único consultor",
      "Consultor dedicado durante todo o ciclo da oportunidade",
      "Anexos de estudos de caso relevantes em cada fase",
      "Sessões de tira-dúvidas sob demanda",
      "Acompanhamento pós-envio com análise de resultado",
    ],
    quandoFazSentido:
      "Para oportunidades estratégicas — contratos novos com grande contratante, categoria nova ou projeto de valor alto.",
    faq: [
      {
        pergunta: "Como funciona o success fee?",
        resposta:
          "R$ 1.500 no momento da contratação + 3% do valor final do contrato caso a proposta vença. Sem vitória, sem cobrança extra.",
      },
      {
        pergunta: "Posso cancelar no meio do ciclo?",
        resposta: "Sim. Cancelamentos antes da entrega final da proposta são sem custo no MVP.",
      },
    ],
  },
  retorno_pos_descarte: {
    oQueRecebe: [
      "Análise do motivo real do descarte com base no histórico",
      "Diagnóstico dos pontos fracos na candidatura descartada",
      "Plano de ação para próximas candidaturas no setor",
      "Sugestão de reposicionamento do pitch",
      "Notas escritas + 1 call de 30 min",
    ],
    quandoFazSentido:
      "Logo após receber um descarte, especialmente quando você não entendeu o motivo ou quer voltar a competir no mesmo segmento.",
    faq: [
      {
        pergunta: "Funciona para qualquer categoria?",
        resposta:
          "Sim. O consultor cruza seu histórico com padrões de candidaturas vencedoras no mesmo segmento.",
      },
      {
        pergunta: "Tem garantia de resultado?",
        resposta:
          "Não prometemos vitórias. Prometemos clareza sobre o que ajustar — 85% dos fornecedores que aplicam o plano melhoram na próxima candidatura.",
      },
    ],
  },
};

export function generateStaticParams() {
  return catalogoConsultoria.map((c) => ({ tipo: c.tipo }));
}

export default async function ProdutoConsultoriaPage({ params }: Props) {
  const { tipo } = await params;
  if (!tiposValidos.includes(tipo as TipoValido)) {
    notFound();
  }
  const catalogo = getCatalogoByTipo(tipo as TipoValido);
  if (!catalogo) {
    notFound();
  }

  const conteudo = conteudoPorTipo[tipo as TipoValido];

  const casosRelacionados = estudosDeCaso
    .filter((e) => {
      const categoriaAlvo = catalogo.tipo === "revisao_candidatura" ? null : null;
      return categoriaAlvo ? e.contexto.categoria === categoriaAlvo : true;
    })
    .slice(0, 3);

  return (
    <AppShell tipo="fornecedor" titulo={catalogo.nome}>
      <div className="max-w-4xl space-y-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/fornecedor/consultoria/catalogo">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao catálogo
          </Link>
        </Button>

        <Card className="rounded-xl">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{catalogo.nome}</h1>
              <p className="text-sm text-muted-foreground">{catalogo.descricao}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge className="bg-amber-100 text-amber-900">{catalogo.preco_valor}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {catalogo.prazo_entrega_estimado}
              </span>
              {catalogo.preco_observacao ? (
                <span className="text-xs text-muted-foreground">{catalogo.preco_observacao}</span>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">O que você recebe</h2>
          <ul className="space-y-2">
            {conteudo.oQueRecebe.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Quando faz sentido</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {conteudo.quandoFazSentido}
          </p>
        </section>

        {casosRelacionados.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Casos relacionados</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {casosRelacionados.map((estudo) => (
                <CardEstudoCaso key={estudo.id} estudo={estudo} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Perguntas frequentes</h2>
          <div className="space-y-2">
            {conteudo.faq.map((item) => (
              <Card key={item.pergunta} className="rounded-xl">
                <CardContent className="space-y-1 p-4">
                  <p className="text-sm font-medium">{item.pergunta}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.resposta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-background py-4">
          <BotaoContratar catalogo={catalogo} size="lg" />
        </div>
      </div>
    </AppShell>
  );
}
