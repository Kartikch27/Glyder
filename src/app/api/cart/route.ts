import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    // Validate session with user client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // All DB ops via service role to bypass RLS
    const db = getAdminClient();

    // Get or create cart
    let { data: cart } = await db
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartError } = await db
        .from('carts')
        .insert([{ user_id: user.id }])
        .select('id')
        .single();

      if (cartError) throw cartError;
      cart = newCart;
    }

    // Get items with joined product data
    const { data: items, error } = await db
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        product:products (
          id,
          name,
          slug,
          price,
          product_images(url, is_primary)
        )
      `)
      .eq('cart_id', cart!.id);

    if (error) throw error;

    // Return in the shape the cart page expects: { items: [...] } with nested product
    const formattedItems = (items || []).map((item: any) => ({
      id: item.product.id, // Use Product ID as the main ID for the store
      cartItemId: item.id, // Primary key of cart_items table
      name: item.product.name,
      price: Number(item.product.price),
      image: item.product.product_images?.[0]?.url || null,
      quantity: item.quantity,
      slug: item.product.slug,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
