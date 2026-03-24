# Guia de Bairros — Tem No Bairro

> Este documento é o guia operacional para adicionar e gerenciar bairros na plataforma.
> Leitura obrigatória para qualquer agente que trabalhe com expansão de bairros.

---

## Bairros Ativos

| Bairro | Slug | URL | Status |
|---|---|---|---|
| Parque Interlagos | `interlagos` | `/interlagos/` | ✦ Ativo |
| Santa Júlia | `santa-julia` | `/santa-julia/` | 🔜 Em breve |
| Parque Novo Horizonte | `parque-novo-horizonte` | `/parque-novo-horizonte/` | 🔜 Em breve |
| Jardim das Indústrias | `jardim-das-industrias` | `/jardim-das-industrias/` | 🔜 Em breve |

---

## Estratégia de Dados — Row-Level Multitenancy

Todos os bairros compartilham **um único projeto Supabase**. A separação de dados é feita via coluna `neighborhood` em cada tabela com RLS policies.

**Regra:** o app nunca lê dados de outro bairro porque:
1. `VITE_NEIGHBORHOOD` é injetado no build (imutável em produção)
2. `supabaseClient.js` passa o neighborhood em todas as queries
3. RLS policies validam `neighborhood` no banco — garantia no nível de DB

**Escala:** quando atingir ~100k linhas por tabela, adicionar índice composto:
```sql
CREATE INDEX idx_merchants_neighborhood ON merchants(neighborhood, created_at DESC);
```

---

## Como Adicionar um Novo Bairro

### Passo 1 — Preparação de conteúdo

- [ ] Fazer levantamento comercial do bairro
- [ ] Tirar/obter foto hero representativa (mínimo 1200×800px)
- [ ] Salvar foto em `landing/assets/{slug}-hero.jpg`
- [ ] Documentar no PDF em `docs/Levantamento de Comércios em {Nome}.pdf`

### Passo 2 — Supabase

- [ ] Inserir linha na tabela `neighborhoods` (quando criada):
  ```sql
  INSERT INTO neighborhoods (slug, name, city, state, is_active)
  VALUES ('novo-bairro', 'Nome do Bairro', 'São José dos Campos', 'SP', false);
  ```
- [ ] Popular merchants iniciais com `neighborhood = 'novo-bairro'`
- [ ] Garantir que RLS policies cubram o novo slug

### Passo 3 — Configuração do build

- [ ] Criar `app/.env.{slug}` baseado no template:
  ```env
  VITE_NEIGHBORHOOD={slug}
  VITE_SUPABASE_URL=https://jfjavgjeylahhcfcixtv.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_...
  VITE_DISABLE_PWA=false
  ```
- [ ] Adicionar script em `app/package.json`:
  ```json
  "build:{slug}": "vite build --mode {slug}"
  ```
- [ ] Criar `app/bairros/{slug}/README.md` com briefing do bairro

### Passo 4 — Landing page

- [ ] Atualizar card do bairro em `landing/index.html`:
  - Trocar `<div class="bairro-card bairro-card--soon">` por `<a href=".../{slug}/" class="bairro-card bairro-card--active">`
  - Atualizar badge de "Em breve" para "✦ Ativo"
  - Adicionar imagem hero: `background-image: url('assets/{slug}-hero.jpg')`

### Passo 5 — Build e deploy

```bash
cd app
npm run build:{slug}
# Zipar dist/ → {slug}-deploy.zip
# Upload em public_html/{slug}/ no Hostgator
# Verificar .htaccess para SPA routing
```

Consultar `docs/11-deploy-hostgator.md` para detalhes completos.

### Passo 6 — Ativação

- [ ] Atualizar `app/bairros/{slug}/README.md` com status "ATIVO"
- [ ] Atualizar tabela neste documento
- [ ] Atualizar hero stat na `landing/index.html` (ex: "2 bairros ativos")
- [ ] Commit: `feat(bairros): ativa {slug}`

---

## Estrutura de Arquivos por Bairro

```
app/
├── bairros/
│   └── {slug}/
│       └── README.md          # Briefing, checklist, histórico
├── .env.{slug}                # Variáveis de build (não commitar se tiver secrets)
└── package.json               # script: build:{slug}

landing/
└── assets/
    └── {slug}-hero.jpg        # Foto hero para o card na landing

config/
└── hostgator/
    └── deploy/
        └── {slug}-deploy.zip  # Último pacote de deploy (renovar a cada release)

docs/
└── Levantamento de Comércios em {Nome}.pdf
```

---

## Atribuição de Agentes para Expansão de Bairro

Seguindo `AGENTES_ROUTING.md`:

| Tarefa | Agente |
|---|---|
| Decisão de ativar novo bairro | Claude (Arquiteto) |
| Popular merchants no Supabase (seed) | Claude Sonnet Thinking |
| Criar `.env.{slug}` e script package.json | Claude executor |
| Atualizar card na landing (HTML) | Gemini Flash |
| Criar `README.md` do bairro | Gemini Flash |
| Build + validação | Claude executor / Antigravity |
