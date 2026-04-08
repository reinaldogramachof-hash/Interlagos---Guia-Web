# 🛡️ Relatório de Auditoria: AdminPanel

**Projeto:** Tem No Bairro (temnobairro.online/interlagos)
**Data:** 08/04/2026
**Executor:** Gemini Pro High
**Validador Final:** Claude (Arquiteto)

Após a configuração de um usuário master e a execução das rodadas de testes pelo AdminPanel (com servidor Vite local integrado ao Supabase), os resultados foram compilados.

---

## 📊 Status por Tab

| Tab | Status | Observações |
|:---|:---:|:---|
| **1. Aprovações** | ✅ OK | Lista carrega e permite análise pendente. Ações de Aprovação, Escalação e Rejeição validadas no console sem erro. |
| **2. Comércios** | ❌ Quebrado | Erros 400 da API no momento de criação (ausência de "neighborhood") e de edição. |
| **3. Notícias** | ✅ OK | Lista carrega corretamente. |
| **4. Campanhas** | ✅ OK | Lista carrega corretamente. |
| **5. Tickets** | ⚠ Parcial | Processos do fluxo funcionam, mas na UI a renderização visual do autor do ticket estourou um fallback incorreto ("Enviado por: ID" ou "Sistema"), devido a um mismatch semântico. |
| **6. Usuários** | ✅ OK | Interface exibe badges perfeitamente e promoção de master/admin tem commit ok. |
| **7. Auditoria e Logs**| ✅ OK | O proxy via `click_events` (já que a tabela `audit_logs` inexiste) carrega o inner join de autores com sucesso. |
| **8. Banco de Dados**| ❌ Quebrado | O botão *Seeder* deflagra uma exceção de modelo de dados ao tentar dar insert numa coluna chamada `image` da tabela de `merchants` não reconhecida. |

---

## 🔍 Validação de Suspeitos Requisitados (S1, S2, S3)

### S1 — `MerchantsTab`: `createMerchant` negligenciando payload.
**Status: CONFIRMADO 🔴**
Ao simular uma criação `Novo > [Preenchimento] > Salvar`, a request despacha os dados ao Supabase desabilitados da meta de segurança RLS (e coluna obrigatória) `neighborhood`. Como predito pela arquitetura, `INITIAL_FORM` não a detinha e `handleSave` no `MerchantsTab.jsx` pula essa injeção, causando Erro 400 Bad Request que silencia na tela com status "Salvando...".

### S2 — `TicketsTab`: Mismatch de alias para referenciar profiles.
**Status: CONFIRMADO 🔴**
O componente de Ticket printava "Enviado por: [ID]". Confirmamos pelo código que a query do serviço (`adminService.js`) nomeia o join como: `author:profiles!author_id(display_name)`. Porém, a UI tentava renderizar através de `ticket.profiles?.display_name`. O acesso deve ser reescrito como `ticket.author?.display_name` para capturar a informação válida do provedor.

### S3 — `adminGetMerchants` silencia falhas (merchantService)
**Status: CONFIRMADO ✅ / Não causou ecrã vazio no teste real.**
O código `if (error) { console.error('...', error); return []; }` devora o erro no console e devolve uma array em branco ao componente, confirmando a prática de silenciamento. No entanto, o `adminGetMerchants` rodou de modo assertivo contra a base e **exibiu a lista de comerciantes normal e devidamente.** Ou seja, o método suprime o *throw*, e pode mascarar crashes futuros, mas no fluxo ordinário a network permitiu carregar o conteúdo.

---

## 🐜 Erros do Console Não Mapeados Originalmente

1. **Bug Oculto em MerchantsTab (Update / Schema Invalido):** Ao atualizar (mesmo alterando minúcias) comerciantes previamente cadastrados, a request volta a dar um Crash 400 por campos defasados de formulário (`social_links`, `gallery`) que o Retry Fallback não tratou corretamente.
2. **Bug de Seeding (DatabaseTab):** Falha disparada com o erro: `Could not find the 'image' column of 'merchants' in the schema cache`. O seeder atual (em *adminService.js*) está injetando dados com a coluna `image` que não existe mais.
3. **Timeouts da AuthStore:** O console reporta de modo intermitente um recuo do `_fetchProfile` com `query_timeout`, resolvido na revalidação por tempo decorrido, mas sujando logs.
4. **Erros 404 Estáticos:** Falha no carregamento de `logoIC.png` e SVG's (como um ícone antigo do *google-logo*).
