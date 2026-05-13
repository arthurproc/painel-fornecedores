"use client";

import { useMemo, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { CadeadoUtilizacao } from "@/components/capacidade/cadeado-utilizacao";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  addCapacidadeToFornecedor,
  removeCapacidadeFromFornecedor,
  updateCapacidadeOfFornecedor,
  type CapacidadeInput,
  type CapacidadeInstalada,
  type ClassificacaoCarga,
  type EquipamentoDeclarado,
  type Fornecedor,
} from "@/lib/mock-data";
import {
  categoriaItens,
  getCategoriaItemById,
  getUnidadeAbreviada,
  setores,
  type CategoriaItem,
} from "@/lib/platform-data";

interface FormCapacidadesFornecedorProps {
  fornecedor: Fornecedor;
  onUpdated: () => void;
}

type DraftState = {
  capacidadeId?: string;
  setor_id: string;
  categoria_item_id: string;
  classificacao: ClassificacaoCarga | "";
  capacidade_nominal_mensal: string;
  percent_utilizacao_atual: string;
  equipamentos: EquipamentoDeclarado[];
  area_armazenamento_m2: string;
  observacao: string;
};

const draftVazio: DraftState = {
  setor_id: "",
  categoria_item_id: "",
  classificacao: "",
  capacidade_nominal_mensal: "",
  percent_utilizacao_atual: "0",
  equipamentos: [],
  area_armazenamento_m2: "",
  observacao: "",
};

function fromCapacidade(c: CapacidadeInstalada): DraftState {
  const item = getCategoriaItemById(c.categoria_item_id);
  return {
    capacidadeId: c.id,
    setor_id: item?.setor_id ?? "",
    categoria_item_id: c.categoria_item_id,
    classificacao: c.classificacao ?? "",
    capacidade_nominal_mensal: String(c.capacidade_nominal_mensal),
    percent_utilizacao_atual: String(c.percent_utilizacao_atual),
    equipamentos: c.equipamentos.map((e) => ({ ...e })),
    area_armazenamento_m2: c.area_armazenamento_m2 ? String(c.area_armazenamento_m2) : "",
    observacao: c.observacao ?? "",
  };
}

function toInput(draft: DraftState, item: CategoriaItem): CapacidadeInput {
  return {
    categoria_item_id: draft.categoria_item_id,
    classificacao: item.tem_classificacao_carga && draft.classificacao ? draft.classificacao : undefined,
    capacidade_nominal_mensal: Number(draft.capacidade_nominal_mensal) || 0,
    percent_utilizacao_atual: Math.max(0, Math.min(100, Number(draft.percent_utilizacao_atual) || 0)),
    equipamentos: draft.equipamentos.filter((e) => e.nome.trim() && e.quantidade > 0),
    area_armazenamento_m2:
      item.tem_area_armazenamento && draft.area_armazenamento_m2
        ? Number(draft.area_armazenamento_m2) || undefined
        : undefined,
    observacao: draft.observacao.trim() || undefined,
  };
}

export function FormCapacidadesFornecedor({ fornecedor, onUpdated }: FormCapacidadesFornecedorProps) {
  const [draft, setDraft] = useState<DraftState | null>(null);

  const itensDisponiveis = useMemo<CategoriaItem[]>(() => {
    if (!draft?.setor_id) return [];
    const jaDeclarados = new Set(
      fornecedor.capacidades_instaladas
        .filter((c) => c.id !== draft.capacidadeId)
        .map((c) => c.categoria_item_id)
    );
    return categoriaItens.filter(
      (c) => c.setor_id === draft.setor_id && !jaDeclarados.has(c.id)
    );
  }, [draft, fornecedor.capacidades_instaladas]);

  const itemSelecionado = draft ? getCategoriaItemById(draft.categoria_item_id) : undefined;
  const unidade = itemSelecionado ? getUnidadeAbreviada(itemSelecionado.unidade_medida) : "";

  function iniciarNovo() {
    setDraft({ ...draftVazio });
  }

  function iniciarEdicao(capacidade: CapacidadeInstalada) {
    setDraft(fromCapacidade(capacidade));
  }

  function cancelar() {
    setDraft(null);
  }

  function salvar() {
    if (!draft || !itemSelecionado) return;
    const payload = toInput(draft, itemSelecionado);
    if (!payload.capacidade_nominal_mensal) return;
    if (draft.capacidadeId) {
      updateCapacidadeOfFornecedor(fornecedor.id, draft.capacidadeId, payload);
    } else {
      addCapacidadeToFornecedor(fornecedor.id, payload);
    }
    setDraft(null);
    onUpdated();
  }

  function remover(id: string) {
    removeCapacidadeFromFornecedor(fornecedor.id, id);
    onUpdated();
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Capacidade instalada</CardTitle>
        {!draft ? (
          <Button type="button" size="sm" variant="outline" className="gap-1" onClick={iniciarNovo}>
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {fornecedor.capacidades_instaladas.length === 0 && !draft ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não declarou capacidade em nenhum item. Fornecedores com capacidade declarada
            recebem mais convites e aparecem melhor no fit-score.
          </p>
        ) : null}

        <div className="space-y-2">
          {fornecedor.capacidades_instaladas.map((capacidade) => {
            const item = getCategoriaItemById(capacidade.categoria_item_id);
            const unidadeItem = item ? getUnidadeAbreviada(item.unidade_medida) : "";
            const isEditing = draft?.capacidadeId === capacidade.id;
            if (isEditing) return null;
            return (
              <div
                key={capacidade.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="truncate">{item?.nome ?? capacidade.categoria_item_id}</span>
                    {capacidade.classificacao ? (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {capacidade.classificacao}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {capacidade.capacidade_nominal_mensal.toLocaleString("pt-BR")} {unidadeItem} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <CadeadoUtilizacao />
                      {capacidade.percent_utilizacao_atual}% utilizado
                    </span>{" "}
                    · atualizado em {capacidade.atualizada_em}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() => iniciarEdicao(capacidade)}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remover(capacidade.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {draft ? (
          <EditorCapacidade
            draft={draft}
            setDraft={setDraft}
            itensDisponiveis={itensDisponiveis}
            item={itemSelecionado}
            unidade={unidade}
            onCancel={cancelar}
            onSave={salvar}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

interface EditorCapacidadeProps {
  draft: DraftState;
  setDraft: (d: DraftState) => void;
  itensDisponiveis: CategoriaItem[];
  item?: CategoriaItem;
  unidade: string;
  onCancel: () => void;
  onSave: () => void;
}

function EditorCapacidade({
  draft,
  setDraft,
  itensDisponiveis,
  item,
  unidade,
  onCancel,
  onSave,
}: EditorCapacidadeProps) {
  const podeSalvar =
    Boolean(item) && Number(draft.capacidade_nominal_mensal) > 0;

  function update(patch: Partial<DraftState>) {
    setDraft({ ...draft, ...patch });
  }

  function addEquipamento(nome = "") {
    update({ equipamentos: [...draft.equipamentos, { nome, quantidade: 1 }] });
  }

  function updateEquipamento(index: number, patch: Partial<EquipamentoDeclarado>) {
    const next = draft.equipamentos.map((e, i) => (i === index ? { ...e, ...patch } : e));
    update({ equipamentos: next });
  }

  function removeEquipamento(index: number) {
    update({ equipamentos: draft.equipamentos.filter((_, i) => i !== index) });
  }

  const sugestoesPendentes = (item?.equipamentos_sugeridos ?? []).filter(
    (nome) => !draft.equipamentos.some((e) => e.nome.toLowerCase() === nome.toLowerCase())
  );

  return (
    <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Setor</Label>
          <Select
            value={draft.setor_id}
            onValueChange={(setor_id) =>
              setDraft({ ...draft, setor_id, categoria_item_id: "", classificacao: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha o setor" />
            </SelectTrigger>
            <SelectContent>
              {setores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Item</Label>
          <Select
            value={draft.categoria_item_id}
            onValueChange={(categoria_item_id) =>
              setDraft({ ...draft, categoria_item_id, classificacao: "" })
            }
            disabled={!draft.setor_id || itensDisponiveis.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !draft.setor_id
                    ? "Escolha o setor primeiro"
                    : itensDisponiveis.length === 0
                      ? "Todos os itens deste setor já foram declarados"
                      : "Escolha o item"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {itensDisponiveis.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {item ? (
        <>
          <Separator className="bg-primary/20" />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Capacidade nominal mensal</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={draft.capacidade_nominal_mensal}
                  onChange={(e) => update({ capacidade_nominal_mensal: e.target.value })}
                  placeholder="0"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{unidade}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs">
                Utilização atual <CadeadoUtilizacao className="h-3 w-3 text-muted-foreground" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.percent_utilizacao_atual}
                  onChange={(e) => update({ percent_utilizacao_atual: e.target.value })}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <p className="text-[11px] leading-tight text-muted-foreground">
                Privado. Só aparece à empresa contratante quando você se candidata a um projeto dela.
              </p>
            </div>
          </div>

          {item.tem_classificacao_carga ? (
            <div className="space-y-1.5">
              <Label className="text-xs">Classificação</Label>
              <Select
                value={draft.classificacao}
                onValueChange={(v) => update({ classificacao: v as ClassificacaoCarga })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Leve, médio ou pesado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="pesado">Pesado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {item.tem_area_armazenamento ? (
            <div className="space-y-1.5">
              <Label className="text-xs">Área de armazenamento</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={draft.area_armazenamento_m2}
                  onChange={(e) => update({ area_armazenamento_m2: e.target.value })}
                  placeholder="0"
                />
                <span className="text-xs text-muted-foreground">m²</span>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Principais equipamentos</Label>
              <Button type="button" size="sm" variant="ghost" className="gap-1 h-7" onClick={() => addEquipamento()}>
                <Plus className="h-3.5 w-3.5" /> Adicionar
              </Button>
            </div>

            {sugestoesPendentes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sugestoesPendentes.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => addEquipamento(nome)}
                    className="rounded-full border border-dashed border-primary/40 px-2.5 py-0.5 text-xs text-primary hover:bg-primary/10"
                  >
                    + {nome}
                  </button>
                ))}
              </div>
            ) : null}

            {draft.equipamentos.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Sem equipamentos declarados. Clique nas sugestões acima ou em &ldquo;Adicionar&rdquo;.
              </p>
            ) : (
              <div className="space-y-1.5">
                {draft.equipamentos.map((eq, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={eq.nome}
                      onChange={(e) => updateEquipamento(index, { nome: e.target.value })}
                      placeholder="Nome do equipamento"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={eq.quantidade}
                      onChange={(e) =>
                        updateEquipamento(index, { quantidade: Number(e.target.value) || 0 })
                      }
                      placeholder="Qtd."
                      className="w-20"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeEquipamento(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Observação</Label>
            <Textarea
              value={draft.observacao}
              onChange={(e) => update({ observacao: e.target.value })}
              placeholder="Notas sobre disponibilidade, mobilização ou particularidades."
              className="min-h-[60px]"
            />
          </div>
        </>
      ) : null}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={onSave} disabled={!podeSalvar}>
          Salvar capacidade
        </Button>
      </div>
    </div>
  );
}
