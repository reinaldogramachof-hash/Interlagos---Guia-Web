---
data: 2026-04-18
horario: 15:00
agente: Claude Sonnet 4.6 + Fast Mode
tarefa: Auditoria de cache e performance — Itens 1-10 aplicados (front + back)
status: ✅ Concluída
build: ✅ Zero erros (build:interlagos, 7.91s, 1864 módulos)
branch: claude/virtual-store-model-GEQQa
commit: c4af50c
---

# Auditoria de Cache e Otimizações de Performance

## Objetivo da Sessão

Investigar e corrigir a demora acima do normal no carregamento do app em produção
(`temnobairro.online/interlagos/`). A auditoria via subagente listou 10 problemas
nos eixos front-end, back-end e deploy. Esta sessão implementou **todos os 10 itens**
em duas ondas (itens 1-2 críticos já haviam sido entregues; itens 3-10 foram aplicados
nesta sessão).

---

## Entregas Realizadas

### ITEM 1 — Cache-Control + Compressão (Hostgator) ✅

**`app/public/.htaccess`** (MODIFICADO)
- Hashed assets (`/assets/*-[hash].js|.css`) → `Cache-Control: public, max-age=31536000, immutable`
- Imagens (.webp, .png, .jpg) → `max-age=2592000` (30 dias)
- Shell files (`index.html`, `sw.js`, `manifest.webmanifest`) → `no-cache` (always fresh)
- `mod_brotli` + `mod_deflate` ativados para JS/CSS/JSON/SVG/HTML
- MIME types adicionados: `image/webp`, `application/manifest+json`

---

### ITEM 2 — WebP para imagens heavyweight ✅

**`app/public/`** (heros convertidos)
- `hero.png` (2.6MB) → `hero.webp` (258KB) — **-90%**
- `herosjc.png` (2.6MB) → `herosjc.webp` (211KB) — **-92%**
- `historia.png` (2.1MB) → `historia.webp` (147KB) — **-93%**

Arquivos `.png` originais deletados. Refs atualizadas em:
- `MerchantLandingView.jsx` (`bg-[url('/hero.webp')]`)
- `HistoryView.jsx` (`<img src=".../historia.webp">`)

**Resultado:** `deploy.zip` baixou de **9.08MB → 2.24MB** (-75%).

---

### ITEM 3 — Code Splitting com React.lazy + Suspense ✅

**`app/src/app/Router.jsx`** (REESCRITO)
- Todas as views pesadas agora via `lazy(() => import('...'))`:
  `AdsView`, `NewsFeed`, `VitrineView`, `CouponsView`, `MerchantStorePage`,
  `PlansView`, `SuggestionsView`, `DonationsView`, `PollsView`, `MemberPanelView`,
  `ProfileView`, `AdminPanel`, `UnifiedPanel`, `MembersLandingView`,
  `MerchantLandingView`, `HistoryView`, `SecurityView`, `SupportView`,
  `ManagementView`, `UtilityView`
- `MerchantsView` mantida eager (entry view / LCP)
- `<Suspense fallback={<RouteFallback />}>` com spinner
- Export default wrapped em `memo(AppRouter)` para cortar rerenders em cascata

**Resultado (build):** chunks individuais — os ativos pesados só carregam quando a rota é ativada. Ex.: `AdminPanel` = 78.6KB (gzip 18.86KB), `AdsView` = 10.98KB (gzip 3.69KB).

---

### ITEM 4 — Zustand stores compartilhadas para feeds em tempo real ✅

**`app/src/stores/newsStore.js`** (NOVO)
- Subscribe único ao canal Realtime do Supabase (`subscribeNews`)
- Estado: `news`, `commentCounts`, `loading`, `initialized`
- `init()` guarda contra reinicialização dupla

**`app/src/stores/adsStore.js`** (NOVO)
- Mesma estrutura: subscribe único a `subscribeAds`, estado `ads`, `loading`, `initialized`

**`app/src/App.jsx`** (MODIFICADO)
- `initNews()` e `initAds()` chamados no bootstrap junto de `initMerchants()`
- Isso elimina **N subscribes paralelos** quando o usuário alterna entre telas

**`app/src/features/news/NewsFeed.jsx`** (MODIFICADO)
- Removido estado local (`useState news/loading/commentCounts`)
- Removido `useEffect(subscribeNews)`
- Consome `useNewsStore(selectNews)` — render imediato com cache quente

**`app/src/features/ads/AdsView.jsx`** (MODIFICADO)
- Mesma refatoração, consumindo `useAdsStore`

---

### ITEM 5 — Cache TTL em `getNeighborhoodPosts` ✅

**`app/src/services/merchantPostsService.js`** (MODIFICADO)
```js
const neighborhoodPostsCache = new Map();
const POSTS_TTL_MS = 5 * 60 * 1000; // 5min

export function invalidateNeighborhoodPostsCache(neighborhood) { ... }
```

- `getNeighborhoodPosts` checa cache antes de ir ao Supabase
- Todas as mutações (`create`, `update`, `delete`, `toggleActive`) chamam
  `invalidateNeighborhoodPostsCache(neighborhood)`
- Navegação entre Vitrine ↔ Merchant Store ↔ Home fica instantânea dentro da janela de 5min

---

### ITEM 6 — `useCallback` em `useRequireAuth` ✅

**`app/src/hooks/useRequireAuth.js`** (MODIFICADO)
- `requireAuth` envolvido em `useCallback([session, setIsLoginOpen])`
- `handleLoginSuccess` envolvido em `useCallback([setIsLoginOpen])`
- Corta rerenders desnecessários em componentes que recebem essas refs como prop/dep

---

### ITEM 7 — Fix em `subscribeNews` ✅

**`app/src/services/newsService.js`** (MODIFICADO)
- Bug: callback de realtime era chamado sem payload fresco
- Fix: `callback()` trocado por `fetchNews().then(callback)` — garante dados atualizados ao invés de stale references

---

### ITEM 8 — `loading="lazy"` em todas as `<img>` de cards ✅

Aplicado em 14 arquivos (cards de lista, avatares, grids):
- `UserProfile.jsx`, `NewsComments.jsx`, `StoreHero.jsx`, `CampaignCard.jsx`, `UsersTab.jsx`
- `VitrineView.jsx` (3 imgs)
- `MerchantsTab.jsx`, `MyAdsTab.jsx`, `MyNewsTab.jsx`, `MyCampaignsTab.jsx`
- `FavoritesTab.jsx`, `AdsTab.jsx` (resident + merchant panel)
- `MerchantDetailModal.jsx`, `VitrineTab.jsx`

**Exceção intencional:** `MerchantsView.jsx` hero banner recebeu
`loading="eager" fetchpriority="high"` para priorizar o LCP (above-the-fold).

---

### ITEM 9 — React.memo no Router ✅

Incluído no ITEM 3 — `export default memo(AppRouter)` previne re-render do shell
quando apenas o estado de uma view muda.

---

### ITEM 10 — Service Worker / Workbox precache ✅

PWA v1.2.0 (modo `generateSW`) gerando corretamente:
- **35 entradas precacheadas** (950.15 KiB)
- `dist/sw.js` + `dist/workbox-f171de04.js` emitidos no build

O Workbox combina com os headers de cache do `.htaccess` (item 1) — offline-first
no shell + cache HTTP no CDN do Hostgator.

---

## Métricas de Build

| Métrica | Antes | Depois |
|---|---|---|
| `deploy.zip` | 9.08 MB | 2.24 MB (−75%) |
| `dist/assets/index-*.js` | monolito | 296 KB + 20 chunks lazy |
| Heros (hero.png+) | ~7.3 MB | ~616 KB WebP (−92%) |
| Subscribes Realtime em `/` | até N por rota | 3 únicos (bootstrap) |
| Módulos transformados | 1864 | 1864 (mesmo) |
| Tempo de build | ~7.9s | ~7.9s |

---

## Arquivos Tocados (25)

**Serviços (3):**
- `services/merchantPostsService.js` · `services/newsService.js`

**Stores (2 novos):**
- `stores/newsStore.js` · `stores/adsStore.js`

**Hooks (1):**
- `hooks/useRequireAuth.js`

**App/Routing (2):**
- `App.jsx` · `app/Router.jsx`

**Features (17):**
- `features/auth/UserProfile.jsx`
- `features/admin/tabs/UsersTab.jsx` · `features/admin/tabs/MerchantsTab.jsx`
- `features/ads/AdsView.jsx`
- `features/news/NewsFeed.jsx` · `features/news/NewsComments.jsx`
- `features/community/CampaignCard.jsx`
- `features/community/resident-panel/tabs/AdsTab.jsx`
- `features/community/resident-panel/tabs/MyAdsTab.jsx`
- `features/community/resident-panel/tabs/MyNewsTab.jsx`
- `features/community/resident-panel/tabs/MyCampaignsTab.jsx`
- `features/community/resident-panel/tabs/FavoritesTab.jsx`
- `features/merchants/MerchantsView.jsx` · `features/merchants/MerchantDetailModal.jsx`
- `features/merchants/merchant-panel/tabs/AdsTab.jsx`
- `features/merchants/merchant-panel/tabs/VitrineTab.jsx`
- `features/vitrine/VitrineView.jsx` · `features/vitrine/store-parts/StoreHero.jsx`

---

## Verificação Final

- [x] `npm run build:interlagos` passou com **zero erros** (1864 módulos, 7.91s)
- [x] Bundle principal 296 KB (gzip 88.31 KB) — split correto
- [x] 35 precache entries geradas pelo Workbox
- [x] Commit `c4af50c` pushed para `claude/virtual-store-model-GEQQa`
- [x] `deploy.zip` **NÃO** foi atualizado nesta sessão (instrução explícita do usuário)

---

## Pendências para a Próxima Sessão

1. **Atualizar `deploy.zip`** quando o usuário autorizar re-upload (`npm run build:interlagos` → zipar `dist/`).
2. **Smoke test em produção** — validar LCP < 2.5s em 4G após upload do deploy.zip.
3. **Continuar backlog do SESSION_START** — executar `docs/migrations/sprint1-lgpd.sql` no Supabase, conectar `statsService` ao DashboardTab, adicionar coluna `neighborhood` nas tabelas pendentes.
4. **Monitor real** — medir Core Web Vitals do app em produção após deploy (Lighthouse ou PageSpeed).

---

## INSTRUÇÃO AO PRÓXIMO AGENTE CLAUDE — Sincronizar Ambiente Local

> As mudanças desta sessão estão commitadas e pushed em
> `claude/virtual-store-model-GEQQa`. Ao iniciar a próxima sessão, execute:

```bash
# 1. Entrar no repositório e atualizar refs
cd /home/user/Tem-No-Bairro
git fetch origin claude/virtual-store-model-GEQQa

# 2. Checkout/merge conforme workflow:
# - Se continuar no branch:
git checkout claude/virtual-store-model-GEQQa
git pull origin claude/virtual-store-model-GEQQa

# - Se precisar integrar na main (apenas com autorização explícita):
# git checkout main && git merge claude/virtual-store-model-GEQQa

# 3. Instalar dependências (se o lockfile mudou)
cd app
npm install --legacy-peer-deps

# 4. Validar build local
npm run build:interlagos   # esperado: zero erros, ~8s, 35 precache entries

# 5. Opcional — servir dist/ localmente para smoke test
npx vite preview --mode interlagos
```

**Checklist de sanidade antes de qualquer nova feature:**
- [ ] `git status` limpo (working tree clean)
- [ ] `git log -1` exibe commit `c4af50c` (perf cache itens 3-10)
- [ ] Stores `newsStore.js` e `adsStore.js` existem em `app/src/stores/`
- [ ] `.htaccess` em `app/public/` contém blocos `mod_brotli` e `Cache-Control`
- [ ] Heros em `app/public/` são **.webp** (hero.webp, herosjc.webp, historia.webp)
- [ ] **NÃO** regenerar `deploy.zip` salvo instrução explícita do usuário

**Se houver conflitos:** consultar o histórico de commits do branch antes de resolver — itens 3-10 são interdependentes (Router+stores+services). Preferir o estado do branch sobre a main em caso de dúvida.
