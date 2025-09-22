'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItemComponent } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCartHydration } from '@/lib/hooks/use-cart-hydration';

export default function CartPage() {
  const isHydrated = useCartHydration();
  const { items, clearCart, syncWithServer } = useCartStore();

  // Sync with server on page load after hydration
  useEffect(() => {
    if (isHydrated) {
      syncWithServer();
    }
  }, [isHydrated, syncWithServer]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground text-lg">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
            
            <div className="text-sm text-muted-foreground">
              <p>Need help finding something?</p>
              <Link href="/products" className="text-primary hover:underline">
                Browse our popular categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cart Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save All for Later
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear Cart
            </Button>
          </div>

          <Separator />

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="pt-6">
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* TODO: Add recommended products component */}
          <div className="text-center text-muted-foreground py-8">
            <p>Recommended products will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
