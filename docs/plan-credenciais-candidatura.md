# Plano de Ação — Credenciais, Documentos e Match na Candidatura

> Plano operacional para execução em **sessão limpa**, já com decisões fechadas com o Arthur. Este plano existe para orientar a implementação ponta a ponta do refinamento entre **requisitos técnicos**, **credenciais exigidas** e **documentos exigidos**, incluindo o fluxo de candidatura e a gestão de comprovantes no perfil do fornecedor.

## Objetivo

Eliminar a ambiguidade atual entre certificações, requisitos e documentos, introduzindo:

1. um **catálogo canônico de credenciais**;
2. um local explícito para o fornecedor manter **credenciais** e **comprovantes** no perfil;
3. um fluxo de candidatura com **match** entre os documentos exigidos pelo projeto e os comprovantes já cadastrados no perfil;
4. um modelo de dados capaz de sustentar, no futuro, reaproveitamento real de documentos por caminho de arquivo.

## Contexto atual auditado

### Dados atuais

- `Fornecedor` (`src/lib/mock-data/fornecedores.ts`) guarda apenas `certificacoes: string[]`.
- `Projeto` (`src/lib/mock-data/projetos.ts`) hoje mistura:
  - `requisitos: string[]`
  - `documentos_exigidos: DocumentoExigido[]`
  - `criterios_selecao: string[]`
- `Candidatura` (`src/lib/mock-data/candidaturas.ts`) ainda não separa claramente os anexos por documento exigido.
- Não existe entidade canônica para credenciais; nomes podem divergir (`NR-22`, `NR22`, `Certificado NR-22`).

### UI atual auditada

- `/empresa/novo-projeto` usa `FormularioProjeto` (`src/components/empresa/formulario-projeto.tsx`) e hoje tem:
  - requisitos técnicos
  - critérios de seleção
  - documentos exigidos
- `/fornecedor/projeto/[id]/candidatar` usa `FormularioCandidatura` (`src/components/handshake/formulario-candidatura.tsx`) e hoje permite apenas:
  - pitch
  - contratos destacados
  - capacidade declarada
  - faixa de preço
  - seleção de certificações já existentes no perfil
- `/configuracoes` (`src/app/configuracoes/page.tsx`) ainda é majoritariamente **read-only**.
- `/fornecedor/perfil` exibe apenas um card simples de `Certificações` baseado em `fornecedor.certificacoes`.

### Design/docs auditados

- `design/data-model.md` ainda não modela corretamente o vínculo entre documento exigido, anexo da candidatura e documento do perfil.
- `design/handshake-flow.md` ainda trata genericamente “certificações/documentos aplicáveis” na candidatura.
- `design/info-architecture.md` cita certificações no perfil fornecedor, mas não descreve um gerenciador de comprovantes.

## Decisões fechadas com Arthur

### Regras de produto

1. **Não bloquear o envio da candidatura por falta de comprovante.**
   Mostrar alertas fortes e estados de pendência, mas permitir envio mesmo com documentos obrigatórios pendentes.

2. **Reuso de documento do perfil na candidatura = reutilização do mesmo caminho de arquivo.**
   No mockup, a candidatura deve referenciar o mesmo documento já cadastrado no perfil do fornecedor, não criar cópia do arquivo.

3. **Gestão de credenciais e comprovantes fica em** `Configurações > Perfil Fornecedor`.

4. **Credenciais usam somente catálogo central canônico.**
   Não haverá criação livre de novas credenciais no formulário nem em configurações.

5. **Cobrir vários estados no mock atual.**
   O seed deve demonstrar:
   - match completo
   - credencial presente sem comprovante
   - documento sem correspondência automática
   - pendência total

6. **Anexo manual durante candidatura deve salvar também no perfil.**
   O documento criado manualmente entra no perfil do fornecedor para reutilização futura.

7. **Perfil público do fornecedor mostra apenas os nomes das credenciais.**
   Não expor status de comprovante vigente no perfil público.

8. **Na aba `Perfil Fornecedor` de `/configuracoes`, o escopo editável desta mudança é focado em credenciais e documentos.**
   O restante da aba continua read-only.

## Nova modelagem conceitual

Separar em 3 camadas:

### 1. Requisitos técnicos

Condições operacionais/técnicas que o fornecedor precisa atender.

Exemplos:

- experiência em exaustão industrial pesada
- equipe com engenheiro mecânico responsável
- capacidade de mobilização em 72h
- soldador MIG/MAG qualificado

Natureza:

- texto livre com autocomplete de frases sugeridas
- **não** é documento
- **não** é credencial canônica

### 2. Credenciais exigidas

Credenciais formais padronizadas que o fornecedor precisa possuir.

Exemplos:

- NR-10
- NR-22
- ISO 9001
- CREA-MG
- Licença IBAMA
- RNTRC

Natureza:

- referenciam um catálogo canônico
- sustentam match consistente e futura lógica automática

### 3. Documentos exigidos

Arquivos/comprovantes que precisam ser anexados como evidência.

Exemplos:

- Certificado NR-22 vigente
- ART assinada
- Portfólio de contratos similares
- Apólice de seguro

Natureza:

- metadata-only no mock
- podem opcionalmente referenciar uma credencial canônica

## Mudanças de modelo de dados

### A. Novo catálogo canônico de credenciais

Criar novo arquivo:

- `src/lib/platform-credentials.ts`

Tipo sugerido:

```ts
export interface CredencialCatalogo {
  id: string
  nome: string
  tipo: "certificacao" | "licenca" | "registro" | "norma"
  sinonimos: string[]
  documento_padrao_nome?: string
  ativo: boolean
}
```

Catálogo inicial mínimo:

- `nr_10`
- `nr_10_sep`
- `nr_11`
- `nr_12`
- `nr_13`
- `nr_22`
- `nr_35`
- `iso_9001`
- `iso_14001`
- `iso_45001`
- `crea_mg`
- `licenca_ibama`
- `rntrc`
- `mte`
- `sassmaq`
- `pbqp_h`

Opcionalmente incluir helpers:

- `getCredencialById(id)`
- `getCredencialNome(id)`
- `getDocumentoPadraoByCredencial(id)`

### B. Evolução de `Projeto`

Arquivo:

- `src/lib/mock-data/projetos.ts`

Estado atual:

- `requisitos: string[]`

Estado alvo:

```ts
requisitos_tecnicos: string[]
credenciais_exigidas: CredencialExigida[]
documentos_exigidos: DocumentoExigido[]
criterios_selecao: string[]
```

Tipos sugeridos:

```ts
export interface CredencialExigida {
  credencial_id: string
  obrigatoria: boolean
  observacao?: string
}

export interface DocumentoExigido {
  id: string
  nome: string
  obrigatorio: boolean
  observacao?: string
  credencial_relacionada_id?: string
}
```

Observação:

- `DocumentoExigido.id` passa a ser necessário para vincular anexos da candidatura.
- `credencial_relacionada_id` é opcional porque há documentos sem credencial associada.

### C. Evolução de `Fornecedor`

Arquivo:

- `src/lib/mock-data/fornecedores.ts`

Estado atual:

- `certificacoes: string[]`

Estado alvo:

```ts
credenciais_ids: string[]
documentos_empresa: DocumentoEmpresa[]
```

Tipo sugerido:

```ts
export interface DocumentoEmpresa {
  id: string
  nome: string
  tipo: "credencial" | "portfolio" | "seguro" | "laudo" | "outro"
  credencial_id?: string
  arquivo_nome: string
  arquivo_caminho: string
  validade?: string
  status: "vigente" | "vencido" | "em_analise"
  enviado_em: string
  observacao?: string
}
```

Notas:

- `arquivo_caminho` deve existir porque a decisão foi modelar o reuso como apontamento ao mesmo caminho de arquivo.
- No mockup continua sendo apenas metadata (string), sem storage real.
- `credenciais_ids` representa posse formal; `documentos_empresa` representa a evidência cadastral.

### D. Evolução de `Candidatura`

Arquivo:

- `src/lib/mock-data/candidaturas.ts`

Estado alvo:

```ts
documentos_anexados: DocumentoCandidaturaAnexado[]
```

Tipo sugerido:

```ts
export interface DocumentoCandidaturaAnexado {
  documento_exigido_id: string
  documento_empresa_id?: string
  nome: string
  origem: "perfil" | "manual"
  arquivo_caminho: string
  status: "anexado" | "pendente"
}
```

Regra de modelagem:

- quando a origem for `perfil`, `arquivo_caminho` deve repetir o caminho já salvo no documento da empresa;
- quando a origem for `manual`, o documento criado deve ser salvo também em `fornecedor.documentos_empresa` e então referenciado pela candidatura.

## Mudanças de UI

### 1. Formulário de projeto

Arquivo principal:

- `src/components/empresa/formulario-projeto.tsx`

#### Estrutura alvo

Manter os blocos existentes e reorganizar a semântica:

1. `Requisitos técnicos`
2. `Credenciais exigidas`
3. `Critérios de seleção`
4. `Documentos exigidos`

#### Requisitos técnicos

Manter input livre com autocomplete, usando catálogo de frases sugeridas.

#### Credenciais exigidas

Novo bloco com seleção **somente via catálogo canônico**.

UX:

- autocomplete/multi-add
- sem texto livre
- cada credencial adicionada pode ser marcada como:
  - `Obrigatória`
  - `Desejável` (opcional, se decidir suportar agora)

Para esta implementação, se precisar simplificar, usar apenas:

- `Obrigatória` / `Opcional`

#### Documentos exigidos

Bloco atual evolui para:

- nome do documento
- obrigatório/opcional
- observação
- `credencial relacionada` (autocomplete do catálogo, opcional)

Atalho recomendado:

- se a empresa selecionar uma credencial, sugerir automaticamente o nome padrão do documento (`documento_padrao_nome`).

Exemplo:

- credencial: `NR-22`
- sugestão de documento: `Certificado NR-22 vigente`

#### Payload do formulário

`ProjetoRascunhoPayload` deve ser atualizado para refletir:

- `requisitos_tecnicos`
- `credenciais_exigidas`
- `documentos_exigidos`

### 2. Exibição de projeto

Arquivos impactados:

- `src/components/handshake/blocos-projeto.tsx`
- `src/app/fornecedor/projeto/[id]/page.tsx`
- `src/app/empresa/projeto/[id]/page.tsx`

#### Blocos necessários

1. `BlocoRequisitosTecnicos`
2. `BlocoCredenciaisExigidas`
3. `BlocoDocumentos`

#### Microcopy

- `Requisitos técnicos`
- `Credenciais exigidas`
- `Documentos exigidos para anexar`

`BlocoDocumentos` deve exibir, quando existir:

- documento relacionado à credencial `X`

### 3. Fluxo de candidatura

Arquivos impactados:

- `src/components/handshake/formulario-candidatura.tsx`
- `src/app/fornecedor/projeto/[id]/candidatar/page.tsx`

#### Estrutura alvo do formulário

Manter:

- pitch
- contratos destacados
- capacidade declarada
- faixa de preço

Substituir a seção atual de `Certificações aplicáveis` por uma camada única:

1. `Documentos para esta candidatura`

#### Seção — Documentos para esta candidatura

Para cada `documento_exigido` do projeto, renderizar uma linha/cartão com:

- nome
- obrigatório/opcional
- observação
- credencial relacionada (se houver)
- estado de match
- CTA de ação

Estados desejados no mock:

1. `Sugestão pronta para anexar do perfil`
2. `Credencial cadastrada, mas sem comprovante`
3. `Sem correspondência automática`
4. `Já anexado`

#### Regras de match

Se `documento_exigido.credencial_relacionada_id` existir:

1. procurar `fornecedor.credenciais_ids`;
2. procurar em `fornecedor.documentos_empresa` um documento com o mesmo `credencial_id` e status adequado;
3. se encontrado, oferecer `Anexar do perfil`.

#### Ações por documento

- `Anexar do perfil`
- `Anexar manualmente`
- `Trocar anexo`
- `Remover`
- `Ir para perfil` (se quiser oferecer atalho)

#### Anexo manual

Como o mock é metadata-only:

permitir criar inline um documento com:

- nome do arquivo
- validade opcional
- observação opcional

Ao confirmar:

1. salvar em `fornecedor.documentos_empresa`
2. reutilizar o mesmo `arquivo_caminho`
3. registrar o vínculo na candidatura

#### Regra de submissão

Decisão fechada:

- **não bloquear envio**

Comportamento esperado:

- mostrar um resumo de pendências acima do botão `Enviar candidatura`
- destacar documentos obrigatórios não anexados
- permitir envio mesmo assim

### 4. Configurações do fornecedor

Arquivo principal:

- `src/app/configuracoes/page.tsx`

Observação auditada:

- não existe hoje um componente separado para o perfil fornecedor; a aba está inline e read-only.

#### Escopo desta mudança

Transformar apenas parte da aba `Perfil Fornecedor` em editável para:

1. `Credenciais cadastradas`
2. `Documentos da empresa`

Manter o restante da aba como está, em modo somente leitura.

#### Seção — Credenciais cadastradas

Componente sugerido:

- `src/components/configuracoes/form-credenciais-fornecedor.tsx`

Comportamento:

- autocomplete do catálogo canônico
- multi-add
- remoção
- sem texto livre

#### Seção — Documentos da empresa

Componente sugerido:

- `src/components/configuracoes/form-documentos-fornecedor.tsx`

Campos por documento:

- nome
- tipo
- credencial relacionada (opcional)
- nome do arquivo
- caminho do arquivo mock
- validade
- status
- observação

Também mostrar lista dos documentos já cadastrados.

#### Resumo de cobertura

Adicionar um pequeno resumo:

- `X credenciais cadastradas`
- `Y comprovantes vigentes`
- `Z credenciais sem comprovante`

### 5. Perfil do fornecedor

Arquivo:

- `src/app/fornecedor/perfil/page.tsx`

Mudanças:

- substituir o card atual de `Certificações`
- exibir nomes das credenciais canônicas do fornecedor
- adicionar resumo interno opcional de cobertura documental
- CTA `Gerenciar em Configurações`

#### Perfil público

Arquivo potencialmente impactado:

- `src/app/perfil/fornecedor/[id]/page.tsx`

Decisão fechada:

- mostrar **somente os nomes das credenciais**
- **não** mostrar status de comprovante vigente publicamente

## Mudanças de seed/mock

### Objetivo da cobertura

O mock do fornecedor logado precisa demonstrar ao menos:

1. credencial exigida encontrada + comprovante vigente disponível
2. credencial encontrada + sem comprovante correspondente
3. documento exigido sem credencial relacionada, exigindo anexo manual
4. credencial não cadastrada no perfil

### Fornecedor logado (Metalúrgica XYZ)

Preparar o seed para que o contexto fornecedor atual exiba exemplos concretos.

Exemplo de composição recomendada:

- `credenciais_ids`: `iso_9001`, `crea_mg`, `nr_10`
- `documentos_empresa`:
  - comprovante vigente de `ISO 9001`
  - comprovante vigente de `CREA-MG`
  - credencial `NR-10` sem comprovante, para demonstrar gap
  - um `portfólio de contratos similares`

### Projetos do seed

Ao menos um projeto acessível ao fornecedor logado deve ter:

- `requisitos_tecnicos`
- `credenciais_exigidas` variadas
- `documentos_exigidos` com e sem vínculo a credencial

### Candidaturas do seed

Criar/ajustar casos para que o fluxo demonstre:

- anexo vindo do perfil
- documento salvo manualmente e reaproveitado
- pendência visível sem bloqueio de envio

## Arquivos prováveis de implementação

### Dados e tipos

- `src/lib/platform-credentials.ts` (novo)
- `src/lib/project-form-options.ts` (ajustar se necessário)
- `src/lib/mock-data/projetos.ts`
- `src/lib/mock-data/fornecedores.ts`
- `src/lib/mock-data/candidaturas.ts`
- `src/lib/mock-data/index.ts` ou reexports relacionados

### UI do projeto e candidatura

- `src/components/empresa/formulario-projeto.tsx`
- `src/components/handshake/blocos-projeto.tsx`
- `src/components/handshake/formulario-candidatura.tsx`
- `src/app/fornecedor/projeto/[id]/page.tsx`
- `src/app/empresa/projeto/[id]/page.tsx`
- `src/app/fornecedor/projeto/[id]/candidatar/page.tsx`

### Configurações/perfil do fornecedor

- `src/app/configuracoes/page.tsx`
- `src/app/fornecedor/perfil/page.tsx`
- `src/app/perfil/fornecedor/[id]/page.tsx`
- `src/components/configuracoes/form-credenciais-fornecedor.tsx` (novo)
- `src/components/configuracoes/form-documentos-fornecedor.tsx` (novo)

### Componentes utilitários

- renomear `src/components/empresa/string-combobox.tsx` para algo mais aderente, como `string-autocomplete-input.tsx`, se fizer sentido durante a implementação

## Etapas de execução recomendadas

1. **Ler este plano + os trechos citados de `design/`.**
2. **Criar catálogo canônico de credenciais.**
3. **Refatorar tipos/seed de `Projeto`, `Fornecedor` e `Candidatura`.**
4. **Atualizar `FormularioProjeto` para separar requisitos, credenciais e documentos.**
5. **Atualizar os blocos de leitura do projeto.**
6. **Transformar a aba `Perfil Fornecedor` de `/configuracoes` para suportar credenciais e documentos.**
7. **Atualizar `/fornecedor/perfil` e perfil público do fornecedor.**
8. **Reescrever a seção documental do `FormularioCandidatura`.**
9. **Garantir que anexo manual também salva no perfil.**
10. **Ajustar os seeds para cobrir vários estados de match.**
11. **Atualizar docs de design/contexto.**
12. **Validar com lint/build/dev/smoke test.**

## Documentação que deve ser atualizada junto

Esta implementação **não termina** sem revisar a documentação abaixo:

- `design/data-model.md`
- `design/handshake-flow.md`
- `design/info-architecture.md`

Atualizações esperadas:

### `design/data-model.md`

- incluir `CredencialCatalogo`
- incluir `DocumentoEmpresa`
- atualizar `Projeto`
- atualizar `Candidatura`
- registrar a separação entre requisitos técnicos, credenciais e documentos

### `design/handshake-flow.md`

- atualizar Fase 0 para listar `credenciais exigidas`
- atualizar Fase 1 para descrever:
  - match com perfil do fornecedor
  - sugestão de anexar do perfil
  - anexo manual metadata-only
- manter coerência com a decisão de não bloquear envio

### `design/info-architecture.md`

- atualizar a descrição da aba `Perfil Fornecedor` em `/configuracoes`
- explicitar que o fornecedor gerencia ali:
  - credenciais canônicas
  - comprovantes/documentos internos

## Critérios de aceite

### Dados

- [ ] Existe catálogo canônico de credenciais centralizado
- [ ] `Projeto` separa requisitos técnicos, credenciais exigidas e documentos exigidos
- [ ] `Fornecedor` tem credenciais + documentos da empresa
- [ ] `Candidatura` registra documentos anexados e origem do anexo

### Formulário de projeto

- [ ] Empresa consegue cadastrar requisitos técnicos por texto livre com sugestões
- [ ] Empresa consegue selecionar credenciais exigidas apenas do catálogo canônico
- [ ] Empresa consegue cadastrar documentos exigidos relacionando-os opcionalmente a credenciais

### Configurações/perfil fornecedor

- [ ] Fornecedor consegue cadastrar/remover credenciais em `/configuracoes`
- [ ] Fornecedor consegue cadastrar/visualizar documentos da empresa em `/configuracoes`
- [ ] `/fornecedor/perfil` reflete os dados novos
- [ ] Perfil público mostra apenas nomes das credenciais

### Candidatura

- [ ] Fluxo de candidatura mostra documentos exigidos do projeto
- [ ] Cada documento mostra estado de match com o perfil
- [ ] Se houver documento compatível no perfil, existe ação `Anexar do perfil`
- [ ] Anexo manual salva também no perfil do fornecedor
- [ ] A candidatura pode ser enviada mesmo com pendências, mas com alertas claros

### Mock/seed

- [ ] Há exemplos visíveis de match completo, parcial e ausente para o fornecedor logado

### Docs

- [ ] `design/data-model.md` atualizado
- [ ] `design/handshake-flow.md` atualizado
- [ ] `design/info-architecture.md` atualizado

### Verificação técnica

- [ ] `npm run build` passa
- [ ] lint dos arquivos alterados passa
- [ ] smoke test das rotas alteradas passa

## Smoke test mínimo ao final

Rotas que precisam ser verificadas manualmente:

1. `/empresa/novo-projeto`
2. `/empresa/projeto/[id]`
3. `/fornecedor/projeto/[id]`
4. `/fornecedor/projeto/[id]/candidatar`
5. `/configuracoes`
6. `/fornecedor/perfil`
7. `/perfil/fornecedor/[id]`

Fluxos a validar:

1. Criar/editar projeto com credenciais exigidas e documentos relacionados.
2. Entrar no projeto como fornecedor e conferir blocos separados.
3. Abrir candidatura e verificar:
   - sugestão de anexo do perfil
   - anexo manual
   - persistência no perfil
   - alerta sem bloqueio
4. Voltar em `/configuracoes` e confirmar que o documento manual foi salvo para reutilização.

## Observações importantes para a sessão limpa

- O projeto continua **mockup-only**: nada de backend, upload real, storage real ou API.
- `arquivo_caminho` é apenas metadata mock, mesmo quando o plano fala em “caminho no disco”.
- Identificadores internos podem continuar em inglês quando isso reduzir risco; a UI deve continuar em pt-BR.
- Ao longo da implementação, sempre revisar se alguma mudança exige atualização adicional em `design/` ou `docs/` antes de encerrar.
