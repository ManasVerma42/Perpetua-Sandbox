// src/lib/storage.ts
import { Product, Category, SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from '@/types';

const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products',
  CATEGORIES: 'ecommerce_categories',
  CART: 'ecommerce_cart',
  ORDERS: 'ecommerce_orders',
} as const;

// Typed localStorage access utilities
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    console.warn(`Failed to parse localStorage key "${key}", returning default value`);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set localStorage key "${key}"`, error);
  }
}

// Product storage functions
export function getProducts(): Product[] {
  const stored = getFromStorage<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (stored) {
    return stored;
  }
  // Initialize with sample data
  setToStorage(STORAGE_KEYS.PRODUCTS, SAMPLE_PRODUCTS);
  return SAMPLE_PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  const products = getProducts();
  return products.filter((product) => product.category === categoryId);
}

// Category storage functions
export function getCategories(): Category[] {
  const stored = getFromStorage<Category[] | null>(STORAGE_KEYS.CATEGORIES, null);
  if (stored) {
    return stored;
  }
  // Initialize with sample data
  setToStorage(STORAGE_KEYS.CATEGORIES, SAMPLE_CATEGORIES);
  return SAMPLE_CATEGORIES;
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories();
  return categories.find((category) => category.id === id);
}

// Cart storage functions (for future use)
export function getCart<T>(): T {
  return getFromStorage<T>(STORAGE_KEYS.CART, [] as unknown as T);
}

export function setCart<T>(cart: T): void {
  setToStorage(STORAGE_KEYS.CART, cart);
}

// Order storage functions (for future use)
export function getOrders<T>(): T {
  return getFromStorage<T>(STORAGE_KEYS.ORDERS, [] as unknown as T);
}

export function setOrders<T>(orders: T): void {
  setToStorage(STORAGE_KEYS.ORDERS, orders);
}

// Clear all storage (useful for testing/reset)
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}