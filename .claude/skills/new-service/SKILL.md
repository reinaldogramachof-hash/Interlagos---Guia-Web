---
name: new-service
description: Cria um novo arquivo de service para uma tabela Supabase. Use quando o usuário pedir para criar um service, adicionar acesso a uma nova tabela, ou quando um componente estiver importando supabaseClient diretamente.
argument-hint: [nome-da-tabela]
---

Crie o arquivo `app/src/services/$0Service.js` seguindo o padrão do projeto.

## Regras obrigatórias
- Importar `supabase` APENAS de `../lib/supabaseClient`
- Nunca exportar o cliente diretamente
- Todas as funções são `async` e fazem `throw error` em caso de falha
- Retornar `data ?? []` (nunca `null`) em listagens
- Nomear funções com prefixo de ação: `fetch`, `create`, `update`, `delete`, `subscribe`
- Funções admin com prefixo `admin` (ex: `adminFetchAll`)

## Template base

```js
import { supabase } from '../lib/supabaseClient';

// ── Leitura pública ────────────────────────────────────────────────────────────
export async function fetch$TABLE() {
  const { data, error } = await supabase
    .from('$TABLE')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Realtime ───────────────────────────────────────────────────────────────────
export function subscribe$TABLE(callback) {
  callback();
  const channel = supabase.channel('$TABLE-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: '$TABLE' }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ── Escrita (usuário autenticado) ──────────────────────────────────────────────
export async function create$TABLE(payload) {
  const { data, error } = await supabase
    .from('$TABLE')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function update$TABLE(id, changes) {
  const { data, error } = await supabase
    .from('$TABLE')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function delete$TABLE(id) {
  const { error } = await supabase
    .from('$TABLE')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// ── Admin ──────────────────────────────────────────────────────────────────────
export async function adminFetch$TABLE() {
  const { data, error } = await supabase
    .from('$TABLE')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
```

Substitua `$TABLE` pelo nome da tabela em snake_case e `$TABLE` (nas funções) pelo nome em PascalCase.

Após criar o arquivo, verifique se algum componente em `features/` importa `supabaseClient` diretamente para a mesma tabela e substitua pelo novo service.
