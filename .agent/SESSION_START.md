# SESSION START — Tem No Bairro

> Este documento é o ponto de entrada obrigatório de toda sessão de trabalho.
> Todo agente (Claude, Deep Think, Fast Mode) deve ler este arquivo antes de qualquer ação.
> Última atualização: 2026-04-11

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
| **Claude Sonnet 4.6** | Arquiteto Principal | Decisões de arquitetura, briefing, validação final |
| **Deep Think** | Executor Estratégico | Qualquer tarefa que toque >1 arquivo ou exija raciocínio |
| **Fast Mode** | Executor Tático | Ajustes cirúrgicos em arquivo único, boilerplate |
| **Subagente de Navegador** | Auditor Visual | Validação de UI, smoke test visual, screenshots |
| **Deep Think (substituto)** | Arquiteto Substituto | Somente quando Claude está indisponível |

**Regra de escalação:** Fast Mode → Deep Think → Claude (last resort)

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
- [ ] Executar `docs/migrations/sprint1-lgpd.sql` no Supabase
- [ ] Re-upload interlagos com OAuth fix + Sprint LGPD
- [ ] Testar onboarding completo em produção
- [ ] Conectar métricas reais ao DashboardTab (statsService)
- [ ] Verificar link WhatsApp no AdDetailModal
- [ ] Adicionar coluna `neighborhood` nas tabelas Supabase + atualizar RLS

### Futuro
- [ ] Ativar bairro Santa Júlia
- [ ] Criar tabela `neighborhoods` no Supabase
- [ ] Integrar Algolia para busca
- [ ] Sprint 2 LGPD — verificação de telefone por OTP

---

## 9. Checklist de Início de Sessão

Antes de começar qualquer tarefa, execute mentalmente este checklist:

- [ ] **Li o relatório mais recente** em `.agent/reports/` para entender o estado da última sessão.
- [ ] **Identifiquei o objetivo da sessão** com clareza.
- [ ] **Sei qual agente** vai executar (Fast Mode, Deep Think ou Claude direto).
- [ ] **Conheço os arquivos que serão tocados** — não vou alterar código sem ter lido o arquivo primeiro.
- [ ] **Tenho o briefing completo** — Contexto + Diretiva + Restrições + Verificação.

---

## 10. Checklist de Fim de Sessão

Antes de encerrar qualquer sessão, execute:

- [ ] **Build passou** — `npm run build:interlagos` com zero erros.
- [ ] **Smoke test realizado** (se houve mudança de comportamento).
- [ ] **Relatório de sessão gerado** em `.agent/reports/YYYY-MM-DD_HH-MM_descricao.md`.
- [ ] **Índice de relatórios atualizado** em `.agent/reports/README.md`.
- [ ] **Pendências documentadas** no relatório para a próxima sessão.

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
