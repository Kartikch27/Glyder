import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5 xl:gap-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 w-fit">
              <span className="inline-block font-black text-2xl tracking-tighter text-primary">GLYDER</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed font-medium italic">
              Redefining urban mobility with premium electric scooters. 
              Sustainable, high-performance, and designed for the future of city travel.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-8">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Electric Scooters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?category=parts" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Replacement Parts
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-8">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/faq" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Easy Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-8">Stay Connected</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              Join our newsletter for exclusive offers and mobility tips.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  placeholder="your@email.com" 
                  className="pl-10 h-11 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all rounded-xl font-medium"
                />
              </div>
              <Button className="w-full font-black uppercase tracking-widest text-[10px] h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <p>© {new Date().getFullYear()} GLYDER Mobility Inc. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
