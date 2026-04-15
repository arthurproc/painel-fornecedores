# Prompt: iniciar construção do mockup

Cole o conteúdo abaixo (entre os marcadores) em uma nova sessão.

---

## INÍCIO DO PROMPT

Olá. Você está começando uma fase de **construção do mockup visual** da ConectaFornece, uma plataforma B2B que conecta empresas industriais e fornecedores locais, com uma camada de consultoria embutida como produto de monetização.

Antes de qualquer linha de código, você precisa **ler os artefatos de design** e **produzir um plano de execução formal** que eu vou validar. Só depois do plano aprovado começamos a codar, e vamos em unidades pequenas e validáveis.

### 0. Primeira coisa: leia esses arquivos, nesta ordem

Não pule nenhum. Não resuma prematuramente. Leia tudo.

1. `AGENTS.md` — regras do projeto, stakeholders, convenções
2. `CLAUDE.md` — apenas confirma que importa `AGENTS.md`
3. `docs/project-context.md` — contexto estratégico (produto, monetização, moat do Celso, escopo histórico, constraints)
4. `docs/roadmap.md` — fases + marcos + decisões pendentes
5. `design/README.md` — índice dos artefatos de design
6. `design/handshake-flow.md` — fluxo core do produto
7. `design/data-model.md` — entidades, estados, regras de domínio
8. `design/info-architecture.md` — navegação + dashboards + onboarding
9. `design/public-profiles.md` — perfis públicos
10. `design/consulting-layer.md` — produto de consultoria
11. `design/notifications.md` — sistema de notificações
12. `meetings/r1-celso/one-pager.md` — resumo do produto em 1 página (útil pra confirmar entendimento)

### 1. Contexto obrigatório antes de qualquer ação

**O produto em uma frase:** Airbnb pra contratação industrial, com um coach embutido (a consultoria do Celso) no fluxo do fornecedor.

**Quatro pilares do produto desenhado:**

1. **Handshake em 3 etapas** entre empresa e fornecedor: candidatura leve → shortlist (triagem da empresa) → proposta formal.
2. **Avaliação two-way** após cada contrato encerrado, com release simultâneo em 14 dias, 5 dimensões por lado.
3. **Consultoria como produto formal** com catálogo (4 tipos de serviço), workspace pra advisors, outreach proativo e estudos de caso curados.
4. **Tenant dual** — uma mesma `Organizacao` pode ter perfil empresa **e** perfil fornecedor ativos simultaneamente, com switcher de contexto no topbar.

### 2. ESTADO DO CÓDIGO ATUAL — CRÍTICO LER E ENTENDER

O código em `src/` (páginas em `src/app/`, componentes em `src/components/`, dados em `src/lib/mock-data.ts`) **foi construído antes do redesign completo**. Ele reflete uma visão **mais simples e antiga** do produto — basicamente uma planilha de projetos + consultoria avulsa.

**Isto significa:**

- O código atual **não é a fonte da verdade**. Os artefatos em `design/` são.
- O código atual **é efêmero**: serve como ponto de partida mental e referência visual, mas **deve ser refatorado ou deletado agressivamente** onde conflitar com os designs.
- Nunca deixe o código atual te constranger. Se um componente, página, tipo ou entidade existente não bate com o design, o design ganha.
- Se o código atual ajuda (ex.: estrutura de rotas já correta, shadcn components já instalados, tokens OKLCH em `globals.css`), reaproveite. Se atrapalha, remova sem cerimônia.
- Exemplos concretos do que provavelmente vai mudar:
  - `Projeto.empresa: string` → `Projeto.empresa_id` + entidade `Organizacao`
  - `Fornecedor.avaliacao: number` → `ReputacaoAgregada` multidimensional
  - `Proposta` atual (que mistura candidatura + proposta formal) → separar em `Candidatura` + `Proposta`
  - `Projeto.fechamento` aninhado → entidade `Contrato` própria
  - Ausência total de `Organizacao`, `Membro`, `Conversa`, `Mensagem`, `Review`, `Advisor`, `SessaoConsultoria`, etc. → criar todas

### 3. Sua primeira tarefa: PLANO DE EXECUÇÃO

Antes de qualquer código, você vai produzir um **plano formal de execução** em `docs/execution-plan.md`. Regras:

**O plano deve ser:**

- **Dividido em unidades de execução** (ver definição abaixo), numeradas e com dependências explícitas.
- **Ordenado logicamente**: dependências vêm antes. Siga a sequência do `docs/roadmap.md` (fases 1-7) como espinha dorsal, mas quebre cada fase em unidades menores.
- **Completo**: ao final das unidades, o mockup está construído de ponta a ponta, alinhado com os designs.
- **Realista**: cada unidade pode ser construída, revisada e aprovada em uma rodada de trabalho (não uma feature gigante que ninguém consegue revisar).

**Para cada unidade de execução, o plano deve conter:**

- **ID** (ex.: `U1.1`, `U2.3`) — facilita referência
- **Título** (uma frase)
- **Fase** (1-7 do roadmap)
- **Escopo** — o que está DENTRO e o que está FORA desta unidade
- **Fonte de verdade** — qual artefato de design e qual seção específica guiam a construção
- **Entregáveis concretos** — arquivos criados/modificados, entidades criadas, rotas adicionadas, comportamentos implementados
- **Critério de aceitação** — como saber que tá pronto (lista verificável)
- **Dependências** — quais unidades precisam estar completas antes
- **Riscos / perguntas em aberto** — coisas que podem travar ou que precisam de decisão

### 4. Definição de "unidade de execução"

Uma unidade é válida se:

- ✅ **Pequena o suficiente** pra ser revisada em uma sessão (~30-90 min de código).
- ✅ **Auto-contida**: o mockup continua navegável/renderizável após ela.
- ✅ **Tem "pronto" objetivo**: critério de aceitação é lista checkável, não "está bom".
- ✅ **Mapeia pra uma ou mais linhas dos checklists** em `design/*.md`.
- ✅ **Não mistura camadas sem necessidade**: ex.: criar data model é uma unidade; construir sidebar é outra.

Uma unidade **não é válida** se:

- ❌ Requer decisão de produto que ainda está em aberto (flag no plano, não construir).
- ❌ Deixa o mockup quebrado.
- ❌ "Refactor geral" sem escopo claro.
- ❌ Mistura dados + navegação + telas + comportamento tudo de uma vez.

### 5. Estimativa de quantas unidades esperar

Não chute antes de planejar, mas pra calibrar: provavelmente entre **25 e 50 unidades** no total, distribuídas assim (aproximadamente):

- Fase 1 (mock-data.ts refactor): 5-8 unidades (uma ou duas por grupo de entidades)
- Fase 2 (navegação): 3-5 unidades
- Fase 3 (dashboards): 3-5 unidades (um por contexto + um pra estado vazio)
- Fase 4 (telas do handshake): 8-12 unidades (uma por tela + interações)
- Fase 5 (perfis públicos): 3-5 unidades
- Fase 6 (Consultoria): 5-8 unidades
- Fase 7 (notificações): 2-4 unidades

Se o total passar de 60, você tá quebrando demais. Se passar menos que 20, tá quebrando de menos.

### 6. Como trabalhar em cada unidade (depois do plano aprovado)

1. **Leia** a seção do artefato de design que é fonte de verdade pra unidade.
2. **Confirme** com o Arthur se algo ficou ambíguo antes de codar.
3. **Construa** alinhado com o design, respeitando `AGENTS.md` e a skill `visual-identity`.
4. **Valide** o checklist da unidade (o que você mesmo escreveu no plano).
5. **Apresente** ao Arthur pra aprovação antes de seguir pra próxima.
6. **Atualize** o plano riscando a unidade completa (ou marcando status).
7. **Commit** só quando o Arthur pedir explicitamente — nunca auto-commit.

### 7. Regras não-negociáveis

- **Design manda.** Se o código atual conflita com o design, o design ganha. Não preserve código atual "por precaução".
- **UI em português brasileiro**, com acentuação correta (`região`, `serviço`, `negócios`). Identificadores em inglês, chaves de objeto sem acento (`titulo`, `descricao`, `regiao`) — ver `AGENTS.md`.
- **shadcn/ui** é a biblioteca de componentes. Não instale outra UI lib alongside.
- **Tailwind v4** com tokens em `src/app/globals.css`. Use a skill `visual-identity` quando for estilizar.
- **Next.js 16 App Router.** Leia `node_modules/next/dist/docs/` quando tiver dúvida — a versão é recente e pode diferir do treinamento.
- **Mockup-only, zero backend.** Nada de `fetch`, nada de API routes, nada de auth real. Dados mockados em `src/lib/mock-data.ts`.
- **Commits pequenos e revisáveis**, um por unidade quando fizer sentido. Nunca commitar sem o Arthur aprovar.
- **Não crie documentação markdown nova** (READMEs, docs) sem o Arthur pedir explicitamente.
- **Data fictícia** no mockup deve respeitar o horizonte 2026 e formato BR (`DD/MM/YYYY`, `R$ X.XXX,XX`).

### 8. Primeira ação recomendada

Quando você confirmar que leu tudo:

1. **Faça uma auditoria** rápida do código atual em `src/app/` e `src/lib/mock-data.ts` — não precisa ler cada linha, só mapear: quais rotas existem, quais entidades estão no mock, qual é o estado geral.
2. **Produza** o `docs/execution-plan.md` conforme definido na seção 3.
3. **Sinalize ao Arthur** quando estiver pronto pra revisão. Não comece a codar sem a aprovação do plano.

Se alguma informação crítica estiver faltando ou conflitante nos artefatos de design, pare e pergunte. Não chute.

### 9. Comunicação com o Arthur

- **Idioma:** português brasileiro em todas as mensagens.
- **Tom:** direto, colaborativo, admitir quando não sabe.
- **Densidade:** textos curtos entre ações; detalhe só quando necessário.
- **Não invente decisões:** qualquer coisa que não estiver explícita nos designs exige pergunta antes.

### 10. Se você chegou até aqui

Comece confirmando em uma frase o que você entendeu como objetivo desta sessão. Depois siga o passo 8.

## FIM DO PROMPT

---

## Observações pra o Arthur (não fazem parte do prompt)

- **Por que esse prompt é longo:** numa nova sessão, o agente não tem contexto. Ele precisa ser carregado explicitamente via leitura dos docs listados na seção 0. Todo o contexto estratégico e técnico vive nos arquivos do projeto (sem uso de memória automatizada).
- **Como usar:** cola o conteúdo entre `## INÍCIO DO PROMPT` e `## FIM DO PROMPT` em uma sessão nova e apertada pra começar. O agente vai ler os docs, te mandar uma confirmação curta, fazer auditoria, e produzir o plano.
- **O que fazer se o plano vier ruim:** peça ajustes específicos. Ex.: "quebra a unidade U4.2 em duas", "falta a unidade de X", "inverte U3.1 e U3.2". Não aceite plano vago.
- **Quando aprovar o plano:** fale literal "plano aprovado, pode começar pela unidade U1.1" (ou a primeira do plano). A partir daí é unidade por unidade.
- **Iteração comigo (você + eu agora):** se durante a construção em nova sessão aparecer algo que precisa mudar no design, o agente dessa sessão nova deve pausar e pedir pra você voltar aqui comigo pra ajustar o design antes.
