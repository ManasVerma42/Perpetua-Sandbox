/**
 * Product Data Models Layer
 * Types and interfaces for product data structure, category filters, and search parameters
 */

// Product type definition with required fields
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  attributes?: Record<string, string>;
}

// Category type definition for filtering
type Category = {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
};

// Search parameters for product filtering
type ProductSearchParams = {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'priceAsc' | 'priceDesc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
};

// Filter options for category-based filtering
type CategoryFilterOptions = {
  subcategories?: Category[];
  priceRange?: { min: number; max: number };
  attributes?: Record<string, string[]>;
};

// Export all types and interfaces
export type { Product, Category, ProductSearchParams, CategoryFilterOptions };
