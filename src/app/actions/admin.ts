'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { productSchema, categorySchema, ProductFormValues, CategoryFormValues } from '@/lib/validations/admin';

// --- CATEGORY ACTIONS ---

export async function createCategory(values: CategoryFormValues) {
  const supabase = await createClient();
  const validatedFields = categorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { error } = await supabase
    .from('categories')
    .insert([validatedFields.data]);

  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  const supabase = await createClient();
  const validatedFields = categorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { error } = await supabase
    .from('categories')
    .update(validatedFields.data)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  return { success: true };
}

// --- PRODUCT ACTIONS ---

export async function createProduct(values: ProductFormValues, imageUrls: string[]) {
  const supabase = await createClient();
  const validatedFields = productSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  // 1. Insert Product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([validatedFields.data])
    .select()
    .single();

  if (productError) return { error: productError.message };

  // 2. Insert Images (Bypass RLS securely since step 1 validated the Admin)
  if (imageUrls.length > 0) {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const imagesToInsert = imageUrls.map((url, index) => ({
      product_id: product.id,
      url,
      is_primary: index === 0,
      display_order: index,
    }));

    const { error: imageError } = await supabaseAdmin
      .from('product_images')
      .insert(imagesToInsert);

    if (imageError) return { error: `Product created, but images failed: ${imageError.message}` };
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/product/${product.slug}`);
  return { success: true, data: product };
}

export async function updateProduct(id: string, values: ProductFormValues, imageUrls?: string[]) {
  const supabase = await createClient();
  const validatedFields = productSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  // 1. Update Product
  const { error: productError } = await supabase
    .from('products')
    .update(validatedFields.data)
    .eq('id', id);

  if (productError) return { error: productError.message };

  // 2. Update Images if provided (Bypass missing RLS securely)
  if (imageUrls) {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    await supabaseAdmin.from('product_images').delete().eq('product_id', id);
    
    if (imageUrls.length > 0) {
      const imagesToInsert = imageUrls.map((url, index) => ({
        product_id: id,
        url,
        is_primary: index === 0,
        display_order: index,
      }));

      await supabaseAdmin.from('product_images').insert(imagesToInsert);
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/product/${validatedFields.data.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true };
}

// --- STORAGE HELPER (SERVICE ROLE) ---

export async function uploadProductImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    
    if (!file || !fileName) return { error: 'Missing file data' };
    
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(`products/${fileName}`, buffer, {
         contentType: file.type,
         upsert: false
      });
      
    if (uploadError) return { error: uploadError.message };
    
    const { data } = supabaseAdmin.storage.from('products').getPublicUrl(`products/${fileName}`);
    return { publicUrl: data.publicUrl };
    
  } catch (err: any) {
    return { error: 'Failed to upload image securely.' };
  }
}

// --- STORAGE HELPER ---

export async function getSignedUrl(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('products')
    .createSignedUrl(path, 3600);

  if (error) return { error: error.message };
  return { url: data.signedUrl };
}

export async function updateOrderStatus(orderId: string, status: string) {
  console.log(`[updateOrderStatus] Starting update for Order: ${orderId} -> Status: ${status}`);

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  
  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString();
  if (status === 'failed') updateData.failed_at = new Date().toISOString();

  console.log(`[updateOrderStatus] Payload:`, updateData);

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select();

  console.log(`[updateOrderStatus] Result -> Error:`, error?.message, `| Rows matched:`, data?.length);

  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: 'Order not found or update explicitly blocked/failed silently.' };

  revalidatePath('/admin/orders');
  revalidatePath('/account');
  
  return { success: true, order: data[0] };
}

// --- AUTOMATIC FALLBACK ACTIONS ---

export async function autoFailExpiredOrders() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  try {
    const { data: pendingOrders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('status', 'pending')
      .lt('created_at', oneHourAgo);
      
    if (pendingOrders && pendingOrders.length > 0) {
      console.log(`[autoFailExpiredOrders] Failing ${pendingOrders.length} stale strictly-pending orders.`);
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed', failed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .in('id', pendingOrders.map(o => o.id));
    }
      
    return { success: true };
  } catch (err: any) {
    console.error(`[autoFailExpiredOrders] Error processing sweep:`, err);
    return { error: 'Failed to sweep expired orders.' };
  }
}
