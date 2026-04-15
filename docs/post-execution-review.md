# Revisão pós-execução

> Lista viva de pontos que o Arthur quer revisitar depois de ver o mockup rodando. Cada item é uma dúvida ou decisão de produto — **não é bug list nem backlog de implementação**. Use este arquivo como roteiro antes de abrir a Fase seguinte ou antes de commitar mudanças estruturais.
>
> **Como usar:** marcar `[ ]` enquanto em aberto, `[x]` quando a decisão foi tomada (com link para onde virou tarefa/commit). Anexar nota curta com a decisão na linha de baixo.

---

## 1. Rota única de perfil público (`/perfil/...`) vs. rotas contextuais (`/empresa/fornecedor/[id]`, `/fornecedor/empresa/[id]`)

- [ ] **Validar se o modelo canônico do design (`design/public-profiles.md`) faz sentido na prática**

**Contexto.** A Fase 1 consolidou `Organizacao` como entidade raiz e `public-profiles.md` definiu que o perfil público é único por organização, acessado em `/perfil/empresa/[organizacao_id]` ou `/perfil/fornecedor/[organizacao_id]`, independente do contexto do visitante. As rotas antigas `/empresa/fornecedor/[id]` e `/fornecedor/empresa/[id]` (que eram perfis diferentes dependendo de quem olhava) foram virando stubs e hoje nenhum link interno aponta para elas — todo o app da Fase 4 já usa `/perfil/...`.

**Dúvida do Arthur ao ver o mockup rodando.** Se o perfil é realmente o mesmo para quem quer que olhe, ou se a página do fornecedor *vista por uma empresa contratante* deveria ter affordances diferentes da página do fornecedor *vista por outro fornecedor* (ex.: CTA "Convidar para projeto" aparece só para empresa; card de linkage cruzada pode ter peso diferente; dados de contato podem ter gating diferente).

**Benchmark sugerido: Airbnb.** No Airbnb, o mesmo usuário pode ser **host (anfitrião) e guest (hóspede)** ao mesmo tempo. Vale estudar:

- Como o perfil se comporta quando é acessado a partir de uma listagem de estadia (contexto "estou procurando onde ficar") vs. a partir de uma review que o usuário escreveu como hóspede.
- Se existe uma página única com tabs "Host profile / Guest profile" ou duas URLs distintas.
- Como o próprio dono do perfil edita esses dois lados (equivalente ao nosso `/configuracoes` com abas Perfil Empresa / Perfil Fornecedor).
- Onde aparecem os "badges" de papel oposto (analógo ao card de linkage cruzada em `public-profiles.md §"Componente: Card de linkage cruzada"`).
- Se o acesso a cada metade muda com o estado de auth/contexto do visitante.

**O que fazer com a conclusão.** Três caminhos possíveis, a decidir:

1. Manter design atual (`/perfil/{empresa|fornecedor}/[id]`) — perfil único canônico, CTAs visíveis/ocultos por contexto do visitante via prop.
2. Voltar a perfis contextuais (`/empresa/fornecedor/[id]` e `/fornecedor/empresa/[id]`) como duas páginas distintas da mesma organização. Implica reverter decisões da Fase 4 (links dos cards de triagem, detalhe de contrato, header do fornecedor).
3. Híbrido — uma rota canônica com parâmetro de contexto (`?from=empresa`) que pinta affordances, mas mantém URL estável para SEO/slug.

**Impacto em código.** As rotas legadas `/empresa/fornecedor/[id]` e `/fornecedor/empresa/[id]` foram **deletadas** após revisão pós-U4.5.4 (nenhum link interno apontava para elas — já estavam órfãs desde a Fase 4). Qualquer acesso direto hoje retorna 404 nativo. Se a decisão de produto for voltar para perfis contextuais (opção 2 acima), as rotas precisarão ser recriadas do zero.

---

## 2. Namespace do perfil público (`/organizacao/*` → `/perfil/*`)

- [x] **Renomear prefixo do perfil público para `/perfil/*`** — decidido e aplicado em 2026-04-15 ao final da Fase 5.

**Contexto.** A Fase 5 criou as rotas públicas em `/organizacao/empresa/[id]` e `/organizacao/fornecedor/[id]`. O prefixo `organizacao` foi escolhido na decisão #2 da abertura do plano para evitar colisão com as rotas internas logadas `/empresa/*` e `/fornecedor/*`. A ideia era puramente de namespacing anti-colisão, sem semântica externa.

**Dúvida do Arthur ao ver o mockup rodando.** `organizacao` não tem significado claro para o visitante externo. Um fornecedor chegando em `conectafornece.com.br/organizacao/empresa/vale` via link compartilhado ou busca orgânica não tem modelo mental para "organização" — o modelo dele é "página da Vale". URL de perfil público idealmente é curta, memorável e SEO-friendly. Também havia preocupação de que colocar o perfil público direto na raiz (`/empresa/[id]` e `/fornecedor/[id]`) colidiria com as rotas internas do painel logado, forçando uma refatoração grande.

**Alternativas consideradas.**

1. Manter `/organizacao/*`. Zero mudança, continua awkward externamente.
2. **Renomear para `/perfil/{empresa|fornecedor}/[id]`.** Baixo custo (rename mecânico). "Perfil" tem semântica clara para o visitante. Ainda é prefixo.
3. Mover painel interno para `/app/*` e liberar raiz para público (`/empresa/[id]`, `/fornecedor/[id]`). Convenção SaaS moderno (LinkedIn, Vercel, Linear, Notion). Médio custo (40+ rotas internas renomeadas).
4. Slug na raiz com palavras reservadas (modelo GitHub). Alto custo, regras invisíveis, frágil.

**Decisão.** Opção 2 aplicada imediatamente (2026-04-15) como paliativo baixo-custo. Opção 3 fica como alvo de longo prazo para quando o produto chegar em SEO — documentada aqui para não perder o norte.

**O que foi feito.**

- `src/app/organizacao/` renomeado para `src/app/perfil/` (4 arquivos).
- 9 referências hardcoded substituídas em `src/components/` e `src/app/` (diretório, perfil-publico, linkage, review-card, detalhe-contrato, card-candidatura-triagem, página do projeto visto por fornecedor).
- Decisão #2 do `execution-plan.md` atualizada com a nova convenção e ponteiro pra esta seção.
- Fonte U5.2 do `execution-plan.md` anota a mudança histórica.
- Smoke HTTP confirma `/perfil/empresa/vale`, `/perfil/fornecedor/1`, `/perfil/empresa/vale/reviews`, `/perfil/fornecedor/5/reviews` retornando 200; `/organizacao/empresa/vale` retorna 404 nativo.

**Resíduo para o longo prazo.** Se e quando a decisão do alvo 3 vier (mover painel interno para `/app/*`), aplicar no mesmo PR a raiz limpa: `/empresa/vale` substituindo `/perfil/empresa/vale`. Vai exigir renomear todos os links internos do painel (`/empresa/dashboard` → `/app/empresa/dashboard`, etc.).

---
