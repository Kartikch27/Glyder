'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export interface StoreSettings {
  id: string;
  store_name: string;
  support_email: string;
  contact_number: string;
  store_address: string;
  order_auto_fail_minutes: number;
  cod_enabled: boolean;
  updated_at?: string;
}

/**
 * Retrieves the global store settings natively from the 1st row.
 */
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch store settings:', error);
    return null;
  }

  return data as StoreSettings | null;
}

/**
 * Updates the global store settings natively using the admin bypass 
 * to guarantee robust fulfillment during active state writes.
 */
export async function updateStoreSettings(payload: Partial<StoreSettings>) {
  // Ensure the invoker is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Double check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Settings are exclusively locked to Admin roles.');
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Strip id and updated_at to prevent immutable constraint errors
  const { id, updated_at, ...cleanPayload } = payload as any;

  // 1. Fetch exact single row limits
  const { data: existingSettings } = await supabaseAdmin
    .from('store_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existingSettings) {
    // 2. If exists, Update
    const { error } = await supabaseAdmin
      .from('store_settings')
      .update(cleanPayload)
      .eq('id', existingSettings.id);

    if (error) {
      console.error('Error updating store settings:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  } else {
    // 3. If not exists, Insert completely fresh explicit record using defaults + cleanly appended mutations
    const { error } = await supabaseAdmin
      .from('store_settings')
      .insert([cleanPayload]);

    if (error) {
      console.error('Error inserting initial store settings:', error);
      throw new Error(`Failed to initialize settings: ${error.message}`);
    }
  }

  // Bust caches dynamically binding updated constraints locally
  revalidatePath('/admin');
  revalidatePath('/admin/settings');
  revalidatePath('/shop'); 
  revalidatePath('/checkout');
  
  return { success: true };
}
