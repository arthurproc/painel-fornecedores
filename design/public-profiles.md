# Perfis Públicos — ConectaFornece

> Artefato de design. Define como o **perfil público** de uma `Empresa` e de um `Fornecedor` aparecem para visitantes — a fundação de confiança do marketplace. Complementa os artefatos `handshake-flow.md`, `data-model.md` e `info-architecture.md`.

## Propósito

O perfil público é o **ponto de decisão de confiança** antes de qualquer ação. Quando um fornecedor decide candidatar, ele olha o perfil da empresa. Quando uma empresa decide selecionar para proposta, ela olha o perfil do fornecedor. Quando uma candidatura é descartada, o fornecedor pode olhar o perfil do consultor que vai atendê-lo. Em todos os casos, a pergunta implícita é a mesma: *"posso confiar nisso?"*

O objetivo deste artefato é desenhar os dois perfis (Empresa e Fornecedor) com a densidade de informação certa: suficiente pra tomar decisão, sem vazar o que deve ficar privado.

## Princípios

1. **Confiança via evidência, não via afirmação.** Mais avaliações reais e contratos fechados valem mais que claims de marketing. Reputação agregada e histórico de contratos são os blocos mais destacados.
2. **Mesmo visual, rubricas distintas.** Empresa e fornecedor compartilham layout e componentes (header, reputação, histórico, avaliações), mas cada um tem rubrica própria de 5 dimensões. Consistência ajuda leitura cruzada, diferença respeita o papel.
3. **Visibilidade herdada do contrato.** Um contrato com `visibilidade = privado` não aparece no perfil, e suas avaliações também não. A visibilidade do contrato é a unidade de privacidade.
4. **Linkage cruzada explícita.** Quando uma `Organizacao` tem ambos os perfis ativos e `linkage_publica = true`, cada perfil mostra um card destacado apontando para o outro. Transparência é ativo.
5. **Identidade legal é lateral.** CNPJ e razão social existem e aparecem, mas não são protagonistas — o "nome de display" manda no header.

---

## Perfil público de Empresa

Visão do perfil ao ser clicado por um visitante (fornecedor logado, ou visitante não-autenticado em alguns casos).

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [◂ Voltar]                                                           │
│                                                                      │
│ ┌─ Header ────────────────────────────────────────────────────────┐ │
│ │ [Logo]   Vale S.A.                           ✓ CNPJ verificado  │ │
│ │          Mineração                                              │ │
│ │          Itabira - MG · Desde 1942                              │ │
│ │                                                                 │ │
│ │          Razão social: Companhia Vale do Rio Doce               │ │
│ │                                                                 │ │
│ │          [Badge: Também atua como fornecedor →]                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─ Sobre ─────────────────────────┐  ┌─ Reputação ───────────────┐  │
│ │ Uma das maiores mineradoras do  │  │ ★★★★☆ 4.7                 │  │
│ │ mundo, com operações no         │  │ 32 avaliações (últimos 12m) │  │
│ │ complexo de Itabira...          │  │                           │  │
│ │                                 │  │ Pagamento           4.8  │  │
│ │                                 │  │ Clareza de escopo   4.5  │  │
│ │                                 │  │ Cronograma          4.7  │  │
│ │                                 │  │ Comunicação         4.9  │  │
│ │                                 │  │ Relacionamento      4.7  │  │
│ │                                 │  │                           │  │
│ │                                 │  │ [Ver todas as avaliações]│  │
│ └─────────────────────────────────┘  └───────────────────────────┘  │
│                                                                      │
│ ┌─ Estatísticas operacionais ────────────────────────────────────┐  │
│ │  47 contratos publicados · 38 encerrados · 5 em execução       │  │
│ │  Tempo médio de pagamento: 28 dias                             │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Projetos ativos ──────────────────────────────────────────────┐  │
│ │ ▸ Manutenção de Correias Transportadoras · R$ 250-400k         │  │
│ │   Itabira · Manutenção Industrial · Publicado há 4 dias        │  │
│ │                                         [Ver projeto →]         │  │
│ │                                                                 │  │
│ │ ▸ Sistema de Monitoramento Ambiental · R$ 500-800k             │  │
│ │   Itabira · Serviços Ambientais · Publicado há 6 dias          │  │
│ │                                         [Ver projeto →]         │  │
│ │                                                                 │  │
│ │ [Ver todos (5 ativos)]                                          │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Histórico de contratos ───────────────────────────────────────┐  │
│ │ ▸ Manutenção de Pontes Rolantes · R$ 145.000 · Fev/2026        │  │
│ │   Vencedor: TechMinas Serviços Industriais ★★★★★                │  │
│ │                                                                 │  │
│ │ ▸ Gestão de Resíduos Industriais · R$ 275.000 · Mar/2026       │  │
│ │   Vencedor: Ambiental Solutions ★★★★☆                           │  │
│ │                                                                 │  │
│ │ ▸ (contrato privado)                                            │  │
│ │   Contrato encerrado com visibilidade restrita                  │  │
│ │                                                                 │  │
│ │ [Ver histórico completo (38 encerrados)]                        │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Reviews recebidas ────────────────────────────────────────────┐  │
│ │ [Review card × N — ver §"Componente: Review individual"]       │  │
│ └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

> **Decisão 2026-04-15 (Fase 5):** removida a seção "Equipe" do perfil público, bem como qualquer contagem agregada de membros no header. O produto é B2B industrial — a confiança é construída com avaliações, contratos encerrados e certificações; expor nome/cargo/foto de `gestor` e `admin` publicamente adicionaria risco (LGPD, phishing, engenharia social) sem payoff de conversão. A identidade individual continua exposta pontualmente no `ReviewCard` (autor de uma avaliação é parte integral da credibilidade dela, decisão #5). `MembroPopover` segue existindo como componente reutilizável para essa situação.

### Seções detalhadas

**Header.** Logo (letter avatar no mock atual), nome de display em destaque, setor abaixo, cidade + região, ano desde. Abaixo disso, em tipografia menor, razão social (campo da `Organizacao`). À direita do nome, badge "✓ CNPJ verificado" (MVP: todos mockados como verificados). Se `Organizacao.linkage_publica = true` e o outro perfil está ativo, badge/card clicável "Também atua como fornecedor →". Sem contagem de membros.

**Sobre.** Texto livre do campo `Empresa.descricao`. Até ~400 caracteres em exibição normal, com "Ler mais" se for maior.

**Reputação.** Ver §"Componente: Reputação agregada". Usa rubrica empresa (5 dimensões: pagamento, clareza de escopo, cronograma, comunicação, relacionamento).

**Estatísticas operacionais.** Três números contados de Contratos: publicados, encerrados, em execução. Além de `tempo_medio_pagamento_dias` computado. Não mostra valor total contratado (sensível comercialmente).

**Projetos ativos.** Lista de `Projeto` com `status ∈ {publicado, em_triagem, em_propostas}`, ordem decrescente de `data_publicacao`. Cada item com título, faixa de orçamento, cidade, categoria, tempo desde publicação, CTA "Ver projeto →". Preview de até 3 + link "Ver todos".

**Histórico de contratos.** Lista de `Contratos` com `status ∈ {em_execucao, encerrado}`. Respeita `visibilidade`:
- `publico` — mostra título, valor final, fornecedor vencedor (clicável), data, nota agregada recebida
- `fornecedores` — mostra para fornecedores logados; para visitantes não-autenticados, mostra "(contrato restrito a fornecedores)"
- `privado` — aparece como "(contrato privado)" com mensagem neutra; sem detalhes

**Avaliações recebidas.** Listagem cronológica das Reviews do tipo `avaliado_org_tipo = empresa` e `status = liberada`. Ver §"Componente: Review individual". Até 5 na página principal + link "Ver todas".

---

## Perfil público de Fornecedor

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [◂ Voltar]                                                           │
│                                                                      │
│ ┌─ Header ────────────────────────────────────────────────────────┐ │
│ │ [Logo]   TechMinas Serviços Industriais     ✓ CNPJ verificado   │ │
│ │          Itabira - MG · Desde 2011                              │ │
│ │                                                                 │ │
│ │          Razão social: TechMinas Serviços Industriais Ltda      │ │
│ │                                                                 │ │
│ │          [Badge: Também atua como empresa →]                    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─ Sobre ─────────────────────────┐  ┌─ Reputação ───────────────┐  │
│ │ Empresa especializada em        │  │ ★★★★★ 4.8                 │  │
│ │ manutenção industrial com foco  │  │ 47 reviews (últimos 12m)  │  │
│ │ no setor de mineração. Atuamos  │  │                           │  │
│ │ há mais de 15 anos na região... │  │ Execução            4.9  │  │
│ │                                 │  │ Cumprimento de prazo 4.8 │  │
│ │                                 │  │ Segurança           5.0  │  │
│ │                                 │  │ Comunicação         4.7  │  │
│ │                                 │  │ Relacionamento      4.7  │  │
│ │                                 │  │                           │  │
│ │                                 │  │ [Ver todas as reviews]   │  │
│ └─────────────────────────────────┘  └───────────────────────────┘  │
│                                                                      │
│ ┌─ Atuação ──────────────────────────────────────────────────────┐  │
│ │ Categorias: Manutenção Industrial · Elétrica e Automação        │  │
│ │ Regiões atendidas: Itabira · João Monlevade · Ipatinga          │  │
│ │ Capacidade atual: equipe de 15 técnicos, disponibilidade 24/7   │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Certificações ────────────────────────────────────────────────┐  │
│ │ [ISO 9001] [NR-22] [NR-10] [NR-35]                              │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Estatísticas operacionais ────────────────────────────────────┐  │
│ │  47 contratos realizados · 3 em execução                        │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Contratos destacáveis ────────────────────────────────────────┐  │
│ │ ▸ Manutenção de Pontes Rolantes · R$ 145.000 · Fev/2026        │  │
│ │   Contratante: Vale S.A. · ★★★★★                                │  │
│ │                                                                 │  │
│ │ ▸ Revisão Geral de Equipamentos · R$ 92.000 · Jan/2026         │  │
│ │   Contratante: Usiminas · ★★★★☆                                 │  │
│ │                                                                 │  │
│ │ [Ver todos os contratos públicos]                               │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│ ┌─ Reviews recebidas ────────────────────────────────────────────┐  │
│ │ [Review card × N — ver §"Componente: Review individual"]       │  │
│ └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

> Vale a mesma decisão do perfil empresa: a seção "Equipe" foi removida, e não há contagem de membros no header.

### Seções detalhadas

**Header.** Mesma estrutura do perfil empresa. Sem campo "setor" (fornecedor tem categorias, não setor); a área de display mostra cidade + região + desde. Sem contagem de membros.

**Sobre.** Campo `Fornecedor.descricao`.

**Reputação.** Ver §"Componente: Reputação agregada". Usa rubrica fornecedor (5 dimensões: execução, cumprimento de prazo, segurança, comunicação, relacionamento).

**Atuação.** Três campos: `categorias` (tags), `regioes_atendidas` (tags), `capacidade_atual` (texto livre).

**Certificações.** Tags de `Fornecedor.certificacoes`. Pode virar badges coloridos por tipo no visual-identity.

**Estatísticas operacionais.** Contratos realizados (encerrados) + em execução. Não mostra valor total contratado.

**Contratos destacáveis.** Lista curada pelo próprio fornecedor (via admin do seu perfil) dos contratos que ele quer destacar — só entra se `visibilidade ≠ privado`. Cada item com título, valor (se público), data, contratante clicável, nota agregada recebida.

**Reviews recebidas.** Listagem cronológica das Reviews do tipo `avaliado_org_tipo = fornecedor` e `status = liberada`. Mesma estrutura.

---

## Componente: Reputação agregada

Bloco reutilizável em ambos os perfis. Estrutura visual:

```
┌─ Reputação ──────────────────────────────────┐
│                                              │
│  ★★★★☆  4.7  (32 reviews · últimos 12 meses) │
│                                              │
│  Pagamento              ████████░░  4.8      │
│  Clareza de escopo      ███████░░░  4.5      │
│  Cronograma             ████████░░  4.7      │
│  Comunicação            █████████░  4.9      │
│  Relacionamento geral   ████████░░  4.7      │
│                                              │
│  [Ver todas as reviews]                      │
└──────────────────────────────────────────────┘
```

**Regras de cálculo:**

- Média geral = média aritmética simples das notas de todas as reviews liberadas nos últimos 12 meses. Se não houver no período, expande pra "desde sempre" e sinaliza período.
- Média por dimensão = média aritmética das notas daquela dimensão nas reviews liberadas do período.
- Contagem = total de reviews liberadas no período.

**Regras de display:**

- Estrelas do topo em escala de 5 (meia-estrela permitida).
- Barras por dimensão com 10 segmentos (cada segmento = 0.5).
- Valor numérico ao lado com 1 casa decimal.
- Link "Ver todas as reviews" vai pra página paginada com filtros.

**Estado "sem reviews":**

```
┌─ Reputação ──────────────────────────────────┐
│                                              │
│  Esta organização ainda não recebeu          │
│  avaliações.                                 │
│                                              │
│  Após o primeiro contrato encerrado, as      │
│  avaliações liberadas aparecem aqui.         │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Componente: Review individual

Card exibido na seção "Reviews recebidas" e na página completa de reviews.

```
┌─ Review ─────────────────────────────────────────────────┐
│ [Avatar] João Silva                                      │
│ Gerente de Compras · Metalúrgica XYZ (clicável)          │
│ ✓ Contrato encerrado em 14/02/2026 — R$ 145.000,00       │
│                                                          │
│ Execução                ★★★★★                            │
│ Cumprimento de prazo    ★★★★★                            │
│ Segurança               ★★★★★                            │
│ Comunicação             ★★★★☆                            │
│ Relacionamento geral    ★★★★★                            │
│                                                          │
│ "Excelente equipe, serviço entregue no prazo e dentro    │
│  das especificações. Recomendamos fortemente."           │
│                                                          │
│ Liberada em 20/02/2026 · Contrato: Manutenção de Pontes  │
└──────────────────────────────────────────────────────────┘
```

**Elementos:**

- Avatar + nome do autor (membro individual)
- Cargo do autor + nome da org autora (a org é clicável e leva ao perfil dela)
- Linha de "confirmação de contrato": data de encerramento + valor final (se `visibilidade = publico`)
- Notas por dimensão (usa a rubrica aplicável ao lado avaliado)
- Texto do comentário
- Data de release (não de submissão — o release é o que torna pública)
- Link do contrato (se visibilidade permite)

**Regras:**

- Autor individual sempre identificado; nota agrega no perfil da org (Glassdoor-like).
- Comentário não editável após release.
- Se o contrato referenciado é `visibilidade = privado`, a review não aparece publicamente.
- Se o contrato é `visibilidade = fornecedores`, a review aparece apenas pra visitantes logados com perfil fornecedor ativo.

---

## Componente: Card de linkage cruzada

Aparece nos dois perfis quando a `Organizacao` tem ambos `perfil_empresa_ativo` e `perfil_fornecedor_ativo` **e** `linkage_publica = true`.

**No perfil empresa:**

```
┌─ Também atua como fornecedor ────────────────┐
│ [Logo] Metalúrgica XYZ                       │
│ Categorias: Manutenção Industrial,           │
│             Construção Civil                 │
│ ★★★★☆ 4.5  (18 reviews)                     │
│                                              │
│ [Ver perfil fornecedor →]                    │
└──────────────────────────────────────────────┘
```

**No perfil fornecedor:**

```
┌─ Também atua como empresa contratante ───────┐
│ [Logo] Metalúrgica XYZ                       │
│ Setor: Metalurgia                            │
│ ★★★★☆ 4.6  (12 reviews)                     │
│                                              │
│ [Ver perfil empresa →]                       │
└──────────────────────────────────────────────┘
```

**Quando o linkage está desabilitado** (`linkage_publica = false`): o card não aparece nem no topo nem nos perfis. Os dois perfis funcionam como entidades públicas independentes — só a infra interna e o admin Celso sabem que são do mesmo tenant.

---

## Estados vazios

| Seção | Estado | Mensagem |
| --- | --- | --- |
| Reputação | Sem reviews liberadas | "Esta organização ainda não recebeu avaliações. Após o primeiro contrato encerrado, as avaliações aparecem aqui." |
| Projetos ativos | (empresa) sem projeto aberto | "Nenhum projeto ativo no momento." |
| Histórico de contratos | Sem contratos fechados | "Ainda não há contratos fechados nesta organização." |
| Contratos destacáveis | (fornecedor) sem destacáveis | "Este fornecedor ainda não destacou nenhum contrato." |
| Reviews recebidas | Sem reviews liberadas | Reutiliza a mensagem da reputação |
| Certificações | (fornecedor) vazias | "Nenhuma certificação cadastrada." |

---

## Privacidade e visibilidade

Resumo das regras aplicáveis aos componentes do perfil público:

| Elemento | Publica quando |
| --- | --- |
| Header, Sobre, Estatísticas operacionais, Atuação, Certificações | Sempre |
| Reputação agregada | Sempre (calculada só de reviews liberadas) |
| Histórico de contratos | Respeita `Contrato.visibilidade` individualmente |
| Contratos destacáveis | Só entram se `Contrato.visibilidade ≠ privado` E foram curados pelo fornecedor |
| Reviews individuais | Herda `Contrato.visibilidade` da review |
| Linkage cruzada | `Organizacao.linkage_publica = true` E ambos perfis ativos |

Regras específicas:

- **Contratos privados** aparecem no histórico como "(contrato privado)" sem detalhes, preservando a contagem total mas ocultando nomes e valores.
- **Contratos restritos a fornecedores** (`visibilidade = fornecedores`) só mostram detalhes se o visitante está logado com perfil fornecedor ativo; caso contrário, mostram placeholder neutro.
- **CNPJ no header** é exibido sempre (é público por natureza na Receita Federal). Endereço fiscal da `Organizacao` não aparece no perfil público.
- **Membros** (nome, cargo, foto, email, telefone) não são listados no perfil público. Apenas o autor de uma review aparece individualmente, via `ReviewCard` + `MembroPopover`.
- **Contato da organização** (email/telefone do `Fornecedor.contato`) aparece apenas para visitantes logados.

---

## Comportamentos / interações

- **Clicar no nome de um membro** (só acontece em `ReviewCard`, já que o perfil não lista equipe) → popover leve com nome, foto, cargo. Sem página dedicada de membro no MVP.
- **Clicar no autor de uma review** → navega pro perfil público da org autora.
- **Clicar em "Contrato: ..." na review** → página pública do contrato (se visibilidade permite) ou modal read-only.
- **Clicar em contrato do histórico** → mesmo comportamento.
- **Clicar em "Ver todas as reviews"** → página paginada dedicada com filtros por dimensão, por nota, por período.
- **Clicar em projeto ativo da empresa (do perfil dela)** → página do projeto, com CTA "Candidatar-se" se o visitante é fornecedor.
- **Clicar no card de linkage cruzada** → perfil oposto da mesma `Organizacao`.
- **Clicar no nome da org em qualquer lugar** → perfil público da org (auto-seleção de qual lado, ver §"Decisões").
- **Clicar no CTA "Voltar"** → volta pro referrer (projeto, diretório, candidatura, review).

---

## Decisões tomadas

1. **Período padrão de reputação agregada** — últimos 12 meses. Cai pra "desde sempre" com sinalização se não houver reviews no período. Página completa de reviews permite filtros de período.
2. **Valor total contratado no perfil** — não mostra. Apenas contagens (publicados, encerrados, em execução). Sensibilidade comercial supera utilidade.
3. **Membros no perfil público** — nenhum. B2B industrial não precisa expor equipe (risco LGPD/phishing sem payoff). Autor de review continua identificado individualmente no próprio card de review. Decisão revisada em 2026-04-15 (originalmente: "só owner e admin visíveis").
4. **Ordenação de reviews** — mais recentes primeiro por padrão. Filtro por dimensão e por nota na página completa.
5. **Anonimato de autor de review** — não permitido no MVP. Autor sempre identificado (individual + org).
6. **Reviews de contrato privado** — não aparecem publicamente. Segue visibilidade do contrato.
7. **Reviews de contrato "fornecedores"** — só visíveis pra visitantes logados com perfil fornecedor ativo.
8. **Projetos ativos no perfil da empresa** — mostra todos (não filtra por compatibilidade de categoria com o visitante). Filtros ficam na própria página de descoberta de projetos.
9. **Perfil de membro individual** — não existe página dedicada no MVP. Só popover leve com nome/cargo/foto.
10. **Endereço fiscal** — não aparece em perfil público. Apenas cidade + região de display.
11. **CNPJ** — aparece no header (é público na Receita Federal).
12. **Contato direto (email/telefone)** — aparece só pra visitantes logados, não pra visitantes anônimos.
13. **Quando o visitante clica no nome da org sem saber qual perfil** — ir pro perfil mais relevante no contexto: se o clique veio de um projeto, vai pro empresa; se veio de uma candidatura/review, vai pro perfil que é avaliado ali. Default sem contexto = empresa.

---

## Perguntas em aberto

| Pergunta | Como decidir |
| --- | --- |
| Perfis públicos são acessíveis a visitantes não-logados? Ou só dentro do app? | Decisão de produto — afeta SEO e aquisição |
| Páginas de perfil têm URL pública amigável (ex.: `/empresa/vale`) ou só ID (`/empresa/123`)? | Decisão de produto + slug disponível na `Organizacao` |
| Compartilhar perfil via link (botão "Compartilhar") tem valor no MVP? | Decisão de produto |
| Deve haver um botão "Denunciar" em reviews (ex.: comentário inadequado)? | Decisão de produto + moderation workflow |
| Reviews podem ter resposta da org avaliada (right-of-reply)? | Decisão de produto — padrão em Glassdoor e Amazon |
| Filtros na página de todas as reviews incluem "apenas reviews verificadas" (com contrato público) vs "todas"? | Decisão de UX |
| Exibir categorias e regiões no perfil empresa (o que ela costuma contratar)? | Decisão de produto — seria meta-informação derivada |

---

## Delta para o data model

Adições/ajustes que este artefato exige no `design/data-model.md`:

- `Organizacao` ganha `slug: string` (opcional no MVP) — URL amigável do perfil público.
- `Fornecedor` ganha `contratos_destacaveis: string[]` — IDs de contratos que o fornecedor curou pra destacar no perfil (ordem manual).
- `Contrato` precisa expor flag `destacado_pelo_fornecedor: boolean` pra consulta rápida.
- `Review` já tem `liberada_em` (usado pra ordenação) — confirmar.
- `ReviewDimensao` — já catalogado; confirmar que é suficiente pra rubrica visual (5 por lado).
- `Membro` ganha `visivel_publicamente?: boolean` (futuro; MVP assume `role ∈ {owner, admin}` como gatilho automático).
- Entidade ainda não modelada: sistema de "resposta à review" (se pergunta aberta #5 aprovada).
- Entidade ainda não modelada: "denúncia" de review (se pergunta aberta #4 aprovada).

---

## Checklist para mockup

Telas e componentes:

- [ ] Página de perfil público de `Empresa` (rota `/empresa/[id]` ou `/empresa/[slug]`)
- [ ] Página de perfil público de `Fornecedor` (rota `/fornecedor/[id]` ou `/fornecedor/[slug]`)
- [ ] Header do perfil (comum) — logo, nome, razão social, setor/cidade, desde, badges de verificação, badge de linkage cruzada
- [ ] Bloco "Sobre" com "Ler mais" quando longo
- [ ] Componente `ReputacaoAgregada` — estrelas + barras por dimensão + contagem + link
- [ ] Estado vazio de reputação ("ainda não recebeu avaliações")
- [ ] Bloco "Estatísticas operacionais" (números contados)
- [ ] Bloco "Projetos ativos" (empresa)
- [ ] Bloco "Atuação" com categorias + regiões atendidas + capacidade (fornecedor)
- [ ] Bloco "Certificações" com tags/badges (fornecedor)
- [ ] Bloco "Histórico de contratos" com respeito a visibilidade por item
- [ ] Bloco "Contratos destacáveis" (fornecedor)
- [ ] Bloco "Reviews recebidas" com 5 cards + link
- [ ] Componente `ReviewCard` individual — avatar, autor, cargo, org, linha de verificação, notas por dimensão, comentário, data, contrato
- [ ] Popover de membro (não página dedicada)
- [ ] Card `LinkageCruzada` — nos dois perfis quando aplicável
- [ ] Página completa de reviews (rota dedicada, paginada, filtros por dimensão e nota)
- [ ] Placeholder "contrato privado" no histórico
- [ ] Placeholder "contrato restrito a fornecedores" pra visitantes não-fornecedor
- [ ] Botão "Voltar" que respeita o referrer

Comportamentos:

- [ ] Reputação agregada recalcula só com reviews em `status = liberada`
- [ ] Janela de 12 meses padrão, com fallback "desde sempre" sinalizado
- [ ] Reviews herdam visibilidade do contrato referenciado
- [ ] Card de linkage aparece apenas se `linkage_publica = true` e ambos os perfis ativos
- [ ] Contato da org visível só para visitantes logados
- [ ] Rota de perfil aceita id OU slug (se slug ativo no MVP)
- [ ] Filtros na página completa de reviews (dimensão, nota, período)
