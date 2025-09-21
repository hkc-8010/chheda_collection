import { notFound } from 'next/navigation';
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/db/prisma';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { ProductReviews } from '@/components/products/product-reviews';
import { RelatedProducts } from '@/components/products/related-products';
import { AddToCartButton } from '@/components/products/add-to-cart-button';

type tParams = Promise<{ id: string }>;

interface PageProps {
  params: tParams;
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return {
    ...product,
    price: Number(product.price),
    avgRating: Math.round(avgRating * 10) / 10,
  };
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
    },
    take: 4,
    include: {
      category: true,
      reviews: true,
    },
  });

  return products.map(product => ({
    ...product,
    price: Number(product.price),
  }));
}

export default async function ProductDetailPage(props: PageProps) {
  const { id } = await props.params;
  
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground">
            <span>Home</span> / <span>Products</span> / <span>{product.category.name}</span> / <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {product.avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
              <Badge variant="secondary">{product.category.name}</Badge>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <AddToCartButton product={product} />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Reviews */}
      <ProductReviews 
        productId={product.id} 
        reviews={product.reviews} 
        avgRating={product.avgRating}
      />

      <Separator className="my-12" />

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
