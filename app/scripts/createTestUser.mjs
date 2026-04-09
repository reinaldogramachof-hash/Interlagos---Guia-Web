import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env.local');

const env = {};
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)[ \t]*=[ \t]*(.+)/);
  if (m) env[m[1]] = m[2].trim();
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'testmerchant@test.com',
    password: 'password123',
    email_confirm: true
  });
  if (error) {
     if(error.message.includes("already registered")) {
        console.log("User already exists");
     } else {
        console.error(error);
     }
  } else {
    console.log('Created testmerchant@test.com', data.user.id);
    const { error: pErr } = await supabase.from('profiles').update({ role: 'resident' }).eq('id', data.user.id);
    if(pErr) console.error("Profile error", pErr);
    else console.log("Profile role set to resident");
  }
}
run();
