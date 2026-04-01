import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = 'admin@glyder.com';
  const password = 'Admin@12345';

  console.log(`Setting up default admin: ${email}...`);

  try {
    // 1. Create or retrieve the user via Admin Auth API
    const { data: userRecord, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Glyder Admin'
      }
    });

    let userId = userRecord?.user?.id;

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists. Retrieving user ID...');
        // Find user by email
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.users.find(u => u.email === email);
        if (existingUser) {
           userId = existingUser.id;
        } else {
           throw new Error('Could not find existing user ID');
        }
      } else {
        throw authError;
      }
    }

    if (!userId) {
       throw new Error('Failed to obtain a valid user ID');
    }

    console.log(`User ID: ${userId}. Elevating role to 'admin'...`);

    // 2. Wait a moment for the trigger to insert the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Update the profile role to 'admin'
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    console.log('✅ Default admin account created and verified successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
}

main();
