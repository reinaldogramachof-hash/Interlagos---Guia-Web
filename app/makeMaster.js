/* global process */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'audit_master1@test.com';
  const password = 'password123';

  // 1. Criar Auth User
  const { data: userAuth, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId;
  if (authError && authError.message.includes('already exists')) {
    const { data: listUser } = await supabase.auth.admin.listUsers();
    userId = listUser.users.find(u => u.email === email)?.id;
    console.log('usuário já existia:', userId);
  } else if (authError) {
    console.error('erro ao criar:', authError);
    return;
  } else {
    userId = userAuth.user.id;
    console.log('usuário criado:', userId);
  }

  // 2. Atualizar perfil para master
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .update({ role: 'master', display_name: 'Audit Master' })
    .eq('id', userId)
    .select();

  if (profError) {
    console.error('erro ao atualizar profile:', profError);
  } else {
    console.log('profile atualizado:', profile);
  }
}
run();
