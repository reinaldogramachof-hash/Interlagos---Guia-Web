# Diretrizes de Contexto: Interlagos Conectado (Community Hub)

Este documento define as regras de desenvolvimento e arquitetura para a orquestração do projeto, focado no pivot estratégico para **Rede Social Hiperlocal B2B (SaaS Local) + C2C**. 
Como Tech Lead autônomo, devo sempre respeitar estas premissas antes de sugerir ou escrever código.

## 1. Princípios Arquiteturais e de Negócio

*   **Identidade do Produto:** Não somos mais um "Guia Comercial" estático. Somos um **Community Hub**. O engajamento diário e a interação social (C2C) são a isca para vender o SaaS (B2B) aos comerciantes locais.
*   **O2O (Offline-to-Online):** Todas as funcionalidades devem considerar que o tráfego hiperlocal muitas vezes flutua entre o mundo físico (panfletos, QR Codes na vitrine) e o digital. Velocidade de carregamento (LCP) é crítica.
*   **Viralidade e Growth Hacking:** O design e o código devem facilitar ao máximo a partilha orgânica via WhatsApp. Links devem ter Open Graph (Meta Tags) ricas, atraentes e partilháveis.
*   **Tom de Comunicação Codebase:** Português do Brasil (PT-BR) nos comentários sistémicos focados em negócio, mas código legível em Inglês Técnico focado na indústria.

## 2. Padrões de Interface e Experiência do Utilizador (UI/UX)

*   **Mobile-First Absoluto & PWA Rica:** Desktop é secundário. O design deve ser testado primariamente para mobile. 
    *   *Regra de PWA:* É obrigatório evoluir o `pwaUtils.js` para incluir caching forte via Service Workers. O app não pode "morrer" no metro ou em zonas de sombra 4G.
*   **"Lazy Login" (Fricção Zero):** 
    *   A entrada principal do utilizador deve ser completamente desimpedida (Anonymous Auth Login gerado passivamente).
    *   Só deve ser pedido perfil, nome ou email (Progressive Profiling) no exato momento de "alta intenção" (e.g. quando ele clica no botão "Publicar Anúncio" ou "Salvar Favorito").
*   **Design Sustentável:** TailwindCSS é o nosso motor. É proibido inventar classes customizadas de CSS a não ser por motivos de extrema complexidade de animação.

## 3. Gestão de Estado e Componentização

*   **Atomização de Monólitos:** Ficheiros como `AdminPanel.jsx` ou `App.jsx` massivos devem ser quebrados rigorosamente.
*   **Fluxo de Dados Local:** Começar com Context API para simplicidade (Auth, Tema, Modal State). Para estado remoto e mutações complexas, adotar React Query (ou SWR) em vez de lotar os contexts com queries do Firebase.
*   **Módulos de IA (Genkit):** Qualquer inferência ou fluxo de conversação inteligente (Genkit) deve rodar de forma perfeitamente assíncrona. A thread visual da UI não pode bloquear à espera de um completion de LLM.

## 4. Estratégia B2B e Bases de Dados

Para suportar o cruzamento entre as interações vitais C2C (chats, views, classificados) e as necessidades exigentes de Relatórios de ROI dos lojistas (B2B SaaS):
*   **NoSQL de Combate (Firebase):** Manter o Firestore para tudo o que exige *real-time* e velocidade de renderização (chat, feed de notícias, atualizações da vitrine hiperlocal).
*   **Analytics / Relacional (B2B Reporting):** Como o Firestore é hostil a junções corporativas (JOINs) pesadas e contagens massivas baratas, o Tech Lead deve orientar o desenvolvimento analítico para a extração passiva desses dados rumo a soluções compatíveis como Supabase (PostgreSQL para Views B2B) ou BigQuery (event streaming). A regra é: *Analytics pesado do SaaS não deve pesar na conta de leitura do Firestore.*
