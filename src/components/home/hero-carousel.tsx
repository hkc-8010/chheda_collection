'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Summer Collection 2024',
    subtitle: 'Fresh Styles for the Season',
    description: 'Discover our latest summer collection featuring comfortable t-shirts, stylish shorts, and trendy accessories perfect for the warm weather.',
    image: '/images/banner1.jpg',
    ctaText: 'Shop Summer Collection',
    ctaLink: '/products',
    badge: 'New Arrival',
    badgeVariant: 'default',
  },
  {
    id: '2',
    title: 'Premium Denim Sale',
    subtitle: 'Up to 40% Off',
    description: 'Upgrade your wardrobe with our premium denim collection. From classic fits to modern cuts, find the perfect jeans for every occasion.',
    image: '/images/banner2.jpg',
    ctaText: 'Shop Denim',
    ctaLink: '/products',
    badge: 'Sale',
    badgeVariant: 'destructive',
  },
  {
    id: '3',
    title: 'Footwear Revolution',
    subtitle: 'Step Into Comfort',
    description: 'Experience ultimate comfort with our revolutionary footwear collection. From casual sneakers to formal shoes, we have it all.',
    image: '/images/banner3.jpg',
    ctaText: 'Explore Shoes',
    ctaLink: '/products',
    badge: 'Featured',
    badgeVariant: 'secondary',
  },
  {
    id: '4',
    title: 'Exclusive Member Deals',
    subtitle: 'Members Save More',
    description: 'Join our exclusive membership program and enjoy special discounts, early access to sales, and free shipping on all orders.',
    image: '/images/c-tshirts.jpg',
    ctaText: 'Join Now',
    ctaLink: '/auth/signup',
    badge: 'Exclusive',
    badgeVariant: 'outline',
  },
];

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {slide.badge && (
                      <Badge 
                        variant={slide.badgeVariant || 'default'} 
                        className="text-sm px-4 py-2"
                      >
                        {slide.badge}
                      </Badge>
                    )}
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    
                    <h2 className="text-xl md:text-2xl font-medium text-white/90">
                      {slide.subtitle}
                    </h2>
                    
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                      <Link href={slide.ctaLink}>
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      
                      <Link href="/products">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="border-white text-white hover:bg-white hover:text-black font-semibold px-8"
                        >
                          Browse All Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white hover:text-black" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white hover:text-black" />
      </Carousel>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index + 1
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/30 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
        {current} / {count}
      </div>
    </section>
  );
}
