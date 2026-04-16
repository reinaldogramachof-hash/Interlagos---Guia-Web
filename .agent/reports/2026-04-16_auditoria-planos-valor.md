# Auditoria de Valor — Painéis de Comerciante por Plano

## A. MATRIZ DE CONFORMIDADE

| Feature | Status | Observações |
| :--- | :---: | :--- |
| `adLimit` | ⚠️ Parcialmente | Cosmético no Dashboard. Não é bloqueado funcionalmente na criação em `AdsTab`. |
| `categoryLimit` | ⚠️ Parcialmente | Texto cosmético em `SettingsTab`. O limite não é forçado e a interface nem suporta múltiplas opções (Select padrão). |
| `photoLimit` | ✅ Implementado | Bloqueio real inserido no upload de imagens em `AdsTab.jsx` (Math.max(1, photoLimit)). |
| `hasSocialLinks` | ❌ Não implementado | Campos de Instagram/Site estão sempre abertos e editáveis para todos os planos. |
| `hasStats` | ✅ Implementado | Restrição visual/funcional aplicada no Dashboard e acesso bloqueado na `ReportsTab`. |
| `hasFeaturedBadge` | ❌ Não implementado | Badge rotativo não funcional — estático na interface de listagem. |
| `hasTopSearch` | ❌ Não implementado | Flag morta em `plans.js`, sem componente consumindo a propriedade. |
| `hasBanner` | ❌ Não implementado | Flag morta, promessa sem implementação visual na view de Lojas/Busca. |
| `hasVerifiedBadge` | ❌ Não implementado | Prometido como Premium, mas não aparece no código de display de lojistas. |
| `hasReports` | ✅ Implementado | Tab protegida corretamente (minPlan: 'pro') e com validação interna na aba de relatório. |
| `hasCampaigns` | ✅ Implementado | Tab protegida corretamente (minPlan: 'premium'). |

---

## B. LISTA DE BUGS CRÍTICOS

1. **Limite de Anúncios (`adLimit`) Burlável:** Usuários dos planos `free` e `basic` conseguem criar anúncios ilimitados ignorando o limite prometido, pois o bloqueio está visível apenas textualmente no Dashboard. O botão "Novo Anúncio" no `AdsTab` permite a ação livremente.
2. **Campos Protegidos Liberados (`hasSocialLinks`):** Links para Instagram e Website estão livres para edição na aba de Configurações para qualquer plano. Isso dilui o valor que deveria ser percebido pelos planos pagos.
3. **Múltiplas Categorias (`categoryLimit`) Indisponíveis:** O modelo prevê 3 categorias para `pro` e infinitas em `premium`, mas o `<select>` de `SettingsTab` é estático (apenas suporta um `value` string e não um array). O texto informativo de categorias fala no limite, mas não existe mecanismo correspondente.
4. **Funcionalidades de Destaque Inexistentes:** Topo nas Buscas (`hasTopSearch`), Banner na Home (`hasBanner`) e Selo de Verificado (`hasVerifiedBadge`) são propostas fortes de vendas em `PlansView`, no entanto não estão implementadas em nenhum lado da UI nem da base de dados.
5. **Suporte Estático ("Em desenvolvimento"):** A tab de Suporte é mostrada como um roadmap fechado (Módulo em desenvolvimento) para todos, ignorando as promessas de "Suporte prioritário WhatsApp" (Premium) ou "Suporte por Email" padrão.

---

## C. PLANO DE IMPLEMENTAÇÃO PRIORIZADO

### Prioridade 1: Correções de Falha (Gratuito recebe o que é pago)

**1. Reforçar o Limite de Anúncios (`adLimit`)**
- **Arquivo Alvo:** `@app/src/features/merchants/MerchantTabs.jsx` e `@app/src/features/merchants/merchant-panel/tabs/AdsTab.jsx`
- **Linha Aproximada:** `MerchantTabs.jsx` (linha 86); `AdsTab.jsx` (linhas 86 a 92)
- **Tipo de Mudança:** (Guard condicional / Guard Visual) 
  Em `MerchantTabs`, extrair e passar `adLimit` do plano atual como prop para `AdsTab`. Dentro de `AdsTab`, inibir (disable visual) ou omitir o clique do botão "Novo Anúncio" caso `myAds.length >= adLimit`. Pode-se exibir uma tooltip ou alerta convidando para o upgrade de plano se clicado.

**2. Desabilitação Condicional dos Links Sociais (`hasSocialLinks`)**
- **Arquivo Alvo:** `@app/src/features/merchants/merchant-panel/tabs/SettingsTab.jsx` e `@app/src/features/merchants/merchant-panel/tabs/MerchantContactFields.jsx`
- **Linha Aproximada:** `SettingsTab.jsx` (linha 131); `MerchantContactFields.jsx` (linhas 27 e 40)
- **Tipo de Mudança:** (Disable Field) 
  Enviar a flag bool `hasSocialLinks` (calculada via `PLANS_CONFIG[planConfig.id].hasSocialLinks`) para o componente `MerchantContactFields`. Aplicar `disabled={!hasSocialLinks}` aos campos `instagram` e `website`. Ajustar design visual (opacity baixa com tooltip) alertando que este é um benefício de planos pagos, sem ocultar os inputs do DOM.

### Prioridade 2: Features Prometidas Não Existentes (Entrega de valor pago)

**3. Refatoração Visual do Select de Múltiplas Categorias (`categoryLimit`)**
- **Arquivo Alvo:** `@app/src/features/merchants/merchant-panel/tabs/SettingsTab.jsx`
- **Linha Aproximada:** 115-121
- **Tipo de Mudança:** (New Component / Data structure) 
  Substituir o elemento nativo HTML `<select>` (que só aceita 1 opção) por entradas do tipo Multi-select ou checkboxes. Monitorar as escolhas e bloquear / desabilitar ativamente mais seleções caso o usuário marque a quantidade do `categoryLimit`. 

**4. Roteamento da Tab de Suporte baseada no Plano**
- **Arquivo Alvo:** `@app/src/features/merchants/MerchantTabs.jsx`
- **Linha Aproximada:** 116-129 (Bloco condicional da aba `support`)
- **Tipo de Mudança:** (Componentização Condicional) 
  Renderizar um CTA apropriado em vez de "Em desenvolvimento". Se plano for `premium` ou `pro`, exibir botão linkando para a URL do WhatsApp (api.wa.me). Para os outros planos (`basic`/`free`), direcionar para um formulário base ou `mailto`.

**5. Preparação Injeção das Flags Visuais / Visibilidade (Futuras Modificações)**
- **Arquivos Alvo:** Arquivos da listagem geral onde comerciantes aparecem (e.g., `MerchantsView`, query API).
- **Tipo de Mudança:** Estruturar a renderização baseando-se no `hasVerifiedBadge` e `hasFeaturedBadge` lidos diretamentes das flags para cada merchant renderizado. Ajustar as regras de retorno de ordenação visando `hasTopSearch`.
