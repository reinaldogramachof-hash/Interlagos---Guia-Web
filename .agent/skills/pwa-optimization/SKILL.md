---
name: pwa-optimization
description: Configura, audita e otimiza Progressive Web Applications (PWAs) do projeto Tem No Bairro, gerenciando Manifests e Service Workers via vite-plugin-pwa + Workbox. Acione quando o usuário pedir para "transformar em PWA", "configurar offline", "auditar PWA" ou "corrigir cache do Service Worker".
---

# Protocolo de Geração e Auditoria PWA

**Projeto:** Tem No Bairro — React 19 + Vite 7 + vite-plugin-pwa (Workbox)
**Stack de PWA obrigatória:** `vite-plugin-pwa` com Workbox. NÃO usar Service Worker manual sem passar pelo plugin.

---

## Passos de Execução

### 1. Auditoria de Estado Atual

- Leia `@app/vite.config.js` — verifique se o plugin `VitePWA` está configurado e quais estratégias de cache estão definidas.
- Inspecione `@app/public/` em busca de `manifest.json` ou `manifest.webmanifest`.
- Verifique se as tags meta obrigatórias estão em `@app/index.html`:
  - `<meta name="theme-color" content="...">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - `<link rel="manifest" href="/manifest.webmanifest">`
- Liste o que está presente, incompleto ou ausente antes de prosseguir.

### 2. Geração ou Correção de Artefatos

**Se o Manifest estiver ausente ou incompleto:**
- Gere ou complete dentro da configuração `VitePWA` em `vite.config.js`, usando o campo `manifest:`.
- Campos obrigatórios: `name`, `short_name`, `theme_color`, `background_color`, `display: "standalone"`, `start_url`, `icons` (pelo menos 192x192 e 512x512).
- Ícones placeholder são aceitáveis — registrar no Walkthrough que precisam ser substituídos pelo usuário.

**Se a estratégia de cache estiver ausente ou incorreta:**
- Configure via `workbox:` dentro do plugin `VitePWA`:
  - **Network First** para requisições Supabase (padrão `https://*.supabase.co/*`).
  - **Cache First** para assets estáticos (JS, CSS, fontes, imagens).
  - **Stale While Revalidate** para o feed principal (merchants, news) — permite exibição offline.
- NUNCA sobrescrever uma configuração Workbox existente sem registrar o estado anterior em comentário no próprio arquivo.

### 3. Auditoria Visual e Funcional — Subagente de Navegador (OBRIGATÓRIO)

> Esta etapa não pode ser pulada. PWA sem teste offline é entrega incompleta.

- Inicie o subagente de navegador.
- Acesse a aplicação em `http://localhost:5173/interlagos/` (ou a porta ativa).
- Abra DevTools → aba **Application** → Service Workers → confirme que o SW está registrado e ativo.
- Alterne para aba **Network** → marque **Offline**.
- Recarregue a página.
- **Critério de aprovação:** A aplicação deve renderizar o feed (mesmo que em cache) ou a tela de fallback offline configurada — NÃO o dinossauro do Chrome.
- Tire screenshot do resultado offline e anexe ao Walkthrough.
- Desmarque Offline e confirme que a aplicação volta ao estado normal.

### 4. Walkthrough Final

Gere um artefato com:
- Estado antes da intervenção (o que estava faltando/errado).
- Lista de arquivos criados ou modificados.
- Screenshot do teste offline (do subagente de navegador).
- Pendências que o usuário precisa resolver (ícones, cores de tema, etc.).

---

## Restrições

- **NUNCA** usar `generateSW: false` sem justificativa explícita — isso desativa o Service Worker.
- **NUNCA** registrar rotas de cache para `*.env*` ou qualquer arquivo de credenciais.
- **NUNCA** sobrescrever SW existente sem backup comentado no mesmo arquivo.
- Certificar que o ambiente de desenvolvimento tem `VITE_DISABLE_PWA=false` ou equivalente ativo.
- Todas as rotas da aplicação (`/interlagos/*`) devem estar cobertas pelo `navigateFallback` do Workbox.
