# Tem No Bairro — Experiência do Usuário (UX)

> **Versão:** 1.0
> **Data:** Março/2026
> **Princípio central:** Mobile-First, Lazy Login, Comunidade primeiro.

---

## 1. PRINCÍPIOS DE UX (NÃO NEGOCIÁVEIS)

| Princípio | O que significa na prática |
|---|---|
| **Mobile-First** | Toda tela projetada para 375px primeiro. Tablet e desktop são bonus. |
| **Lazy Login** | NUNCA exigir login para ver conteúdo. Login só ao interagir (curtir, postar, comprar). |
| **Zero fricção para o morador** | Abrir, ver, engajar — 3 toques no máximo para chegar ao conteúdo. |
| **Offline-first** | O feed principal funciona sem internet via cache PWA. |
| **WhatsApp como CTA principal** | Botão de contato via WhatsApp em todo card de comércio/anúncio. |
| **Compartilhar é crescer** | Todo card tem botão de share nativo — o boca a boca digital é nosso motor de crescimento. |

---

## 2. PERSONAS DE USUÁRIO

### Persona 1 — Marina, 34 anos — A Moradora Ativa
- **Perfil:** Mãe, trabalha, usa WhatsApp e Instagram o dia todo no celular
- **Dor:** Não sabe o que tem disponível perto de casa. Pesquisa no Google mas os resultados são genéricos.
- **Objetivo no app:** Encontrar serviços confiáveis no bairro, postar anúncio de roupa usada, saber das notícias locais
- **Comportamento:** Acessa no intervalo, no transporte, antes de dormir
- **O que ela precisa sentir:** "Aqui é do meu bairro. É de gente que eu conheço."

### Persona 2 — Seu José, 52 anos — O Comerciante Tradicional
- **Perfil:** Dono de oficina mecânica, MEI, nunca teve presença digital, usa WhatsApp mas não domina redes sociais
- **Dor:** Perde clientes para concorrentes com mais visibilidade. Não sabe por onde começar no digital.
- **Objetivo no app:** Ter um perfil que os vizinhos encontrem, receber chamadas pelo WhatsApp
- **Comportamento:** Acessa pelo celular quando tem tempo livre, não quer complicar
- **O que ele precisa sentir:** "É fácil. Meu negócio tá visível. Estou recebendo clientes."

### Persona 3 — Camila, 28 anos — A Comerciante Digital
- **Perfil:** Dono de salão, usa Instagram para divulgar, quer mais ferramentas de gestão
- **Dor:** O Instagram tem muito alcance geral, mas ela quer atingir quem mora perto
- **Objetivo no app:** Visibilidade local, métricas, promoções pontuais, relacionamento com clientes do bairro
- **Comportamento:** Acessa diariamente, usa o painel de gestão, quer dados
- **O que ela precisa sentir:** "Tenho controle do meu negócio aqui. E meus clientes me encontram fácil."

---

## 3. JORNADAS PRINCIPAIS

### Jornada 1 — Morador descobre e usa pela primeira vez

```
1. Recebe link no WhatsApp do grupo do bairro
2. Abre no navegador do celular (PWA — sem instalar)
3. Vê o feed do bairro: comércios, notícias, classificados
4. Navega livremente sem login
5. Clica num comércio → vê detalhes → clica no WhatsApp
   (aqui o login é solicitado, mas de forma leve)
6. Volta ao feed → adiciona à tela inicial (prompt de instalação PWA)
```

**Resultado desejado:** Instalou o PWA, fez contato com 1 comércio, voltará amanhã.

---

### Jornada 2 — Comerciante faz o cadastro

```
1. Recebe indicação (escritório, visita, panfleto)
2. Acessa o app → clica em "Cadastre seu negócio"
3. Cria conta (Google ou e-mail)
4. Preenche perfil: nome, categoria, descrição, foto, WhatsApp
5. Aguarda aprovação da equipe (até 24h)
6. Recebe notificação: "Seu negócio está no ar!"
7. Compartilha o link do seu perfil no seu WhatsApp pessoal
```

**Resultado desejado:** Negócio publicado, comerciante compartilhou — primeiros views chegando.

---

### Jornada 3 — Morador posta um classificado

```
1. Acessa o app (já instalado, logado)
2. Clica no botão "+" flutuante
3. Escolhe "Anunciar no Classificados"
4. Preenche: título, fotos, preço, categoria
5. Publica (vai para revisão rápida)
6. Anúncio aparece no feed de classificados
7. Recebe mensagem de um vizinho via WhatsApp
```

**Resultado desejado:** Anúncio publicado em menos de 5 minutos.

---

### Jornada 4 — Morador solicita uma campanha social

```
1. Acessa o app → vai em "Ação Social"
2. Clica em "Solicitar Campanha"
3. Preenche formulário: o que precisa, para quem, como ajudar
4. Aceita termos de responsabilidade
5. Equipe analisa (até 48h)
6. Campanha vai ao ar com badge "Aprovada"
7. Morador recebe notificação de aprovação
```

---

## 4. ARQUITETURA DE NAVEGAÇÃO

### Navegação Principal (Bottom Navigation — Mobile)

```
┌─────────────────────────────────────────┐
│                                         │
│   [Feed/Home]  [Comércios]  [+Post]  [Classificados]  [Perfil]   │
│                                         │
└─────────────────────────────────────────┘
```

| Tab | Conteúdo |
|---|---|
| Home | Feed misto: notícias locais + comércios em destaque + campanhas |
| Comércios | Lista por categoria + carrosséis Premium/Pro |
| + (FAB) | Atalho: criar anúncio classificado ou postar notícia |
| Classificados | Feed de anúncios C2C por categoria |
| Perfil | Conta, favoritos, notificações, painel do comerciante |

### Navegação Secundária (Menu lateral / Hamburger)

```
├── Jornal Local
├── Ação Social
├── Utilidade Pública
├── História do Bairro
├── Planos (para comerciantes)
└── Sobre o Tem No Bairro
```

---

## 5. PADRÕES VISUAIS

### Paleta de Cores (referência — a validar com design)

| Uso | Direção |
|---|---|
| Cor primária | Tom quente e acolhedor (laranja/terra ou verde-bairro) |
| Cor de ação | Contraste forte para botões principais |
| Background | Branco/cinza muito claro — conteúdo em destaque |
| WhatsApp | Verde nativo (#25D366) para o botão de contato |
| Premium badge | Dourado/âmbar |
| Profissional badge | Azul |

### Componentes Chave

**Card de Comércio**
```
┌─────────────────────────────────────────┐
│ [Logo]  Nome do Negócio     [Badge Plano]│
│         Categoria           ⭐ 4.8 (12) │
│         Descrição curta...              │
│                                         │
│ [📱 WhatsApp]  [❤️ Favoritar]  [↗ Share] │
└─────────────────────────────────────────┘
```

**Card de Notícia**
```
┌─────────────────────────────────────────┐
│ [Imagem]                                │
│ Título da Notícia                       │
│ 📅 Data  •  🏷️ Categoria  •  ✅ Oficial │
│ Resumo curto da notícia...              │
│ [❤️ 14]  [💬 3]  [↗ Compartilhar]       │
└─────────────────────────────────────────┘
```

**Card de Classificado**
```
┌─────────────────────────────────────────┐
│ [Foto]  Título do Anúncio               │
│         R$ 150,00  •  Eletrônicos       │
│         📍 Parque Interlagos  •  2h     │
│ [📱 Contato via WhatsApp]  [❤️ Salvar]  │
└─────────────────────────────────────────┘
```

---

## 6. LAZY LOGIN — IMPLEMENTAÇÃO

O Lazy Login é um princípio central. O morador nunca é bloqueado por um login forçado.

### Ações que NÃO exigem login
- Ver feed completo (home, comércios, notícias, classificados)
- Ver detalhe de qualquer item
- Acessar utilidade pública, história do bairro

### Ações que exigem login (e acionam o modal de login)
- Curtir, comentar, compartilhar (social)
- Contato via WhatsApp com comércio/vendedor
- Criar anúncio classificado
- Favoritar comércio
- Solicitar campanha social
- Postar notícia
- Acessar perfil e notificações

### Comportamento ao acionar o login
1. Ação bloqueada momentaneamente
2. Modal de login aparece: "Para continuar, entre na sua conta"
3. Opções: Google (1 toque), Magic Link (e-mail), E-mail+senha
4. Após login: ação é executada automaticamente (sem re-clicar)

---

## 7. SISTEMA DE AVALIAÇÕES — DOSAGEM PARA EVITAR CONFLITOS

- Nota de 1–5 estrelas + comentário opcional
- Comentários ficam visíveis após aprovação moderada (primeiros 30 dias de uso do usuário)
- Usuários com histórico positivo ganham aprovação automática
- Comerciante pode **responder** à avaliação (feature do plano Profissional+)
- Denúncia de avaliação → revisão pela equipe
- Avaliações anonimizadas (exibe apenas "Morador do bairro" por padrão)
- Sem nota negativa pública para o primeiro mês — apenas coleta interna (proteção de onboarding)

---

## 8. PERFORMANCE E ACESSIBILIDADE

| Requisito | Meta |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s em 4G lento |
| Imagens | `loading="lazy"` em todos os cards |
| Fontes | Preload das fontes principais |
| Offline | Feed principal disponível sem conexão (Workbox cache) |
| Tamanho mínimo de toque | 44x44px em todos os botões |
| Contraste de texto | WCAG AA mínimo |
| Compatibilidade | Chrome e Safari mobile (iOS e Android) |

---

*Próximo documento: [06-roadmap-tecnico.md](06-roadmap-tecnico.md)*
