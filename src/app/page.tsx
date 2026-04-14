import Link from "next/link";
import {
  Building2,
  Truck,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Search,
  Handshake,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { valor: "150+", label: "Empresas Cadastradas" },
  { valor: "500+", label: "Fornecedores Ativos" },
  { valor: "1.200+", label: "Projetos Publicados" },
  { valor: "R$ 50M+", label: "Em Contratos Fechados" },
];

const categorias = [
  { icon: Building2, nome: "Construção Civil" },
  { icon: Truck, nome: "Transporte e Logística" },
  { icon: Shield, nome: "Segurança do Trabalho" },
  { icon: Users, nome: "Manutenção Industrial" },
];

const passos = [
  {
    numero: "01",
    titulo: "Cadastre sua Empresa",
    descricao:
      "Crie seu perfil como empresa contratante ou fornecedor de serviços em poucos minutos.",
    icon: Users,
  },
  {
    numero: "02",
    titulo: "Publique ou Busque Projetos",
    descricao:
      "Empresas publicam suas demandas. Fornecedores encontram oportunidades na sua região.",
    icon: Search,
  },
  {
    numero: "03",
    titulo: "Conecte-se e Negocie",
    descricao:
      "Fornecedores manifestam interesse e empresas avaliam as melhores propostas.",
    icon: Handshake,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Handshake className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">ConectaFornece</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/registro">
              <Button>Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Plataforma #1 da Regiao de Itabira
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Conectando grandes empresas aos melhores fornecedores da regiao
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A plataforma que facilita a conexao entre empresas que precisam de
              servicos e fornecedores qualificados em Itabira e regiao. Publique
              projetos, encontre parceiros e feche negocios.
            </p>
            <div className="flex gap-4">
              <Link href="/registro">
                <Button size="lg" className="gap-2">
                  Comece Agora <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/fornecedor/projetos">
                <Button size="lg" variant="outline" className="gap-2">
                  <Search className="w-4 h-4" /> Ver Projetos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.valor}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Como Funciona</h2>
          <p className="text-muted-foreground text-lg">
            Tres passos simples para conectar sua empresa ao mercado local
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {passos.map((passo) => (
            <Card
              key={passo.numero}
              className="relative border-none shadow-sm bg-card"
            >
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-5xl font-bold text-primary/15 mb-4">
                  {passo.numero}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <passo.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{passo.titulo}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {passo.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Principais Categorias</h2>
            <p className="text-muted-foreground text-lg">
              Encontre fornecedores especializados para cada necessidade
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {categorias.map((cat) => (
              <Card
                key={cat.nome}
                className="group hover:shadow-md transition-shadow cursor-pointer border-border"
              >
                <CardContent className="flex flex-col items-center py-8 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <cat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-medium text-center">{cat.nome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for both roles */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-8">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-8">
              <Building2 className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-3">Sou uma Empresa</h3>
              <p className="opacity-80 mb-6 leading-relaxed">
                Publique seus projetos e encontre fornecedores qualificados na
                regiao. Compare propostas e escolha o melhor parceiro.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Publique projetos gratuitamente",
                  "Receba propostas de fornecedores verificados",
                  "Compare precos e avaliacoes",
                  "Gerencie contratos em um so lugar",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0 opacity-80" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/registro">
                <Button variant="secondary" size="lg" className="gap-2">
                  Cadastrar Empresa <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <Truck className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-3">Sou um Fornecedor</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Encontre oportunidades de negocio com grandes empresas da
                regiao. Mostre seus servicos e conquiste novos clientes.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Acesse projetos de grandes empresas",
                  "Construa sua reputacao com avaliacoes",
                  "Receba notificacoes de novos projetos",
                  "Perfil profissional completo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/registro">
                <Button size="lg" className="gap-2">
                  Cadastrar Fornecedor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Handshake className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">ConectaFornece</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 ConectaFornece. Todos os direitos reservados. Itabira -
            MG
          </p>
        </div>
      </footer>
    </div>
  );
}
