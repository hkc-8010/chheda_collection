'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Array<{ id: string; name: string; count: number }>;
  priceRange: [number, number];
  filters: FilterState;
}

export function ProductFilters({ onFilterChange, categories, priceRange, filters }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>(filters.priceRange);
  const [selectedRating, setSelectedRating] = useState<number | null>(filters.rating);
  const [inStockOnly, setInStockOnly] = useState(filters.inStock);

  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(newCategories);
    updateFilters({ categories: newCategories });
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setSelectedPriceRange(newRange);
    updateFilters({ priceRange: newRange });
  };

  const handleRatingChange = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    updateFilters({ rating: newRating });
  };

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    updateFilters({ inStock: checked });
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      rating: selectedRating,
      inStock: inStockOnly,
      ...newFilters,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(priceRange);
    setSelectedRating(null);
    setInStockOnly(false);
    onFilterChange({
      categories: [],
      priceRange: priceRange,
      rating: null,
      inStock: false,
    });
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedRating !== null || 
    inStockOnly ||
    selectedPriceRange[0] !== priceRange[0] ||
    selectedPriceRange[1] !== priceRange[1];

  return (
    <div className="w-full space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <Badge key={categoryId} variant="secondary" className="cursor-pointer">
                  {category.name}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => handleCategoryChange(categoryId, false)}
                  />
                </Badge>
              ) : null;
            })}
            {selectedRating && (
              <Badge variant="secondary" className="cursor-pointer">
                {selectedRating}+ Stars
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={() => handleRatingChange(selectedRating)}
                />
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="cursor-pointer">
                In Stock
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={() => handleInStockChange(false)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Categories Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Price Range</h4>
        <div className="px-2">
          <Slider
            value={selectedPriceRange}
            onValueChange={handlePriceRangeChange}
            max={priceRange[1]}
            min={priceRange[0]}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>${selectedPriceRange[0]}</span>
            <span>${selectedPriceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Customer Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleRatingChange(rating)}
            >
              <Checkbox
                checked={selectedRating === rating}
                onCheckedChange={() => {}}
              />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm ml-1">& Up</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Availability</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={handleInStockChange}
          />
          <label
            htmlFor="in-stock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );
}
