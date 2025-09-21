import { Suspense } from 'react';
import { prisma } from '@/lib/db/prisma';
import { ProductsClient } from '@/components/products/products-client';

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map(product => {
    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    return {
      ...product,
      price: Number(product.price),
      avgRating: Math.round(avgRating * 10) / 10,
    };
  });
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return categories.map(category => ({
    id: category.id,
    name: category.name,
    count: category._count.products,
  }));
}

function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex gap-8">
        <div className="hidden sm:block w-64">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q || '';

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient 
        initialProducts={products}
        categories={categories}
        searchQuery={searchQuery}
      />
    </Suspense>
  );
}