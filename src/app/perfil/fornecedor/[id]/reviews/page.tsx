import { notFound } from "next/navigation";
import { ReviewsPaginada } from "@/components/profile/reviews-paginada";
import { getFornecedorById } from "@/lib/mock-data";

export default async function ReviewsFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fornecedor = getFornecedorById(id);
  if (!fornecedor) notFound();

  return (
    <ReviewsPaginada
      tipo="fornecedor"
      organizacao_id={fornecedor.organizacao_id}
      nomeAvaliado={fornecedor.nome}
      hrefPerfil={`/perfil/fornecedor/${fornecedor.id}`}
    />
  );
}
