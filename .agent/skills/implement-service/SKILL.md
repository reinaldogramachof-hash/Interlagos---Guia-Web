---
name: implement-service
description: Implementa um arquivo de service Supabase seguindo o padrão do projeto. Use quando o Claude solicitar a criação de um novo service ou quando um componente estiver acessando o Supabase diretamente (violação de arquitetura).
argument-hint: [nome-da-tabela] [operações: fetch|create|update|delete|subscribe|all]
---

Implemente o service `app/src/services/$0Service.js` para a tabela `$0`.

## Regras inegociáveis

- Import APENAS: `import { supabase } from '../lib/supabaseClient';`
- Todas as funções são `async` e fazem `throw error` em caso de falha
- Listagens retornam `data ?? []` (nunca `null`)
- Prefixos: `fetch` (leitura), `create`, `update`, `delete`, `subscribe` (realtime), `admin` (acesso total)

## Template de implementação

```js
import { supabase } from '../lib/supabaseClient';

// ── Leitura pública ────────────────────────────────────────────────────────────
export async function fetch[Entidade]() {
  const { data, error } = await supabase
    .from('[tabela]')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Realtime subscription ──────────────────────────────────────────────────────
export function subscribe[Entidade](callback) {
  callback(); // carrega dados iniciais imediatamente
  const channel = supabase
    .channel('[tabela]-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: '[tabela]' }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel); // cleanup obrigatório
}

// ── Escrita (usuário autenticado) ──────────────────────────────────────────────
export async function create[Entidade](payload) {
  const { data, error } = await supabase
    .from('[tabela]')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function update[Entidade](id, changes) {
  const { data, error } = await supabase
    .from('[tabela]')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function delete[Entidade](id) {
  const { error } = await supabase
    .from('[tabela]')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// ── Admin (acesso sem filtro de RLS) ──────────────────────────────────────────
export async function adminFetch[Entidade]() {
  const { data, error } = await supabase
    .from('[tabela]')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
```

## Após criar o arquivo

1. Verificar se algum componente em `features/` importa `supabaseClient` diretamente para esta tabela
2. Se sim, substituir pelo service recém-criado
3. Rodar build: `cd app && npm run build`
4. Reportar resultado ao Claude
