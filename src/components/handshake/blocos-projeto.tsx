import { CheckCircle2, FileText, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentoExigido } from "@/lib/mock-data";

interface BlocoCriteriosProps {
  criterios: string[];
}

export function BlocoCriterios({ criterios }: BlocoCriteriosProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4" /> Critérios de seleção
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criterios.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            A empresa não detalhou critérios específicos.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {criterios.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface BlocoDocumentosProps {
  documentos: DocumentoExigido[];
}

export function BlocoDocumentos({ documentos }: BlocoDocumentosProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" /> Documentos exigidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documentos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum documento obrigatório listado.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {documentos.map((doc) => (
              <li
                key={doc.nome}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{doc.nome}</p>
                  {doc.observacao && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{doc.observacao}</p>
                  )}
                </div>
                <Badge variant="secondary" className={doc.obrigatorio ? "bg-red-100 text-red-800" : ""}>
                  {doc.obrigatorio ? "Obrigatório" : "Opcional"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface BlocoRequisitosProps {
  requisitos: string[];
}

export function BlocoRequisitos({ requisitos }: BlocoRequisitosProps) {
  if (requisitos.length === 0) return null;
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Requisitos do fornecedor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {requisitos.map((req) => (
            <Badge key={req} variant="outline">
              {req}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
