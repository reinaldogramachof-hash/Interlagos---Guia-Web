import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const neighborhood = process.env.VITE_NEIGHBORHOOD || 'interlagos';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listMerchants() {
  const { data, error } = await supabase
    .from('merchants')
    .select('id, name, plan')
    .eq('neighborhood', neighborhood)
    .in('plan', ['pro', 'premium'])
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching merchants:', error);
    return;
  }

  console.log('--- Merchants Pro/Premium ---');
  data.forEach(m => {
    console.log(`ID: ${m.id} | Name: ${m.name} | Plan: ${m.plan}`);
  });
}

listMerchants();
