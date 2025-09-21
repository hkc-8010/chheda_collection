'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductCard } from '@/components/products/product-card';

// Mock data - In a real app, this would come from your API/database
const mockProducts = [
  {
    id: 'tshirt-1',
    name: 'Classic Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
    rating: 4.5,
    reviewCount: 128,
    category: 'T-Shirts',
    stock: 50,
    isSale: true,
  },
  {
    id: 'tshirt-2',
    name: 'Premium Graphic Tee',
    price: 34.99,
    images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
    rating: 4.4,
    reviewCount: 92,
    category: 'T-Shirts',
    stock: 35,
    isNew: true,
  },
  {
    id: 'jeans-1',
    name: 'Slim Fit Denim Jeans',
    price: 79.99,
    originalPrice: 99.99,
    images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
    rating: 4.8,
    reviewCount: 89,
    category: 'Jeans',
    stock: 25,
    isSale: true,
  },
  {
    id: 'jeans-2',
    name: 'Relaxed Straight Jeans',
    price: 69.99,
    images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
    rating: 4.3,
    reviewCount: 67,
    category: 'Jeans',
    stock: 30,
  },
  {
    id: 'shoes-1',
    name: 'Casual Sneakers',
    price: 89.99,
    images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
    rating: 4.6,
    reviewCount: 156,
    category: 'Shoes',
    stock: 40,
  },
  {
    id: 'shoes-2',
    name: 'Athletic Running Shoes',
    price: 129.99,
    images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
    rating: 4.7,
    reviewCount: 203,
    category: 'Shoes',
    stock: 20,
    isNew: true,
  },
];

const mockCategories = [
  { id: 't-shirts', name: 'T-Shirts', count: 2 },
  { id: 'jeans', name: 'Jeans', count: 2 },
  { id: 'shoes', name: 'Shoes', count: 2 },
];

export default function ProductsPage() {
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    categories: string[];
    priceRange: [number, number];
    rating: number | null;
    inStock: boolean;
  }>({
    categories: [],
    priceRange: [0, 200],
    rating: null,
    inStock: false,
  });

  const productsPerPage = 12;
  const priceRange: [number, number] = [0, 200];

  // Filter and search products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category.toLowerCase().replace('-', ''))
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating !== null) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, filters, sortBy]);

  const handleFiltersChange = (newFilters: {
    categories: string[];
    priceRange: [number, number];
    rating: number | null;
    inStock: boolean;
  }) => {
    setFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Implement add to cart logic
  };

  const handleAddToWishlist = (productId: string) => {
    console.log('Add to wishlist:', productId);
    // Implement add to wishlist logic
  };

  const handleQuickView = (productId: string) => {
    console.log('Quick view:', productId);
    // Implement quick view modal
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of quality products
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <ProductFilters
                  onFiltersChange={handleFiltersChange}
                  categories={mockCategories}
                  priceRange={priceRange}
                />
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} products found
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              categories={mockCategories}
              priceRange={priceRange}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilters({
                  categories: [],
                  priceRange: [0, 200],
                  rating: null,
                  inStock: false,
                });
              }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
