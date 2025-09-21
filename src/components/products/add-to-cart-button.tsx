'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual cart functionality
      // For now, just show a success message
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast.success(`Added ${quantity} ${product.name} to cart`);
      
      // Reset quantity after successful add
      setQuantity(1);
    } catch {
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement buy now functionality
      // This would typically add to cart and redirect to checkout
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast.success('Redirecting to checkout...');
      
      // TODO: Redirect to checkout page
      // router.push('/checkout');
    } catch {
      toast.error('Failed to process request');
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
