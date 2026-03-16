/**
 * seedSupabase.js — Seed de dados de demonstração para o Supabase
 * Bairro: Parque Interlagos, São José dos Campos - SP
 *
 * Como usar:
 *   node scripts/seedSupabase.js
 *
 * Variáveis necessárias no .env.local:
 *   VITE_SUPABASE_URL=<url do seu projeto>
 *   SUPABASE_SERVICE_ROLE_KEY=<chave mestra — Supabase Dashboard → Settings → API → service_role>
 *
 * A SERVICE_ROLE_KEY bypassa o RLS e permite INSERT sem autenticação.
 * NUNCA exponha esta chave no frontend ou no git.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Lê o .env.local a partir da raiz do projeto
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── Validação: aborta se as chaves não foram encontradas ──────────────────────
if (!supabaseUrl) {
  console.error('❌ ERRO FATAL: VITE_SUPABASE_URL não encontrada no .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ ERRO FATAL: SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local');
  console.error('');
  console.error('  Esta chave é obrigatória para bypassar o RLS e inserir dados.');
  console.error('  Onde encontrar:');
  console.error('    Supabase Dashboard → Settings → API → service_role (secret)');
  console.error('');
  console.error('  Adicione no .env.local:');
  console.error('    SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

// ── Cliente Supabase com service_role: bypassa RLS completamente ──────────────
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ─── Dados de Comércios ────────────────────────────────────────────────────────
// Schema (CLAUDE.md): id, owner_id, name, description, category, plan,
//                     image_url, phone, address, instagram, whatsapp, is_active, created_at
const MERCHANTS = [
  {
    name: 'Padaria Pão & Arte',
    category: 'Alimentação',
    description: 'Padaria artesanal com pães frescos, bolos e salgados feitos na hora. O café da manhã mais gostoso do Parque Interlagos, com croissants, brioches e o famoso pão de queijo mineiro.',
    phone: '12991110001',
    whatsapp: '12991110001',
    instagram: '@padariapaoarte_sjc',
    address: 'R. das Aroeiras, 145 - Parque Interlagos, São José dos Campos - SP',
    plan: 'premium',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Pizzaria Napoli Parque',
    category: 'Alimentação',
    description: 'Pizzas artesanais com massa fina na pedra e ingredientes selecionados. Entregamos no Parque Interlagos e bairros vizinhos. Tradição italiana com o sabor de São José.',
    phone: '12992220002',
    whatsapp: '12992220002',
    instagram: '@napoliparquesjc',
    address: 'R. dos Flamboyants, 78 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Auto Center São Judas',
    category: 'Automotivo',
    description: 'Mecânica completa: revisão, alinhamento, balanceamento, troca de óleo e suspensão. Atendemos todas as marcas com orçamento grátis. 15 anos de experiência em São José dos Campos.',
    phone: '12993330003',
    whatsapp: '12993330003',
    instagram: '@autocentersaojudas',
    address: 'R. das Camélias, 210 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Salão da Mari Beauty',
    category: 'Beleza',
    description: 'Especialistas em coloração, cortes modernos, escova progressiva e unhas. Agende pelo WhatsApp e garanta seu horário. Ambiente aconchegante no coração do Parque Interlagos.',
    phone: '12994440004',
    whatsapp: '12994440004',
    instagram: null,
    address: 'R. dos Ipês, 33 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Mercadinho do Seu Antônio',
    category: 'Alimentação',
    description: 'Seu mercadinho de bairro de sempre: hortifrúti fresquinho, frios, laticínios e mercearia completa. Entrega grátis no raio de 2km.',
    phone: '12995550005',
    whatsapp: '12995550005',
    instagram: null,
    address: 'R. das Magnólias, 112 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Farmácia Vida & Saúde',
    category: 'Saúde',
    description: 'Farmácia completa com manipulação, dermocosméticos, higiene pessoal e medicamentos de referência e genérico. Entrega delivery no Parque Interlagos e Campos de São José.',
    phone: '12996660006',
    whatsapp: '12996660006',
    instagram: '@farmaciavsesjc',
    address: 'Av. dos Trabalhadores, 567 - Parque Interlagos, São José dos Campos - SP',
    plan: 'professional',
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Pet Shop Bicho Solto',
    category: 'Serviços',
    description: 'Banho, tosa, veterinário, ração premium e acessórios para pets de todos os tamanhos. Agendamento online e atendimento carinhoso para cães, gatos e exóticos.',
    phone: '12997770007',
    whatsapp: '12997770007',
    instagram: null,
    address: 'R. dos Girassóis, 78 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Academia Corpo & Mente',
    category: 'Saúde',
    description: 'Academia completa com musculação, aeróbicos, crossfit e aulas de yoga. Professores formados e equipe comprometida com seu resultado. Planos a partir de R$ 89/mês.',
    phone: '12998880008',
    whatsapp: '12998880008',
    instagram: '@academiacorpoementesjc',
    address: 'R. das Acácias, 301 - Parque Interlagos, São José dos Campos - SP',
    plan: 'premium',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Instituto de Idiomas Nova Era',
    category: 'Educação',
    description: 'Inglês, espanhol e mandarim para todas as idades. Método conversacional com professores nativos. Turmas presenciais e online. Prepare-se para o mercado global saindo do Parque Interlagos.',
    phone: '12999990009',
    whatsapp: '12999990009',
    instagram: null,
    address: 'R. dos Jacarandás, 45 - Parque Interlagos, São José dos Campos - SP',
    plan: 'basic',
    image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
  {
    name: 'Barbearia do Tonho',
    category: 'Beleza',
    description: 'Cortes clássicos e modernos, barba e bigode com navalha. Atendimento sem hora marcada, ambiente descontraído e papo garantido. O point dos homens do Parque Interlagos.',
    phone: '12900000010',
    whatsapp: '12900000010',
    instagram: null,
    address: 'R. das Violetas, 18 - Parque Interlagos, São José dos Campos - SP',
    plan: 'free',
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
    is_active: true,
    owner_id: null,
  },
];

// ─── Dados de Classificados C2C ────────────────────────────────────────────────
// Schema (CLAUDE.md): id, seller_id, title, description, price, category, image_url, status, created_at
const ADS = [
  {
    title: 'Bicicleta Caloi Aro 29 - Semi Nova',
    description: 'Vendo bicicleta Caloi Explorer Sport aro 29, 21 marchas, freio a disco hidráulico. Pouquíssimo uso, comprada há 8 meses. Acompanha capacete e kit de ferramentas. Retirada no Parque Interlagos.',
    price: 750,
    category: 'Vendas',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    status: 'approved',
    seller_id: null,
  },
  {
    title: 'Quarto Mobiliado para Alugar - Parque Interlagos',
    description: 'Quarto amplo e mobiliado em casa familiar. Banheiro compartilhado, cozinha incluída, Wi-Fi e água na conta. Próximo ao ponto de ônibus da Av. dos Trabalhadores. Aceito profissionais ou estudantes.',
    price: 850,
    category: 'Imóveis',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    status: 'approved',
    seller_id: null,
  },
  {
    title: 'Vaga: Atendente de Lanchonete - Parque Interlagos',
    description: 'Lanchonete no Parque Interlagos contrata atendente de balcão. Maiores de 18 anos, disponibilidade de horários. Salário + benefícios. Enviar currículo pelo Zap.',
    price: null,
    category: 'Empregos',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600',
    status: 'approved',
    seller_id: null,
  },
  {
    title: 'iPhone 14 128GB - Preto - Como Novo',
    description: 'Vendo iPhone 14 128GB na cor preta, sem nenhum arranhão, com capa e película originais. Bateria em ótimo estado (94%). Nota fiscal disponível. Parque Interlagos, SJC.',
    price: 3800,
    category: 'Eletrônicos',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600',
    status: 'approved',
    seller_id: null,
  },
  {
    title: 'Smart TV Samsung 50" Crystal UHD 4K',
    description: 'Vendo Smart TV Samsung 50 polegadas Crystal UHD 4K, modelo TU8000. Com suporte de parede incluso. Funcionando perfeitamente. Troca possível por TV menor + dinheiro.',
    price: 1400,
    category: 'Eletrônicos',
    image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=600',
    status: 'approved',
    seller_id: null,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Iniciando seed — Parque Interlagos, São José dos Campos - SP');
  console.log(`   → URL: ${supabaseUrl}`);
  console.log('   → Chave: service_role (RLS bypass ✅)\n');

  // ── Comércios ──────────────────────────────────────────────────────────────
  console.log('🏪  Inserindo 10 comércios na tabela `merchants`...');
  const { error: merchantError, data: merchantData } = await supabase
    .from('merchants')
    .insert(MERCHANTS)
    .select('id, name');

  if (merchantError) {
    console.error('❌  Erro ao inserir comércios:', merchantError.message);
    if (merchantError.details) console.error('   Detalhes:', merchantError.details);
    if (merchantError.hint) console.error('   Dica:    ', merchantError.hint);
  } else {
    console.log(`✅  ${merchantData.length} comércios inseridos:`);
    merchantData.forEach(m => console.log(`     • [${m.id}] ${m.name}`));
  }

  console.log('');

  // ── Classificados C2C ──────────────────────────────────────────────────────
  console.log('📋  Inserindo 5 classificados na tabela `ads`...');
  const { error: adError, data: adData } = await supabase
    .from('ads')
    .insert(ADS)
    .select('id, title');

  if (adError) {
    console.error('❌  Erro ao inserir classificados:', adError.message);
    if (adError.details) console.error('   Detalhes:', adError.details);
    if (adError.hint) console.error('   Dica:    ', adError.hint);
  } else {
    console.log(`✅  ${adData.length} classificados inseridos:`);
    adData.forEach(a => console.log(`     • [${a.id}] ${a.title}`));
  }

  console.log('\n🎉  Seed concluído! Atualize a interface para ver os dados.\n');
}

seed().catch(err => {
  console.error('❌  Erro inesperado:', err.message || err);
  process.exit(1);
});
