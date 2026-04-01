'use server';

import { createClient } from '@/lib/supabase/server';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validations/admin';
import { CartItem } from '@/store/use-cart';

export async function createOrder(values: CheckoutFormValues, items: CartItem[], totalAmount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const validatedFields = checkoutSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  // 1. Create Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: user?.id || null, // Guest checkout supported if user is null
      status: 'pending',
      total_amount: totalAmount,
      shipping_address: validatedFields.data,
    }])
    .select()
    .single();

  if (orderError) return { error: orderError.message };

  // 2. Create Order Items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) return { error: `Order created, but items failed: ${itemsError.message}` };

  // 3. Update Stock (Simple version: decrement stock for each item)
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.id)
      .single();

    if (product) {
      await supabase
        .from('products')
        .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
        .eq('id', item.id);
    }
  }

  return { success: true, orderId: order.id };
}
