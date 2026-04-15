# Sistema de Notificações — ConectaFornece

> Artefato de design. Define o sistema transversal de notificações: catálogo de triggers, conteúdo, severidades, canais, agrupamento, preferências. Este é o último artefato de design antes da construção do mockup.

## Propósito

Notificações são o **sistema nervoso do produto** — como a plataforma avisa membros de eventos relevantes sem obrigar que fiquem atualizando páginas. Mal desenhadas, viram ruído e minam confiança. Bem desenhadas, encurtam ciclos de negociação, aumentam conversão e dão sensação de "o produto está cuidando de mim".

O desafio central é o balanceamento: **avisar demais gera fadiga; avisar de menos gera perda**. Este artefato define trigger por trigger quando vale notificar, onde (qual canal), e com que intensidade.

## Princípios

1. **Severidade manda no canal.** Nem tudo merece email. Crítico vai pra in-app + email. Informativo fica só in-app. Nunca spam.
2. **Uma notificação = uma ação possível.** Cada notificação aponta pra um lugar concreto (projeto, candidatura, sessão, etc.). Nunca é apenas "FYI" sem destino.
3. **Agrupar quando repete.** "3 novas mensagens no Projeto X" é melhor que 3 linhas separadas. Agrupamento por entidade reduz ruído sem esconder urgência.
4. **Ação resolve a notificação.** Se a notificação pede pra avaliar um contrato e o membro avalia, ela some automaticamente da caixa de "não-lidas". Não exige "marcar como lida" manual.
5. **Preferências respeitadas, defaults conservadores.** Defaults habilitam apenas in-app + email críticas. Usuário decide se quer mais.
6. **Histórico preservado.** Notificações nunca são deletadas silenciosamente; só arquivadas automaticamente após 90 dias (e permanecem buscáveis).
7. **Owner/Admin Consultoria tem regras próprias.** Receita, outreach e métricas geram notificações só pro owner; advisors têm notificações operacionais.

---

## Severidades

Cada trigger no catálogo carrega uma severidade que determina o tratamento:

| Severidade | Canal MVP | Visualização | Exemplo |
| --- | --- | --- | --- |
| **Crítica** | in-app + email | Drawer no topo, badge vermelho, primeira posição | Candidatura shortlistada, contrato fechado, sessão atribuída |
| **Importante** | in-app + email | Drawer normal, badge amarelo | Nova mensagem, proposta recebida, review liberada |
| **Informativa** | só in-app | Drawer normal, sem badge | Projeto recomendado, novo estudo de caso, membro aceitou convite |

Regra: o membro pode sempre **subir** ou **descer** um trigger nas preferências pessoais (ex.: "quero email pra toda mensagem nova" ou "não quero email nenhum").

---

## Canais

### MVP

- **In-app** — drawer lateral no topbar (5–10 mais recentes) + página dedicada com filtros. Todo trigger passa por aqui.
- **Email** — apenas severidade crítica e importante por padrão. Respeita preferência pessoal.

### Fora do MVP (backlog)

- Push mobile (requer PWA ou app nativo)
- WhatsApp (canal dominante no mercado B2B brasileiro — forte candidato a pós-MVP)
- SMS (baixo ROI vs WhatsApp)
- Webhooks pra integrações (empresas grandes com ERP)

---

## Catálogo de triggers

> Trigger = evento do sistema que gera uma ou mais notificações. Abaixo, todos os triggers do MVP agrupados por contexto do destinatário.

### Contexto Empresa

| # | Trigger | Destinatário | Severidade | Título | Ação |
| --- | --- | --- | --- | --- | --- |
| E1 | Nova candidatura recebida | Membros `owner`+`admin` do tenant empresa | Importante | "Nova candidatura em *Projeto X*" | Ir pra triagem |
| E2 | Projeto atingiu 5 candidaturas | Mesmos | Informativa | "*Projeto X* já tem 5 candidaturas aguardando triagem" | Ir pra triagem |
| E3 | Candidatura com 30d sem decisão | Mesmos | Importante | "Candidatura de *Fornecedor* aguarda decisão há 30 dias" | Ir pra candidatura |
| E4 | Candidatura expirada aos 45d | Mesmos | Informativa | "Candidatura de *Fornecedor* em *Projeto X* expirou" | Ir pra histórico |
| E5 | Nova mensagem em conversa ativa | Membros da conversa | Importante | "Nova mensagem de *Fornecedor* em *Projeto X*" | Ir pra conversa |
| E6 | Nova proposta formal recebida | `owner`+`admin` | Crítica | "Nova proposta formal de *Fornecedor* em *Projeto X*" | Ir pra proposta |
| E7 | Contrato aceito (proposta vencedora) | `owner`+`admin` | Crítica | "Contrato fechado com *Fornecedor* em *Projeto X*" | Ir pro contrato |
| E8 | Contrato encerrado — avalie | `owner`+`admin` | Importante | "Contrato encerrado com *Fornecedor*. Avalie em 14 dias." | Abrir form de review |
| E9 | Review do fornecedor liberada | `owner`+`admin` | Informativa | "A avaliação sobre *Fornecedor* no *Contrato X* foi publicada" | Ver review |
| E10 | Novo membro aceitou convite | `owner`+`admin` (menos o convidado) | Informativa | "*Maria Silva* entrou no tenant" | Ver membros |
| E11 | Perfil fornecedor ativado (dual) | `owner` | Informativa | "Perfil fornecedor ativado. Configure o perfil público." | Ir pra configuração |

### Contexto Fornecedor

| # | Trigger | Destinatário | Severidade | Título | Ação |
| --- | --- | --- | --- | --- | --- |
| F1 | Candidatura shortlistada | Membros `owner`+`admin` + autor_membro da candidatura | Crítica | "🎉 Você foi shortlisted em *Projeto X*!" | Ir pra conversa/proposta |
| F2 | Candidatura descartada | Mesmos | Importante | "Sua candidatura em *Projeto X* foi descartada. Motivo: *X*" | Ir pra candidatura + CTA 3 inline |
| F3 | Empresa pediu proposta formal | Mesmos | Crítica | "*Empresa X* solicitou proposta formal em *Projeto Y*" | Ir pra formulário |
| F4 | Nova mensagem em conversa ativa | Membros da conversa | Importante | "Nova mensagem de *Empresa* em *Projeto X*" | Ir pra conversa |
| F5 | Proposta vencedora | `owner`+`admin` + autor | Crítica | "🎉 Sua proposta foi aceita em *Projeto X*!" | Ir pro contrato |
| F6 | Proposta perdedora | Mesmos | Importante | "Sua proposta em *Projeto X* não foi selecionada" | Ir pro projeto + CTA feedback |
| F7 | Contrato encerrado — avalie | `owner`+`admin` | Importante | "Contrato encerrado com *Empresa X*. Avalie em 14 dias." | Abrir form de review |
| F8 | Review da empresa liberada | `owner`+`admin` | Informativa | "A avaliação sobre *Empresa X* no *Contrato Y* foi publicada" | Ver review |
| F9 | Novo projeto compatível (alto fit) | `owner`+`admin` | Informativa | "Novo projeto compatível: *Título*" | Ir pro projeto |
| F10 | Candidatura com 15d (auto-aviso ao fornecedor) | `owner`+`admin` + autor | Informativa | "Sua candidatura em *Projeto X* está há 15 dias aguardando" | Ir pra candidatura |
| F11 | Oferta de outreach recebida | `owner`+`admin` | Importante | "*Celso* enviou uma oferta personalizada: *tipo*" | Ir pra oferta |
| F12 | Sessão de Consultoria atribuída | `owner`+`admin` + solicitante | Crítica | "Sua sessão de *tipo* foi atribuída a *Advisor*" | Ir pra sessão |
| F13 | Sessão de Consultoria entregue | Mesmos | Crítica | "Sua sessão de *tipo* foi entregue. Veja os entregáveis." | Ir pros entregáveis |
| F14 | Advisor comentou em entregável | Mesmos | Importante | "*Advisor* respondeu ao seu comentário" | Ir pro comentário |

### Contexto Consultoria — Advisor

| # | Trigger | Destinatário | Severidade | Título | Ação |
| --- | --- | --- | --- | --- | --- |
| C1 | Nova sessão atribuída a mim | Advisor específico | Crítica | "Nova sessão atribuída: *tipo* para *Fornecedor*" | Abrir workspace |
| C2 | Sessão com prazo vencendo em 6h | Advisor atribuído | Crítica | "⚠ Sessão #*id* vence em 6 horas" | Abrir workspace |
| C3 | Fornecedor comentou em entregável | Advisor atribuído | Importante | "*Fornecedor* comentou em sua entrega" | Ir pro comentário |
| C4 | Sessão foi avaliada | Advisor atribuído | Informativa | "Sua sessão #*id* recebeu avaliação *nota*/5" | Ver avaliação |
| C5 | Outcome observado | Advisor atribuído | Informativa | "A candidatura/proposta da sua sessão #*id* foi *resultado*" | Ver sessão |

### Contexto Consultoria — Owner (Celso)

Todos os triggers do Advisor acima, além de:

| # | Trigger | Destinatário | Severidade | Título | Ação |
| --- | --- | --- | --- | --- | --- |
| O1 | Nova sessão na fila (não atribuída em 2h) | Owner | Importante | "*N* sessões aguardando atribuição" | Ir pra fila |
| O2 | Lead de outreach identificado | Owner | Informativa | "Novo lead: *Fornecedor* — *motivo*" | Ir pra outreach |
| O3 | Oferta de outreach aceita | Owner | Importante | "*Fornecedor* aceitou sua oferta de *tipo*" | Ver sessão criada |
| O4 | Receita do mês passou de *X* | Owner | Informativa | "Meta mensal de receita atingida 🎯" | Ver métricas |
| O5 | Advisor com avaliação média abaixo de 3.5 em 30d | Owner | Importante | "⚠ Advisor *X* com NPS baixo no último mês" | Ver perfil advisor |
| O6 | Estudo de caso publicado | Owner + todos os advisors | Informativa | "*Advisor X* publicou um novo estudo de caso: *título*" | Ir pro caso |

### Cross-contexto

| # | Trigger | Destinatário | Severidade | Título | Ação |
| --- | --- | --- | --- | --- | --- |
| X1 | Convite pra ser membro | Pessoa convidada (via email, não notificação in-app até aceitar) | Crítica | "Você foi convidado para o tenant *X* na ConectaFornece" | Aceitar convite (link) |
| X2 | Identidade legal do tenant alterada | `owner`+`admin` | Informativa | "Dados legais do tenant foram atualizados por *Membro*" | Ver configurações |
| X3 | Seu role foi alterado | Membro afetado | Importante | "Seu role no tenant *X* foi alterado para *Y*" | Ver permissões |
| X4 | Membro foi desativado | `owner`+`admin` + membro afetado | Informativa | "*Membro* foi desativado" | Ver membros |

---

## Template de conteúdo

Toda notificação segue o mesmo esqueleto:

```ts
Notificacao {
  id: string
  destinatario_membro_id: string
  tipo: string                   // código do trigger (E1, F3, C2, etc.)
  severidade: "critica" | "importante" | "informativa"

  titulo: string                 // < 80 chars, direto ao ponto, usa negrito no destacável
  corpo?: string                 // 1-2 frases de contexto adicional (opcional)
  acao_url: string               // pra onde clicar leva

  contexto_ref?: {
    entidade: "projeto" | "candidatura" | "proposta" | "contrato" | "conversa" | "sessao_consultoria" | "review" | "membro" | "organizacao"
    id: string
  }

  canais_enviados: ("in_app" | "email")[]
  canais_confirmados: ("in_app" | "email")[]   // onde o sistema confirmou entrega

  lida: boolean
  lida_em?: string
  arquivada: boolean             // automaticamente após 90d ou via ação do membro

  // Agrupamento:
  agrupamento_chave?: string     // string estável que permite agrupar notificações similares; null se única
  agrupamento_count?: number     // qtd agrupada nesse item (computado na leitura)

  criada_em: string
}
```

**Regras de escrita dos títulos:**

- Começa com o **evento** (não com o remetente): "Nova candidatura…" e não "Maria Silva enviou…"
- Nomes de entidades (projeto, empresa, fornecedor, advisor) **em destaque** (negrito no render)
- Emoji permitido em severidade **crítica positiva** (🎉 pra shortlist, proposta aceita) — nunca em negativa (não se comemora um descarte)
- ⚠ permitido em severidade **crítica com urgência de tempo** (sessão vencendo)
- Max ~80 caracteres no título

**Corpo:** opcional, 1-2 frases. Usado quando o título sozinho não dá contexto suficiente. Ex.: no descarte (F2), o corpo carrega o motivo: "Motivo: *Sem capacidade*. Quer entender o que fazer diferente? [CTA 3]"

---

## Agrupamento

Regras pra evitar spam de notificações similares:

1. **Chave de agrupamento estável.** Triggers agrupáveis geram `agrupamento_chave` = combinação determinística (ex.: `mensagem:conversa_id`). Notificações com mesma chave e mesmo destinatário dentro de uma janela temporal são agrupadas na visualização.
2. **Janela temporal padrão:** 2 horas. 3 mensagens no mesmo projeto em 2h viram "3 novas mensagens em *Projeto X*" (click abre a conversa).
3. **Exceções:** notificações críticas não-repetíveis nunca agrupam (ex.: shortlist, contrato fechado — cada evento é único e merece entrada dedicada).
4. **Contagem preservada.** O sistema guarda `agrupamento_count` calculado na leitura. Click na notificação agrupada leva pra destino comum (ex.: conversa com histórico marcado não-lido).

Triggers que usam agrupamento no MVP:

- E1 (nova candidatura) por projeto — "3 novas candidaturas em *Projeto X*"
- E5, F4 (mensagens) por conversa
- F9 (projeto compatível) — agrupa por dia em "*N* projetos compatíveis hoje"
- O2 (lead de outreach) — agrupa por dia

---

## Interações do usuário

Ações disponíveis em uma notificação (drawer ou página completa):

| Ação | Gatilho | Resultado |
| --- | --- | --- |
| Clicar na notificação | Click no item inteiro | Vai pra `acao_url`; marca como lida automaticamente |
| Marcar como lida | Botão "✓" ao hover | `lida = true`, `lida_em = agora` |
| Marcar como não-lida | Menu "⋯ → Marcar não-lida" | `lida = false`, `lida_em = null` |
| Arquivar | Menu "⋯ → Arquivar" | `arquivada = true`, sai da caixa ativa |
| Desarquivar | Botão na página "Arquivadas" | `arquivada = false` |
| Marcar todas como lidas | Botão no drawer ou topo da página | Bulk update |

### Auto-resolução

Alguns triggers têm auto-resolução baseada em ação no produto:

- E8/F7 (avalie o contrato) — auto-marca lida quando o membro submete a review
- F3 (pediram proposta formal) — auto-marca lida quando o membro abre o formulário
- C1 (sessão atribuída) — auto-marca lida quando o advisor abre o workspace

Auto-resolução é diferente de arquivamento — a notificação continua no histórico, só não aparece mais como "não-lida".

---

## Preferências do membro

Acesso em **Configurações pessoais → Notificações** (vive na tela de configurações pessoais do avatar, não nas configs do tenant).

Estrutura:

```
┌─ Preferências de notificação ──────────────────────────────┐
│                                                             │
│ Como quer ser avisado sobre cada tipo de evento?            │
│                                                             │
│ ─── Críticas ────────────────────────────────────────────   │
│ Shortlist / descarte / contrato fechado                     │
│ ☑ In-app   ☑ Email                                          │
│                                                             │
│ Sessão de Consultoria atribuída/entregue                    │
│ ☑ In-app   ☑ Email                                          │
│                                                             │
│ ─── Importantes ──────────────────────────────────────────  │
│ Novas mensagens                                             │
│ ☑ In-app   ☐ Email                                          │
│                                                             │
│ Nova candidatura / proposta recebida (contexto empresa)     │
│ ☑ In-app   ☑ Email                                          │
│                                                             │
│ ...                                                         │
│                                                             │
│ ─── Informativas ─────────────────────────────────────────  │
│ Projetos compatíveis recomendados                           │
│ ☑ In-app   ☐ Email                                          │
│                                                             │
│ Novo estudo de caso publicado                               │
│ ☐ In-app   ☐ Email                                          │
│                                                             │
│ ...                                                         │
│                                                             │
│ [Restaurar padrões]  [Salvar]                               │
└─────────────────────────────────────────────────────────────┘
```

**Defaults:**

- Críticas: in-app ON, email ON
- Importantes: in-app ON, email OFF (exceto candidatura/proposta recebida, que é ON)
- Informativas: in-app ON, email OFF

**Granularidade:** por **grupo** de triggers (não por trigger individual), senão a tela vira uma matriz incompreensível. Grupos refletem a estrutura do catálogo.

---

## Estados vazios

| Onde | Mensagem |
| --- | --- |
| Drawer sem notificações | "Nenhuma notificação no momento." |
| Página principal sem não-lidas | "Você está em dia com as notificações 🎯" |
| Página de arquivadas vazia | "Nada arquivado por enquanto." |
| Busca sem resultado | "Nenhuma notificação encontrada." |

---

## Decisões tomadas

1. **Severidade define canal padrão** — críticas e importantes vão por email; informativas só in-app.
2. **Canal fora do MVP** — push, WhatsApp, SMS, webhooks. WhatsApp é o mais forte candidato pra v2 (canal dominante B2B no Brasil).
3. **Agrupamento por janela de 2h** para triggers agrupáveis (mensagens, candidaturas, leads).
4. **Críticas não-repetíveis nunca agrupam** — shortlist, contrato, sessão atribuída são sempre entradas únicas.
5. **Auto-resolução por ação** — ex.: avaliar contrato resolve a notificação automaticamente. Reduz atrito de "marcar como lida" manual.
6. **Histórico preservado 90 dias ativos + arquivamento automático** — nunca deletado.
7. **Preferências em grupos, não em triggers individuais** — evita matriz impossível de entender.
8. **Defaults conservadores** — ninguém recebe email pra informativas sem opt-in.
9. **Convite de novo membro sai por email** (X1) antes da pessoa ter login — diferente dos demais triggers.
10. **Emoji permitido só em críticas positivas** (🎉) e urgências de tempo (⚠). Nunca em notícia ruim.
11. **Nomes de entidades em negrito** no título pra legibilidade; evita vocativo formal.
12. **Contexto do tenant single-role** — tenant que só é empresa nunca recebe triggers de fornecedor (e vice-versa). Triggers da Consultoria só pra tenants com `perfil_fornecedor_ativo`.

---

## Perguntas em aberto

| Pergunta | Como decidir |
| --- | --- |
| Email transacional: provider (Resend? Postmark? SendGrid?) e templating | Decisão de infra, pós-backend |
| Quando implementar WhatsApp: v2 ou v3? | Decisão de produto / feedback do Celso |
| Digest diário opcional — parte do MVP ou backlog? | Decisão de produto |
| Rate limiting: quantas notificações por hora/dia antes de forçar digest? | Decisão técnica |
| Som no drawer ao chegar notificação nova (real-time)? | Decisão de UX (pode ser distrativo) |
| Atualização real-time do drawer (WebSocket/SSE) ou polling? | Decisão técnica pós-backend |
| Advisor que entra num tenant (hipotético — ser membro de uma Organizacao cliente também) recebe quais notificações? | Provavelmente impossível no modelo atual (Advisor é separado de Membro), mas confirmar |
| Notificações podem ser "snoozed" (adiar por X horas)? | Decisão de UX |

---

## Delta para o data model

Adições necessárias em `design/data-model.md`:

- **`Notificacao`** — entidade nova (catálogo completo acima)
- **`PreferenciasNotificacao`** — subdocumento do `Membro` (ou entidade própria):
  ```ts
  PreferenciasNotificacao {
    membro_id: string
    preferencias: {
      [grupo: string]: { in_app: boolean; email: boolean }
    }
    atualizado_em: string
  }
  ```
  Grupos-chave: `criticas_handshake`, `criticas_consultoria`, `importantes_comunicacao`, `importantes_empresa`, `importantes_fornecedor`, `informativas_descoberta`, `informativas_conteudo`, `informativas_tenant`.

- **`Membro`** — pode ganhar `preferencias_notificacao_id?: string` se optarmos pela entidade separada; ou sub-doc inline em `Membro.preferencias_notificacao`. MVP: inline.

- **`SessaoConsultoria`** — nenhum novo campo aqui, mas confirmar que `entregue_em` dispara trigger F13 e `atribuida_em` dispara C1 + F12.

- **`Candidatura.decidida_em`** já existe — usado pra disparar F1 ou F2 dependendo de `status`.

- **`Contrato.reviews_liberadas_em`** já existe — dispara E9/F8.

- Regras de domínio (§8 do data-model) ganham invariantes adicionais:
  - "Nenhuma `Notificacao` é deletada — apenas arquivada."
  - "Auto-arquivamento acontece 90 dias após `criada_em` se `lida = true`."
  - "Triggers agrupáveis geram uma única `Notificacao` com `agrupamento_chave`; entradas subsequentes no mesmo grupo incrementam `agrupamento_count` ao invés de criar novo registro."

---

## Checklist para mockup

Componentes e telas:

- [ ] Badge de não-lidas no sino do topbar (count real)
- [ ] Drawer lateral de notificações (5–10 mais recentes, ordem cronológica descendente)
- [ ] Agrupamento visual (ex.: "3 novas mensagens em *Projeto X*")
- [ ] Ícone/cor por severidade (vermelho crítica, amarelo importante, cinza informativa)
- [ ] Botão "Marcar todas como lidas" no drawer
- [ ] Link "Ver todas" no rodapé do drawer
- [ ] Página dedicada de notificações com abas (Ativas / Arquivadas)
- [ ] Filtros na página: por severidade, por contexto, por período
- [ ] Busca textual na página
- [ ] Card de notificação com título + corpo + timestamp relativo ("há 2h") + ações (marcar lida, arquivar)
- [ ] Template de email transacional (formato básico pro MVP — subject + corpo HTML)
- [ ] Página de "Preferências de notificação" em Configurações pessoais
- [ ] Matriz de preferências por grupo × (in_app / email)
- [ ] Botão "Restaurar padrões"
- [ ] Estados vazios (drawer, página, busca, arquivadas)

Comportamentos automáticos:

- [ ] Click na notificação navega pra `acao_url` E marca como lida
- [ ] Auto-resolução: avaliar contrato marca E8/F7 como lidas
- [ ] Auto-resolução: abrir formulário de proposta marca F3 como lida
- [ ] Auto-resolução: abrir workspace de sessão marca C1 como lida
- [ ] Agrupamento em janela de 2h para triggers agrupáveis
- [ ] Auto-arquivamento após 90 dias das lidas
- [ ] Trigger E3 dispara aos 30 dias exatos desde `Candidatura.enviada_em`
- [ ] Trigger E4 dispara ao `Candidatura.status = expirada` (45 dias)
- [ ] Trigger F9 (projeto compatível) usa regras de matching de categoria + região + alto fit
- [ ] Triggers de Consultoria só disparam pra membros de tenants com `perfil_fornecedor_ativo`
- [ ] Preferências do membro respeitadas na hora de enviar (in-app sempre é gravado, email só se habilitado)
- [ ] Convite de novo membro (X1) vai por email ANTES do login existir (não gera in-app até aceitar)
