# Tem No Bairro — Módulos e Funcionalidades

> **Versão:** 1.0
> **Data:** Março/2026
> **Referência:** Documento 01 — Visão Geral do Produto

---

## VISÃO GERAL DOS MÓDULOS

O Tem No Bairro é lançado de forma completa — todos os módulos disponíveis desde o dia 1, para atrair simultaneamente moradores e comerciantes de perfis diferentes.

```
┌─────────────────────────────────────────────┐
│              TEM NO BAIRRO                  │
├──────────┬──────────┬──────────┬────────────┤
│ Comércios│ Jornal   │Classifi- │  Ação      │
│ & Serv.  │ Local    │  cados   │  Social    │
├──────────┼──────────┼──────────┼────────────┤
│Utilidade │ História │  Perfil  │  Admin     │
│ Pública  │ do Bairro│ & Conta  │  Panel     │
└──────────┴──────────┴──────────┴────────────┘
```

---

## MÓDULO 1 — COMÉRCIOS & SERVIÇOS LOCAIS

**Objetivo:** Vitrine digital dos negócios do bairro.

### Funcionalidades

**Visualização (sem login)**
- Lista de comércios por categoria (alimentação, beleza, saúde, serviços, etc.)
- Filtro por categoria e busca por nome
- Card do comércio: logo, nome, categoria, descrição curta, botão WhatsApp, avaliação
- Página de detalhe: fotos, endereço, horários, redes sociais, campanhas ativas, avaliações

**Destaques Visuais (por plano)**
- Carrossel Premium — aparece no topo da listagem
- Carrossel Profissional — aparece logo abaixo
- Listagem Básico — aparece na lista principal com destaque leve
- Listagem Gratuito — aparece na lista padrão sem destaque

**Interação (requer login)**
- Avaliação com nota e comentário (moradores)
- Favoritar comércio
- Compartilhar no WhatsApp (botão nativo)
- Clicar no WhatsApp do estabelecimento

**Para o Comerciante (painel próprio)**
- Cadastro e edição do perfil do negócio
- Upload de fotos
- Gestão de informações (horários, contato, endereço)
- Visualização de métricas (views, cliques no WhatsApp)
- Publicação de campanhas/ofertas (conforme plano)

### Regras de Negócio
- Cadastro gratuito disponível para qualquer negócio do bairro
- Aprovação pela equipe antes de publicar (moderação)
- Cada comércio pertence a um único dono (conta vinculada)
- Avaliações ficam visíveis após aprovação moderada para evitar conflitos

---

## MÓDULO 2 — JORNAL LOCAL

**Objetivo:** Canal de notícias e informações do bairro com participação da comunidade.

### Funcionalidades

**Visualização (sem login)**
- Feed de notícias ordenado por data
- Filtro por categoria (segurança, eventos, obras, saúde, geral)
- Notícia com título, resumo, imagem e data
- Página de detalhe da notícia
- Badge de origem: "Oficial" (equipe) vs "Morador"

**Publicação**
- **Equipe Tem No Bairro:** publica com badge "Oficial" — publicação imediata
- **Moradores:** submetem notícia → equipe revisa → aprova para publicar
  - Aceite obrigatório de termos de responsabilidade na submissão
  - Prazo de análise: até 24h úteis

**Interação (requer login)**
- Curtir notícia
- Comentar notícia
- Compartilhar no WhatsApp

### Regras de Negócio
- Conteúdo ofensivo, fake news ou comercial disfarçado de notícia será rejeitado
- Moradores com histórico de submissões aprovadas podem ganhar badge "Colaborador"
- Notícias oficiais têm prioridade visual no feed

---

## MÓDULO 3 — CLASSIFICADOS (ESTILO OLX)

**Objetivo:** Compra e venda gratuita entre moradores do bairro.

### Funcionalidades

**Visualização (sem login)**
- Lista de anúncios por categoria (eletrônicos, roupas, móveis, serviços, etc.)
- Filtro por categoria, tipo (venda/doação/troca) e faixa de preço
- Card do anúncio: foto, título, preço, data, bairro
- Página de detalhe: fotos, descrição completa, contato

**Publicação (requer login)**
- Criar anúncio: título, descrição, categoria, fotos, preço, tipo (venda/troca/doação)
- Editar e encerrar anúncio
- Marcar como vendido/concluído

**Interação (requer login)**
- Entrar em contato via WhatsApp com o vendedor
- Favoritar anúncio
- Denunciar anúncio inadequado

### Regras de Negócio
- **Gratuito para moradores** — estratégia de aquisição de usuários
- Limite de anúncios ativos por usuário (a definir — ex: 5 simultâneos)
- Anúncios expiram após 30 dias (renovável manualmente)
- Moderação reativa (denúncias) + revisão de novos usuários

---

## MÓDULO 4 — AÇÃO SOCIAL E CAMPANHAS

**Objetivo:** Conectar quem precisa de ajuda a quem pode ajudar no próprio bairro.

### Funcionalidades

**Visualização (sem login)**
- Lista de campanhas ativas (arrecadação, doação, mutirão, etc.)
- Detalhe da campanha: objetivo, progresso, como ajudar, responsável

**Solicitação de Campanha (requer login)**
- Morador submete solicitação de campanha com: título, descrição, tipo de ajuda necessária, contato
- Equipe avalia e aprova/rejeita a campanha
- Após aprovação, campanha fica visível na plataforma

**Interação (requer login)**
- Manifestar interesse em ajudar
- Compartilhar campanha no WhatsApp
- Curtir/apoiar campanha

### Tipos de Campanhas Suportadas
- Arrecadação de alimentos / roupas / itens
- Doação financeira (com link externo — PIX, vaquinha)
- Mutirão / voluntariado
- Apoio a família em situação de vulnerabilidade
- Campanha de saúde (vacinação, exames)

### Regras de Negócio
- Nenhuma campanha vai ao ar sem aprovação da equipe
- Prazo máximo de campanha: 60 dias (renovável)
- A plataforma não processa pagamentos — redireciona para ferramentas externas (PIX, etc.)
- Equipe pode criar campanhas diretamente sem aprovação

---

## MÓDULO 5 — UTILIDADE PÚBLICA

**Objetivo:** Central de informações essenciais do bairro, sempre atualizada.

### Conteúdo (informativo — editado pela equipe)

| Categoria | Exemplos |
|---|---|
| Saúde | UBS local, farmácias de plantão, hospital de referência |
| Segurança | Delegacia, GCM, Bombeiros — telefones e endereços |
| Transporte | Linhas de ônibus, pontos, terminais próximos |
| Educação | Escolas públicas, creches, EJA |
| Assistência Social | CRAS, CAPS, programas municipais |
| Limpeza Urbana | Dias de coleta, pontos de descarte, entulho |
| Emergências | Contatos rápidos em uma tela |

### Funcionalidades
- Acesso sem login
- Layout simples, legível, com ícones
- Atualização manual pela equipe
- Compartilhamento de contatos por WhatsApp

### Regras de Negócio
- Conteúdo 100% editorial — moradores não editam
- Revisão periódica a cada 3 meses ou quando houver mudança

---

## MÓDULO 6 — HISTÓRIA DO BAIRRO

**Objetivo:** Preservar e compartilhar a memória e identidade do Parque Interlagos.

### Conteúdo (editorial — equipe + colaboradores convidados)
- Linha do tempo do bairro
- Histórias de moradores antigos (entrevistas)
- Fotos históricas
- Origem do nome, marcos e datas importantes
- Personalidades locais

### Funcionalidades
- Acesso sem login
- Formato de artigos/galeria
- Compartilhamento por WhatsApp
- Possibilidade futura de contribuição por moradores (curada pela equipe)

---

## MÓDULO 7 — PERFIL DO USUÁRIO

**Objetivo:** Identidade do morador/comerciante na plataforma.

### Dados do Perfil
- Foto, nome de exibição
- Tipo de conta: Morador / Comerciante
- Histórico de anúncios, favoritos, comentários, campanhas apoiadas
- Notificações

### Funcionalidades
- Login via Google OAuth ou Magic Link (e-mail) ou e-mail+senha
- Editar perfil
- Ver favoritos (comércios e anúncios)
- Ver notificações
- Para comerciantes: acesso ao Painel do Negócio

---

## MÓDULO 8 — PAINEL DO COMERCIANTE

**Objetivo:** Ferramenta de gestão do negócio digital — progride conforme o plano.

### Funcionalidades por Plano

| Funcionalidade | Gratuito | Básico | Profissional | Premium | Gold |
|---|:---:|:---:|:---:|:---:|:---:|
| Perfil do negócio | ✓ | ✓ | ✓ | ✓ | ✓ |
| Botão WhatsApp no card | — | ✓ | ✓ | ✓ | ✓ |
| Destaque na listagem | — | Leve | Médio | Alto | Alto |
| Carrossel de destaque | — | — | Profissional | Premium | Premium |
| Publicar campanhas/ofertas | — | 1/mês | 3/mês | Ilimitado | Gerenciado |
| Métricas básicas (views, cliques) | — | ✓ | ✓ | ✓ | ✓ |
| Painel de gestão avançado | — | — | ✓ | ✓ | ✓ |
| Relatórios de desempenho | — | — | — | ✓ | ✓ |
| Gestão pela equipe Tem No Bairro | — | — | — | — | ✓ |
| Integração redes sociais | — | — | — | ✓ | ✓ |

### Plano Gold — Gestão Assistida
- Equipe do Tem No Bairro gerencia o perfil digital do estabelecimento
- Publicação de conteúdo (fotos, promoções, notícias do negócio)
- Resposta a avaliações
- Relatório mensal de desempenho
- Canal de comunicação dedicado (WhatsApp com a equipe)

---

## MÓDULO 9 — PAINEL ADMINISTRATIVO (Equipe Interna)

**Objetivo:** Controle total da plataforma pela equipe Tem No Bairro.

### Funcionalidades
- **Aprovações:** Fila de comerciantes e notícias pendentes
- **Gestão de Comércios:** Editar, suspender, promover planos
- **Gestão de Notícias:** Publicar, editar, rejeitar
- **Campanhas:** Criar, editar, encerrar
- **Usuários:** Visualizar, moderar, alterar permissões
- **Tickets de Suporte:** Fila de solicitações e escaladas
- **Auditoria:** Histórico de ações administrativas
- **Banco de dados:** Visualização técnica (admin master)

---

## PRIORIDADE DE LANÇAMENTO (MVP COMPLETO)

Todos os módulos estarão disponíveis no lançamento em Maio/2026. A sequência de **implementação técnica** (não de visibilidade ao usuário) é:

1. Comércios & Serviços (core do produto)
2. Painel do Comerciante (receita)
3. Jornal Local (engajamento)
4. Classificados (aquisição de moradores)
5. Ação Social / Campanhas (diferencial comunitário)
6. Utilidade Pública (retenção)
7. História do Bairro (identidade)
8. Módulos de gestão avançada (Profissional/Premium/Gold)

---

*Próximo documento: [03-modelo-de-planos-e-negocios.md](03-modelo-de-planos-e-negocios.md)*
