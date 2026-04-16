# Information Architecture — ConectaFornece

> Artefato de design. Define a estrutura de navegação, dashboards, contextos e pontos de entrada de cada role na ConectaFornece. Considera o **modelo de tenant dual** (uma `Organizacao` pode operar como empresa, fornecedor ou ambos).

## Princípios

1. **Contexto por vez.** Mesmo num tenant dual, o membro opera em **um perfil de cada vez**. Sidebar, dashboard e ações refletem o contexto ativo. Sem mistura.
2. **Switcher leve.** A troca de contexto é um dropdown no topbar, instantânea, sem novo login.
3. **Tenant-level vs perfil-level.** Identidade legal, membros e linkage são do tenant — ficam em "Configurações da organização", visíveis em qualquer contexto. Display info, reputação e categorias são do perfil — ficam em "Perfil [empresa/fornecedor]".
4. **Consultoria mora no contexto fornecedor.** Tenant que só tem perfil empresa nunca vê a camada Consultoria. Quando o segundo perfil é ativado, a Consultoria aparece automaticamente.
5. **Atenção primeiro.** Cada dashboard começa com "o que precisa da minha ação" — não com "o que tem na plataforma". Status > Conteúdo.
6. **Estados vazios são primeira impressão.** Onboarding raramente termina com dados; trate vazio como tela de boas-vindas, não como tela quebrada.

---

## Sistema cross-cutting

### Topbar

Vista ao topo de qualquer página dentro do app (não aparece em landing, login, registro).

**Componentes da esquerda pra direita:**

1. **Logo + nome do tenant** — clica e volta ao Início do contexto ativo.
2. **Switcher de contexto** — só visível se o tenant tem ≥2 perfis ativos OU é admin Consultoria. Dropdown:
   ```
   Atuando como: [Ícone] Empresa ▾
   ──────────────────────────────
   ✓ Empresa — Metalúrgica XYZ
     Fornecedor — Metalúrgica XYZ
     ───────────────────────────
     ⚙ Configurações da organização
   ```
3. **Busca global** — fora do escopo do MVP (decidido). Cada tela tem filtros próprios. Reconsiderar pós-MVP conforme volume.
4. **Notificações** — sininho com badge de não-lidas. Drawer lateral ao clicar.
5. **Avatar do membro** — dropdown:
   ```
   [Avatar] Maria Silva
   Gerente de Compras
   ──────────────────
   Meu perfil
   Configurações pessoais
   ──────────────────
   Sair
   ```

**Quando o tenant tem só um perfil:** o switcher esconde; aparece apenas o badge "Empresa" ou "Fornecedor" como label não-interativo.

### Onboarding

Fluxo do primeiro acesso, do signup até o tenant operacional.

```
1. Signup
   └── email + senha + nome completo + telefone

2. Identidade da organização
   └── razão social + CNPJ + endereço fiscal
   └── nome curto de display (pode diferir da razão social)

3. Escolher perfil(s)
   ┌────────────────────────────────────────────┐
   │ Como você quer atuar na ConectaFornece?    │
   │                                            │
   │ ☐ Quero contratar serviços (Empresa)       │
   │   Publique projetos, receba candidaturas,  │
   │   feche contratos com fornecedores locais. │
   │                                            │
   │ ☐ Quero prestar serviços (Fornecedor)      │
   │   Encontre projetos compatíveis,           │
   │   candidate-se, ganhe contratos.           │
   │                                            │
   │ Pode ativar os dois agora ou ativar o      │
   │ segundo depois nas configurações.          │
   └────────────────────────────────────────────┘

   Se ambos marcados, aparece um bloco adicional:

   ┌────────────────────────────────────────────┐
   │ Visibilidade entre os perfis               │
   │                                            │
   │ ☑ Mostrar publicamente que esta            │
   │   organização atua em ambos os lados       │
   │                                            │
   │ Quando ativado, seu perfil empresa mostra  │
   │ um link para o perfil fornecedor e         │
   │ vice-versa. Ajustável depois em            │
   │ Configurações da organização. [Saiba mais] │
   └────────────────────────────────────────────┘

   A ordem em que os perfis são marcados define o
   dashboard default do primeiro login.

4. Configurar perfil(s) escolhido(s)
   └── empresa: setor, descrição, cidade, região, logo
   └── fornecedor: categorias atendidas, regiões atendidas,
                    descrição, cidade, credenciais canônicas, capacidade,
                    documentos internos reaproveitáveis

5. (Opcional) Convidar membros adicionais

6. Início → dashboard do perfil primeiro escolhido no passo 3
   (do segundo login em diante, o sistema guarda o último
    contexto usado pelo membro e reabre nele)
```

### Ativação do segundo perfil (depois)

Em **Configurações da organização → Perfis**, owner vê:

```
Perfis ativos
─────────────
✓ Empresa     [Editar perfil]  [Desativar]
○ Fornecedor  [Ativar]
```

Clicar **Ativar** abre o wizard simplificado do passo 4 do onboarding pro perfil escolhido.

### Configurações da organização

Tela acessível pelo switcher do topbar (qualquer contexto). Estrutura em **abas**:

```
[ Organização ] [ Membros ] [ Perfil Empresa ] [ Perfil Fornecedor ] [ Faturamento* ]
```

- **Organização** — razão social, CNPJ, endereço fiscal, linkage pública (toggle), ativação/desativação de perfis. Só `owner` edita.
- **Membros** — lista, convidar, editar role, desativar. `admin` e `owner` editam.
- **Perfil Empresa** — só visível se perfil ativo. Edita campos do perfil empresa (descrição, setor, logo, etc.). `admin` e `owner` editam.
- **Perfil Fornecedor** — idem. Inclui categorias atendidas, regiões atendidas, credenciais canônicas e um gerenciador interno de comprovantes/documentos da empresa. O perfil público expõe só os nomes das credenciais; status documental fica privado.
- **Faturamento** — futuro (Consultoria). Marcar como `*` no MVP.

> Ver §"Perguntas em aberto" para a decisão sobre ordem de abas e default de entrada.

---

## Contexto: Empresa

### Sidebar

```
┌─────────────────────────────────┐
│ [Logo] ConectaFornece           │
├─────────────────────────────────┤
│ ⚡ Início                       │
│                                 │
│ 📁 Projetos                     │
│    └ Meus projetos              │
│    └ Novo projeto               │
│                                 │
│ 📥 Candidaturas recebidas       │
│                                 │
│ 📜 Contratos                    │
│    └ Em execução                │
│    └ Histórico                  │
│                                 │
│ 💬 Mensagens                    │
│                                 │
│ 🔍 Diretório de fornecedores    │
│                                 │
│ ⭐ Reviews                      │
│                                 │
├─────────────────────────────────┤
│ 🏢 Perfil público (empresa)     │
│ ⚙ Configurações da organização  │
└─────────────────────────────────┘
```

### Dashboard (Início)

Hierarquia descendente de urgência:

```
┌─ Topo ─────────────────────────────────────────────────┐
│ Olá, Maria. Aqui está o que precisa da sua atenção.    │
└────────────────────────────────────────────────────────┘

┌─ Triagem pendente ──────────────┐  ┌─ Reviews pendentes ─┐
│ 7 candidaturas aguardando       │  │ 2 contratos         │
│ decisão                         │  │ encerrados sem      │
│                                 │  │ avaliação           │
│ ▸ Projeto X — 4 candidaturas    │  │                     │
│ ▸ Projeto Y — 3 candidaturas    │  │ [Avaliar agora]     │
│                                 │  │                     │
│ [Ir para triagem]               │  │                     │
└─────────────────────────────────┘  └─────────────────────┘

┌─ Projetos ativos ──────────────────────────────────────┐
│ ▸ Manutenção de Correias — 5 candidaturas — 12 dias    │
│ ▸ Sistema de Monitoramento — 3 cand. — 23 dias         │
│ ▸ Reforma do Refeitório — 2 cand. — 8 dias             │
│                                                         │
│ [Publicar novo projeto]                                 │
└────────────────────────────────────────────────────────┘

┌─ Contratos em execução ─────────────┐  ┌─ Mensagens ────┐
│ ▸ Transporte de Minério — TransLog  │  │ 4 não lidas    │
│   — Início 01/03, fim previsto 30/09│  │                │
│ ▸ Consultoria SST — SegWork         │  │ [Abrir]        │
│   — Em andamento                    │  │                │
└─────────────────────────────────────┘  └────────────────┘
```

### Estados vazios

| Tela | Quando vazia | Mostrar |
| --- | --- | --- |
| Início | Tenant novo, nenhum projeto | "Bem-vindo. Comece publicando seu primeiro projeto." + CTA grande |
| Triagem | Sem candidaturas pendentes | "Nenhuma candidatura aguardando. Bom trabalho." |
| Projetos | Sem projetos | CTA "Publicar primeiro projeto" |
| Contratos em execução | Sem contratos ativos | "Quando uma proposta vencedora for aceita, o contrato aparece aqui." |
| Mensagens | Sem conversas | "Mensagens com fornecedores aparecem após shortlist." |
| Diretório | Filtro sem resultados | "Nenhum fornecedor encontrado nessa categoria/região. Tente ampliar os filtros." |
| Reviews | Sem contratos para avaliar | "Reviews aparecem quando contratos são encerrados." |

---

## Contexto: Fornecedor

### Sidebar

```
┌─────────────────────────────────┐
│ [Logo] ConectaFornece           │
├─────────────────────────────────┤
│ ⚡ Início                       │
│                                 │
│ 🔭 Descobrir projetos           │
│                                 │
│ 📤 Minhas candidaturas          │
│                                 │
│ 📋 Propostas formais            │
│                                 │
│ 📜 Contratos                    │
│    └ Em execução                │
│    └ Histórico                  │
│                                 │
│ 💬 Mensagens                    │
│                                 │
│ ✨ Consultoria                  │
│    └ Catálogo                   │
│    └ Minhas sessões             │
│                                 │
│ ⭐ Reviews                      │
│                                 │
├─────────────────────────────────┤
│ 🔧 Perfil público (fornecedor)  │
│ ⚙ Configurações da organização  │
└─────────────────────────────────┘
```

### Dashboard (Início)

```
┌─ Topo ─────────────────────────────────────────────────┐
│ Olá, Pedro. Veja onde sua atenção pode render mais.    │
└────────────────────────────────────────────────────────┘

┌─ Propostas a enviar ────────────┐  ┌─ Banner Consultoria ────────┐
│ 2 propostas formais aguardando  │  │ ✨ Sua candidatura no       │
│                                 │  │ Projeto X foi descartada.   │
│ ▸ Manutenção Correias — Vale    │  │ Quer entender por quê?      │
│   prazo: 16/04 (em 2 dias)      │  │                             │
│ ▸ Reforma Refeitório — Usiminas │  │ [Falar com a Consultoria]   │
│   prazo: 22/04                  │  │                             │
│                                 │  └─────────────────────────────┘
│ [Ir para propostas]             │
└─────────────────────────────────┘

┌─ Minhas candidaturas ──────────────────────────────────┐
│ ▸ Sistema de Monitoramento — Aguardando triagem (5d)   │
│ ▸ Transporte de Equipamentos — Shortlistada ✓          │
│ ▸ Gestão de Resíduos — Aguardando triagem (12d)        │
│                                                         │
│ [Ver todas (8)]                                         │
└────────────────────────────────────────────────────────┘

┌─ Projetos recomendados pra você ───────────────────────┐
│ Baseado nas suas categorias e região                   │
│                                                         │
│ ▸ Manutenção de Pontes Rolantes — Vale — Itabira       │
│   Fit score: 87% — R$ 120k–180k                        │
│ ▸ Implantação de Sistema PGR — ArcelorMittal           │
│   Fit score: 74% — R$ 100k–160k                        │
│                                                         │
│ [Descobrir mais projetos]                              │
└────────────────────────────────────────────────────────┘

┌─ Contratos em execução ─────────────┐  ┌─ Mensagens ────┐
│ ▸ Treinamento NR-35 — ArcelorMittal │  │ 1 não lida     │
└─────────────────────────────────────┘  └────────────────┘
```

### Pontos de entrada da Consultoria

A camada Consultoria do Celso aparece em **7 pontos** dentro do contexto fornecedor:

| # | Onde | Forma |
| --- | --- | --- |
| 1 | Sidebar | Item dedicado "Consultoria" com sub-itens (Catálogo, Minhas sessões) |
| 2 | Dashboard | Banner contextual (varia: candidatura descartada, oportunidade compatível, projeto novo de alto fit) |
| 3 | Página de projeto | Fit score visível com hook ("entender por que seu fit é 72%") |
| 4 | Tela de candidatura | **CTA 1** ao lado do botão "Enviar candidatura" |
| 5 | Tela de proposta formal | **CTA 2** ao lado do botão "Enviar proposta" |
| 6 | Notificação de descarte | **CTA 3** dentro da notificação ("Quer entender o motivo?") |
| 7 | Perfil do advisor (após booking) | Booking direto, histórico de sessões com aquele advisor |

### Estados vazios

| Tela | Quando vazia | Mostrar |
| --- | --- | --- |
| Início | Tenant novo, nenhuma candidatura | "Bem-vindo. Comece descobrindo projetos compatíveis." |
| Descobrir projetos | Filtro sem resultados | "Nenhum projeto encontrado. Tente ampliar categorias ou regiões." |
| Minhas candidaturas | Sem candidaturas | "Quando você se candidatar a um projeto, ele aparece aqui." |
| Propostas formais | Sem shortlist | "Propostas formais aparecem quando você é shortlisted." |
| Consultoria → Catálogo | (sempre tem conteúdo) | — |
| Consultoria → Minhas sessões | Sem sessão contratada | "Você ainda não contratou nenhuma sessão de Consultoria." + CTA "Ver catálogo" |

---

## Contexto: Admin Consultoria (Celso + equipe)

> Operado por `Advisor`s da equipe Celso. Não é um tenant cliente — é o módulo administrativo da plataforma.

### Sidebar

```
┌─────────────────────────────────┐
│ [Logo] ConectaFornece — Admin   │
├─────────────────────────────────┤
│ ⚡ Início                       │
│                                 │
│ 🎟 Sessões                      │
│    └ Solicitadas                │
│    └ Atribuídas a mim           │
│    └ Em andamento               │
│    └ Entregues                  │
│                                 │
│ 👥 Advisors                     │
│                                 │
│ 📚 Catálogo de serviços         │
│                                 │
│ 📖 Estudos de caso              │
│                                 │
│ 📊 Inteligência                 │
│    └ Funil de conversão         │
│    └ Outreach proativo          │
│    └ Fornecedores em risco      │
│                                 │
├─────────────────────────────────┤
│ 🏢 Organizações (browse)        │
│ ⚙ Configurações da plataforma   │
└─────────────────────────────────┘
```

### Dashboard (Início)

```
┌─ Topo ─────────────────────────────────────────────────┐
│ Olá, Celso. 4 sessões aguardando atribuição.           │
└────────────────────────────────────────────────────────┘

┌─ Fila de atribuição ────────────┐  ┌─ Carga da equipe ──┐
│ 4 sessões solicitadas           │  │ Você: 3 ativas     │
│                                 │  │ Ana: 5 ativas      │
│ ▸ Revisão candidatura — TechMin │  │ Bruno: 2 ativas    │
│   solicitada há 2h              │  │                    │
│ ▸ Revisão proposta — SegWork    │  │ [Ver detalhes]     │
│   solicitada há 5h              │  └────────────────────┘
│ ▸ ...                           │
│                                 │
│ [Atribuir agora]                │
└─────────────────────────────────┘

┌─ Outreach proativo ────────────────────────────────────┐
│ Fornecedores com candidaturas descartadas que ainda    │
│ não compraram CTA 3 (últimos 14 dias):                 │
│                                                         │
│ ▸ Construminas — 2 descartes em "Sem capacidade"       │
│ ▸ TransLog — 1 descarte em "Preço fora"                │
│                                                         │
│ [Abrir lista completa]                                  │
└────────────────────────────────────────────────────────┘

┌─ Métricas do mês ──────────────────────────────────────┐
│ Sessões entregues: 23  •  Receita: R$ 18.450           │
│ Conversão de fornecedor (visualiza → candidata): 41%   │
│ Conversão de candidatura (envia → shortlist): 28%      │
└────────────────────────────────────────────────────────┘
```

> **Visibilidade de receita:** o bloco "Métricas do mês" com valores monetários e o bloco "Outreach proativo" são visíveis apenas para o `owner` da Consultoria (Celso). Advisors veem suas próprias sessões atribuídas/entregues, carga e avaliações recebidas, sem receita agregada.

### Estados vazios

| Tela | Quando vazia | Mostrar |
| --- | --- | --- |
| Início | Sem sessões | "Aguardando primeiras solicitações da Consultoria." |
| Sessões → Solicitadas | Fila vazia | "Tudo atribuído. Bom trabalho." |
| Estudos de caso | Sem casos publicados | "Quando contratos públicos forem encerrados, vire estudos de caso aqui." |
| Outreach proativo | Sem leads | "Nenhum fornecedor em risco no momento." |

---

## Hierarquia visual (regra geral)

Em qualquer dashboard, a ordem descendente de prioridade é:

1. **Saudação contextual** — uma linha curta que diz "o que precisa da sua atenção".
2. **Bloco de ação imediata** — aquilo que tem prazo, está bloqueado em mim, ou é high-conversion. Sempre topo-esquerdo.
3. **Bloco de status do que está em andamento** — visão dos contratos/candidaturas/propostas vivas.
4. **Bloco de oportunidades** — recomendações, projetos novos, leads (fornecedor); fornecedores em destaque (empresa).
5. **Bloco de comunicação** — mensagens não lidas, notificações importantes.
6. **Bloco passivo** — métricas históricas, links a relatórios. Rodapé.

---

## Decisões tomadas neste artefato

1. **Switcher de contexto vive no topbar**, ao lado do logo, em dropdown. Aparece só se ≥2 perfis ativos.
2. **Configurações da organização** é uma única tela com abas (Organização, Membros, Perfil Empresa, Perfil Fornecedor, Faturamento futuro).
3. **Consultoria é sidebar item de primeiro nível** no contexto fornecedor (não escondida em submenu).
4. **Ativação do segundo perfil** acontece em Configurações da organização, com wizard simplificado idêntico ao passo 4 do onboarding.
5. **Cada dashboard começa com "atenção pendente"**, não com métricas históricas.
6. **Fit score é mostrado livre na página de projeto**, com hook pra Consultoria explicando o "por que" — não atrás de paywall.
7. **Linkage pública entre perfis** aparece como badge/link no perfil público (ex.: "Esta organização também atua como fornecedor"), respeitando o opt-out global do tenant.

---

## Decisões tomadas (2026-04-14)

1. **Linkage pública no onboarding** — toggle explícito no passo 3, pré-marcado, só aparece se o tenant ativa os dois perfis. Ajustável depois em Configurações.
2. **Dashboard default no primeiro login dual** — perfil primeiro escolhido no passo 3 do onboarding. Do segundo login em diante, `ultimo_contexto_usado` do membro.
3. **Busca global no topbar** — fora do escopo do MVP. Cada tela tem filtros próprios. Reconsiderar conforme volume.
4. **Notificações** — drawer lateral (5–10 mais recentes no clique do sino) + página dedicada com filtros e marcar-lidas em lote.
5. **Configurações pessoais** — tela própria acessada pelo dropdown do avatar, fora das Configurações da organização.
6. **Diretório de fornecedores (contexto empresa)** — apenas busca/leitura no MVP. Favoritar e convite reverso ficam pós-MVP.
7. **Receita na admin Consultoria** — visível apenas pro `owner` (Celso). Advisors veem operacional (sessões atribuídas/entregues, carga), sem valores monetários. Outreach proativo também é só pro owner.
8. **Estudos de caso** — módulo separado com curação manual por advisor/Celso. Narrativa + anonimização + aprendizados destacados. Contratos públicos NÃO viram caso automaticamente.
9. **Reviews na sidebar** — item de primeiro nível em todos os contextos. Agrega reviews dadas + pendentes + recebidas (read-only).

---

## Delta para o data model

Adições/ajustes que este artefato exige no `design/data-model.md`:

- `Organizacao` ganha `perfil_primeiro_escolhido: "empresa" | "fornecedor"` — congelado no onboarding, alimenta o dashboard default do primeiro login.
- `Membro` ganha `telefone` (do signup) e `ultimo_contexto_usado?: "empresa" | "fornecedor"` (atualizado a cada switch; alimenta dashboard default do segundo login em diante).
- `Advisor` ganha `role: "owner" | "advisor"` — Celso = owner (vê receita e outreach); demais = advisor (só operacional).
- `Advisor` precisa expor `sessoes_ativas_count` (computado) pra alimentar widget de carga da equipe.
- `Notificacao` — entidade ainda não modelada; entra quando desenharmos o sistema de notificações.
- `ConfiguracoesPessoais` — subdocumento do `Membro` (avatar, preferências, 2FA). Detalhar no design de "Configurações pessoais".

---

## Checklist para mockup

Componentes estruturais:

- [ ] Topbar com logo + nome do tenant + switcher condicional + notificações + avatar
- [ ] Switcher de contexto (dropdown) — aparece só se ≥2 perfis ativos
- [ ] Drawer lateral de notificações (5–10 mais recentes)
- [ ] Página dedicada de notificações (filtros + marcar-lidas em lote)
- [ ] Dropdown do avatar → configurações pessoais + sair
- [ ] Tela de configurações pessoais (fora das configs do tenant)
- [ ] Sidebar empresa (8 itens incluindo Reviews e Configurações)
- [ ] Sidebar fornecedor (9 itens incluindo Consultoria com sub-itens)
- [ ] Sidebar admin Consultoria (6 itens incluindo Inteligência)
- [ ] Tela "Configurações da organização" com 5 abas (Organização, Membros, Perfil Empresa, Perfil Fornecedor, Faturamento*)
- [ ] Tela de Membros — lista, convidar, editar role, desativar
- [ ] Onboarding em 6 passos (signup → identidade legal → perfil(s) + linkage → configurar perfis → convidar membros → dashboard)
- [ ] Toggle condicional de linkage pública no passo 3 do onboarding (só se dual)
- [ ] Fluxo "Ativar segundo perfil" em Configurações → Perfis (wizard simplificado)
- [ ] Dashboard empresa — 5 blocos (triagem pendente, reviews pendentes, projetos ativos, contratos em execução, mensagens)
- [ ] Dashboard fornecedor — 5+ blocos (propostas a enviar, banner Consultoria contextual, minhas candidaturas, projetos recomendados, contratos em execução, mensagens)
- [ ] Dashboard admin Consultoria — 4 blocos (fila de atribuição, carga da equipe, outreach proativo, métricas do mês)
- [ ] Estados vazios por tela (22 catalogados nos três contextos)

Comportamentos automáticos:

- [ ] Primeiro login do membro abre dashboard do `perfil_primeiro_escolhido` da Organizacao
- [ ] Logins subsequentes abrem contexto de `ultimo_contexto_usado` do Membro
- [ ] Switcher de contexto esconde se tenant for single-side
- [ ] Bloco "Métricas do mês" + "Outreach proativo" ocultos para `Advisor.role = advisor` (só `owner` vê)
- [ ] Abas "Perfil Empresa" / "Perfil Fornecedor" em Configurações aparecem só se o perfil correspondente estiver ativo
- [ ] Badge de linkage pública renderiza nos perfis públicos quando `linkage_publica = true`
- [ ] Troca de contexto via switcher atualiza `ultimo_contexto_usado` do Membro

Pontos de entrada da Consultoria (contexto fornecedor):

- [ ] Item "Consultoria" no sidebar com sub-itens Catálogo + Minhas sessões
- [ ] Banner contextual no dashboard (muda conforme estado: descarte recente, projeto de alto fit, etc.)
- [ ] Hook de fit score na página de projeto ("por que meu fit é X?")
- [ ] CTA 1 ao lado do botão "Enviar candidatura"
- [ ] CTA 2 ao lado do botão "Enviar proposta"
- [ ] CTA 3 inline na notificação/feedback de descarte
- [ ] Booking direto na página do advisor (após primeiro contato)
