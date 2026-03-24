# Bairro: Parque Novo Horizonte

## Status: 🔜 EM BREVE

| Campo | Valor |
|---|---|
| Slug | `parque-novo-horizonte` |
| URL produção | `https://www.temnobairro.online/parque-novo-horizonte/` |
| Build script | `npm run build:parque-novo-horizonte` |
| Env file | `app/.env.parque-novo-horizonte` |
| Supabase projeto | Compartilhado (Tem No Bairro) |
| Deploy | Hostgator — pasta `public_html/parque-novo-horizonte/` |

## Checklist de Ativação

Para ativar este bairro, completar os itens abaixo:

- [ ] Levantamento comercial do bairro (PDF na pasta `docs/`)
- [ ] Foto hero do bairro para `landing/assets/parque-novo-horizonte-hero.jpg`
- [ ] Atualizar card na `landing/index.html` de "Em breve" → "Ativo"
- [ ] Popular tabela `merchants` no Supabase com `neighborhood = 'parque-novo-horizonte'`
- [ ] Adicionar dado na tabela `neighborhoods` (quando criada)
- [ ] Verificar `.env.parque-novo-horizonte` com credenciais corretas
- [ ] Rodar `npm run build:parque-novo-horizonte` e verificar zero erros
- [ ] Upload da build em `public_html/parque-novo-horizonte/` no Hostgator
- [ ] Testar PWA, OAuth e fluxo completo em produção

## Configuração de Build

```bash
# Build produção
npm run build:parque-novo-horizonte
# carrega .env.parque-novo-horizonte → dist/ com base=/parque-novo-horizonte/
```

## Contexto do Bairro

Parque Novo Horizonte é um bairro de São José dos Campos, SP. Terceiro bairro previsto para expansão da plataforma Tem No Bairro.

> Preencher com dados do levantamento comercial quando disponível.
