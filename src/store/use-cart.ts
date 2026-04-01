import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      setItems: (items) => set({ items: Array.isArray(items) ? items : [] }),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items;
        if (!Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const items = get().items;
        if (!Array.isArray(items)) return 0;
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'glyder-cart-storage',
      // Migration: if persisted state has corrupted items (object instead of array), reset it
      merge: (persisted: any, current) => {
        if (persisted && !Array.isArray(persisted.items)) {
          return { ...current, items: [] };
        }
        return { ...current, ...persisted };
      },
    }
  )
);
