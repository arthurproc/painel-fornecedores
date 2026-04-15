"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  MEMBRO_LOGADO_ID,
  candidaturas,
  criarSessaoConsultoria,
  getFornecedorByOrganizacao,
  getMembroById,
  projetos,
  propostas,
  type CatalogoConsultoria,
} from "@/lib/mock-data";

interface ModalContratacaoSessaoProps {
  catalogo: CatalogoConsultoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidaturaPreSelecionada?: string;
  propostaPreSelecionada?: string;
}

interface OpcaoAlvo {
  value: string;
  label: string;
  sublabel?: string;
  candidatura_id?: string;
  proposta_id?: string;
}

export function ModalContratacaoSessao({
  catalogo,
  open,
  onOpenChange,
  candidaturaPreSelecionada,
  propostaPreSelecionada,
}: ModalContratacaoSessaoProps) {
  const router = useRouter();
  const membro = getMembroById(MEMBRO_LOGADO_ID);
  const fornecedor = getFornecedorByOrganizacao(membro?.organizacao_id ?? "");

  const opcoes = useMemo<OpcaoAlvo[]>(() => {
    if (!fornecedor) return [];
    const minhasCandidaturas = candidaturas.filter((c) => c.fornecedor_id === fornecedor.id);
    const candidaturasAtivas = minhasCandidaturas.filter(
      (c) => c.status === "rascunho" || c.status === "enviada" || c.status === "shortlistada"
    );

    if (catalogo.tipo === "revisao_candidatura" || catalogo.tipo === "acompanhamento_completo") {
      const base: OpcaoAlvo[] = [
        { value: "nova", label: "Estou criando uma nova candidatura agora" },
      ];
      for (const c of candidaturasAtivas) {
        const projeto = projetos.find((p) => p.id === c.projeto_id);
        if (!projeto) continue;
        base.push({
          value: c.id,
          label: projeto.titulo,
          sublabel:
            c.status === "rascunho"
              ? "rascunho"
              : c.status === "shortlistada"
                ? "shortlistada"
                : "aguardando triagem",
          candidatura_id: c.id,
        });
      }
      return base;
    }

    if (catalogo.tipo === "revisao_proposta") {
      const shortlist = minhasCandidaturas.filter((c) => c.status === "shortlistada");
      return shortlist.map((c) => {
        const projeto = projetos.find((p) => p.id === c.projeto_id);
        const prop = propostas.find((p) => p.candidatura_id === c.id);
        return {
          value: c.id,
          label: projeto?.titulo ?? "Projeto",
          sublabel: prop ? `proposta em ${prop.status}` : "proposta a redigir",
          candidatura_id: c.id,
          proposta_id: prop?.id,
        };
      });
    }

    // retorno_pos_descarte
    const descartadas = minhasCandidaturas.filter((c) => c.status === "descartada");
    return descartadas.map((c) => {
      const projeto = projetos.find((p) => p.id === c.projeto_id);
      return {
        value: c.id,
        label: projeto?.titulo ?? "Projeto",
        sublabel: "candidatura descartada",
        candidatura_id: c.id,
      };
    });
  }, [catalogo.tipo, fornecedor]);

  const preSelected = candidaturaPreSelecionada ?? propostaPreSelecionada ?? "";
  const [alvo, setAlvo] = useState<string>(
    preSelected && opcoes.some((o) => o.value === preSelected) ? preSelected : opcoes[0]?.value ?? ""
  );
  const [contextoExtra, setContextoExtra] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const vazio = opcoes.length === 0;
  const opcaoEscolhida = opcoes.find((o) => o.value === alvo);

  function handleConfirmar() {
    if (!fornecedor || !membro || !opcaoEscolhida) return;
    criarSessaoConsultoria({
      catalogo_id: catalogo.id,
      fornecedor_id: fornecedor.id,
      solicitante_membro_id: membro.id,
      candidatura_id:
        opcaoEscolhida.candidatura_id ?? (alvo !== "nova" ? alvo : undefined),
      proposta_id: opcaoEscolhida.proposta_id,
      contexto_extra: contextoExtra.trim() || undefined,
    });
    setSucesso(true);
    window.setTimeout(() => {
      onOpenChange(false);
      setSucesso(false);
      router.push("/fornecedor/consultoria/minhas-sessoes");
    }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle>Contratar {catalogo.nome}</DialogTitle>
          </div>
          <DialogDescription>{catalogo.descricao}</DialogDescription>
        </DialogHeader>

        {sucesso ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Sessão criada com sucesso
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Redirecionando para Minhas sessões…
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {catalogo.tipo === "revisao_proposta"
                  ? "Para qual proposta?"
                  : catalogo.tipo === "retorno_pos_descarte"
                    ? "Qual candidatura descartada?"
                    : "Para qual candidatura?"}
              </Label>
              {vazio ? (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {catalogo.tipo === "revisao_proposta"
                      ? "Você precisa ter uma candidatura shortlistada para contratar esta sessão."
                      : catalogo.tipo === "retorno_pos_descarte"
                        ? "Você não tem candidaturas descartadas no momento."
                        : "Nenhuma candidatura elegível no momento."}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {opcoes.map((op) => {
                    const ativo = alvo === op.value;
                    return (
                      <button
                        type="button"
                        key={op.value}
                        onClick={() => setAlvo(op.value)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          ativo
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            ativo ? "border-primary bg-primary" : "border-border"
                          )}
                        >
                          {ativo ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                        </span>
                        <div className="flex flex-col">
                          <span>{op.label}</span>
                          {op.sublabel ? (
                            <span className="text-xs text-muted-foreground">{op.sublabel}</span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contexto-extra">Quer adicionar contexto extra? (opcional)</Label>
              <Textarea
                id="contexto-extra"
                rows={3}
                value={contextoExtra}
                onChange={(e) => setContextoExtra(e.target.value)}
                placeholder='Ex.: "esse é nosso primeiro contrato com a Vale"'
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{catalogo.nome}</span>
                <span className="font-semibold">{catalogo.preco_valor ?? "—"}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Entrega em {catalogo.prazo_entrega_estimado} após atribuição
              </p>
              {catalogo.preco_observacao ? (
                <p className="mt-1 text-xs text-muted-foreground">{catalogo.preco_observacao}</p>
              ) : null}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmar} disabled={vazio || !opcaoEscolhida}>
                Confirmar contratação
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
