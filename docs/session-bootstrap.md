# Session Bootstrap — ConectaFornece Mockup

> Protocolo fixo que **toda sessão Claude nova deve seguir** antes de escrever qualquer código. O objetivo é garantir que qualquer sessão (inclusive depois de `/clear`) carregue o mesmo contexto mínimo e saiba exatamente o que fazer.

## Protocolo (7 passos)

1. **Ler `CLAUDE.md` + `AGENTS.md`** (o harness já carrega automaticamente).
2. **Ler `docs/execution-plan.md`** — começar pela seção **"Status geral (você está aqui)"**. Identificar:
   - Qual fase está ativa
   - Quais unidades já estão `✅`
   - Qual a próxima unidade `📋` (execução é sequencial, uma unidade por vez)
3. **Confirmar a unidade alvo com o Arthur** antes de começar. Se o Arthur já indicou na mensagem, pular confirmação e prosseguir.
4. **Ler as seções específicas de `design/`** listadas no campo **"Fonte"** da unidade. Não ler artefatos inteiros sem necessidade — seguir só as seções apontadas.
5. **Executar a unidade.** Respeitar escopo "dentro / fora", respeitar DoD, respeitar `visual-identity`.
6. **Ao terminar:**
   - Atualizar status da unidade no plan (`📋` → `✅`) + notas curtas se houver pendências
   - Parar e pedir revisão ao Arthur — nunca commitar sem aprovação explícita

## Regras invariantes

- **Design manda sobre código atual.** Se `src/` conflita com `design/`, o design ganha.
- **Mockup-only.** Zero backend, auth real, fetch, API routes.
- **UI em pt-BR com acentuação; identificadores em inglês; chaves de mock sem acento.**
- **Commits só com aprovação explícita do Arthur.** Nunca auto-commit.
- **Nunca criar `.md` novo** sem o Arthur pedir (documentação é `design/` e `docs/` — não adicionar outros).

## Quando parar e perguntar

- Unidade precisa de decisão de produto não prevista pelo design
- Dependência em `📋` está bloqueando
- Qualquer coisa que exigiria backend, auth, DB, email (ver lista em `AGENTS.md §"Decisions to raise"`)

## Clear entre fases

Ao terminar a última unidade de uma fase, o Arthur provavelmente vai rodar `/clear`. Isso é esperado e seguro — o estado persistente vive em:

- `docs/execution-plan.md` — progresso
- `docs/` em geral — contexto do projeto, decisões, roadmap
- `src/` — entregas
- `design/` — fonte de verdade (imutável entre fases)

Nenhum contexto da conversa anterior é necessário pra próxima fase se esse protocolo for seguido.

Cada execução deve ser feita uma fase, escolhida pelo Arthur do início ao fim. Ao fim da fase, execute o processo de verificação e revisão do que foi feito, com checks de DoD e execute o servidor dev e faça smoke test em todas as rotas que foram modificadas ou criadas durante a execução. Ao fim, faça o handover com um resumo do que foi feito junto com um plano do o que Arthur deve testar para validar, quais páginas abrir, quais fluxos seguir, etc. O objetivo é garantir que o Arthur tenha tudo que precisa para revisar e validar o trabalho feito, mesmo sem contexto da conversa anterior.
