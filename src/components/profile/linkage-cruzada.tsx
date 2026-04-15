import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReputacaoAgregadaBloco } from "./reputacao-agregada";
import {
  getEmpresaByOrganizacao,
  getFornecedorByOrganizacao,
  getOrganizacaoById,
} from "@/lib/mock-data";

interface LinkageCruzadaProps {
  organizacao_id: string;
  alvo: "empresa" | "fornecedor";
}

export function LinkageCruzada({ organizacao_id, alvo }: LinkageCruzadaProps) {
  const org = getOrganizacaoById(organizacao_id);
  if (!org || !org.linkage_publica) return null;
  if (alvo === "empresa" && !org.perfil_empresa_ativo) return null;
  if (alvo === "fornecedor" && !org.perfil_fornecedor_ativo) return null;

  if (alvo === "empresa") {
    const empresa = getEmpresaByOrganizacao(organizacao_id);
    if (!empresa) return null;
    return (
      <Card className="rounded-xl border-2 border-primary/20">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold">
            Também atua como empresa contratante
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
              {empresa.logo}
            </div>
            <div className="text-sm">
              <p className="font-medium">{empresa.nome}</p>
              <p className="text-xs text-muted-foreground">
                Setor: {empresa.setor}
              </p>
            </div>
          </div>
          <ReputacaoAgregadaBloco
            reputacao={empresa.reputacao_agregada}
            tipo="empresa"
            compact
          />
          <Link
            href={`/perfil/empresa/${empresa.id}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver perfil empresa <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const fornecedor = getFornecedorByOrganizacao(organizacao_id);
  if (!fornecedor) return null;
  return (
    <Card className="rounded-xl border-2 border-primary/20">
      <CardContent className="space-y-3 p-5">
        <p className="text-sm font-semibold">Também atua como fornecedor</p>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
            {fornecedor.logo}
          </div>
          <div className="text-sm">
            <p className="font-medium">{fornecedor.nome}</p>
            <p className="text-xs text-muted-foreground">
              Categorias: {fornecedor.categorias.join(" · ")}
            </p>
          </div>
        </div>
        <ReputacaoAgregadaBloco
          reputacao={fornecedor.reputacao_agregada}
          tipo="fornecedor"
          compact
        />
        <Link
          href={`/perfil/fornecedor/${fornecedor.id}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver perfil fornecedor <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
