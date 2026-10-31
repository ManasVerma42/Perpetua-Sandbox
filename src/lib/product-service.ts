// src/lib/product-service.ts
export type { Product } from "@/types";

import { Product } from "@/types";

export interface ProductResponse {
  products: Product[];
}

export async function fetchProducts(): Promise<ProductResponse> {
  // Simulate API call with localStorage or mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const products: Product[] = [
        {
          id: "1",
          name: "Sample Product 1",
          description: "This is a sample product.",
          price: 19.99,
          imageUrl: "/placeholder.png",
          images: ["/placeholder.png"],
          category: "Electronics",
          colors: [],
          specifications: {},
          stock: 10,
          tags: [],
          inStock: true,
        },
        {
          id: "2",
          name: "Sample Product 2",
          description: "This is another sample product.",
          price: 29.99,
          imageUrl: "/placeholder.png",
          images: ["/placeholder.png"],
          category: "Clothing",
          colors: [],
          specifications: {},
          stock: 5,
          tags: [],
          inStock: true,
        },
      ];
      resolve({ products });
    }, 500);
  });
}