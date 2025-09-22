'use client';

import { useState } from 'react';
import { Truck, Tag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart-store';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();
  
  // Calculate shipping
  const freeShippingThreshold = 50;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 9.99;
  
  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = subtotal * (appliedPromo.discount / 100);
    } else {
      discount = appliedPromo.discount;
    }
  }
  
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    
    // Simulate API call to validate promo code
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock promo codes
    const promoCodes = {
      'SAVE10': { discount: 10, type: 'percentage' as const },
      'WELCOME': { discount: 15, type: 'percentage' as const },
      'FREESHIP': { discount: 9.99, type: 'fixed' as const },
    };
    
    const promo = promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    
    if (promo) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promo,
      });
      setPromoCode('');
    } else {
      // Show error - invalid promo code
      console.log('Invalid promo code');
    }
    
    setIsApplyingPromo(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span>Items ({totalItems})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Promo Code Section */}
        <div className="space-y-2">
          {appliedPromo ? (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {appliedPromo.code}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromo}
                className="text-green-700 hover:text-green-800 h-6 px-2"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || isApplyingPromo}
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Shipping */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Shipping</span>
            </div>
            <span>
              {shippingCost === 0 ? (
                <Badge variant="secondary" className="text-xs">FREE</Badge>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </span>
          </div>
          
          {subtotal < freeShippingThreshold && (
            <p className="text-xs text-muted-foreground">
              Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping
            </p>
          )}
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({appliedPromo?.code})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        )}

        {/* Security Badge */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secure checkout with SSL encryption
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
