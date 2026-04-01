import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
       return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const supabase = await createClient();
      
      // Update order status in Supabase
      const { error } = await supabase.from('orders')
        .update({
          status: 'processing',
          razorpay_payment_id,
          razorpay_signature
        })
        .eq('razorpay_order_id', razorpay_order_id);
        
      if (error) throw error;

      // Clear the user's cart
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
         if (cart) {
           await supabase.from('cart_items').delete().eq('cart_id', cart.id);
         }
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
