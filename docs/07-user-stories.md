# 07 — User Stories: Tem No Bairro

> Documento vivo. Cada story é a unidade mínima de valor entregável.
> Base para testes de aceitação, refinamentos de sprint e critérios de DoD.
>
> **Produto:** Tem No Bairro — Community Hub Hiperlocal
> **Bairro piloto:** Parque Interlagos, São José dos Campos — SP
> **Lançamento previsto:** Maio/2026
> **Última revisão:** Março/2026

---

## Índice

1. [Módulo 1 — Comércios & Serviços](#módulo-1--comércios--serviços)
2. [Módulo 2 — Jornal Local](#módulo-2--jornal-local)
3. [Módulo 3 — Classificados C2C](#módulo-3--classificados-c2c)
4. [Módulo 4 — Ação Social / Campanhas](#módulo-4--ação-social--campanhas)
5. [Módulo 5 — Utilidade Pública](#módulo-5--utilidade-pública)
6. [Módulo 6 — História do Bairro](#módulo-6--história-do-bairro)
7. [Módulo 7 — Perfil do Usuário](#módulo-7--perfil-do-usuário)
8. [Módulo 8 — Painel do Comerciante](#módulo-8--painel-do-comerciante)
9. [Módulo 9 — Autenticação](#módulo-9--autenticação)
10. [Módulo 10 — Admin Panel](#módulo-10--admin-panel)

---

## Módulo 1 — Comércios & Serviços

### US-001 — Listar comércios do bairro
**Como** Visitante
**Quero** visualizar a lista de comércios e serviços cadastrados no bairro
**Para** descobrir onde comprar ou contratar serviços perto de casa sem precisar criar conta

**Critérios de aceite:**
- [ ] A lista de comércios é exibida sem exigir login
- [ ] Cada card exibe: nome, categoria, foto de capa (ou placeholder), avaliação média e selo de plano (se aplicável)
- [ ] A lista carrega em até 2,5 segundos em conexão 4G lento (LCP < 2,5s)
- [ ] Em caso de ausência de conexão, o feed é servido pelo cache do Service Worker (PWA Offline-First)
- [ ] Comércios com plano Premium e Gold aparecem em carrossel de destaque no topo

**Notas:** Carrosséis Premium e Pro são componentes separados (`PremiumCarousel`, `ProCarousel`). Comércios gratuitos aparecem na lista geral sem destaque visual de plano.

---

### US-002 — Filtrar comércios por categoria
**Como** Visitante
**Quero** filtrar comércios por categoria (ex.: Alimentação, Saúde, Beleza, Serviços)
**Para** encontrar rapidamente o tipo de estabelecimento que preciso

**Critérios de aceite:**
- [ ] Chips/botões de filtro de categoria são visíveis acima da lista
- [ ] Ao selecionar uma categoria, a lista atualiza imediatamente (sem reload de página)
- [ ] É possível selecionar apenas uma categoria por vez
- [ ] Um chip "Todos" desmarca qualquer filtro ativo e exibe todos os comércios
- [ ] O filtro selecionado permanece ativo se o usuário fechar e reabrir o modal de detalhe de um comércio
- [ ] Em mobile (375px), os chips são horizontalmente roláveis sem quebra de linha

---

### US-003 — Buscar comércio por nome ou palavra-chave
**Como** Visitante
**Quero** digitar um nome ou serviço na barra de busca
**Para** encontrar um comércio específico sem precisar navegar por toda a lista

**Critérios de aceite:**
- [ ] Campo de busca exibido no topo da lista de comércios
- [ ] Resultados filtram em tempo real (debounce de 300ms) à medida que o usuário digita
- [ ] Busca contempla nome do comércio, categoria e descrição
- [ ] Quando nenhum resultado é encontrado, exibe mensagem amigável: "Nenhum comércio encontrado para '[termo]'. Tente outra palavra."
- [ ] Limpar o campo restaura a lista completa

**Notas:** Integração Algolia prevista para fase futura. Na fase inicial, filtro local sobre os dados carregados.

---

### US-004 — Ver detalhes de um comércio
**Como** Visitante
**Quero** clicar em um card de comércio e ver todas as informações detalhadas
**Para** decidir se quero entrar em contato ou visitar o estabelecimento

**Critérios de aceite:**
- [ ] Modal ou página de detalhe exibe: nome, descrição completa, categoria, endereço, horário de funcionamento, foto(s), avaliação média, número de avaliações
- [ ] Botão de WhatsApp é exibido apenas para planos Básico, Profissional, Premium e Gold
- [ ] Comércios do plano Gratuito NÃO exibem botão de WhatsApp no detalhe
- [ ] Botão de compartilhamento nativo (`navigator.share`) está disponível em todos os cards
- [ ] Se `navigator.share` não for suportado pelo navegador, exibe link de cópia para área de transferência como fallback
- [ ] O clique no detalhe registra um evento de visualização (`click_events` com `entity_type: 'merchant'`)

---

### US-005 — Entrar em contato via WhatsApp
**Como** Visitante
**Quero** clicar no botão de WhatsApp de um comércio
**Para** falar diretamente com o estabelecimento pelo canal que já uso no dia a dia

**Critérios de aceite:**
- [ ] Botão de WhatsApp abre `https://wa.me/[número]` em nova aba
- [ ] Botão só é exibido se o comerciante tem plano Básico ou superior E preencheu o número de WhatsApp
- [ ] O clique registra evento de contato (`click_events` com `entity_type: 'merchant'`, `event_type: 'whatsapp'`)
- [ ] Número de WhatsApp é formatado corretamente (DDI 55 + DDD + número, sem caracteres especiais)

---

### US-006 — Compartilhar um comércio via WhatsApp
**Como** Morador
**Quero** compartilhar o perfil de um comércio com amigos ou grupos no WhatsApp
**Para** ajudar negócios locais a ganhar mais clientes e recomendar para conhecidos

**Critérios de aceite:**
- [ ] Botão de share está visível no card e na tela de detalhe
- [ ] Ao clicar, dispara `navigator.share` com título, texto e URL do perfil do comércio
- [ ] O texto de compartilhamento inclui o nome do comércio e uma chamada: "Encontrei no Tem No Bairro!"
- [ ] Fallback: se `navigator.share` não disponível, botão abre `https://wa.me/?text=[mensagem_encoded]`

---

### US-007 — Avaliar um comércio
**Como** Morador
**Quero** dar uma nota de 1 a 5 estrelas e deixar um comentário para um comércio
**Para** ajudar outros moradores a escolher melhor onde comprar ou contratar

**Critérios de aceite:**
- [ ] O botão "Avaliar" só é exibido para usuários logados; visitantes veem um convite de login (Lazy Login)
- [ ] É possível dar nota de 1 a 5 estrelas (campo obrigatório)
- [ ] Comentário é opcional (máximo 500 caracteres)
- [ ] Um usuário pode avaliar o mesmo comércio apenas uma vez; editar a avaliação é permitido
- [ ] Novas avaliações ficam com status `pendente` e passam por moderação do Admin antes de aparecer publicamente
- [ ] Avaliação aprovada aparece na lista de reviews do comércio e atualiza a média exibida no card
- [ ] Comerciante com plano Profissional ou superior pode responder à avaliação publicamente

**Notas:** Moderação realizada no Admin Panel → aba Approvals.

---

### US-008 — Favoritar um comércio
**Como** Morador
**Quero** salvar um comércio na minha lista de favoritos
**Para** encontrá-lo rapidamente depois sem precisar buscar novamente

**Critérios de aceite:**
- [ ] Ícone de coração visível no card e na tela de detalhe
- [ ] Visitante que clica no coração vê o modal de login (Lazy Login), não perde a ação
- [ ] Após login, o comércio é adicionado automaticamente aos favoritos
- [ ] Coração fica preenchido/colorido quando o item está nos favoritos do usuário logado
- [ ] Favoritos são persistidos no Supabase (tabela `favorites`) e sincronizados entre dispositivos
- [ ] Na aba de Perfil do usuário, existe seção "Meus Favoritos" listando todos os itens salvos

---

### US-009 — Ver comércios em destaque (Carrossel Premium)
**Como** Visitante
**Quero** ver os comércios em destaque no topo da tela principal
**Para** descobrir os negócios mais relevantes do bairro rapidamente

**Critérios de aceite:**
- [ ] Carrossel exibe apenas comércios com plano Premium e Gold que estão ativos (`is_active: true`)
- [ ] Auto-scroll a cada 4 segundos; pause no hover/touch
- [ ] Indicadores de posição (dots) visíveis abaixo do carrossel
- [ ] Cada slide exibe: foto, nome, categoria e slogan/descrição curta
- [ ] Clique no slide abre o detalhe do comércio
- [ ] Se não houver comércios Premium/Gold ativos, o carrossel é ocultado (sem espaço vazio)

---

### US-010 — Cadastrar meu negócio (primeiro acesso do comerciante)
**Como** Morador que tem um negócio local
**Quero** cadastrar meu estabelecimento na plataforma
**Para** aparecer para outros moradores e ganhar novos clientes

**Critérios de aceite:**
- [ ] Botão "Cadastrar meu negócio" acessível na tela principal e no perfil do usuário
- [ ] Usuário não logado é redirecionado para login antes de prosseguir (Lazy Login)
- [ ] Formulário solicita: nome, categoria, descrição, endereço, telefone, foto de capa
- [ ] Após envio, comerciante recebe status `pendente` e é notificado que a conta será revisada
- [ ] Admin recebe notificação de novo cadastro pendente para aprovação
- [ ] Após aprovação, o comerciante recebe notificação e seu negócio aparece na lista pública

---

### US-011 — Ver planos disponíveis para o meu negócio
**Como** Comerciante (plano Gratuito)
**Quero** visualizar os planos pagos disponíveis e seus benefícios
**Para** decidir se vale a pena fazer upgrade para ter mais visibilidade

**Critérios de aceite:**
- [ ] Tela de comparação de planos acessível no Painel do Comerciante
- [ ] Cada plano exibe: nome, preço mensal, lista de recursos incluídos e recursos não incluídos
- [ ] Plano atual do comerciante é destacado visualmente
- [ ] Botão "Fazer upgrade" direciona para contato via WhatsApp com a equipe Tem No Bairro (processo manual na fase inicial)
- [ ] Tabela de planos responsiva em mobile (375px), sem scroll horizontal forçado

---

### US-012 — Ver avaliações do meu comércio (comerciante)
**Como** Comerciante
**Quero** visualizar todas as avaliações que meu negócio recebeu
**Para** entender a percepção dos clientes e melhorar meu atendimento

**Critérios de aceite:**
- [ ] Lista de avaliações disponível no Painel do Comerciante
- [ ] Cada avaliação exibe: nome do avaliador, nota, comentário e data
- [ ] Avaliações pendentes de moderação são exibidas com indicador visual de status
- [ ] Comerciante com plano Profissional ou superior pode clicar em "Responder" em cada avaliação
- [ ] Resposta é submetida e fica visível publicamente no detalhe do comércio abaixo da avaliação
- [ ] Média geral e distribuição de notas (1 a 5 estrelas) são exibidas em gráfico simples

---

## Módulo 2 — Jornal Local

### US-013 — Ler notícias do bairro
**Como** Visitante
**Quero** acessar as notícias e acontecimentos locais do bairro
**Para** me manter informado sobre o que está acontecendo na minha comunidade

**Critérios de aceite:**
- [ ] Feed de notícias acessível sem login
- [ ] Cada card exibe: título, imagem de capa (ou placeholder), data de publicação, categoria e resumo (máx. 120 caracteres)
- [ ] Notícias são ordenadas por data de publicação (mais recente primeiro)
- [ ] Feed funciona offline via cache do Service Worker (PWA)
- [ ] Carregamento inicial de até 10 notícias; botão "Carregar mais" para paginação

---

### US-014 — Ler notícia completa
**Como** Visitante
**Quero** clicar em uma notícia e ler o conteúdo completo
**Para** me informar sobre os detalhes de um acontecimento local

**Critérios de aceite:**
- [ ] Modal ou página de detalhe exibe: título, imagem grande, data, autor, corpo completo da notícia
- [ ] Botão de compartilhamento nativo disponível na tela de detalhe
- [ ] Clique no detalhe registra evento de visualização (`click_events`)
- [ ] Navegação "voltar" retorna ao feed sem perder a posição de scroll

---

### US-015 — Filtrar notícias por categoria
**Como** Visitante
**Quero** filtrar o feed de notícias por categoria (ex.: Segurança, Saúde, Eventos, Obras)
**Para** ver apenas os assuntos que me interessam

**Critérios de aceite:**
- [ ] Chips de categoria exibidos acima do feed
- [ ] Filtro atualiza o feed imediatamente
- [ ] Chip "Todas" remove o filtro ativo
- [ ] Em mobile, chips são horizontalmente roláveis

---

### US-016 — Publicar notícia (Admin/Master)
**Como** Admin
**Quero** criar e publicar uma nova notícia no jornal local
**Para** informar os moradores sobre acontecimentos relevantes do bairro

**Critérios de aceite:**
- [ ] Formulário de criação acessível no Admin Panel → aba News
- [ ] Campos obrigatórios: título, categoria, corpo da notícia
- [ ] Campos opcionais: imagem de capa (upload), tags
- [ ] Notícia criada com status `rascunho` por padrão; publicação requer ação explícita
- [ ] Publicação define `status: 'publicado'` e `published_at: now()`
- [ ] Notícia publicada aparece imediatamente no feed público
- [ ] Histórico de edições registrado para auditoria

---

### US-017 — Editar ou despublicar notícia (Admin)
**Como** Admin
**Quero** editar o conteúdo de uma notícia publicada ou removê-la do feed público
**Para** corrigir erros ou remover conteúdo desatualizado/inadequado

**Critérios de aceite:**
- [ ] Botão "Editar" disponível para cada notícia no Admin Panel
- [ ] Formulário de edição pré-preenchido com os dados atuais
- [ ] Salvar alterações atualiza a notícia imediatamente no feed público
- [ ] Opção "Despublicar" muda status para `arquivado` e remove do feed público (sem excluir do banco)
- [ ] Exclusão permanente disponível apenas para Master

---

### US-018 — Compartilhar notícia
**Como** Morador
**Quero** compartilhar uma notícia com meus contatos no WhatsApp ou outras redes
**Para** espalhar informações úteis para minha família e amigos do bairro

**Critérios de aceite:**
- [ ] Botão de share presente no card de notícia e na tela de detalhe
- [ ] `navigator.share` acionado com título, resumo e URL da notícia
- [ ] Fallback para link de WhatsApp se `navigator.share` não disponível
- [ ] Não requer login para compartilhar

---

### US-019 — Receber notificação de nova notícia
**Como** Morador
**Quero** ser notificado quando uma nova notícia for publicada no jornal
**Para** não perder informações importantes sobre o bairro

**Critérios de aceite:**
- [ ] Notificação in-app exibida no sininho (NotificationBell) quando nova notícia é publicada
- [ ] Notificação exibe: título da notícia e chamada "Nova notícia no bairro"
- [ ] Clicar na notificação abre a notícia diretamente
- [ ] Notificações não lidas mostram badge numérico no ícone de sino
- [ ] Notificações persistidas na tabela `notifications` do Supabase

---

### US-020 — Sugerir pauta ao jornal (Morador)
**Como** Morador
**Quero** enviar uma sugestão de pauta para a equipe do jornal local
**Para** contribuir com a cobertura de assuntos relevantes para o bairro

**Critérios de aceite:**
- [ ] Formulário de sugestão de pauta acessível no módulo do Jornal
- [ ] Requer login (Lazy Login aplicado)
- [ ] Campos: título da sugestão, descrição, contato opcional
- [ ] Sugestão enviada chega como ticket no Admin Panel (módulo Tickets) com tipo `sugestao_pauta`
- [ ] Morador recebe confirmação de recebimento por notificação in-app

---

## Módulo 3 — Classificados C2C

### US-021 — Ver anúncios de classificados
**Como** Visitante
**Quero** navegar pelos anúncios de classificados do bairro
**Para** encontrar produtos ou serviços oferecidos por vizinhos

**Critérios de aceite:**
- [ ] Lista de classificados acessível sem login
- [ ] Cada card exibe: foto (ou placeholder), título, preço (ou "Sob consulta"), categoria, cidade/bairro, data de publicação
- [ ] Anúncios ordenados por data (mais recente primeiro)
- [ ] Apenas anúncios com status `ativo` são exibidos publicamente

---

### US-022 — Filtrar classificados por categoria
**Como** Visitante
**Quero** filtrar os classificados por categoria (ex.: Eletrônicos, Imóveis, Veículos, Serviços, Outros)
**Para** encontrar rapidamente o tipo de item que estou procurando

**Critérios de aceite:**
- [ ] Chips de categoria visíveis no topo da lista
- [ ] Filtro atualiza a lista imediatamente
- [ ] Chip "Todos" remove o filtro
- [ ] Chips roláveis horizontalmente em mobile

---

### US-023 — Ver detalhes de um anúncio
**Como** Visitante
**Quero** clicar em um anúncio e ver todas as informações detalhadas
**Para** decidir se tenho interesse e como entrar em contato com o vendedor

**Critérios de aceite:**
- [ ] Tela de detalhe exibe: título, descrição completa, preço, fotos (carrossel se múltiplas), categoria, data de publicação, nome do vendedor
- [ ] Botão de contato via WhatsApp exibido se vendedor informou o número
- [ ] Botão de compartilhamento nativo disponível
- [ ] Botão "Tenho interesse" para usuários logados (inicia chat ou abre WhatsApp)
- [ ] Clique registra evento de visualização (`click_events`)

---

### US-024 — Publicar anúncio gratuito
**Como** Morador
**Quero** publicar um anúncio de venda ou troca de um item
**Para** encontrar compradores no próprio bairro sem pagar nada

**Critérios de aceite:**
- [ ] Botão "Publicar anúncio" acessível na tela de classificados
- [ ] Visitante é redirecionado para login antes de prosseguir (Lazy Login)
- [ ] Formulário solicita: título (obrigatório), descrição (obrigatório), preço ou "Sob consulta", categoria (obrigatório), até 3 fotos (opcional), WhatsApp de contato (opcional)
- [ ] Anúncio criado com status `pendente` por padrão
- [ ] Após aprovação pelo Admin, o anúncio fica público com status `ativo`
- [ ] Morador recebe notificação in-app quando anúncio é aprovado ou rejeitado
- [ ] Cada morador pode ter até 5 anúncios ativos simultaneamente (limite da fase inicial)

**Notas:** C2C é totalmente gratuito para moradores. Não há planos para classificados pessoais.

---

### US-025 — Gerenciar meus anúncios
**Como** Morador
**Quero** ver e gerenciar os anúncios que publiquei
**Para** marcar como vendido, editar informações ou remover anúncios antigos

**Critérios de aceite:**
- [ ] Seção "Meus Anúncios" acessível no Perfil do usuário
- [ ] Lista exibe todos os anúncios do usuário com status (pendente, ativo, vendido, rejeitado, expirado)
- [ ] Botão "Editar" permite alterar título, descrição, preço e fotos
- [ ] Edições em anúncios já ativos não necessitam de nova aprovação (para campos não sensíveis)
- [ ] Botão "Marcar como vendido" muda status para `vendido` e remove da listagem pública
- [ ] Botão "Remover" exclui o anúncio permanentemente após confirmação

---

### US-026 — Denunciar anúncio suspeito
**Como** Morador
**Quero** denunciar um anúncio que parece fraudulento ou inadequado
**Para** proteger a comunidade de golpes e conteúdo impróprio

**Critérios de aceite:**
- [ ] Opção "Denunciar" disponível no card de detalhe do anúncio (requer login)
- [ ] Modal de denúncia oferece motivos pré-definidos: Fraude/golpe, Conteúdo inapropriado, Anúncio duplicado, Preço abusivo, Outro
- [ ] Campo de texto livre para detalhes adicionais (opcional)
- [ ] Denúncia enviada cria ticket no Admin Panel com tipo `denuncia_classificado`
- [ ] Anúncio com 3 ou mais denúncias é automaticamente pausado (`status: 'em_revisao'`) até avaliação do Admin
- [ ] Denunciante recebe confirmação de recebimento por notificação

---

### US-027 — Expiração automática de anúncios
**Como** Sistema
**Quero** expirar automaticamente anúncios ativos após 30 dias
**Para** manter a listagem sempre atualizada e relevante

**Critérios de aceite:**
- [ ] Anúncios com `status: 'ativo'` expiram automaticamente 30 dias após a aprovação
- [ ] Anúncio expirado muda para `status: 'expirado'` e sai da listagem pública
- [ ] Vendedor recebe notificação in-app 3 dias antes da expiração: "Seu anúncio expira em 3 dias — renove ou remova."
- [ ] Botão "Renovar por mais 30 dias" disponível em "Meus Anúncios" para anúncios expirados
- [ ] Renovação resubmete o anúncio para aprovação

---

### US-028 — Buscar classificados por palavra-chave
**Como** Visitante
**Quero** pesquisar itens nos classificados por nome ou descrição
**Para** encontrar um item específico sem navegar por toda a lista

**Critérios de aceite:**
- [ ] Campo de busca no topo da tela de classificados
- [ ] Filtro em tempo real (debounce 300ms) sobre título e descrição dos anúncios
- [ ] Ao não encontrar resultados, exibe: "Nenhum anúncio encontrado para '[termo]'."
- [ ] Limpar campo restaura lista completa

---

## Módulo 4 — Ação Social / Campanhas

### US-029 — Ver campanhas sociais ativas
**Como** Visitante
**Quero** ver as campanhas sociais e de solidariedade em andamento no bairro
**Para** encontrar formas de ajudar ou participar da comunidade

**Critérios de aceite:**
- [ ] Lista de campanhas acessível sem login
- [ ] Cada card exibe: título, descrição resumida, tipo (arrecadação, voluntariado, doação), status, data limite (se houver)
- [ ] Apenas campanhas com `status: 'ativa'` são exibidas publicamente
- [ ] Botão de compartilhamento via WhatsApp em cada card

---

### US-030 — Solicitar abertura de campanha social (Morador)
**Como** Morador
**Quero** solicitar à equipe do Tem No Bairro a abertura de uma campanha social
**Para** mobilizar os vizinhos em torno de uma causa importante para o bairro

**Critérios de aceite:**
- [ ] Formulário de solicitação de campanha acessível no módulo Ação Social (requer login)
- [ ] Campos obrigatórios: título, descrição da causa, tipo de campanha, meta (opcional), data limite (opcional)
- [ ] Solicitação criada com status `pendente_aprovacao`
- [ ] Admin recebe notificação de nova solicitação no painel
- [ ] Solicitante recebe notificação quando campanha é aprovada ou rejeitada com motivo
- [ ] Apenas equipe interna (Admin/Master) pode aprovar e publicar campanhas

**Notas:** Moradores solicitam; equipe aprova — nenhuma campanha vai a público sem revisão humana.

---

### US-031 — Aprovar e publicar campanha (Admin)
**Como** Admin
**Quero** revisar, aprovar e publicar campanhas sociais solicitadas por moradores
**Para** garantir que apenas campanhas legítimas e seguras sejam exibidas na plataforma

**Critérios de aceite:**
- [ ] Lista de campanhas pendentes disponível no Admin Panel → aba Approvals
- [ ] Admin pode visualizar todos os detalhes antes de aprovar
- [ ] Ao aprovar, campanha muda para `status: 'ativa'` e aparece no feed público
- [ ] Ao rejeitar, Admin informa motivo e campanha muda para `status: 'rejeitada'`
- [ ] Solicitante é notificado em ambos os casos

---

### US-032 — Encerrar uma campanha
**Como** Admin
**Quero** encerrar uma campanha ativa quando a meta for atingida ou o prazo expirar
**Para** manter o módulo atualizado e dar visibilidade às conquistas da comunidade

**Critérios de aceite:**
- [ ] Botão "Encerrar campanha" disponível no Admin Panel para campanhas ativas
- [ ] Ao encerrar, Admin pode adicionar mensagem de resultado: "Arrecadamos X kg de alimentos!"
- [ ] Campanha encerrada muda para `status: 'encerrada'` e é movida para seção de histórico
- [ ] Histórico de campanhas encerradas disponível publicamente no módulo Ação Social

---

### US-033 — Criar campanha de desconto (Comerciante — planos Básico e superiores)
**Como** Comerciante (plano Básico ou superior)
**Quero** criar uma campanha de desconto para divulgar uma oferta especial
**Para** atrair mais clientes para o meu estabelecimento

**Critérios de aceite:**
- [ ] Opção "Nova Campanha" disponível no Painel do Comerciante
- [ ] Campos: título, descrição, percentual ou valor do desconto, data de início, data de fim
- [ ] Plano Básico: limite de 1 campanha ativa por mês
- [ ] Plano Profissional: limite de 3 campanhas ativas por mês
- [ ] Plano Premium e Gold: campanhas ilimitadas
- [ ] Campanha criada com status `pendente` e passa por aprovação do Admin
- [ ] Após aprovação, campanha aparece no card de detalhe do comércio com badge de oferta
- [ ] Campanha expira automaticamente na data de fim definida

---

### US-034 — Ver campanhas de desconto de um comércio
**Como** Visitante
**Quero** ver se um comércio tem promoções ou campanhas ativas
**Para** aproveitar descontos ao comprar localmente

**Critérios de aceite:**
- [ ] Badge "Promoção" visível no card do comércio quando há campanha ativa
- [ ] Na tela de detalhe, seção "Ofertas" lista as campanhas ativas com título, desconto e validade
- [ ] Campanhas expiradas não aparecem nesta seção
- [ ] Botão de compartilhamento disponível para campanhas de desconto

---

## Módulo 5 — Utilidade Pública

### US-035 — Ver informações de utilidade pública
**Como** Visitante
**Quero** acessar informações úteis sobre o bairro (telefones de emergência, pontos de saúde, linhas de ônibus, coleta de lixo, etc.)
**Para** ter acesso rápido a serviços essenciais sem precisar pesquisar em outros lugares

**Critérios de aceite:**
- [ ] Seção de Utilidade Pública acessível sem login
- [ ] Informações organizadas por categorias: Emergência, Saúde, Transporte, Serviços Municipais
- [ ] Cada item exibe: nome do serviço, telefone (clicável, dispara discador), endereço (se aplicável), horário
- [ ] Conteúdo cacheado offline pelo Service Worker
- [ ] Última atualização exibida em cada seção

---

### US-036 — Reportar problema público (Morador)
**Como** Morador
**Quero** reportar um problema de infraestrutura ou serviço público no bairro (buraco, lâmpada queimada, etc.)
**Para** ajudar a comunidade e pressionar o poder público por melhorias

**Critérios de aceite:**
- [ ] Formulário de reporte acessível no módulo Utilidade Pública (requer login)
- [ ] Campos: tipo do problema (lista pré-definida), descrição, foto opcional, localização (texto livre)
- [ ] Reporte enviado cria registro no Admin Panel como ticket de tipo `problema_publico`
- [ ] Morador recebe confirmação e pode acompanhar status do reporte
- [ ] Admin pode atualizar status: Recebido → Em análise → Encaminhado → Resolvido
- [ ] Morador é notificado a cada mudança de status

---

### US-037 — Ver reportes de problemas públicos ativos
**Como** Visitante
**Quero** ver um mapa ou lista de problemas públicos reportados no bairro
**Para** saber se minha rua já foi reportada e acompanhar o status das ocorrências

**Critérios de aceite:**
- [ ] Lista de reportes públicos disponível no módulo (sem login)
- [ ] Cada reporte exibe: tipo, descrição resumida, localização, status atual, data
- [ ] Reportes resolvidos aparecem com indicação visual diferente
- [ ] Botão "Confirmar ocorrência" permite que outros moradores sinalizem que também vivenciam o problema (requer login, Lazy Login)

---

## Módulo 6 — História do Bairro

### US-038 — Ler artigos sobre a história do bairro
**Como** Visitante
**Quero** ler conteúdos sobre a história, cultura e memória do Parque Interlagos
**Para** conhecer melhor a comunidade onde vivo ou a qual pertenço

**Critérios de aceite:**
- [ ] Feed de artigos históricos acessível sem login
- [ ] Artigos organizados por períodos ou temas (ex.: Fundação, Personagens, Lugares)
- [ ] Cada artigo exibe: título, imagem, período, resumo e leitura estimada
- [ ] Conteúdo cacheado offline
- [ ] Botão de compartilhamento disponível em cada artigo

---

### US-039 — Contribuir com memória histórica (Morador)
**Como** Morador
**Quero** enviar fotos antigas, relatos ou informações sobre a história do bairro
**Para** preservar a memória coletiva da comunidade

**Critérios de aceite:**
- [ ] Formulário de contribuição disponível no módulo (requer login)
- [ ] Campos: título/assunto, texto descritivo, upload de até 5 fotos, período estimado (opcional)
- [ ] Contribuição enviada com status `pendente_revisao`
- [ ] Admin revisa e publica como artigo ou adiciona ao acervo fotográfico
- [ ] Contribuinte é creditado publicamente no conteúdo publicado ("Contribuição de [nome]")
- [ ] Contribuinte notificado quando sua contribuição é publicada

---

### US-040 — Interagir com conteúdo histórico
**Como** Morador
**Quero** curtir e comentar artigos históricos
**Para** expressar conexão com a memória do bairro e enriquecer o conteúdo com contexto adicional

**Critérios de aceite:**
- [ ] Botão de curtir disponível em artigos (requer login, Lazy Login)
- [ ] Contador de curtidas exibido publicamente
- [ ] Campo de comentário disponível (requer login)
- [ ] Comentários passam por moderação antes de aparecer publicamente
- [ ] Máximo de 500 caracteres por comentário

---

## Módulo 7 — Perfil do Usuário

### US-041 — Ver meu perfil
**Como** Morador
**Quero** acessar minha página de perfil
**Para** ver minhas informações, atividade e configurações no Tem No Bairro

**Critérios de aceite:**
- [ ] Aba de perfil acessível no menu de navegação (requer login)
- [ ] Exibe: foto, nome de exibição, data de cadastro, número de anúncios ativos, número de favoritos
- [ ] Seções: Meus Anúncios, Meus Favoritos, Minhas Sugestões, Configurações de conta

---

### US-042 — Editar meu perfil
**Como** Morador
**Quero** atualizar meu nome de exibição e foto de perfil
**Para** manter minhas informações atualizadas e ter uma identidade reconhecível na comunidade

**Critérios de aceite:**
- [ ] Botão "Editar perfil" acessível na tela de perfil
- [ ] Campos editáveis: nome de exibição, foto de perfil (upload)
- [ ] Foto deve ser redimensionada para no máximo 400x400px no cliente antes do upload
- [ ] Nome de exibição com no mínimo 2 e no máximo 40 caracteres
- [ ] Alterações salvas no Supabase (tabela `profiles`) e refletidas imediatamente na interface
- [ ] E-mail e método de login (Google/Magic Link) são exibidos mas não editáveis nesta tela

---

### US-043 — Ver meus favoritos
**Como** Morador
**Quero** acessar minha lista de favoritos (comércios, notícias e anúncios salvos)
**Para** encontrar rapidamente itens que marquei como interessantes

**Critérios de aceite:**
- [ ] Seção "Meus Favoritos" exibe todos os itens salvos agrupados por tipo
- [ ] Cada item exibe thumbnail, título e botão "Ver detalhes"
- [ ] Botão de remover favorito disponível em cada item (ícone de coração preenchido)
- [ ] Se a lista estiver vazia, exibe mensagem motivacional: "Você ainda não salvou nada. Explore o bairro!"

---

### US-044 — Gerenciar notificações
**Como** Morador
**Quero** configurar quais tipos de notificações desejo receber
**Para** controlar o volume de alertas e manter apenas os que são relevantes para mim

**Critérios de aceite:**
- [ ] Tela de configurações de notificações acessível no Perfil → Configurações
- [ ] Toggles para: Novas notícias, Aprovação de anúncios, Novas campanhas, Atualizações de reporte, Promoções de comércios favoritos
- [ ] Preferências salvas no perfil do usuário no Supabase
- [ ] Desativar um tipo de notificação impede a criação de novos registros naquele tipo na tabela `notifications`

---

### US-045 — Excluir minha conta
**Como** Morador
**Quero** solicitar a exclusão da minha conta e de todos os meus dados
**Para** exercer meu direito à privacidade (LGPD)

**Critérios de aceite:**
- [ ] Opção "Excluir minha conta" disponível em Perfil → Configurações
- [ ] Modal de confirmação exibe consequências: "Seus anúncios, favoritos e histórico serão removidos permanentemente."
- [ ] Confirmação requer digitação da palavra "EXCLUIR" para evitar ação acidental
- [ ] Solicitação de exclusão cria ticket no Admin Panel com tipo `exclusao_conta`
- [ ] Conta é desativada imediatamente; exclusão dos dados processada em até 5 dias úteis
- [ ] Usuário recebe e-mail de confirmação da solicitação

---

### US-046 — Ver histórico de atividade
**Como** Morador
**Quero** ver um resumo da minha atividade no Tem No Bairro (anúncios publicados, sugestões enviadas, campanhas apoiadas)
**Para** acompanhar minha participação e contribuição na comunidade

**Critérios de aceite:**
- [ ] Seção "Minha Atividade" disponível no Perfil
- [ ] Lista cronológica das ações: anúncios publicados, avaliações feitas, sugestões enviadas, campanhas apoiadas
- [ ] Cada item da lista tem link para o conteúdo original (se ainda existir)
- [ ] Atividades dos últimos 90 dias; botão "Ver mais" para histórico anterior

---

## Módulo 8 — Painel do Comerciante

### US-047 — Acessar meu painel de gestão
**Como** Comerciante
**Quero** acessar um painel dedicado para gerenciar meu negócio na plataforma
**Para** ter controle sobre minhas informações, campanhas e desempenho em um único lugar

**Critérios de aceite:**
- [ ] Acesso ao Painel do Comerciante disponível no menu principal para usuários com role `comerciante`
- [ ] Dashboard inicial exibe: visualizações do perfil (últimos 30 dias), cliques no WhatsApp, avaliação média e campanhas ativas
- [ ] Métricas básicas disponíveis para todos os planos (incluindo Gratuito)
- [ ] Planos superiores exibem métricas adicionais conforme tabela de planos

---

### US-048 — Editar informações do meu negócio
**Como** Comerciante
**Quero** editar as informações do meu estabelecimento na plataforma
**Para** manter meus dados sempre atualizados para os moradores

**Critérios de aceite:**
- [ ] Botão "Editar negócio" disponível no Painel do Comerciante
- [ ] Campos editáveis: nome, descrição, categoria, endereço, horário de funcionamento, telefone, WhatsApp, Instagram, foto de capa
- [ ] Validação: campos obrigatórios destacados em vermelho se vazios ao salvar
- [ ] Após salvar, alterações são refletidas imediatamente no perfil público
- [ ] Campo WhatsApp só é exibido publicamente para planos Básico e superiores (mesmo que preenchido no Gratuito)

---

### US-049 — Ver métricas de desempenho (plano Básico)
**Como** Comerciante (plano Básico)
**Quero** ver métricas básicas de acesso ao meu perfil
**Para** entender se meu negócio está sendo visto pelos moradores

**Critérios de aceite:**
- [ ] Dashboard exibe: visualizações do perfil (7 e 30 dias), cliques no botão WhatsApp (7 e 30 dias)
- [ ] Dados apresentados em números simples (sem gráficos no plano Básico)
- [ ] Métricas atualizadas diariamente (não em tempo real)
- [ ] Comparativo simples com período anterior: "↑ 15% vs. semana passada"

---

### US-050 — Ver relatórios avançados (plano Premium)
**Como** Comerciante (plano Premium ou Gold)
**Quero** acessar relatórios detalhados de desempenho do meu negócio
**Para** tomar decisões estratégicas baseadas em dados

**Critérios de aceite:**
- [ ] Relatórios exibem: visualizações, cliques no WhatsApp, shares, favoritos e conversões — com gráficos de linha/barra
- [ ] Filtro de período: 7 dias, 30 dias, 90 dias, personalizado
- [ ] Gráfico de origem dos acessos (feed, busca, carrossel, compartilhamento)
- [ ] Exportação de dados em CSV disponível (plano Gold)
- [ ] Comparativo com período anterior destacado em cada métrica

---

### US-051 — Criar e gerenciar campanhas de desconto (Comerciante)
**Como** Comerciante (plano Básico ou superior)
**Quero** criar campanhas de desconto e acompanhar seu desempenho
**Para** atrair mais clientes nos períodos que preciso de mais movimento

**Critérios de aceite:**
- [ ] Seção "Campanhas" disponível no Painel do Comerciante
- [ ] Formulário de criação conforme US-033
- [ ] Lista de campanhas exibe status: rascunho, pendente, ativa, encerrada, rejeitada
- [ ] Botão "Encerrar antecipadamente" para campanhas ativas
- [ ] Botão "Duplicar" para criar nova campanha baseada em uma existente
- [ ] Métricas por campanha: visualizações e cliques no CTA (planos Profissional e superiores)

---

### US-052 — Responder avaliações de clientes (plano Profissional e superior)
**Como** Comerciante (plano Profissional, Premium ou Gold)
**Quero** responder publicamente às avaliações que recebo
**Para** demonstrar atenção ao cliente e gerenciar minha reputação online

**Critérios de aceite:**
- [ ] Botão "Responder" visível em cada avaliação no Painel do Comerciante (apenas para planos elegíveis)
- [ ] Campo de resposta com máximo de 500 caracteres
- [ ] Resposta publicada imediatamente (sem moderação, pois é do proprietário)
- [ ] Resposta exibida publicamente no detalhe do comércio, abaixo da avaliação original
- [ ] Apenas uma resposta por avaliação; opção de editar resposta existente
- [ ] Comerciante com plano Gratuito ou Básico vê o botão "Responder" com tooltip: "Disponível no plano Profissional"

---

### US-053 — Integrar redes sociais ao perfil (plano Premium e Gold)
**Como** Comerciante (plano Premium ou Gold)
**Quero** vincular minhas redes sociais (Instagram, Facebook) ao meu perfil na plataforma
**Para** direcionar clientes para os meus canais e ter presença digital integrada

**Critérios de aceite:**
- [ ] Campos de Instagram e Facebook disponíveis nas configurações do negócio (planos Premium/Gold)
- [ ] Links de redes sociais exibidos no detalhe do comércio como ícones clicáveis
- [ ] Validação: aceitar apenas URLs válidas das respectivas redes
- [ ] Para planos inferiores, os campos aparecem bloqueados com upgrade call-to-action

---

### US-054 — Receber notificação de nova avaliação
**Como** Comerciante
**Quero** ser notificado sempre que meu negócio receber uma nova avaliação
**Para** reagir rapidamente e acompanhar minha reputação em tempo real

**Critérios de aceite:**
- [ ] Notificação in-app criada ao publicar nova avaliação no comércio
- [ ] Notificação exibe: nome do avaliador, nota e prévia do comentário
- [ ] Clicar na notificação abre a avaliação no Painel do Comerciante
- [ ] Contagem de notificações não lidas visível no badge do sino no menu

---

## Módulo 9 — Autenticação

### US-055 — Fazer login com Google
**Como** Visitante
**Quero** entrar na plataforma usando minha conta do Google
**Para** não precisar criar e memorizar uma nova senha

**Critérios de aceite:**
- [ ] Botão "Entrar com Google" disponível no modal de login
- [ ] Fluxo OAuth via Supabase Auth (Google Provider)
- [ ] Após autenticação, usuário é redirecionado para a tela de onde partiu (Lazy Login)
- [ ] Na primeira entrada, perfil é criado automaticamente na tabela `profiles` com role `morador`
- [ ] Nome e foto do Google são usados como `display_name` e `photo_url` iniciais
- [ ] Sessão persistida; usuário não precisa logar novamente ao reabrir o PWA

---

### US-056 — Fazer login com Magic Link (e-mail)
**Como** Visitante
**Quero** entrar na plataforma recebendo um link mágico no meu e-mail
**Para** ter uma alternativa de login sem senha e sem precisar de conta Google

**Critérios de aceite:**
- [ ] Campo de e-mail e botão "Enviar link de acesso" disponíveis no modal de login
- [ ] E-mail com Magic Link enviado em até 60 segundos
- [ ] Link tem validade de 1 hora
- [ ] Ao clicar no link, usuário é autenticado e redirecionado para a plataforma
- [ ] Na primeira entrada, perfil é criado automaticamente (`profiles`) com role `morador`
- [ ] Mensagem de feedback exibida ao usuário após envio: "Verifique seu e-mail e clique no link enviado"

---

### US-057 — Fazer logout
**Como** Morador
**Quero** sair da minha conta na plataforma
**Para** proteger minha privacidade em dispositivos compartilhados

**Critérios de aceite:**
- [ ] Opção "Sair" disponível no menu de perfil
- [ ] Sessão encerrada via `supabase.auth.signOut()`
- [ ] Cache local da sessão limpo após logout
- [ ] Usuário redirecionado para a tela principal como visitante
- [ ] Conteúdo público (feed, comércios, notícias) permanece visível após logout

---

### US-058 — Aplicar Lazy Login ao interagir com conteúdo
**Como** Visitante
**Quero** clicar em ações que requerem login (curtir, comentar, favoritar) sem ser interrompido bruscamente
**Para** ter uma experiência fluida que respeita minha decisão de criar conta

**Critérios de aceite:**
- [ ] Ao clicar em ação protegida (favoritar, avaliar, comentar, publicar), modal de login é exibido com contexto: "Para [ação], entre com sua conta"
- [ ] Após login bem-sucedido, a ação original é executada automaticamente
- [ ] Modal de login pode ser fechado sem forçar cadastro
- [ ] Nenhum conteúdo é ocultado para visitantes — bloqueio só ocorre em ações de escrita

---

### US-059 — Recuperar acesso à conta
**Como** Morador
**Quero** recuperar acesso à minha conta se não consigo mais receber o Magic Link ou acessar o Google
**Para** não perder meu histórico e perfil na plataforma

**Critérios de aceite:**
- [ ] Opção "Problemas para acessar?" no modal de login
- [ ] Direciona para formulário de suporte via WhatsApp ou e-mail da equipe
- [ ] Instrução clara: "Entre em contato informando seu nome e e-mail cadastrado"
- [ ] Equipe pode vincular nova conta ao perfil existente via Admin Panel

---

### US-060 — Proteção de rotas administrativas
**Como** Sistema
**Quero** garantir que apenas usuários com role `admin` ou `master` acessem o painel administrativo
**Para** proteger a integridade e segurança dos dados da plataforma

**Critérios de aceite:**
- [ ] Acesso ao Admin Panel redireciona para login se usuário não está autenticado
- [ ] Após login, se role não é `admin` ou `master`, redireciona para tela principal com mensagem de erro
- [ ] Verificação de role feita no frontend (via `authStore`) E no backend (RLS Supabase)
- [ ] Tentativas de acesso não autorizado são registradas na tabela de auditoria

---

## Módulo 10 — Admin Panel

### US-061 — Acessar o painel administrativo
**Como** Admin
**Quero** acessar um painel centralizado de gestão da plataforma
**Para** gerenciar todos os módulos e garantir a qualidade do conteúdo publicado

**Critérios de aceite:**
- [ ] Painel acessível via rota protegida por role `admin` ou `master`
- [ ] Menu de abas exibe: Aprovações, Comércios, Notícias, Campanhas, Usuários, Tickets, Auditoria
- [ ] Cada aba exibe contador de itens pendentes/ativos no badge
- [ ] Interface responsiva para uso em tablet e desktop

---

### US-062 — Gerenciar fila de aprovações
**Como** Admin
**Quero** ver e processar todos os itens pendentes de aprovação em uma única tela
**Para** agilizar a moderação e manter o conteúdo atualizado

**Critérios de aceite:**
- [ ] Aba "Aprovações" lista todos os itens pendentes: novos comércios, avaliações, anúncios, campanhas
- [ ] Cada item exibe tipo, título, solicitante e data de criação
- [ ] Botões "Aprovar" e "Rejeitar" disponíveis em cada item
- [ ] Ao rejeitar, Admin deve informar motivo (campo obrigatório)
- [ ] Ação registrada em log de auditoria com Admin responsável, timestamp e decisão
- [ ] Item processado sai da fila e o solicitante recebe notificação

---

### US-063 — Gerenciar comércios cadastrados
**Como** Admin
**Quero** visualizar, editar e desativar comércios cadastrados na plataforma
**Para** garantir a qualidade e precisão das informações exibidas aos moradores

**Critérios de aceite:**
- [ ] Aba "Comércios" lista todos os comércios com filtros: status (ativo, inativo, pendente), plano, categoria
- [ ] Admin pode editar qualquer campo do comércio diretamente no painel
- [ ] Admin pode ativar/desativar um comércio (`is_active: true/false`)
- [ ] Comércio desativado sai da listagem pública imediatamente
- [ ] Admin pode alterar o plano de um comerciante manualmente (reflete acesso a funcionalidades)
- [ ] Histórico de alterações registrado para auditoria

---

### US-064 — Gerenciar notícias
**Como** Admin
**Quero** criar, editar, publicar e arquivar notícias no jornal local
**Para** manter o feed de notícias atualizado e relevante para a comunidade

**Critérios de aceite:**
- [ ] Aba "Notícias" lista todas as notícias com filtros: status (rascunho, publicado, arquivado), categoria
- [ ] Botão "Nova Notícia" abre formulário de criação
- [ ] Formulário: título, categoria, corpo (editor de texto simples), imagem de capa, status
- [ ] Salvar como rascunho não publica; botão separado "Publicar" muda status
- [ ] Publicação registra `published_at: now()` e `author_id: admin_id`
- [ ] Arquivar remove do feed público sem excluir do banco

---

### US-065 — Gerenciar usuários
**Como** Admin
**Quero** visualizar a lista de usuários cadastrados e gerenciar seus dados e permissões
**Para** ter controle sobre quem usa a plataforma e resolver problemas de acesso

**Critérios de aceite:**
- [ ] Aba "Usuários" exibe lista paginada com: nome, e-mail, role, data de cadastro, status
- [ ] Filtros por role (visitante, morador, comerciante, admin) e status (ativo, suspenso)
- [ ] Admin pode suspender um usuário (bloqueia login e oculta conteúdo público)
- [ ] Admin pode alterar role de um usuário (ex.: promover morador a comerciante)
- [ ] Master pode promover usuário a Admin
- [ ] Ações registradas em auditoria

---

### US-066 — Gerenciar tickets de suporte
**Como** Admin
**Quero** visualizar e responder tickets abertos por moradores e comerciantes
**Para** resolver problemas e dúvidas com agilidade

**Critérios de aceite:**
- [ ] Aba "Tickets" lista todos os tickets com: assunto, tipo, solicitante, data, status (aberto, em_atendimento, resolvido)
- [ ] Filtros por tipo (suporte, sugestao_pauta, denuncia, problema_publico, exclusao_conta) e status
- [ ] Admin pode clicar em um ticket para ver detalhes e histórico de mensagens
- [ ] Admin pode responder ao solicitante via campo de resposta (resposta salva no ticket)
- [ ] Admin pode escalar ticket para outro Admin ou para Master (EscalationDialog)
- [ ] Ao marcar como resolvido, solicitante é notificado in-app

---

### US-067 — Acessar log de auditoria
**Como** Admin
**Quero** visualizar o histórico de todas as ações administrativas realizadas na plataforma
**Para** ter rastreabilidade, transparência e detectar uso indevido de permissões

**Critérios de aceite:**
- [ ] Aba "Auditoria" exibe log cronológico de ações: quem fez, o quê, quando e sobre qual entidade
- [ ] Filtros por Admin responsável, tipo de ação e período
- [ ] Ações registradas incluem: aprovação/rejeição de conteúdo, edição de comércio, alteração de role, suspensão de usuário, exclusão de conteúdo
- [ ] Log é imutável (apenas leitura); não é possível editar ou excluir registros
- [ ] Exportação do log em CSV disponível para Master

---

### US-068 — Visualizar dashboard de métricas globais
**Como** Admin
**Quero** ver métricas gerais de uso da plataforma
**Para** acompanhar o crescimento e a saúde do produto

**Critérios de aceite:**
- [ ] Dashboard exibe: total de usuários cadastrados, novos usuários (7 e 30 dias), comércios ativos, anúncios ativos, notícias publicadas, tickets abertos
- [ ] Gráfico de crescimento de usuários por semana/mês
- [ ] Métricas de engajamento: visualizações totais, cliques WhatsApp, shares (30 dias)
- [ ] Dados atualizados a cada 24h (não em tempo real na fase inicial)

---

### US-069 — Gerenciar campanhas sociais (Admin)
**Como** Admin
**Quero** revisar, aprovar, publicar e encerrar campanhas sociais solicitadas por moradores
**Para** garantir que apenas campanhas legítimas sejam exibidas e acompanhar sua evolução

**Critérios de aceite:**
- [ ] Aba "Campanhas" exibe todas as campanhas separadas por status
- [ ] Admin pode aprovar (muda para `ativa`) ou rejeitar (com motivo) campanhas pendentes
- [ ] Admin pode editar dados de uma campanha antes de aprovar
- [ ] Admin pode encerrar campanha ativa adicionando mensagem de resultado
- [ ] Histórico completo de campanhas acessível por status

---

### US-070 — Excluir conteúdo denunciado (Admin)
**Como** Admin
**Quero** processar denúncias de conteúdo inadequado (anúncios, comentários) e tomar ações
**Para** manter a plataforma segura e livre de conteúdo prejudicial

**Critérios de aceite:**
- [ ] Denúncias chegam como tickets com tipo `denuncia` no Admin Panel
- [ ] Admin visualiza o conteúdo denunciado diretamente no ticket
- [ ] Opções de ação: Ignorar denúncia (mantém conteúdo), Avisar autor, Remover conteúdo, Suspender autor
- [ ] Todas as ações registradas em auditoria
- [ ] Autor notificado se conteúdo for removido, com motivo
- [ ] Denunciante notificado sobre o desfecho da denúncia

---

### US-071 — Acesso exclusivo Master: gestão avançada
**Como** Master
**Quero** ter acesso a funcionalidades exclusivas de gestão que vão além do Admin padrão
**Para** ter controle total sobre a plataforma e poder corrigir situações críticas

**Critérios de aceite:**
- [ ] Master pode ver e acessar todas as abas do Admin Panel, mais: Database, Configurações Globais
- [ ] Master pode excluir permanentemente qualquer entidade (comércio, usuário, notícia)
- [ ] Master pode promover/revogar role de Admin
- [ ] Master pode exportar dados do log de auditoria em CSV
- [ ] Master pode editar configurações globais da plataforma (textos de boas-vindas, categorias)
- [ ] Ações do Master são registradas em subcategoria especial do log de auditoria

---

### US-072 — Receber alertas de itens críticos (Admin)
**Como** Admin
**Quero** receber notificações in-app quando houver novos itens críticos pendentes
**Para** agir rapidamente em situações que exigem moderação imediata

**Critérios de aceite:**
- [ ] Notificação in-app criada para: novo comércio pendente, nova denúncia, anúncio com 3+ denúncias (pausado automaticamente), novo ticket de exclusão de conta
- [ ] Badge de contagem no ícone de Admin no menu
- [ ] Clique na notificação redireciona para o item específico no Admin Panel
- [ ] Notificações admin não se misturam com notificações do usuário comum

---

## Stories Transversais (Cross-Cutting)

### US-073 — Notificações in-app (Sino)
**Como** Morador
**Quero** visualizar todas as minhas notificações em um único lugar na plataforma
**Para** não perder atualizações importantes sobre minha atividade e o bairro

**Critérios de aceite:**
- [ ] Ícone de sino no header exibe badge numérico para notificações não lidas
- [ ] Clicar no sino abre painel com lista de notificações (mais recentes primeiro)
- [ ] Cada notificação exibe: ícone do tipo, título, corpo resumido e tempo relativo ("há 5 min")
- [ ] Clicar em uma notificação marca como lida e navega para o conteúdo referenciado
- [ ] Botão "Marcar todas como lidas" disponível no topo do painel
- [ ] Notificações persistidas na tabela `notifications`; sincronizadas entre dispositivos

---

### US-074 — Funcionar offline (PWA)
**Como** Morador
**Quero** acessar o conteúdo principal da plataforma mesmo sem conexão com a internet
**Para** usar o Tem No Bairro em áreas com sinal ruim ou sem dados móveis

**Critérios de aceite:**
- [ ] Service Worker cacheado na instalação do PWA
- [ ] Feed de comércios e notícias servido do cache quando offline
- [ ] Banner informativo exibido quando detectada ausência de conexão: "Você está offline. Exibindo conteúdo salvo."
- [ ] Ações de escrita (publicar, avaliar, curtir) ficam bloqueadas offline com mensagem explicativa
- [ ] Ao reconectar, conteúdo é sincronizado automaticamente

---

### US-075 — Instalar o PWA no celular
**Como** Visitante frequente
**Quero** instalar o Tem No Bairro na tela inicial do meu celular
**Para** acessar a plataforma como se fosse um aplicativo nativo, sem precisar abrir o navegador

**Critérios de aceite:**
- [ ] Banner de instalação do PWA exibido após 3ª visita ou após 2 minutos de uso
- [ ] Banner pode ser dispensado ("Agora não") sem que reapareça por 7 dias
- [ ] Ao instalar, ícone do Tem No Bairro aparece na tela inicial
- [ ] PWA instalado abre em modo standalone (sem barra de endereço do navegador)
- [ ] Splash screen com logo exibido na abertura do app instalado

---

### US-076 — Compartilhamento nativo universal
**Como** Visitante
**Quero** compartilhar qualquer conteúdo da plataforma diretamente pelo menu de share do celular
**Para** divulgar o Tem No Bairro e seu conteúdo para amigos e grupos de WhatsApp

**Critérios de aceite:**
- [ ] Botão de share presente em: cards de comércio, notícias, classificados e campanhas
- [ ] Usa `navigator.share` com título, texto e URL canônica do item
- [ ] Fallback: se `navigator.share` indisponível (desktop), copia URL para clipboard com toast de confirmação
- [ ] Texto de compartilhamento inclui sempre o nome "Tem No Bairro" para reforçar marca

---

### US-077 — Responsividade e acessibilidade básica
**Como** Visitante em dispositivo móvel
**Quero** usar a plataforma confortavelmente no celular sem precisar dar zoom
**Para** ter uma experiência fluida no principal dispositivo de acesso da comunidade

**Critérios de aceite:**
- [ ] Todos os componentes projetados Mobile-First (375px como breakpoint base)
- [ ] Áreas de toque com no mínimo 44x44px (WCAG AA)
- [ ] Texto legível sem zoom (mínimo 14px body, 16px inputs para evitar zoom automático no iOS)
- [ ] Contraste de texto/fundo mínimo 4.5:1 (WCAG AA)
- [ ] Navegação por teclado funcional nos modais (foco retorna ao elemento de origem ao fechar)

---

### US-078 — Chatbot de assistência ao usuário
**Como** Visitante
**Quero** interagir com um assistente virtual para tirar dúvidas sobre o bairro e a plataforma
**Para** obter respostas rápidas sem precisar contatar a equipe humana

**Critérios de aceite:**
- [ ] Widget de chatbot disponível em todas as telas (ícone flutuante no canto inferior direito)
- [ ] Chatbot responde perguntas sobre: como cadastrar negócio, como publicar anúncio, telefones de emergência, funcionamento da plataforma
- [ ] Histórico da conversa mantido durante a sessão
- [ ] Se chatbot não souber responder, oferece opção de abrir ticket de suporte
- [ ] Widget não bloqueia conteúdo principal em mobile (posicionado acima da navbar)

---

### US-079 — Performance e carregamento rápido
**Como** Visitante com conexão 4G lento
**Quero** que a plataforma carregue rapidamente mesmo com internet ruim
**Para** ter uma experiência utilizável sem frustração

**Critérios de aceite:**
- [ ] LCP (Largest Contentful Paint) < 2,5 segundos em 4G lento (simulado via DevTools)
- [ ] Imagens carregadas com `loading="lazy"` e redimensionadas adequadamente
- [ ] Chunks de JavaScript separados por feature (code splitting via Vite)
- [ ] Bundle de vendor (React, etc.) cacheado separadamente dos chunks de feature
- [ ] Fontes carregadas com `font-display: swap`

---

### US-080 — Sugestões comunitárias (Módulo Comunidade)
**Como** Morador
**Quero** enviar sugestões de melhorias para o bairro e votar nas sugestões de outros moradores
**Para** contribuir com a comunidade e priorizar coletivamente as demandas locais

**Critérios de aceite:**
- [ ] Formulário de sugestão acessível no módulo Comunidade (requer login, Lazy Login)
- [ ] Campos: título, descrição, categoria da sugestão
- [ ] Cada morador pode votar (upvote) em cada sugestão uma única vez
- [ ] Visitante que tenta votar vê o modal de login
- [ ] Lista de sugestões ordenável por: mais recentes, mais votadas
- [ ] Sugestão com status `aprovada` exibe badge de destaque
- [ ] Admin pode atualizar status: pendente → em_analise → aprovada → implementada

---

*Documento gerado em Março/2026. Total de User Stories: 80.*
*Próxima revisão prevista: após sprint de validação (Abril/2026).*
