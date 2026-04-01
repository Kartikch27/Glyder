import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const ELECTRONICS_CATEGORIES = [
  'Phones', 'Smartphones', 'Tablets', 'iPads', 'Laptops', 'TVs', 'Smart TVs',
  'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Earbuds', 'Headphones',
  'Smart Watches', 'Speakers', 'Monitors', 'Keyboards', 'Mice', 'Printers',
  'Cameras', 'Gaming Consoles', 'Power Banks', 'Chargers', 'Cables',
  'Home Appliances', 'Kitchen Appliances'
];

async function main() {
  console.log('--- Fixing Storage Bucket ---');
  // 1. Create Storage Bucket
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
  } else {
    const productsBucket = buckets?.find(b => b.name === 'products');
    if (!productsBucket) {
      console.log('Creating "products" bucket...');
      const { error: createError } = await supabaseAdmin.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/jpg']
      });
      if (createError) {
         console.error('Error creating bucket:', createError);
      } else {
         console.log('✅ Bucket "products" created successfully.');
      }
    } else {
      console.log('✅ Bucket "products" already exists.');
      // Ensure it's public
      await supabaseAdmin.storage.updateBucket('products', { public: true });
    }
  }

  console.log('\n--- Seeding Electronics Categories ---');
  // 2. Insert electronics categories
  for (const catName of ELECTRONICS_CATEGORIES) {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const { error: insertError } = await supabaseAdmin.from('categories').upsert({
      name: catName,
      slug: slug,
      description: `Premium ${catName} products and accessories.`
    }, { onConflict: 'slug' });
    
    if (insertError) {
       console.error(`Error inserting category ${catName}:`, insertError);
    }
  }
  console.log('✅ 25 Electronics categories seeded successfully.');
}

main();
