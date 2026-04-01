import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return new NextResponse('Webhook secret not found', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = await createClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Update order status to 'processing' (meaning paid)
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'processing',
            payment_intent_id: session.payment_intent as string 
          })
          .eq('id', orderId);

        if (error) {
          console.error(`Error updating order ${orderId}:`, error.message);
          return new NextResponse('Database error', { status: 500 });
        }
        
        console.log(`Order ${orderId} marked as paid.`);
      }
      break;
    }

    case 'checkout.session.expired':
    case 'payment_intent.payment_failed': {
      const session = event.data.object as any;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Update order status to 'cancelled'
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
          
        console.log(`Order ${orderId} marked as cancelled/failed.`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
