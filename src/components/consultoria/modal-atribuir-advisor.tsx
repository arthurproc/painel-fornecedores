"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  advisors,
  atribuirAdvisorASessao,
  candidaturas,
  getCargaAdvisor,
  projetos,
  type SessaoConsultoria,
} from "@/lib/mock-data";

interface ModalAtribuirAdvisorProps {
  sessao: SessaoConsultoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAtribuir?: () => void;
}

function sugestaoDeAdvisor(sessao: SessaoConsultoria) {
  const candidatura = candidaturas.find((c) => c.id === sessao.candidatura_id);
  const projeto = candidatura ? projetos.find((p) => p.id === candidatura.projeto_id) : undefined;
  const categoria = projeto?.categoria;
  const regiao = projeto?.regiao;

  const scored = advisors
    .filter((a) => a.ativo)
    .map((advisor) => {
      let score = 0;
      for (const esp of advisor.especializacoes) {
        if (categoria && esp.categoria === categoria) score += 2;
        if (regiao && esp.regiao === regiao) score += 1;
      }
      const carga = getCargaAdvisor(advisor.id);
      return { advisor, score, carga };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.carga - b.carga;
    });

  return scored;
}

export function ModalAtribuirAdvisor({
  sessao,
  open,
  onOpenChange,
  onAtribuir,
}: ModalAtribuirAdvisorProps) {
  const router = useRouter();
  const candidatos = sugestaoDeAdvisor(sessao);
  const [selecionado, setSelecionado] = useState<string>(candidatos[0]?.advisor.id ?? "");

  function handleConfirmar() {
    if (!selecionado) return;
    atribuirAdvisorASessao(sessao.id, selecionado);
    onAtribuir?.();
    onOpenChange(false);
    router.push(`/admin/sessoes/${sessao.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <DialogTitle>Atribuir a outro consultor</DialogTitle>
          </div>
          <DialogDescription>
            Sugestão baseada em especialização (categoria + região) e carga atual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {candidatos.map(({ advisor, score, carga }) => {
            const ativo = selecionado === advisor.id;
            return (
              <button
                type="button"
                key={advisor.id}
                onClick={() => setSelecionado(advisor.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  ativo ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    ativo ? "border-primary bg-primary" : "border-border"
                  )}
                >
                  {ativo ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {advisor.nome}{" "}
                    <span className="text-xs text-muted-foreground">({advisor.role === "owner" ? "gestor" : "consultor"})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {advisor.especializacoes.map((e) => e.categoria).join(" · ")}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  <p>
                    Carga: {carga}
                    {advisor.carga_simultanea_max ? `/${advisor.carga_simultanea_max}` : ""}
                  </p>
                  {score > 0 ? (
                    <p className="text-emerald-700">match +{score}</p>
                  ) : (
                    <p className="italic">sem match</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={!selecionado}>
            Confirmar atribuição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
