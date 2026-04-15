# Meetings

Materiais de reunião com o cliente (Celso) e eventuais stakeholders futuros. Diferente de `design/`, que descreve o produto, esta pasta descreve **como a gente comunica o produto**.

Conteúdo aqui tende a ser **efêmero** — cada subpasta é amarrada a um evento específico e envelhece rápido. Não é material de referência permanente.

## Convenção

Uma subpasta por reunião, nomeada `{ordem}-{interlocutor}[-data opcional]/`:

- `r1-celso/` — primeira reunião com Celso (apresentação do produto designed)
- `r2-celso/` — segunda reunião (decisões pendentes + mockup navegável) — a criar
- futuras: `r3-celso/`, ou `r1-novo-cliente/` se outros stakeholders entrarem

Dentro de cada subpasta, nomes curtos por tipo:

- `deck.md` — slide deck (Marp)
- `one-pager.md` — resumo pra entregar no fim da reunião
- `roteiro.md` — colinha interna do Arthur (não é material pro interlocutor)
- `pos-reuniao.md` — anotações do que foi decidido / próximos passos (opcional, depois do evento)

## Workflow

1. **Antes:** escreve `deck.md`, `one-pager.md`, `roteiro.md` na subpasta.
2. **Renderiza** via Marp: `marp meetings/r1-celso/deck.md --pdf` (ver `design/README.md` §convenções).
3. **Durante:** segue `roteiro.md` como guia; anota no caderno físico.
4. **Depois:** cria `pos-reuniao.md` com decisões tomadas, pontos em aberto, e próximos artefatos a ajustar em `design/`.

## Reuniões

| ID | Interlocutor | Data | Objetivo | Status |
| --- | --- | --- | --- | --- |
| r1-celso | Celso | a agendar | Apresentação do produto designed + áreas de decisão | 📋 preparação |
