# Modelo de Dados — ConectaFornece

> Artefato **vivo**. Nasce do design do handshake (`design/handshake-flow.md`) e cresce a cada novo design. Trata só de estrutura conceitual — escolha de banco, ORM e schema físico ficam para depois. Toda vez que um novo artefato de design for criado, este arquivo deve ser revisitado e o delta de entidades/campos/estados adicionado.

## Convenções

- **Identificadores de código em inglês**, valores de display em português brasileiro (regra do `AGENTS.md`).
- **Chaves de campo sem acento** (`titulo`, `descricao`, `regiao`); valores carregam acentuação normal.
- **Datas** armazenadas como ISO strings (`2026-04-14`), exibidas como `DD/MM/YYYY`.
- **Valores monetários** mantêm string formatada brasileira no mock atual (`R$ 250.000,00`). Em produção viram `numeric` com formatação na borda de exibição.
- **IDs** como string no mockup; UUID em produção.
- **Enums** em snake_case minúsculo.
- Tipos abaixo usam notação TypeScript-like apenas para clareza — não é o schema final.

## Mapa de entidades

```
                ┌──────────────────────┐
                │     Organizacao      │ ◄── Membro × N (lista única, role único)
                │   (tenant umbrella)  │
                └──────────┬───────────┘
                           │ 1:0..1 cada perfil
              ┌────────────┴────────────┐
              ▼                         ▼
          Empresa                  Fornecedor              Advisor
       (perfil contratante)      (perfil prestador)    (equipe Celso)
              │                         │                     │
              │ publica                 │ candidata           │ atende
              ▼                         ▼                     ▼
           Projeto ◄──────────── Candidatura ──────► SessaoConsultoria
              │                         │
              │                         │ shortlistada
              │                         ▼
              │                      Proposta
              │                         │
              │                         │ vencedora
              ▼                         ▼
            Contrato ◄───────────────────┘
              │
              │ encerrado
              ▼
            Review × 2 (uma por lado)
```

Ao lado disso: `Conversa` + `Mensagem` (nascem da Candidatura selecionada para proposta), e os catálogos da plataforma (`Categoria`, `Regiao`, `MotivoDescarte`, `TemplatePergunta`, `ReviewDimensao`, `CatalogoConsultoria`).

---

## 1. Atores e organizações

> **Modelo de organização dual.** Uma mesma pessoa jurídica (`Organizacao`) pode operar nos dois lados do marketplace simultaneamente — como **empresa** (contratante) e/ou **fornecedor** (prestador). Cada lado é um perfil 1:1 da Organizacao com display info própria, mas identidade legal, membros e configuração ficam no nível da organização.

### Organizacao

Organização-base. Carrega identidade legal e membros. Pode ter perfil empresa ativo, perfil fornecedor ativo, ou ambos (pelo menos um obrigatório).

```ts
Organizacao {
  id: string

  // Identidade legal — única na organização, compartilhada pelos dois perfis:
  razao_social: string
  cnpj: string
  endereco_fiscal: string

  // Ativação de perfis — pelo menos um deve ser true:
  perfil_empresa_ativo: boolean
  perfil_fornecedor_ativo: boolean
  perfil_primeiro_escolhido: "empresa" | "fornecedor"  // congelado no onboarding; dashboard default no primeiro login

  // Configuração:
  linkage_publica: boolean       // default true; quando true, perfil empresa mostra link pro fornecedor e vice-versa
  slug?: string                  // URL amigável do perfil público (ex.: 'vale', 'techminas'); opcional no MVP

  // Relações:
  membros: Membro[]              // lista única da organização
  // empresa: Empresa | null       (1:0..1, lookup em empresas[])
  // fornecedor: Fornecedor | null (1:0..1, lookup em fornecedores[])

  desde: string
  ativo: boolean
}
```

### Membro

Pessoa física vinculada a uma `Organizacao`. Tem **role único** que vale para qualquer perfil ativo da organização — sem distinção por lado no MVP.

```ts
Membro {
  id: string
  organizacao_id: string
  nome: string
  email: string
  telefone?: string
  cargo: string                  // texto livre, ex.: "Gerente de Compras"
  role: "owner" | "admin" | "operador"
  foto?: string
  ultimo_contexto_usado?: "empresa" | "fornecedor"  // null no primeiro login; atualizado a cada switch
  visivel_publicamente?: boolean         // futuro: opt-in/opt-out individual; MVP usa role ∈ {owner, admin} como gatilho automático
  preferencias_notificacao?: PreferenciasNotificacao  // sub-doc; ver §7.5
  ativo: boolean
  desde: string
}
```

**Roles:**
- `owner` — gestor principal da organização. Único. Pode tudo, incluindo transferir ownership e desativar a organização.
- `admin` — gere membros, edita perfis, opera o fluxo.
- `operador` — opera o fluxo (candidatura, triagem, mensagens, reviews) sem mexer em membros nem perfis.

> **Decisão MVP:** todo membro opera todos os perfis ativos da organização sem restrição. Granularidade por lado fica em backlog.

### Empresa *(perfil — evoluir do mockup atual)*

Já existe em `mock-data.ts` com: `id, nome, logo, setor, descricao, regiao, desde`.

Passa a ser **perfil 1:1 de uma `Organizacao`**.

```ts
Empresa {
  id: string                             // identificador do perfil; referenciado por Projeto, Contrato
  organizacao_id: string                 // FK para Organizacao (relação 1:1)

  // Display info — não compartilhada com perfil fornecedor:
  nome: string                           // pode diferir do razao_social pra fins de display
  logo: string
  setor: string
  descricao: string
  cidade: string                         // novo
  regiao: string
  desde: string

  // Reputação — independente do lado fornecedor:
  reputacao_agregada: ReputacaoAgregada  // ver §4

  // Computados:
  tempo_medio_pagamento_dias?: number
  contratos_publicados: number
  contratos_fechados: number
}
```

### Fornecedor *(perfil — evoluir do mockup atual)*

Já existe com: `id, nome, logo, descricao, categorias, regiao, avaliacao (number), projetosRealizados, certificacoes, desde, contato`.

Passa a ser **perfil 1:1 de uma `Organizacao`**.

```ts
Fornecedor {
  id: string                             // identificador do perfil
  organizacao_id: string                 // FK para Organizacao (relação 1:1)

  // Display info — não compartilhada com perfil empresa:
  nome: string
  logo: string
  descricao: string
  categorias: string[]
  cidade: string                         // novo
  regiao: string
  regioes_atendidas: string[]            // separa "onde a empresa fica" de "onde atende"
  certificacoes: string[]
  capacidade_atual?: string
  contato: { email: string; telefone: string }
  desde: string

  // Curadoria pública — lista ordenada de Contratos que o fornecedor escolhe destacar:
  contratos_destacaveis_ids: string[]    // só entram contratos com visibilidade ≠ privado

  // Reputação — independente do lado empresa:
  reputacao_agregada: ReputacaoAgregada  // SUBSTITUI o `avaliacao: number` atual
}
```

### Advisor

Membro da **equipe interna Consultoria do Celso**. Conceitualmente separado de `Membro` (que é sempre de uma `Organizacao` cliente) — Advisor vive na infraestrutura administrativa da plataforma.

```ts
Advisor {
  id: string
  nome: string
  email: string
  foto?: string
  bio: string
  role: "owner" | "advisor"       // Celso = owner (vê receita e outreach); demais = advisor (só operacional)
  especializacoes: { categoria: string; regiao?: string }[]
  carga_simultanea_max?: number   // limite de sessões abertas (admin pode setar)
  avaliacao_media?: number        // computado de SessaoConsultoria.avaliacao_atendimento (NPS interno)
  ativo: boolean
  desde: string
}
```

> Quando a Consultoria evoluir como módulo (admin do Celso), Advisor pode ganhar sua própria estrutura de roles (chefe de equipe, advisor, etc.). Por ora basta a entidade plana.

---

## 2. Entidades centrais do handshake

### Projeto *(evoluir do mockup atual)*

Já existe com: `id, titulo, empresa, empresaLogo, descricao, categoria, regiao, orcamento, prazo, dataPublicacao, status, interessados, requisitos, fechamento?`.

**Modificar / adicionar:**

```ts
Projeto {
  id: string
  titulo: string
  empresa_id: string                    // SUBSTITUI a string `empresa` atual
  descricao: string
  categoria: string                     // ref a Categoria
  regiao: string                        // ref a Regiao
  cidade: string                        // novo
  orcamento_min?: string                // opcional separar (mockup atual usa string range)
  orcamento_max?: string
  prazo: string                         // data limite de execução
  data_publicacao: string

  // Novos campos do handshake:
  documentos_exigidos: DocumentoExigido[]   // ver §6 (estrutura)
  criterios_selecao: string[]               // texto livre, lista
  requisitos: string[]                      // mantém — pré-requisitos técnicos

  status: ProjetoStatus                 // enum expandido, ver §5
  autor_membro_id: string               // quem publicou

  // Computados (não armazenados):
  candidaturas_count: number            // SUBSTITUI `interessados`
  shortlist_count: number
  propostas_count: number

  // Snapshot do contrato (caso fechado) — ver Contrato:
  contrato_id?: string
}
```

### Candidatura *(NOVA)*

Manifestação leve do fornecedor (Fase 1).

```ts
Candidatura {
  id: string
  projeto_id: string
  fornecedor_id: string
  autor_membro_id: string

  pitch: string                          // ~500 char
  contratos_destacados: string[]         // ids de Contrato do fornecedor
  capacidade_declarada: string           // texto livre curto
  faixa_preco_preliminar?: string        // opcional, com nudge na UI
  certificacoes_aplicaveis: string[]     // selecionadas do perfil

  status: CandidaturaStatus              // ver §5
  motivo_descarte?: {
    categoria_id: string                 // ref a MotivoDescarte
    comentario?: string                  // texto livre opcional da empresa
  }

  // Vínculo com Consultoria:
  revisada_consultoria: boolean          // CTA 1 acionada?
  sessao_consultoria_id?: string

  // TTL:
  aviso_30d_enviado_em?: string

  // Timestamps:
  criada_em: string
  enviada_em?: string
  decidida_em?: string                   // shortlist ou descarte
  expirada_em?: string
}
```

### Proposta *(refinar do mockup atual)*

No mockup atual, `Proposta` mistura "candidatura" e "proposta formal". No novo modelo, **Proposta = formal apenas**, e só existe se nasceu de uma Candidatura shortlistada.

```ts
Proposta {
  id: string
  candidatura_id: string                 // origem obrigatória
  // (projeto_id, fornecedor_id, autor_membro_id derivam da Candidatura)

  escopo_detalhado: string
  cronograma: { etapas: { titulo: string; prazo: string; descricao?: string }[] }
  preco_final: string
  prazo_entrega: string                  // ex.: "60 dias"
  documentos_anexos: Documento[]
  observacoes?: string

  status: PropostaStatus                 // ver §5

  // Vínculo com Consultoria:
  revisada_consultoria: boolean          // CTA 2 acionada?
  sessao_consultoria_id?: string

  // Timestamps:
  criada_em: string
  enviada_em?: string
  decidida_em?: string
}
```

### Contrato *(extrair do `fechamento` atual)*

Hoje vive aninhado como `Projeto.fechamento`. Promover a entidade própria para suportar execução, encerramento e reviews two-way.

```ts
Contrato {
  id: string
  projeto_id: string
  proposta_id: string                    // proposta vencedora
  empresa_id: string
  fornecedor_id: string

  valor_final: string
  data_fechamento: string
  data_inicio?: string
  data_fim_estimada?: string
  data_fim_real?: string

  visibilidade: "publico" | "fornecedores" | "privado"   // herda da decisão atual

  status: ContratoStatus                 // ver §5

  // Reviews vinculados (uma por lado, no máximo):
  review_empresa_id?: string             // empresa avaliando o fornecedor
  review_fornecedor_id?: string          // fornecedor avaliando a empresa
  reviews_liberadas_em?: string          // momento do release simultâneo
}
```

> Nota de migração: o objeto `fechamento.avaliacao` atual é uma review one-sided (empresa → fornecedor). Vira `Review` no novo modelo. Ver §4.

---

## 3. Comunicação (Fase 2-3)

### Conversa *(NOVA)*

Canal entre empresa e fornecedor, criado **automaticamente quando a Candidatura entra em `shortlistada`**.

```ts
Conversa {
  id: string
  projeto_id: string
  candidatura_id: string                 // origem; identifica unicamente a conversa
  empresa_membros_ids: string[]          // quem da empresa pode participar
  fornecedor_membros_ids: string[]       // quem do fornecedor pode participar
  status: "ativa" | "arquivada" | "encerrada"
  ultima_mensagem_em?: string
  criada_em: string
}
```

### Mensagem *(NOVA)*

```ts
Mensagem {
  id: string
  conversa_id: string
  autor_membro_id: string
  tipo: "livre" | "template_pergunta" | "template_resposta"
  conteudo: string
  template_id?: string                   // se tipo = template_*
  resposta_a_mensagem_id?: string        // pra resposta de pergunta estruturada
  enviada_em: string
  lida_em?: string                       // por ao menos um membro do outro lado
}
```

### TemplatePergunta *(NOVO — catálogo)*

Templates pré-definidos que a empresa pode usar no chat híbrido.

```ts
TemplatePergunta {
  id: string
  titulo: string                         // ex.: "Disponibilidade para visita técnica"
  pergunta: string                       // ex.: "Tem disponibilidade para visita técnica em [data]?"
  categoria: string                      // agrupador na UI: "Logística", "Documentação", etc.
  ativo: boolean
}
```

> Pergunta aberta: o catálogo é gerenciado por quem? Admin Consultoria, ou cada empresa cria os seus? Ver §10.

---

## 4. Reputação e reviews

### Review *(NOVA)*

```ts
Review {
  id: string
  contrato_id: string
  autor_membro_id: string                // quem escreveu (visível no display)
  avaliado_org_tipo: "empresa" | "fornecedor"
  avaliado_org_id: string

  notas: { [dimensao_id: string]: 1 | 2 | 3 | 4 | 5 }
  comentario: string

  status: ReviewStatus                   // rascunho, submetida, liberada
  submetida_em?: string
  liberada_em?: string                   // simultânea ao par OU 14d após submissão
}
```

### ReviewDimensao *(NOVO — catálogo)*

Catálogo das dimensões avaliadas em cada lado. Permite editar sem deploy.

```ts
ReviewDimensao {
  id: string                             // slug, ex.: "execucao", "pagamento"
  nome: string                           // display
  aplica_a: "empresa" | "fornecedor"     // qual lado é avaliado
  ordem: number
  ativo: boolean
}
```

**Catálogo inicial** (definido no handshake):

| id | nome | aplica_a |
| --- | --- | --- |
| `execucao` | Execução / qualidade técnica | fornecedor |
| `prazo_execucao` | Cumprimento de prazo | fornecedor |
| `seguranca` | Segurança | fornecedor |
| `comunicacao_fornecedor` | Comunicação | fornecedor |
| `relacionamento_fornecedor` | Relacionamento geral | fornecedor |
| `pagamento` | Pagamento | empresa |
| `clareza_escopo` | Clareza de escopo | empresa |
| `respeito_cronograma` | Respeito ao cronograma | empresa |
| `comunicacao_empresa` | Comunicação | empresa |
| `relacionamento_empresa` | Relacionamento geral | empresa |

### ReputacaoAgregada *(estrutura — não é tabela própria)*

Computada a partir das Reviews liberadas que apontam para a org.

```ts
ReputacaoAgregada {
  media_geral: number                    // 1.0 - 5.0
  total_reviews: number
  por_dimensao: { [dimensao_id: string]: { media: number; total: number } }
  ultima_atualizacao: string
}
```

> Pergunta aberta: cache vs. on-the-fly? Ver §10.

---

## 5. Máquinas de estado

### Projeto

```
rascunho ──► publicado ──► em_triagem ──► em_propostas ──► fechado
                │              │              │              
                │              │              ▼              
                │              └──────► cancelado            
                ▼                                            
             expirado (sem candidaturas no prazo)            
```

Tipo:

```ts
ProjetoStatus = "rascunho" | "publicado" | "em_triagem" | "em_propostas" | "fechado" | "cancelado" | "expirado"
```

### Candidatura

```
rascunho ──► enviada ──► shortlistada ──► (vira Proposta)
                │            
                ├──► descartada (com motivo)
                ├──► expirada (45d sem ação)
                └──► retirada (fornecedor cancelou)
```

Tipo:

```ts
CandidaturaStatus = "rascunho" | "enviada" | "shortlistada" | "descartada" | "expirada" | "retirada"
```

### Proposta

```
rascunho ──► enviada ──► vencedora
                │       │
                │       └──► (cria Contrato)
                ├──► perdedora
                └──► retirada
```

Tipo:

```ts
PropostaStatus = "rascunho" | "enviada" | "vencedora" | "perdedora" | "retirada"
```

### Contrato

```
em_execucao ──► encerrado ──► (libera reviews)
      │
      └──► cancelado
```

Tipo:

```ts
ContratoStatus = "em_execucao" | "encerrado" | "cancelado"
```

### Review

```
rascunho ──► submetida ──► liberada
                              ▲
            (gatilho: par submetida OU 14d desde a primeira)
```

Tipo:

```ts
ReviewStatus = "rascunho" | "submetida" | "liberada"
```

### SessaoConsultoria

```
solicitada ──► atribuida ──► em_andamento ──► entregue
       │                                          
       └──► cancelada                             
```

---

## 6. Catálogos da plataforma

Entidades de configuração administradas pelo módulo admin (Celso).

### Categoria *(já existe em platform-data.ts)*

Mantém. Tipar como entidade própria com `id, nome, ativo` quando virar admin-managed.

### Regiao *(já existe em platform-data.ts)*

Idem. **Decisão tomada:** projeto agnóstico de localização, mas `cidade` (livre) e `regiao` (do catálogo) são first-class.

### MotivoDescarte *(NOVO)*

```ts
MotivoDescarte {
  id: string
  nome: string                   // "Fora de escopo", "Sem capacidade", "Preço fora", "Documentação", "Outro"
  ativo: boolean
}
```

### DocumentoExigido *(estrutura)*

Subdocumento dentro de `Projeto.documentos_exigidos`.

```ts
DocumentoExigido {
  nome: string                   // ex.: "ART", "Licença ambiental", "Certidão negativa"
  obrigatorio: boolean
  observacao?: string
}
```

### Documento *(estrutura — anexo de Proposta)*

```ts
Documento {
  id: string
  nome: string
  url?: string                   // ou metadata; storage real é decisão futura
  tipo_mime?: string
  enviado_em: string
  enviado_por_membro_id: string
}
```

> Pergunta aberta: storage real ou só metadata no mockup? Ver §10.

---

## 7. Camada de Consultoria

> Esta seção é o **mínimo extraível do handshake**. Quando desenharmos a tela completa da Consultoria, o data model expande aqui.

### CatalogoConsultoria *(NOVO)*

```ts
CatalogoConsultoria {
  id: string
  tipo: "revisao_candidatura" | "revisao_proposta" | "acompanhamento_completo" | "retorno_pos_descarte"
  nome: string                   // display
  descricao: string
  preco_modelo: "fixo" | "success_fee" | "hibrido"
  preco_valor?: string           // se fixo ou hibrido
  preco_observacao?: string      // texto explicando success_fee
  prazo_entrega_estimado: string // ex.: "24-48h"
  ativo: boolean
}
```

> `acompanhamento_completo` é o pacote bundled que cobre Candidatura **e** Proposta de uma mesma oportunidade. Ver SessaoConsultoria abaixo.

### SessaoConsultoria *(NOVA)*

```ts
SessaoConsultoria {
  id: string
  catalogo_id: string                    // qual serviço foi solicitado
  tipo: "revisao_candidatura" | "revisao_proposta" | "acompanhamento_completo" | "retorno_pos_descarte"

  fornecedor_id: string
  solicitante_membro_id: string

  // Vínculos de fase — uma sessão pode cobrir uma OU as duas:
  candidatura_id?: string
  proposta_id?: string

  advisor_id?: string                    // atribuído depois
  contexto_extra?: string                // notas adicionais do solicitante

  status: "solicitada" | "atribuida" | "em_andamento" | "entregue" | "cancelada"
  preco_snapshot: string                 // preço congelado no momento da solicitação

  entregaveis: {
    tipo: "notas" | "estudo_caso" | "sessao_video" | "outro"
    fase?: "candidatura" | "proposta"    // qual fase este entregável atende (útil em acompanhamento_completo)
    conteudo: string                     // texto ou link
    criado_em: string
  }[]

  solicitada_em: string
  atribuida_em?: string
  entregue_em?: string

  // Comunicação pós-entrega (comentários do fornecedor nos entregáveis):
  comentarios_fornecedor?: {
    autor_membro_id: string
    conteudo: string
    referencia_entregavel_idx?: number   // qual entregável o comentário responde (opcional)
    enviado_em: string
  }[]

  // NPS interno (não vira Review pública):
  marcado_util?: boolean
  avaliacao_atendimento?: { nota: 1 | 2 | 3 | 4 | 5; comentario?: string; criada_em: string }

  // Outcome rastreado automaticamente após resolução de Candidatura/Proposta:
  outcome?: {
    tipo: "candidatura_shortlist" | "candidatura_descartada" | "proposta_venceu" | "proposta_perdeu" | "pendente"
    observado_em?: string
  }
}
```

> Quando o fornecedor compra `acompanhamento_completo`, a sessão começa vinculada só à `candidatura_id`. Assim que a Candidatura vira shortlistada e a Proposta é criada, o backend popula `proposta_id` na mesma sessão. Os dois CTAs (Fase 1 e Fase 3) na UI mostram "✓ já incluído no acompanhamento".

### EstudoDeCaso *(NOVO)*

Caso curado por Advisor a partir de um Contrato encerrado. Não é despejo automático — é narrativa.

```ts
EstudoDeCaso {
  id: string
  titulo: string                  // narrativo
  resumo: string                  // 1-2 frases

  contrato_id_origem: string      // contrato que inspira (não exibido se anonimização ativa)
  contexto: {
    categoria: string
    regiao: string
    porte_fornecedor: "pequeno" | "medio" | "grande"
    porte_empresa: "pequeno" | "medio" | "grande"
  }

  corpo: string                   // markdown rico, narrativa
  aprendizados: string[]          // bullets de takeaways

  anonimizacao: {
    fornecedor: "identificado" | "anonimo"
    empresa: "identificado" | "anonimo"
  }

  autor_advisor_id: string
  publicado_em: string
  destaque: boolean               // aparece no catálogo + tela de produto
  visivel_para: "fornecedores_logados" | "todos_publico"
}
```

### OfertaOutreach *(NOVA)*

Ofertas personalizadas enviadas pelo `owner` da Consultoria a fornecedores identificados como leads pelo módulo de outreach proativo.

```ts
OfertaOutreach {
  id: string
  fornecedor_id: string
  owner_id: string                // sempre o Advisor.role = owner (Celso)
  mensagem: string                // texto livre de convite
  catalogo_sugerido_id: string    // qual produto está sendo oferecido
  desconto_percentual?: number    // 0-100; opcional
  status: "enviada" | "visualizada" | "aceita" | "ignorada"

  // Sinal que motivou a oferta (gravado pra aprendizado do algoritmo):
  motivo_lead: string             // ex.: "2 candidaturas descartadas em Manutenção Industrial nos últimos 30d"

  enviada_em: string
  visualizada_em?: string
  resolvida_em?: string
}
```

---

## 7.5 Notificações

### Notificacao *(NOVA)*

Evento entregue a um membro específico. Gerado automaticamente por triggers catalogados em `design/notifications.md`.

```ts
Notificacao {
  id: string
  destinatario_membro_id: string
  tipo: string                   // código do trigger: E1, F3, C2, O5, X1...
  severidade: "critica" | "importante" | "informativa"

  titulo: string                 // < 80 chars, entidades em destaque
  corpo?: string                 // 1-2 frases de contexto (opcional)
  acao_url: string               // destino do click

  contexto_ref?: {
    entidade: "projeto" | "candidatura" | "proposta" | "contrato" | "conversa" | "sessao_consultoria" | "review" | "membro" | "organizacao"
    id: string
  }

  canais_enviados: ("in_app" | "email")[]
  canais_confirmados: ("in_app" | "email")[]   // onde o sistema confirmou entrega

  lida: boolean
  lida_em?: string
  arquivada: boolean

  // Agrupamento (triggers agrupáveis em janela de 2h):
  agrupamento_chave?: string
  agrupamento_count?: number

  criada_em: string
}
```

### PreferenciasNotificacao *(estrutura)*

Subdocumento do `Membro` com preferências de canal por grupo de triggers. Inline no `Membro` no MVP.

```ts
PreferenciasNotificacao {
  preferencias: {
    [grupo: string]: { in_app: boolean; email: boolean }
  }
  atualizado_em: string
}
```

**Grupos definidos** (refletem a organização do catálogo de triggers):

- `criticas_handshake` — shortlist, descarte, contrato fechado/aceito
- `criticas_consultoria` — sessão atribuída/entregue
- `importantes_comunicacao` — mensagens novas
- `importantes_empresa` — candidaturas/propostas recebidas (contexto empresa)
- `importantes_fornecedor` — pedido de proposta formal, oferta de outreach, comentários em sessão (contexto fornecedor)
- `importantes_admin` — fila de sessões, NPS baixo de advisor (owner)
- `informativas_descoberta` — projetos compatíveis, leads, outcome
- `informativas_conteudo` — estudos de caso publicados
- `informativas_tenant` — membros, alterações de role, identidade legal

**Defaults** (ver `design/notifications.md` §"Preferências"): críticas ON em ambos canais; importantes ON in-app e ON email só em `importantes_empresa` e `importantes_admin`; informativas ON in-app, OFF email.

---

## 8. Regras de domínio

Invariantes que o sistema deve garantir.

1. **Candidatura editável** apenas em `status = enviada`. Demais estados são imutáveis.
2. **Proposta** só pode ser criada se a Candidatura origem está em `shortlistada`.
3. **Contrato** nasce quando uma Proposta vira `vencedora`. Cria automaticamente.
4. **Conversa** criada automaticamente quando Candidatura → `shortlistada`.
5. **Conversa** muda para `arquivada` quando Candidatura → `descartada`/`retirada` (mas histórico permanece visível); muda para `encerrada` após Contrato encerrado + reviews liberadas.
6. **Review** só pode sair de `rascunho` para `submetida` se o Contrato relacionado está `encerrado`.
7. **Reviews liberam** quando: ambas submetidas OR 14 dias desde a primeira submissão.
8. **TTL Candidatura:** aviso à empresa aos 30 dias após `enviada` sem decisão; auto-`expirada` aos 45 dias.
9. **TTL Projeto:** se nenhuma candidatura `enviada` em X dias após `publicado`, marcar como `expirado` (X = decisão futura).
10. **SessaoConsultoria** pode estar associada a Candidatura, Proposta, ou ambas (caso `acompanhamento_completo`). Quando a Candidatura origem vira `shortlistada` e a Proposta é criada, sessões do tipo `acompanhamento_completo` são automaticamente vinculadas à nova Proposta.
11. **Organizacao** é o tenant umbrella. `Empresa` e `Fornecedor` são perfis 1:1 da Organizacao; pelo menos um deve estar ativo. Identidade legal (CNPJ, razão social, endereço fiscal) é única no tenant.
12. **Membro** pertence a uma única `Organizacao` no MVP. Tem role único (`owner` / `admin` / `operador`) que vale pra qualquer perfil ativo do tenant — sem restrição "esse membro só atua no lado X".
13. **Linkage pública** entre os dois perfis do mesmo tenant é true por padrão. O tenant pode opt-out nas configurações; nesse caso, perfis aparecem como entidades públicas independentes.
14. **Visibilidade do Contrato** controla se o resultado aparece em estudos de caso da Consultoria, no perfil público das partes, ou só interno.
15. **Reviews** com autor visível mas notas agregadas no perfil da org (Glassdoor-like).
16. **Notificacao nunca é deletada** — apenas arquivada. Auto-arquivamento acontece 90 dias após `criada_em` quando `lida = true`.
17. **Agrupamento de notificações** — triggers com `agrupamento_chave` em janela de 2h geram uma única `Notificacao` com `agrupamento_count` incrementado, em vez de múltiplos registros. Triggers críticos não-repetíveis (shortlist, contrato fechado, sessão atribuída) nunca agrupam.
18. **Canal de notificação respeita preferências** — `in_app` sempre gravado; `email` só enviado se `Membro.preferencias_notificacao.preferencias[grupo].email = true`. Default por severidade definido em §7.5.

---

## 9. Mudanças necessárias no `mock-data.ts`

Tradução conceitual do modelo atual para o novo. Não é plano de implementação ainda — é checklist do que precisa virar.

| Modelo atual | Mudança | Motivo |
| --- | --- | --- |
| Inexistente | criar `Organizacao` (tenant umbrella) | Suporte a operação dual-role (mesmo tenant atuando como empresa e fornecedor) |
| `Empresa` standalone | virar perfil 1:1 de `Organizacao` (`organizacao_id` FK) | Tenant dual: identidade legal e membros sobem pro tenant |
| `Fornecedor` standalone | virar perfil 1:1 de `Organizacao` (`organizacao_id` FK) | Idem |
| `Projeto.empresa` (string nome) | `Projeto.empresa_id` + lookup em `empresas` | Normalização; perfil de empresa vira clicável |
| `Projeto.empresaLogo` | derivado de `Empresa.logo` | Eliminar duplicação |
| `Projeto.interessados: number` | computado de Candidaturas (`candidaturas_count`) | Conexão real com a entidade |
| `Projeto.status` enum | expandir para `ProjetoStatus` (§5) | Estados do handshake exigem |
| `Projeto.fechamento` (subdoc) | extrair para `Contrato` (entidade própria) | Suportar reviews two-way e execução |
| `Fornecedor.avaliacao: number` | substituir por `ReputacaoAgregada` | Multidimensional + auditável |
| `Fornecedor.projetosRealizados: number` | computado de Contratos | Idem |
| `Proposta` atual | renomear para `Candidatura` ou separar em duas entidades | Distinção candidatura ≠ proposta formal é central no handshake |
| `Proposta.valor`, `mensagem` | virar campos de `Candidatura` (Fase 1) | Mapeia para o pitch + faixa de preço opcional |
| `Empresa` / `Fornecedor` (campos) | adicionar `cidade`, `reputacao_agregada` | Localização + reputação two-way |
| Inexistente | criar `Membro`, `Conversa`, `Mensagem`, `TemplatePergunta`, `Review`, `ReviewDimensao`, `MotivoDescarte`, `Advisor`, `SessaoConsultoria`, `CatalogoConsultoria`, `Contrato` | Novas no handshake |

**Atenção:** o renomear de `Proposta` atual → `Candidatura` é uma mudança ampla. Provavelmente vamos manter os dois nomes coexistindo durante a transição do mockup, com `Proposta` significando "proposta formal" no novo sentido.

---

## 10. Perguntas em aberto (a destravar com designs futuros)

| Pergunta | Design que destrava |
| --- | --- |
| Versionamento de Candidatura editada — guardar snapshots? | Tela de triagem (a empresa vê histórico?) |
| Onboarding de segundo perfil (tenant ativando o lado fornecedor depois) — wizard ou config simples? | IA por ator |
| Quando ambos os perfis estão ativos, qual é o dashboard "padrão" no primeiro login? | IA por ator |
| Documentos: storage real ou só metadata no mockup? | Tela de upload em projeto/proposta |
| Reputação agregada: cache vs computado on-the-fly? | Tela de perfil público + admin |
| `TemplatePergunta` gerenciado por admin Consultoria ou por cada empresa? | Tela de mensagens + admin |
| `CatalogoConsultoria` global ou por advisor? | Tela do catálogo + admin Consultoria |
| Pricing por sessão: snapshot ou puxa ao vivo? | Catálogo da Consultoria |
| TTL de Projeto sem candidaturas: quantos dias? | Decisão de produto |
| Visibilidade de Contrato: padrão `publico`, `fornecedores`, `privado`? | Tela de fechamento (já existe — revisitar) |
| Estudos de caso da Consultoria são extraídos automaticamente de Contratos públicos ou curados manualmente? | Camada de Consultoria |
| Autor individual de review: pseudônimo opcional ou sempre identificado? | Tela de submissão de review |

---

## Como este documento evolui

A cada novo artefato em `design/`:

1. Listar entidades novas que o design exige.
2. Listar campos/estados que precisam ser adicionados a entidades existentes.
3. Atualizar máquinas de estado se houver transições novas.
4. Remover ou responder perguntas em aberto que o design respondeu.
5. Adicionar novas perguntas em aberto que o design levantou.

O objetivo é que, ao terminar todos os designs blind, este arquivo seja a especificação completa do que o `mock-data.ts` precisa virar.

---

## Checklist para mockup

Entidades novas a criar em `src/lib/mock-data.ts`:

- [ ] `Organizacao` — tenant umbrella com identidade legal + perfis ativos + linkage
- [ ] `Membro` — pertence a Organizacao, role único, `ultimo_contexto_usado`, `telefone`
- [ ] `Advisor` — equipe Consultoria, com `role: owner | advisor`
- [ ] `Candidatura` — Fase 1, com TTL fields e `revisada_consultoria`
- [ ] `Contrato` — extraído de `Projeto.fechamento` como entidade própria
- [ ] `Conversa` — vinculada a Candidatura shortlistada
- [ ] `Mensagem` — com tipo `livre` / `template_pergunta` / `template_resposta`
- [ ] `TemplatePergunta` — catálogo de perguntas estruturadas
- [ ] `Review` — com `notas` por dimensão + status de release simultâneo
- [ ] `ReviewDimensao` — catálogo inicial com 10 dimensões (5 por lado)
- [ ] `MotivoDescarte` — catálogo de categorias
- [ ] `CatalogoConsultoria` — 4 tipos de serviço (inclui `acompanhamento_completo`)
- [ ] `SessaoConsultoria` — pode vincular Candidatura + Proposta simultaneamente

Entidades existentes a refatorar:

- [ ] `Empresa` → perfil 1:1 de `Organizacao` (ganha `organizacao_id`, `cidade`, `reputacao_agregada`; perde `membros`)
- [ ] `Fornecedor` → perfil 1:1 de `Organizacao` (idem; substitui `avaliacao: number` por `reputacao_agregada`)
- [ ] `Projeto` → substituir `empresa: string` por `empresa_id`, expandir enum `status` (7 estados), adicionar `cidade`, `documentos_exigidos`, `criterios_selecao`, `autor_membro_id`; `interessados` vira computado
- [ ] `Proposta` → refinar para significar "proposta formal" apenas; vincular a `candidatura_id`; campos antigos (valor, mensagem) migram para `Candidatura`

Máquinas de estado a implementar:

- [ ] `ProjetoStatus` (7 estados)
- [ ] `CandidaturaStatus` (6 estados)
- [ ] `PropostaStatus` (5 estados)
- [ ] `ContratoStatus` (3 estados)
- [ ] `ReviewStatus` (3 estados com release simultâneo)
- [ ] `SessaoConsultoriaStatus` (5 estados)

Regras de domínio a aplicar (§8):

- [ ] Todas as 15 invariantes (Candidatura editável só em `enviada`, Review só após `encerrado`, TTL, release simultâneo, criação automática de Conversa/Contrato, vinculação automática de acompanhamento_completo, etc.)

Dados de mock necessários para testar o fluxo completo:

- [ ] Pelo menos 1 `Organizacao` dual-role (testa linkage público + switcher de contexto)
- [ ] Organizações single-side (maioria) para simular base atual
- [ ] `Membros` com os 3 roles representados (`owner`, `admin`, `operador`)
- [ ] Equipe Consultoria com ≥2 advisors (Celso como `owner` + 1 regular)
- [ ] `Candidaturas` distribuídas nos 6 estados possíveis
- [ ] `Contratos` em `em_execucao` e `encerrado` (com reviews liberadas)
- [ ] `SessaoConsultoria` em vários status + pelo menos 1 `acompanhamento_completo` cobrindo Candidatura + Proposta
- [ ] `MotivoDescarte` preenchido com as 5 categorias iniciais
- [ ] `ReviewDimensao` preenchido com as 10 dimensões iniciais (5 por lado)
- [ ] `TemplatePergunta` preenchido com 5-10 templates iniciais
