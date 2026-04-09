import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env.local');

const env = {};
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)[ \t]*=[ \t]*(.+)/);
    if (m) env[m[1]] = m[2].trim();
  }
} catch (e) {
  console.error("Error reading .env.local", e);
  process.exit(1);
}

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'reinaldogramachof@gmail.com';
  const password = 'Rein@ldo1912';

  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError);
    process.exit(1);
  }

  let user = users.users.find(u => u.email === email);

  if (user) {
    await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    console.log("Password updated successfully.");
  } else {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createError) {
      console.error("Failed to create user:", createError);
      process.exit(1);
    }
    user = createData.user;
    console.log(`User created successfully.`);
  }

  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .update({ role: 'master' })
    .eq('id', user.id)
    .select();

  if (profError) {
    console.error('Error updating profile role:', profError);
  } else {
    console.log('Profile updated successfully to master.', profile);
  }

  console.log("\nDone! You should now be able to login.");
}

run();
