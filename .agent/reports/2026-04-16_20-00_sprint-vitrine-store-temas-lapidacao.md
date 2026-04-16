---
data: 2026-04-16
horario: 20:00
agente: Claude Sonnet 4.6
tarefa: Sprint Vitrine Store — Temas Visuais, Loja Externa e Lapidação Visual
status: ✅ Concluída
build: ✅ Zero erros
---

# Sprint Vitrine Store — Temas Visuais + Store URL + Lapidação

## Objetivo da Sessão

Elevar o módulo de Vitrine Comercial para um nível de apresentação visual profissional, com:
1. Sistema de 6 temas visuais diferenciados por plano (Pro/Premium)
2. Integração de loja externa (`store_url`) como botão "Ver Loja Completa"
3. Lapidação completa da página de loja: hero, cards de produto, grid layout
4. Upload de foto de capa diretamente no painel do comerciante

---

## Entregas Realizadas

### 1. Banco de Dados (Migrations)

**`docs/migrations/sprint-vitrine-store.sql`** (NOVO)
- `store_color TEXT DEFAULT '#4f46e5'`
- `store_cover_url TEXT`
- `store_tagline TEXT`
- `store_description TEXT`
- `store_badge_text TEXT`

**`docs/migrations/sprint-vitrine-themes.sql`** (NOVO)
- `store_theme TEXT DEFAULT 'negocios'`
- `store_url TEXT`

Ambas as migrations foram aplicadas e validadas no Supabase pelo usuário.

---

### 2. `app/src/constants/plans.js`

Novos flags adicionados:
- `hasStoreTheme: true` — Pro e Premium
- `hasStoreUrl: true` — Pro e Premium
- `hasVitrineFeaturedRow: true` — Premium apenas
- `hasVitrineBadge: true` — Premium apenas
- `hasVitrineProductCTA: true` — Premium apenas

---

### 3. `app/src/services/merchantService.js`

`updateMerchantStore` expandido para persistir `store_theme` e `store_url` no Supabase.

---

### 4. `app/src/features/merchants/merchant-panel/tabs/CustomizeTab.jsx` (NOVO arquivo)

6 temas visuais selecionáveis em grid 3x2:

| Tema | Plano | Nicho |
|---|---|---|
| Negócios | Pro | Consultoria, escritórios, serviços B2B |
| Mercado | Pro | Alimentação, mercearia, varejo |
| Atelier | Pro | Beleza, moda, artesanato |
| Dark Tech | Premium | Tech, eletrônicos, games |
| Luxury | Premium | Clínicas, joias, estética premium |
| Vibrante | Premium | Academia, delivery, eventos |

Temas Premium ficam visíveis porém bloqueados (opacity-50) para usuários Pro — upsell por visibilidade.

Upload de foto de capa: drag-drop / click via `<input type="file">` + `uploadImage('merchant-images', ...)`.

Campo `store_url` (apenas planos com `hasStoreUrl`).

Card upsell "Quer uma loja 100% sua?" → WhatsApp `5512981260116`.

---

### 5. `app/src/features/vitrine/StoreProductCard.jsx` (NOVO arquivo)

Componente extraído para manter `MerchantStorePage` abaixo de 200 linhas.

- Props: `{ post, merchant, planConfig, theme, storeColor, isFeatured, onMerchantClick }`
- `TYPE_ICON`: `{ product: ShoppingBag, service: Wrench, news: Megaphone, promo: Tag }`
- Placeholder de produto vazio: gradiente com `storeColor` + ícone do tipo (mantém identidade da loja)
- `isFeatured` (index === 0): `col-span-2`, `aspect-video`, botão WhatsApp maior
- Exporta `cleanWhatsapp` utility

---

### 6. `app/src/features/vitrine/MerchantStorePage.jsx` (REESCRITO)

6 `STORE_THEMES` com overlays mais intensos (80–95% opacity) para impacto visual real:

```
negocios    → from-slate-900/80 via-slate-800/50 to-slate-900/10
mercado     → from-green-950/85 via-green-800/50 to-green-900/10
atelier     → from-pink-950/75 via-rose-800/40 to-pink-900/10
dark-tech   → from-gray-950/95 via-gray-800/65 to-gray-900/15
luxury      → from-black/85 via-black/50 to-black/10
vibrante    → from-violet-950/85 via-fuchsia-800/55 to-violet-900/10
```

**Mudanças de layout:**
- Nome + tagline do comerciante agora dentro do hero (`absolute bottom-4`) — visual Instagram/YouTube
- Avatar com `background: storeColor` (não branco)
- Nome removido do bloco de perfil (evita duplicidade com hero)
- Badge Premium Crown alinhado à direita
- Faixa de destaque com `background: storeColor`
- Botão "Ver Loja Completa" com `store_url` (planos `hasStoreUrl`)
- Contador de itens no cabeçalho do grid
- `storeColor` repassado ao `StoreProductCard`
- `useToast` substituindo `alert()` na função de share

---

## Bugs Corrigidos

| Bug | Arquivo | Fix |
|---|---|---|
| `visibleThemes` filtrava temas Premium de usuários Pro | CustomizeTab.jsx | `const visibleThemes = Object.entries(THEMES)` — todos visíveis, `isLocked` por item |
| `alert('Link copiado!')` no share | MerchantStorePage.jsx | Substituído por `showToast('Link copiado!', 'success')` |
| BottomNav "Campanhas" apontava para `donations` | BottomNav.jsx | Corrigido para view correta; CouponsCarousel movido para VitrineView |

---

## Pendências para Próxima Sessão

- [ ] Validar visualmente com produto + imagem na conta `premium@teste.com` (card isFeatured com `aspect-video` + WhatsApp CTA overlay)
- [ ] Confirmar que upload de capa funciona end-to-end no bucket `merchant-images`
- [ ] Audit visual automatizado (playwright) — tentativa rejeitada nesta sessão, executar manualmente
- [ ] Fase 2 da Vitrine: módulo de pedidos (`orders` table no Supabase)

---

## Build Final

```
✓ built in 12.03s — zero erros
PWA v1.2.0 — 10 entries precached (934.55 KiB)
```
