'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ShoppingCart, ArrowRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="container px-4 py-24 md:px-6">
      <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full scale-150" />
          <div className="relative h-32 w-32 rounded-full bg-red-50 flex items-center justify-center border-2 border-dashed border-red-500/20">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-red-600">Payment Cancelled</h1>
          <p className="text-muted-foreground font-medium">
            The payment process was cancelled or failed. No worries, your items are still safe in your cart. 
            Would you like to try again or continue browsing?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/checkout">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2">
              <RefreshCcw className="h-5 w-5" /> Retry Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2">
              <ShoppingCart className="h-5 w-5" /> Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
