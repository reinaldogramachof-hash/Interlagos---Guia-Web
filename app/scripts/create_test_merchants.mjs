import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfjavgjeylahhcfcixtv.supabase.co';
const serviceKey = 'sb_secret_5gy2qAYHhTfDA33ln4Js4A_oKwmxDdD';

const supabase = createClient(supabaseUrl, serviceKey);

const users = [
  { email: 'basico@teste.com', plan: 'basic', name: 'Comerciante Básico' },
  { email: 'pro@teste.com', plan: 'pro', name: 'Comerciante Pro' },
  { email: 'premium@teste.com', plan: 'premium', name: 'Comerciante Premium' },
];

async function run() {
  console.log('--- Iniciando criação de usuários de teste ---');
  
  // Listar usuários antecipadamente para evitar erros de busca repetidos
  const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Erro ao listar usuários:', listError.message);
    return;
  }

  for (const u of users) {
    console.log(`\nProcessando: ${u.email}...`);
    
    let userId = null;
    const found = usersList.users.find(x => x.email?.toLowerCase() === u.email.toLowerCase());

    if (found) {
      console.log(`  > Usuário ${u.email} já existe no Auth. ID: ${found.id}`);
      userId = found.id;
    } else {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: 'Teste1234',
        email_confirm: true
      });

      if (authError) {
        console.error(`  > Erro ao criar Auth User (${u.email}):`, authError.message);
        continue;
      }
      userId = authUser.user.id;
      console.log(`  > Usuário Auth criado com sucesso.`);
    }

    // 2. Criar Perfil (Merchant)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        display_name: u.name,
        role: 'merchant'
      });
    
    if (profileError) {
      console.error(`  > Erro no Perfil (${u.email}):`, profileError.message);
      continue;
    }
    console.log(`  > Perfil Comerciante configurado.`);

    // 3. Criar/Atualizar Merchant
    const { data: existingMerchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('owner_id', userId)
      .maybeSingle();

    if (existingMerchant) {
      const { error: updateError } = await supabase
        .from('merchants')
        .update({
          name: u.name,
          plan: u.plan,
          is_active: true,
          neighborhood: 'interlagos',
        })
        .eq('id', existingMerchant.id);
      
      if (updateError) {
        console.error(`  > Erro ao atualizar merchant (${u.email}):`, updateError.message);
      } else {
        console.log(`  ✅ ${u.email} (${u.plan}) atualizado.`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('merchants')
        .insert({
          owner_id: userId,
          name: u.name,
          plan: u.plan,
          is_active: true,
          neighborhood: 'interlagos',
          category: 'Outros',
          description: `Perfil de teste para o plano ${u.plan.toUpperCase()}.`
        });
      
      if (insertError) {
        console.error(`  > Erro ao inserir merchant (${u.email}):`, insertError.message);
      } else {
        console.log(`  ✅ ${u.email} (${u.plan}) criado.`);
      }
    }
  }
  console.log('\n--- Finalizado ---');
}

run();
