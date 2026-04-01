import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    const body = await req.json();
    const { 
      total, 
      shippingDetails, 
      items, 
      subtotal,
      shippingAmount,
      taxAmount,
      shippingMethod
    } = body;

    // 1. Create order in Supabase
    const { data: dbOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        email: shippingDetails.email,
        street_address: shippingDetails.address,
        shipping_address: shippingDetails.address,
        city: shippingDetails.city,
        zip_code: shippingDetails.zip,
        shipping_method: shippingMethod,
        subtotal: subtotal,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        total_amount: total,
        payment_method: 'cod',
        payment_status: 'pending',
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map((item: any) => ({
      order_id: dbOrder.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Clear user's cart in DB
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (cart) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);
    }

    return NextResponse.json({ 
      success: true,
      orderId: dbOrder.id 
    });

  } catch (error: any) {
    console.error('Place Order (COD) Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Error placing order'
    }, { status: 500 });
  }
}
