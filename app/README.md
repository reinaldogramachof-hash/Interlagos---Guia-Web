# 📱 Interlagos Conectado — Tem No Bairro

O **Tem No Bairro** é uma plataforma digital comunitária PWA desenvolvida para conectar moradores, comerciantes e serviços da região de **Parque Interlagos, São José dos Campos/SP**.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/Stack-React_19_|_Supabase_|_Vite_7-blue)
![PWA](https://img.shields.io/badge/PWA-Habilitado-green)

---

## 🚀 Funcionalidades

- **📰 Jornal do Bairro** — Feed de notícias locais com categorias e moderação
- **🏪 Guia Comercial** — Catálogo com planos Free, Pro e Premium
- **📌 Classificados** — Anúncios de produtos e serviços por moradores
- **🤝 Ações Sociais** — Campanhas de doação e voluntariado
- **👤 Perfil e Planos** — Assinatura por plano com controle de acesso `PlanGate`
- **🛡️ Painel Administrativo** — Gestão de usuários, comércios, notícias e tickets

---

## 🛠️ Arquitetura Técnica

### Frontend
- **React 19 + Vite 7** — Interface rápida e reativa
- **Tailwind CSS 3** — Estilização mobile-first
- **Zustand 5** — Estado global leve
- **Lucide React** — Ícones consistentes
- **vite-plugin-pwa** — Service Worker + instalação nativa

### Backend (Supabase)
- **PostgreSQL** — Banco de dados relacional via Supabase
- **Supabase Auth** — Autenticação (email/senha, OAuth)
- **Realtime** — Atualizações ao vivo no feed
- **Row Level Security (RLS)** — Segurança granular por tabela

### Busca
- **Algolia** (react-instantsearch) — Busca fuzzy de comércios

---

## 📦 Estrutura do Projeto

```bash
interlagos-conectado/
├── src/
│   ├── app/                  # Shell do app (AppHeader)
│   ├── components/           # UI reutilizável (ChatbotWidget, PlanGate)
│   ├── constants/            # Definições de planos (plans.js)
│   ├── context/              # Context API (AuthContext)
│   ├── features/
│   │   ├── admin/            # Tabs do painel administrativo
│   │   └── merchants/        # Views e carousels de comércios
│   ├── hooks/                # Custom hooks (useMerchantPlan)
│   ├── lib/                  # Clientes de serviços (supabaseClient.js)
│   ├── panels/               # Painéis por perfil (MerchantPanel, ResidentPanel)
│   ├── services/             # Integração com Supabase/APIs
│   ├── stores/               # Estado global Zustand (authStore)
│   ├── App.jsx               # Componente raiz e roteamento
│   └── main.jsx              # Entry point
├── scripts/                  # Scripts de seed (seedSupabase.mjs)
├── public/                   # Assets estáticos
├── .env.example              # Template de variáveis de ambiente
├── vite.config.js
└── package.json
```

---

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js v18+
- Conta no [Supabase](https://supabase.com)
- (Opcional) Conta no [Algolia](https://algolia.com) para busca

### Passo a Passo

**1. Clone e instale:**
```bash
git clone https://github.com/reinaldogramachof-hash/Interlagos---Guia-Web.git
cd "Interlagos---Guia-Web/interlagos-conectado"
npm install
```

**2. Configure as variáveis de ambiente:**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# Supabase — Obrigatórias (Painel Supabase → Settings → API)
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# Algolia — Opcional (para busca)
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=
```

**3. Execute o servidor de desenvolvimento:**
```bash
npm run dev
# Acesse: http://localhost:5173
```

**4. (Opcional) Popular banco com dados de teste:**
```bash
npm run seed
```

---

## 🛡️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite HMR) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verificação de lint (ESLint) |
| `npm run seed` | Popular Supabase com dados de exemplo |

---

## 🔐 Acesso ao Painel Administrativo

Para acessar o Painel Admin em desenvolvimento:
1. Faça login com uma conta com role `admin` ou `master`
2. Acesse via ícone de Dashboard no cabeçalho
3. Use a aba **"Banco de Dados"** para rodar o Seeder em desenvolvimento

---

Desenvolvido com ❤️ para a comunidade de Parque Interlagos, SJC.
