import { redirect } from "next/navigation";
import { ADVISOR_LOGADO_ID, advisors } from "@/lib/mock-data";

export function getAdvisorAtivo(advisorQuery?: string) {
  return (
    advisors.find((a) => a.id === advisorQuery) ??
    advisors.find((a) => a.id === ADVISOR_LOGADO_ID) ??
    advisors[0]
  );
}

export function garantirOwner(advisorQuery?: string) {
  const advisor = getAdvisorAtivo(advisorQuery);
  if (!advisor || advisor.role !== "owner") {
    redirect("/admin/dashboard");
  }
  return advisor;
}
