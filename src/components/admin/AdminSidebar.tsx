'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Settings, 
  ChevronRight,
  Package,
  LogOut,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const adminMenuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
  { id: 'categories', label: 'Categories', icon: Layers, href: '/admin/categories' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r bg-background h-screen sticky top-0">
      <div className="p-8 border-b border-border/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
                <p className="font-black uppercase tracking-tighter text-xl leading-none">GLYDER</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Console</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 py-8 px-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 pb-4">Management</p>
        
        {adminMenuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-4">
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
            {pathname === item.href && <ChevronRight className="h-4 w-4" />}
          </Link>
        ))}
      </div>
      
      <div className="p-6 border-t border-border/50 space-y-4">
        <button
          onClick={() => router.push('/')}
          title="Go back to storefront"
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Switch to User Mode
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-500/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 italic">Enterprise Mode</p>
          <p className="text-[10px] text-muted-foreground font-medium">All actions are logged securely.</p>
        </div>
      </div>
    </aside>
  );
}
