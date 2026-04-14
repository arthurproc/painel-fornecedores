import { Mail, Shield, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  funcao: "admin_plataforma" | "gestor" | "visualizador";
  org: string;
  orgTipo: "plataforma" | "empresa" | "fornecedor";
  desde: string;
  status: "ativo" | "pendente" | "inativo";
}

const usuarios: Usuario[] = [
  {
    id: "u0",
    nome: "Celso Oliveira",
    email: "celso@conectafornece.com.br",
    funcao: "admin_plataforma",
    org: "ConectaFornece",
    orgTipo: "plataforma",
    desde: "01/01/2026",
    status: "ativo",
  },
  {
    id: "u1",
    nome: "Ricardo Barbosa",
    email: "rbarbosa@vale.com",
    funcao: "gestor",
    org: "Vale S.A.",
    orgTipo: "empresa",
    desde: "10/01/2026",
    status: "ativo",
  },
  {
    id: "u2",
    nome: "Fernanda Lima",
    email: "flima@vale.com",
    funcao: "visualizador",
    org: "Vale S.A.",
    orgTipo: "empresa",
    desde: "15/01/2026",
    status: "ativo",
  },
  {
    id: "u3",
    nome: "Marcos Andrade",
    email: "mandrade@usiminas.com",
    funcao: "gestor",
    org: "Usiminas",
    orgTipo: "empresa",
    desde: "12/01/2026",
    status: "ativo",
  },
  {
    id: "u4",
    nome: "Paula Sousa",
    email: "psousa@arcelormittal.com",
    funcao: "gestor",
    org: "ArcelorMittal",
    orgTipo: "empresa",
    desde: "08/01/2026",
    status: "ativo",
  },
  {
    id: "u5",
    nome: "João Silva",
    email: "joao@techminas.com.br",
    funcao: "gestor",
    org: "TechMinas Serviços Industriais",
    orgTipo: "fornecedor",
    desde: "14/01/2026",
    status: "ativo",
  },
  {
    id: "u6",
    nome: "Ana Costa",
    email: "ana@ambientalsolutions.com.br",
    funcao: "gestor",
    org: "Ambiental Solutions",
    orgTipo: "fornecedor",
    desde: "20/01/2026",
    status: "ativo",
  },
  {
    id: "u7",
    nome: "Carlos Mendes",
    email: "carlos@translogmg.com.br",
    funcao: "gestor",
    org: "TransLog MG Transportes",
    orgTipo: "fornecedor",
    desde: "22/01/2026",
    status: "ativo",
  },
  {
    id: "u8",
    nome: "Beatriz Rocha",
    email: "beatriz@construminas.com.br",
    funcao: "gestor",
    org: "Construminas Engenharia",
    orgTipo: "fornecedor",
    desde: "05/02/2026",
    status: "ativo",
  },
  {
    id: "u9",
    nome: "Lucas Ferreira",
    email: "lucas@segwork.com.br",
    funcao: "gestor",
    org: "SegWork Consultoria",
    orgTipo: "fornecedor",
    desde: "18/01/2026",
    status: "ativo",
  },
  {
    id: "u10",
    nome: "—",
    email: "compras@novaaciaria.com.br",
    funcao: "gestor",
    org: "Nova Aciaria Ltda",
    orgTipo: "empresa",
    desde: "13/04/2026",
    status: "pendente",
  },
];

const funcaoLabels: Record<Usuario["funcao"], string> = {
  admin_plataforma: "Admin plataforma",
  gestor: "Gestor",
  visualizador: "Visualizador",
};

const funcaoColors: Record<Usuario["funcao"], string> = {
  admin_plataforma: "bg-primary/10 text-primary",
  gestor: "bg-blue-100 text-blue-800",
  visualizador: "bg-gray-100 text-gray-700",
};

const orgTipoColors: Record<Usuario["orgTipo"], string> = {
  plataforma: "bg-primary/10 text-primary",
  empresa: "bg-amber-100 text-amber-800",
  fornecedor: "bg-emerald-100 text-emerald-800",
};

const orgTipoLabels: Record<Usuario["orgTipo"], string> = {
  plataforma: "Plataforma",
  empresa: "Empresa",
  fornecedor: "Fornecedor",
};

const statusColors: Record<Usuario["status"], string> = {
  ativo: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  inativo: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<Usuario["status"], string> = {
  ativo: "Ativo",
  pendente: "Convite pendente",
  inativo: "Inativo",
};

function Iniciais({ nome }: { nome: string }) {
  if (nome === "—") return <span className="text-muted-foreground">?</span>;
  const parts = nome.split(" ");
  return (
    <span>
      {parts[0][0]}
      {parts[1]?.[0] ?? ""}
    </span>
  );
}

export default function AdminUsuarios() {
  const ativos = usuarios.filter((u) => u.status === "ativo").length;
  const pendentes = usuarios.filter((u) => u.status === "pendente").length;

  return (
    <AppShell tipo="admin" titulo="Usuários">
      <div className="space-y-6">
        {/* Summary bar */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{usuarios.length}</span> usuários
            cadastrados
          </span>
          <span>
            <span className="font-semibold text-emerald-700">{ativos}</span> ativos
          </span>
          {pendentes > 0 && (
            <span>
              <span className="font-semibold text-amber-700">{pendentes}</span> com convite
              pendente
            </span>
          )}
        </div>

        {/* User list */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Header */}
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Usuário</span>
                <span>Organização</span>
                <span>Função</span>
                <span>Membro desde</span>
                <span>Status</span>
              </div>

              {/* Rows */}
              {usuarios.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center px-5 py-4"
                >
                  {/* Usuário */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      <Iniciais nome={u.nome} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{u.nome}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Organização */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs shrink-0 ${orgTipoColors[u.orgTipo]}`}
                    >
                      {orgTipoLabels[u.orgTipo]}
                    </Badge>
                    <span className="text-sm truncate">{u.org}</span>
                  </div>

                  {/* Função */}
                  <div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${funcaoColors[u.funcao]}`}
                    >
                      {u.funcao === "admin_plataforma" && (
                        <Shield className="w-3 h-3 mr-1" />
                      )}
                      {funcaoLabels[u.funcao]}
                    </Badge>
                  </div>

                  {/* Desde */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {u.desde}
                  </div>

                  {/* Status */}
                  <div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[u.status]}`}
                    >
                      {statusLabels[u.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
