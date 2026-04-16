export type CredencialTipo = "certificacao" | "licenca" | "registro" | "norma";

export interface CredencialCatalogo {
  id: string;
  nome: string;
  tipo: CredencialTipo;
  sinonimos: string[];
  documento_padrao_nome?: string;
  ativo: boolean;
}

export const credenciaisCatalogo: CredencialCatalogo[] = [
  {
    id: "nr_10",
    nome: "NR-10",
    tipo: "norma",
    sinonimos: ["nr10", "certificado nr-10"],
    documento_padrao_nome: "Certificado NR-10 vigente",
    ativo: true,
  },
  {
    id: "nr_10_sep",
    nome: "NR-10 SEP",
    tipo: "norma",
    sinonimos: ["nr10 sep", "nr-10 sep", "certificado nr-10 sep"],
    documento_padrao_nome: "Certificado NR-10 SEP vigente",
    ativo: true,
  },
  {
    id: "nr_11",
    nome: "NR-11",
    tipo: "norma",
    sinonimos: ["nr11", "certificado nr-11"],
    documento_padrao_nome: "Certificado NR-11 vigente",
    ativo: true,
  },
  {
    id: "nr_12",
    nome: "NR-12",
    tipo: "norma",
    sinonimos: ["nr12", "laudo nr-12", "art nr-12"],
    documento_padrao_nome: "Laudo técnico NR-12 assinado",
    ativo: true,
  },
  {
    id: "nr_13",
    nome: "NR-13",
    tipo: "norma",
    sinonimos: ["nr13", "certificado nr-13"],
    documento_padrao_nome: "Certificado NR-13 vigente",
    ativo: true,
  },
  {
    id: "nr_22",
    nome: "NR-22",
    tipo: "norma",
    sinonimos: ["nr22", "certificado nr-22"],
    documento_padrao_nome: "Certificado NR-22 vigente",
    ativo: true,
  },
  {
    id: "nr_35",
    nome: "NR-35",
    tipo: "norma",
    sinonimos: ["nr35", "certificado nr-35", "instrutor nr-35"],
    documento_padrao_nome: "Certificado NR-35 vigente",
    ativo: true,
  },
  {
    id: "iso_9001",
    nome: "ISO 9001",
    tipo: "certificacao",
    sinonimos: ["iso9001", "certificação iso 9001"],
    documento_padrao_nome: "Certificado ISO 9001 vigente",
    ativo: true,
  },
  {
    id: "iso_14001",
    nome: "ISO 14001",
    tipo: "certificacao",
    sinonimos: ["iso14001", "certificação iso 14001"],
    documento_padrao_nome: "Certificado ISO 14001 vigente",
    ativo: true,
  },
  {
    id: "iso_45001",
    nome: "ISO 45001",
    tipo: "certificacao",
    sinonimos: ["iso45001", "ohsas 18001", "certificação ohsas 18001"],
    documento_padrao_nome: "Certificado ISO 45001 vigente",
    ativo: true,
  },
  {
    id: "crea_mg",
    nome: "CREA-MG",
    tipo: "registro",
    sinonimos: ["crea", "registro crea", "registro crea-mg"],
    documento_padrao_nome: "Registro CREA-MG vigente",
    ativo: true,
  },
  {
    id: "licenca_ibama",
    nome: "Licença IBAMA",
    tipo: "licenca",
    sinonimos: ["licença ambiental ibama", "ibama"],
    documento_padrao_nome: "Licença IBAMA vigente",
    ativo: true,
  },
  {
    id: "rntrc",
    nome: "RNTRC",
    tipo: "registro",
    sinonimos: ["antt", "registro rntrc"],
    documento_padrao_nome: "Comprovante RNTRC vigente",
    ativo: true,
  },
  {
    id: "mte",
    nome: "Registro no MTE",
    tipo: "registro",
    sinonimos: ["mte", "registro mte", "engenheiro de segurança registrado no mte"],
    documento_padrao_nome: "Registro no MTE vigente",
    ativo: true,
  },
  {
    id: "sassmaq",
    nome: "SASSMAQ",
    tipo: "certificacao",
    sinonimos: ["sassmaq vigente"],
    documento_padrao_nome: "Certificado SASSMAQ vigente",
    ativo: true,
  },
  {
    id: "pbqp_h",
    nome: "PBQP-H",
    tipo: "certificacao",
    sinonimos: ["pbqph"],
    documento_padrao_nome: "Certificado PBQP-H vigente",
    ativo: true,
  },
];

export function getCredencialById(id: string): CredencialCatalogo | undefined {
  return credenciaisCatalogo.find((credencial) => credencial.id === id);
}

export function getCredencialNome(id: string): string {
  return getCredencialById(id)?.nome ?? id;
}

export function getDocumentoPadraoByCredencial(id: string): string | undefined {
  return getCredencialById(id)?.documento_padrao_nome;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function resolveCredencialId(value: string): string | undefined {
  const normalized = normalize(value);
  return credenciaisCatalogo.find((credencial) => {
    if (normalize(credencial.nome) === normalized) return true;
    return credencial.sinonimos.some((sinonimo) => normalized.includes(normalize(sinonimo)));
  })?.id;
}

export const credencialOptions = credenciaisCatalogo
  .filter((credencial) => credencial.ativo)
  .map((credencial) => credencial.nome);
