# Diagnóstico de Capacidade Instalada — análise da planilha legada

Origem do arquivo: `03-Diagnostico Capacidade Instalada - Copia.xls` (na raiz do repo).
Metadados do arquivo: criado em 2008-12-09 por `alfredo.a.prieto`, último salvamento 2021-08-10 por `Geraldo Moreira`. Construído em Excel/Windows.

## 1. Origem e contexto (o que a planilha diz de si mesma)

A aba **Propósito** declara:

> "O propósito deste documento consiste no recolhimento de informações referentes à capacidade instalada dos fornecedores de Minas Gerais. A partir dessas informações, será realizado um diagnóstico confrontando capacidade instalada da indústria local com a demanda de bens e serviços."

A aba **Questionário** instrui o fornecedor a "Salvar o arquivo com o nome da empresa e enviar de volta para a Federação (PDIF)" e menciona "parceiros PDIF" e "mantenedoras do PDIF".

**PDIF** = Programa de Desenvolvimento Integrado de Fornecedores, programa da FIEMG (Federação das Indústrias de Minas Gerais) lançado em 2008 junto com mantenedoras — Vale, Usiminas, ArcelorMittal, CSN, entre outras. Os "Setores da Indústria" e o recorte de itens refletem as demandas dessas mantenedoras.

**Genérico vs específico:**

- **O conceito** ("capacidade instalada × capacidade utilizada × unidade de medida") é universal em diagnóstico industrial, não pertence à Vale. Aparece em qualquer levantamento setorial sério.
- **A planilha em si** carrega marcas do PDIF (referência à Federação, ao recorte de mantenedoras, ao horizonte 2009-2013) — mas as 38 categorias/itens individuais (Caldeiraria, Vigilância, Restaurante, Locação de Veículos, Topografia...) são genéricas o suficiente para qualquer cliente grande na região, não só Vale.

Conclusão: podemos adotar **a estrutura de coleta** como modelo genérico da plataforma, sem importar a moldura PDIF.

## 2. Estrutura da planilha

49 abas, organizadas em 3 camadas:

| Camada | Abas | Função |
| --- | --- | --- |
| Intro | `Propósito`, `Questionário` | objetivo + cadastro geral da empresa |
| Catálogo visual | 9 abas `Cat. XXX` | telas para o fornecedor escolher em quais setores/categorias atua (parecem ser apenas imagens/mockups visuais — pouco texto extraível) |
| Coleta por item | 38 abas | uma aba por **item de serviço/produto**, todas com o mesmo esqueleto |

### 2.1 Questionário Geral (cadastro do fornecedor)

Não é especificamente sobre capacidade — é o **perfil da empresa**:

- **Identificação**: Razão Social, CNPJ, Cidade, Data de Fundação, Região Atuante, Telefone, Endereço, Responsável, Cargo
- **1. Situação Econômica e Financeira**: faturamento 2007/2008, projeção anual de crescimento 2009-2013 (%), recursos próprios para crescer (sim/não), obteve crédito em 2008 (sim/não), interesse em crédito
- **2. Mercado**: principais clientes, setor público, % do faturamento em 2008 por parceiros PDIF, outros
- **3. Instalações e Capacidade**: engenharia própria (sim/não), % em obras de melhoria/manutenção vs investimento, **Área Total (m²)**, **Área Construída (m²)**, **Pé-direito da oficina (m²)** — quando aplicável
- **4. Pessoal — Educação**: contagem de funcionários por faixa (Doutorado/Mestrado, Pós-graduação, Superior, Superior Incompleto, 2º Grau, 2º Grau Incompleto, Técnico, Técnico Incompleto, 1º Grau, 1º Grau Incompleto, Total), funcionários em treinamento, terceirização
- **5. Meio Ambiente**: licença ambiental (sim/não), programa ambiental
- **6. Certificação**: certificados de qualidade — quais
- **7-9.** Histórico de fornecimento em consórcio (com outras empresas e com detentor de tecnologia), avaliação, percepção sobre subcontratação em contratos de grande porte
- **10.** Segmento principal

### 2.2 Coleta de capacidade — uma aba por item (38 itens)

Todas as 38 abas seguem **rigorosamente** o mesmo esqueleto:

```
Título: "<Setor> - <Item>"
Tipo (se aplicável):   Leve | Médio | Pesado
Unidade de medida:     <específica do item>

— Média MENSAL por ano (2009, 2010, 2011, 2012, 2013) —
Por ano:  Capacidade Instalada  |  % Utilização

— Detalhamento por Mês, mesmo formato —
Por mês (Jan…Dez de 2009 a 2013):  Instalada  |  % Utiliz.

— Principais equipamentos —
Lista (Equipamento × Quantidade); algumas abas trazem nomes pré-preenchidos
(ex.: Terraplanagem lista Pontes Rolantes, Guindastes, Empilhadeiras, Betoneira,
Carregadeira, Escavadeira, Compactadores, Tratores etc.); outras (Caldeiraria,
Vigilância) deixam livre para o fornecedor preencher.

Observações (texto livre).
```

Variantes pontuais: algumas abas (Peças para automóveis, Transporte de Cargas) adicionam um campo extra **Área de armazenamento**.

### 2.3 Os 9 setores e seus 38 itens

| Setor | Itens |
| --- | --- |
| **Construção Civil** | Terraplanagem; Limpeza Industrial e Manutenção Civil; Área de forma; Volume de Concreto; Equipamentos e prédios industriais; Areia; Brita; Estradas Rodoviárias; Construções Prediais |
| **Montagem Industrial** | Instalação, Manutenção e Reparo; Manutenção Mecânica; Linha de Transmissão; Topografia |
| **Engenharia de Projetos** | Gerenciamento de Projeto; Engenharia Básica; Tecnologia da Informação; Engenharia de Meio Ambiente; Diligenciamento e Inspeção |
| **Estrutura Metálica** | Estrutura Metálica; Caldeiraria; Componentes; Montagem e Manutenção; Montagem Elétrica |
| **Serviços** | Vigilância; Jardinagem e Paisagismo; Limpeza Predial; Limpeza e Higienização; Supressão Vegetal; Tratamento de Resíduos |
| **Locações e Aluguéis** | Locação de Veículos |
| **Transportes e Armazenamento** | Peças para Automóveis; Transporte de Cargas; Transporte de Pessoal; Material Elétrico |
| **Uniformes** | Uniforme Camisa; Uniforme Calça |
| **Alimentação e Hospedagem** | Restaurante; Hotel |

### 2.4 Unidades de medida observadas (chave para a modelagem genérica)

| Unidade | Itens (exemplos) |
| --- | --- |
| **Homem-hora (HH)** | Limpeza Industrial, Engenharia de Projetos, TI, Engenharia Ambiental, Vigilância, Limpeza Predial, Jardinagem |
| **Tonelada (TON)** | Estrutura Metálica, Caldeiraria, Componentes, Tratamento de Resíduos, Transporte de Cargas |
| **Metro cúbico (m³)** | Terraplanagem, Volume de Concreto, Areia, Brita |
| **Metro quadrado (m²)** | Área de forma, Topografia |
| **Peças** | Uniformes (Camisa, Calça), Peças para Automóveis |
| **Refeição/dia** | Restaurante |
| **Leitos** | Hotel |
| **Nº de carros / Veículos (VEC)** | Locação de Veículos, Transporte de Pessoal |

A unidade não é arbitrária — é **propriedade da categoria/item**, não do fornecedor.

## 3. Lacuna em relação ao sistema atual

O mockup hoje (`AGENTS.md`, `src/lib/mock-data.ts`, `design/data-model.md`) trata "capacidade" como **texto livre** em dois campos:

- `Fornecedor.capacidade_atual?: string` — opcional, no perfil
- `Candidatura.capacidade_declarada: string` — obrigatório, na candidatura

E o `fit-score` (`src/lib/fit-score.ts`) só verifica se o campo está preenchido (boolean) — não compara com nada.

**A planilha coleta três dimensões que o sistema perde inteiramente:**

1. **Capacidade nominal** (quanto o fornecedor consegue produzir/entregar por mês) — número, com unidade.
2. **Percentual de utilização** (quanto já está comprometido) — chave para saber se o fornecedor tem folga para um novo contrato.
3. **Série temporal** (mês a mês, ano a ano) — histórico + projeção.

Mais o **inventário de equipamentos** e o **classificador Leve/Médio/Pesado**.

## 4. Proposta de adoção genérica

### 4.1 Decisão de escopo

A planilha mistura **três coisas distintas** que no sistema devem ficar separadas:

- **Perfil/cadastro da empresa** (questionário geral) → expande `Fornecedor` com campos de instalações, pessoal por escolaridade, faturamento, certificações, licença ambiental.
- **Atuação** (quais categorias/itens a empresa atende) → já existe parcialmente em `Fornecedor.categorias` e `regioes_atendidas`. Precisa ganhar granularidade de **item** (subcategoria), não só "Construção Civil" amplo.
- **Capacidade instalada por item** → nova entidade `CapacidadeInstalada` (1 fornecedor × N itens).

### 4.1.0 Três grandezas distintas — teto, utilização, alocação

Antes de discutir onde cada dado vive, é preciso separar três conceitos que a
planilha original tratava como uma coisa só:

| Grandeza | Significado | Estabilidade temporal | Onde mora |
| --- | --- | --- | --- |
| **Capacidade nominal mensal** | Teto físico da operação — quanto a empresa consegue produzir/mês se dedicar tudo. | Estável: muda só com expansão/contração de planta ou equipe. | Perfil (`CapacidadeInstalada.capacidade_nominal_mensal`). |
| **% utilização atual** | Quanto do teto está comprometido **hoje**. | Volátil: muda com contratos entrando/saindo. | Perfil (`percent_utilizacao_atual`). |
| **Capacidade alocada para um projeto** | Quanto o fornecedor promete dedicar **a este contrato específico**, na unidade do item. | Vale para a vida do contrato. | Candidatura (`capacidade_alocada`). |

**O matching (fit-score) compara teto × volume do projeto, não livre × volume.**
A razão: o snapshot de utilização atual é volátil e gera falsos negativos. Um
fornecedor 95% ocupado hoje pode estar 30% em 60 dias quando o projeto começar.
Penalizá-lo com base nisso esconde matches reais. Já o teto físico é uma
limitação honesta — se ele simplesmente não tem o tamanho da operação, é
informação estável.

Utilização e capacidade livre derivada (`nominal × (1 − utilização/100)`)
continuam sendo coletadas e exibidas, mas como **contexto informativo** —
nunca como critério de matching. Na triagem, a empresa vê o teto + o que o
fornecedor prometeu alocar + o livre atual como informação adicional, e pode
ler a `observacao_disponibilidade` (texto opcional na candidatura) para
entender quando a capacidade fica disponível, se houver gap.

### 4.1.1 Perfil vs Candidatura — onde cada dado vive

A planilha original trata como uma coisa só algo que no nosso sistema são **duas camadas distintas**. A regra é:

| Conceito | Mora em | Justificativa |
| --- | --- | --- |
| **Capacidade nominal** (quanto a empresa **pode** entregar/mês) | **Perfil do Fornecedor** | Atributo físico da operação — equipe, máquinas, instalações. Não muda de projeto pra projeto. Preenche **uma vez** e reaproveita em todas as candidaturas. |
| **Equipamentos e classificação Leve/Médio/Pesado** | **Perfil** | Inventário físico — também inerente ao fornecedor. |
| **% de utilização atual** (quanto já está comprometido) | **Perfil**, como **estado mutável** | Varia no tempo, mas é um snapshot da empresa, não do projeto. Fornecedor atualiza periodicamente; eventualmente o sistema pode inferir a partir dos contratos ativos. |
| **Capacidade alocada para ESTE projeto** | **Candidatura** | Aqui sim varia por projeto: "tenho 100 HH/mês instalados, vou dedicar 30 HH/mês a este contrato". É o número que a empresa contratante precisa para decidir. Deve **derivar do perfil** com ajuste manual do fornecedor. |

Consequências:

- O campo `Candidatura.capacidade_declarada` (hoje texto livre) deixa de ser cadastro avulso e passa a ser **alocação derivada do perfil**: `{ valor_nominal, unidade, percent_da_capacidade_total }`.
- O fit-score consulta o **perfil** (capacidade total vs requisito do projeto), não a candidatura — porque o ranking precede o envio da candidatura.
- O formulário de candidatura pré-preenche a alocação sugerida (ex.: "você tem 100 HH/mês instalados, 60% utilizados → 40 HH/mês livres; quanto aloca aqui?") em vez de exigir texto livre.
- Coerente com o restante da plataforma, onde credenciais, contratos destacáveis e perfil público já vivem **uma vez** no perfil e são reaproveitados em N candidaturas (ver `design/data-model.md`).

### 4.2 Catálogo de categorias estendido

Hoje `src/lib/platform-data.ts` define `categorias` como lista flat de strings. Para suportar a planilha, evoluir para:

```ts
type CategoriaItem = {
  id: string                       // ex.: "constr-civil.terraplanagem"
  setor: string                    // ex.: "Construção Civil"  (1 dos 9 setores)
  nome: string                     // ex.: "Terraplanagem"
  unidade_medida: UnidadeMedida    // "HH" | "TON" | "m3" | "m2" | "pecas" | "refeicao_dia" | "leitos" | "veiculos" | ...
  tem_classificacao_carga: boolean // Leve/Médio/Pesado é aplicável?
  equipamentos_sugeridos?: string[] // sugestões (ex.: Terraplanagem traz 30+)
  campos_extras?: ("area_armazenamento" | ...)[]
}
```

Esse catálogo é **administrado pela plataforma**, não pelo fornecedor — coerente com a nota em AGENTS.md de que `platform-data.ts` é fonte única.

### 4.3 Entidade `CapacidadeInstalada`

```ts
type CapacidadeInstalada = {
  id: string
  fornecedor_id: string
  categoria_item_id: string         // ref. ao catálogo acima → traz unidade
  classificacao?: "leve" | "medio" | "pesado"  // só se tem_classificacao_carga
  series: SerieCapacidade[]         // série temporal (granularidade mensal OU anual)
  equipamentos: EquipamentoDeclarado[]
  observacao?: string
  area_armazenamento_m2?: number    // só se categoria pedir esse campo extra
  atualizada_em: string
}

type SerieCapacidade = {
  ano: number
  mes?: number                      // 1-12; ausente = média anual
  capacidade_nominal: number        // na unidade da categoria
  percent_utilizacao: number        // 0-100
}

type EquipamentoDeclarado = {
  nome: string
  quantidade: number
  capacidade_individual?: string    // ex.: "Ponte rolante 20t" — campo opcional
}
```

Decisões importantes:

- **Granularidade flexível**: a planilha original aceitava "média mensal por ano" OU "mês a mês". Preservar essa flexibilidade — UI permite o fornecedor escolher granularidade.
- **Horizonte temporal**: a planilha fixa 2009-2013 (5 anos). No sistema, **não fixar anos** — sempre "últimos N anos + projeção opcional". Hoje (2026) o relevante é diferente.
- **% utilização** é a métrica que **realmente importa para matching**: um fornecedor com 100 HH/mês instalados mas 95% utilizado tem menos a oferecer que outro com 60 HH/mês a 30% utilizado.

### 4.4 Expansão do perfil do fornecedor (questionário geral)

Adicionar ao `Fornecedor` (ou em uma sub-entidade `PerfilEmpresa`):

- `data_fundacao`
- `area_total_m2`, `area_construida_m2`, `pe_direito_oficina_m`
- `engenharia_propria: boolean`
- `pessoal_por_escolaridade: { doutorado_mestrado, pos, superior, superior_incompleto, segundo_grau, segundo_grau_incompleto, tecnico, tecnico_incompleto, primeiro_grau, primeiro_grau_incompleto }`
- `faturamento_anual: { ano, valor }[]` + `projecao_crescimento: { ano, percentual }[]`
- `licenca_ambiental: boolean` + `programas_ambientais: string[]`
- `historico_consorcios: { tipo: "outras_empresas" | "detentor_tecnologia", avaliacao: string }[]`

Certificações de qualidade já são parcialmente cobertas pelas `credenciais` existentes — alinhar antes de duplicar.

### 4.5 Impacto no fit-score e na UI de candidatura

- **Fit-score** ganha uma 4ª dimensão real: "o fornecedor tem capacidade nominal × utilização compatível com o volume do projeto?" — passa a comparar números, não só presença de texto.
- **Formulário de candidatura** (`formulario-candidatura.tsx`) deixa o campo livre `capacidade_declarada` e passa a **puxar automaticamente** a capacidade pertinente da categoria do projeto. O fornecedor confirma/ajusta, em vez de digitar texto livre todo vez.
- **Filtros de "Sem capacidade"** (motivo de descarte hoje em `catalogos.ts`) ganham critério objetivo.

## 5. Plano de adoção nos mockups

Decisões já tomadas com o stakeholder, que ancoram o plano:

- **Catálogo:** substituir a lista plana atual por **2 níveis (setor → item)**, com unidade de medida e classificação Leve/Médio/Pesado por item.
- **Temporalidade:** só **estado atual** no perfil (nominal mensal + % utilização atual). Sem histórico, sem projeção.
- **Visibilidade do % utilização:** privado por padrão. Empresa só vê o número **quando o fornecedor se candidata a um projeto seu**. No perfil público fica oculto.
- **Volume do projeto:** **campo obrigatório** ao criar projeto, expresso na unidade do item. Habilita matching numérico real.

### 5.1 Mudanças na camada de dados

**Catálogo (`src/lib/platform-data.ts`):**

```ts
type Setor = { id: string; nome: string }
type CategoriaItem = {
  id: string                       // ex.: "estr-met.caldeiraria"
  setor_id: string                 // ex.: "estr-met"
  nome: string                     // ex.: "Caldeiraria"
  unidade_medida: UnidadeMedida    // "HH" | "TON" | "m3" | "m2" | "pecas" | "refeicao_dia" | "leitos" | "veiculos"
  tem_classificacao_carga: boolean
  equipamentos_sugeridos?: string[]
  tem_area_armazenamento?: boolean
}
```

Os 9 setores e 38 itens da planilha entram como seed inicial; podem ser revistos com Celso antes do go-live.

**Fornecedor (`src/lib/mock-data/fornecedores.ts`):**

- **Remover** `capacidade_atual?: string` (texto livre).
- **Adicionar** `capacidades_instaladas: CapacidadeInstalada[]`:

```ts
type CapacidadeInstalada = {
  id: string
  categoria_item_id: string            // ref ao catálogo → traz unidade
  classificacao?: "leve" | "medio" | "pesado"
  capacidade_nominal_mensal: number    // na unidade do item
  percent_utilizacao_atual: number     // 0-100, privado por padrão
  equipamentos: { nome: string; quantidade: number }[]
  area_armazenamento_m2?: number       // só se item exigir
  observacao?: string
  atualizada_em: string
}
```

**Projeto (`src/lib/mock-data/projetos.ts`):**

- `categoria: string` → `categoria_item_id: string` (referência ao catálogo).
- **Adicionar** `volume_estimado: { quantidade: number; periodicidade: "total" | "mensal" }`. Unidade é derivada da categoria, não precisa ser repetida.

**Candidatura (`src/lib/mock-data/candidaturas.ts`):**

- `capacidade_declarada: string` → `capacidade_alocada: { valor_nominal: number; percent_da_capacidade_total: number }`. Sempre derivada do perfil + ajuste do fornecedor.

**Fit-score (`src/lib/fit-score.ts`):**

- Dimensão `capacidade.match: boolean` deixa de ser presença de texto e passa a ser comparação numérica: capacidade livre (nominal × (1 − utilização)) ≥ volume do projeto.

### 5.2 Onde a capacidade aparece — lado FORNECEDOR

**A. Cadastro/edição (preenche uma vez, reaproveita):**

- **Onde:** novo bloco "Capacidade instalada" em **`/configuracoes`** (já é o lugar de gerenciar perfil hoje — perfil-fornecedor remete pra lá em `fornecedor/perfil/page.tsx:97`). Bloco listado abaixo de "Áreas de atuação" e "Credenciais".
- **Formulário (drawer ou subpágina):** "Editor de capacidade".
  - Passo 1: fornecedor escolhe **um item** do catálogo (setor → item filtrado por suas categorias declaradas). Sistema mostra a unidade automaticamente.
  - Passo 2: campos:
    - `capacidade_nominal_mensal` (number, com sufixo da unidade)
    - `percent_utilizacao_atual` (slider 0-100%, com hint "Privado — só aparece quando você se candidata")
    - `classificacao` (Leve/Médio/Pesado, só aparece se item exigir)
    - `equipamentos[]` (lista editável; carrega sugestões do catálogo como placeholders pré-marcáveis)
    - `area_armazenamento_m2` (só se item exigir)
    - `observacao`
  - Botão "Adicionar outra capacidade" no fim — para repetir o passo 1 com outro item.
- **Lista no perfil interno:** uma linha por item declarado, com "Editar" e "Remover". Total agregado: "Você declarou capacidade em N itens".

**B. Perfil interno (`/fornecedor/perfil/page.tsx`):**

- Adicionar card "Capacidade instalada" entre "Áreas de atuação" e "Contratos encerrados".
- Mostrar resumo: "Caldeiraria — 80 TON/mês (60% utilizado)", "Vigilância — 1.200 HH/mês (40% utilizado)" etc.
- Botão "Gerenciar capacidade" → leva para Configurações.

**C. Candidatura (`src/components/handshake/formulario-candidatura.tsx:218-229`):**

- Bloco hoje "Capacidade declarada" (texto livre) → **substitui** por bloco "Capacidade alocada para este projeto":
  - Sistema **identifica** a capacidade do fornecedor para o `categoria_item_id` do projeto.
  - Exibe header: "Você tem **80 TON/mês** instalados. Atualmente 60% utilizado → **32 TON/mês livres**. Volume requerido pelo projeto: **20 TON/mês**."
  - Campo: "Quanto vai alocar?" (input numérico, default = volume requerido se houver folga; senão alerta vermelho "capacidade insuficiente, queira reduzir % utilização ou ampliar capacidade").
  - Se fornecedor **não tem capacidade declarada** no item: bloqueia candidatura com CTA "Cadastrar capacidade primeiro".
- Confirmação de envio dispara registro de `capacidade_alocada` na candidatura. **Aqui** o `percent_utilizacao_atual` do perfil é exposto à empresa contratante (mas só dela).

**D. Busca de projetos (`/fornecedor/projetos`):**

- Cada card de projeto ganha badge: "Compatível com sua capacidade" (verde, capacidade livre ≥ volume) / "Apertado" (amarelo, ≥80% do livre) / "Insuficiente" (cinza).
- Filtro opcional: "Mostrar só compatíveis".

**E. Dashboard fornecedor (`/fornecedor/dashboard`):**

- Card "Capacidade & utilização": para cada item declarado, barra horizontal nominal vs alocado em projetos ativos.
- Alerta "Você não declarou capacidade em nenhum item ainda — fornecedores com capacidade declarada recebem 3× mais convites" se vazio.

### 5.3 Onde a capacidade aparece — lado EMPRESA

**A. Criar projeto (`src/components/empresa/formulario-projeto.tsx`):**

- Campo `categoria` (select hoje) → **2 selects encadeados**: setor → item. Item dispara o resto.
- Após escolher item, abre bloco "Volume estimado":
  - "Este item é medido em **TON**."
  - Input numérico `volume_estimado.quantidade` + toggle periodicidade ("Total do contrato" / "Por mês").
  - Hint: "Esse volume é usado para casar com a capacidade disponível dos fornecedores."
- Se aplicável ao item, escolher `classificacao` desejada (Leve/Médio/Pesado).
- Campo `criterios_selecao` continua, mas **remove os strings genéricos "Capacidade técnica/logística/de frota/especializada"** de `project-form-options.ts` (linhas 11-26, 80) — capacidade vira critério primeira-classe, não opção textual.

**B. Triagem de candidaturas (`/empresa/projeto/[id]`):**

- Em cada card de candidatura (`card-candidatura-triagem.tsx:79`), o "Capacidade: <texto>" hoje vira:
  - "**32 TON/mês livres** de 80 TON/mês (utilização 60%) → alocando **20 TON/mês** neste projeto"
  - Badge colorido: 🟢 folga / 🟡 apertado / 🔴 insuficiente
- Ordenação: candidaturas com capacidade folgada sobem.

**C. Diretório/busca de fornecedores (`/empresa/diretorio`):**

- Filtro novo: "Capacidade disponível ≥ X na unidade do item".
- Resultado mostra capacidade livre por item (sem expor % utilização cru — só "tem folga" / "lotado", coerente com decisão de privacidade pré-candidatura).

**D. Motivo de descarte (`src/lib/mock-data/catalogos.ts:9`):**

- "Sem capacidade" continua existindo, mas agora pode ser **pré-marcado automaticamente** quando o fit-score numérico apontar capacidade insuficiente. Empresa confirma com um clique.

### 5.4 Perfil público (`/perfil/fornecedor/[id]`)

- Bloco "Atuação" (linhas 123-126 de `page.tsx`) hoje mostra `capacidade_atual` em texto livre. **Substitui** por uma tabela compacta: item × unidade × **capacidade nominal mensal**.
- **% utilização e equipamentos não aparecem** (privado até candidatura).
- Total agregado: "Capacidade declarada em N itens, atualizada em DD/MM/YYYY".

### 5.5 O que muda de natureza, o que sai do sistema

| Item atual | Decisão | Justificativa |
| --- | --- | --- |
| `Fornecedor.capacidade_atual: string` | **Deletar** | Substituído por `capacidades_instaladas[]` estruturado. Texto livre não suporta matching. |
| `Candidatura.capacidade_declarada: string` | **Substituir** por `capacidade_alocada` numérico | Deixa de ser cadastro avulso e passa a derivar do perfil. |
| `categorias` (10 strings flat em `platform-data.ts`) | **Substituir** por catálogo 2 níveis | Sem hierarquia, não dá pra carregar unidade nem classificação. |
| `Projeto.categoria: string` | **Substituir** por `categoria_item_id: string` | Aponta para o catálogo estruturado. |
| `project-form-options.ts` strings "Capacidade técnica/logística/de frota/especializada/de entrega mensal" | **Deletar** | Capacidade vira critério primeira-classe com comparação numérica; não faz mais sentido como rótulo opcional. |
| `fit-score.ts` `capacidade.match: boolean` (presença de texto) | **Reescrever** como comparação numérica | "Tem folga ≥ volume requerido". |
| `card-candidatura-triagem.tsx:79` e `card-candidatura.tsx:62` (linha "Capacidade: …") | **Substituir** pelo bloco numérico com badge de match | Coerente com novo modelo. |
| `formulario-candidatura.tsx:218-229` (input de texto livre "Capacidade declarada") | **Substituir** pelo bloco de alocação derivada | Fornecedor não redigita capacidade a cada candidatura. |
| Motivo de descarte `"Sem capacidade"` | **Manter**, com pré-marcação automática | Continua semântico; ganha precisão. |
| `fornecedor/perfil/page.tsx` linha "Áreas de atuação" como tags simples | **Ampliar** com bloco "Capacidade instalada" | Atuação (em quais categorias) e capacidade (quanto entrega) são coisas diferentes. |
| `perfil/fornecedor/[id]/page.tsx` bloco "Atuação" com `capacidade_atual` | **Substituir** pela tabela item × unidade × nominal | Sem % utilização, sem equipamentos (privacidade). |
| `mock-data/fornecedores.ts` campos `capacidade_atual: "15 técnicos disponíveis"` | **Migrar** para `capacidades_instaladas[]` em formato numérico | Dados mock precisam refletir o novo schema. |

### 5.6 Coisas da planilha que **não** entram no escopo dessa adoção

Para evitar "tudo de uma vez" e respeitar que o sistema precisa permanecer genérico:

- **Questionário Geral completo** (perfil corporativo expandido) → fica para uma fase separada. Roteiro detalhado em §5.6.1 abaixo. Não bloqueia a adoção de capacidade.
- **Histórico mensal e projeção 5 anos** → fora (decisão "só estado atual"). Limitação temporal documentada e endereçada parcialmente no passo 8.5 (fit-score usa teto, não livre; observação de disponibilidade na candidatura).
- **Referências PDIF** ("% faturamento por parceiros PDIF", "sugestões para mantenedoras") → não entram, são específicas do programa FIEMG/2008. Não fazem sentido fora daquele contexto institucional.
- **9 setores + 38 itens** entram como seed do catálogo, mas o admin da plataforma poderá editar (em produção). Para o mockup, vivem em `platform-data.ts`.

### 5.6.1 Roteiro futuro: perfil corporativo expandido

O Questionário Geral da planilha original (aba "Questionário", §2.1 deste doc)
reúne 30+ campos sobre o fornecedor que vão além da capacidade técnica. Não
foram absorvidos na adoção 1-9 porque (a) elevam o custo de cadastro para
fornecedores novos, (b) não bloqueiam matching, (c) alguns campos têm tom de
"programa de desenvolvimento" e merecem validação com o stakeholder antes de
virarem da plataforma comercial.

Quando voltar a esse tema, sugiro fragmentar em mini-passos independentes —
cada um pequeno, com público-alvo definido, e validado com piloto antes do
próximo. **Não implementar tudo de uma vez.**

#### Mini-passo X.1 — Identificação ampliada (baixo custo, alto valor)

Campos atuais do `Fornecedor`: `nome`, `logo`, `cidade`, `regiao`, `contato`,
`desde`. Campos da planilha que faltam:

- `data_fundacao` (date) — hoje só temos `desde: string` que é o ano.
- `endereco_completo` (string)
- `responsavel_principal: { nome, cargo, email, telefone }`

**Onde aparece**: perfil público (footer/sidebar do bloco "Sobre"), aba
"Organização" em Configurações.

**Sensibilidade**: baixa. Todo fornecedor com perfil ativo já expõe nome e
contato. Endereço completo pode ser opcional (alguns operam de várias
cidades).

#### Mini-passo X.2 — Instalações físicas (atributo simples)

Campos novos (todos opcionais) no `Fornecedor` ou em sub-entidade
`InstalacoesFisicas`:

- `area_total_m2` (number)
- `area_construida_m2` (number)
- `pe_direito_oficina_m` (number) — só se aplicável (caldeiraria, metalurgia, montagem)
- `engenharia_propria` (boolean)

**Onde aparece**: perfil público, como bloco "Instalações" abaixo de
"Capacidade instalada". Ajuda a contextualizar a capacidade declarada — uma
caldeiraria com 5.000 m² construídos é uma operação distinta de uma com 500
m².

**Sensibilidade**: baixa. Informação pública em qualquer cadastro de
fornecedor industrial sério.

#### Mini-passo X.3 — Pessoal por escolaridade

Sub-entidade `PessoalEscolaridade` no `Fornecedor`:

```ts
type PessoalEscolaridade = {
  doutorado_mestrado?: number
  pos_graduacao?: number
  superior_completo?: number
  superior_incompleto?: number
  segundo_grau?: number
  segundo_grau_incompleto?: number
  tecnico?: number
  tecnico_incompleto?: number
  primeiro_grau?: number
  primeiro_grau_incompleto?: number
  // total derivado, não armazenado
}
```

**Onde aparece**: perfil interno (Configurações → Perfil Fornecedor) sempre;
perfil público de forma agregada e opcional ("X profissionais, sendo Y%
nível superior") — fornecedor decide se exibe ou não.

**Sensibilidade**: média. É informação de RH. Total é OK; distribuição
detalhada pode ser sensível. Para empresas grandes contratantes (Vale,
ArcelorMittal) é dado relevante para SST/elegibilidade — para fornecedor
pequeno pode parecer invasivo. **Decisão a alinhar com Celso**: público
agregado ou só na due diligence?

#### Mini-passo X.4 — Faturamento e projeção de crescimento

Campos novos:

- `faturamento_anual: { ano: number, valor: number }[]` (histórico)
- `projecao_crescimento_anual: { ano: number, percentual: number }[]`
  (projeção declarada pelo fornecedor)
- `recursos_proprios_para_crescer: boolean`
- `interesse_em_credito: boolean`

**Onde aparece**: **somente** na due diligence — empresa contratante vê
quando o fornecedor é selecionado para proposta formal ou já está em
conversa avançada. **Não no perfil público.**

**Sensibilidade**: alta. Dado financeiro, vai contra a cultura de muitas
PMEs industriais brasileiras expor faturamento publicamente. Os campos
"recursos próprios" e "interesse em crédito" têm tom de programa de
desenvolvimento — só fazem sentido se a plataforma tiver módulo de
financiamento. **Decisão estratégica de Celso**: a plataforma vai mediar
financiamento? Se não, esses dois campos não entram.

#### Mini-passo X.5 — Histórico de consórcios e parcerias

Sub-entidade `HistoricoConsorcios`:

```ts
type HistoricoConsorcio = {
  tipo: "outras_empresas" | "detentor_tecnologia"
  parceiros: string[]              // nomes ou ids
  projeto_descricao: string
  ano: number
  avaliacao: string                // texto livre
}
```

**Onde aparece**: perfil público, bloco "Histórico de parcerias". É um
indicador de **capacidade de subcontratação** — relevante para empresas
contratantes grandes que regularmente exigem consórcio (a Vale faz isso para
projetos acima de R$ 10MM).

**Sensibilidade**: baixa. Já é informação pública em qualquer portfólio
formal.

#### Campos da planilha que provavelmente **não** voltam

Alguns campos do Questionário Geral só fazem sentido no contexto PDIF/2008
e não devem ser recuperados:

- **"% do faturamento em 2008 por parceiros PDIF"** — específico do programa.
- **"% obras de melhoria/manutenção vs investimento"** — vocabulário PDIF
  para tipologia de contrato; conceitualmente útil mas a categorização atual
  via `categoria_item_id` já cobre.
- **"Sugestões para o aumento das compras em Minas junto às mantenedoras
  do PDIF"** — solicitação institucional, não atributo de fornecedor.
- **"Como você vê a possibilidade de prestar serviços nos contratos de
  grande porte com os insumos sendo fornecidos pelo cliente?"** — pergunta
  de pesquisa, não cadastro.

#### Ordem sugerida quando atacar (não fazer tudo de uma vez)

1. **X.1 primeiro** (identificação ampliada) — baixo atrito, melhora o perfil
   público imediatamente, sem dados sensíveis.
2. **X.2** (instalações físicas) — ainda baixo atrito, contextualiza a
   capacidade que já foi declarada.
3. **X.5** (histórico de consórcios) — agrega valor para fornecedores que
   querem ganhar contratos de grande porte.
4. **X.3** (pessoal por escolaridade) — só depois de alinhar com Celso a
   política de visibilidade (público agregado vs interno).
5. **X.4** (faturamento) — só se a plataforma evoluir para mediar
   financiamento ou tiver fluxo formal de due diligence. Provavelmente
   muito longe.

#### Pré-requisitos antes de iniciar qualquer mini-passo

- **Conversa com Celso** sobre o que ele vê como diferencial vs ruído. Em
  particular: faturamento exposto, pessoal por escolaridade, vínculo com
  programas de crédito.
- **Validar com 2-3 fornecedores piloto** se a adoção atual (capacidade)
  está funcionando antes de adicionar campos novos. Risco real: cada
  campo a mais reduz a taxa de cadastro completo.
- **Decisão de UI**: campos sensíveis devem ter o mesmo padrão de
  privacidade do `CadeadoUtilizacao` (passo 8.5) — visível para o
  fornecedor sempre, para a empresa apenas em contextos específicos.

### 5.7 Ordem sugerida de implementação

1. **Modelo + seed**: novo catálogo hierárquico, novos campos em `Fornecedor`/`Projeto`/`Candidatura`, migrar mock-data.
2. **Editor de capacidade no perfil do fornecedor** (Configurações) — fluxo de cadastro/edição.
3. **Exibição no perfil interno e perfil público** (sem % utilização) — só leitura.
4. **Criação de projeto com volume estimado** (lado empresa).
5. **Reescrita do fit-score** com comparação numérica.
6. **Reescrita do formulário de candidatura** (alocação derivada).
7. **Triagem com badge de match** (lado empresa).
8. **Filtros no diretório e na busca de projetos.**
9. **Dashboard widgets** (último porque depende de dados estabilizados).

## 6. Itens a confirmar com os stakeholders (Celso e sócios)

Itens que a planilha pressupõe e que precisam de decisão explícita antes da implementação:

1. **Granularidade obrigatória**: vamos exigir capacidade mensal, ou aceitar só média anual? (planilha aceita os dois).
2. **Horizonte**: passado (N anos atrás) é importante, ou só o estado atual + projeção?
3. **% de utilização** é dado sensível — fornecedor topa declarar para a plataforma toda, ou só revelar caso a caso?
4. **Leve/Médio/Pesado** — esse classificador é universal ou só para alguns itens? Como definimos a escala (varia por categoria)?
5. **Equipamentos sugeridos**: cobramos a lista da planilha original ou refazemos com Celso?
6. **Os 9 setores e 38 itens** da planilha cobrem o escopo da plataforma, ou precisam de revisão? (a planilha não tem mineração de minério explícita, por exemplo, embora seja o core de Vale/Usiminas).
7. **Questionário geral**: campos como "% faturamento em obras de melhoria vs investimento" fazem sentido fora do contexto PDIF?
