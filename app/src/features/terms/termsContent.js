// ============================================================
// Hub central de conteúdo legal da plataforma Tem No Bairro
// Todos os módulos de termos, privacidade e conduta
// apontam para este arquivo como única fonte de verdade.
// ============================================================

export const TERMS_VERSION = 'platform_terms_v1';
export const TERMS_DATE    = 'Abril de 2026';

export const PLATFORM_INFO = {
  name:       'Tem No Bairro',
  domain:     'temnobairro.online',
  developer:  'Grupo Plena Informática',
  cnpj:       '17.347.919/000-59',
  devSite:    'https://www.plenainformatica.com.br',
  devEmail:   'tecnologia@plenainformatica.com.br',
  support:    'contato@temnobairro.online',
  year:       '2026',
};

export const TERMS_ARTICLES = [
  {
    title: 'Art. 1 — Identificação da Plataforma',
    body: '"Tem No Bairro" é uma plataforma digital comunitária operada pelo Grupo Plena Informática (CNPJ 17.347.919/000-59), com sede em São José dos Campos - SP. A plataforma tem por objetivo conectar moradores, comerciantes e prestadores de serviço em nível hiperlocal, promovendo a economia e a comunicação comunitária de bairros brasileiros. Domínio oficial: temnobairro.online. Suporte: contato@temnobairro.online.',
  },
  {
    title: 'Art. 2 — Aceitação dos Termos',
    body: 'O acesso ou uso da plataforma, mesmo sem cadastro, implica leitura e aceitação integral destes Termos. O usuário que não concordar deverá cessar o uso imediatamente. Para funcionalidades interativas (publicações, comentários, votações), o aceite formal é registrado no banco de dados com timestamp imutável para fins de auditoria LGPD.',
  },
  {
    title: 'Art. 3 — Cadastro, Autenticação e Responsabilidade de Conta',
    body: 'O cadastro é realizado via Google OAuth ou código OTP por e-mail, garantindo autenticação de dois fatores. O usuário é integralmente responsável por: (a) veracidade das informações fornecidas; (b) segurança de sua senha e sessão; (c) atividades realizadas em sua conta. Contas falsas, duplicadas ou criadas para fins ilícitos serão suspensas sem aviso.',
  },
  {
    title: 'Art. 4 — Uso Permitido e Finalidade da Plataforma',
    body: 'A plataforma é destinada exclusivamente a: publicação de classificados de bens e serviços legais; divulgação de comércios e prestadores de serviço locais; compartilhamento de notícias verídicas de interesse comunitário; campanhas solidárias e de arrecadação legítimas; participação cívica via enquetes e sugestões ao poder público.',
  },
  {
    title: 'Art. 5 — Condutas Proibidas e Conteúdo Vedado',
    body: 'É expressamente vedado: (a) publicar informações falsas, difamatórias ou enganosas; (b) incitar ódio, discriminação por raça, gênero, religião, orientação sexual ou qualquer outra condição protegida; (c) praticar spam, phishing ou distribuir malware; (d) divulgar dados pessoais de terceiros sem consentimento expresso; (e) realizar golpes, fraudes ou negociações ilegais; (f) infringir direitos autorais ou de imagem; (g) usar bots ou automações não autorizadas. Violações sujeitam o usuário a suspensão imediata, exclusão de conta e, em casos graves, comunicação às autoridades competentes.',
  },
  {
    title: 'Art. 6 — Moderação, Suspensão e Apelação',
    body: 'A equipe de moderação reserva-se o direito de remover qualquer conteúdo e suspender contas que violem estes termos. Em casos graves (crimes, ameaças, exploração infantil), a suspensão é imediata e definitiva. Para infrações menores, o usuário recebe notificação e pode apresentar recurso via canal de suporte em até 15 dias.',
  },
  {
    title: 'Art. 7 — Responsabilidade pelo Conteúdo Publicado',
    body: 'Todo conteúdo publicado é de exclusiva responsabilidade do autor. A plataforma atua como intermediária e não endossa, verifica ou se responsabiliza por informações de terceiros. Anúncios de produtos e serviços são de responsabilidade do anunciante. Negociações realizadas entre usuários são relações autônomas, sem participação ou garantia da plataforma.',
  },
  {
    title: 'Art. 8 — Política de Privacidade e Proteção de Dados (LGPD — Lei 13.709/2018)',
    body: 'Em conformidade com a LGPD, os dados pessoais coletados (nome, e-mail, bairro, foto de perfil, telefone opcional) são tratados com base legal de consentimento (Art. 7, I) e execução de contrato (Art. 7, V). As finalidades são exclusivas à operação da plataforma: autenticação, personalização da experiência e comunicações sobre o bairro. Nenhum dado é vendido a terceiros. Dados são armazenados na infraestrutura Supabase (PostgreSQL criptografado, datacenter no Brasil). O período de retenção é de até 5 anos após encerramento da conta ou conforme exigência legal.',
  },
  {
    title: 'Art. 9 — Direitos do Titular de Dados (Art. 18 LGPD)',
    body: 'O usuário tem garantidos os seguintes direitos, exercíveis via suporte: (a) Confirmação da existência de tratamento; (b) Acesso aos dados armazenados; (c) Correção de dados incompletos, inexatos ou desatualizados; (d) Anonimização, bloqueio ou eliminação de dados desnecessários; (e) Portabilidade para outro fornecedor de serviço; (f) Exclusão dos dados tratados com consentimento; (g) Informação sobre compartilhamento com terceiros; (h) Revogação do consentimento a qualquer tempo. Solicitações via: contato@temnobairro.online. Prazo de resposta: 15 dias úteis.',
  },
  {
    title: 'Art. 10 — Cookies, Armazenamento Local e Tecnologia',
    body: 'A plataforma utiliza: (a) localStorage e sessionStorage para manutenção de sessão autenticada e preferências de interface (sem expiração de dados sensíveis em texto plano); (b) Supabase Auth JWT para tokens de sessão seguros com renovação automática; (c) Service Workers (PWA) para cache de recursos estáticos visando funcionamento offline — nenhum dado pessoal é cacheado pelo Service Worker. Não utilizamos cookies de rastreamento comportamental, pixels de conversão de terceiros ou qualquer tecnologia de publicidade programática.',
  },
  {
    title: 'Art. 11 — Propriedade Intelectual',
    body: 'A marca "Tem No Bairro", o logotipo, o design da interface, o código-fonte e a arquitetura da plataforma são propriedade intelectual do Grupo Plena Informática, protegidos pela Lei 9.279/96 e legislação de direitos autorais. É vedada a reprodução, cópia ou distribuição sem autorização escrita. O conteúdo publicado pelos usuários (textos, fotos) permanece de propriedade do autor, que concede licença não exclusiva e gratuita à plataforma para exibição no contexto comunitário.',
  },
  {
    title: 'Art. 12 — Limitação de Responsabilidade',
    body: 'A plataforma não se responsabiliza por: (a) danos decorrentes de negociações entre usuários; (b) indisponibilidade temporária por manutenção ou falhas técnicas; (c) conteúdo publicado por terceiros; (d) prejuízos decorrentes de uso indevido ou compartilhamento de credenciais pelo próprio usuário. A responsabilidade da plataforma limita-se ao valor eventualmente pago pelo usuário nos últimos 12 meses.',
  },
  {
    title: 'Art. 13 — Foro e Legislação Aplicável',
    body: 'Estes Termos são regidos pelas leis brasileiras. Eventuais litígios serão submetidos ao foro da Comarca de São José dos Campos - SP, com renúncia a qualquer outro por mais privilegiado que seja, salvo nos casos em que a legislação consumerista (CDC — Lei 8.078/90) estabeleça foro do domicílio do consumidor.',
  },
  {
    title: 'Art. 14 — Vigência, Atualizações e Versionamento',
    body: 'Estes Termos entram em vigor na data de aceite e têm vigência indeterminada. Atualizações serão comunicadas com antecedência mínima de 15 dias via notificação in-app e e-mail. O uso contínuo após a vigência da nova versão implica aceite tácito. O histórico de versões é mantido internamente para fins de auditoria LGPD.',
  },
];

export const PRIVACY_SECTIONS = [
  {
    id: 'collect',
    title: 'O que coletamos',
    icon: 'database',
    items: [
      'Nome de exibição e nome completo (opcional)',
      'Endereço de e-mail (via Google OAuth ou digitado)',
      'Foto de perfil (via Google ou upload manual)',
      'Bairro de residência (selecionado no onboarding)',
      'Telefone pessoal (opcional — apenas para verificação de perfil)',
      'Conteúdo publicado: anúncios, notícias, sugestões, comentários',
      'Dados de navegação: timestamps de acesso e IP (via Supabase Auth)',
    ],
  },
  {
    id: 'use',
    title: 'Como usamos seus dados',
    icon: 'settings',
    items: [
      'Autenticação e controle de acesso à conta',
      'Personalização da experiência por bairro',
      'Exibição de conteúdo relevante para sua região',
      'Envio de notificações sobre atividade comunitária',
      'Moderação de conteúdo e prevenção de abusos',
      'Conformidade com obrigações legais (LGPD, Marco Civil)',
    ],
  },
  {
    id: 'share',
    title: 'Com quem compartilhamos',
    icon: 'share2',
    items: [
      'Supabase (infraestrutura de banco de dados e autenticação — datacenter BR)',
      'Google (somente para autenticação OAuth — não recebe conteúdo da plataforma)',
      'Autoridades competentes quando exigido por lei ou ordem judicial',
      'NUNCA: anunciantes, empresas de marketing, brokers de dados ou terceiros comerciais',
    ],
  },
  {
    id: 'security',
    title: 'Como protegemos seus dados',
    icon: 'shield',
    items: [
      'Criptografia em trânsito: TLS 1.3 em todas as conexões',
      'Criptografia em repouso: PostgreSQL com RLS (Row Level Security)',
      'Tokens de sessão JWT com expiração automática',
      'Acesso ao banco restrito por políticas RLS — cada usuário vê apenas seus dados',
      'Senhas nunca armazenadas — autenticação delegada ao Supabase Auth',
      'Backups diários criptografados retidos por 30 dias',
    ],
  },
];

export const CONDUCT_RULES = [
  {
    level: 'critical',
    color: 'red',
    title: 'Infrações Gravíssimas (Banimento Imediato)',
    rules: [
      'Conteúdo de abuso ou exploração sexual infantil (CSAM)',
      'Ameaças de morte, violência física ou terrorismo',
      'Fraudes financeiras, golpes ou pirâmides',
      'Distribuição de malware ou phishing',
      'Doxxing — exposição de dados pessoais de terceiros sem consentimento',
    ],
  },
  {
    level: 'severe',
    color: 'orange',
    title: 'Infrações Graves (Suspensão + Recurso)',
    rules: [
      'Discurso de ódio ou discriminação de qualquer natureza',
      'Desinformação deliberada com impacto à saúde ou segurança pública',
      'Spam sistemático ou automação não autorizada',
      'Personificação de outras pessoas ou empresas',
      'Comercialização de produtos ilegais ou proibidos',
    ],
  },
  {
    level: 'moderate',
    color: 'amber',
    title: 'Infrações Moderadas (Aviso + Remoção de Conteúdo)',
    rules: [
      'Anúncios duplicados ou com informações enganosas',
      'Promoção excessiva fora do contexto da comunidade',
      'Conteúdo não relacionado ao bairro ou à comunidade local',
      'Discussões que fujam do respeito entre usuários',
    ],
  },
];
