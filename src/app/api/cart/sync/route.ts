import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert([{ user_id: user.id }])
        .select('id')
        .single();
      cart = newCart;
    }

    if (!cart) throw new Error('Failed to get/create cart');

    // Currently simplest sync: we could clear and insert, or just ignore for now if too complex.
    // For robust sync:
    // 1. Get existing cart items
    // 2. Merge local items with DB items (add quantities or max quantity)
    // Here we'll do a simple loop upsert for the provided items
    
    for (const item of items) {
       const { data: existing } = await supabase
         .from('cart_items')
         .select('id, quantity')
         .eq('cart_id', cart.id)
         .eq('product_id', item.id)
         .single();
         
       if (existing) {
         await supabase.from('cart_items')
           .update({ quantity: Math.max(existing.quantity, item.quantity) })
           .eq('id', existing.id);
       } else {
         await supabase.from('cart_items')
           .insert([{
             cart_id: cart.id,
             product_id: item.id,
             quantity: item.quantity,
             price_snapshot: item.price
           }]);
       }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
