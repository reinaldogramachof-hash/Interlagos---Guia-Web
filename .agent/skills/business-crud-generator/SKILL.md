---
name: business-crud-generator
description: Gera fluxos completos de CRUD (Create, Read, Update, Delete) para o projeto Tem No Bairro, do banco de dados Supabase até o service layer do frontend. Acione quando for solicitado "criar o módulo de [entidade]", "fazer o CRUD de [entidade]", "adicionar tabela de [entidade]" ou "criar service para [entidade]".
---

# Protocolo de Construção de Módulo — Tem No Bairro

**Projeto:** Tem No Bairro — Supabase (PostgreSQL + RLS) + React 19 + Zustand 5
**Padrão:** Toda entidade nova deve ter: tabela Supabase → migration SQL → service JS → (opcional) store Zustand.

---

## Passos de Execução

### 1. Levantamento e Definição da Entidade

- Pergunte ao usuário (ou extraia do contexto) os campos necessários para a entidade nova.
- Identifique o domínio: merchants, ads, news, community, admin ou novo?
- **Regra obrigatória de multitenancy:** toda tabela nova DEVE ter a coluna `neighborhood TEXT NOT NULL` para isolamento por bairro — sem exceção.
- Leia `@CLAUDE.md` seção "Supabase — Modelo de Dados" para verificar se a entidade já existe ou pode ser extensão de uma tabela existente.

### 2. Geração da Migration SQL (Data Layer)

Gere o arquivo SQL em `@docs/migrations/` com nome descritivo (ex: `add-tabela-reviews.sql`).

Estrutura obrigatória do SQL:

```sql
-- Migration: [nome descritivo]
-- Data: [YYYY-MM-DD]
-- Descrição: [o que esta migration faz]

-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS [entidade] (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  [campos definidos pelo usuário],
  neighborhood TEXT NOT NULL,           -- isolamento multi-bairro
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices de performance
CREATE INDEX IF NOT EXISTS idx_[entidade]_neighborhood ON [entidade](neighborhood);
CREATE INDEX IF NOT EXISTS idx_[entidade]_created_at ON [entidade](created_at DESC);

-- 3. RLS (Row Level Security) — OBRIGATÓRIO
ALTER TABLE [entidade] ENABLE ROW LEVEL SECURITY;

-- Leitura: qualquer usuário autenticado do bairro correto
CREATE POLICY "read_own_neighborhood" ON [entidade]
  FOR SELECT USING (neighborhood = current_setting('app.neighborhood', true));

-- Escrita: apenas o dono do registro
CREATE POLICY "write_own_record" ON [entidade]
  FOR INSERT WITH CHECK (auth.uid() = [campo_owner_id]);

CREATE POLICY "update_own_record" ON [entidade]
  FOR UPDATE USING (auth.uid() = [campo_owner_id]);

CREATE POLICY "delete_own_record" ON [entidade]
  FOR DELETE USING (auth.uid() = [campo_owner_id]);
```

**NUNCA** usar concatenação de strings para construir queries.
**NUNCA** executar a migration automaticamente — apresentar o SQL ao usuário para revisão.

### 3. Criação do Service Layer (Frontend)

Crie `@app/src/services/[entidade]Service.js` seguindo o padrão dos services existentes.

Estrutura obrigatória:

```js
import { supabase } from '../lib/supabaseClient';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

// Buscar todos (com paginação obrigatória)
export async function fetch[Entidade]s({ page = 0, limit = 20 } = {}) {
  const from = page * limit;
  const { data, error } = await supabase
    .from('[entidade]')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return data ?? [];
}

// Buscar por ID
export async function fetch[Entidade]ById(id) {
  const { data, error } = await supabase
    .from('[entidade]')
    .select('*')
    .eq('id', id)
    .eq('neighborhood', NEIGHBORHOOD)
    .single();
  if (error) throw error;
  return data;
}

// Criar
export async function create[Entidade](payload) {
  const { data, error } = await supabase
    .from('[entidade]')
    .insert({ ...payload, neighborhood: NEIGHBORHOOD })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Atualizar
export async function update[Entidade](id, payload) {
  const { data, error } = await supabase
    .from('[entidade]')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('neighborhood', NEIGHBORHOOD)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Deletar
export async function delete[Entidade](id) {
  const { error } = await supabase
    .from('[entidade]')
    .delete()
    .eq('id', id)
    .eq('neighborhood', NEIGHBORHOOD);
  if (error) throw error;
}
```

**Regras de segurança:**
- Filtro `neighborhood: NEIGHBORHOOD` em TODAS as queries — sem exceção.
- Paginação padrão de 20 itens (máximo 50) em toda listagem.
- `supabaseClient` nunca importado diretamente em componentes — apenas neste service.

### 4. Revisão pelo Arquiteto (PORTÃO OBRIGATÓRIO)

**PARE aqui.** Apresente ao usuário/Claude:
1. O SQL da migration gerado (para revisão antes de executar no Supabase).
2. A estrutura do service criado.
3. Lista de arquivos criados ou que serão criados.
4. Perguntas pendentes (campos opcionais? relações com outras tabelas? store Zustand necessário?).

**Aguarde confirmação explícita antes de prosseguir.**

### 5. Aplicação (somente após aprovação)

- Informe o usuário para executar a migration no Supabase Dashboard → SQL Editor.
- Confirme que os arquivos do service foram criados corretamente.
- Se solicitado, crie o store Zustand correspondente em `@app/src/stores/`.

### 6. Walkthrough Final

Gere artefato listando:
- Migration SQL gerada (caminho do arquivo).
- Service criado (caminho + funções exportadas).
- Store criado (se aplicável).
- Passo a passo para o usuário executar a migration no Supabase.
- Pendências de UI (componentes que precisarão consumir este service).

---

## Restrições

- **NUNCA** importar `supabaseClient` diretamente em componentes JSX.
- **NUNCA** omitir o filtro `neighborhood` em qualquer query.
- **NUNCA** executar migration automaticamente — sempre requer aprovação manual.
- **NUNCA** usar paginação acima de 50 itens sem justificativa explícita.
- **NUNCA** criar tabela sem RLS habilitado.
- Se a entidade tiver relação com `profiles` (owner), incluir FK e política de escrita restrita ao `auth.uid()`.
