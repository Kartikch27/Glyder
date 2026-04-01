'use server';

import { stripe } from '@/lib/stripe/server';
import { CartItem } from '@/store/use-cart';
import { CheckoutFormValues } from '@/lib/validations/admin';
import { createOrder } from './orders';
import { headers } from 'next/headers';

export async function createCheckoutSession(values: CheckoutFormValues, items: CartItem[], totalAmount: number) {
  try {
    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    // 1. Create the pending order first
    const orderResult = await createOrder(values, items, totalAmount);
    
    if (!orderResult.success || !orderResult.orderId) {
      throw new Error(orderResult.error || 'Failed to create order');
    }

    const orderId = orderResult.orderId;

    // 2. Prepare line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            id: item.id,
            slug: item.slug,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add tax as a line item if needed, or use Stripe Tax
    const taxAmount = Math.round(totalAmount * 0.08 * 100);
    if (taxAmount > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
          name: 'Estimated Tax (8%)',
          images: [],
          metadata: {
            id: 'tax',
            slug: 'tax',
          },
        },
          unit_amount: taxAmount,
        },
        quantity: 1,
      });
    }

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${orderId}`,
      metadata: {
        order_id: orderId,
      },
      customer_email: values.email,
    });

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    return { error: error.message };
  }
}
