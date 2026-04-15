import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            CF
          </div>
          <div>
            <p className="text-[11px] leading-none text-muted-foreground">
              Perfil público
            </p>
            <p className="mt-1 text-sm font-semibold leading-none">
              ConectaFornece
            </p>
          </div>
        </Link>
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/fornecedor/dashboard">
            <ArrowLeft className="h-4 w-4" /> Voltar ao painel
          </Link>
        </Button>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
