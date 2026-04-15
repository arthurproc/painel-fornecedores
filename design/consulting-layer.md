# Camada Consultoria — ConectaFornece

> Artefato de design. Define o produto **Consultoria** que Celso e sua equipe vendem dentro da ConectaFornece — catálogo, fluxo de compra do fornecedor, fluxo operacional dos advisors, módulo admin do owner e mecânica de estudos de caso. É o coração da monetização da plataforma.

## Propósito

Diferente do marketplace (que é gratuito pra atrair volume), a **Consultoria é o motor de receita**. O design dessa camada precisa equilibrar três pressões:

1. **Não bloquear o marketplace.** Fornecedor que nunca paga deve conseguir operar todo o handshake sem fricção. Os CTAs aparecem ao lado, nunca no caminho.
2. **Conversão alta no momento certo.** A janela entre "vi o projeto" e "enviei a candidatura" é o pico de ansiedade do fornecedor — é onde a Consultoria tem mais valor percebido. CTAs precisam aparecer ali com mensagem pertinente, não genérica.
3. **Capturar o ciclo completo.** Sessão entregue + Candidatura/Proposta resolvida = dado precioso pra Celso entender o que funciona, refinar oferta, alimentar estudos de caso e outreach.

## Princípios

1. **Concierge, não paywall.** Linguagem de "quer ajuda?" e não de "desbloqueie pra continuar".
2. **Contexto rico, ação simples.** O fornecedor compra com 2 cliques. O advisor entra na sessão e tem TODO o contexto numa tela só (perfil do fornecedor + perfil da empresa + projeto + candidatura/proposta + estudos de caso relevantes).
3. **Owner é dono dos números.** Receita, outreach e configurações de pricing são exclusivas do `Advisor.role = owner` (Celso). Advisors operam, não decidem comercial.
4. **Estudos de caso são produto, não relatório.** São curados, anonimizados quando preciso, escritos com narrativa. Não são despejos automáticos de Contrato.
5. **Tracking de outcome é first-class.** Toda sessão entregue tem ciclo de vida pós-entrega: a Candidatura/Proposta relacionada virou shortlistada/vencedora? Esse dado fecha o loop.

---

## Catálogo de serviços (MVP — 4 tipos)

| Tipo | Quando faz sentido | Fase do handshake | Ticket sugerido | Volume esperado |
| --- | --- | --- | --- | --- |
| **Revisão de candidatura** | Fornecedor antes de enviar candidatura na Fase 1 | Fase 1 | Baixo (R$ 150–300) | Alto |
| **Revisão de proposta formal** | Fornecedor shortlistado antes de enviar proposta na Fase 3 | Fase 3 | Médio (R$ 800–1.500) | Médio |
| **Acompanhamento completo** | Fornecedor compra cedo, advisor cobre Fase 1 + Fase 3 | Fase 1+3 (bundle) | Pacote (R$ 900–1.700) | Médio |
| **Retorno pós-descarte** | Fornecedor com candidatura descartada, quer entender e reposicionar | Após Fase 2 (descarte) | Médio (R$ 400–700) | Reativo + outreach |

> Faixas de preço são placeholders ilustrativos. O Celso fecha valores reais ao popular o `CatalogoConsultoria`.

Cada item do catálogo carrega:

- Nome de display
- Descrição longa (o que entrega, prazo, formato)
- Preço (modelo `fixo`, `success_fee` ou `hibrido`)
- Prazo de entrega estimado (ex.: "24-48h")
- Depoimentos / casos relacionados (links pra estudos de caso)
- FAQ curto

---

## Lado Fornecedor: comprar e usar Consultoria

### Discovery do catálogo

Acesso pelo sidebar `Consultoria → Catálogo` ou pelos CTAs contextuais (já mapeados em `info-architecture.md` §"Pontos de entrada da Consultoria").

```
┌─ Catálogo Consultoria ─────────────────────────────────────────────┐
│                                                                     │
│ Acelere suas chances. Especialistas que entendem do mercado         │
│ industrial brasileiro analisam sua candidatura, proposta ou         │
│ histórico de descartes — e te ajudam a se posicionar.               │
│                                                                     │
│ ┌────────────────────────┐  ┌────────────────────────┐             │
│ │ Revisão de candidatura │  │ Revisão de proposta    │             │
│ │                        │  │                        │             │
│ │ A partir de R$ 200     │  │ A partir de R$ 1.000   │             │
│ │ Entrega em 24-48h      │  │ Entrega em 48-72h      │             │
│ │                        │  │                        │             │
│ │ Use antes de enviar    │  │ Use quando shortlisted │             │
│ │ uma candidatura.       │  │ pra fechar a proposta. │             │
│ │                        │  │                        │             │
│ │ [Ver detalhes →]       │  │ [Ver detalhes →]       │             │
│ └────────────────────────┘  └────────────────────────┘             │
│                                                                     │
│ ┌────────────────────────┐  ┌────────────────────────┐             │
│ │ Acompanhamento         │  │ Retorno pós-descarte   │             │
│ │ completo               │  │                        │             │
│ │                        │  │ A partir de R$ 500     │             │
│ │ A partir de R$ 1.100   │  │ Entrega em 48h         │             │
│ │ Cobre as duas fases    │  │                        │             │
│ │                        │  │ Para entender o motivo │             │
│ │ Economiza vs. comprar  │  │ e reposicionar pra     │             │
│ │ separado.              │  │ próximas oportunidades.│             │
│ │                        │  │                        │             │
│ │ [Ver detalhes →]       │  │ [Ver detalhes →]       │             │
│ └────────────────────────┘  └────────────────────────┘             │
│                                                                     │
│ ─── Estudos de caso ────────────────────────────────────────────── │
│                                                                     │
│ [Card] Como uma fornecedora de pequeno porte ganhou contrato       │
│        na Vale concorrendo com 12 candidatos                        │
│                                                                     │
│ [Card] O que aprendemos com 30 candidaturas descartadas em         │
│        Manutenção Industrial                                        │
│                                                                     │
│ [Ver todos os estudos de caso]                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tela de produto

Ao clicar "Ver detalhes →" num item do catálogo:

```
┌─ Revisão de candidatura ───────────────────────────────────────────┐
│ Voltar                                                              │
│                                                                     │
│ Revisão de candidatura                          R$ 200 (a partir)  │
│ Análise rápida e direta da sua candidatura      Entrega em 24-48h  │
│ antes de enviar.                                                    │
│                                                                     │
│ ─── O que você recebe ────────────────────────────────────────────  │
│                                                                     │
│ • Leitura do seu perfil + perfil da empresa contratante            │
│ • Análise do projeto e dos critérios de seleção                    │
│ • Recomendações específicas pro seu pitch                          │
│ • Contratos similares e como outros se posicionaram                │
│ • Notas escritas + 1 sessão de tira-dúvidas opcional               │
│                                                                     │
│ ─── Quando faz sentido ───────────────────────────────────────────  │
│                                                                     │
│ Antes de enviar uma candidatura para projetos onde você tem        │
│ menos histórico ou que envolvem categorias novas pra você.         │
│                                                                     │
│ ─── Casos relacionados ───────────────────────────────────────────  │
│                                                                     │
│ [Card] Como uma fornecedora pequena ganhou contrato na Vale        │
│ [Card] O que diferencia candidaturas que viram shortlist           │
│                                                                     │
│ [Contratar agora]                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo de compra

Ao clicar "Contratar agora", abre um diálogo de configuração da sessão:

```
┌─ Contratar Revisão de candidatura ─────────────────────┐
│                                                         │
│ Para qual candidatura?                                  │
│ ○ Estou criando uma nova candidatura agora              │
│ ○ Manutenção de Correias — Vale (rascunho)              │
│ ○ Sistema de Monitoramento — Vale (enviada há 2d)       │
│                                                         │
│ Quer adicionar contexto extra? (opcional)               │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Tem alguma dúvida específica ou contexto que    │    │
│ │ vai ajudar o especialista? Ex.: "esse é nosso   │    │
│ │ primeiro contrato com a Vale"                   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ Resumo                                                  │
│ ─────────────                                           │
│ Revisão de candidatura       R$ 200,00                  │
│ Entrega em 24-48h após atribuição                      │
│                                                         │
│ [Cancelar]              [Confirmar contratação]         │
└─────────────────────────────────────────────────────────┘
```

> **MVP sem pagamento real.** Confirmar contratação cria a `SessaoConsultoria` em status `solicitada`. Em produção entra integração de pagamento (Stripe, Mercado Pago, etc.) na borda dessa transição.

Após confirmação, exibe toast + redireciona pra tela "Minhas sessões" com a nova sessão no topo.

### Sessão em andamento (perspectiva fornecedor)

Em "Consultoria → Minhas sessões", lista paginada com filtro por status. Cada sessão é um card:

```
┌─ Revisão de candidatura ─ Manutenção de Correias ────────┐
│                                                           │
│ Status: 🔵 Em andamento                                   │
│ Advisor: [Avatar] Ana Mendes                              │
│                                                           │
│ Solicitada em 14/04/2026 às 14:30                         │
│ Atribuída em 14/04/2026 às 16:12                         │
│ Prazo de entrega: 16/04/2026                              │
│                                                           │
│ [Ver sessão]                                              │
└───────────────────────────────────────────────────────────┘
```

Estados visíveis pro fornecedor:

- 🟡 **Solicitada** — aguardando atribuição (sem advisor ainda)
- 🔵 **Em andamento** — advisor atribuído e trabalhando
- ✅ **Entregue** — entregáveis disponíveis
- ⚪ **Cancelada** — pelo próprio fornecedor antes da entrega

### Sessão entregue (entregáveis)

Quando o advisor marca como `entregue`, o fornecedor recebe notificação e o card vira:

```
┌─ Revisão de candidatura ─ Manutenção de Correias ────────┐
│                                                           │
│ Status: ✅ Entregue                                       │
│ Advisor: [Avatar] Ana Mendes                              │
│                                                           │
│ Entregue em 15/04/2026 às 11:48                           │
│                                                           │
│ ─── Entregáveis ─────────────────────────────────────     │
│                                                           │
│ 📝 Notas da revisão (4 min de leitura)                    │
│ 📖 Estudo de caso: "Manutenção em mineração — 3 padrões  │
│    que aparecem em candidaturas vencedoras"               │
│                                                           │
│ ─── Resultado ───────────────────────────────────────     │
│                                                           │
│ Sua candidatura foi atualizada após a revisão? ▸          │
│ Foi shortlistada? Aguardando triagem.                     │
│                                                           │
│ [Ver entregáveis] [Avaliar atendimento]                   │
└───────────────────────────────────────────────────────────┘
```

Ao clicar "Ver entregáveis", abre a página da sessão com:

- Notas escritas pelo advisor (rich text — markdown)
- Links pra estudos de caso anexados
- Comentários do fornecedor (caixa de texto pra responder ao advisor; cria notificação pro advisor)
- Botão "Marcar como útil" (alimenta NPS implícito)

### Histórico

"Consultoria → Minhas sessões" também serve de histórico — sessões entregues e canceladas vão pro fundo. Filtro por contexto (qual candidatura/proposta), por advisor, por status.

### Cancelamento

- **Antes da atribuição** (`status = solicitada`): fornecedor cancela livremente, sem custo. Botão "Cancelar sessão" no card.
- **Após atribuição** (`status = atribuida` ou `em_andamento`): cancelamento ainda permitido sem custo no MVP. Em produção pode entrar política de reembolso parcial.
- **Após entregue**: não cancela (já consumiu). Pode contestar via "Avaliar atendimento" (1-5 + comentário) — feedback que volta pra Celso.

---

## Lado Admin: Celso e advisors operando

### Fila de solicitações

Acesso pelo sidebar admin Consultoria → Sessões → Solicitadas.

```
┌─ Sessões solicitadas (4) ──────────────────────────────────────────┐
│                                                                     │
│ Filtros: [Tipo ▾] [Categoria ▾] [Há mais de ▾]                     │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ 🟡 Revisão de candidatura — TechMinas                           ││
│ │    Projeto: Manutenção de Correias (Vale)                       ││
│ │    Categoria: Manutenção Industrial · Itabira                   ││
│ │    Solicitada há 2h                                             ││
│ │    Sugestão de atribuição: Ana Mendes (carga: 3)                ││
│ │                                                                 ││
│ │    [Atribuir a mim] [Atribuir a outro ▾] [Ver detalhes]         ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ 🟡 Revisão de proposta — SegWork                                ││
│ │    Projeto: Consultoria SST (ArcelorMittal)                     ││
│ │    Categoria: Segurança do Trabalho · João Monlevade            ││
│ │    Solicitada há 5h                                             ││
│ │    Sugestão de atribuição: Bruno Lima (carga: 2)                ││
│ │    ⚠ Prazo de entrega vence em 18h                              ││
│ │                                                                 ││
│ │    [Atribuir a mim] [Atribuir a outro ▾] [Ver detalhes]         ││
│ └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

> **Atribuição é manual no MVP.** Sistema sugere advisor por especialização (categoria + região) + carga atual, mas a confirmação é humana. Auto-atribuição entra em backlog.

### Visão de sessão para o advisor (workspace)

A tela mais densa do produto. Tudo o que o advisor precisa pra entregar — em uma só janela.

```
┌─ Sessão #1234 — Revisão de candidatura ─────────────────────────────┐
│                                                                      │
│ Status: 🔵 Em andamento (atribuída a você há 1h)                    │
│ [Marcar como entregue] (desabilitado até ter ≥1 entregável)         │
│                                                                      │
│ ┌─ Esquerda: Contexto ───────┐  ┌─ Direita: Workspace ────────┐    │
│ │                             │  │                              │    │
│ │ ▸ Fornecedor: TechMinas     │  │ Notas da revisão            │    │
│ │   ★★★★★ 4.8 (47 reviews)    │  │ ┌──────────────────────────┐│    │
│ │   Itabira · MG · Desde 2011 │  │ │ # Pontos fortes          ││    │
│ │   [Ver perfil completo]     │  │ │                          ││    │
│ │                             │  │ │ Sua candidatura          ││    │
│ │ ▸ Empresa: Vale S.A.        │  │ │ destaca corretamente...  ││    │
│ │   ★★★★☆ 4.7 (32 reviews)    │  │ │                          ││    │
│ │   Tempo médio pgto: 28d     │  │ │ # O que melhorar         ││    │
│ │   [Ver perfil completo]     │  │ │                          ││    │
│ │                             │  │ │ ...                      ││    │
│ │ ▸ Projeto:                  │  │ └──────────────────────────┘│    │
│ │   Manutenção de Correias    │  │                              │    │
│ │   R$ 250-400k · prazo 15/06 │  │ Anexos:                      │    │
│ │   Categoria: Manutenção     │  │ [+] Anexar estudo de caso    │    │
│ │   Industrial                │  │ [+] Anexar link externo      │    │
│ │   [Ver projeto]             │  │ [+] Upload arquivo           │    │
│ │                             │  │                              │    │
│ │ ▸ Candidatura (rascunho):   │  │ ─── Estudos sugeridos ───   │    │
│ │   "Pitch: temos 15 anos..."│  │                              │    │
│ │   Faixa de preço: R$ 280-320│  │ ▸ Manutenção em mineração — │    │
│ │   3 contratos destacados    │  │   3 padrões que vencem      │    │
│ │   [Ver candidatura]         │  │   [Anexar a esta sessão]    │    │
│ │                             │  │                              │    │
│ │ ▸ Contexto extra (do        │  │ ▸ Como pequenas vencem      │    │
│ │   fornecedor):              │  │   contratos com majors      │    │
│ │   "Esse é nosso 1° contrato │  │   [Anexar a esta sessão]    │    │
│ │    com a Vale"              │  │                              │    │
│ │                             │  │                              │    │
│ └─────────────────────────────┘  └──────────────────────────────┘    │
│                                                                      │
│ ─── Comunicação com o fornecedor ───────────────────────────────    │
│ (vazio até o fornecedor responder a partir dos entregáveis)         │
└──────────────────────────────────────────────────────────────────────┘
```

**Comportamentos:**

- Notas são autosaved (draft contínuo)
- Anexos têm tipo (`notas`, `estudo_caso`, `sessao_video`, `outro`) — combo na hora de adicionar
- "Estudos sugeridos" é uma lista filtrada do módulo de estudos de caso por categoria/região do projeto
- "Marcar como entregue" só é habilitado quando há ≥1 entregável publicado (não-rascunho)
- Após "Marcar como entregue", a sessão entra em `entregue` e o fornecedor recebe notificação

### Tela de entrega

Ao clicar "Marcar como entregue":

```
┌─ Confirmar entrega ────────────────────────────────────┐
│                                                         │
│ Você está marcando esta sessão como entregue.          │
│                                                         │
│ Entregáveis incluídos:                                  │
│ ✓ Notas da revisão                                     │
│ ✓ Estudo de caso: "Manutenção em mineração..."         │
│                                                         │
│ Após confirmar, o fornecedor é notificado e pode       │
│ comentar ou avaliar o atendimento.                     │
│                                                         │
│ [Cancelar]              [Confirmar entrega]             │
└─────────────────────────────────────────────────────────┘
```

### Dashboard pessoal do advisor

Acesso pelo sidebar admin → Início (mesmo dashboard, mas filtra dados pelo `advisor_id` quando `role = advisor`).

Bloca ocultos pra `role = advisor`:

- "Métricas do mês" (receita, conversões agregadas)
- "Outreach proativo"

Blocos visíveis:

- "Suas sessões em andamento" (lista das atribuídas a você)
- "Sua fila pessoal" (sessões aguardando você atribuir)
- "Sua carga histórica" (gráfico de sessões/semana)
- "Suas avaliações" (notas que fornecedores deram em "Avaliar atendimento")

### Tela de owner (Celso): outreach + métricas + gestão

Owner Celso vê tudo, incluindo:

#### Outreach proativo

Lista priorizada de fornecedores que parecem precisar de Consultoria mas ainda não compraram.

```
┌─ Outreach proativo ────────────────────────────────────────────────┐
│                                                                     │
│ Filtros: [Critério ▾] [Categoria ▾] [Última visualização ▾]        │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ Construminas Engenharia                                          ││
│ │ ★★★★☆ 4.5 · Construção Civil · João Monlevade                  ││
│ │                                                                  ││
│ │ Sinal: 2 candidaturas descartadas em 30d na mesma categoria     ││
│ │   ▸ Ampliação Almoxarifado (Usiminas) — motivo: documentação    ││
│ │   ▸ Reforma Refeitório (Usiminas) — motivo: sem capacidade      ││
│ │                                                                  ││
│ │ Sugestão: oferta de "Retorno pós-descarte"                      ││
│ │                                                                  ││
│ │ [Enviar oferta personalizada] [Ignorar 30d]                     ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ TransLog MG Transportes                                          ││
│ │ Sinal: visualizou 5 projetos em Transporte e não candidatou      ││
│ │ Sugestão: oferta de "Revisão de candidatura"                    ││
│ │                                                                  ││
│ │ [Enviar oferta personalizada] [Ignorar 30d]                     ││
│ └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

**Critérios de identificação de leads (MVP, regras simples):**

- Fornecedor com ≥2 `Candidatura` descartada na mesma categoria nos últimos 30d
- Fornecedor que visualizou ≥3 projetos de alta `categoria_match` sem candidatar nos últimos 14d
- Fornecedor shortlistado em ≥3 propostas mas nunca venceu (qualidade da Candidatura ok, problema na Proposta)

**Enviar oferta personalizada:**

Modal pra Celso escrever uma mensagem curta + selecionar produto do catálogo (com possível desconto). Mensagem chega como notificação in-app pro fornecedor com botão "Ver oferta".

#### Métricas do mês

Bloco já mockado em `info-architecture.md`. Complemento aqui:

- Receita por tipo de serviço (revisão candidatura vs proposta vs acompanhamento vs retorno)
- Receita por advisor
- Conversão de outreach (oferta enviada → comprou)
- Taxa de "útil" (% sessões marcadas como úteis pelo fornecedor)

#### Gestão

- **Catálogo:** editar itens (`CatalogoConsultoria`), ativar/desativar, ajustar preços
- **Advisors:** convidar, editar especializações, definir `carga_simultanea_max`, desativar
- **Estudos de caso:** publicar, editar, despublicar (ver §"Estudos de caso")
- **Templates de outreach:** mensagens-modelo personalizáveis

---

## Estudos de caso

Módulo curado, decisão #8 do `info-architecture.md`. Não é despejo automático de Contrato.

### Estrutura de um caso

```ts
EstudoDeCaso {
  id: string
  titulo: string                  // narrativo, ex.: "Como uma fornecedora pequena venceu Vale"
  resumo: string                  // 1-2 frases
  contexto: {
    contrato_id_origem: string    // contrato real que inspira (não exibido se anônimo)
    categoria: string
    regiao: string
    porte_fornecedor: "pequeno" | "medio" | "grande"  // anonimização parcial
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
  destaque: boolean               // aparece em catálogo + tela de produto
  visivel_para: "fornecedores_logados" | "todos_publico"  // ver §"Visibilidade"
}
```

### Curadoria

Advisor (qualquer um, não só Celso) pode propor um caso a partir de um Contrato encerrado:

1. Em "Estudos de caso → Novo", advisor escolhe um Contrato encerrado da base
2. Sistema pre-popula campos derivados (categoria, região, porte estimado)
3. Advisor escreve narrativa + aprendizados
4. Define anonimização (campo a campo: fornecedor identificado ou anônimo? empresa idem?)
5. Se opt-in identificado, sistema dispara solicitação de consentimento à parte (notificação in-app + email futuro)
6. Após consentimento (ou se já anônimo), advisor publica
7. Owner Celso pode despromover/despublicar a qualquer momento

### Visibilidade

Decisão MVP: **estudos visíveis pra fornecedores logados** (qualquer org com `perfil_fornecedor_ativo`). Não-logados não veem — gate suave que estimula cadastro.

> Pergunta aberta: liberar pra todos (até não-logados) pode virar SEO win. Decisão futura.

### Anonimização

- **Fornecedor anônimo:** nome do fornecedor vira "fornecedora pequena/média/grande de [categoria]"
- **Empresa anônimo:** nome vira "grande mineradora", "siderúrgica regional", etc.
- **Valores monetários:** sempre em faixa, nunca exato (ex.: "R$ 150-200k" em vez de "R$ 187.350")
- **Datas:** mês + ano, nunca dia exato

Se ambas as partes identificadas, valores e datas podem ser exatos.

---

## Outcome tracking

Toda `SessaoConsultoria` entregue gera um ciclo de outcome. O sistema observa:

| Tipo de sessão | Outcome rastreado |
| --- | --- |
| Revisão de candidatura | A `Candidatura` foi shortlistada? Descartada? Por qual motivo? |
| Revisão de proposta | A `Proposta` venceu? Perdeu? |
| Acompanhamento completo | Ambos os outcomes (Candidatura + Proposta) |
| Retorno pós-descarte | Próxima `Candidatura` do fornecedor (mesma categoria) foi shortlistada? |

Outcome aparece:

- Pro fornecedor: dentro do card da sessão entregue (informativo)
- Pro advisor: na visão de sessão entregue (aprendizado pessoal)
- Pro owner: agregado em métricas (taxa de sucesso por advisor, por tipo, por categoria)

---

## Pricing

### Modelos suportados

- `fixo` — preço único cobrado no momento da contratação. Padrão pro MVP.
- `success_fee` — taxa contingente ao outcome. Ex.: "Pague R$ 0 agora; se ganhar o contrato, pague 1.5% do valor do contrato fechado". Mais avançado, requer outcome tracking confiável (ver acima).
- `hibrido` — fixo + success fee. Ex.: "R$ 200 agora + 1% se vencer".

### Snapshot de preço

Quando o fornecedor contrata, o preço atual do `CatalogoConsultoria` é congelado em `SessaoConsultoria.preco_snapshot`. Mudanças posteriores no catálogo não afetam sessões já solicitadas.

### Display de preço

- Catálogo (visão em lista): "A partir de R$ X" — usa `preco_valor` se `fixo`, ou `preco_observacao` se `success_fee`/`hibrido`
- Tela de produto: descrição completa do modelo + preço
- Modal de contratação: valor exato a ser cobrado naquela sessão

---

## Estados vazios

| Tela | Quando vazia | Mensagem |
| --- | --- | --- |
| Catálogo | Catálogo vazio (nunca deveria ocorrer em produção) | "Catálogo em construção." |
| Minhas sessões (fornecedor) | Sem nenhuma sessão | "Você ainda não contratou Consultoria. Veja o catálogo." + CTA |
| Estudos de caso (browser) | Nenhum publicado | "Estudos de caso aparecem aqui à medida que advisors publicam." |
| Fila de solicitações (advisor) | Sem solicitações | "Fila vazia. Bom trabalho." |
| Outreach proativo (owner) | Sem leads identificados | "Nenhum fornecedor em risco/oportunidade no momento." |
| Workspace de sessão | (sempre tem conteúdo após atribuição) | — |

---

## Decisões tomadas

1. **Atribuição é manual no MVP** — sistema sugere por especialização + carga, mas humano confirma. Auto-atribuição em backlog.
2. **Sem pagamento real no MVP** — confirmar contratação cria sessão diretamente. Integração de gateway entra na borda em produção.
3. **Comunicação durante sessão = comentários nos entregáveis**. Sem chat completo. Suficiente pra ida-e-volta sem complexidade extra.
4. **Cancelamento sem custo no MVP** em qualquer estado pré-entrega.
5. **Estudos de caso visíveis pra fornecedores logados** — gate suave; aquisição via cadastro.
6. **Anonimização opt-in por parte** — advisor decide; se identificado, dispara consentimento à parte.
7. **Outcome tracking automático** — sistema observa Candidatura/Proposta relacionada e popula resultado.
8. **Owner-only**: receita, outreach, edição de catálogo, gestão de advisors, templates de outreach.
9. **Sugestões de atribuição automatizadas** mas confirmadas manualmente — usa especialização (categoria + região) + carga atual.
10. **Drafts de notas autosaved** continuamente no workspace do advisor.
11. **"Marcar como entregue" exige ≥1 entregável publicado** (não-rascunho).
12. **Tipos de entregável MVP:** notas (rich text) + link (estudo de caso ou externo). `sessao_video` reservado pra futuro.
13. **Avaliação do atendimento** após entrega: 1-5 + comentário curto. Feed pra Celso, não vira review pública (separado de `Review` do contrato).

---

## Perguntas em aberto

| Pergunta | Como decidir |
| --- | --- |
| Estudos de caso liberados pra todos (não-logados) — vale o SEO? | Decisão de produto + avaliação de aquisição |
| Templates de outreach: editáveis por qualquer advisor ou só owner? | Decisão de produto |
| `success_fee` exige integração com fechamento de contrato e disparo automático de cobrança — escopo MVP? | Decisão de produto |
| Auto-atribuição com regras simples vale a pena no MVP, ou manual está bem? | Decisão de produto |
| Reembolso parcial em cancelamento pós-atribuição (em produção) — política? | Decisão de produto + jurídico |
| Estudo de caso pode ser referenciado no perfil público da empresa/fornecedor identificado? | Decisão de produto + privacidade |
| NPS interno do "Avaliar atendimento" — exibido publicamente em algum lugar? | Decisão de produto |

---

## Delta para o data model

Adições/ajustes que este artefato exige no `design/data-model.md`:

- `CatalogoConsultoria` — entidade já modelada; confirmar campos (`preco_modelo`, `preco_valor`, `preco_observacao`, `prazo_entrega_estimado`).
- `SessaoConsultoria` — adicionar:
  - `comentarios_fornecedor: Comentario[]` — comentários inline nos entregáveis após entrega
  - `marcado_util?: boolean` — botão NPS pelo fornecedor
  - `avaliacao_atendimento?: { nota: 1..5; comentario?: string; criada_em: string }` — feedback interno (não vira Review pública)
  - `outcome?: { tipo: "candidatura_shortlist" | "candidatura_descartada" | "proposta_venceu" | "proposta_perdeu" | "pendente"; observado_em?: string }` — resultado rastreado automaticamente
- `EstudoDeCaso` — entidade nova:
  - `id, titulo, resumo, contrato_id_origem, contexto (categoria/regiao/porte), corpo (markdown), aprendizados[], anonimizacao (fornecedor/empresa), autor_advisor_id, publicado_em, destaque, visivel_para`
- `Advisor` — adicionar:
  - `especializacoes` já existe — confirmar
  - `carga_simultanea_max?` já existe — confirmar
  - `avaliacao_media?: number` (computado de `SessaoConsultoria.avaliacao_atendimento`)
- `OfertaOutreach` — entidade nova (futuro próximo):
  - `id, fornecedor_id, owner_id, mensagem, catalogo_sugerido_id, desconto_percentual?, enviada_em, status: enviada | visualizada | aceita | ignorada`
- `Notificacao` (ainda não modelada) — entrará no próximo artefato; vários triggers desta camada (sessão entregue, oferta de outreach, estudo de caso publicado).

---

## Checklist para mockup

Telas e componentes — lado fornecedor:

- [ ] Página "Catálogo" com 4 cards de tipo de serviço + lista de estudos de caso destacados
- [ ] Página de produto (1 por tipo) com descrição + preço + casos relacionados + CTA contratar
- [ ] Modal de contratação (escolher candidatura/proposta + contexto extra opcional)
- [ ] Toast/feedback de confirmação após contratar
- [ ] Página "Minhas sessões" com lista paginada + filtros
- [ ] Card de sessão por status (solicitada / em andamento / entregue / cancelada)
- [ ] Página de sessão entregue com entregáveis (notas markdown, links, comentários)
- [ ] Caixa de comentário do fornecedor nos entregáveis
- [ ] Botão "Marcar como útil"
- [ ] Modal "Avaliar atendimento" (1-5 + comentário)
- [ ] Página de listagem de estudos de caso (browser)
- [ ] Página de leitura de estudo de caso (markdown render)

Telas e componentes — lado admin Consultoria:

- [ ] Dashboard admin com blocos visíveis condicional ao `role`
- [ ] Página "Sessões → Solicitadas" (fila com cards + sugestão de atribuição + ações)
- [ ] Modal "Atribuir a outro" (lista de advisors com especialização e carga)
- [ ] Página "Sessões → Atribuídas a mim"
- [ ] Workspace de sessão (split: contexto à esquerda + workspace à direita + comunicação no rodapé)
- [ ] Editor markdown para notas (autosave)
- [ ] Combo de tipo de entregável (notas / estudo / link / arquivo)
- [ ] Anexador de estudos de caso sugeridos
- [ ] Modal "Confirmar entrega"
- [ ] Página "Advisors" (lista, convidar, editar, desativar) — owner only
- [ ] Página "Catálogo" (editar itens, preços, ativar/desativar) — owner only
- [ ] Página "Estudos de caso" (criar, editar, publicar, despublicar)
- [ ] Wizard de criação de estudo de caso (escolher contrato → preencher narrativa → anonimização → consentimento → publicar)
- [ ] Página "Outreach proativo" (lista priorizada com sinais explicados) — owner only
- [ ] Modal "Enviar oferta personalizada" (mensagem + produto + desconto opcional)
- [ ] Página "Templates de outreach" — owner only

Comportamentos automáticos:

- [ ] `SessaoConsultoria.preco_snapshot` congela preço atual do catálogo na contratação
- [ ] Sugestão de atribuição calcula advisor por (especialização + carga atual)
- [ ] "Marcar como entregue" só habilita com ≥1 entregável publicado
- [ ] Notificação ao fornecedor quando sessão é atribuída e quando entregue
- [ ] Notificação ao advisor quando recebe atribuição
- [ ] Outcome tracking observa Candidatura/Proposta vinculada e popula `outcome` automaticamente
- [ ] Estudos de caso filtram-se por categoria/região do projeto na visão "Estudos sugeridos" do workspace
- [ ] Anonimização opt-in dispara solicitação de consentimento à parte
- [ ] Identificação de leads de outreach recalculada periodicamente (cron diário)
- [ ] Receita/outreach/edição de catálogo/gestão de advisors ocultos pra `Advisor.role = advisor`
