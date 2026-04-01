import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Helper to get a Service Role client that bypasses RLS for cart operations
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: Request) {
  try {
    // 1. Validate session with user client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 2. Use service role for all DB operations (bypasses RLS safely)
    const db = getAdminClient();

    // Get product price
    const { data: product } = await db
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get or create cart
    let { data: cart } = await db
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: newCartError } = await db
        .from('carts')
        .insert([{ user_id: user.id }])
        .select('id')
        .single();

      if (newCartError) {
        return NextResponse.json({ error: 'Cart creation failed', details: newCartError }, { status: 500 });
      }
      cart = newCart;
    }

    // Upsert cart item
    const { data: existingItem } = await db
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart!.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      const { error } = await db
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity
        })
        .eq('id', existingItem.id);

      if (error) {
        return NextResponse.json({ error: 'Cart item update failed', details: error }, { status: 500 });
      }
    } else {
      const { error } = await db
        .from('cart_items')
        .insert([{
          cart_id: cart!.id,
          product_id: productId,
          quantity: quantity
        }]);

      if (error) {
        return NextResponse.json({ error: 'Cart item insertion failed', details: error }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const db = getAdminClient();
    const { data: cart } = await db.from('carts').select('id').eq('user_id', user.id).maybeSingle();
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    if (quantity === 0) {
      await db.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', productId);
    } else {
      await db.from('cart_items').update({ quantity }).eq('cart_id', cart.id).eq('product_id', productId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const db = getAdminClient();
    const { data: cart } = await db.from('carts').select('id').eq('user_id', user.id).maybeSingle();
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    await db.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getAdminClient();
    const { data: cart } = await db.from('carts').select('id').eq('user_id', user.id).maybeSingle();

    if (!cart) return NextResponse.json({ items: [] });

    const { data: items } = await db
      .from('cart_items')
      .select('*, products(id, name, slug, price, product_images(url, is_primary))')
      .eq('cart_id', cart.id);

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
