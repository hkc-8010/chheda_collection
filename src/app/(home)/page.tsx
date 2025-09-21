import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroCarousel } from '@/components/home/hero-carousel';

export default function HomePage() {
  // This would come from your database in a real app
  const featuredProducts = [
    {
      id: 'tshirt-1',
      name: 'Classic Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image: '/images/p11-1.jpg',
      rating: 4.5,
      reviews: 128,
      category: 'T-Shirts',
    },
    {
      id: 'jeans-1',
      name: 'Slim Fit Denim Jeans',
      price: 79.99,
      originalPrice: 99.99,
      image: '/images/p21-1.jpg',
      rating: 4.8,
      reviews: 89,
      category: 'Jeans',
    },
    {
      id: 'shoes-1',
      name: 'Casual Sneakers',
      price: 89.99,
      image: '/images/p31-1.jpg',
      rating: 4.6,
      reviews: 156,
      category: 'Shoes',
    },
    {
      id: 'tshirt-2',
      name: 'Premium Graphic Tee',
      price: 34.99,
      image: '/images/p12-1.jpg',
      rating: 4.4,
      reviews: 92,
      category: 'T-Shirts',
    },
  ];

  const categories = [
    {
      name: 'T-Shirts',
      href: '/products',
      image: '/images/c-tshirts.jpg',
      description: 'Comfortable everyday wear',
    },
    {
      name: 'Jeans',
      href: '/products',
      image: '/images/c-jeans.jpg',
      description: 'Premium denim collection',
    },
    {
      name: 'Shoes',
      href: '/products',
      image: '/images/c-shoes.jpg',
      description: 'Step out in style',
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Carousel */}
      <div className="pt-8">
        <HeroCarousel />
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated collections
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg">
            Handpicked items just for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Sale
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {product.category}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Arrivals</h2>
          <p className="text-muted-foreground text-lg">
            Discover our newest additions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <Link key={`latest-${product.id}`} href={`/products/${product.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      New
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {product.category}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        ${product.price}
                      </span>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
          <p className="text-muted-foreground text-lg">
            Our most popular items
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice().reverse().map((product) => (
            <Link key={`bestseller-${product.id}`} href={`/products/${product.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      Best Seller
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {product.category}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        ${product.price}
                      </span>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals and Discounts Section */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Special Deals</h2>
            <p className="text-muted-foreground text-lg">
              Limited time offers you don&apos;t want to miss
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.filter(p => p.originalPrice).map((product) => (
              <Link key={`deal-${product.id}`} href={`/products/${product.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative h-64">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                      </Badge>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {product.category}
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-red-600">
                            ${product.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">
            Real reviews from real customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              rating: 5,
              comment: "Amazing quality and fast shipping! I've ordered multiple times and never been disappointed.",
              product: "Classic Cotton T-Shirt"
            },
            {
              name: "Mike Chen",
              rating: 5,
              comment: "The jeans fit perfectly and the material is top-notch. Great value for money!",
              product: "Slim Fit Denim Jeans"
            },
            {
              name: "Emily Davis",
              rating: 4,
              comment: "Love the sneakers! Super comfortable and stylish. Will definitely buy again.",
              product: "Casual Sneakers"
            }
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Purchased: {testimonial.product}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, 
            exclusive deals, and fashion tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}