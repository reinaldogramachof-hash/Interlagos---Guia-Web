# 🏙️ Tem No Bairro — Hub Digital Comunitário

Repositório principal do ecossistema digital dos bairros de **São José dos Campos, SP**.

![Status](https://img.shields.io/badge/Status-Em_Produção-green)
![Stack](https://img.shields.io/badge/Stack-React_|_Supabase_|_Vite-blue)
![Bairros](https://img.shields.io/badge/Bairros-1_ativo_|_3_em_breve-orange)
![License](https://img.shields.io/badge/Licença-Privada-red)

---

## 🗺️ Bairros da Plataforma

| Bairro | Slug | URL | Status | Build |
|---|---|---|---|---|
| Parque Interlagos | `interlagos` | [/interlagos/](https://www.temnobairro.online/interlagos/) | ✦ Ativo | `npm run build:interlagos` |
| Santa Júlia | `santa-julia` | `/santa-julia/` | 🔜 Em breve | `npm run build:santa-julia` |
| Parque Novo Horizonte | `parque-novo-horizonte` | `/parque-novo-horizonte/` | 🔜 Em breve | `npm run build:parque-novo-horizonte` |
| Jardim das Indústrias | `jardim-das-industrias` | `/jardim-das-industrias/` | 🔜 Em breve | `npm run build:jardim-das-industrias` |

> Para ativar um novo bairro, seguir o checklist em `docs/BAIRROS.md`.

---

## 📦 Estrutura do Repositório

| Pasta | Descrição |
|---|---|
| `landing/` | Landing page raiz multi-bairro (HTML/CSS/JS puro) |
| `app/` | App React PWA — Guia Comercial, Classificados, Jornal, Comunidade |
| `app/bairros/` | Briefings e checklists por bairro |
| `docs/` | Documentação técnica, guias e migrations SQL |
| `config/hostgator/` | Configurações de deploy para o Hostgator |
| `.agent/` | Rules e skills para agentes de desenvolvimento |

---

## 🌐 Roteamento

| URL | Destino |
|---|---|
| `www.temnobairro.online/` | Landing page (seletor de bairros) |
| `www.temnobairro.online/interlagos/` | App Parque Interlagos (React PWA) |
| `www.temnobairro.online/santa-julia/` | App Santa Júlia (em breve) |
| `www.temnobairro.online/parque-novo-horizonte/` | App Parque Novo Horizonte (em breve) |
| `www.temnobairro.online/jardim-das-industrias/` | App Jardim das Indústrias (em breve) |

---

## 🚀 Início Rápido

### Landing Page (raiz)

```bash
python -m http.server 3030 --directory landing
# Acesse: http://localhost:3030
```

### App do Bairro (React + Vite)

```bash
cd app
npm install
cp .env.example .env.local
# Edite .env.local com credenciais do Supabase
npm run dev
# Acesse: http://localhost:5173
```

### Build por Bairro

```bash
cd app
npm run build:interlagos           # → dist/ com base=/interlagos/
npm run build:santa-julia          # → dist/ com base=/santa-julia/
npm run build:parque-novo-horizonte
npm run build:jardim-das-industrias
```

---

## 🗂️ Estrutura Completa

```
Guia Digital Interlagos/
├── .agent/                   # Rules de agentes (roles, routing, coding-standards)
├── app/                      # React PWA multi-bairro
│   ├── bairros/              # Briefings e checklists por bairro
│   │   ├── interlagos/
│   │   ├── santa-julia/
│   │   ├── parque-novo-horizonte/
│   │   └── jardim-das-industrias/
│   ├── src/
│   │   ├── features/         # Merchants, Admin, Community, Ads, News, Auth
│   │   ├── stores/           # Estado global (Zustand)
│   │   ├── services/         # Integração Supabase
│   │   ├── components/       # UI reutilizável
│   │   └── lib/              # supabaseClient.js
│   └── package.json          # scripts: build:interlagos, build:santa-julia...
├── landing/                  # Landing page raiz (HTML/CSS/JS puro)
│   └── assets/               # hero.png, herosjc.png
├── docs/                     # Documentação técnica
│   ├── BAIRROS.md            # Guia de expansão de bairros
│   ├── migrations/           # SQLs para o Supabase
│   └── 00-indice.md          # Índice da documentação
├── config/
│   └── hostgator/            # Configs e pacotes de deploy
├── CLAUDE.md                 # Regras imutáveis do projeto (lido pelo Claude Code)
└── README.md                 # Este arquivo
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|---|---|
| **Landing** | HTML5 + CSS3 + Vanilla JS |
| **Frontend (App)** | React 19 + Vite 7 |
| **Estilização** | Tailwind CSS 3 |
| **Backend/BaaS** | Supabase (Auth, Postgres, Realtime, Storage) |
| **Estado Global** | Zustand 5 |
| **Ícones** | Lucide React |
| **PWA** | vite-plugin-pwa + Workbox |
| **Deploy** | Hostgator (shared hosting Apache) |

---

## 📚 Documentação

| Documento | Descrição |
|---|---|
| `docs/00-indice.md` | Índice completo da documentação |
| `docs/BAIRROS.md` | Como adicionar e ativar novos bairros |
| `docs/10-guia-de-execucao.md` | Guia de execução do projeto v2.1 |
| `docs/11-deploy-hostgator.md` | Guia completo de deploy |
| `docs/06-roadmap-tecnico.md` | Roadmap técnico v2.0 |
| `docs/12-plano-admin-3-fases.md` | Plano operacional do painel administrativo + prompts para Claude Code |
| `CLAUDE.md` | Regras de arquitetura e stack (lido pelo Claude Code) |

---

## 🤝 Modelo Operacional de Agentes

Este projeto passa a operar com três papéis fixos:

| Papel | Responsável | Responsabilidade |
|---|---|---|
| **Arquiteto e Orquestrador** | Codex | Audita, prioriza, quebra em fases, escreve prompts técnicos e atualiza a documentação de governança |
| **Executor de Código** | Claude Code | Aplica mudanças no código a partir dos prompts aprovados e só reporta bloqueios ou itens não aplicados |
| **QA Funcional** | Reinaldo | Valida os fluxos reais via `localhost`, confirma comportamento e aprova continuidade |

### Regra de execução

1. Codex define a fase, o escopo e o prompt operacional.
2. Claude Code executa a tarefa no projeto.
3. Se tudo for aplicado, considera-se a etapa concluída sem necessidade de relatório longo.
4. Claude Code só deve retornar quando houver erro, bloqueio, ambiguidade material ou algo impossível de aplicar.
5. A validação final do fluxo fica com o QA humano no ambiente local.

---

Desenvolvido com ❤️ para as comunidades de São José dos Campos, SP.
