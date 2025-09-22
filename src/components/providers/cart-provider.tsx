'use client';

import { useEffect, useState } from 'react';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This ensures the store is only used after hydration
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return children without cart functionality during SSR
    return <>{children}</>;
  }

  return <>{children}</>;
}
