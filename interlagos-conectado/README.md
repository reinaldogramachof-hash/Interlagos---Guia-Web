# Interlagos Conectado - Guia Digital

O **Interlagos Conectado** é uma plataforma digital comunitária desenvolvida para conectar moradores, comerciantes e serviços da região de Interlagos. O projeto visa fortalecer a economia local e promover o engajamento social através de um aplicativo web moderno, rápido e acessível.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Firebase_|_Tailwind-blue)

## 🚀 Funcionalidades Principais

*   **Guia Comercial:** Catálogo de comércios locais com busca avançada, filtros por categoria e destaque para parceiros Premium/Super.
*   **Classificados:** Espaço para moradores anunciarem produtos e serviços.
*   **Notícias Locais:** Feed de notícias focado em eventos e atualizações da região.
*   **Ações Sociais:** Plataforma para divulgação de campanhas de doação e voluntariado.
*   **Utilidade Pública:** Telefones e contatos de serviços essenciais.
*   **Painel Administrativo:** Ferramenta de gestão para moderadores controlarem conteúdo, usuários e métricas.

## 🛠️ Arquitetura Técnica

O projeto utiliza uma arquitetura **Serverless** baseada no Google Firebase, garantindo escalabilidade e baixo custo operacional inicial.

### Front-end
*   **React + Vite:** Para uma interface rápida e reativa.
*   **Tailwind CSS:** Para estilização moderna e responsiva.
*   **Lucide React:** Biblioteca de ícones leve e consistente.

### Back-end (Firebase)
*   **Firestore:** Banco de dados NoSQL para armazenamento de dados em tempo real.
    *   *Segurança:* Regras de segurança granulares (`firestore.rules`).
    *   *Performance:* Índices compostos otimizados (`firestore.indexes.json`).
*   **Firebase Authentication:** Gestão de identidade e acesso.
*   **Cloud Functions:** Lógica de backend para tarefas complexas (denormalização, agregação, limpeza de dados).
*   **Algolia (Extensão):** Motor de busca "fuzzy" para resultados rápidos e relevantes.

## 📦 Estrutura do Projeto

```bash
interlagos-conectado/
├── src/
│   ├── components/      # Componentes UI reutilizáveis
│   ├── constants/       # Definições estáticas (categorias, etc)
│   ├── context/         # Context API (Auth, etc)
│   ├── AdminPanel.jsx   # Painel de Gestão
│   ├── App.jsx          # Componente Raiz e Roteamento
│   ├── Seeder.jsx       # Ferramenta de População de Dados (Dev)
│   └── ...              # Views (MerchantsView, AdsView, etc)
├── functions/           # Cloud Functions (Backend)
├── firestore.rules      # Regras de Segurança
├── firestore.indexes.json # Índices do Banco
└── firebase.json        # Configuração do Firebase
```

## 🔧 Configuração e Instalação

### Pré-requisitos
*   Node.js (v18+)
*   Conta no Google Firebase

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/reinaldogramachof-hash/Interlagos---Guia-Web.git
    cd interlagos-conectado
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase:**
    *   Crie um projeto no Console do Firebase.
    *   Crie um arquivo `.env` na raiz com suas credenciais:
        ```env
        VITE_API_KEY=sua_api_key
        VITE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
        VITE_PROJECT_ID=seu_project_id
        VITE_STORAGE_BUCKET=seu_bucket.appspot.com
        VITE_MESSAGING_SENDER_ID=seu_sender_id
        VITE_APP_ID=seu_app_id
        ```

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🛡️ Painel Administrativo

Para acessar o Painel Admin em ambiente de desenvolvimento:
1.  Clique no ícone de **Dashboard** no cabeçalho da aplicação.
2.  Utilize a aba **"Banco de Dados"** para rodar o Seeder e popular o banco com dados de teste.

---
Desenvolvido com ❤️ para a comunidade de Interlagos.
