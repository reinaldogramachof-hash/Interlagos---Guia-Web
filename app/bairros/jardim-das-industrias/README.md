# Bairro: Jardim das Indústrias

## Status: 🔜 EM BREVE

| Campo | Valor |
|---|---|
| Slug | `jardim-das-industrias` |
| URL produção | `https://www.temnobairro.online/jardim-das-industrias/` |
| Build script | `npm run build:jardim-das-industrias` |
| Env file | `app/.env.jardim-das-industrias` |
| Supabase projeto | Compartilhado (Tem No Bairro) |
| Deploy | Hostgator — pasta `public_html/jardim-das-industrias/` |

## Checklist de Ativação

Para ativar este bairro, completar os itens abaixo:

- [ ] Levantamento comercial do bairro (PDF na pasta `docs/`)
- [ ] Foto hero do bairro para `landing/assets/jardim-das-industrias-hero.jpg`
- [ ] Atualizar card na `landing/index.html` de "Em breve" → "Ativo"
- [ ] Popular tabela `merchants` no Supabase com `neighborhood = 'jardim-das-industrias'`
- [ ] Adicionar dado na tabela `neighborhoods` (quando criada)
- [ ] Verificar `.env.jardim-das-industrias` com credenciais corretas
- [ ] Rodar `npm run build:jardim-das-industrias` e verificar zero erros
- [ ] Upload da build em `public_html/jardim-das-industrias/` no Hostgator
- [ ] Testar PWA, OAuth e fluxo completo em produção

## Configuração de Build

```bash
# Build produção
npm run build:jardim-das-industrias
# carrega .env.jardim-das-industrias → dist/ com base=/jardim-das-industrias/
```

## Contexto do Bairro

Jardim das Indústrias é um bairro de São José dos Campos, SP. Quarto bairro previsto para expansão da plataforma Tem No Bairro.

> Preencher com dados do levantamento comercial quando disponível.
