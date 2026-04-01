'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/use-cart';
import { createClient } from '@/lib/supabase/client';

export const CartSync = () => {
  const setItems = useCart((state) => state.setItems);
  const clearCart = useCart((state) => state.clearCart);
  const supabase = createClient();

  useEffect(() => {
    const syncCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            // sync local items first if any, then fetch merged
            const localItems = useCart.getState().items;
            if (localItems.length > 0) {
              await fetch('/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: localItems })
              });
              // re-fetch after sync
              const mergedRes = await fetch('/api/cart');
              if (mergedRes.ok) {
                const mergedData = await mergedRes.json();
                setItems(mergedData.items || []);
              }
            } else {
              setItems(data.items || []);
            }
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    syncCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        syncCart();
      } else if (event === 'SIGNED_OUT') {
        clearCart();
      }
    });

    return () => subscription.unsubscribe();
  }, [setItems, clearCart, supabase]);

  return null;
};
