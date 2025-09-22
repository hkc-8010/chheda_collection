'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore, CartItem } from '@/lib/stores/cart-store';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItem;
  showSaveForLater?: boolean;
}

export function CartItemComponent({ item, showSaveForLater = true }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stock) return;
    
    setIsUpdating(true);
    updateQuantity(item.productId, newQuantity);
    
    // Simulate a small delay for better UX
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.stock) {
      handleQuantityChange(value);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  const handleSaveForLater = () => {
    // TODO: Implement save for later functionality
    console.log('Save for later:', item.productId);
  };

  const subtotal = item.price * item.quantity;
  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;

  return (
    <Card className={cn("overflow-hidden", isOutOfStock && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Link href={`/products/${item.productId}`}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-md hover:scale-105 transition-transform"
              />
            </Link>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link 
                  href={`/products/${item.productId}`}
                  className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Status */}
            {isLowStock && !isOutOfStock && (
              <Badge variant="outline" className="text-xs mb-2 bg-orange-50 text-orange-600 border-orange-200">
                Only {item.stock} left
              </Badge>
            )}

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating || isOutOfStock}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={handleInputChange}
                    className="w-12 h-8 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min={1}
                    max={item.stock}
                    disabled={isUpdating || isOutOfStock}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.stock || isUpdating || isOutOfStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-semibold">
                    ${subtotal.toFixed(2)}
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {showSaveForLater && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveForLater}
                  className="text-xs h-7"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Save for Later
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
