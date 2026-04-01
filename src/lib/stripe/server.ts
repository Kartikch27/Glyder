import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover', // Updated to match expected version
  appInfo: {
    name: 'Glyder E-commerce',
    version: '0.1.0',
  },
});
