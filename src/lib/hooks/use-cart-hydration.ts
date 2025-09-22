'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';

export function useCartHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
