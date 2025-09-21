// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  reviews?: Review[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  products?: Product[];
  children?: Category[];
}

// Order types
export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
  product?: Product;
}

// Cart types
export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
