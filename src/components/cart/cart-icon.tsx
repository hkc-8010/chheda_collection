'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCartHydration } from '@/lib/hooks/use-cart-hydration';
import Link from 'next/link';

export function CartIcon() {
  const isHydrated = useCartHydration();
  const { getTotalItems } = useCartStore();
  
  const itemCount = isHydrated ? getTotalItems() : 0;

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {isHydrated && itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
