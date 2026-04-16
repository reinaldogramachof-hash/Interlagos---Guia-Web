-- ============================================================
-- SEED: public_services — Parque Interlagos (SJC-SP)
-- Versão: v1 | Bairro: interlagos
-- Executar no Supabase SQL Editor
-- ============================================================

INSERT INTO public_services
  (id, name, category, description, phone, hours, address, icon_type, is_emergency, neighborhood)
VALUES

-- ── EMERGÊNCIAS ─────────────────────────────────────────────
(
  'aaaaaaaa-0001-0001-0001-000000000001',
  'Polícia Militar (PMESP)',
  'Emergências',
  'Ocorrências, crimes em andamento e perturbação da ordem pública.',
  '190',
  '24h',
  NULL,
  'alertTriangle',
  true,
  'interlagos'
),
(
  'aaaaaaaa-0002-0002-0002-000000000002',
  'SAMU',
  'Emergências',
  'Emergências médicas, remoção hospitalar, paradas cardiorrespiratórias e acidentes.',
  '192',
  '24h',
  NULL,
  'alertTriangle',
  true,
  'interlagos'
),
(
  'aaaaaaaa-0003-0003-0003-000000000003',
  'Guarda Civil Municipal (GCM)',
  'Emergências',
  'Vandalismo, violência doméstica e segurança preventiva de escolas e UBS.',
  '153',
  '24h',
  NULL,
  'alertTriangle',
  true,
  'interlagos'
),
(
  'aaaaaaaa-0004-0004-0004-000000000004',
  'CVV — Centro de Valorização da Vida',
  'Emergências',
  'Apoio emocional e prevenção ao suicídio. Gratuito e sigiloso.',
  '188',
  '24h',
  NULL,
  'alertTriangle',
  true,
  'interlagos'
),
(
  'aaaaaaaa-0005-0005-0005-000000000005',
  'Central Prefeitura SJC',
  'Emergências',
  'Solicitações de poda, asfalto, iluminação pública e denúncias URBAM.',
  '156',
  'Seg a Sex, horário comercial',
  NULL,
  'alertTriangle',
  false,
  'interlagos'
),

-- ── SAÚDE ───────────────────────────────────────────────────
(
  'aaaaaaaa-0006-0006-0006-000000000006',
  'UBS Interlagos',
  'Saúde',
  'Consultas, vacinas, medicação, especialidades via AME. Cobre 18.271 habitantes do bairro.',
  '(12) 3944-1133',
  'Seg a Sex, 07h às 18h',
  'Rua Ubirajara Raimundo de Souza, 225',
  'stethoscope',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0007-0007-0007-000000000007',
  'UPA Campo dos Alemães',
  'Saúde',
  'Urgências clínicas, traumas moderados, curativos e medicação IV. Referência primária de urgência.',
  'sem número público',
  '24h',
  NULL,
  'stethoscope',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0008-0008-0008-000000000008',
  'Hospital Francisca Júlia',
  'Saúde',
  'Psiquiatria e saúde mental. Parceiro CVV. Linha 316 com desvio exclusivo FJ.',
  'sem número público',
  '24h',
  'Estrada Dr. Bezerra de Menezes, 700 — Torrão de Ouro',
  'stethoscope',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0009-0009-0009-000000000009',
  'UPA Saúde Mental 24h',
  'Saúde',
  'Surtos psicóticos, crises de abstinência e ideação suicida. Atendimento humanizado especializado.',
  'sem número público',
  '24h',
  'Estrada Dr. Bezerra de Menezes — Torrão de Ouro',
  'stethoscope',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0010-0010-0010-000000000010',
  'Hospital Municipal SJC',
  'Saúde',
  'Alta complexidade. UTI e cirurgias de grande porte. Acesso via regulação ou SAMU.',
  '(12) 3901-3400',
  '24h',
  NULL,
  'stethoscope',
  false,
  'interlagos'
),

-- ── TRANSPORTE ──────────────────────────────────────────────
(
  'aaaaaaaa-0011-0011-0011-000000000011',
  'Linha 315 — Parque Interlagos / Terminal Central',
  'Transporte',
  'Plataforma 11 do Terminal. ~76 partidas/dia útil. Pico: 7min de intervalo. Rota: Av. Andrômeda → Av. Cidade Jardim → R. Ubirajara R. de Souza. Duração: 44–57min.',
  '(12) 3925-2024',
  '05h00 – 00h00',
  NULL,
  'bus',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0012-0012-0012-000000000012',
  'Linha 316 — Torrão de Ouro / Terminal Central',
  'Transporte',
  'Plataforma 9 do Terminal. Atende Torrão de Ouro e Hospital Francisca Júlia (horários "FJ" com desvio especial). 20 partidas/dia útil. Via Rodovia dos Tamoios.',
  '(12) 3925-2024',
  '04h50 – 23h05',
  NULL,
  'bus',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0013-0013-0013-000000000013',
  'Tarifa do Transporte',
  'Transporte',
  'Bilhete Único: R$5,25 (dia útil/sáb) | R$4,75 (dom) | Dinheiro: R$6,50 | Estudante: R$2,50 (ônibus) / R$3,25 (van) | Vale-Transporte: R$6,30',
  '156',
  'Seg a Sex',
  NULL,
  'bus',
  false,
  'interlagos'
),

-- ── EDUCAÇÃO ───────────────────────────────────────────────
(
  'aaaaaaaa-0014-0014-0014-000000000014',
  'EMEF Profª Ruth Nunes da Trindade',
  'Educação',
  '1º ao 5º ano. Escola fundamental do Parque Interlagos. Programa Escola 5.0.',
  NULL,
  'Seg a Sex',
  'Rua Waldemar Teixeira, 900',
  'users',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0015-0015-0015-000000000015',
  'EMEF Profª Alda de Souza Araújo',
  'Educação',
  'Capacidade 900 alunos. 6º ao 9º ano. Reduz evasão escolar ao manter os jovens do bairro no ensino local.',
  NULL,
  'Seg a Sex',
  'Jardim Mesquita',
  'users',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0016-0016-0016-000000000016',
  'EMEI Profº Ladiel Benedito de Carvalho',
  'Educação',
  'Educação infantil (creche e pré-escola). Parceria com CECOI Lírios do Campo.',
  NULL,
  'Seg a Sex',
  'Parque Interlagos',
  'users',
  false,
  'interlagos'
),

-- ── ASSISTÊNCIA SOCIAL ──────────────────────────────────────
(
  'aaaaaaaa-0017-0017-0017-000000000017',
  'CRAS Sul',
  'Assistência Social',
  'CadÚnico, BPC, auxílio-funeral, cestas básicas. Campanha "CRAS em Ação" na EMEF Ruth Nunes (sábados, 09h–13h) atende ~2.500 famílias da região.',
  NULL,
  'Seg a Sex, 08h às 17h',
  NULL,
  'heart',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0018-0018-0018-000000000018',
  'Unidade de Atendimento Social Sul',
  'Assistência Social',
  'Acolhimento masculino adulto: teto, alimentação, higiene e reinserção social para homens em situação de rua.',
  NULL,
  '24h',
  'Estrada Bezerra de Menezes, 2.500 — Torrão de Ouro',
  'heart',
  false,
  'interlagos'
),

-- ── LAZER ───────────────────────────────────────────────────
(
  'aaaaaaaa-0019-0019-0019-000000000019',
  'Salão Comunitário Parque Interlagos',
  'Lazer',
  'Quadras, capoeira, dança, futsal e oficinas. Espaço para reuniões de moradores. Aberto até as 22h para reter jovens em atividade saudável.',
  '(12) 3944-4962',
  '07h às 22h (todos os dias)',
  'Rua Diaz Gomes, 49',
  'trees',
  false,
  'interlagos'
),
(
  'aaaaaaaa-0020-0020-0020-000000000020',
  'Feira Livre — Parque Interlagos',
  'Lazer',
  'Hortifrúti, artesanato e pequenos empreendedores locais. Coleta seletiva simultânea pela URBAM. Tarifa de ônibus reduzida (R$4,75) para incentivar o acesso.',
  NULL,
  'Domingos, 07h às 14h',
  'Rua Ubirajara Raimundo de Souza',
  'trees',
  false,
  'interlagos'
),

-- ── MEIO AMBIENTE ───────────────────────────────────────────
(
  'aaaaaaaa-0021-0021-0021-000000000021',
  'PEV Interlagos — Ponto de Entrega Voluntária',
  'Meio Ambiente',
  'Descarte gratuito de até 1m³ de entulho, móveis velhos e eletrodomésticos. URBAM também opera PEV Campo dos Alemães (Av. dos Evangélicos, 602) — Seg a Sáb 08h–22h.',
  '(12) 3944-1000',
  'Verificar com Central 156',
  'Rua Ubirajara R. de Souza, 21',
  'trees',
  false,
  'interlagos'
);

-- ============================================================
-- CLEANUP (descomente para reverter o seed)
-- DELETE FROM public_services WHERE id LIKE 'aaaaaaaa-%';
-- ============================================================
