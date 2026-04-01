import { createClient } from '@supabase/supabase-js';

// Admin client to bypass RLS policies
// Important: This should ONLY be used in server environments (API Routes, Server Actions)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
