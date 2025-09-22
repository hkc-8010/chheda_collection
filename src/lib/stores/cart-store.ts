'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  addItem: (product: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (productId: string) => CartItem | undefined;
  
  // Persistence
  syncWithServer: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.productId);
        const quantityToAdd = product.quantity || 1;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantityToAdd;
          
          if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
          }

          set({
            items: items.map(item =>
              item.productId === product.productId
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          
          toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
        } else {
          if (quantityToAdd > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
          }

          const newItem: CartItem = {
            ...product,
            quantity: quantityToAdd,
            id: `cart-${product.productId}-${Date.now()}`,
          };

          set({ items: [...items, newItem] });
          toast.success(`Added ${product.name} to cart`);
        }

        // Sync with server in background
        get().syncWithServer();
      },

      removeItem: (productId) => {
        const { items } = get();
        const item = items.find(item => item.productId === productId);
        
        set({
          items: items.filter(item => item.productId !== productId),
        });
        
        if (item) {
          toast.success(`Removed ${item.name} from cart`);
        }

        // Sync with server in background
        get().syncWithServer();
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const item = items.find(item => item.productId === productId);
        
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available in stock`);
          return;
        }

        set({
          items: items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        });

        // Sync with server in background
        get().syncWithServer();
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
        
        // Sync with server in background
        get().syncWithServer();
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemById: (productId) => {
        return get().items.find(item => item.productId === productId);
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      syncWithServer: async () => {
        try {
          const { items } = get();
          
          // Only sync if user is authenticated
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
          });

          if (!response.ok && response.status !== 401) {
            console.error('Failed to sync cart with server');
          }
        } catch (error) {
          console.error('Cart sync error:', error);
          // Don't show error to user as this is background sync
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on the client side
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true, // Skip hydration to prevent SSR mismatch
    }
  )
);
