const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data: prods } = await supabase.from('products').select('*').eq('is_featured', true);
  console.log("Featured Products:", prods.map(p => p.name));
  const { data: cats } = await supabase.from('categories').select('*').order('name');
  console.log("Categories count:", cats.length);
}
run();
