import type { ProjetoStatus } from "./_shared";
import { resolveCredencialId } from "@/lib/platform-credentials";

export interface CredencialExigida {
  credencial_id: string;
  obrigatoria: boolean;
  observacao?: string;
}

export interface DocumentoExigido {
  id: string;
  nome: string;
  obrigatorio: boolean;
  observacao?: string;
  credencial_relacionada_id?: string;
}

export interface Projeto {
  id: string;
  titulo: string;
  empresa_id: string;
  descricao: string;
  categoria: string;
  regiao: string;
  cidade: string;
  orcamento: string;
  orcamento_min?: string;
  orcamento_max?: string;
  prazo: string;
  dataPublicacao: string;
  status: ProjetoStatus;
  requisitos_tecnicos: string[];
  credenciais_exigidas: CredencialExigida[];
  documentos_exigidos: DocumentoExigido[];
  criterios_selecao: string[];
  autor_membro_id: string;
  contrato_id?: string;
}

interface ProjetoSeed extends Omit<Projeto, "requisitos_tecnicos" | "credenciais_exigidas" | "documentos_exigidos"> {
  requisitos?: string[];
  requisitos_tecnicos?: string[];
  credenciais_exigidas?: CredencialExigida[];
  documentos_exigidos: Array<Omit<DocumentoExigido, "id"> & { id?: string }>;
}

function inferCredenciais(seed: ProjetoSeed): CredencialExigida[] {
  const fontes = [
    ...(seed.requisitos_tecnicos ?? seed.requisitos ?? []),
    ...seed.documentos_exigidos.map((documento) => documento.nome),
  ];

  const ids = Array.from(
    new Set(
      fontes
        .map((value) => resolveCredencialId(value))
        .filter((value): value is string => Boolean(value))
    )
  );

  return ids.map((credencial_id) => ({ credencial_id, obrigatoria: true }));
}

function normalizeProjeto(seed: ProjetoSeed): Projeto {
  const requisitos_tecnicos = seed.requisitos_tecnicos ?? seed.requisitos ?? [];
  const credenciais_exigidas = seed.credenciais_exigidas ?? inferCredenciais(seed);
  const documentos_exigidos = seed.documentos_exigidos.map((documento, index) => ({
    ...documento,
    id: documento.id ?? `proj-${seed.id}-doc-${index + 1}`,
    credencial_relacionada_id:
      documento.credencial_relacionada_id ?? resolveCredencialId(documento.nome),
  }));

  return {
    ...seed,
    requisitos_tecnicos,
    credenciais_exigidas,
    documentos_exigidos,
  };
}

const projetoSeeds: ProjetoSeed[] = [
  {
    id: "1",
    titulo: "Manutenção Preventiva de Correias Transportadoras",
    empresa_id: "vale",
    descricao:
      "Serviço de manutenção preventiva e corretiva em correias transportadoras do complexo minerador de Itabira. Inclui inspeção periódica, substituição de rolos e alinhamento de correias. Necessário experiência comprovada em mineração.",
    categoria: "Manutenção Industrial",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 250.000 - R$ 400.000",
    orcamento_min: "R$ 250.000,00",
    orcamento_max: "R$ 400.000,00",
    prazo: "15/06/2026",
    dataPublicacao: "10/04/2026",
    status: "publicado",
    autor_membro_id: "mem-vale-admin",
    requisitos_tecnicos: [
      "Experiência mínima de 5 anos em mineração",
      "Equipe técnica com no mínimo 10 profissionais",
      "Seguro de responsabilidade civil",
    ],
    credenciais_exigidas: [
      { credencial_id: "nr_22", obrigatoria: true },
      { credencial_id: "nr_10", obrigatoria: false, observacao: "Desejável para equipe elétrica." },
    ],
    documentos_exigidos: [
      {
        id: "proj-1-doc-nr22",
        nome: "Certificado NR-22 vigente",
        obrigatorio: true,
        credencial_relacionada_id: "nr_22",
      },
      {
        id: "proj-1-doc-art",
        nome: "ART de responsabilidade técnica",
        obrigatorio: true,
        observacao: "Assinada pelo responsável do contrato.",
      },
      {
        id: "proj-1-doc-seguro",
        nome: "Apólice de seguro",
        obrigatorio: true,
      },
    ],
    criterios_selecao: [
      "Preço competitivo",
      "Histórico comprovado em mineração",
      "Disponibilidade de equipe técnica",
    ],
  },
  {
    id: "2",
    titulo: "Implantação de Sistema de Monitoramento Ambiental",
    empresa_id: "vale",
    descricao:
      "Projeto para implantação de sistema integrado de monitoramento ambiental em tempo real nas áreas de mineração do complexo de Itabira. Sensores de qualidade do ar, água e ruído.",
    categoria: "Serviços Ambientais",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 500.000 - R$ 800.000",
    orcamento_min: "R$ 500.000,00",
    orcamento_max: "R$ 800.000,00",
    prazo: "30/08/2026",
    dataPublicacao: "08/04/2026",
    status: "publicado",
    autor_membro_id: "mem-vale-admin",
    requisitos: [
      "Licença ambiental vigente",
      "Experiência em monitoramento ambiental",
      "Certificação ISO 14001",
      "Equipe com engenheiro ambiental",
    ],
    documentos_exigidos: [
      { nome: "Licença IBAMA", obrigatorio: true },
      { nome: "Certificação ISO 14001", obrigatorio: true },
    ],
    criterios_selecao: ["Preço", "Experiência setorial", "Tempo de implantação"],
  },
  {
    id: "3",
    titulo: "Transporte de Minério - Rota Itabira/Porto",
    empresa_id: "vale",
    descricao:
      "Contratação de serviço de transporte rodoviário de minério de ferro da unidade de Itabira até o terminal portuário. Volume estimado de 5.000 toneladas/mês.",
    categoria: "Transporte e Logística",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 1.200.000 - R$ 1.800.000",
    orcamento_min: "R$ 1.200.000,00",
    orcamento_max: "R$ 1.800.000,00",
    prazo: "01/07/2026",
    dataPublicacao: "05/04/2026",
    status: "em_triagem",
    autor_membro_id: "mem-vale-admin",
    requisitos: [
      "Frota mínima de 20 veículos",
      "RNTRC regularizado",
      "Seguro de carga",
      "Rastreamento veicular em tempo real",
    ],
    documentos_exigidos: [
      { nome: "RNTRC", obrigatorio: true },
      { nome: "Apólice de seguro de carga", obrigatorio: true },
    ],
    criterios_selecao: ["Capacidade de frota", "Preço por tonelada", "SLA de pontualidade"],
  },
  {
    id: "4",
    titulo: "Reforma de Refeitório Industrial",
    empresa_id: "usiminas",
    descricao:
      "Reforma completa do refeitório industrial da planta de João Monlevade. Inclui parte elétrica, hidráulica, revestimentos, mobiliário e adequação às normas sanitárias.",
    categoria: "Construção Civil",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 180.000 - R$ 300.000",
    orcamento_min: "R$ 180.000,00",
    orcamento_max: "R$ 300.000,00",
    prazo: "20/07/2026",
    dataPublicacao: "12/04/2026",
    status: "publicado",
    autor_membro_id: "mem-usiminas-admin",
    requisitos_tecnicos: [
      "Experiência em obras industriais",
      "Cumprimento de normas ANVISA",
      "Equipe com engenheiro civil responsável",
    ],
    credenciais_exigidas: [
      { credencial_id: "crea_mg", obrigatoria: true },
      { credencial_id: "nr_10", obrigatoria: true, observacao: "Necessária para adequações elétricas." },
      { credencial_id: "pbqp_h", obrigatoria: false },
    ],
    documentos_exigidos: [
      {
        id: "proj-4-doc-crea",
        nome: "Registro CREA-MG vigente",
        obrigatorio: true,
        credencial_relacionada_id: "crea_mg",
      },
      {
        id: "proj-4-doc-art",
        nome: "ART assinada do responsável técnico",
        obrigatorio: true,
        observacao: "Anexar com assinatura e escopo da obra.",
        credencial_relacionada_id: "crea_mg",
      },
      {
        id: "proj-4-doc-nr10",
        nome: "Certificado NR-10 da equipe elétrica",
        obrigatorio: true,
        credencial_relacionada_id: "nr_10",
      },
      {
        id: "proj-4-doc-portfolio",
        nome: "Portfólio de obras industriais similares",
        obrigatorio: true,
        observacao: "Até 3 casos relevantes com cliente e escopo.",
      },
      {
        id: "proj-4-doc-seguro",
        nome: "Apólice de seguro de responsabilidade civil",
        obrigatorio: false,
      },
    ],
    criterios_selecao: ["Preço", "Prazo de entrega", "Portfólio de obras semelhantes"],
  },
  {
    id: "5",
    titulo: "Consultoria em Segurança do Trabalho",
    empresa_id: "arcelormittal",
    descricao:
      "Consultoria especializada para revisão e atualização dos programas de segurança do trabalho. Inclui PPRA, PCMSO, treinamentos NR e auditoria de conformidade.",
    categoria: "Segurança do Trabalho",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 80.000 - R$ 150.000",
    orcamento_min: "R$ 80.000,00",
    orcamento_max: "R$ 150.000,00",
    prazo: "30/05/2026",
    dataPublicacao: "01/04/2026",
    status: "em_propostas",
    autor_membro_id: "mem-arcelormittal-owner",
    requisitos: [
      "Registro no MTE",
      "Equipe multidisciplinar",
      "Experiência no setor metalúrgico",
      "Certificação OHSAS 18001",
    ],
    documentos_exigidos: [
      { nome: "Registro no MTE", obrigatorio: true },
      { nome: "Certificação ISO 45001", obrigatorio: false },
    ],
    criterios_selecao: ["Preço", "Experiência metalúrgica", "Multidisciplinaridade da equipe"],
  },
  {
    id: "6",
    titulo: "Fornecimento de EPIs para Operação Minerária",
    empresa_id: "vale",
    descricao:
      "Fornecimento mensal de equipamentos de proteção individual para aproximadamente 2.000 colaboradores do complexo minerador de Itabira.",
    categoria: "Segurança do Trabalho",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 350.000 - R$ 500.000",
    orcamento_min: "R$ 350.000,00",
    orcamento_max: "R$ 500.000,00",
    prazo: "15/05/2026",
    dataPublicacao: "28/03/2026",
    status: "publicado",
    autor_membro_id: "mem-vale-operador",
    requisitos: [
      "Certificado de Aprovação (CA) vigente",
      "Capacidade de entrega mensal",
      "Estoque mínimo de segurança",
      "Laudo técnico dos produtos",
    ],
    documentos_exigidos: [
      { nome: "Certificado de Aprovação (CA)", obrigatorio: true },
      { nome: "Laudo técnico", obrigatorio: true },
    ],
    criterios_selecao: ["Preço unitário", "Capacidade logística", "Qualidade técnica"],
  },
  {
    id: "7",
    titulo: "Manutenção de Pontes Rolantes",
    empresa_id: "vale",
    descricao:
      "Serviço de manutenção preventiva e corretiva em pontes rolantes e equipamentos de içamento do complexo minerador de Itabira. Inclui lubrificação, troca de cabos, inspeção estrutural e alinhamento de trilhos.",
    categoria: "Manutenção Industrial",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 120.000 - R$ 180.000",
    orcamento_min: "R$ 120.000,00",
    orcamento_max: "R$ 180.000,00",
    prazo: "28/02/2026",
    dataPublicacao: "05/01/2026",
    status: "fechado",
    autor_membro_id: "mem-vale-admin",
    contrato_id: "ct-7",
    requisitos: ["NR-11", "Experiência em equipamentos de içamento", "Inspetor de solda certificado", "Laudo de inspeção NR-12"],
    documentos_exigidos: [
      { nome: "Certificado NR-11", obrigatorio: true },
      { nome: "Laudo NR-12", obrigatorio: true },
    ],
    criterios_selecao: ["Preço", "Qualificação técnica"],
  },
  {
    id: "8",
    titulo: "Gestão de Resíduos Industriais",
    empresa_id: "vale",
    descricao:
      "Contratação de empresa especializada para coleta, tratamento e destinação ambientalmente adequada de resíduos sólidos industriais gerados nas operações do complexo de Itabira.",
    categoria: "Serviços Ambientais",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 200.000 - R$ 320.000",
    prazo: "31/03/2026",
    dataPublicacao: "10/02/2026",
    status: "fechado",
    autor_membro_id: "mem-vale-admin",
    contrato_id: "ct-8",
    requisitos: [
      "Licença ambiental para transporte de resíduos",
      "Certificação ISO 14001",
      "Plano de gerenciamento de resíduos",
      "Certificado de destinação final",
    ],
    documentos_exigidos: [
      { nome: "Licença ambiental", obrigatorio: true },
      { nome: "Certificado de destinação final", obrigatorio: true },
    ],
    criterios_selecao: ["Preço", "Conformidade ambiental"],
  },
  {
    id: "9",
    titulo: "Revisão Geral de Equipamentos de Içamento",
    empresa_id: "usiminas",
    descricao:
      "Revisão completa de pontes rolantes, talhas e equipamentos de içamento da planta de João Monlevade, incluindo troca de cabos e inspeção estrutural.",
    categoria: "Manutenção Industrial",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 80.000 - R$ 120.000",
    prazo: "20/01/2026",
    dataPublicacao: "05/12/2025",
    status: "fechado",
    autor_membro_id: "mem-usiminas-owner",
    contrato_id: "ct-9",
    requisitos: ["NR-11", "NR-12", "Inspetor de solda certificado"],
    documentos_exigidos: [{ nome: "Certificado NR-11", obrigatorio: true }],
    criterios_selecao: ["Preço", "Disponibilidade imediata"],
  },
  {
    id: "10",
    titulo: "Relatório de Impacto Ambiental - Expansão Norte",
    empresa_id: "arcelormittal",
    descricao:
      "Elaboração do RIMA para licenciamento da expansão da área industrial norte, incluindo estudos de flora, fauna, solo e recursos hídricos.",
    categoria: "Serviços Ambientais",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 150.000 - R$ 220.000",
    prazo: "28/01/2026",
    dataPublicacao: "10/11/2025",
    status: "fechado",
    autor_membro_id: "mem-arcelormittal-owner",
    contrato_id: "ct-10",
    requisitos: ["Licença IBAMA", "CREA-MG", "Engenheiro ambiental responsável"],
    documentos_exigidos: [{ nome: "Licença IBAMA", obrigatorio: true }],
    criterios_selecao: ["Qualidade técnica", "Prazo"],
  },
  {
    id: "11",
    titulo: "Transporte de Equipamentos Pesados - Parada Geral",
    empresa_id: "vale",
    descricao:
      "Transporte especializado de equipamentos industriais de grande porte durante a parada geral de manutenção do complexo de Itabira.",
    categoria: "Transporte e Logística",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 280.000 - R$ 380.000",
    prazo: "15/03/2026",
    dataPublicacao: "20/01/2026",
    status: "fechado",
    autor_membro_id: "mem-vale-admin",
    contrato_id: "ct-11",
    requisitos: ["RNTRC", "Licença para transporte de carga especial", "Seguro de carga"],
    documentos_exigidos: [{ nome: "RNTRC", obrigatorio: true }],
    criterios_selecao: ["Capacidade especializada", "Seguro"],
  },
  {
    id: "12",
    titulo: "Ampliação do Almoxarifado Industrial",
    empresa_id: "usiminas",
    descricao:
      "Ampliação e reforma do almoxarifado industrial da planta de João Monlevade, com instalações elétricas, estrutura metálica e piso industrial.",
    categoria: "Construção Civil",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 450.000 - R$ 600.000",
    prazo: "10/02/2026",
    dataPublicacao: "15/10/2025",
    status: "fechado",
    autor_membro_id: "mem-usiminas-admin",
    contrato_id: "ct-12",
    requisitos: ["CREA-MG", "ART de responsabilidade técnica", "Experiência em obras industriais"],
    documentos_exigidos: [{ nome: "ART", obrigatorio: true }],
    criterios_selecao: ["Preço", "Portfólio"],
  },
  {
    id: "13",
    titulo: "Implantação do Programa de Gestão de Riscos",
    empresa_id: "vale",
    descricao:
      "Implantação completa do Programa de Gerenciamento de Riscos (PGR) conforme NR-01, incluindo inventário de riscos e plano de ação.",
    categoria: "Segurança do Trabalho",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 100.000 - R$ 160.000",
    prazo: "31/03/2026",
    dataPublicacao: "10/01/2026",
    status: "fechado",
    autor_membro_id: "mem-vale-admin",
    contrato_id: "ct-13",
    requisitos: ["Registro no MTE", "Engenheiro de segurança", "Médico do trabalho"],
    documentos_exigidos: [{ nome: "Registro no MTE", obrigatorio: true }],
    criterios_selecao: ["Qualidade técnica", "Preço"],
  },
  {
    id: "14",
    titulo: "Treinamento NR-35 e Trabalho em Altura",
    empresa_id: "arcelormittal",
    descricao:
      "Treinamento de capacitação em NR-35 (Trabalho em Altura) para 120 colaboradores, incluindo teórico, prático e emissão de certificados.",
    categoria: "Segurança do Trabalho",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 50.000 - R$ 80.000",
    prazo: "20/02/2026",
    dataPublicacao: "05/01/2026",
    status: "fechado",
    autor_membro_id: "mem-arcelormittal-owner",
    contrato_id: "ct-14",
    requisitos: ["Instrutor certificado NR-35", "Espaço para treinamento prático", "Material didático"],
    documentos_exigidos: [{ nome: "Certificado de instrutor NR-35", obrigatorio: true }],
    criterios_selecao: ["Didática", "Certificação"],
  },
  {
    id: "15",
    titulo: "Inspeção Periódica de Vasos de Pressão",
    empresa_id: "vale",
    descricao:
      "Rascunho inicial - inspeção de NR-13 em vasos de pressão e caldeiras do complexo de Itabira. Escopo ainda em definição pela equipe técnica.",
    categoria: "Manutenção Industrial",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 90.000 - R$ 130.000",
    prazo: "30/09/2026",
    dataPublicacao: "15/04/2026",
    status: "rascunho",
    autor_membro_id: "mem-vale-operador",
    requisitos: ["NR-13", "Inspetor certificado"],
    documentos_exigidos: [{ nome: "Certificado NR-13", obrigatorio: true }],
    criterios_selecao: ["Qualificação técnica"],
  },
  {
    id: "16",
    titulo: "Iluminação LED do Galpão Central",
    empresa_id: "usiminas",
    descricao:
      "Substituição completa da iluminação convencional por LED no galpão central da planta de João Monlevade. Projeto cancelado por decisão interna de priorização.",
    categoria: "Construção Civil",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 220.000 - R$ 300.000",
    prazo: "01/06/2026",
    dataPublicacao: "01/03/2026",
    status: "cancelado",
    autor_membro_id: "mem-usiminas-admin",
    requisitos: ["CREA-MG", "Projeto luminotécnico"],
    documentos_exigidos: [{ nome: "ART luminotécnica", obrigatorio: true }],
    criterios_selecao: ["Preço", "Eficiência luminosa"],
  },
  {
    id: "17",
    titulo: "Pintura Industrial da Subestação Norte",
    empresa_id: "arcelormittal",
    descricao:
      "Pintura e recuperação anticorrosiva da subestação elétrica norte. Projeto expirou sem candidaturas suficientes no prazo previsto.",
    categoria: "Construção Civil",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 60.000 - R$ 95.000",
    prazo: "28/02/2026",
    dataPublicacao: "10/12/2025",
    status: "expirado",
    autor_membro_id: "mem-arcelormittal-operador",
    requisitos: ["NR-10", "NR-35"],
    documentos_exigidos: [{ nome: "Certificado NR-10", obrigatorio: true }],
    criterios_selecao: ["Preço", "Prazo de execução"],
  },
  {
    id: "18",
    titulo: "Manutenção Preventiva de Fornos de Indução",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Manutenção preventiva semestral dos fornos de indução da planta de João Monlevade - inclui inspeção dos indutores, troca de refratários e calibração de sensores de temperatura. Escopo elétrico e mecânico integrado.",
    categoria: "Manutenção Industrial",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 140.000 - R$ 210.000",
    orcamento_min: "R$ 140.000,00",
    orcamento_max: "R$ 210.000,00",
    prazo: "10/06/2026",
    dataPublicacao: "09/04/2026",
    status: "publicado",
    autor_membro_id: "mem-metalurgica-xyz-admin",
    requisitos: [
      "Experiência em fornos de indução",
      "Equipe com eletricista de alta tensão (NR-10 SEP)",
      "Inspetor mecânico certificado",
    ],
    documentos_exigidos: [
      { nome: "Certificado NR-10 SEP", obrigatorio: true },
      { nome: "ART de responsabilidade técnica", obrigatorio: true },
      { nome: "Portfólio de contratos similares", obrigatorio: false },
    ],
    criterios_selecao: [
      "Experiência comprovada em fornos de indução",
      "Prazo de mobilização",
      "Preço por hora-equipe",
    ],
  },
  {
    id: "19",
    titulo: "Adequação de Prensas à NR-12",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Projeto de adequação de 8 prensas mecânicas à NR-12 - inclui diagnóstico, especificação de dispositivos de segurança, instalação de cortinas de luz, chaves de segurança e revisão documental. Obrigatório entregar dossiê técnico.",
    categoria: "Segurança do Trabalho",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 180.000 - R$ 260.000",
    orcamento_min: "R$ 180.000,00",
    orcamento_max: "R$ 260.000,00",
    prazo: "20/07/2026",
    dataPublicacao: "02/04/2026",
    status: "em_triagem",
    autor_membro_id: "mem-metalurgica-xyz-owner",
    requisitos: [
      "Engenheiro de segurança registrado no MTE",
      "Experiência em NR-12 em prensas",
      "Laudo técnico assinado",
    ],
    documentos_exigidos: [
      { nome: "ART NR-12", obrigatorio: true },
      { nome: "Registro do engenheiro responsável", obrigatorio: true },
    ],
    criterios_selecao: [
      "Qualidade técnica do diagnóstico",
      "Prazo de entrega do dossiê",
      "Preço por prensa",
    ],
  },
  {
    id: "20",
    titulo: "Fornecimento de Consumíveis de Soldagem - Contrato Anual",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Contrato anual de fornecimento de eletrodos, arames e gases para soldagem MIG/MAG e TIG. Entregas mensais à planta de João Monlevade com laudos de lote e rastreabilidade completa.",
    categoria: "Fabricação Sob Medida",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 90.000 - R$ 150.000",
    orcamento_min: "R$ 90.000,00",
    orcamento_max: "R$ 150.000,00",
    prazo: "30/05/2026",
    dataPublicacao: "11/04/2026",
    status: "publicado",
    autor_membro_id: "mem-metalurgica-xyz-operador",
    requisitos: [
      "Rastreabilidade de lote por laudo",
      "Capacidade de entrega mensal",
      "Homologação prévia dos consumíveis",
    ],
    documentos_exigidos: [
      { nome: "Laudo técnico dos consumíveis", obrigatorio: true },
      { nome: "Ficha de segurança (FISPQ)", obrigatorio: true },
    ],
    criterios_selecao: ["Preço", "Prazo de entrega", "Qualidade do laudo"],
  },
  {
    id: "29",
    titulo: "Retrofit do Sistema de Exaustão da Fundição",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Projeto para retrofit completo do sistema de exaustão da fundição principal, incluindo balanceamento de vazão, substituição de dutos críticos e comissionamento com relatório técnico final.",
    categoria: "Manutenção Industrial",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 220.000 - R$ 320.000",
    orcamento_min: "R$ 220.000,00",
    orcamento_max: "R$ 320.000,00",
    prazo: "25/06/2026",
    dataPublicacao: "04/04/2026",
    status: "em_propostas",
    autor_membro_id: "mem-metalurgica-xyz-admin",
    requisitos: [
      "Experiência em exaustão industrial pesada",
      "Equipe com soldador certificado",
      "Comissionamento com laudo de vazão",
    ],
    documentos_exigidos: [
      { nome: "ART de responsabilidade técnica", obrigatorio: true },
      { nome: "Portfólio de retrofit similar", obrigatorio: true },
    ],
    criterios_selecao: ["Capacidade técnica", "Prazo de parada", "Preço global"],
  },
  {
    id: "30",
    titulo: "Inspeção Estrutural de Ponte Rolante da Aciaria",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Inspeção estrutural, emissão de laudo e execução dos ajustes corretivos na ponte rolante principal da aciaria. Contrato já fechado e em andamento.",
    categoria: "Manutenção Industrial",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 130.000 - R$ 180.000",
    orcamento_min: "R$ 130.000,00",
    orcamento_max: "R$ 180.000,00",
    prazo: "15/04/2026",
    dataPublicacao: "10/02/2026",
    status: "fechado",
    autor_membro_id: "mem-metalurgica-xyz-owner",
    contrato_id: "ct-29",
    requisitos: ["NR-11", "Engenheiro mecânico responsável", "Relatório dimensional"],
    documentos_exigidos: [
      { nome: "Certificado NR-11", obrigatorio: true },
      { nome: "ART mecânica", obrigatorio: true },
    ],
    criterios_selecao: ["Experiência em içamento", "Prazo", "Preço"],
  },
  {
    id: "31",
    titulo: "Adequação de Cabines de Pintura com Ventilação Forçada",
    empresa_id: "metalurgica-xyz",
    descricao:
      "Projeto concluído de adequação de duas cabines de pintura com ventilação forçada, enclausuramento e atualização dos procedimentos de segurança.",
    categoria: "Segurança do Trabalho",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 95.000 - R$ 140.000",
    orcamento_min: "R$ 95.000,00",
    orcamento_max: "R$ 140.000,00",
    prazo: "28/02/2026",
    dataPublicacao: "12/01/2026",
    status: "fechado",
    autor_membro_id: "mem-metalurgica-xyz-admin",
    contrato_id: "ct-30",
    requisitos: ["NR-15", "Laudo de ventilação", "Equipe de montagem industrial"],
    documentos_exigidos: [
      { nome: "Laudo de ventilação", obrigatorio: true },
      { nome: "Plano de instalação", obrigatorio: false },
    ],
    criterios_selecao: ["Qualidade do laudo", "Prazo de parada", "Preço"],
  },
  {
    id: "32",
    titulo: "Usinagem de Eixos de Transmissão para Linha de Laminação",
    empresa_id: "vale",
    descricao:
      "Contrato histórico de fabricação e usinagem de eixos de transmissão para linha de laminação auxiliar, concluído com sucesso pelo braço fornecedor da Metalúrgica XYZ.",
    categoria: "Fabricação Sob Medida",
    regiao: "Itabira - MG",
    cidade: "Itabira",
    orcamento: "R$ 38.000 - R$ 52.000",
    prazo: "30/10/2025",
    dataPublicacao: "05/09/2025",
    status: "fechado",
    autor_membro_id: "mem-vale-admin",
    contrato_id: "ct-18",
    requisitos: ["Usinagem pesada", "Controle dimensional", "Rastreabilidade do material"],
    documentos_exigidos: [{ nome: "Relatório dimensional", obrigatorio: true }],
    criterios_selecao: ["Precisão dimensional", "Prazo", "Preço"],
  },
  {
    id: "33",
    titulo: "Caldeiraria para Plataforma de Manutenção do Pátio Norte",
    empresa_id: "usiminas",
    descricao:
      "Contrato em execução para fabricação e montagem de plataforma metálica de manutenção com guarda-corpo e escada marinheiro na área do pátio norte.",
    categoria: "Fabricação Sob Medida",
    regiao: "João Monlevade - MG",
    cidade: "João Monlevade",
    orcamento: "R$ 75.000 - R$ 105.000",
    prazo: "20/05/2026",
    dataPublicacao: "25/02/2026",
    status: "fechado",
    autor_membro_id: "mem-usiminas-admin",
    contrato_id: "ct-31",
    requisitos: ["Caldeiraria pesada", "Soldador MIG/MAG qualificado", "Montagem em área industrial"],
    documentos_exigidos: [{ nome: "EPS/PQR de soldagem", obrigatorio: true }],
    criterios_selecao: ["Qualidade da solda", "Prazo de montagem", "Preço"],
  },
];

export const projetos: Projeto[] = projetoSeeds.map(normalizeProjeto);

export function getProjetoById(id: string): Projeto | undefined {
  return projetos.find((p) => p.id === id);
}

export function candidaturasCountByProjeto(projeto_id: string): number {
  return _candidaturasCount?.[projeto_id] ?? 0;
}

export function propostasCountByProjeto(projeto_id: string): number {
  return _propostasCount?.[projeto_id] ?? 0;
}

export function shortlistCountByProjeto(projeto_id: string): number {
  return _shortlistCount?.[projeto_id] ?? 0;
}

let _candidaturasCount: Record<string, number> | null = null;
let _propostasCount: Record<string, number> | null = null;
let _shortlistCount: Record<string, number> | null = null;

export function _registrarContagensProjeto(
  candidaturas: Record<string, number>,
  propostas: Record<string, number>,
  shortlist: Record<string, number>
) {
  _candidaturasCount = candidaturas;
  _propostasCount = propostas;
  _shortlistCount = shortlist;
}
