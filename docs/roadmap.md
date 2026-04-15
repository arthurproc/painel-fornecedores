# Roadmap do Mockup — ConectaFornece

> Visão macro do progresso de construção do mockup visual. **Granularidade: fases e marcos**, não componentes individuais.
>
> Pra saber *o que* construir dentro de cada fase, siga os links pros artefatos de design — cada um tem um **checklist para mockup** detalhado no fim.

**Última atualização:** 2026-04-15

## Estado atual

- **Design do produto:** ✅ concluído (7 artefatos em `design/`)
- **Construção do mockup:** 📋 não iniciada
- **Próximo marco:** R1 com Celso pra alinhar direção antes de construir

## Fases do mockup

| # | Fase | Fonte de verdade | Status | Depende de |
| --- | --- | --- | --- | --- |
| 1 | Refactor do `mock-data.ts` — criar entidades novas, migrar as existentes | `design/data-model.md` | 📋 a fazer | — |
| 2 | Navegação (sidebar por contexto + topbar + switcher) | `design/info-architecture.md` | 📋 a fazer | Fase 1 |
| 3 | Dashboards dos 3 contextos (empresa / fornecedor / admin Consultoria) | `design/info-architecture.md` | 📋 a fazer | Fases 1-2 |
| 4 | Telas do handshake (candidatura → triagem → mensagens → proposta → review) | `design/handshake-flow.md` + `design/data-model.md` | 📋 a fazer | Fases 1-3 |
| 5 | Perfis públicos (empresa + fornecedor) | `design/public-profiles.md` | 📋 a fazer | Fase 1 |
| 6 | Camada Consultoria (catálogo + sessão + workspace + outreach + estudos de caso) | `design/consulting-layer.md` | 📋 a fazer | Fases 1, 3 |
| 7 | Sistema de notificações (drawer + página + preferências) | `design/notifications.md` | 📋 a fazer | Fases 1-6 |

**Legenda de status:** 📋 a fazer · 🔨 em construção · ✅ concluído · ⏸ bloqueado

## Marcos

- [ ] **R1 com Celso** — apresentação do produto designed e alinhamento de direção (material em `meetings/r1-celso/`)
- [ ] **Mockup M1** — fases 1-3 prontas (dados + navegação + dashboards)
- [ ] **R2 com Celso** — decisões pendentes + demo do M1
- [ ] **Mockup M2** — fases 4-5 prontas (handshake + perfis públicos)
- [ ] **Mockup M3** — fases 6-7 prontas (Consultoria + notificações)
- [ ] **Mockup completo** — pronto pra demo externa / iterar com fornecedores-beta

## Decisões pendentes — stack técnica

Precisam ser tomadas antes de qualquer trabalho de backend real. Não bloqueiam mockup.

| Decisão | Por que importa | Status |
| --- | --- | --- |
| Auth stack (NextAuth / Clerk / Supabase Auth / custom) | Login, convites, sessão, SSO | 📋 em aberto |
| Banco de dados (Postgres / Supabase / outro) | Toda a persistência | 📋 em aberto |
| Provider de email (Resend / SendGrid / SES / outro) | Convites, recuperação de senha, notificações transacionais | 📋 em aberto |
| Hosting (Vercel / Railway / outro) | Deploy, env vars, observabilidade | 📋 em aberto |

> **Multi-tenancy** não é decisão de stack — é decisão de produto, já modelada em `design/data-model.md` como `Organizacao` umbrella com perfis 1:1.

## Decisões pendentes — produto

Cada artefato de design carrega sua própria seção "Perguntas em aberto". Resumo do volume:

| Artefato | Qtde em aberto | Impacto típico |
| --- | --- | --- |
| `design/handshake-flow.md` | 0 (7 decididas) | — |
| `design/data-model.md` | ~7 | Slug de URL, storage de documentos, versionamento de candidatura, etc. |
| `design/info-architecture.md` | 0 (9 decididas) | — |
| `design/public-profiles.md` | 7 | SEO / denúncia / right-of-reply / filtros |
| `design/consulting-layer.md` | 7 | Auto-atribuição, success_fee no MVP, templates outreach, etc. |
| `design/notifications.md` | 8 | Provider de email, WhatsApp, digest, rate limit |

**Áreas macro pra Celso decidir na R2** (ver `meetings/r1-celso/one-pager.md`):

- Pricing dos 4 serviços de Consultoria
- Dimensões das avaliações (validar as 5+5 propostas)
- Tamanho inicial da equipe de advisors
- Nome do produto de Consultoria dentro do app

## Como usar este documento

- Uma fase muda de status → atualize a tabela + o campo "Última atualização".
- Uma nova fase aparece → provável sinal de que ela precisa de artefato de design próprio **antes**.
- Decisão de stack ou produto resolvida → riscar daqui + anotar a decisão no artefato de design correspondente.
- **Não duplique os checklists dos artefatos aqui.** Este doc é o mapa do território, não o território.

## Histórico

- `docs/archive/project-tracker-pre-redesign.md` — tracker antigo, baseado na visão original do produto (~75h de escopo). Preservado como referência histórica e apoio pra contextualizar Celso na R1.
