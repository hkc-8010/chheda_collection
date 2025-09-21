import Link from 'next/link';
import { ProductCard } from '@/components/products/product-card';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  stock: number;
  category: {
    id: string;
    name: string;
  };
  reviews: {
    rating: number;
  }[];
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Link 
          href="/products" 
          className="text-primary hover:underline text-sm font-medium"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // Calculate average rating
          const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0;

          return (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                avgRating: Math.round(avgRating * 10) / 10,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
