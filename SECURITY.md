# Security Policy — Tem No Bairro

## Reportar Vulnerabilidades

**NÃO abra issues públicas para vulnerabilidades de segurança.**

Entre em contato por e-mail: reinaldogramachof@gmail.com

Inclua no relato:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial

Responderemos em até 72 horas.

## Versões Suportadas

| Versão | Suporte |
|--------|---------|
| main (produção) | ✅ Suportada |
| branches de feature | ❌ Sem suporte |

## Práticas de Segurança do Projeto

- Credenciais nunca commitadas (`.env.local` no `.gitignore`)
- Supabase Row Level Security (RLS) ativo em todas as tabelas
- Autenticação via Supabase Auth (Google OAuth + Magic Link)
- `SUPABASE_SERVICE_ROLE_KEY` restrito a scripts de seed/admin — nunca exposto no frontend
