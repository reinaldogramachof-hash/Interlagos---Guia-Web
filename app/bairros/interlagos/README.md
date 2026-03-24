# Bairro: Parque Interlagos

## Status: ✦ ATIVO

| Campo | Valor |
|---|---|
| Slug | `interlagos` |
| URL produção | `https://www.temnobairro.online/interlagos/` |
| Build script | `npm run build:interlagos` |
| Env file | `app/.env.interlagos` |
| Supabase projeto | Compartilhado (Tem No Bairro) |
| Deploy | Hostgator — pasta `public_html/interlagos/` |

## Contexto do Bairro

Parque Interlagos é um bairro de São José dos Campos, SP. Primeiro bairro ativo da plataforma Tem No Bairro.

- **Comerciantes cadastrados:** +150 (levantamento Mar/2026)
- **Documento de referência:** `docs/Levantamento de Comércios em Parque Interlagos.pdf`
- **Tabelas Supabase:** filtradas por `neighborhood = 'interlagos'`

## Configuração de Build

```bash
# Desenvolvimento local
cd app
npm run dev
# acessa .env.local (VITE_NEIGHBORHOOD=interlagos)

# Build produção
npm run build:interlagos
# carrega .env.interlagos → dist/ com base=/interlagos/
```

## Deploy no Hostgator

1. Rodar `npm run build:interlagos`
2. Zipar conteúdo da pasta `dist/` → `interlagos-deploy.zip`
3. Upload via FileManager em `public_html/interlagos/`
4. Verificar `.htaccess` para SPA routing

Guia completo: `docs/11-deploy-hostgator.md`

## Histórico

- **Mar/2026** — App em produção, Sprint LGPD concluída
- **Mar/2026** — Migração Firebase → Supabase completa
- **Fev/2026** — Primeira versão pública
