"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { getCredencialNome } from "@/lib/platform-credentials";
import { addDocumentoEmpresa, type DocumentoEmpresaTipo, type DocumentoEmpresaStatus, type Fornecedor } from "@/lib/mock-data";

interface FormDocumentosFornecedorProps {
  fornecedor: Fornecedor;
  onUpdated: () => void;
}

const tipos: DocumentoEmpresaTipo[] = ["credencial", "portfolio", "seguro", "laudo", "outro"];
const statusOptions: DocumentoEmpresaStatus[] = ["vigente", "em_analise", "vencido"];

export function FormDocumentosFornecedor({ fornecedor, onUpdated }: FormDocumentosFornecedorProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<DocumentoEmpresaTipo>("credencial");
  const [credencialId, setCredencialId] = useState("none");
  const [arquivoNome, setArquivoNome] = useState("");
  const [validade, setValidade] = useState("");
  const [status, setStatus] = useState<DocumentoEmpresaStatus>("vigente");
  const [observacao, setObservacao] = useState("");

  function adicionarDocumento() {
    if (!nome.trim() || !arquivoNome.trim()) return;
    addDocumentoEmpresa(fornecedor.id, {
      nome: nome.trim(),
      tipo,
      credencial_id: credencialId === "none" ? undefined : credencialId,
      arquivo_nome: arquivoNome.trim(),
      validade: validade.trim() || undefined,
      status,
      observacao: observacao.trim() || undefined,
    });
    setNome("");
    setTipo("credencial");
    setCredencialId("none");
    setArquivoNome("");
    setValidade("");
    setStatus("vigente");
    setObservacao("");
    onUpdated();
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-base">Documentos da empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex.: Apólice de seguro" />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as DocumentoEmpresaTipo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Credencial relacionada</Label>
            <Select value={credencialId} onValueChange={setCredencialId}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {fornecedor.credenciais_ids.map((item) => (
                  <SelectItem key={item} value={item}>
                    {getCredencialNome(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nome do arquivo</Label>
            <Input value={arquivoNome} onChange={(event) => setArquivoNome(event.target.value)} placeholder="Ex.: comprovante-crea.pdf" />
          </div>
          <div className="space-y-2">
            <Label>Validade</Label>
            <Input value={validade} onChange={(event) => setValidade(event.target.value)} placeholder="Ex.: 2026-12-31" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as DocumentoEmpresaStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Observação</Label>
            <Textarea value={observacao} onChange={(event) => setObservacao(event.target.value)} rows={3} placeholder="Opcional" />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button type="button" variant="outline" onClick={adicionarDocumento}>
              Adicionar documento
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {fornecedor.documentos_empresa.map((documento) => (
            <div key={documento.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{documento.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {documento.arquivo_nome} · {documento.arquivo_caminho}
                  </p>
                  {documento.credencial_id ? (
                    <p className="text-xs text-muted-foreground">
                      Credencial: {getCredencialNome(documento.credencial_id)}
                    </p>
                  ) : null}
                  {documento.observacao ? (
                    <p className="text-xs text-muted-foreground">{documento.observacao}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{documento.tipo}</Badge>
                  <Badge variant="secondary">{documento.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
