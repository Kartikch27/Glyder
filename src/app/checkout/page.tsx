'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ChevronRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/store/use-cart';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validations/admin';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const subtotal = getTotal();
  const shippingCost = shippingMethod === 'express' ? 19 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [items, router, isSubmitting]);

  async function onSubmit(values: CheckoutFormValues) {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create COD order on server
      const response = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total,
          subtotal,
          shippingAmount: shippingCost,
          taxAmount: tax,
          shippingMethod: shippingMethod,
          shippingDetails: values,
          items: items // Standardized flat items
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const data = await response.json();

      if (data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/checkout/success?orderId=${data.orderId}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && !isSubmitting) return null;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12">
        {/* Checkout Header & Steps */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Checkout</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <span className="h-6 w-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-xs font-black uppercase tracking-widest">Shipping</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === 2 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <span className="h-6 w-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-xs font-black uppercase tracking-widest">Payment</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-8">
              {step === 1 ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                  <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" /> Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase tracking-widest">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase tracking-widest">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-widest">Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-widest">Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Mobility Lane" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase tracking-widest">City</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-black uppercase tracking-widest">ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="94103" className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" /> Shipping Method
                    </h2>
                    <RadioGroup 
                      value={shippingMethod} 
                      onValueChange={(value) => setShippingMethod(value as 'standard' | 'express')}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <Label
                        htmlFor="standard"
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-muted bg-muted/10 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="standard" id="standard" className="sr-only" />
                          <div>
                            <p className="font-black uppercase tracking-widest text-sm">Standard Ground</p>
                            <p className="text-xs text-muted-foreground font-medium">5-7 Business Days</p>
                          </div>
                        </div>
                        <span className="font-black">Free</span>
                      </Label>
                      <Label
                        htmlFor="express"
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-muted bg-muted/10 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="express" id="express" className="sr-only" />
                          <div>
                            <p className="font-black uppercase tracking-widest text-sm">Express Delivery</p>
                            <p className="text-xs text-muted-foreground font-medium">2-3 Business Days</p>
                          </div>
                        </div>
                        <span className="font-black">$19.00</span>
                      </Label>
                    </RadioGroup>
                  </section>

                  <Button 
                    type="submit"
                    className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl gap-2 shadow-xl shadow-primary/20"
                  >
                    Continue to Payment <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                  <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" /> Payment Method
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-8 rounded-[32px] bg-card border-none ring-1 ring-border/50 shadow-sm relative overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-500">
                        <div className="flex items-start justify-between relative z-10">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="text-xl font-black uppercase tracking-tight">Cash on Delivery</h3>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
                              Pay with cash when your GLYDER arrives at your doorstep. Available for all regions.
                            </p>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 w-fit">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Recommended for your location</span>
                            </div>
                          </div>
                          <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        </div>
                        
                        {/* Subtle Background Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="bg-muted/30 p-8 rounded-[32px] border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6 text-primary" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-black uppercase tracking-widest text-sm">Secure Implementation</h4>
                          <p className="text-xs text-muted-foreground font-medium">Your order will be verified by a call before dispatch.</p>
                       </div>
                    </div>
                  </section>

                  <div className="flex gap-4">
                    <Button type="button" variant="ghost" className="h-16 px-8 font-black uppercase tracking-widest rounded-2xl gap-2" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-5 w-5" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-16 text-lg font-black uppercase tracking-widest rounded-2xl gap-2 shadow-xl shadow-primary/20"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : `Place Order (COD)`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Order Review */}
            <div className="space-y-6">
              <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Order Review</h2>
                  
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-muted overflow-hidden shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
                          )}
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">{item.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="bg-border/50" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? "text-green-600" : "text-foreground"}>
                        {shippingCost === 0 ? "Free" : `$${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <span>Estimated Tax</span>
                      <span className="text-foreground">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  
                  <Separator className="bg-border/50" />
                  
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black tracking-tighter text-primary">
                      ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-green-700 leading-relaxed uppercase tracking-widest">
                    Your order is eligible for free 2-year extended warranty.
                  </p>
                </div>
                <p className="text-[10px] text-center text-muted-foreground font-medium px-4">
                  By placing an order, you agree to GLYDER's <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
