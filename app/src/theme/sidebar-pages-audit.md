# Auditoria visual das páginas secundárias do sidebar

## Diretriz

As páginas públicas e comunitárias do sidebar devem seguir a base mobile-first do app, sem virar layouts desktop. A responsividade avançada fica para Admin, painéis e telas de gestão.

## Grupos

### Públicas mobile / comunidade

| Rota | Componente | Prioridade | Aplicar agora | Observação |
| --- | --- | --- | --- | --- |
| `utility` | `UtilityView` | Alta | Sim | Lista de serviços, busca e filtros. |
| `history` | `HistoryView` | Média | Sim | Conteúdo institucional simples. |
| `suggestions` | `SuggestionsView` | Alta | Próximo lote | Interação/votos/formulário. |
| `polls` | `PollsView` | Alta | Próximo lote | Interação e auth opcional. |
| `security` | `SecurityView` | Média | Próximo lote | Conteúdo utilitário/sensível. |
| `support` | `SupportView` | Alta | Sim | Formulário simples de ticket. |
| `coupons` | `CouponsView` | Alta | Lote de cards | Depende de SmartImage/cards. |

### Perfil, membros e planos

| Rota | Componente | Prioridade | Aplicar agora | Observação |
| --- | --- | --- | --- | --- |
| `profile` | `ProfileView` | Alta | Depois | Depende de auth e navegação interna. |
| `members-landing` | `MembersLandingView` | Média | Depois | Landing pública. |
| `member-panel` | `MemberPanelView` | Média | Painéis | Área autenticada. |
| `plans` | `PlansView` | Média | Depois | Comercial/conversão. |
| `merchant-landing` | `MerchantLandingView` | Média | Depois | Comercial/conversão. |

### Gestão e painéis

| Rota | Componente | Prioridade | Aplicar agora | Observação |
| --- | --- | --- | --- | --- |
| `admin` | `AdminPanel` | Alta | Fase própria | Responsividade tablet/desktop. |
| `merchant-panel` | `UnifiedPanel` | Alta | Fase própria | Gestão. |
| `resident-panel` | `UnifiedPanel` | Alta | Fase própria | Gestão. |
| `management` | `ManagementView` | Média | Fase própria | Gestão/planos. |

## Primeiro lote aplicado

- `SupportView`
- `HistoryView`
- `UtilityView`

## Próximos lotes sugeridos

1. `ui/mobile-sidebar-community-pages`
   - `SuggestionsView`
   - `PollsView`
   - `SecurityView`

2. `ui/mobile-sidebar-profile-plans`
   - `ProfileView`
   - `MembersLandingView`
   - `PlansView`
   - `MerchantLandingView`

3. `ui/mobile-smart-image-cards`
   - `CouponsView`
   - cards de Classificados
   - cards de Campanhas
   - cards de Vitrine

4. `ui/admin-responsive-panels`
   - `AdminPanel`
   - `UnifiedPanel`
   - `ManagementView`

## Critérios de aceite

- Usar `mobile-page` como wrapper.
- Usar `PageHero` quando houver topo de contexto.
- Usar `SearchBar` e `CategoryChips` quando houver busca/filtro.
- Usar `MobileCard` para superfícies simples.
- Evitar dependência de imagens remotas genéricas.
- Não alterar regras de negócio.
- Validar Vercel antes de mergear.
