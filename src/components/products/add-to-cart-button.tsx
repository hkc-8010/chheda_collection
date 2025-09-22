'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cart-store';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    category: {
      name: string;
    };
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCartStore();

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/images/placeholder.jpg',
        stock: product.stock,
        category: product.category.name,
        quantity,
      });
      
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Add to cart first
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/images/placeholder.jpg',
        stock: product.stock,
        category: product.category.name,
        quantity,
      });
      
      // Redirect to cart page
      window.location.href = '/cart';
    } catch (error) {
      console.error('Failed to process buy now:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {product.stock} available
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="flex-1"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={product.stock === 0 || isLoading}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          {isLoading ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-lg font-semibold">
        Total: ${(product.price * quantity).toFixed(2)}
      </div>
    </div>
  );
}
