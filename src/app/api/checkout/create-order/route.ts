import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { total, shippingDetails } = body;

    // Create an order in Razorpay
    const options = {
      amount: Math.round(total * 100), // Razorpay accepts smallest currency unit
      currency: "USD",
      receipt: `rcpt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);

    // Create order in Supabase
    const { data: dbOrder, error } = await supabase.from('orders').insert({
      user_id: user.id,
      total_amount: total,
      shipping_address: shippingDetails,
      razorpay_order_id: order.id,
      status: 'pending'
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency, 
      dbOrderId: dbOrder.id 
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
