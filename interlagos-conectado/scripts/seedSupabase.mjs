/**
 * seedSupabase.mjs — Seed de dados de demonstração para o Supabase
 * Bairro: Parque Interlagos, São José dos Campos - SP
 *
 * Como usar:
 *   node scripts/seedSupabase.mjs
 *
 * IMPORTANTE: Para contornar o RLS (Row Level Security) nas tabelas,
 * adicione a chave de serviço no .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=<chave do painel Supabase > Settings > API>
 * Sem ela, o seed usará a anon key e pode falhar se o RLS estiver ativo.
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Lê .env.local ────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env.local');

const env = {};
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)[ \t]*=[ \t]*(.+)/);
  if (m) env[m[1]] = m[2].trim();
}

const supabaseUrl  = env.VITE_SUPABASE_URL;
const supabaseKey  = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env.local');
  process.exit(1);
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY não encontrada. Usando anon key.');
  console.warn('   Se o seed falhar com erro de permissão, adicione a service_role key no .env.local.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Dados de Comércios — Parque Interlagos, SJC ─────────────────────────────
const MERCHANTS = [
  {
    name: 'Padaria Pão & Arte',
    category: 'Alimentação',
    description: 'Padaria artesanal com pães frescos, bolos e salgados feitos na hora. O café da manhã mais gostoso do Parque Interlagos, com croissants, brioches e o famoso pão de queijo mineiro.',
    phone: '12991110001',
    whatsapp: '12991110001',
    address: 'R. das Aroeiras, 145 - Parque Interlagos, São José dos Campos - SP',
    plan: 'premium',
    is_premium: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    social_links: { instagram: '@padariapaoarte_sjc', facebook: 'padariapaoarte', site: '' },
    gallery: [
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.9,
    views: 312,
    is_active: true,
  },
  {
    name: 'Pizzaria Napoli Parque',
    category: 'Alimentação',
    description: 'Pizzas artesanais com massa fina na pedra e ingredientes selecionados. Entregamos no Parque Interlagos e bairros vizinhos. Tradição italiana com o sabor de São José.',
    phone: '12992220002',
    whatsapp: '12992220002',
    address: 'R. dos Flamboyants, 78 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    is_premium: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    social_links: { instagram: '@napoliparquesjc', facebook: '', site: 'napoliparque.com.br' },
    gallery: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.7,
    views: 198,
    is_active: true,
  },
  {
    name: 'Auto Center São Judas',
    category: 'Automotivo',
    description: 'Mecânica completa: revisão, alinhamento, balanceamento, troca de óleo e suspensão. Atendemos todas as marcas com orçamento grátis. 15 anos de experiência em São José dos Campos.',
    phone: '12993330003',
    whatsapp: '12993330003',
    address: 'R. das Camélias, 210 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    is_premium: true,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
    social_links: { instagram: '@autocentersaojudas', facebook: 'autocentersaojudas', site: '' },
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.6,
    views: 154,
    is_active: true,
  },
  {
    name: 'Salão da Mari Beauty',
    category: 'Beleza',
    description: 'Especialistas em coloração, cortes modernos, escova progressiva e unhas. Agende pelo WhatsApp e garanta seu horário. Ambiente aconchegante no coração do Parque Interlagos.',
    phone: '12994440004',
    whatsapp: '12994440004',
    address: 'R. dos Ipês, 33 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    is_premium: false,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    social_links: {},
    gallery: [],
    rating: 0,
    views: 89,
    is_active: true,
  },
  {
    name: 'Mercadinho do Seu Antônio',
    category: 'Alimentação',
    description: 'Seu mercadinho de bairro de sempre: hortifrúti fresquinho, frios, laticínios e mercearia completa. Entrega grátis no raio de 2km. Fiado pro vizinho de boa fé.',
    phone: '12995550005',
    whatsapp: '12995550005',
    address: 'R. das Magnólias, 112 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    is_premium: false,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    social_links: {},
    gallery: [],
    rating: 0,
    views: 67,
    is_active: true,
  },
  {
    name: 'Farmácia Vida & Saúde',
    category: 'Saúde',
    description: 'Farmácia completa com manipulação, dermocosméticos, higiene pessoal e medicamentos de referência e genérico. Entrega delivery no Parque Interlagos e Campos de São José.',
    phone: '12996660006',
    whatsapp: '12996660006',
    address: 'Av. dos Trabalhadores, 567 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    is_premium: true,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800',
    social_links: { instagram: '@farmaciavsesjc', facebook: '', site: '' },
    gallery: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.5,
    views: 221,
    is_active: true,
  },
  {
    name: 'Pet Shop Bicho Solto',
    category: 'Serviços',
    description: 'Banho, tosa, veterinário, ração premium e acessórios para pets de todos os tamanhos. Agendamento online e atendimento carinhoso para cães, gatos e exóticos.',
    phone: '12997770007',
    whatsapp: '12997770007',
    address: 'R. dos Girassóis, 78 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    is_premium: false,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
    social_links: {},
    gallery: [],
    rating: 0,
    views: 103,
    is_active: true,
  },
  {
    name: 'Academia Corpo & Mente',
    category: 'Saúde',
    description: 'Academia completa com musculação, aeróbicos, crossfit e aulas de yoga. Professores formados e equipe comprometida com seu resultado. Planos a partir de R$ 89/mês.',
    phone: '12998880008',
    whatsapp: '12998880008',
    address: 'R. das Acácias, 301 - Parque Interlagos, São José dos Campos - SP',
    plan: 'premium',
    is_premium: true,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    social_links: { instagram: '@academiacorpoementersjc', facebook: 'academiacorpomente', site: 'corporpoementer.com.br' },
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    ],
    rating: 4.8,
    views: 267,
    is_active: true,
  },
  {
    name: 'Instituto de Idiomas Nova Era',
    category: 'Educação',
    description: 'Inglês, espanhol e mandarim para todas as idades. Método conversacional com professores nativos. Turmas presenciais e online. Prepare-se para o mercado global saindo do Parque Interlagos.',
    phone: '12999990009',
    whatsapp: '12999990009',
    address: 'R. dos Jacarandás, 45 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    is_premium: false,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    social_links: {},
    gallery: [],
    rating: 0,
    views: 82,
    is_active: true,
  },
  {
    name: 'Barbearia do Tonho',
    category: 'Beleza',
    description: 'Cortes clássicos e modernos, barba e bigode com navalha. Atendimento sem hora marcada, ambiente descontraído e papo garantido. O point dos homens do Parque Interlagos.',
    phone: '12900000010',
    whatsapp: '12900000010',
    address: 'R. das Violetas, 18 - Parque Interlagos, São José dos Campos - SP',
    plan: 'free',
    is_premium: false,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
    social_links: {},
    gallery: [],
    rating: 0,
    views: 41,
    is_active: true,
  },
];

// ─── Dados de Classificados C2C ────────────────────────────────────────────────
const ADS = [
  {
    title: 'Bicicleta Caloi Aro 29 - Semi Nova',
    description: 'Vendo bicicleta Caloi Explorer Sport aro 29, 21 marchas, freio a disco hidráulico. Pouquíssimo uso, comprada há 8 meses. Acompanha capacete e kit de ferramentas. Retirada no Parque Interlagos.',
    price: 'R$ 750,00',
    category: 'Vendas',
    contact: '12991119999',
    user_name: 'Carlos Mendonça',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Quarto Mobiliado para Alugar - Parque Interlagos',
    description: 'Quarto amplo e mobiliado em casa familiar, banheiro compartilhado, cozinha incluída, Wi-Fi e água na conta. Próximo ao ponto de ônibus da Av. dos Trabalhadores. Aceito profissionais ou estudantes.',
    price: 'R$ 850,00/mês',
    category: 'Imóveis',
    contact: '12992228888',
    user_name: 'Ana Paula Ferreira',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Vaga: Atendente de Lanchonete - Parque Interlagos',
    description: 'Lanchonete no Parque Interlagos contrata atendente de balcão. Requisitos: maiores de 18 anos, disponibilidade de horários, experiência em atendimento ao público. Salário + benefícios. Enviar currículo pelo Zap.',
    price: 'Combinar',
    category: 'Empregos',
    contact: '12993337777',
    user_name: 'Lanchonete Sabor & Cia',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'iPhone 14 128GB - Preto - Como Novo',
    description: 'Vendo iPhone 14 128GB na cor preta, sem nenhum arranhão, com capa e película originais. Bateria em ótimo estado (94%). Desapego, comprei um 15 Pro. Nota fiscal disponível. Parque Interlagos, SJC.',
    price: 'R$ 3.800,00',
    category: 'Eletrônicos',
    contact: '12994446666',
    user_name: 'Bruno Takahashi',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Smart TV Samsung 50" Crystal UHD 4K',
    description: 'Vendo Smart TV Samsung 50 polegadas Crystal UHD 4K, modelo TU8000, controle remoto com comando de voz. Com suporte de parede incluso. Funcionando perfeitamente. Troca possível por TV menor + volta.',
    price: 'R$ 1.400,00',
    category: 'Eletrônicos',
    contact: '12995555555',
    user_name: 'Roberta Lima',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=600',
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Iniciando seed — Parque Interlagos, São José dos Campos - SP\n');

  // Comércios
  console.log('🏪  Inserindo 10 comércios...');
  const { error: merchantError, data: merchantData } = await supabase
    .from('merchants')
    .insert(MERCHANTS)
    .select('id, name');

  if (merchantError) {
    console.error('❌  Erro ao inserir comércios:', merchantError.message);
    console.error('   Dica: adicione SUPABASE_SERVICE_ROLE_KEY ao .env.local para bypassar RLS.');
  } else {
    console.log(`✅  ${merchantData.length} comércios inseridos com sucesso:`);
    merchantData.forEach(m => console.log(`     • ${m.name} (id: ${m.id})`));
  }

  console.log('');

  // Classificados
  console.log('📋  Inserindo 5 classificados C2C...');
  const { error: adError, data: adData } = await supabase
    .from('ads')
    .insert(ADS)
    .select('id, title');

  if (adError) {
    console.error('❌  Erro ao inserir classificados:', adError.message);
  } else {
    console.log(`✅  ${adData.length} classificados inseridos com sucesso:`);
    adData.forEach(a => console.log(`     • ${a.title} (id: ${a.id})`));
  }

  console.log('\n🎉  Seed concluído!\n');
}

seed().catch(err => {
  console.error('❌  Erro inesperado:', err);
  process.exit(1);
});
