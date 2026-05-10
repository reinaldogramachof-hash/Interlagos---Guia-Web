# DESIGN.md — Sistema visual do Tem No Bairro

Este documento é a fonte oficial do padrão visual aprovado para o app **Tem No Bairro**.

Ele deve ser lido antes de qualquer alteração de UI/UX, especialmente em telas públicas, painéis administrativos e áreas de gestão.

## 1. Decisão de produto

O produto é **mobile-first**.

A maior parte dos usuários finais acessa o app por smartphones. Portanto, as áreas públicas devem priorizar:

- leitura rápida;
- navegação por toque;
- cabeçalhos compactos;
- cards leves;
- busca/filtros acessíveis com o polegar;
- performance e fluidez;
- consistência visual entre abas.

Tablet/desktop nas áreas públicas devem preservar uma experiência mobile contida, sem transformar a navegação em uma aplicação desktop completa.

Responsividade mais ampla deve ser aplicada prioritariamente em:

- painel administrativo;
- painel do comerciante;
- painel do morador;
- áreas de gestão;
- formulários e tabelas operacionais.

## 2. Princípios visuais

### 2.1 Consistência antes de ornamentação

O app deve parecer um único produto. Telas diferentes podem ter personalidade, mas devem compartilhar:

- estrutura de hero;
- busca;
- filtros;
- títulos de seção;
- estilo de cards;
- badges;
- espaçamentos;
- sombras;
- radius;
- comportamento mobile.

### 2.2 Clareza antes de densidade

Cada tela deve mostrar apenas o necessário para o próximo passo do usuário.

Evitar:

- excesso de badges;
- textos em caixa alta sem necessidade;
- muitos elementos competindo no topo;
- cards escuros em excesso;
- sombras fortes demais;
- fontes muito pesadas em todos os elementos.

### 2.3 Mobile real, não desktop encolhido

Telas públicas devem funcionar naturalmente em larguras de 360px a 430px.

Diretriz:

- grids simples;
- listas verticais;
- carrosséis horizontais apenas quando agregarem valor;
- bottom nav preservada;
- filtros horizontais com scroll;
- modais preferencialmente como bottom sheets quando fizer sentido.

### 2.4 Admin é operacional

O painel administrativo não precisa seguir exatamente a mesma densidade das abas públicas.

Admin deve priorizar:

- leitura de status;
- governança;
- rastreabilidade;
- ações seguras;
- tabelas/cards responsivos;
- filtros claros;
- hierarquia de permissões;
- feedback explícito de ações críticas.

## 3. Componentes canônicos

A base visual já aprovada usa os componentes em:

```txt
app/src/components/mobile/
```

Componentes principais:

```txt
PageHero
SearchBar
CategoryChips
SectionHeader
MobileCard
SmartImage
BottomSheet
```

### 3.1 PageHero

Uso:

- topo de contexto de páginas públicas;
- páginas secundárias do sidebar;
- telas institucionais simples;
- dashboards mobile quando houver contexto claro.

Diretrizes:

- título curto;
- subtítulo objetivo;
- ícone contextual;
- CTA opcional e discreto;
- evitar hero alto demais em páginas de uso frequente.

### 3.2 SearchBar

Uso:

- listas filtráveis;
- notícias;
- comércios;
- classificados;
- campanhas;
- serviços úteis;
- tabelas mobile em admin.

Diretrizes:

- placeholder específico;
- botão de limpar quando houver valor;
- não duplicar buscas diferentes na mesma tela sem necessidade.

### 3.3 CategoryChips

Uso:

- filtros horizontais;
- categorias públicas;
- estados simples em admin mobile;
- filtros rápidos.

O componente deve aceitar:

- ícone como React element;
- ícone como componente/função;
- string/emoji;
- ausência de ícone.

Essa regra evita regressão do erro React #130 já corrigido.

### 3.4 SectionHeader

Uso:

- títulos internos;
- blocos de listagem;
- resumo de quantidade;
- ação contextual pequena.

Diretrizes:

- título curto;
- subtítulo opcional;
- ação textual discreta quando necessário.

### 3.5 MobileCard

Uso:

- superfícies de conteúdo;
- cards simples;
- itens de lista;
- estados de aviso;
- blocos em páginas secundárias.

Diretrizes:

- sombra leve;
- borda suave;
- radius consistente;
- estado pressable quando clicável;
- conteúdo legível em mobile.

### 3.6 SmartImage

Uso planejado:

- classificados;
- vitrine;
- campanhas;
- cupons;
- cards de notícia;
- cards de comércios;
- logos e capas.

Diretrizes:

- diferenciar logo de foto;
- fallback por categoria;
- evitar área vazia feia;
- crop previsível;
- não depender de imagens remotas genéricas.

### 3.7 BottomSheet

Uso:

- ações rápidas mobile;
- filtros avançados;
- confirmação contextual;
- detalhes curtos;
- menus de ação.

Evitar usar bottom sheet para formulários longos quando uma tela dedicada for mais confortável.

## 4. Tokens e classes globais

A base visual aprovada está em:

```txt
app/src/theme/mobileDesignTokens.js
app/src/index.css
app/tailwind.config.js
```

Classes globais relevantes:

```txt
mobile-shell
mobile-page
mobile-sticky-panel
mobile-card
mobile-card-pressable
mobile-section-title
mobile-muted-text
mobile-badge
safe-bottom
scrollbar-hide
```

Uso obrigatório recomendado:

- páginas mobile públicas devem usar `mobile-page`;
- áreas com topo fixo devem usar `mobile-sticky-panel`;
- superfícies simples devem preferir `MobileCard` ou `.mobile-card`;
- textos secundários devem manter contraste adequado.

## 5. Temas por seção pública

Os temas aprovados ficam em `sectionThemes`.

```txt
news       Jornal
vitrine    Vitrine
merchants  Comércios
ads        Classificados
campaigns  Campanhas
```

Diretriz de cor:

- cada seção pode ter acento próprio;
- a estrutura visual deve permanecer consistente;
- evitar transformar a identidade em múltiplos estilos desconectados.

## 6. Padrão atual das áreas públicas

Já foi aplicada a padronização inicial de hero/busca/filtros em:

```txt
Jornal
Comércios
Vitrine
Classificados
Campanhas
```

Essa base deve ser preservada.

Antes de alterar qualquer uma dessas telas:

1. ler o componente atual;
2. preservar regra de negócio;
3. evitar reverter para estilos manuais antigos;
4. reaproveitar componentes canônicos;
5. validar mobile.

## 7. PR #26 e páginas do sidebar

O PR #26 foi criado em uma `main` antiga e hoje está defasado.

Diretriz:

- não mergear o PR #26 cegamente;
- usar como referência histórica;
- reaproveitar apenas o que ainda fizer sentido após auditoria da `main` atual;
- priorizar agora a lapidação do painel administrativo conforme este `DESIGN.md`.

## 8. Diretriz para painel administrativo

O admin deve evoluir para um visual mais operacional e consistente com a marca, mas com densidade adequada para gestão.

### 8.1 Objetivos do admin

- facilitar tomada de decisão;
- reduzir risco de ação errada;
- expor status com clareza;
- melhorar filtros e busca;
- separar ações críticas;
- melhorar uso em tablet/desktop;
- manter boa experiência mobile quando possível.

### 8.2 Estrutura recomendada

Padrão base para telas administrativas:

```txt
AdminShell
AdminHeader
AdminMetricCard
AdminSectionHeader
AdminFilterBar
AdminTableOrList
AdminActionMenu
AdminDangerZone
```

Esses componentes podem ser criados em fase posterior.

Não é obrigatório usar `PageHero` em todas as telas admin. Em admin, muitas vezes um header operacional é melhor que um hero visual.

### 8.3 Densidade

Admin pode ter mais informação por tela que as áreas públicas, mas deve manter:

- espaçamento claro;
- títulos objetivos;
- grupos visuais bem definidos;
- botões de ação previsíveis;
- estados vazios úteis;
- feedback de carregamento.

### 8.4 Ações críticas

Ações como excluir, aprovar, bloquear, alterar plano, modificar permissão ou editar usuário devem ter:

- confirmação explícita;
- texto claro;
- botão destrutivo destacado;
- possibilidade de cancelar;
- registro/auditoria quando disponível.

### 8.5 Responsividade admin

Admin deve funcionar bem em:

```txt
mobile: leitura/ações rápidas
tablet: operação principal
notebook/desktop: gestão completa
```

Diferente das áreas públicas, o admin pode usar:

- colunas;
- tabelas responsivas;
- sidebar interna;
- filtros em linha;
- grids de métricas;
- painéis de detalhe.

## 9. Ordem recomendada de lapidação

### Fase A — Documento canônico

- Criar `docs/DESIGN.md`.
- Registrar o padrão validado.
- Registrar decisão sobre PR #26.

### Fase B — Auditoria do admin atual

Antes de alterar código:

- localizar componentes admin atuais;
- mapear abas e responsabilidades;
- identificar componentes duplicados;
- identificar riscos de regra de negócio;
- criar checklist de lapidação.

### Fase C — Shell visual admin

Aplicar primeiro sem mexer nas regras:

- header consistente;
- espaçamento;
- cards de métrica;
- containers;
- estados vazios;
- filtros visuais.

### Fase D — Telas críticas

Lapidar em lotes:

1. governança/usuários/permissões;
2. aprovação/moderação;
3. comércios/planos;
4. conteúdo público;
5. relatórios e auditoria.

### Fase E — Retomar sidebar/PR #26

Depois do admin:

- revisar PR #26;
- comparar com `main` atual;
- reaplicar apenas o que faltar;
- fechar o PR antigo se for substituído por branch limpa.

## 10. Checklist antes de alterar UI

Antes de qualquer PR visual:

- [ ] A branch nasceu da `main` atual.
- [ ] O arquivo alterado foi lido antes.
- [ ] O escopo não mistura admin com telas públicas sem necessidade.
- [ ] O padrão deste documento foi seguido.
- [ ] Regras de negócio foram preservadas.
- [ ] Build local/Vercel foi validado quando aplicável.
- [ ] QA mobile foi considerado.
- [ ] Risco de sobrescrever trabalho local/externo foi avaliado.

## 11. Regra de ouro

```txt
Preservar o padrão validado, evoluir em lotes pequenos e validar antes de publicar.
```

O design system não deve ser recomeçado do zero. Ele deve ser consolidado, aplicado e refinado progressivamente.
