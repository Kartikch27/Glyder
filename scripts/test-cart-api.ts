import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@glyder.com',
    password: 'Admin@12345'
  });

  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }

  console.log('Fetching a product ID...');
  const { data: products } = await supabase.from('products').select('id').limit(1);
  const productId = products?.[0]?.id;

  if (!productId) {
    console.log('No products found to add to cart.');
    return;
  }

  // Construct Next.js Server Cookie
  const projectId = new URL(supabaseUrl).hostname.split('.')[0];
  const cookieName = `sb-${projectId}-auth-token`;
  const cookieValue = encodeURIComponent(JSON.stringify(authData.session));

  console.log('Hitting /api/cart/items POST...');
  const res = await fetch('http://localhost:3000/api/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `${cookieName}=${cookieValue}`
    },
    body: JSON.stringify({ productId, quantity: 1 })
  });
  
  const json = await res.json();
  console.log('Status Code:', res.status);
  console.log('Response Body:', JSON.stringify(json, null, 2));
}

main();
