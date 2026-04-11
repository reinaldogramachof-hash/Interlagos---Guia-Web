---
name: automated-smoke-test
description: Executa rotina de Smoke Testing visual e funcional no projeto Tem No Bairro após refatorações, deploys ou implementações de novas features. Acione quando o usuário pedir "testar o app", "validar que não quebrou", "smoke test" ou ao final de qualquer refatoração que toque múltiplos arquivos.
---

# Protocolo de Smoke Testing — Tem No Bairro

**Projeto:** Tem No Bairro — React 19 + Vite 7 + Supabase + PWA
**Objetivo:** Verificar que os fluxos críticos da aplicação continuam funcionando após intervenções sistêmicas. Não substitui testes unitários — valida comportamento real no navegador.

---

## Passos de Execução

### 1. Verificação de Build (Pré-condição obrigatória)

Antes de qualquer teste visual, execute o build em `@app/`:

```bash
npm run build:interlagos
```

- **SE houver erros de build:** PARE. Reporte ao Claude/usuário antes de prosseguir. Não adianta testar uma build quebrada.
- **SE o build passar com zero erros:** prossiga para o passo 2.

### 2. Mapeamento de Rotas e Fluxos Críticos

Leia `@app/src/app/Router.jsx` para identificar as views ativas. Para o bairro interlagos, as rotas críticas padrão são:

| Rota | View | Critério de Aprovação |
|---|---|---|
| `/interlagos/` | MerchantsView | Cards de merchants carregam; sem tela branca |
| `/interlagos/` (tab Anúncios) | AdsView | Lista de anúncios renderiza |
| `/interlagos/` (tab Notícias) | NewsFeed | Cards de notícias aparecem |
| `/interlagos/` (tab Comunidade) | SuggestionsView | Componente renderiza sem crash |
| Modal de Login | LoginModal | Botão Google OAuth visível |
| Modal de Merchant | MerchantDetailModal | Abre ao clicar em card; botão WhatsApp presente |

Adicione rotas adicionais se a sessão atual implementou novas views.

### 3. Execução via Subagente de Navegador

- Inicie o subagente de navegador.
- Acesse `http://localhost:5173/interlagos/` (confirme a porta ativa antes).
- Para cada rota/fluxo da tabela acima:
  1. Navegue até a rota.
  2. Aguarde 2 segundos para carregamento assíncrono (dados do Supabase).
  3. Verifique a **ausência** de erros no console do navegador (vermelho = falha crítica; amarelo = warning aceitável).
  4. Verifique se os elementos principais estão visíveis no DOM.
  5. Registre: **PASSOU** ou **FALHOU** com descrição do sintoma.

### 4. Testes de Interação Mínima

Execute pelo menos estas interações para validar estado dinâmico:

- [ ] Clicar em um card de merchant → modal abre sem crash.
- [ ] Clicar em "Compartilhar" / botão WhatsApp → link gerado corretamente.
- [ ] Tentar interagir (curtir/comentar) sem login → LoginModal aparece (Lazy Login).
- [ ] Fechar modal → retorna à view sem reload da página.

### 5. Verificação Mobile (375px)

- Redimensione a janela do subagente para 375px de largura.
- Confirme que nenhum elemento transborda horizontalmente (scroll horizontal = falha).
- Confirme que botões de ação primária estão acessíveis sem zoom.

### 6. Relatório de Smoke Test

Gere um relatório Markdown estruturado com:

```markdown
## Smoke Test — [data/hora]

**Build:** ✅ Passou / ❌ Falhou
**Commit de referência:** [hash]

### Rotas Testadas

| Rota | Status | Observação |
|---|---|---|
| /interlagos/ (Merchants) | ✅ Passou | — |
| ... | ... | ... |

### Erros Encontrados

[lista de erros de console ou falhas visuais]

### Warnings Notáveis

[warnings de depreciação ou performance]

### Pendências

[o que não pôde ser testado e por quê]
```

Salve o relatório em `@.agent/reports/` seguindo o padrão de nomenclatura `YYYY-MM-DD_HH-MM_smoke-test.md`.

---

## Restrições

- **NUNCA** marcar o smoke test como aprovado se houver erros vermelhos no console.
- **NUNCA** pular o passo de build antes dos testes visuais.
- **NUNCA** testar em produção (`temnobairro.online`) — apenas ambiente local.
- Se o subagente de navegador não conseguir acessar a aplicação local, reporte ao usuário que o servidor de dev precisa estar rodando (`npm run dev` em `app/`).
- Warnings de `React.StrictMode` (double-render) são esperados em dev — não são falhas.
