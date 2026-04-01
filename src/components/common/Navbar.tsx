'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, LogOut, Settings } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useCart } from '@/store/use-cart';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const cartItemCount = useCart((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch profile again on auth change
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:gap-8">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
              <span className="inline-block font-black text-2xl tracking-tighter text-primary">GLYDER</span>
            </Link>
          </div>
          
          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-all hover:text-primary relative py-2",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Search & Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
            <div className="relative hidden lg:flex items-center group">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                type="search"
                placeholder="Search products..."
                className="h-10 w-40 xl:w-56 rounded-full bg-muted/30 pl-10 pr-4 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all focus:w-64"
              />
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/cart" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative hover:bg-primary/10 hover:text-primary rounded-full transition-all hover:scale-110 active:scale-95")}>
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground animate-in zoom-in duration-300 shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground px-4 py-2">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-xl cursor-pointer py-3" render={<Link href="/account" />}>
                        <User className="h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      {profile?.role === 'admin' && (
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-3 text-primary" render={<Link href="/admin" />}>
                          <Settings className="h-4 w-4" /> Admin Console
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer py-3 text-destructive focus:text-destructive focus:bg-destructive/5">
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:inline-flex hover:bg-primary/10 hover:text-primary rounded-full transition-colors")}>
                  <User className="h-5 w-5" />
                </Link>
              )}

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger
                  className="md:hidden"
                  render={
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Menu className="h-6 w-6" />
                    </Button>
                  }
                />
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left">
                    <SheetTitle className="font-black text-2xl tracking-tighter text-primary">GLYDER</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-12">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-xl font-bold transition-colors hover:text-primary",
                          pathname === link.href ? "text-primary" : "text-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <hr className="my-2" />
                    {user ? (
                      <>
                        <Link href="/account" onClick={() => setIsOpen(false)} className="text-xl font-bold hover:text-primary">
                          My Account
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xl font-bold text-primary">
                            Admin Console
                          </Link>
                        )}
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-xl font-bold text-destructive text-left">
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold hover:text-primary">
                        Login / Signup
                      </Link>
                    )}
                  </div>
                  <div className="absolute bottom-8 left-6 right-6">
                    <Link href="/shop" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-12 text-lg font-bold">
                        Shop All Products
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
