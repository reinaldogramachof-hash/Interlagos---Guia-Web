# 🏙️ TemNoBairro — Hub Digital Comunitário

Repositório principal do ecossistema digital dos bairros de **São José dos Campos, SP**.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/Stack-React_|_Supabase_|_Vite-blue)
![License](https://img.shields.io/badge/Licença-Privada-red)

---

## 📦 Estrutura do Repositório

| Projeto | Descrição | Localização |
|---|---|---|
| **Landing Page** | Página inicial multi-bairro (HTML/CSS/JS puro) | `./landing/` |
| **TemNoBairro — Interlagos** | App web PWA — Guia Comercial, Classificados, Jornal, Comunidade | `./app/` |

---

## 🌐 Domínio e Roteamento

| URL | Destino |
|---|---|
| `www.temnobairro.online/` | Landing page raiz (seletor de bairros) |
| `www.temnobairro.online/interlagos/` | App Parque Interlagos (React PWA) |

---

## 🚀 Início Rápido

### Landing Page (raiz)

```bash
# Servir localmente (requer Python)
python -m http.server 3030 --directory landing
# Acesse: http://localhost:3030
```

### App do Bairro (React + Vite)

```bash
cd app
npm install
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
npm run dev
# Acesse: http://localhost:5173
```

---

## 🗂️ Estrutura Geral

```
Guia Digital Interlagos/
├── landing/                  # Landing page raiz (HTML/CSS/JS puro)
│   ├── index.html            # 7 seções: Hero, Pilares, Bairros, Como Funciona...
│   ├── css/styles.css        # Design system dark premium
│   ├── js/main.js            # Animações (IntersectionObserver, Ken Burns)
│   └── assets/               # Imagens: herosjc.png (cidade), hero.png (bairro)
├── app/                      # App React PWA — bairro Interlagos
│   ├── src/
│   │   ├── features/         # Merchants, Admin, Community, Ads, News
│   │   ├── stores/           # Estado global (Zustand)
│   │   ├── services/         # Integração Supabase
│   │   ├── components/       # UI reutilizável
│   │   └── App.jsx           # Componente raiz
│   ├── public/               # Assets estáticos (hero.png, herosjc.png, logos)
│   └── package.json
├── docs/                     # Documentação e migrations SQL
├── vercel.json               # Roteamento multi-bairro (landing + SPA)
└── README.md
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|---|---|
| **Landing** | HTML5 + CSS3 + Vanilla JS |
| **Frontend (App)** | React 19 + Vite 7 |
| **Estilização (App)** | Tailwind CSS 3 |
| **Backend/BaaS** | Supabase (Auth, Postgres, Realtime) |
| **Estado Global** | Zustand 5 |
| **Ícones** | Lucide React |
| **PWA** | vite-plugin-pwa + Workbox |
| **Deploy** | Vercel |

---

Desenvolvido com ❤️ para as comunidades de São José dos Campos, SP.


