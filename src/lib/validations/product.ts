import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
  productId: z.string().min(1, 'Product ID is required'),
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
  sortBy: z.enum(['name', 'price', 'createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
