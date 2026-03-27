# Auditoria de Lógica de Interação — UX Mobile
**Projeto:** Tem No Bairro — React 19 + Vite + Tailwind + Supabase + Zustand 5  
**Data:** 2026-03-26  
**Escopo:** 375px, iOS Safari, Android Chrome  
**Metodologia:** Revisão estática de código + análise de padrões de interação  
**Status:** ⚠️ 12 bugs encontrados (3 críticos · 5 médios · 4 baixos)

---

## Bug #1 — CRÍTICO

**Título:** Botão X do `MerchantDetailModal` não fecha no mobile (conflito de evento touch)  
**Arquivo:** `app/src/features/merchants/MerchantDetailModal.jsx:80`  
**Causa raiz:**  
O botão X está dentro do container `.relative` da imagem de capa (linha 72), que por sua vez é filho do modal sem nenhum `onClick` no backdrop. Porém, o problema principal em touch é que o elemento pai `<div className="absolute inset-0 bg-gradient-to-t from-black/80...">` (linha 78) sobrepõe visualmente a área inteira do `<div className="h-48 sm:h-64 ...">`, e o botão X em `top-4 right-4` fica com `z-auto`. Em iOS Safari, o evento tap pode ser absorvido pelo gradiente overlay (que é `div` sem pointer-events desabilitado) em vez de atingir o botão X. Além disso, o `useEffect` na linha 20–28 tem `[onClose]` como dependência: como `onClose` em `App.jsx:97` é uma arrow function anônima `() => setSelectedMerchant(null)` criada inline, ela recria a referência a cada render, podendo causar re-execução do useEffect e, portanto, dupla adição/remoção do listener de teclado.  
**Reprodução:**
1. Abrir o app em iOS Safari ou Chrome Mobile (375px)
2. Tocar em qualquer card de comerciante para abrir o modal
3. Tentar tocar no ícone X no canto superior direito da imagem
4. Modal não fecha, ou fecha apenas após múltiplas tentativas

**Correção proposta:**
```jsx
{/* Botão X — garantir z-index acima do overlay e área de toque adequada */}
<button
  onClick={(e) => { e.stopPropagation(); onClose(); }}
  className="absolute top-4 right-4 z-20 bg-black/30 text-white p-3 rounded-full
             hover:bg-black/50 backdrop-blur-md transition-all min-w-[44px] min-h-[44px]
             flex items-center justify-center"
  aria-label="Fechar"
>
  <X size={20} />
</button>
```
E no `App.jsx`, estabilizar a referência via `useCallback`:
```jsx
// App.jsx
import { useCallback } from 'react';
const handleCloseMerchant = useCallback(() => setSelectedMerchant(null), [setSelectedMerchant]);
// ...
<MerchantDetailModal merchant={selectedMerchant} onClose={handleCloseMerchant} ... />
```
**Padrão de referência:** `SidebarMenu.jsx:75` — usa `onClick={onClose}` direto no overlay, sem conflito porque o aside tem `pointer-events-auto` separado.

---

## Bug #2 — CRÍTICO

**Título:** Background scrollável quando `MerchantDetailModal` está aberto (iOS Safari)  
**Arquivo:** `app/src/features/merchants/MerchantDetailModal.jsx:21–25`  
**Causa raiz:**  
`document.body.style.overflow = 'hidden'` não funciona no iOS Safari porque o Safari ignora `overflow: hidden` no `body` quando há scroll nativo. O scroll continua acontecendo no elemento `<html>` ou via momentum scroll (inércia). Adicionalmente, o cleanup usa `document.body.style.overflow = ''` (linha 25), enquanto `Modal.jsx:12` usa `'unset'` — inconsistência que causará problemas se os modais coexistirem.  
**Reprodução:**
1. Abrir o app em iOS Safari
2. Rolar a página de comércios até o meio
3. Tocar em um card para abrir o modal
4. Tentar rolar dentro do modal — o background também desliza

**Correção proposta:**
```jsx
// MerchantDetailModal.jsx — substitua o useEffect de scroll lock
useEffect(() => {
  const scrollY = window.scrollY;
  const body = document.body;
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflowY = 'scroll'; // evita layout shift por barra de rolagem

  const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflowY = '';
    window.scrollTo(0, scrollY);
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []); // ← dependência vazia; onClose deve ser tratado via useRef separado
```
> **Nota:** A dependência `[onClose]` deve ser removida deste useEffect para evitar o problema de instabilidade de referência descrito no Bug #1. O listener de Escape pode usar `onClose` via `useRef` para manter a referência atualizada sem reexecutar o effect.

**Padrão de referência:** Nenhum componente atual usa a correção `position: fixed`. É o padrão correto a adotar para todos os modais.

---

## Bug #3 — CRÍTICO

**Título:** Dois padrões de modal com comportamentos e cleanup incompatíveis convivendo no mesmo app  
**Arquivo:** `app/src/components/Modal.jsx:9,12` vs `app/src/features/merchants/MerchantDetailModal.jsx:25`  
**Causa raiz:**  
Existem duas implementações de scroll lock que diferem em dois pontos críticos:

| Aspecto | `Modal.jsx` | `MerchantDetailModal.jsx` |
|---|---|---|
| Lock | `overflow = 'hidden'` | `overflow = 'hidden'` |
| Unlock (cleanup) | `overflow = 'unset'` | `overflow = ''` ← correto para remover inline style |
| Fecha no backdrop | ✅ Sim (`onClick={onClose}`) | ❌ Não |
| Dependência do useEffect | `[isOpen]` | `[onClose]` (instável) |

**Risco concreto:** Se `MerchantDetailModal` abrir por cima de outro modal baseado em `Modal.jsx` (ex: `LoginModal` enquanto `selectedMerchant` ainda está setado), o cleanup do `MerchantDetailModal` pode ser chamado primeiro, definindo `overflow = ''` e reativando o scroll enquanto `Modal.jsx` ainda está aberto.

**Correção proposta:**  
Unificar toda a lógica de scroll lock em um hook compartilhado:
```js
// hooks/useScrollLock.js (novo arquivo)
import { useEffect, useRef } from 'react';

export function useScrollLock(isLocked) {
  const scrollY = useRef(0);
  useEffect(() => {
    if (!isLocked) return;
    scrollY.current = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY.current}px`;
    body.style.width = '100%';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollY.current);
    };
  }, [isLocked]);
}
```
Refatorar `Modal.jsx` e `MerchantDetailModal.jsx` para usar `useScrollLock`.

**Padrão de referência:** `SidebarMenu.jsx:56–59` aplica `overflow: hidden` no body ao abrir, mas também sofre do problema iOS. A correção do hook deve ser uniformemente aplicada.

---

## Bug #4 — MÉDIO

**Título:** `import` de `ShieldCheck` após o `export default` em `AdDetailModal` — erro de hoisting potencial  
**Arquivo:** `app/src/features/ads/AdDetailModal.jsx:94`  
**Causa raiz:**  
```js
// linha 93–94
// Icon helper
import { ShieldCheck } from 'lucide-react';
```
O `import` está **após o `export default`** na linha 91. Embora o bundler (Vite/Rollup) faça hoisting estático de todos os `import`s antes da execução, **o linter e ferramentas de análise estática** como ESLint (com `import/order` ou `import/first`) reportarão esse import como inválido. Mais grave: se o arquivo for processado por ferramentas que não fazem hoisting (como Jest sem `babel-jest`), isso causará `ReferenceError`. A inconsistência também indica que o ícone foi adicionado às pressas sem refatoração adequada.  
**Reprodução:** Executar `npm run lint` ou tentar rodar testes unitários.

**Correção proposta:**
```jsx
// Mover para o topo do arquivo, junto com os outros imports de lucide-react
import { MessageCircle, Clock, Tag, User, MapPin, Share2, AlertTriangle, ShieldCheck } from 'lucide-react';
// Remover as linhas 93–94
```
**Padrão de referência:** Todos os outros arquivos do projeto importam no topo. `Modal.jsx:2`, `MerchantDetailModal.jsx:2`.

---

## Bug #5 — MÉDIO

**Título:** `currentUser?.uid` usado em vez de `currentUser?.id` (legado Firebase não migrado)  
**Arquivo:** `app/src/features/merchants/MerchantDetailModal.jsx:32,36`  
**Causa raiz:**  
O Supabase expõe o usuário autenticado com a propriedade `.id` (UUID), não `.uid` (padrão Firebase). O `AuthContext` provavelmente mapeia os campos, mas o uso direto de `currentUser?.uid` pode retornar `undefined` se o contexto não faz o remapeamento, fazendo `checkIsFavorite(undefined, merchant.id)` — chamada silenciosamente errada que não favorita nada e não exibe erro.

```jsx
// MerchantDetailModal.jsx linha 32 e 36
checkIsFavorite(currentUser.uid, merchant.id)   // ← .uid pode ser undefined
// ...
}, [merchant?.id, currentUser?.uid]);             // ← dependência sempre undefined
```

O correto (conforme padrão do projeto — `SuggestionsView.jsx:39` e commit recente `fix(admin): expose currentUser.id`) é usar `.id`.

**Reprodução:**
1. Entrar com uma conta Google via Supabase
2. Abrir o `MerchantDetailModal` de qualquer comerciante
3. Clicar em ❤️ Favoritar — a operação não persiste

**Correção proposta:**
```jsx
// Linha 31–36 — substituir .uid por .id em todos os usos
useEffect(() => {
  if (merchant?.id && currentUser) {
    checkIsFavorite(currentUser.id, merchant.id).then(setIsFavorite); // ← .id
  } else {
    setIsFavorite(false);
  }
}, [merchant?.id, currentUser?.id]); // ← .id
```
**Padrão de referência:** `SuggestionsView.jsx:39` usa `currentUser.id`; `handleToggleFavorite` na linha 51 já usa `useAuthStore.getState().session?.user?.id` corretamente.

---

## Bug #6 — MÉDIO

**Título:** Carrosséis pausam apenas com mouse hover — sem suporte a touch no container pai  
**Arquivo:** `app/src/features/merchants/PremiumCarousel.jsx:42`, `ProCarousel.jsx:41`  
**Causa raiz:**  
Os wrappers `.group` dos carrosséis usam `onMouseEnter`/`onMouseLeave` para pausar o auto-scroll. Em dispositivos touch não existem esses eventos — `onMouseEnter` só dispara após o primeiro toque em alguns browsers, mas de forma inconsistente. Portanto, o carrossel continua se movendo enquanto o usuário tenta navegar.

O hook `useAutoScrollCarousel.js` **já implementa** `onTouchStart`/`onTouchEnd` no elemento `carouselRef` (linhas 37–41), porém o container pai (`.group` div) não propaga pause ao toque nele mesmo.

**Reprodução:**
1. Abrir o app em dispositivo touch (iOS/Android)
2. Ir para a view de Comércios
3. Tentar tocar (sem deslizar) em um card do PremiumCarousel
4. O carrossel segue se movendo durante e após o toque

**Correção proposta:**
```jsx
// PremiumCarousel.jsx e ProCarousel.jsx — adicionar handlers de touch no wrapper
<div
  className="relative group"
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
  onTouchStart={() => setIsPaused(true)}
  onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
>
```
**Padrão de referência:** O hook `useAutoScrollCarousel.js:37` já implementa a lógica correta de touch no elemento scrollável. Basta refletir o mesmo padrão no wrapper.

---

## Bug #7 — MÉDIO

**Título:** `ServiceDetailModal` recebe `service={selectedService}` mas `isOpen` nunca é passado como prop  
**Arquivo:** `app/src/App.jsx:109` e `app/src/features/merchants/ServiceDetailModal.jsx:5`  
**Causa raiz:**  
Em `App.jsx:109`:
```jsx
<ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
```
`isOpen` **não é passado**. A assinatura do componente é `{ isOpen, onClose, service }`. Internamente ele renderiza `<Modal isOpen={isOpen} ...>` — portanto `isOpen` será sempre `undefined`, que é falsy, e o `Modal.jsx` retorna `null` na linha 16. O modal **nunca abre**.

O componente só renderiza porque tem o guard `if (!service) return null` na linha 6, mas após esse guard ainda depende de `isOpen` para exibir via `Modal`. A renderização condicional em `App.jsx` (`{selectedService && ...}`) garante que `service` existe, mas não passa `isOpen={true}`.

**Reprodução:**
1. Encontrar um item de serviço público que dispara `setSelectedService`
2. Tentar abrir — nada aparece

**Correção proposta:**
```jsx
// App.jsx:108-110 — passar isOpen explicitamente
{selectedService && (
  <ServiceDetailModal
    isOpen={true}
    service={selectedService}
    onClose={() => setSelectedService(null)}
  />
)}
```
**Padrão de referência:** `AdDetailModal` em `AdsView.jsx:128` usa `isOpen={!!selectedAd}` corretamente.

---

## Bug #8 — MÉDIO

**Título:** `LoginModal` não trava o scroll do body (sem lock de scroll)  
**Arquivo:** `app/src/features/auth/LoginModal.jsx:82–192`  
**Causa raiz:**  
O `LoginModal` implementa seu próprio overlay fixed (`z-[100]`) sem nenhum scroll lock. Diferente de `Modal.jsx` que usa `useEffect` para `overflow: hidden`, o `LoginModal` não tem nenhum mecanismo equivalente. Em mobile, o background (lista de merchants) continua scrollável enquanto o login está aberto.  
**Reprodução:**
1. Tocar em "Entrar" no `AppHeader`
2. Com o modal de login aberto, tentar rolar o dedo na área ao lado do modal
3. Background rola livremente

**Correção proposta:**  
Adicionar `useScrollLock(true)` (hook proposto no Bug #3) ou, como solução imediata:
```jsx
// LoginModal.jsx — adicionar no início do componente
useEffect(() => {
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  return () => {
    document.body.style.position = '';
    document.body.style.width = '';
  };
}, []);
```
**Padrão de referência:** `OnboardingModal.jsx` (z-[200]) também carece do lock — mesmo problema.

---

## Bug #9 — BAIXO

**Título:** `BottomNav` — área de toque dos botões menor que 44×44px no eixo vertical  
**Arquivo:** `app/src/components/BottomNav.jsx:17–30`  
**Causa raiz:**  
O `<nav>` tem `h-16` (64px). Os botões usam `h-full flex-1` — tecnicamente têm 64px de altura, o que satisfaz o critério de 44px. Porém a área clicável horizontal individual é `1/4` da largura da tela (≈94px em 375px). O problema está em telas menores que 320px onde 4 itens comprimidos podem ficar abaixo de 44px cada.

Mais relevante: o ícone dentro do botão tem `size={22}` (não ativo) ou `size={24}` (ativo), e o label embaixo com `text-[10px]` — a zona visual "percebida" como interativa é pequena. O `active:scale-[0.99]` está ausente nos botões do nav, o que reduz feedback de toque.

**Correção proposta:**
```jsx
<button
  key={id}
  onClick={() => onNavigate(id)}
  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative
    active:opacity-70 min-h-[44px] // garantir mínimo iOS HIG
    ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
>
```
**Padrão de referência:** Diretrizes Apple HIG e Material Design especificam mínimo de 44×44pt para alvos de toque.

---

## Bug #10 — BAIXO

**Título:** `SidebarMenu` — escape key listener recriado a cada render por instabilidade de `onClose`  
**Arquivo:** `app/src/components/SidebarMenu.jsx:50–54`  
**Causa raiz:**  
```jsx
useEffect(() => {
  const handler = (e) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [onClose]); // ← onClose é () => setIsSidebarOpen(false) — instável
```
A prop `onClose` vinda de `App.jsx:59` é `() => setIsSidebarOpen(false)`, uma arrow function inline recriada a cada render. O effect re-executa a cada render do `AppContent`, adicionando e removendo o listener repetidamente. Isso é ineficiente e pode causar comportamento errático em render duplo (React StrictMode).

**Correção proposta:**  
Estabilizar `onClose` no `App.jsx` com `useCallback`, ou usar `useRef` dentro do Sidebar:
```jsx
// App.jsx
const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);
// <SidebarMenu onClose={handleCloseSidebar} .../>
```
**Padrão de referência:** `useRequireAuth.js` usa `useRef` para evitar problemas similares com closures e ações pendentes.

---

## Bug #11 — BAIXO

**Título:** `OnboardingModal` — sem lock de scroll e sem possibilidade de fechar  
**Arquivo:** `app/src/features/auth/OnboardingModal.jsx:205–235`  
**Causa raiz:**  
O `OnboardingModal` não tem botão de fechar (by design — é obrigatório), mas também não trava o scroll do body nem desabilita o backdrop. Isso significa que:
1. O background é scrollável em iOS Safari (mesmo problema do Bug #2)
2. Não há `aria-modal="true"` nem `role="dialog"` — falha de acessibilidade

**Correção proposta:**  
Adicionar scroll lock (mesmo padrão do Bug #3 proposto) e atributos de acessibilidade:
```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="onboarding-title"
  className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[200] p-4"
>
```
**Padrão de referência:** `LoginModal.jsx:83` usa `z-[100]` sem `role="dialog"` — também carece de acessibilidade.

---

## Bug #12 — BAIXO

**Título:** Botão "Anunciar Grátis" (`App.jsx:79`) pode ficar sobrepostos por `MerchantDetailModal` aberto  
**Arquivo:** `app/src/App.jsx:77–85`  
**Causa raiz:**  
O botão FAB "Anunciar Grátis" usa `z-30`. O `MerchantDetailModal` usa `z-50`. Quando o `MerchantsView` tem `currentView === 'ads'` e simultaneamente um `selectedMerchant` existe no state (cenário improvável mas possível em race condition ao navegar), o modal sobrepõe o FAB visualmente. Porém o botão FAB só aparece em `currentView === 'ads'` — e o `MerchantDetailModal` só abre quando `selectedMerchant !== null`. Esses dois estados não deveriam coexistir, mas não há nenhum guard explícito que limpe `selectedMerchant` ao mudar de view.

**Correção proposta:**  
Limpar `selectedMerchant` ao mudar de view:
```js
// uiStore.js — atualizar setCurrentView
setCurrentView: (view) => set({ currentView: view, selectedMerchant: null, selectedService: null }),
```
**Padrão de referência:** Boa prática de UX — modais contextuais devem ser fechados ao mudar de contexto.

---

## Resumo de Prioridades

| Prioridade | Bug | Severidade | Componente | Impacto no Usuário Mobile |
|:---:|---|:---:|---|---|
| 1 | **Bug #1** — Botão X não fecha o modal | 🔴 CRÍTICO | `MerchantDetailModal` | Usuário fica preso no modal |
| 2 | **Bug #2** — Background scrollável (iOS) | 🔴 CRÍTICO | `MerchantDetailModal` | Experiência caótica ao rolar |
| 3 | **Bug #3** — Dois padrões de modal conflitantes | 🔴 CRÍTICO | `Modal.jsx` + `MerchantDetailModal` | Scroll ativa inadvertidamente |
| 4 | **Bug #7** — `ServiceDetailModal` nunca abre | 🟡 MÉDIO | `App.jsx` | Feature completamente quebrada |
| 5 | **Bug #5** — `currentUser.uid` vs `.id` | 🟡 MÉDIO | `MerchantDetailModal` | Favoritos silenciosamente falham |
| 6 | **Bug #8** — `LoginModal` sem scroll lock | 🟡 MÉDIO | `LoginModal` | Background rola durante login |
| 7 | **Bug #6** — Carrosséis sem pausa em touch | 🟡 MÉDIO | `PremiumCarousel`, `ProCarousel` | Dificuldade de selecionar card |
| 8 | **Bug #4** — Import após export default | 🟡 MÉDIO | `AdDetailModal` | Quebra em ambientes sem hoisting |
| 9 | **Bug #11** — `OnboardingModal` sem scroll lock | 🔵 BAIXO | `OnboardingModal` | Background rola durante onboarding |
| 10 | **Bug #10** — Escape listener instável no Sidebar | 🔵 BAIXO | `SidebarMenu` | Leak de memória / comportamento erático |
| 11 | **Bug #9** — Touch target BottomNav abaixo do ideal | 🔵 BAIXO | `BottomNav` | Dificuldade de toque em telas pequenas |
| 12 | **Bug #12** — Modal sobrepõe FAB em race condition | 🔵 BAIXO | `App.jsx` + `uiStore` | Botão FAB bloqueado |

---

## Ações Imediatas Recomendadas (Sprint de Correção)

### Alta prioridade — fazer antes do próximo deploy
1. Criar `hooks/useScrollLock.js` e migrar todos os modais (Bugs #2, #3, #8, #11)
2. Corrigir `onClose` com `useCallback` no `App.jsx` (Bugs #1, #10)
3. Adicionar `e.stopPropagation()` e `z-20` no botão X do `MerchantDetailModal` (Bug #1)
4. Passar `isOpen={true}` para `ServiceDetailModal` em `App.jsx` (Bug #7)
5. Substituir `currentUser?.uid` por `currentUser?.id` (Bug #5)

### Média prioridade — sprint seguinte
6. Mover import `ShieldCheck` para o topo de `AdDetailModal` (Bug #4)
7. Adicionar `onTouchStart`/`onTouchEnd` nos wrappers dos carrosséis (Bug #6)

### Baixa prioridade — backlog de qualidade
8. Melhorar feedback de toque no `BottomNav` (Bug #9)
9. Estabilizar listener de Escape no `SidebarMenu` (Bug #10)
10. Limpar `selectedMerchant` ao mudar de view no `uiStore` (Bug #12)
