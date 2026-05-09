# Processo seguro de evolução UI/UX e deploy

Este documento registra o fluxo de trabalho adotado para evoluir a interface do **Tem No Bairro** com segurança, preservando contexto técnico, histórico de decisões e critérios de validação antes de publicar em produção.

## Objetivo

Garantir que evoluções visuais, ajustes de performance, mudanças em Supabase e publicações na Vercel sejam feitas com baixo risco, rastreabilidade e possibilidade de rollback.

## Princípios

1. **Mobile-first nas áreas públicas**
   - As abas públicas são desenhadas prioritariamente para smartphones.
   - Tablet/desktop nas áreas públicas devem apenas preservar contenção visual.
   - Responsividade avançada fica para admin, painéis e telas de gestão.

2. **Pequenos PRs incrementais**
   - Evitar grandes refatorações em uma única mudança.
   - Cada PR deve ter um objetivo claro e escopo limitado.
   - Mudanças visuais não devem alterar regra de negócio sem necessidade.

3. **Validação antes de merge**
   - Preferir sempre validar preview da Vercel antes do merge.
   - Se a Vercel falhar por erro de build, corrigir antes do merge.
   - Se a Vercel falhar por limite de cota, registrar no PR e aguardar reset/retry sempre que possível.

4. **Produção só após build saudável**
   - Após merge, confirmar deployment de produção como `READY`.
   - Confirmar HTTP 200 da URL principal.
   - Registrar commit publicado.

5. **Supabase com cuidado extra**
   - Alterações DDL devem ser aplicadas via migration.
   - Evitar alterações destrutivas sem auditoria.
   - RLS deve ser preservado e validado.
   - Mudanças de configuração devem ser registradas em tabela/configuração quando fizer sentido.

---

## Fluxo padrão para PRs de UI

### 1. Criar branch a partir da `main`

Exemplo:

```txt
ui/mobile-sidebar-pages-audit
ui/mobile-smart-image-cards
hotfix/category-chips-icon-render
```

A branch deve sair do último commit saudável da `main`.

### 2. Aplicar mudanças pequenas e rastreáveis

Cada PR deve responder:

- Qual tela foi alterada?
- Qual componente foi aplicado?
- Houve alteração de regra de negócio?
- Há risco de impacto em auth, Supabase ou Vercel?

### 3. Abrir PR com descrição completa

O PR deve conter:

- Resumo objetivo.
- Arquivos/telas afetadas.
- O que foi mantido sem alteração.
- Como testar localmente.
- Checklist de validação mobile.

### 4. Validar mergeabilidade no GitHub

Antes de avançar:

- PR não pode estar em draft.
- PR precisa estar mergeável.
- Não deve ter conflito com `main`.

### 5. Validar Vercel preview

Fluxo ideal:

1. Confirmar deployment do PR.
2. Verificar status `READY`.
3. Abrir preview com HTTP 200.
4. Conferir se o bundle foi gerado sem erro.

Se o preview retornar 401/403 por proteção da Vercel, usar validação via ferramenta autorizada de fetch da Vercel.

### 6. Quando houver bloqueio por limite de build

Se os checks retornarem algo como:

```txt
Vercel – temnobairro: failure — build-rate-limit
```

A ação segura é:

1. Não mergear automaticamente.
2. Registrar comentário no PR com o motivo.
3. Aguardar reset da cota ou novo deploy.
4. Revalidar antes do merge.

Exceção possível:

- Em hotfix crítico e de baixo risco, pode-se mergear com consciência do risco e validar produção imediatamente após o merge.
- Essa exceção deve ser registrada no PR.

---

## Fluxo padrão para deploy em produção

Após merge na `main`:

1. Listar deployments da Vercel.
2. Identificar o deployment do commit mergeado.
3. Aguardar status `READY`.
4. Abrir URL pública:

```txt
https://temnobairro.vercel.app
```

5. Confirmar HTTP 200.
6. Registrar:

```txt
Status: READY
Ambiente: production
Commit publicado: <sha>
Bundle principal: /assets/index-*.js
```

---

## Fluxo para Supabase

### Migrations

Usar migration para:

- Criar tabelas.
- Criar índices.
- Alterar policies RLS.
- Criar funções/triggers.
- Registrar configurações globais.

Evitar `execute_sql` para DDL permanente. Preferir `apply_migration`.

### Configurações já registradas

A URL pública do app foi registrada no banco em:

```txt
public.app_settings
```

Chave:

```txt
public_app_url = https://temnobairro.vercel.app
```

### RLS

Sempre considerar:

- Toda tabela pública nova deve ter RLS avaliada.
- Configurações públicas devem ter policy explícita de leitura pública quando necessário.
- Dados sensíveis não devem ser expostos via policy ampla.

---

## Processo visual aprovado

### Fase já concluída

1. `ui/mobile-design-tokens`
   - Tokens visuais mobile-first.
   - Escala Tailwind.
   - Classes globais como `mobile-page`, `mobile-card`, `mobile-shell`.

2. `ui/mobile-shared-components`
   - `PageHero`
   - `SearchBar`
   - `CategoryChips`
   - `SectionHeader`
   - `MobileCard`
   - `SmartImage`
   - `BottomSheet`

3. `ui/mobile-public-heroes`
   - Jornal.
   - Comércios.

4. `ui/mobile-public-heroes-rest`
   - Vitrine.
   - Classificados.
   - Campanhas.

5. Hotfix aplicado
   - Correção de `CategoryChips` para aceitar ícones como React element, componente, string ou ausência de ícone.

### Fase atual

`ui/mobile-sidebar-pages-audit`

Objetivo:

- Mapear páginas secundárias do sidebar.
- Padronizar primeiro lote de páginas simples.
- Não refinar cards ainda.

Primeiro lote:

- `SupportView`
- `HistoryView`
- `UtilityView`

---

## Ordem recomendada dos próximos lotes

### 1. Sidebar comunidade

Branch sugerida:

```txt
ui/mobile-sidebar-community-pages
```

Telas:

- `SuggestionsView`
- `PollsView`
- `SecurityView`

### 2. Sidebar perfil, membros e planos

Branch sugerida:

```txt
ui/mobile-sidebar-profile-plans
```

Telas:

- `ProfileView`
- `MembersLandingView`
- `PlansView`
- `MerchantLandingView`

### 3. SmartImage e cards públicos

Branch sugerida:

```txt
ui/mobile-smart-image-cards
```

Aplicar em:

- Classificados.
- Campanhas.
- Vitrine.
- Cupons.
- Comércios.
- Jornal.

### 4. Painéis responsivos

Branch sugerida:

```txt
ui/admin-responsive-panels
```

Aplicar em:

- `AdminPanel`
- `UnifiedPanel`
- `ManagementView`
- Painéis de comerciante, morador e gestão.

---

## Checklist visual mobile

Validar principalmente em:

```txt
360x800
390x844
412x915
430x932
```

Checklist:

- Sem overflow horizontal.
- Bottom nav não cobre conteúdo importante.
- Áreas de toque confortáveis.
- Busca e filtros acessíveis com polegar.
- Scroll natural.
- Headers consistentes.
- Cards sem saltos visuais fortes.
- Imagens com fallback consistente.
- Modais/bottom sheets fecham corretamente.

---

## Checklist técnico antes do merge

- [ ] PR mergeável.
- [ ] Sem conflito com `main`.
- [ ] Escopo documentado.
- [ ] Sem alteração acidental de regra de negócio.
- [ ] Build preview Vercel `READY`, quando disponível.
- [ ] HTTP 200 no preview, quando disponível.
- [ ] Caso haja `build-rate-limit`, comentário registrado no PR.
- [ ] Após merge, produção Vercel `READY`.
- [ ] URL pública com HTTP 200.

---

## Rollback

Se produção apresentar falha após merge:

1. Identificar o último deployment saudável na Vercel.
2. Usar rollback pela Vercel, se necessário.
3. Reverter o PR no GitHub, se a origem for código.
4. Criar hotfix curto se a correção for simples.
5. Registrar causa e resolução no PR ou issue correspondente.

---

## Regra de ouro

Quando houver dúvida entre velocidade e segurança:

```txt
Segurança primeiro.
```

O app já está em uso e a experiência mobile é prioridade. Mudanças visuais devem melhorar percepção sem comprometer estabilidade, login, dados ou publicação em produção.
