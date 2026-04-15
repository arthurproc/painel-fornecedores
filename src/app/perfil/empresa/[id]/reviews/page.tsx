import { notFound } from "next/navigation";
import { ReviewsPaginada } from "@/components/profile/reviews-paginada";
import { getEmpresaById } from "@/lib/mock-data";

export default async function ReviewsEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresa = getEmpresaById(id);
  if (!empresa) notFound();

  return (
    <ReviewsPaginada
      tipo="empresa"
      organizacao_id={empresa.organizacao_id}
      nomeAvaliado={empresa.nome}
      hrefPerfil={`/perfil/empresa/${empresa.id}`}
    />
  );
}
