# Design

Artefatos de design da ConectaFornece. Cada arquivo descreve uma dimensão do produto e serve como spec pra construção do mockup visual.

## Como ler

1. **Comece pelo handshake** — é o core do fluxo. Entenda como empresa e fornecedor se encontram, negociam e fecham contrato, e onde a Consultoria se insere.
2. **Depois o data model** — entenda as entidades que o fluxo exige, suas relações e ciclos de vida.
3. **Depois a IA** — veja como tudo isso vira navegação, dashboards e onboarding.
4. **Depois os artefatos específicos** — cada um detalha uma camada (perfis públicos, telas, Consultoria, notificações).

## Artefatos

| Arquivo | Cobre | Estado |
| --- | --- | --- |
| `handshake-flow.md` | Fluxo 3-step entre empresa e fornecedor, pontos de inserção da Consultoria, mecânica de avaliações two-way | ✅ |
| `data-model.md` | Todas as entidades, relações, máquinas de estado, regras de domínio, migrações | ✅ |
| `info-architecture.md` | Sidebars por contexto, dashboards, topbar, onboarding, configurações, switcher de organização dual | ✅ |
| `public-profiles.md` | Perfis públicos (empresa visto por fornecedor e vice-versa), reputação agregada, linkage cruzada | ✅ |
| `consulting-layer.md` | Catálogo Consultoria, booking, sessões, admin do Celso, estudos de caso, outreach proativo | ✅ |
| `notifications.md` | Sistema de notificações, triggers, conteúdo, canais, destino por contexto | ✅ |

## Como usar pra construir o mockup

Cada artefato termina com a seção **"Checklist para mockup"** — uma lista explícita de telas, componentes e comportamentos automáticos que o artefato implica. Use esses checklists como contrato de construção: o mockup está completo quando todos os itens estão checados.

Ordem recomendada de construção:

1. **Data model no `mock-data.ts`** — entidades novas + campos + pelo menos 1 organização dual-role de teste.
2. **Sidebar e topbar por contexto** — esqueleto de navegação + switcher condicional.
3. **Dashboards com dados mockados** — blocos de atenção pendente + status em andamento.
4. **Telas do handshake** — candidatura → triagem → mensagens → proposta → avaliações. Construídas direto a partir de `handshake-flow.md` + `data-model.md` + `info-architecture.md` (não há spec dedicada de tela; validações vão inline no data model, microcopy decidida no build).
5. **Perfis públicos** — empresa e fornecedor.
6. **Camada Consultoria** — catálogo, fluxo de compra, sessões, área de trabalho do consultor, admin do gestor.
7. **Notificações + estados vazios finais**.

## Decisões em contexto

Cada artefato carrega uma seção **"Decisões"** ou **"Decisões tomadas"** ao final, listando as escolhas de produto alinhadas com o Arthur e a data da decisão. Decisões estratégicas de alto nível (business model, realidade do tenant dual) vivem na memória automatizada do assistente, não em arquivo.

Não existe um log separado de decisões — cada decisão fica junto do contexto onde os tradeoffs foram debatidos.

## Convenções

- **UI/conteúdo em português brasileiro** (valores de campo, labels, copy).
- **Identificadores de código em inglês**; chaves de objeto em português sem acento (ver `AGENTS.md`).
- **Datas** armazenadas em ISO, exibidas em `DD/MM/YYYY`.
- **Valores monetários** em formato brasileiro (`R$ X.XXX,XX`).
- **Enums** em snake_case minúsculo.
- **Diagramas** em Mermaid ou ASCII, renderizados no GitHub/VSCode.

## Quando o mockup divergir do design

O design é o plano; o mockup é a execução. Se ao construir surgir uma tensão entre o doc e a implementação, **a verdade está no doc** — atualize o doc primeiro, decida a mudança, depois ajuste o mockup. O contrário gera drift silencioso e os docs viram ficção.
