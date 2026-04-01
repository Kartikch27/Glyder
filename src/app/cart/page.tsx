'use client';

import Link from 'next/link';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/store/use-cart';
import { toast } from 'sonner';

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<any>(null);
  const { items, removeItem: removeLocalItem, updateQuantity: updateLocalQuantity, clearCart } = useCart();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (!response.ok) {
        if (response.status === 401) {
          setCartData(null);
          return;
        }
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCartData(data);
    } catch (err) {
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId: string, productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    try {
      const response = await fetch(`/api/cart/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      
      await fetchCart();
      updateLocalQuantity(productId, newQuantity);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId: string, productId: string) => {
    try {
      const response = await fetch(`/api/cart/items?productId=${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove item');
      
      await fetchCart();
      removeLocalItem(productId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading your cart...</p>
      </div>
    );
  }

  const displayItems = cartData?.items || [];
  const subtotal = displayItems.reduce((acc: number, item: any) => acc + (Number(item.price) * (item.quantity || 0)), 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // User is logged in but cart returned no items (treated as empty, NOT logged out)
  const isLoggedOut = cartData === null;

  if (isLoggedOut) {
    return (
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Please Log In</h1>
            <p className="text-muted-foreground font-medium">
              You need to be logged in to view and manage your cart.
            </p>
          </div>
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2">
              Log In Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
            <div className="relative h-32 w-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Your cart is empty</h1>
            <p className="text-muted-foreground font-medium">
              Looks like you haven't added anything to your cart yet. 
              Explore our premium collection of electric scooters and find your perfect ride.
            </p>
          </div>
          <Link href="/shop">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest gap-2">
              Start Shopping <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            YOUR <span className="text-primary">CART</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            
            <div className="space-y-4">
              {displayItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden border-none bg-muted/30 rounded-[32px]">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                        <div className="h-24 w-24 rounded-2xl bg-muted shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-lg uppercase tracking-tight">{item.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive/80 p-0 h-auto font-bold uppercase tracking-widest text-[10px] mt-2 gap-1"
                            onClick={() => handleRemoveItem(item.cartItemId || item.id, item.id)}
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 flex justify-center">
                        <div className="flex items-center gap-4 bg-background px-3 py-1 rounded-xl border border-border/50">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleUpdateQuantity(item.cartItemId || item.id, item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleUpdateQuantity(item.cartItemId || item.id, item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 text-right">
                        <span className="font-black text-xl tracking-tighter">
                          ${(Number(item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


            <Link href="/shop" className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors pt-4 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary Summary */}
          <div className="space-y-6">
            <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Estimated Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                  <span className="text-4xl font-black tracking-tighter text-primary">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                    Checkout Now
                  </Button>
                </Link>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> 256-bit SSL Secure Checkout
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" /> Express delivery in 3-5 days
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Need Help?</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Our support team is available 24/7 for any questions regarding your order.
              </p>
              <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                Chat with an expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
