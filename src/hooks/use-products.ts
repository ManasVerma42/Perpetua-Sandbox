/**
 * useProducts Hook
 * Provides reactive product state with loading, error, and data states,
 * plus filter/search functionality
 */

import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories,
  getFeaturedProducts,
} from "@/lib/product-api";
import { Product, Category, ProductSearchParams } from "@/types";

// State interface for the hook
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

// Filter state interface
interface FilterState {
  categoryId: string | null;
  searchQuery: string;
}

// Return type for the hook
interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  loading: boolean;
  error: Error | null;
  filter: FilterState;
  setCategoryFilter: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  search: (keyword: string) => void;
  getById: (id: string) => Product | null;
  getByCategory: (category: string) => Product[];
  getFeatured: () => Product[];
  refresh: () => void;
}

/**
 * Custom hook for managing product state with filtering and search
 * @param initialFilter Optional initial filter state
 * @returns Products state and control functions
 */
export function useProducts(initialFilter?: Partial<FilterState>): UseProductsReturn {
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  const [filter, setFilter] = useState<FilterState>({
    categoryId: initialFilter?.categoryId ?? null,
    searchQuery: initialFilter?.searchQuery ?? "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Load categories and featured products on mount
  useEffect(() => {
    try {
      const cats = getCategories();
      setCategories(cats);
      const featured = getFeaturedProducts();
      setFeaturedProducts(featured);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  // Load products based on filter state
  const loadProducts = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let products: Product[];

      if (filter.categoryId) {
        products = getProductsByCategory(filter.categoryId);
      } else {
        products = getAllProducts();
      }

      // Apply search filter if query exists
      if (filter.searchQuery.trim()) {
        products = searchProducts(filter.searchQuery);
      }

      setState({ products, loading: false, error: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load products");
      setState((prev) => ({ ...prev, loading: false, error }));
    }
  }, [filter.categoryId, filter.searchQuery]);

  // Load products when filter changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Set category filter
  const setCategoryFilter = useCallback((categoryId: string | null) => {
    setFilter((prev) => ({ ...prev, categoryId }));
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setFilter((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  // Search products by keyword
  const search = useCallback((keyword: string) => {
    setFilter((prev) => ({ ...prev, searchQuery: keyword }));
  }, []);

  // Get a single product by ID
  const getById = useCallback((id: string): Product | null => {
    return getProductById(id);
  }, []);

  // Get products by category
  const getByCategory = useCallback((category: string): Product[] => {
    return getProductsByCategory(category);
  }, []);

  // Get featured products
  const getFeatured = useCallback((): Product[] => {
    return getFeaturedProducts();
  }, []);

  // Refresh products from storage
  const refresh = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products: state.products,
    categories,
    featuredProducts,
    loading: state.loading,
    error: state.error,
    filter,
    setCategoryFilter,
    setSearchQuery,
    search,
    getById,
    getByCategory,
    getFeatured,
    refresh,
  };
}

export default useProducts;