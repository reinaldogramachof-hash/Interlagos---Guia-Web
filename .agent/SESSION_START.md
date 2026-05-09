# SESSION START — Tem No Bairro

> Este documento é o ponto de entrada obrigatório de toda sessão de trabalho.
> Codex e Claude Code devem ler este arquivo antes de qualquer ação.
> Última atualização: 2026-05-09

---

## 1. Identidade do Produto

**Nome:** Tem No Bairro
**Domínio:** `temnobairro.online`
**Posicionamento:** Community Hub — Rede Social Hiperlocal + Classificados C2C + SaaS B2B Local.
**Modelo de crescimento:** O2O (Offline-to-Online), viral via compartilhamento no WhatsApp.
**Território:** São José dos Campos, SP — multi-bairro (1 ativo: Parque Interlagos).
**App em produção:** `temnobairro.online/interlagos/`

---

## 2. Stack — Leia Antes de Propor Qualquer Coisa

| Camada | Tecnologia | Regra |
|---|---|---|
| Frontend | React 19 + Vite 7 | NÃO migrar para Next.js |
| Estilo | Tailwind CSS 3 | NÃO usar CSS-in-JS nem arquivos .css avulsos |
| Estado Global | Zustand 5 | NÃO usar Redux ou Context para estado global |
| Backend / DB | Supabase | ÚNICO backend. Firebase REMOVIDO. |
| Auth | Supabase Auth | Google OAuth + Magic Link |
| PWA | vite-plugin-pwa + Workbox | Cache-first para feed offline |
| Ícones | lucide-react | Não instalar outras libs de ícone |

**Proibição absoluta:** `supabaseClient` nunca importado em componentes JSX — apenas em `services/`.

---

## 3. Arquitetura de Pastas (Mapa Rápido)

```
app/src/
├── features/
│   ├── merchants/          ← MerchantsView, MerchantCard, MerchantDetailModal
│   │   └── merchant-panel/ ← DashboardTab, AdsTab, SettingsTab
│   ├── ads/                ← AdsView, AdCard, AdDetailModal, CreateAdWizard
│   ├── news/               ← NewsFeed, NewsCard, NewsDetailModal, CreateNewsModal
│   ├── auth/               ← LoginModal, AuthContext, ProfileView, OnboardingModal
│   ├── community/          ← SuggestionsView, DonationsView, ResidentPanel
│   └── admin/              ← AdminPanel + 8 tabs
├── services/               ← ÚNICO acesso ao Supabase (merchantService, adsService, etc.)
├── stores/                 ← authStore, uiStore, merchantStore (Zustand)
├── lib/
│   └── supabaseClient.js   ← Singleton — não duplicar
├── components/             ← Modal, Sidebar, NotificationBell, ChatbotWidget
├── hooks/                  ← useRequireAuth
└── constants/              ← categories.jsx
```

---

## 4. Regras de Código — Inegociáveis

1. **Máximo 200 linhas por JSX.** Acima disso, extrair sub-componente.
2. **Sem lógica de negócio em componentes.** Vai em `services/` ou `stores/`.
3. **Sem Supabase direto em componente.** Sempre via `services/`.
4. **Mobile-First rigoroso.** Projetar para 375px primeiro.
5. **Lazy Login.** Nunca bloquear visualização de conteúdo — login só ao interagir.
6. **SEM placeholders no código.** Nunca deixar `// ...resto do código` ou `// TODO: implementar`.
7. **NUNCA hardcodar credenciais.** Sempre `import.meta.env.VITE_*`.
8. **Filtro `neighborhood` obrigatório** em toda query Supabase.

---

## 5. Multi-Bairro — Regra de Isolamento

- `VITE_NEIGHBORHOOD` é imutável no build — define qual bairro está ativo.
- Toda query ao Supabase **deve** filtrar por `neighborhood`.
- RLS policies garantem isolamento no banco como camada final.
- Nunca leia dados de outro bairro no frontend.

| Bairro | Slug | Status |
|---|---|---|
| Parque Interlagos | `interlagos` | ✦ Ativo |
| Santa Júlia | `santa-julia` | Em breve |
| Parque Novo Horizonte | `parque-novo-horizonte` | Em breve |
| Jardim das Indústrias | `jardim-das-industrias` | Em breve |

---

## 6. Time de Agentes — Quem Faz o Quê

| Agente | Papel | Quando usar |
|---|---|---|
| **Codex** | Arquiteto e Orquestrador | Auditoria, fases, priorização, prompts técnicos, governança |
| **Claude Code** | Executor Técnico | Implementação de código, refactors, migrations, validação local |
| **Reinaldo** | QA Funcional | Testes reais no localhost, aceite e feedback de fluxo |

**Regra de escalação:** Claude Code reporta bloqueio → Codex reprojeta a tarefa → Reinaldo revalida

---

## 7. Skills Disponíveis

| Skill | Acionar quando... |
|---|---|
| `pwa-optimization` | "configurar offline", "auditar PWA", "corrigir Service Worker" |
| `business-crud-generator` | "criar módulo de [entidade]", "CRUD de [entidade]", "nova tabela" |
| `automated-smoke-test` | "testar o app", "validar que não quebrou", após refatoração multi-arquivo |
| `build-verify` | Verificar se o build passa sem erros |
| `execute-plan` | Executar um plano previamente aprovado pelo Claude |
| `implement-component` | Implementar novo componente JSX seguindo os padrões |
| `implement-service` | Criar novo service Supabase para uma entidade |

---

## 8. Status Atual do Projeto (Atualizar a cada sessão)

### Concluído
- Supabase instalado, RLS, OAuth, trigger, RPCs
- Migração Firebase → Supabase completa
- Zustand 3 stores (auth, ui, merchant)
- Todos os services Supabase
- Arquitetura feature-based
- AdminPanel com 8 tabs
- vite-plugin-pwa + Workbox configurado
- Landing page raiz multi-bairro
- Sprint LGPD — consentimento, onboarding, OnboardingModal
- Deploy em produção: `temnobairro.online/interlagos/`
- Estrutura multi-bairro (bairros/, .env.{slug}, build scripts)

### Próximos (backlog ativo)
- [ ] Fase 1 — Segurança do painel administrativo
- [ ] Fase 2 — Governança e rastreabilidade operacional
- [ ] Fase 3 — Experiência operacional e confiabilidade de uso
- [ ] Transformar o plano em tarefas delegáveis para Claude Code
- [ ] Validar cada etapa no `localhost` antes de avançar

### Futuro
- [ ] Ativar bairro Santa Júlia
- [ ] Criar tabela `neighborhoods` no Supabase
- [ ] Integrar Algolia para busca
- [ ] Sprint 2 LGPD — verificação de telefone por OTP

---

## 9. Checklist de Início de Sessão

Antes de começar qualquer tarefa, execute mentalmente este checklist:

- [ ] **Li o relatório mais recente** em `.agent/reports/` para entender o estado da última sessão.
- [ ] **Identifiquei a fase atual** do plano em `docs/12-plano-admin-3-fases.md`.
- [ ] **Sei se estou atuando como Codex ou Claude Code** nesta rodada.
- [ ] **Conheço os arquivos que serão tocados** — não vou alterar nada sem ler antes.
- [ ] **Tenho o prompt operacional completo** — Objetivo + Contexto + Diretiva + Restrições + Validação.

---

## 10. Checklist de Fim de Sessão

Antes de encerrar qualquer sessão, execute:

- [ ] **Validação técnica local executada** conforme o escopo da tarefa.
- [ ] **QA funcional realizado** no `localhost` quando a entrega afetar comportamento.
- [ ] **Bloqueios ou pendências registrados** para o próximo prompt, se existirem.
- [ ] **A fase atual foi atualizada** se a tarefa concluiu um marco relevante.

---

## 11. Referências Rápidas

| O que preciso | Onde encontrar |
|---|---|
| Regras de arquitetura completas | `CLAUDE.md` |
| Padrões de código | `.agent/rules/coding-standards.md` |
| Stack obrigatória detalhada | `.agent/rules/project-stack.md` |
| Papéis e substituto | `.agent/rules/roles.md` |
| Roteamento de agentes | `.agent/rules/AGENTES_ROUTING.md` |
| Regra de relatório | `.agent/rules/session-report.md` |
| Histórico de sessões | `.agent/reports/` |
| Modelo de dados Supabase | `CLAUDE.md` seção "Supabase — Modelo de Dados" |
| Briefing do bairro ativo | `app/bairros/interlagos/README.md` |
| Migrations pendentes | `docs/migrations/` |
