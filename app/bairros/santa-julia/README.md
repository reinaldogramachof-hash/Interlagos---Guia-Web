# Bairro: Santa Júlia

## Status: 🔜 EM BREVE

| Campo | Valor |
|---|---|
| Slug | `santa-julia` |
| URL produção | `https://www.temnobairro.online/santa-julia/` |
| Build script | `npm run build:santa-julia` |
| Env file | `app/.env.santa-julia` |
| Supabase projeto | Compartilhado (Tem No Bairro) |
| Deploy | Hostgator — pasta `public_html/santa-julia/` |

## Checklist de Ativação

Para ativar este bairro, completar os itens abaixo:

- [ ] Levantamento comercial do bairro (PDF na pasta `docs/`)
- [ ] Foto hero do bairro para `landing/assets/santa-julia-hero.jpg`
- [ ] Atualizar card na `landing/index.html` de "Em breve" → "Ativo"
- [ ] Popular tabela `merchants` no Supabase com `neighborhood = 'santa-julia'`
- [ ] Adicionar dado na tabela `neighborhoods` (quando criada)
- [ ] Verificar `.env.santa-julia` com credenciais corretas
- [ ] Rodar `npm run build:santa-julia` e verificar zero erros
- [ ] Upload da build em `public_html/santa-julia/` no Hostgator
- [ ] Testar PWA, OAuth e fluxo completo em produção

## Configuração de Build

```bash
# Build produção
npm run build:santa-julia
# carrega .env.santa-julia → dist/ com base=/santa-julia/
```

## Contexto do Bairro

Santa Júlia é um bairro de São José dos Campos, SP. Segundo bairro previsto para expansão da plataforma Tem No Bairro.

> Preencher com dados do levantamento comercial quando disponível.
