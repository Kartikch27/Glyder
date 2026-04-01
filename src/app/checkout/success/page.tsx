'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full scale-150" />
          <div className="relative h-32 w-32 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/20">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Order Confirmed</h1>
            {orderId && (
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 w-fit mx-auto px-3 py-1 rounded-full border border-border/50">
                Order ID: {orderId}
              </p>
            )}
          </div>
          <p className="text-muted-foreground font-medium">
            Thank you for your purchase! Your order has been placed successfully using <span className="text-primary font-bold">Cash on Delivery</span>. 
            Our team will contact you soon for verification.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2 border-2">
              View Order
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
              Continue Shopping <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
