/**
 * Product API Layer
 * Provides functions for product data management, search, and filtering
 * Single source of truth for product data across the application
 */

import { Product, Category, ProductSearchParams } from "@/types";
import {
  getProducts as getStoredProducts,
  getProductById as getStoredProductById,
  getProductsByCategory as getStoredProductsByCategory,
  getCategories as getStoredCategories,
} from "@/lib/storage";

/**
 * Get all products from storage
 * @returns Array of Product objects
 */
export function getAllProducts(): Product[] {
  return getStoredProducts();
}

/**
 * Get a single product by ID
 * @param id Product ID to search for
 * @returns Product object or null if not found
 */
export function getProductById(id: string): Product | null {
  const product = getStoredProductById(id);
  return product ?? null;
}

/**
 * Get products filtered by category slug
 * @param category Category slug to filter by
 * @returns Array of products in the specified category
 */
export function getProductsByCategory(category: string): Product[] {
  return getStoredProductsByCategory(category);
}

/**
 * Search products by keyword (name matching)
 * @param keyword Search keyword to filter products by name
 * @returns Array of products matching the keyword
 */
export function searchProducts(keyword: string): Product[];
/**
 * Search products with advanced filtering and sorting
 * @param params Search parameters object
 * @returns Array of products matching the criteria
 */
export function searchProducts(params: ProductSearchParams): Product[];
export function searchProducts(param: string | ProductSearchParams): Product[] {
  const products = getAllProducts();

  // Handle string keyword search (simple overload)
  if (typeof param === "string") {
    const keyword = param.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
  }

  // Handle ProductSearchParams object
  const params = param;
  let filteredProducts = products.filter((product) => {
    // Category filter
    if (params.categoryId && product.category !== params.categoryId) {
      return false;
    }

    // In-stock filter
    if (params.inStock !== undefined && product.inStock !== params.inStock) {
      return false;
    }

    // Price range filters
    if (params.minPrice !== undefined && product.price < params.minPrice) {
      return false;
    }

    if (params.maxPrice !== undefined && product.price > params.maxPrice) {
      return false;
    }

    // Text search
    if (
      params.query &&
      !product.name.toLowerCase().includes(params.query.toLowerCase()) &&
      !product.description.toLowerCase().includes(params.query.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Apply sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case "priceAsc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredProducts.sort((a, b) => {
          const ratingA = 0;
          const ratingB = 0;
          return ratingB - ratingA;
        });
        break;
      case "newest":
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }
  }

  // Apply pagination
  if (params.page !== undefined && params.pageSize !== undefined) {
    const startIndex = (params.page - 1) * params.pageSize;
    filteredProducts = filteredProducts.slice(
      startIndex,
      startIndex + params.pageSize
    );
  }

  return filteredProducts;
}

/**
 * Get all categories
 * @returns Array of Category objects
 */
export function getCategories(): Category[] {
  return getStoredCategories();
}

/**
 * Get featured products for homepage display
 * Returns products marked with 'featured' tag or a selection of products
 * @returns Array of featured Product objects
 */
export function getFeaturedProducts(): Product[] {
  const products = getAllProducts();
  // Return products that have 'featured' in their tags, or fall back to first 4 products
  const featured = products.filter((product) =>
    product.tags?.includes("featured")
  );
  if (featured.length > 0) {
    return featured;
  }
  // Fallback: return up to 4 products as featured
  return products.slice(0, 4);
}

/**
 * Filter products based on category and other filter options
 * @param categoryId Category ID to filter by
 * @returns Filtered products
 */
export function filterProducts(categoryId: string): Product[] {
  return getProductsByCategory(categoryId);
}