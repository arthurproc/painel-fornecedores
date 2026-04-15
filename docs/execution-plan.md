# Plano de Execução — Mockup ConectaFornece

> Plano formal de construção do mockup visual. Cada **unidade de execução** é uma rodada pequena, auto-contida, revisável e aprovável individualmente. Segue a espinha dorsal do `docs/roadmap.md` (7 fases) e usa os artefatos de `design/` como fonte de verdade.
>
> **Regra de ouro:** quando o código atual conflita com o design, o design ganha. O código em `src/` é ponto de partida visual e deve ser refatorado/deletado agressivamente ao longo das unidades.

**Última atualização:** 2026-04-15 (Fase 6 concluída; próxima fase = Notificações)
**Total de unidades:** 50, distribuídas em 8 fases
**Bootstrap de sessão:** `docs/session-bootstrap.md`

---

## Status geral (você está aqui)

> **Fonte única da verdade do progresso.** Atualize esta tabela ao começar (🔨) e ao finalizar (✅) cada unidade. Adicione notas curtas se algo ficou pendente ou merece decisão futura.

**Legenda:** 📋 a fazer · 🔨 em andamento · ✅ concluída · ⏸ bloqueada · ❌ cancelada

### Fase 1 — Data model

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U1.1 | Setup modular + enums | ✅ | — |
| U1.2 | `Organizacao` + `Membro` + seed dual-role | ✅ | — |
| U1.3 | `Empresa`/`Fornecedor` como perfis 1:1 | ✅ | — |
| U1.4 | Refactor `Projeto` | ✅ | — |
| U1.5 | `Candidatura` ≠ `Proposta` + `Contrato` | ✅ | Páginas consomem candidaturas; propostas formais exibidas só em U4.7+ |
| U1.6 | `Conversa` + `Mensagem` + `TemplatePergunta` | ✅ | — |
| U1.7 | `Review` + `ReputacaoAgregada` computada | ✅ | — |
| U1.8 | Camada Consultoria (Advisor + Sessao + EstudoDeCaso…) | ✅ | — |
| U1.9 | `Notificacao` + catálogo de triggers | ✅ | — |
| U1.10 | Helpers agregados + smoke test | ✅ | Reviews antigos extraídos das pages (`fornecedor/perfil`, `empresa/fornecedor/[id]`); bloco ficará vazio até Fase 5 renderizar reviews reais |

### Fase 2 — Navegação

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U2.1 | Topbar redesenhada | ✅ | Topbar com tenant ativo, switcher/label condicional, sino com badge mockado e dropdown de avatar |
| U2.2 | Switcher de contexto condicional | ✅ | `ContextSwitcher` criado com navegação para dashboards por contexto e persistência em memória do `ultimo_contexto_usado` |
| U2.3 | Sidebars por contexto (empresa/fornecedor/admin) | ✅ | Sidebars separadas com submenus colapsáveis e rotas stub "Em construção" para todos os links novos |
| U2.4 | Configurações da organização + pessoais | ✅ | Nova rota `/configuracoes` com abas contextuais + `/configuracoes/pessoal`; rotas legadas de membros redirecionam |

### Fase 3 — Dashboards

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U3.1 | Dashboard empresa | ✅ | Reescrito com 5 blocos fixos, saudação do membro logado e estados vazios por bloco |
| U3.2 | Dashboard fornecedor | ✅ | Reescrito com 6 blocos + `BannerConsultoria` contextual (`descarte_recente` / `projeto_alto_fit` / `default`) |
| U3.3 | Dashboard admin Consultoria | ✅ | Dashboard condicional owner/advisor + helper `isOwnerAdvisor` em `session.ts` + preview advisor em `/admin/dashboard?advisor=adv-ana` |

### Fase 4 — Handshake

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U4.1 | Descobrir projetos + filtros | ✅ | `FiltrosProjeto` + `FitScoreBadge`; ordenação por fit score; filtros de categoria/região/faixa/prazo |
| U4.2 | Página do projeto (fornecedor) | ✅ | `HeaderProjeto`, `BlocoCriterios`, `BlocoDocumentos`, hook fit, CTA 1 no rodapé; links de perfil apontam a `/perfil/empresa/[id]` (entra em U5.2) |
| U4.3 | Formulário de candidatura + CTA 1 | ✅ | 5 campos + nudge de faixa de preço + CTA 1 placeholder; submissão mock redireciona para Minhas candidaturas |
| U4.4 | Listas "Minhas candidaturas" + "Recebidas" | ✅ | Fornecedor por abas de status; empresa agrupada por projeto colapsável com link para triagem |
| U4.5 | Tela de triagem + modal descarte | ✅ | Cards com 5 elementos, shortlist/descarte client-side; modal enforça motivo; shortlist mostra banner de conversa criada |
| U4.6 | Conversa/Mensagens híbridas | ✅ | `MensagensView` compartilhada (empresa+fornecedor); drawer de templates + respostas inline; envio livre in-memory |
| U4.7 | Formulário de proposta formal + CTA 2 | ✅ | `/fornecedor/proposta/[candidaturaId]` com cronograma repetidor, docs mock, CTA 2; guard para status `shortlistada` |
| U4.8 | Comparação de propostas + seleção | ✅ | Tabela horizontal em `/empresa/projeto/[id]/propostas` com seleção → vencedora/perdedora client-side e banner de contrato criado |
| U4.9 | Contratos + encerramento | ✅ | 4 rotas (execução+histórico por contexto) + detalhe compartilhado `[id]`; encerrar exibido só em `em_execucao` para owner/admin; CTA "Avaliar parceiro" aparece após encerrar |
| U4.10 | Reviews + feedback pós-descarte + CTA 3 | ✅ | `/reviews` (abas pendentes/dadas/recebidas), `/reviews/novo/[ct]`, `/reviews/[id]`; feedback estruturado pós-descarte com CTA 3 exposto na aba Descartadas do fornecedor; rotas legadas `/empresa/reviews` e `/fornecedor/reviews` viraram redirects |

### Fase 4.5 — Saneamento pré-perfis

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U4.5.1 | Form `/empresa/novo-projeto` alinhado ao schema novo | ✅ | Single-form desktop; componente `FormularioProjeto` reaproveitável; ações "Salvar rascunho" + "Publicar projeto"; toast substituído por card de confirmação + redirect |
| U4.5.2 | Lista `/empresa/projetos` + detalhe `/empresa/projeto/[id]` pós-handshake | ✅ | Lista usa empresa da organização logada (sem `empresaId` chumbado); detalhe usa `HeaderProjeto`+blocos, CTAs contextuais por status (triagem/propostas/contrato); modal de fechamento e StarRating removidos |
| U4.5.3 | `/fornecedor/perfil` ligado ao fornecedor logado + dados reais | ✅ | Lê `getFornecedorByOrganizacao(membroLogado.organizacao_id)`; `projetosRealizados` literal removido; reputação agregada exibe por dimensão; link "Editar" → `/configuracoes` |
| U4.5.4 | Páginas legadas `/empresa/fornecedor/[id]` e `/fornecedor/empresa/[id]` | ✅ | **Rotas deletadas** em vez de stubbed — auditoria pós-execução confirmou que nenhum link interno apontava para elas desde o fim da Fase 4 (todos os "Ver perfil" já vão para `/perfil/...`). Decisão registrada em `docs/post-execution-review.md §1`. Se a revisão futura optar por voltar a perfis contextuais, recriar do zero |
| U4.5.5 | `/empresa/perfil-publico` stub coerente até Fase 5 | ✅ | Mensagem cita rota canônica futura `/perfil/empresa/[organizacao_id]`; botão "Ver esqueleto" pode 404 até U5.2 |
| U4.5.6 | Admin `/admin/usuarios` migrado para `Membro` | ✅ | Lista membros agrupados por `Organizacao` com roles canônicas (owner/admin/operador); seção separada para advisors (owner/advisor); filtros por role e tenant |
| U4.5.7 | Admin `/admin/organizacoes` ancorado em `Organizacao` canônica | ✅ | Lista vem de `organizacoes`; chips `perfil_empresa_ativo`/`perfil_fornecedor_ativo`/`linkage_publica`; dual-role explícito (ex.: Metalúrgica XYZ); contagens via `getContratosPorOrg` + `projetos.filter` |

### Fase 5 — Perfis públicos

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U5.1 | Componentes reutilizáveis de perfil | ✅ | 4 componentes em `src/components/profile/` — `ReputacaoAgregadaBloco` (full + compact + estado vazio), `ReviewCard`, `LinkageCruzada`, `MembroPopover`. `shadcn/popover` instalado |
| U5.2 | Perfil público de Empresa | ✅ | Rota `/perfil/empresa/[id]` pública (layout próprio sem AppShell) com header, sobre, reputação, estatísticas (publicados/encerrados/em execução/tempo médio pagamento), projetos ativos, histórico de contratos respeitando visibilidade por item, reviews recebidas, linkage cruzada. Seção "Equipe" **removida** na revisão de 2026-04-15 (risco LGPD/phishing sem payoff B2B) — `design/public-profiles.md` atualizado |
| U5.3 | Perfil público de Fornecedor | ✅ | Rota `/perfil/fornecedor/[id]` com atuação, certificações, estatísticas, contratos destacáveis (fallback para 4 encerrados quando `contratos_destacaveis_ids` vazio), reviews, linkage. Sem seção "Equipe" nem contagem de membros no header (mesma decisão de U5.2) |
| U5.4 | Página completa de reviews | ✅ | 2 rotas compartilhando `ReviewsPaginada` (client) — filtros dimensão/nota/período com fallback "desde sempre" sinalizado por badge; paginação client-side (5/pag) |
| U5.5 | Diretório de fornecedores (empresa) | ✅ | Reescrita de `src/app/empresa/diretorio/page.tsx` com `FiltrosFornecedor` (busca/categoria/região/certificação); grid de cards 3 colunas com `ReputacaoAgregada compact`; navega para `/perfil/fornecedor/[id]` |

### Fase 6 — Camada Consultoria

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U6.1 | Catálogo Consultoria (fornecedor) | ✅ | `/fornecedor/consultoria/catalogo` com 4 cards + bloco de estudos destacados; `CardServicoConsultoria` + `CardEstudoCaso` reutilizáveis |
| U6.2 | Página de produto + modal contratação | ✅ | `/fornecedor/consultoria/[tipo]` (SSG) com O-que-recebe/quando/casos/FAQ + `ModalContratacaoSessao` + `BotaoContratar`; CTA 1/2/3 no handshake abrem o modal pré-selecionado |
| U6.3 | Minhas sessões + entregáveis + avaliar | ✅ | Lista `/minhas-sessoes` por status + detalhe `[id]` com `CardSessao`, `MarkdownSimples`, comentários, marcar-útil, `ModalAvaliarAtendimento`, cancelamento |
| U6.4 | Admin: fila de sessões + atribuição | ✅ | `/admin/sessoes/solicitadas` com `CardSessaoAdmin` (sugestão por especialização+carga) + `ModalAtribuirAdvisor`; listas `minhas`/`em-andamento`/`entregues` reaproveitando `CardSessao` |
| U6.5 | Workspace de sessão (advisor) | ✅ | `/admin/sessoes/[id]` split contexto+workspace; `EditorNotas` com autosave fake + preview; estudos sugeridos por categoria/região; tipo/fase de entregável; "Marcar como entregue" habilita só com ≥1 entregável |
| U6.6 | Páginas owner (advisors/catálogo/templates) | ✅ | 3 rotas + helper `garantirOwner`; `?advisor=adv-ana` redireciona para `/admin/dashboard` (smoke 307); `/admin/templates-outreach` criada do zero (sem sidebar, linkado via outreach) |
| U6.7 | Estudos de caso (browser/leitura/wizard) | ✅ | `/consultoria/estudos` (browser com filtros) + `[id]` (leitura com anonimização); lista admin; wizard 4 passos em `/admin/estudos-de-caso/novo`; helper `criarEstudoDeCaso` |
| U6.8 | Outreach proativo | ✅ | `/admin/inteligencia/outreach-proativo` owner-only com leads computados (candidaturas descartadas ou shortlist pendente) + `CardLeadOutreach` + `ModalOfertaPersonalizada`; histórico de ofertas recentes |

### Fase 7 — Notificações

| ID | Unidade | Status | Notas |
| --- | --- | --- | --- |
| U7.1 | Drawer de notificações | 📋 | — |
| U7.2 | Página dedicada + filtros + bulk | 📋 | — |
| U7.3 | Preferências + auto-resolução | 📋 | — |

---

## Legenda de unidade

- **ID** `UX.Y` — fase X, unidade Y
- **Fonte:** caminho do(s) artefato(s) em `design/` e seções específicas
- **DoD (critério de aceitação):** lista checkável; unidade só fecha quando todos os itens marcam ✓

---

## Premissas herdadas dos designs e do AGENTS

Assumidas por todas as unidades — não precisam ser redecididas unidade a unidade:

1. **Mockup-only.** Zero backend, zero `fetch`, zero auth real. Dados em `src/lib/mock-data.ts` (e submódulos).
2. **Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, lucide-react, DM Sans/JetBrains Mono.** Respeitar `node_modules/next/dist/docs/` quando houver dúvida de API.
3. **UI em português brasileiro com acentuação.** Identificadores em inglês; chaves de objeto sem acento.
4. **Datas `DD/MM/YYYY`, dinheiro `R$ X.XXX,XX`, horizonte 2026.**
5. **Desktop-first.** Responsividade mobile fica fora do MVP.
6. **Documentos são metadata-only** no mockup (sem upload real; URLs fictícias). Decisão derivada da pergunta aberta #storage em `design/data-model.md §10`.
7. **Reputação agregada é computada on-the-fly** a partir das Reviews mockadas (sem cache persistido). Decisão derivada de §10.
8. **Nome do produto de Consultoria dentro do app = "Consultoria"** (placeholder até Celso decidir na R2). Fácil renomear via constante.
9. **Pricing dos 4 serviços** usa as faixas ilustrativas do `consulting-layer.md`. Celso valida na R2.
10. **Equipe de advisors inicial = Celso (owner) + 2 advisors** no mock (Ana Mendes, Bruno Lima). Substituível.

Quando uma unidade precisar de uma decisão de produto nova (não prevista pelos designs), ela **para e pergunta** — ver campo "Riscos / perguntas em aberto" de cada unidade.

---

## FASE 1 — Refactor do `mock-data.ts`

> Fonte de verdade: `design/data-model.md`. Objetivo: substituir o mock atual pelo modelo canônico, manter o mockup renderizável entre unidades reescrevendo páginas legadas quando elas quebrarem (ou introduzindo shims temporários).
>
> **Nota estrutural.** O `mock-data.ts` atual tem 630 linhas. Fase 1 modulariza para `src/lib/mock-data/` com um `index.ts` agregador, para manter unidades pequenas e diffs revisáveis. O path `src/lib/mock-data.ts` continua existindo (re-exporta de `./mock-data/`) para não quebrar imports até Fase 2.

### U1.1 — Setup da estrutura modular e enums compartilhados
- **Fase:** 1
- **Fonte:** `design/data-model.md §"Convenções"` + `§5 (máquinas de estado)`
- **Escopo — dentro:** criar `src/lib/mock-data/` com `index.ts` agregador, arquivo `_shared.ts` com tipos base (`Id`, `IsoDate`, enums `ProjetoStatus`, `CandidaturaStatus`, `PropostaStatus`, `ContratoStatus`, `ReviewStatus`, `SessaoConsultoriaStatus`, `Severidade`), converter `src/lib/mock-data.ts` em re-export barrel.
- **Fora:** criar entidades novas (vem nas próximas unidades); tocar em páginas.
- **Entregáveis:**
  - `src/lib/mock-data/_shared.ts` com 6 enums + tipos `Id`, `IsoDate`, `StatusLabel`, `StatusColor`
  - `src/lib/mock-data/index.ts` re-exportando tudo o que já existe hoje
  - `src/lib/mock-data.ts` reduzido a um `export * from "./mock-data";` (ou o arquivo é deletado e as páginas passam a importar do índice — avaliar qual quebra menos imports)
- **DoD:**
  - [ ] `npm run build` passa sem erro
  - [ ] Nenhuma página visual muda (smoke test: abrir `/empresa/dashboard`, `/fornecedor/dashboard`)
  - [ ] Todos os enums de status com união literal exportada
- **Dependências:** —
- **Riscos:** nenhum crítico. Cuidado para manter imports compatíveis.

### U1.2 — Entidade `Organizacao` + `Membro` + seed dual-role
- **Fase:** 1
- **Fonte:** `design/data-model.md §1 (atores e organizações)` + `§8 invariantes 11-13`
- **Escopo — dentro:** criar tipos `Organizacao`, `Membro`; tabela de organizações (≥8: 3 empresas anchor + 3 fornecedores + 1 dual-role + 1 tenant da Consultoria para testes) e membros (≥15 cobrindo owner/admin/operador); helpers `getOrganizacaoById`, `getMembrosByOrg`.
- **Fora:** perfis Empresa/Fornecedor ainda não referenciam `organizacao_id` (entra em U1.3); Advisor (entra em U1.8).
- **Entregáveis:**
  - `src/lib/mock-data/organizacoes.ts` com tipo `Organizacao` (incluindo `perfil_empresa_ativo`, `perfil_fornecedor_ativo`, `perfil_primeiro_escolhido`, `linkage_publica`, `slug?`)
  - `src/lib/mock-data/membros.ts` com tipo `Membro` (incluindo `role`, `ultimo_contexto_usado`, `telefone`, `preferencias_notificacao` placeholder)
  - Pelo menos uma org com `perfil_empresa_ativo = true && perfil_fornecedor_ativo = true` + `linkage_publica = true` (ex.: Metalúrgica XYZ)
  - Helpers em `index.ts`
- **DoD:**
  - [ ] Todas as 3 empresas atuais (Vale, Usiminas, ArcelorMittal) têm `Organizacao` correspondente
  - [ ] Pelo menos 3 fornecedores existentes têm `Organizacao` correspondente
  - [ ] 1 organização dual-role presente
  - [ ] 3 roles (`owner`, `admin`, `operador`) representados na lista de `Membro`
  - [ ] `npm run build` passa
- **Dependências:** U1.1
- **Riscos:** baixo. Nome "Metalúrgica XYZ" confirmado (decisão #1).

### U1.3 — Refactor `Empresa` e `Fornecedor` para perfis 1:1 de `Organizacao`
- **Fase:** 1
- **Fonte:** `design/data-model.md §1` + `§4 (ReputacaoAgregada)` + `§9 (mudanças no mock)`
- **Escopo — dentro:** Empresa e Fornecedor ganham `organizacao_id`; Fornecedor perde `avaliacao: number` e ganha `reputacao_agregada: ReputacaoAgregada`; ambos ganham `cidade`, `regioes_atendidas` (fornecedor), `contratos_destacaveis_ids` (fornecedor). Helper `computeReputacao(orgId, tipo)` esqueleto (retorna shape vazio por enquanto).
- **Fora:** reviews reais (entra em U1.7); preencher reputação com dados reais (retorna {media_geral: 0, ...} até U1.7).
- **Entregáveis:**
  - Tipos atualizados em `src/lib/mock-data/empresas.ts` e `src/lib/mock-data/fornecedores.ts`
  - Cada registro existente ganha `organizacao_id`, `cidade`
  - Fornecedores perdem `avaliacao` e ganham `reputacao_agregada` placeholder
  - Pelo menos 5 fornecedores no seed (expandir se <5)
  - Páginas que leem `Fornecedor.avaliacao` diretamente são migradas para `reputacao_agregada.media_geral` (com tratamento de `null/0` se sem reviews)
- **DoD:**
  - [ ] Toda `Empresa` tem `organizacao_id`
  - [ ] Toda `Fornecedor` tem `organizacao_id` + `reputacao_agregada`
  - [ ] Nenhum import de `Fornecedor.avaliacao` sobra no repo (`grep` limpo)
  - [ ] Páginas `/fornecedor/perfil`, `/empresa/fornecedor/[id]`, `/fornecedor/empresa/[id]` continuam renderizando sem erro (mesmo que conteúdo fique temporariamente sem nota — aceitável)
- **Dependências:** U1.2
- **Riscos:** possível quebra visual temporária onde "estrelas" dependiam do número; mitigar com placeholder "Sem avaliações ainda".

### U1.4 — Refactor `Projeto`: `empresa_id`, enum expandido, campos de handshake
- **Fase:** 1
- **Fonte:** `design/data-model.md §2 (Projeto)` + `§5` + `handshake-flow.md §"Fase 0"`
- **Escopo — dentro:** substituir `empresa: string` por `empresa_id`, remover `empresaLogo` (passa a derivar de Empresa), expandir `status` para `ProjetoStatus` (7 estados), adicionar `cidade`, `documentos_exigidos: DocumentoExigido[]`, `criterios_selecao: string[]`, `autor_membro_id`, `orcamento_min/orcamento_max?` opcionais coexistindo com `orcamento` (string range) para retrocompat. `interessados: number` removido, helper `candidaturasCountByProjeto` retorna 0 até U1.5.
- **Fora:** Candidaturas/Propostas reais.
- **Entregáveis:**
  - `src/lib/mock-data/projetos.ts` com tipo novo + registros migrados
  - Todas as páginas que usam `projeto.empresa` ou `projeto.empresaLogo` migradas para lookup via `getEmpresaById(empresa_id)` + derivação de logo
  - `statusLabels` e `statusColors` estendidos para 7 estados
- **DoD:**
  - [ ] Nenhum `Projeto.empresa` literal no TS (grep limpo)
  - [ ] Pelo menos 1 projeto em cada um dos 7 estados (`rascunho`, `publicado`, `em_triagem`, `em_propostas`, `fechado`, `cancelado`, `expirado`)
  - [ ] Páginas `/empresa/projetos`, `/empresa/projeto/[id]`, `/fornecedor/projetos`, `/fornecedor/projeto/[id]` renderizam
- **Dependências:** U1.2, U1.3
- **Riscos:** páginas de projeto atual mostram `fechamento.avaliacao` — esse subdoc é extraído em U1.5 (Contrato). Provavelmente precisa de shim temporário exibindo "Contrato encerrado (detalhes em construção)" até U1.5.

### U1.5 — Separar `Candidatura` ≠ `Proposta` + extrair `Contrato`
- **Fase:** 1
- **Fonte:** `design/data-model.md §2` + `handshake-flow.md §"Fase 1-3"` + `§5 máquinas de estado`
- **Escopo — dentro:** criar tipos `Candidatura`, `Proposta` (formal), `Contrato`; renomear a `Proposta` atual mockada para `Candidatura` onde semânticamente cabe (Fase 1), e criar propostas formais novas para cobrir Fase 3; extrair `Projeto.fechamento` para `Contrato` standalone; invariantes §8.2–§8.3 obedecidas no seed.
- **Fora:** Review (entra em U1.7); Conversa (U1.6).
- **Entregáveis:**
  - `src/lib/mock-data/candidaturas.ts`, `propostas.ts`, `contratos.ts`
  - Seed cobrindo: ≥1 candidatura em cada status (`rascunho`, `enviada`, `shortlistada`, `descartada`, `expirada`, `retirada`); ≥1 proposta em cada status (`rascunho`, `enviada`, `vencedora`, `perdedora`, `retirada`); ≥1 contrato em `em_execucao`, ≥1 em `encerrado` com reviews futuras, ≥1 em `cancelado`
  - `MotivoDescarte` catálogo (5 categorias) — pode morar em `src/lib/mock-data/catalogos.ts`
  - Remoção de `Projeto.fechamento`
- **DoD:**
  - [ ] Grep `Projeto.fechamento` não retorna resultados em TS
  - [ ] `Proposta.candidatura_id` sempre aponta para Candidatura `shortlistada` (invariante §8.2)
  - [ ] Contratos derivam de Propostas `vencedora` (invariante §8.3)
  - [ ] Páginas `/empresa/projeto/[id]`, `/fornecedor/projeto/[id]` renderizam (mesmo com UI temporariamente divergente do design — melhoria virá na Fase 4)
- **Dependências:** U1.4
- **Riscos:** o mock atual mistura Candidatura/Proposta em uma entidade só; migração precisa cuidado ao decidir qual registro vira o quê. Proponho: o que tem campos "mensagem + valor" fica como Candidatura; quem tem "status = aceita" vira Proposta `vencedora` com Contrato derivado.

### U1.6 — `Conversa`, `Mensagem`, `TemplatePergunta`
- **Fase:** 1
- **Fonte:** `design/data-model.md §3` + `handshake-flow.md §"Fase 2-3, mensagens"` + invariantes §8.4–§8.5
- **Escopo — dentro:** tipos + seed (≥3 conversas em `ativa`, ≥1 em `arquivada`, ≥1 em `encerrada`); mensagens cobrindo tipos `livre`, `template_pergunta`, `template_resposta`; `TemplatePergunta` catálogo com 8-10 templates.
- **Fora:** tela de chat (vem em U4.6).
- **Entregáveis:**
  - `src/lib/mock-data/conversas.ts`, `mensagens.ts`
  - `TemplatePergunta` em `catalogos.ts`
  - Todas as conversas têm `candidatura_id` de uma Candidatura `shortlistada` (ou histórica)
- **DoD:**
  - [ ] Toda Conversa tem ≥2 mensagens no seed
  - [ ] Pelo menos 1 `template_pergunta` com `template_resposta` correspondente
  - [ ] Invariante §8.4 respeitada: toda Candidatura `shortlistada` tem Conversa; descartadas têm conversa em `arquivada`
- **Dependências:** U1.5
- **Riscos:** pergunta aberta `TemplatePergunta gerenciado por admin ou por empresa?` (§10 data-model). Decisão MVP: **admin Consultoria gerencia** — centralizado. Registrar no plano; se Celso divergir, remaniamos.

### U1.7 — `Review`, `ReviewDimensao`, `ReputacaoAgregada` computada
- **Fase:** 1
- **Fonte:** `design/data-model.md §4` + `handshake-flow.md §"Mecânica de reviews"` + invariantes §8.6–§8.7
- **Escopo — dentro:** criar tipos + catálogo `ReviewDimensao` com as 10 dimensões (5 por lado); reviews no seed cobrindo `rascunho`, `submetida`, `liberada` (com release simultâneo + 14d); ativar o helper `computeReputacao` de verdade.
- **Fora:** página completa de reviews (vem na Fase 5).
- **Entregáveis:**
  - `src/lib/mock-data/reviews.ts`
  - `ReviewDimensao[]` em `catalogos.ts`
  - Helper `computeReputacao(orgId, tipo)` que retorna `ReputacaoAgregada` com `media_geral`, `total_reviews`, `por_dimensao` (média aritmética dos últimos 12 meses, fallback "desde sempre")
  - Reviews seed: ≥2 contratos encerrados com ambas reviews `liberada` (pares); ≥1 contrato com review `submetida` única aguardando o par; ≥1 com duas reviews em `rascunho`
- **DoD:**
  - [ ] `computeReputacao` chamado no render dos perfis devolve números coerentes (não-zero) para fornecedores com contratos encerrados
  - [ ] Invariante §8.6 respeitada: review só sai de `rascunho` quando contrato `encerrado`
  - [ ] Invariante §8.7 respeitada: release simultâneo mockado em `Contrato.reviews_liberadas_em`
- **Dependências:** U1.5
- **Riscos:** baixo.

### U1.8 — Camada Consultoria: `Advisor`, `CatalogoConsultoria`, `SessaoConsultoria`, `EstudoDeCaso`, `OfertaOutreach`
- **Fase:** 1
- **Fonte:** `design/data-model.md §1 (Advisor)` + `§7` + `design/consulting-layer.md §"Catálogo", §"Outcome tracking", §"Estudos de caso"`
- **Escopo — dentro:** tipos + seed completo. Equipe com Celso (owner) + 2 advisors; catálogo com 4 serviços (pricing conforme placeholder); sessões cobrindo todos os status; 2-3 estudos de caso publicados; 2-3 ofertas de outreach em status variados.
- **Fora:** telas da Consultoria (Fase 6).
- **Entregáveis:**
  - `src/lib/mock-data/consultoria.ts` (ou split em `advisors.ts`, `catalogo-consultoria.ts`, `sessoes-consultoria.ts`, `estudos-de-caso.ts`, `ofertas-outreach.ts` — split se crescer demais)
  - Pelo menos 1 `SessaoConsultoria` do tipo `acompanhamento_completo` vinculada a Candidatura + Proposta (invariante §8.10)
  - Pelo menos 1 sessão com `outcome` populado
- **DoD:**
  - [ ] Advisor com `role = owner` é Celso; outros dois têm `role = advisor`
  - [ ] Catálogo com 4 entradas ativas
  - [ ] `preco_snapshot` preenchido em todas as sessões seed
  - [ ] Invariante §8.10 respeitada no seed
- **Dependências:** U1.5, U1.6
- **Riscos:** baixo; pricing é placeholder explícito.

### U1.9 — `Notificacao` + `PreferenciasNotificacao` + catálogo de triggers
- **Fase:** 1
- **Fonte:** `design/data-model.md §7.5` + `design/notifications.md §"Catálogo de triggers"` + invariantes §8.16–§8.18
- **Escopo — dentro:** tipo `Notificacao`; seed cobrindo ≥1 notificação por severidade (crítica/importante/informativa); exemplos de agrupamento (`agrupamento_chave` + `agrupamento_count`); preferências default populadas em cada `Membro`; catálogo de tipos de trigger (string enum-like, não entidade própria) acessível via constante.
- **Fora:** drawer e páginas de notificação (Fase 7).
- **Entregáveis:**
  - `src/lib/mock-data/notificacoes.ts`
  - Constante `TRIGGER_CATALOG` com 40+ entradas (E1-E11, F1-F14, C1-C5, O1-O6, X1-X4) cada uma com `{ severidade, grupo_preferencia, agrupavel: boolean }`
  - Defaults de `PreferenciasNotificacao` aplicados a todos os membros seed
  - Helper `getNotificacoesPorMembro(id, { apenasNaoLidas? })`
- **DoD:**
  - [ ] Seed tem ≥3 notificações agrupadas (`agrupamento_count ≥ 2`)
  - [ ] Seed tem ≥2 notificações em cada severidade
  - [ ] Defaults respeitam §7.5 (críticas on, importantes mixed, informativas só in-app)
- **Dependências:** U1.2, U1.5, U1.8
- **Riscos:** volume de dados — cuidar para não inchar o arquivo; aceitável porque é mock.

### U1.10 — Helpers agregados, limpeza final e smoke test
- **Fase:** 1
- **Fonte:** `design/data-model.md §9` checklist completa
- **Escopo — dentro:** Centralizar helpers (`getProjetoById`, `getCandidaturasPorProjeto`, `getPropostasPorProjeto`, `getContratosPorOrg`, `getConversaByCandidatura`, `computeContagensProjeto`, etc.); remover campos legados (`interessados`, `avaliacao: number`, `empresa: string`) definitivamente; rodar `npm run build` e corrigir eventuais imports.
- **Fora:** qualquer UI nova.
- **Entregáveis:**
  - `src/lib/mock-data/helpers.ts`
  - `mock-data.ts` root é um re-export barrel limpo, sem tipos antigos
  - Comentário curto no `index.ts` listando helpers disponíveis
- **DoD:**
  - [ ] `grep -r "interessados"` só encontra usos novos (candidaturas_count etc.)
  - [ ] `npm run build` e `npm run lint` passam
  - [ ] Todas as páginas ainda renderizam; regressões visuais toleráveis se corrigidas nas fases 2-4
- **Dependências:** U1.1–U1.9
- **Riscos:** podem surgir referências legadas escondidas — rodar build é obrigatório.

---

## FASE 2 — Navegação (topbar, switcher, sidebars, configurações)

> Fonte de verdade: `design/info-architecture.md`. Objetivo: entregar a casca navegacional que todas as telas subsequentes vão habitar.

### U2.1 — Topbar redesenhada
- **Fase:** 2
- **Fonte:** `info-architecture.md §"Topbar"` + checklist
- **Escopo — dentro:** reescrever `Topbar.tsx` para conter logo + nome do tenant ativo + placeholder de switcher (vazio até U2.2) + placeholder do sino de notificações (contador mockado até Fase 7) + dropdown de avatar do membro (Meu perfil / Configurações pessoais / Sair). Sem busca global (decisão #3 do artefato).
- **Fora:** switcher funcional (U2.2); drawer de notificações (Fase 7); telas alvo dos links (Fase 7 / U2.4).
- **Entregáveis:**
  - `src/components/layout/topbar.tsx` reescrito
  - Placeholder de "membro logado" — constante `MEMBRO_LOGADO_ID` em `mock-data/_session.ts` (hack de sessão mockada)
- **DoD:**
  - [ ] Topbar renderiza em todas as páginas dentro do AppShell
  - [ ] Avatar abre dropdown shadcn com 3 itens
  - [ ] Sino mostra badge com contador (fake até Fase 7)
  - [ ] Tipografia + spacing conformes `visual-identity`
- **Dependências:** U1.2, U1.10
- **Riscos:** baixo.

### U2.2 — Switcher de contexto condicional
- **Fase:** 2
- **Fonte:** `info-architecture.md §"Switcher de contexto"` + decisão #1
- **Escopo — dentro:** componente `ContextSwitcher` que lê a `Organizacao` do membro logado e renderiza dropdown se ≥2 perfis ativos; click muda o contexto ativo (atualiza `MEMBRO_LOGADO.ultimo_contexto_usado` em memória + navega para o dashboard do novo contexto); esconde se single-side.
- **Fora:** navegação para Configurações da organização (link aponta pra rota stub até U2.4).
- **Entregáveis:**
  - `src/components/layout/context-switcher.tsx`
  - Hook `useContextoAtivo()` em `src/lib/session.ts` (ou similar) — retorna `"empresa" | "fornecedor" | "admin"`
- **DoD:**
  - [ ] Switcher aparece só para membros de tenants dual-role
  - [ ] Click navega para `/empresa/dashboard` ou `/fornecedor/dashboard` conforme escolha
  - [ ] Ao escolher, sidebar correspondente carrega (mesmo comportamento de antes)
- **Dependências:** U2.1
- **Riscos:** baixo. Contexto ativo mora em `session.ts` (módulo singleton em memória, conforme decisão #4).

### U2.3 — Sidebars por contexto (empresa, fornecedor, admin Consultoria)
- **Fase:** 2
- **Fonte:** `info-architecture.md §"Sidebar"` de cada contexto + checklist (3 sidebars)
- **Escopo — dentro:** reescrever `sidebar.tsx` para renderizar 3 variantes completas. Empresa: 8 itens (Início, Projetos [submenu: Meus / Novo], Candidaturas recebidas, Contratos [submenu], Mensagens, Diretório, Reviews, Perfil público, Configurações). Fornecedor: 9 itens (Início, Descobrir projetos, Minhas candidaturas, Propostas formais, Contratos, Mensagens, Consultoria [submenu: Catálogo / Minhas sessões], Reviews, Perfil público, Configurações). Admin: 6 itens (Início, Sessões [submenu 4], Advisors, Catálogo de serviços, Estudos de caso, Inteligência [submenu], Organizações, Configurações).
- **Fora:** as rotas-alvo — muitas ainda não existem; links apontam para rotas stub (`<Link href="/empresa/candidaturas">` vai para página 404 ou placeholder). Criar placeholders genéricos "Em construção" para rotas que não existirão até suas fases próprias.
- **Entregáveis:**
  - `sidebar.tsx` com branch por `tipo`
  - Placeholders em todas as rotas novas referenciadas (arquivos `page.tsx` mínimos com `<AppShell>...<h1>Em construção</h1></AppShell>`)
  - AppShell aceita `tipo="admin"` (já aceita; confirmar)
- **DoD:**
  - [ ] Sidebar empresa/fornecedor/admin renderiza com os números exatos de itens acima
  - [ ] Nenhum link quebra (todos têm destino mesmo que stub)
  - [ ] Subitens (Projetos, Contratos, Consultoria, Sessões, Inteligência) abrem/colapsam
  - [ ] Item ativo destacado via `usePathname`
- **Dependências:** U2.1, U2.2
- **Riscos:** muitas rotas novas — cuidado com consistência de naming (ver próximo item "Rotas criadas" logo abaixo).

### U2.4 — Configurações da organização (5 abas) + Configurações pessoais
- **Fase:** 2
- **Fonte:** `info-architecture.md §"Configurações da organização"` + decisão #5
- **Escopo — dentro:** rota `/configuracoes` (compartilhada entre contextos, contexto-aware): abas Organização / Membros / Perfil Empresa* / Perfil Fornecedor* / Faturamento (desabilitada com badge "Em breve"). Abas de perfis condicionais à ativação. Cada aba é um formulário read-only com os dados atuais do tenant. Rota `/configuracoes/pessoal` separada para configurações pessoais (avatar, preferências, 2FA placeholder).
- **Fora:** edição real (tudo read-only no mockup); preferências de notificação (vai para Fase 7 como sub-aba de Configurações pessoais).
- **Entregáveis:**
  - `src/app/configuracoes/page.tsx` com `<Tabs>` do shadcn
  - Sub-arquivos ou segments por aba conforme crescer
  - `src/app/configuracoes/pessoal/page.tsx`
  - Migrar `/empresa/configuracoes/membros` e `/fornecedor/configuracoes/membros` atuais para a nova tela unificada (deletar os antigos)
- **DoD:**
  - [ ] Tenant single-side não vê abas de perfis não-ativadas
  - [ ] Aba "Faturamento" aparece desabilitada com tooltip
  - [ ] Linkage pública mostrada como toggle read-only na aba Organização
  - [ ] `/empresa/configuracoes/membros` e `/fornecedor/configuracoes/membros` removidas ou redirecionam
- **Dependências:** U2.3
- **Riscos:** rota `/configuracoes` compartilhada — checar se `AppShell` recebe `tipo` dinamicamente baseado no contexto ativo.

---

## FASE 3 — Dashboards

> Fonte: `design/info-architecture.md §"Dashboard"` de cada contexto.

### U3.1 — Dashboard empresa (5 blocos)
- **Fase:** 3
- **Fonte:** `info-architecture.md §"Contexto: Empresa → Dashboard"`
- **Escopo — dentro:** reescrever `/empresa/dashboard` com saudação + 5 blocos: Triagem pendente, Reviews pendentes, Projetos ativos, Contratos em execução, Mensagens. Estados vazios conforme tabela do artefato.
- **Fora:** navegação para telas-alvo (continuam em stub até Fase 4).
- **Entregáveis:**
  - `src/app/empresa/dashboard/page.tsx` reescrito
  - Reuso de `Card` do shadcn + `Badge` por severidade
- **DoD:**
  - [ ] 5 blocos exatos conforme layout do artefato
  - [ ] Saudação usa nome do membro logado
  - [ ] Estado vazio em cada bloco mockado com 1 organização seed diferente para visualizar
  - [ ] Quality check visual-identity passa (tokens OKLCH, spacing, tipografia)
- **Dependências:** U2.3, U1.10
- **Riscos:** baixo.

### U3.2 — Dashboard fornecedor (5+ blocos com banner Consultoria contextual)
- **Fase:** 3
- **Fonte:** `info-architecture.md §"Contexto: Fornecedor → Dashboard"` + `§"Pontos de entrada da Consultoria" #2`
- **Escopo — dentro:** Propostas a enviar, Banner Consultoria contextual (descarte recente / projeto de alto fit / default), Minhas candidaturas, Projetos recomendados, Contratos em execução, Mensagens.
- **Fora:** booking real da Consultoria (Fase 6); cálculo de fit score real (usar valor mockado no seed de U1.4).
- **Entregáveis:**
  - `src/app/fornecedor/dashboard/page.tsx` reescrito
  - Componente `BannerConsultoria` que recebe `estado: "descarte_recente" | "projeto_alto_fit" | "default"` e renderiza mensagem+CTA correspondente
- **DoD:**
  - [ ] 6 blocos renderizando
  - [ ] Banner muda com base em dados reais do fornecedor logado (ex.: se tem candidatura descartada nos últimos 14d, mostra variante descarte)
  - [ ] Estados vazios tratados
- **Dependências:** U3.1 (reuso de padrões), U1.10
- **Riscos:** banner contextual — começar com 3 variantes; Arthur valida se quer mais.

### U3.3 — Dashboard admin Consultoria (4 blocos, condicional por role)
- **Fase:** 3
- **Fonte:** `info-architecture.md §"Contexto: Admin Consultoria"` + decisão #7 + `consulting-layer.md §"Dashboard pessoal do advisor"`
- **Escopo — dentro:** Fila de atribuição, Carga da equipe, Outreach proativo (owner-only), Métricas do mês (owner-only). Para `role = advisor`, substitui últimos dois por: Suas sessões em andamento, Suas avaliações.
- **Fora:** páginas-alvo (Fase 6).
- **Entregáveis:**
  - `src/app/admin/dashboard/page.tsx` reescrito
  - Função `isOwnerAdvisor(membroLogado)` em `session.ts`
- **DoD:**
  - [ ] Com membro logado = Celso (owner), mostra 4 blocos incluindo Outreach + Métricas
  - [ ] Com membro logado = Ana (advisor), substitui blocos de owner por versões pessoais
  - [ ] Switcher de contexto mostra opção "Admin Consultoria" apenas para advisors
- **Dependências:** U2.3, U3.1, U1.8
- **Riscos:** precisa mecânica mínima de "entrar no contexto admin" — o switcher tem uma opção extra para advisors. Definir como: `session.ts` sabe se o membro logado é advisor via `Advisor` table lookup.

---

## FASE 4 — Telas do handshake

> Fonte: `design/handshake-flow.md` + `design/data-model.md` + seções de `info-architecture.md`.

### U4.1 — Página "Descobrir projetos" (fornecedor) com filtros e fit score
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 0 — Descoberta"` + `info-architecture.md §"Sidebar fornecedor"`
- **Escopo — dentro:** lista de `Projeto` com `status ∈ {publicado, em_triagem}`, cards com logo da empresa, título, categoria, região/cidade, faixa de orçamento, prazo, fit score (mockado), CTA "Ver projeto". Filtros: categoria, região, faixa de valor, prazo.
- **Fora:** página do projeto (U4.2).
- **Entregáveis:**
  - `src/app/fornecedor/projetos/page.tsx` reescrita (substitui a atual)
  - Componente `FiltrosProjeto` em `src/components/handshake/filtros-projeto.tsx`
- **DoD:**
  - [ ] Filtros aplicam em tempo real (client-side)
  - [ ] Estado vazio "Nenhum projeto encontrado"
  - [ ] Fit score exibido com hook "entender por que meu fit é X%"
- **Dependências:** U1.10
- **Riscos:** fit score — mockado no seed; nenhum cálculo real.

### U4.2 — Página do projeto (contexto fornecedor) + perfil da empresa clicável
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 0"` + `info-architecture.md §"Pontos de entrada da Consultoria"` #3
- **Escopo — dentro:** `/fornecedor/projeto/[id]` com header (empresa clicável → perfil público em U5.2), descrição completa, documentos exigidos, critérios, faixa de orçamento, prazo, fit score + hook Consultoria, CTA "Candidatar-se" (leva ao U4.3).
- **Fora:** formulário de candidatura (U4.3); perfil público da empresa (U5.2 — link quebrado OK até lá).
- **Entregáveis:** reescrita da rota; componente `HeaderProjeto`, `BlocoCriterios`, `BlocoDocumentos`.
- **DoD:**
  - [ ] Layout conforme design
  - [ ] CTA primário "Candidatar-se"; CTA secundário discreto "Ver perfil da empresa"
  - [ ] Hook de fit score abre tooltip com texto "Por que meu fit é X?"
- **Dependências:** U4.1
- **Riscos:** baixo.

### U4.3 — Formulário de candidatura com CTA 1 Consultoria
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 1"` + checklist + `consulting-layer.md §"Fluxo de compra"`
- **Escopo — dentro:** rota `/fornecedor/projeto/[id]/candidatar`. Campos: pitch (textarea ~500c), seleção de contratos destacáveis (lê do perfil), capacidade declarada, faixa de preço opcional (com nudge), certificações aplicáveis. CTA 1 de Consultoria ao lado do botão "Enviar candidatura" (abre modal placeholder até U6.2).
- **Fora:** submissão real; editar candidatura depois (mostra só nota).
- **Entregáveis:**
  - `src/app/fornecedor/projeto/[id]/candidatar/page.tsx`
  - `src/components/handshake/formulario-candidatura.tsx`
  - Componente `CTAConsultoria` reaproveitável
- **DoD:**
  - [ ] Todos os 5 campos presentes com labels corretos
  - [ ] Nudge visível se faixa de preço vazia
  - [ ] CTA 1 abre modal "Em construção" até U6.2
  - [ ] Botão "Enviar candidatura" é mock (toast de sucesso + redirect para Minhas candidaturas)
- **Dependências:** U4.2, U1.5
- **Riscos:** nudge — copy precisa ser aprovada; proposta: "Candidaturas que declaram faixa de preço têm mais chance de avançar."

### U4.4 — Listas "Minhas candidaturas" (fornecedor) e "Candidaturas recebidas" (empresa)
- **Fase:** 4
- **Fonte:** `info-architecture.md §"Sidebar"` de cada contexto
- **Escopo — dentro:** duas rotas espelhadas com layouts distintos. Fornecedor: `/fornecedor/candidaturas` — lista por status (tabs/filters), cada card com projeto + empresa + data + status. Empresa: `/empresa/candidaturas` — agrupadas por projeto, cada grupo colapsável.
- **Fora:** triagem action (U4.5).
- **Entregáveis:** 2 rotas + páginas; componente `CardCandidatura`.
- **DoD:**
  - [ ] Fornecedor vê apenas suas candidaturas; empresa vê apenas as dos seus projetos
  - [ ] Filtro por status presente em ambos
  - [ ] Link para detalhe de cada candidatura (mesmo que seja só um drawer/modal read-only nesta unidade)
- **Dependências:** U1.5, U2.3
- **Riscos:** baixo.

### U4.5 — Tela de triagem (empresa) com modal de descarte
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 2"` + checklist + decisão #1 (edição)
- **Escopo — dentro:** `/empresa/projeto/[id]/triagem` — grid de cards de Candidatura com pitch, fit score, reputação, contratos destacados, faixa de preço. Ações: "Shortlist" (vira `shortlistada` + cria Conversa mock) e "Descartar com motivo" (modal com combo de `MotivoDescarte` + comentário opcional).
- **Fora:** chat (U4.6); proposta formal (U4.7).
- **Entregáveis:**
  - Nova rota
  - Componente `CardCandidaturaTriagem`
  - `ModalDescarte`
- **DoD:**
  - [ ] Cards mostram os 5 elementos do design
  - [ ] Ação "Shortlist" atualiza estado in-memory e redireciona para aba correspondente
  - [ ] Modal de descarte enforça motivo selecionado; comentário é opcional
  - [ ] Auto-criação de Conversa mockada na ação shortlist (apenas no estado client-side)
- **Dependências:** U4.4, U1.6
- **Riscos:** mutação do mock em memória — acomodável com `useState` local + funções puras; não persiste entre reloads (aceitável no mockup).

### U4.6 — Conversa/Mensagens (empresa + fornecedor) com chat híbrido
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 2-3"` + decisão #5 (híbrido)
- **Escopo — dentro:** `/empresa/mensagens` e `/fornecedor/mensagens` (ou rota única contextual `/mensagens`); lista de conversas à esquerda + thread à direita; drawer de templates estruturados (abre com botão "Usar template").
- **Fora:** real-time; notificações (Fase 7).
- **Entregáveis:**
  - Rota(s) + componentes `ListaConversas`, `ThreadMensagens`, `DrawerTemplates`
  - Envio de mensagem gera novo item em `useState` (não persiste)
- **DoD:**
  - [ ] Chat livre funciona client-side
  - [ ] Drawer de templates lista os 8-10 do seed
  - [ ] Selecionar um template preenche a composer com a pergunta
  - [ ] Resposta a um `template_pergunta` vira `template_resposta` e inline abaixo
- **Dependências:** U4.5, U1.6
- **Riscos:** UX do template híbrido — seguir a decisão #5 do handshake.

### U4.7 — Formulário de proposta formal + CTA 2
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 3"` + checklist
- **Escopo — dentro:** `/fornecedor/proposta/[id]` (onde `id` é da Candidatura `shortlistada`). Campos: escopo detalhado, cronograma em etapas (repetidor), preço final, prazo de entrega, documentos anexos (metadata-only), observações. CTA 2 Consultoria ao lado do botão enviar.
- **Fora:** sessão real de Consultoria (U6.2).
- **Entregáveis:** rota + componentes `FormularioProposta`, `EtapasCronograma`.
- **DoD:**
  - [ ] Cronograma permite adicionar/remover etapas
  - [ ] Upload de documento é mock (só nome e metadata — sem arquivo real)
  - [ ] CTA 2 abre modal placeholder
- **Dependências:** U4.5, U1.5
- **Riscos:** baixo.

### U4.8 — Comparação de propostas lado-a-lado (empresa) + seleção de vencedor
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 3 final"` + checklist
- **Escopo — dentro:** `/empresa/projeto/[id]/propostas` — tabela horizontal com propostas recebidas em colunas, linhas sendo os atributos (preço final, prazo, etapas, documentos). Ação "Selecionar vencedora" abre modal de confirmação + cria Contrato mock.
- **Fora:** execução do contrato (U4.9).
- **Entregáveis:** rota + `TabelaComparacao`, `ModalSelecaoVencedor`.
- **DoD:**
  - [ ] Mostra todas as propostas de um projeto lado-a-lado
  - [ ] Selecionar vencedora marca outras como `perdedora` e cria Contrato (state client-side)
- **Dependências:** U4.7
- **Riscos:** baixo.

### U4.9 — Contratos (em execução + histórico) + encerramento
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Fase 4"` + `info-architecture.md §"Sidebar"`
- **Escopo — dentro:** rotas `/empresa/contratos` e `/fornecedor/contratos` (sub-abas Em execução / Histórico). Página de detalhe `[id]` comum com header + cronograma + documentos + CTA "Marcar como encerrado" (se `em_execucao`). Encerrar muda status + dispara reviews (abre U4.10 a partir do fornecedor/empresa).
- **Fora:** reviews (U4.10).
- **Entregáveis:**
  - Rotas + página de detalhe
  - Componente `HeaderContrato`
- **DoD:**
  - [ ] 4 rotas (2 listas + 1 detalhe × 2 contextos ou 1 detalhe compartilhado contexto-aware)
  - [ ] Botão encerrar só visível em `em_execucao` + para `owner`/`admin`
  - [ ] Após encerrar, aparece CTA "Avaliar parceiro" (vai a U4.10)
- **Dependências:** U4.8
- **Riscos:** baixo.

### U4.10 — Formulário de review + visão "aguardando par / liberada" + feedback pós-descarte CTA 3
- **Fase:** 4
- **Fonte:** `handshake-flow.md §"Mecânica de reviews"` + `§"Fase 2"` feedback estruturado
- **Escopo — dentro:** rota `/reviews/novo/[contratoId]` com formulário de review (dimensões conforme `ReviewDimensao` por lado). Rota `/reviews/[id]` mostrando status "aguardando par" vs "liberada". Rota `/reviews` lista (dadas + pendentes + recebidas). Na tela da Candidatura descartada (empresa ou fornecedor), mostrar motivo estruturado + CTA 3 inline.
- **Fora:** página pública de reviews na org (Fase 5).
- **Entregáveis:** 3 rotas + componente `FormularioReview`, `ReviewPendente`, `FeedbackPosDescarte`.
- **DoD:**
  - [ ] Formulário renderiza dimensões certas por lado (empresa vs fornecedor)
  - [ ] Após submissão, tela do autor mostra "aguardando contraparte" até o par submeter
  - [ ] Quando o par submete, ambos liberam simultaneamente
  - [ ] Feedback pós-descarte mostra `motivo_descarte.categoria` + comentário + CTA 3 Consultoria
- **Dependências:** U4.9, U4.5, U1.7
- **Riscos:** lógica de release simultâneo — mockar com flag no seed + botão "simular submissão do par" para demo.

---

## FASE 4.5 — Saneamento pré-perfis

> **Por que existe:** a Fase 1 modularizou o schema e renomeou/dividiu entidades; a Fase 4 reconstruiu todo o handshake por cima do schema novo. Restaram telas legadas que ainda lêem `projeto.empresa` como string, `fornecedor.avaliacao` numérico, dados chumbados de fornecedor ou que duplicam fluxos agora cobertos por rotas da Fase 4. Esta fase limpa essa dívida antes da Fase 5 (perfis públicos) para evitar conflitos visuais e de rota.
>
> **Princípio:** cada unidade é pequena e não introduz funcionalidade nova — apenas realinha código existente ao schema canônico ou transforma pedaços obsoletos em stubs coerentes apontando para a fase correta. Se algum item puder ser *deletado* em vez de refatorado, prefira deletar.
>
> **Fonte cruzada:** achados derivados de auditoria automática no fim da Fase 4 + confronto com `design/data-model.md §9 (mudanças no mock)` e plano original.

### U4.5.1 — Form `/empresa/novo-projeto` alinhado ao schema `Projeto`
- **Fase:** 4.5
- **Fonte:** `design/data-model.md §2 (Projeto)` + `design/handshake-flow.md §"Fase 0 — Descoberta"`
- **Escopo — dentro:** reescrever `src/app/empresa/novo-projeto/page.tsx` para coletar os campos canônicos. Em um único formulário (desktop-first): `titulo`, `descricao`, `categoria` (select de `platform-data.ts`), `regiao` + `cidade` (cidade texto livre ou dependente da região), `orcamento_min/orcamento_max` (dois inputs de valor + preview da string `orcamento` derivada), `prazo` (DD/MM/YYYY), `criterios_selecao` (lista editável tipo "tags + input"), `documentos_exigidos` (repeater com `nome`, toggle `obrigatorio`, `observacao`), `requisitos` (lista livre). `autor_membro_id` vem do membro logado; `empresa_id` vem da empresa ativa; `status` inicial = `rascunho` com ação secundária "Publicar" → `publicado`.
- **Fora:** persistência real (continua mock); fluxo de edição (`/empresa/projeto/[id]/editar` fora desta unidade); upload real de documentos.
- **Entregáveis:**
  - Reescrita da rota `src/app/empresa/novo-projeto/page.tsx`
  - Componente `src/components/empresa/formulario-projeto.tsx` reaproveitável (será pivô de uma futura edição)
  - Reaproveitar `FiltrosProjeto` tokens/OKLCH — sem novo design
- **DoD:**
  - [ ] Form preenche todos os campos de `Projeto` novos (listados acima) sem usar `empresa` string ou `empresaLogo`
  - [ ] Submissão exibe toast "Projeto publicado em rascunho (mock)" e redireciona para `/empresa/projetos`
  - [ ] Nenhuma menção a "interessados" ou `avaliacao` numérica
  - [ ] `npm run build` passa
- **Dependências:** —
- **Riscos:** baixo. Decisão aberta: onde exibir `cidade` vs `regiao` (sugestão: dois campos independentes, região select + cidade input livre).

### U4.5.2 — `/empresa/projetos` + `/empresa/projeto/[id]` pós-handshake
- **Fase:** 4.5
- **Fonte:** `handshake-flow.md` + Fase 4 recém-concluída
- **Escopo — dentro:**
  - `/empresa/projetos`: substituir `const empresaId = "vale"` hardcoded por `MEMBRO_LOGADO_ID` + `getEmpresaByOrganizacao(organizacao_id)`. Mostrar estado vazio coerente quando a empresa logada (ex.: Metalúrgica XYZ) não tem projetos.
  - `/empresa/projeto/[id]`: simplificar para **detalhe + navegação**. Header do projeto (reusar `HeaderProjeto` de `src/components/handshake/`), blocos de descrição/critérios/documentos, e ações contextuais baseadas em `status`: CTA "Ver triagem" (publicado/em_triagem), "Comparar propostas" (em_propostas), "Ver contrato" (fechado com `contrato_id`), "Editar rascunho" (rascunho). Remover: modal de "Selecionar fornecedor", `StarRating` inline, modal de "Fechar contrato" com visibilidade+avaliação (fluxo agora vive em U4.8 e U4.9).
- **Fora:** página de edição de projeto (backlog fora do MVP).
- **Entregáveis:**
  - Reescrita de `src/app/empresa/projetos/page.tsx`
  - Reescrita enxuta de `src/app/empresa/projeto/[id]/page.tsx`
- **DoD:**
  - [ ] Dashboard mostra projetos da empresa logada (sem `empresaId` chumbado)
  - [ ] Detalhe do projeto não contém mais modal de fechamento de contrato ou StarRating
  - [ ] Ações do detalhe vão para as rotas corretas da Fase 4
- **Dependências:** U4.5, U4.8, U4.9
- **Riscos:** baixo — código removido > código adicionado.

### U4.5.3 — `/fornecedor/perfil` lendo fornecedor logado + sem dados chumbados
- **Fase:** 4.5
- **Fonte:** `design/data-model.md §1` + decisão futura de U5.3 (perfil próprio vs público)
- **Escopo — dentro:** substituir `const fornecedor = fornecedores[0]` por `getFornecedorByOrganizacao(membroLogado.organizacao_id)`; remover array hardcoded `projetosRealizados`; se houver reputação, usar `fornecedor.reputacao_agregada`. Manter página como **"meu perfil do fornecedor" em modo leitura + link "Editar em Configurações"** (U2.4 já tem abas de perfil em `/configuracoes`). Estado vazio explícito se organização logada não tem perfil fornecedor ativo.
- **Fora:** perfil público (entra em U5.3); edição (já coberta em Configurações).
- **Entregáveis:** reescrita de `src/app/fornecedor/perfil/page.tsx`
- **DoD:**
  - [ ] Nenhum `fornecedores[0]` ou `projetosRealizados` literal na página
  - [ ] Página mostra dados do fornecedor da organização logada (ou estado vazio coerente)
  - [ ] Link "Editar" aponta para `/configuracoes` aba Perfil Fornecedor
- **Dependências:** U2.4
- **Riscos:** baixo.

### U4.5.4 — Páginas legadas `/empresa/fornecedor/[id]` e `/fornecedor/empresa/[id]` viram stubs de redirect
- **Fase:** 4.5
- **Fonte:** decisão registrada em U5.3 (rotas serão substituídas por `/perfil/...`)
- **Escopo — dentro:** transformar as duas rotas em stubs mínimos que:
  1. Redirecionam para a rota equivalente de perfil público se ela já existir (graceful futura).
  2. Até lá, renderizam `<EmConstrucao />` apontando explicitamente "Esta página será substituída por `/perfil/{empresa|fornecedor}/[id]` na Fase 5". Remover os mapas hardcoded `projetosPorFornecedor`, `taxaSucessoPorFornecedor`.
- **Fora:** o perfil público em si (U5.2/U5.3).
- **Entregáveis:**
  - `src/app/empresa/fornecedor/[id]/page.tsx` → stub curto
  - `src/app/fornecedor/empresa/[id]/page.tsx` → stub curto (se também desalinhado; validar na execução)
- **DoD:**
  - [ ] Zero dados chumbados nessas duas rotas
  - [ ] Nenhum import de array mockado fora dos helpers canônicos
  - [ ] Links internos do app que hoje apontam para essas rotas seguem funcionando (mostram stub) até U5.2/U5.3 assumirem
- **Dependências:** —
- **Riscos:** baixo. Cuidar de não quebrar `Link`s existentes (triagem, empresa/projeto etc.) — manter as rotas responsivas.

### U4.5.5 — `/empresa/perfil-publico` stub coerente e linkado
- **Fase:** 4.5
- **Fonte:** U5.2 (perfil público de Empresa)
- **Escopo — dentro:** a página já é stub de "Em construção" — apenas ajustar a mensagem para citar explicitamente que o perfil público será construído em `/perfil/empresa/[id]` na Fase 5 e inserir um link "Ver esqueleto" apontando para essa URL (mesmo que 404 hoje — documentar). Garantir que não haja nenhum import legado "quebrável".
- **Fora:** implementação real (U5.2).
- **Entregáveis:** ajuste cosmético em `src/app/empresa/perfil-publico/page.tsx`.
- **DoD:**
  - [ ] Stub menciona rota futura
  - [ ] Nenhum import desnecessário
- **Dependências:** —
- **Riscos:** trivial.

### U4.5.6 — `/admin/usuarios` migrado para `Membro`
- **Fase:** 4.5
- **Fonte:** `design/data-model.md §1 (Organizacao + Membro)`
- **Escopo — dentro:** página hoje usa um tipo `Usuario` inventado com roles `admin_plataforma/gestor/visualizador` — conflitante com `Membro.role ∈ {owner, admin, operador}` + `Advisor.role ∈ {owner, advisor}`. Reescrever para listar `membros` da plataforma toda, agrupados por `Organizacao`, mostrando role canônica. Advisors aparecem em seção à parte (dataset `advisors` já existe). Sem edição — apenas leitura.
- **Fora:** convites, auditoria, bloqueio — fora do MVP.
- **Entregáveis:** reescrita de `src/app/admin/usuarios/page.tsx`.
- **DoD:**
  - [ ] Zero referências a `admin_plataforma/gestor/visualizador`
  - [ ] Tabela/lista agrupa por `Organizacao` usando o nome canônico
  - [ ] Filtros simples por role e por tenant
- **Dependências:** U1.2
- **Riscos:** baixo.

### U4.5.7 — `/admin/organizacoes` ancorado em `Organizacao`
- **Fase:** 4.5
- **Fonte:** `design/data-model.md §1` + `§8 invariantes`
- **Escopo — dentro:** hoje a página lista `empresas` e `fornecedores` via Tabs — mas a verdade canônica agora é `organizacoes`, com perfis *empresa* e *fornecedor* como flags. Reescrever para listar `Organizacao` com chips mostrando `perfil_empresa_ativo`/`perfil_fornecedor_ativo`, `linkage_publica`, contagem de membros e status `ativo`. Mostrar casos dual-role (ex.: Metalúrgica XYZ) de forma explícita.
- **Fora:** ativar/desativar perfis (operação de owner); edição.
- **Entregáveis:** reescrita de `src/app/admin/organizacoes/page.tsx`.
- **DoD:**
  - [ ] Lista vem de `organizacoes`, não de `empresas`/`fornecedores` diretamente
  - [ ] Dual-role visível
  - [ ] Contagens de projetos/contratos por organização usam helpers canônicos
- **Dependências:** U1.2
- **Riscos:** baixo.

---

## FASE 5 — Perfis públicos

> Fonte: `design/public-profiles.md`. Dependência-chave: entidades da Fase 1 + componentes da Fase 3.

### U5.1 — Componentes reutilizáveis: ReputacaoAgregada, ReviewCard, LinkageCruzada, popover de membro
- **Fase:** 5
- **Fonte:** `public-profiles.md §"Componente: ..."`
- **Escopo — dentro:** 4 componentes shareáveis em `src/components/profile/`.
- **Fora:** páginas de perfil (U5.2, U5.3).
- **Entregáveis:**
  - `reputacao-agregada.tsx` (estrelas + barras por dimensão + contagem + estado vazio)
  - `review-card.tsx` (avatar + autor + notas + comentário + data + link contrato)
  - `linkage-cruzada.tsx` (variante empresa e fornecedor)
  - `membro-popover.tsx` (popover shadcn com nome + cargo + foto)
- **DoD:**
  - [ ] Cada componente testado visualmente em uma rota de demo temporária (ou Storybook-lite via `/design-system`)
  - [ ] Tokens e tipografia conformes
- **Dependências:** U1.7, U1.3
- **Riscos:** baixo.

### U5.2 — Perfil público de Empresa
- **Fase:** 5
- **Fonte:** `public-profiles.md §"Perfil público de Empresa"`
- **Escopo — dentro:** rota `/empresa/[id]` pública (não-interna) com header, sobre, reputação (rubrica empresa), estatísticas, projetos ativos, histórico de contratos respeitando visibilidade, reviews recebidas, equipe, linkage cruzada.
- **Fora:** página completa de reviews (U5.4).
- **Entregáveis:**
  - Reescrever `/empresa/[id]` — atenção: hoje existe `/empresa/fornecedor/[id]` (perfil de fornecedor visto por empresa); o perfil público da empresa precisa de rota dedicada. **Decisão:** usar `/perfil/empresa/[id]` para o perfil público, evitando colisão com as rotas internas `/empresa/*`. Convenção inicial da Fase 5 foi `/organizacao/empresa/[id]`; renomeada para `/perfil/empresa/[id]` em 2026-04-15 após revisão com o Arthur (ver `docs/post-execution-review.md §2`) porque "perfil" é semanticamente mais claro para o visitante externo.
- **DoD:**
  - [ ] Todas as seções do design presentes
  - [ ] Visibilidade respeitada item a item em "Histórico de contratos"
  - [ ] Rota acessível por fornecedor logado
- **Dependências:** U5.1
- **Riscos:** baixo. Convenção `/perfil/empresa/[id]` confirmada (decisão #2).

### U5.3 — Perfil público de Fornecedor
- **Fase:** 5
- **Fonte:** `public-profiles.md §"Perfil público de Fornecedor"`
- **Escopo — dentro:** rota `/perfil/fornecedor/[id]` (ou padrão escolhido em U5.2) com header, sobre, reputação (rubrica fornecedor), atuação (categorias + regiões + capacidade), certificações, estatísticas, contratos destacáveis, reviews recebidas, equipe, linkage cruzada.
- **Fora:** página completa de reviews (U5.4).
- **Entregáveis:**
  - Rota nova; a `/fornecedor/perfil` atual (perfil próprio em edição) vira uma tela distinta, possivelmente em Configurações → Perfil Fornecedor (U2.4 já cobre).
  - Deletar `/fornecedor/empresa/[id]` e `/empresa/fornecedor/[id]` atuais (redirecionamento para a nova rota pública OU remoção).
- **DoD:**
  - [ ] Todas as seções do design presentes
  - [ ] Contratos destacáveis ordenados conforme `contratos_destacaveis_ids`
  - [ ] Linkage cruzada mostra variante empresa no perfil fornecedor (quando aplicável)
- **Dependências:** U5.1, U5.2
- **Riscos:** desambiguar "perfil próprio em edição" vs "perfil público da minha org".

### U5.4 — Página completa de reviews com filtros
- **Fase:** 5
- **Fonte:** `public-profiles.md §"Reviews recebidas"` + decisão #4 (ordenação)
- **Escopo — dentro:** rota `/perfil/empresa/[id]/reviews` e `/perfil/fornecedor/[id]/reviews` listando todas as reviews liberadas com filtros (dimensão, nota, período) + paginação simples.
- **Fora:** denúncia / right-of-reply (perguntas em aberto do design).
- **Entregáveis:** 2 rotas (ou 1 compartilhada) + `FiltrosReviews`.
- **DoD:**
  - [ ] Filtros funcionam client-side
  - [ ] Fallback "desde sempre" sinalizado quando filtro de 12m vazio
- **Dependências:** U5.1, U5.2, U5.3
- **Riscos:** baixo.

### U5.5 — Diretório de fornecedores (contexto empresa)
- **Fase:** 5
- **Fonte:** `design/info-architecture.md §"Sidebar empresa"` (item Diretório) + `public-profiles.md` (destino dos cards)
- **Escopo — dentro:** reescrever `src/app/empresa/diretorio/page.tsx` como discovery read-only de fornecedores. Grid de cards (reusa `FiltrosProjeto` patterns: busca, categoria, região, certificação). Card mostra logo, nome, cidade, categorias principais, `reputacao_agregada.media_geral` (`<ReputacaoAgregada compact />` de U5.1), contagem de contratos encerrados; clique leva a `/perfil/fornecedor/[id]`. Estado vazio "Nenhum fornecedor encontrado".
- **Fora:** pedidos de contato direto, favoritar, comparar lado-a-lado (fora do MVP).
- **Entregáveis:**
  - Reescrita de `src/app/empresa/diretorio/page.tsx`
  - Componente `src/components/diretorio/filtros-fornecedor.tsx` (espelha `FiltrosProjeto` mas com dimensões apropriadas: categoria, região atendida, certificação, busca textual)
- **DoD:**
  - [ ] Lista vem de `fornecedores` com filtros aplicados client-side
  - [ ] Cards usam `ReputacaoAgregada` (compact) e apontam para `/perfil/fornecedor/[id]`
  - [ ] Estado vazio funcional
  - [ ] Nenhum dado hardcoded
- **Dependências:** U5.1, U5.3
- **Riscos:** baixo. Volume atual de fornecedores é pequeno (6) — paginação não requerida no MVP.

---

## FASE 6 — Camada Consultoria

> Fonte: `design/consulting-layer.md`. Fase mais densa depois da 4.

### U6.1 — Catálogo Consultoria (fornecedor) + estudos de caso destacados
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Discovery do catálogo"`
- **Escopo — dentro:** `/fornecedor/consultoria` com 4 cards do catálogo + seção "Estudos de caso destacados" (3-4 cards).
- **Fora:** página de produto (U6.2); página de leitura de estudo (U6.7).
- **Entregáveis:** rota + `CardServicoConsultoria`, `CardEstudoCaso`.
- **DoD:**
  - [ ] 4 cards com preço "A partir de R$ X" + prazo
  - [ ] Cards de estudos de caso clicáveis (link vai a U6.7)
- **Dependências:** U1.8, U2.3
- **Riscos:** baixo.

### U6.2 — Página de produto (1 por tipo) + modal de contratação
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Tela de produto"` + `§"Fluxo de compra"`
- **Escopo — dentro:** rota `/fornecedor/consultoria/[tipo]` com descrição completa + FAQ + casos relacionados + CTA "Contratar agora" que abre modal de configuração (escolhe Candidatura/Proposta alvo + contexto extra). Confirmação cria `SessaoConsultoria` em `solicitada` (client-side).
- **Fora:** fluxo do advisor (U6.4 em diante).
- **Entregáveis:** rota + `ModalContratacaoSessao`.
- **DoD:**
  - [ ] CTA 1/CTA 2 (das U4.3 e U4.7) agora levam pra este fluxo em vez de placeholder
  - [ ] Modal valida que se for `revisao_proposta`, só mostra candidaturas shortlistadas
  - [ ] Toast de sucesso + redirect para U6.3
- **Dependências:** U6.1
- **Riscos:** lógica de bundle `acompanhamento_completo` — seguir invariante §8.10.

### U6.3 — Minhas sessões (fornecedor) + card por status + entregáveis + avaliar atendimento
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Sessão em andamento"`, `§"Sessão entregue"`
- **Escopo — dentro:** `/fornecedor/consultoria/sessoes` lista paginada + filtros; detalhe `/fornecedor/consultoria/sessoes/[id]` mostrando entregáveis (notas markdown, links), comentários do fornecedor, botão "Marcar como útil", modal "Avaliar atendimento" (1-5 + comentário).
- **Fora:** workspace do advisor (U6.5).
- **Entregáveis:** 2 rotas + `CardSessao`, `EntregavelMarkdown`, `ModalAvaliarAtendimento`.
- **DoD:**
  - [ ] Cards por status usam cores/ícones corretos
  - [ ] Entregáveis render markdown (usar lib leve ou regex bem simples — ver próximo risco)
  - [ ] Botão "Marcar como útil" tem state toggle + visual feedback
- **Dependências:** U6.2
- **Riscos:** baixo. Exibição usa **MDXEditor** em modo read-only (decisão #3); mesma lib do workspace em U6.5.

### U6.4 — Admin Consultoria: fila de sessões solicitadas + atribuição
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Fila de solicitações"`
- **Escopo — dentro:** `/admin/sessoes/solicitadas` com cards + filtros + botões "Atribuir a mim" / "Atribuir a outro" (modal com lista de advisors + carga).
- **Fora:** workspace (U6.5).
- **Entregáveis:** rota + `ModalAtribuirAdvisor`.
- **DoD:**
  - [ ] Sugestão de atribuição mostra advisor por especialização + carga
  - [ ] Atribuição muda status da sessão para `atribuida`
- **Dependências:** U6.3, U3.3
- **Riscos:** baixo.

### U6.5 — Workspace de sessão (advisor)
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Visão de sessão para o advisor"`
- **Escopo — dentro:** `/admin/sessoes/[id]` split layout: esquerda (contexto: fornecedor + empresa + projeto + candidatura/proposta + contexto extra); direita (editor de notas markdown com autosave-mock, anexos, sugestões de estudos de caso); rodapé (comunicação com fornecedor).
- **Fora:** dashboard admin pessoal (já em U3.3).
- **Entregáveis:** rota + `ContextoSessao`, `EditorNotas`, `AnexadorEstudos`, `TipoEntregavelSelect`.
- **DoD:**
  - [ ] Split visual responsivo ao breakpoint desktop
  - [ ] "Marcar como entregue" só habilita com ≥1 entregável publicado
  - [ ] Autosave é um `useEffect` que toca toast a cada 3s quando dirty (fake)
- **Dependências:** U6.4
- **Riscos:** baixo. Editor é **MDXEditor** em modo edição (decisão #3), autosave fake via `useEffect` + toast.

### U6.6 — Páginas owner: Advisors, Catálogo, Templates de outreach
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Gestão"`
- **Escopo — dentro:** 3 rotas CRUD-lite (read + edit mock): `/admin/advisors`, `/admin/catalogo`, `/admin/templates-outreach`. Tudo owner-only — redireciona se `role = advisor`.
- **Fora:** outreach proativo (U6.8); estudos de caso (U6.7).
- **Entregáveis:** 3 rotas + formulários mock.
- **DoD:**
  - [ ] Advisor não-owner redireciona para dashboard
  - [ ] Formulários de edição são read-only ou mostram estado de sucesso fake ao salvar
- **Dependências:** U6.5
- **Riscos:** baixo.

### U6.7 — Estudos de caso: browser, leitura, wizard de criação
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Estudos de caso"` + decisão #8 (info-architecture)
- **Escopo — dentro:** 3 rotas: `/consultoria/estudos` (browser público-a-logados), `/consultoria/estudos/[id]` (leitura markdown + aprendizados), `/admin/estudos/novo` (wizard 4 passos: escolher contrato → narrativa → anonimização → consentimento → publicar).
- **Fora:** solicitação de consentimento real (notificação é mockada em U7.1).
- **Entregáveis:** 3 rotas + `WizardEstudoCaso`.
- **DoD:**
  - [ ] Filtros por categoria/região no browser
  - [ ] Anonimização rende placeholders corretos ("fornecedora pequena de Manutenção Industrial")
  - [ ] Wizard avança apenas com validações mínimas
- **Dependências:** U6.1, U6.6
- **Riscos:** volume visual — wizard é 4 passos; pode virar U6.7a + U6.7b se passar de 90 min.

### U6.8 — Outreach proativo (owner) + modal oferta personalizada
- **Fase:** 6
- **Fonte:** `consulting-layer.md §"Outreach proativo"`
- **Escopo — dentro:** `/admin/outreach` com lista priorizada de leads + sinais explicados; modal "Enviar oferta personalizada" (mensagem + produto + desconto opcional). Criar `OfertaOutreach` em state.
- **Fora:** cálculo real dos sinais (mock no seed).
- **Entregáveis:** rota + `CardLead`, `ModalOfertaPersonalizada`.
- **DoD:**
  - [ ] Lista ordenada por "recência do sinal"
  - [ ] Enviar oferta cria item em memória e toast
  - [ ] Owner-only
- **Dependências:** U6.6, U1.8
- **Riscos:** baixo.

---

## FASE 7 — Sistema de notificações

> Fonte: `design/notifications.md`.

### U7.1 — Drawer de notificações no topbar
- **Fase:** 7
- **Fonte:** `notifications.md §"Canais: In-app"` + checklist
- **Escopo — dentro:** sino do topbar (U2.1) passa a abrir `Sheet` do shadcn com 5-10 notificações mais recentes do `MEMBRO_LOGADO`, agrupamento visual, cor por severidade, "Marcar todas como lidas", link "Ver todas" → U7.2.
- **Fora:** página dedicada (U7.2); preferências (U7.3).
- **Entregáveis:** `DrawerNotificacoes`.
- **DoD:**
  - [ ] Badge do sino usa contagem de não-lidas real
  - [ ] Agrupamento mostra "3 novas mensagens em *Projeto X*"
  - [ ] Click na notificação navega para `acao_url` + marca como lida
- **Dependências:** U1.9, U2.1
- **Riscos:** baixo.

### U7.2 — Página dedicada de notificações (ativas + arquivadas)
- **Fase:** 7
- **Fonte:** `notifications.md §"Interações do usuário"` + checklist
- **Escopo — dentro:** `/notificacoes` com abas Ativas / Arquivadas; filtros (severidade, contexto, período); busca textual; marcar-lidas em lote.
- **Fora:** preferências (U7.3).
- **Entregáveis:** rota + filtros + lista paginada.
- **DoD:**
  - [ ] Busca + filtros combinam
  - [ ] Arquivar move para aba Arquivadas
  - [ ] Bulk "marcar como lidas" funciona
- **Dependências:** U7.1
- **Riscos:** baixo.

### U7.3 — Preferências de notificação em Configurações pessoais + auto-resolução
- **Fase:** 7
- **Fonte:** `notifications.md §"Preferências do membro"` + `§"Auto-resolução"`
- **Escopo — dentro:** sub-aba "Notificações" em `/configuracoes/pessoal` com matriz `grupo × (in_app / email)` + botão "Restaurar padrões". Implementar auto-resolução em 3 pontos: E8/F7 (submeter review), F3 (abrir formulário de proposta), C1 (abrir workspace).
- **Fora:** envio real de email (obviamente).
- **Entregáveis:** componente de preferências + hooks `useAutoResolucaoNotificacao(tipo)` aplicado nas telas dos 3 pontos.
- **DoD:**
  - [ ] Matriz edita state e persiste em memória (futuro: localStorage)
  - [ ] Ao abrir `/reviews/novo/[id]`, E8 da notificação correspondente vira `lida = true`
  - [ ] Ao abrir `/fornecedor/proposta/[id]`, F3 correspondente vira lida
  - [ ] Ao abrir `/admin/sessoes/[id]`, C1 correspondente vira lida
- **Dependências:** U7.2, U4.7, U4.10, U6.5
- **Riscos:** auto-resolução em 3 pontos — cuidar de não duplicar lógica; centralizar em um hook.

---

## Rotas criadas ao final do plano

Referência rápida para validação (não exaustivo — componentes internos omitidos):

```
/                                       landing (sem mudança)
/login, /registro                       sem mudança

# Dashboards
/empresa/dashboard
/fornecedor/dashboard
/admin/dashboard

# Projetos
/empresa/novo-projeto
/empresa/projetos
/empresa/projeto/[id]
/empresa/projeto/[id]/triagem
/empresa/projeto/[id]/propostas
/fornecedor/projetos                    (descoberta)
/fornecedor/projeto/[id]
/fornecedor/projeto/[id]/candidatar

# Candidaturas / Propostas / Contratos
/empresa/candidaturas
/fornecedor/candidaturas
/fornecedor/proposta/[id]
/empresa/contratos, /empresa/contratos/[id]
/fornecedor/contratos, /fornecedor/contratos/[id]

# Mensagens
/empresa/mensagens, /fornecedor/mensagens   (ou /mensagens contexto-aware)

# Reviews
/reviews (lista), /reviews/[id], /reviews/novo/[contratoId]

# Perfis públicos
/perfil/empresa/[id]                (padrão de URL a confirmar em U5.2)
/perfil/fornecedor/[id]
/perfil/empresa/[id]/reviews
/perfil/fornecedor/[id]/reviews

# Diretório (empresa)
/empresa/diretorio

# Consultoria — fornecedor
/fornecedor/consultoria                  (catálogo)
/fornecedor/consultoria/[tipo]           (produto)
/fornecedor/consultoria/sessoes
/fornecedor/consultoria/sessoes/[id]
/consultoria/estudos, /consultoria/estudos/[id]

# Consultoria — admin
/admin/sessoes/solicitadas, /admin/sessoes/atribuidas, /admin/sessoes/em-andamento, /admin/sessoes/entregues
/admin/sessoes/[id]                      (workspace)
/admin/advisors
/admin/catalogo
/admin/templates-outreach
/admin/outreach
/admin/estudos/novo
/admin/organizacoes                      (read-only, futuro)

# Configurações
/configuracoes                           (abas do tenant)
/configuracoes/pessoal                   (abas pessoais, incluindo notificações)

# Notificações
/notificacoes
```

---

## Decisões de abertura (2026-04-15)

Seis decisões confirmadas com Arthur antes de iniciar U1.1. Não são redecisões — todas as unidades devem respeitá-las.

1. **Nome da organização dual-role no seed** (U1.2) → **"Metalúrgica XYZ"**. Já citada em `design/data-model.md` e `design/info-architecture.md` como exemplo.
2. **Convenção de URL para perfis públicos** (U5.2, U5.3) → **`/perfil/empresa/[id]`** e **`/perfil/fornecedor/[id]`**. Explícito, evita colisão com rotas internas `/empresa/*` e `/fornecedor/*`. Convenção inicial foi `/organizacao/...`, renomeada para `/perfil/...` em 2026-04-15 após a Fase 5 (ver `docs/post-execution-review.md §2`).
3. **Editor markdown para Consultoria** (U6.3, U6.5, U6.7) → **MDXEditor** (WYSIWYG puro). Advisor digita e vê negrito/listas renderizados, nunca vê sintaxe crua. Mesmo lib em modo read-only cobre exibição ao fornecedor. Única dep nova adicionada ao projeto.
4. **Persistência das mutações mockadas** (várias) → **in-memory only** (`useState`). Mutações zeram ao recarregar — aceitável no mockup, mantém código simples.
5. **Sessão mockada** (U2.1, U2.2) → **`MEMBRO_LOGADO_ID` fixo = Maria Silva, Vale, owner**. Sem toggle de troca no topbar. Constante em `src/lib/session.ts`.
6. **Admin Consultoria na navegação** (U3.3, U2.2) → **terceira opção no switcher de contexto**, visível apenas para membros que têm registro na tabela `Advisor`. Mesma mecânica do switcher dual-role, estendida.

---

## Status do plano

- **Unidades totais:** 42 (10 na Fase 1, 4 na Fase 2, 3 na Fase 3, 10 na Fase 4, 4 na Fase 5, 8 na Fase 6, 3 na Fase 7)
- **Decisões de abertura:** ✅ todas respondidas (ver seção acima)
- **Próximo passo:** iniciar U1.1 quando Arthur confirmar.
