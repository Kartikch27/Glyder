'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CartSync } from '@/components/cart/CartSync';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude Navbar and Footer for admin routes and auth pages
  const isExcluded = 
    pathname?.startsWith('/admin') || 
    pathname === '/login' || 
    pathname === '/signup';

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <CartSync />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
