"use client";

import { Plus, X } from "lucide-react";
import { StringCombobox } from "@/components/empresa/string-combobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { credencialOptions, getCredencialNome, resolveCredencialId } from "@/lib/platform-credentials";
import { addCredencialToFornecedor, removeCredencialFromFornecedor, type Fornecedor } from "@/lib/mock-data";
import { useState } from "react";

interface FormCredenciaisFornecedorProps {
  fornecedor: Fornecedor;
  onUpdated: () => void;
}

export function FormCredenciaisFornecedor({ fornecedor, onUpdated }: FormCredenciaisFornecedorProps) {
  const [novaCredencial, setNovaCredencial] = useState("");

  function adicionar() {
    const credencialId = resolveCredencialId(novaCredencial);
    if (!credencialId) return;
    addCredencialToFornecedor(fornecedor.id, credencialId);
    setNovaCredencial("");
    onUpdated();
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-base">Credenciais cadastradas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <StringCombobox
            options={credencialOptions}
            value={novaCredencial}
            onValueChange={setNovaCredencial}
            onEnter={adicionar}
            placeholder="Ex.: ISO 9001"
          />
          <Button type="button" variant="outline" size="icon" onClick={adicionar}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {fornecedor.credenciais_ids.map((credencialId) => (
            <Badge key={credencialId} variant="secondary" className="gap-1 pr-1">
              {getCredencialNome(credencialId)}
              <button
                type="button"
                onClick={() => {
                  removeCredencialFromFornecedor(fornecedor.id, credencialId);
                  onUpdated();
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
