# 🏙️ Guia Digital Interlagos

Repositório principal do ecossistema digital do bairro **Parque Interlagos — São José dos Campos/SP**.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/Stack-React_|_Supabase_|_Vite-blue)
![License](https://img.shields.io/badge/Licença-Privada-red)

---

## 📦 Projetos no Repositório

| Projeto | Descrição | Localização |
|---|---|---|
| **interlagos-conectado** | App web PWA — Jornal do Bairro, Guia Comercial, Classificados, Ações Sociais | `./interlagos-conectado/` |

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Ambiente de desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/reinaldogramachof-hash/Interlagos---Guia-Web.git
cd "Interlagos---Guia-Web/interlagos-conectado"

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

---

## 🗂️ Estrutura Geral

```
Guia Digital Interlagos/
├── interlagos-conectado/     # App principal (React + Vite + Supabase)
│   ├── src/
│   │   ├── features/         # Módulos por domínio (merchants, admin)
│   │   ├── stores/           # Estado global (Zustand)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Integração com Supabase/APIs
│   │   ├── components/       # UI reutilizável
│   │   └── App.jsx           # Componente raiz
│   ├── scripts/              # Scripts de seed de dados
│   ├── .env.example          # Template de variáveis de ambiente
│   └── package.json
└── README.md                 # Este arquivo
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 7
- **Estilização:** Tailwind CSS 3
- **Backend/BaaS:** Supabase (Auth, Postgres, Realtime)
- **Busca:** Algolia (react-instantsearch)
- **Estado Global:** Zustand 5
- **Ícones:** Lucide React
- **PWA:** vite-plugin-pwa

---

Desenvolvido com ❤️ para a comunidade de Parque Interlagos, SJC.
