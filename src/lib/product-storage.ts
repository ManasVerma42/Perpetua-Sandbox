/**
 * Product Storage Module
 * Implements centralized product catalogue storage using localStorage
 * Serves as the single source of truth for all product data
 */

import { Product, Category, ProductSearchParams } from "@/types";

const STORAGE_KEY_PRODUCTS = "perpetua_products";
const STORAGE_KEY_CATEGORIES = "perpetua_categories";
const STORAGE_KEY_INITIALIZED = "perpetua_catalogue_initialized";

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=400&fit=crop',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
  },
  {
    id: 'textiles',
    name: 'Textiles',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Modern Oak Armchair',
    price: 449.99,
    originalPrice: 549.99,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop',
    ],
    category: 'furniture',
    colors: [
      { name: 'Natural Oak', hex: '#C4A35A' },
      { name: 'Walnut', hex: '#5D432C' },
      { name: 'White Oak', hex: '#E8DCC4' },
    ],
    description: 'A beautifully crafted oak armchair with a modern silhouette. Perfect for any living space, featuring ergonomic design and premium materials.',
    specifications: {
      'Material': 'Solid Oak Wood',
      'Dimensions': '28"W x 32"D x 34"H',
      'Weight Capacity': '300 lbs',
      'Assembly': 'Required',
    },
    stock: 15,
    tags: ['modern', 'oak', 'living room', 'chair'],
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Ceramic Vase Set',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop',
    ],
    category: 'home-decor',
    colors: [
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Sage Green', hex: '#9CAF88' },
      { name: 'Terracotta', hex: '#E2725B' },
    ],
    description: 'Handcrafted ceramic vase set of three. Each piece features unique glazing patterns, perfect for fresh or dried arrangements.',
    specifications: {
      'Material': 'Ceramic',
      'Set Includes': '3 vases (Small, Medium, Large)',
      'Small': '4" H x 3" D',
      'Medium': '6" H x 4" D',
      'Large': '8" H x 5" D',
    },
    stock: 24,
    tags: ['ceramic', 'vase', 'decor', 'handcrafted'],
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Linen Throw Blanket',
    price: 129.99,
    originalPrice: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
    ],
    category: 'textiles',
    colors: [
      { name: 'Oatmeal', hex: '#D2B48C' },
      { name: 'Dusty Blue', hex: '#B4C5E4' },
      { name: 'Charcoal', hex: '#36454F' },
    ],
    description: 'Luxuriously soft Belgian linen throw blanket. Pre-washed for extra softness, perfect for layering on sofas or beds.',
    specifications: {
      'Material': '100% Belgian Linen',
      'Dimensions': '50" x 70"',
      'Care': 'Machine wash cold, tumble dry low',
      'Weight': '400 GSM',
    },
    stock: 18,
    tags: ['linen', 'blanket', 'cozy', 'bedroom'],
    inStock: true,
  },
  {
    id: 'prod-004',
    name: 'Artisan Cutting Board',
    price: 64.99,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594226801341-6146c3d2bfd3?w=600&h=600&fit=crop',
    ],
    category: 'kitchen',
    colors: [
      { name: 'Walnut', hex: '#5D432C' },
      { name: 'Maple', hex: '#E0C096' },
      { name: 'Cherry', hex: '#DEB887' },
    ],
    description: 'Handmade walnut cutting board with juice groove. Finished with food-safe mineral oil for lasting beauty and functionality.',
    specifications: {
      'Material': 'Solid Walnut Wood',
      'Dimensions': '18" L x 12" W x 1.5" D',
      'Finish': 'Food-safe mineral oil',
      'Care': 'Hand wash only',
    },
    stock: 30,
    tags: ['cutting board', 'walnut', 'kitchen', 'handmade'],
    inStock: true,
  },
  {
    id: 'prod-005',
    name: 'Velvet Accent Chair',
    price: 599.99,
    originalPrice: 749.99,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    ],
    category: 'furniture',
    colors: [
      { name: 'Emerald', hex: '#50C878' },
      { name: 'Blush', hex: '#DE9DAA' },
      { name: 'Navy', hex: '#000080' },
    ],
    description: 'Luxurious velvet accent chair with gold-finished legs. A statement piece that combines comfort with sophisticated style.',
    specifications: {
      'Material': 'Velvet Upholstery, Gold-finished Metal Legs',
      'Dimensions': '30"W x 32"D x 33"H',
      'Seat Height': '18"',
      'Weight Capacity': '250 lbs',
    },
    stock: 8,
    tags: ['velvet', 'accent', 'chair', 'luxury'],
    inStock: true,
  },
  {
    id: 'prod-006',
    name: 'Woven Wall Art',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1518012312832-28aea3a56f75?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518012312832-28aea3a56f75?w=600&h=600&fit=crop',
    ],
    category: 'home-decor',
    colors: [
      { name: 'Natural', hex: '#FAF0E6' },
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Sand', hex: '#C2B280' },
    ],
    description: 'Hand-woven macramé wall hanging with wooden dowel. Each piece is unique, adding texture and warmth to any room.',
    specifications: {
      'Material': 'Cotton Cord, Wooden Dowel',
      'Dimensions': '24" W x 48" L',
      'Care': 'Spot clean only',
      'Hanging': 'Includes mounting hardware',
    },
    stock: 12,
    tags: ['macrame', 'wall art', 'boho', 'handmade'],
    inStock: true,
  },
  {
    id: 'prod-007',
    name: 'Cotton Duvet Cover',
    price: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce6589c69?w=600&h=600&fit=crop',
    ],
    category: 'textiles',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Grey', hex: '#D3D3D3' },
      { name: 'Soft Pink', hex: '#FFB6C1' },
    ],
    description: '100% organic cotton duvet cover with button closure. Soft, breathable, and sustainably sourced for restful sleep.',
    specifications: {
      'Material': '100% Organic Cotton',
      'Available Sizes': 'Twin, Full, Queen, King',
      'Thread Count': '300 TC',
      'Care': 'Machine wash cold, tumble dry low',
    },
    stock: 20,
    tags: ['organic', 'cotton', 'duvet', 'bedding'],
    inStock: true,
  },
  {
    id: 'prod-008',
    name: 'Copper Cookware Set',
    price: 449.99,
    originalPrice: 549.99,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-44e3e70034d2?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556909114-44e3e70034d2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&h=600&fit=crop',
    ],
    category: 'kitchen',
    colors: [
      { name: 'Copper', hex: '#B87333' },
      { name: 'Stainless', hex: '#C0C0C0' },
    ],
    description: 'Professional-grade copper cookware set of 5 pieces. Excellent heat conductivity with stainless steel lining.',
    specifications: {
      'Material': 'Copper exterior, Stainless Steel interior',
      'Set Includes': '8" Fry Pan, 10" Fry Pan, 2qt Saucepan, 3qt Saute Pan, 6qt Stockpot',
      'Handle': 'Cast iron handles',
      'Oven Safe': 'Up to 500°F',
    },
    stock: 10,
    tags: ['copper', 'cookware', 'professional', 'kitchen'],
    inStock: true,
  },
  {
    id: 'prod-009',
    name: 'Minimalist Bookshelf',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762242a1e5?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762242a1e5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    ],
    category: 'furniture',
    colors: [
      { name: 'Natural Oak', hex: '#C4A35A' },
      { name: 'Walnut', hex: '#5D432C' },
      { name: 'Matte Black', hex: '#1C1C1C' },
    ],
    description: 'Sleek minimalist bookshelf with open shelving design. Perfect for displaying books, plants, and decorative objects.',
    specifications: {
      'Material': 'Engineered Wood with Real Wood Veneer',
      'Dimensions': '36"W x 12"D x 72"H',
      'Shelves': '5 adjustable shelves',
      'Weight Capacity': '50 lbs per shelf',
    },
    stock: 6,
    tags: ['bookshelf', 'minimalist', 'storage', 'modern'],
    inStock: true,
  },
  {
    id: 'prod-010',
    name: 'Handwoven Basket Set',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&h=600&fit=crop',
    ],
    category: 'home-decor',
    colors: [
      { name: 'Natural', hex: '#D2B48C' },
      { name: 'White Wash', hex: '#F5F5DC' },
    ],
    description: 'Set of 3 handwoven seagrass baskets with lids. Stylish storage solution for any room in your home.',
    specifications: {
      'Material': 'Seagrass with Metal Frame',
      'Set Includes': 'Small (10"), Medium (12"), Large (14")',
      'Care': 'Wipe clean with damp cloth',
      'Lids': 'Included for all sizes',
    },
    stock: 22,
    tags: ['basket', 'storage', 'seagrass', 'handwoven'],
    inStock: true,
  },
  {
    id: 'prod-011',
    name: 'Merino Wool Throw',
    price: 199.99,
    originalPrice: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=600&fit=crop',
    ],
    category: 'textiles',
    colors: [
      { name: 'Oatmeal', hex: '#D2B48C' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Forest Green', hex: '#228B22' },
    ],
    description: 'Luxuriously soft New Zealand merino wool throw. Naturally temperature-regulating for year-round comfort.',
    specifications: {
      'Material': '100% New Zealand Merino Wool',
      'Dimensions': '50" x 70"',
      'Weight': '450 GSM',
      'Care': 'Dry clean or hand wash cold',
    },
    stock: 14,
    tags: ['merino', 'wool', 'throw', 'luxury'],
    inStock: true,
  },
  {
    id: 'prod-012',
    name: 'Stone Mortar & Pestle',
    price: 54.99,
    imageUrl: 'https://images.unsplash.com/photo-1585442235537-923d62e4a636?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1585442235537-923d62e4a636?w=600&h=600&fit=crop',
    ],
    category: 'kitchen',
    colors: [
      { name: 'Grey Granite', hex: '#696969' },
      { name: 'Black Marble', hex: '#1C1C1C' },
    ],
    description: 'Hand-carved granite mortar and pestle for grinding spices and herbs. A timeless kitchen essential.',
    specifications: {
      'Material': 'Solid Granite',
      'Dimensions': '4" D x 3" H',
      'Capacity': '1.5 cups',
      'Weight': '3.5 lbs',
    },
    stock: 28,
    tags: ['mortar', 'pestle', 'granite', 'spices'],
    inStock: true,
  },
];

function initializeStorage(): void {
  try {
    const initialized = localStorage.getItem(STORAGE_KEY_INITIALIZED);
    if (!initialized) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
      localStorage.setItem(STORAGE_KEY_INITIALIZED, "true");
    }
  } catch (error) {
    console.error("Error initializing product storage:", error);
  }
}

export function getProductCatalogue(): Product[] {
  initializeStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading product catalogue:", error);
  }
  return [...MOCK_PRODUCTS];
}

export function getProductById(id: string): Product | undefined {
  const products = getProductCatalogue();
  return products.find(product => product.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  const products = getProductCatalogue();
  return products.filter(product => product.category === categoryId);
}

export function searchProducts(params: ProductSearchParams = {}): Product[] {
  let products = getProductCatalogue();

  if (params.query) {
    const query = params.query.toLowerCase();
    products = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (params.categoryId) {
    products = products.filter(product => product.category === params.categoryId);
  }

  if (params.inStock !== undefined) {
    products = products.filter(product => product.inStock === params.inStock);
  }

  if (params.minPrice !== undefined) {
    products = products.filter(product => product.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    products = products.filter(product => product.price <= params.maxPrice!);
  }

  if (params.sortBy) {
    switch (params.sortBy) {
      case 'priceAsc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        break;
    }
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || products.length;
  const startIndex = (page - 1) * pageSize;

  return products.slice(startIndex, startIndex + pageSize);
}

export function getCategories(): Category[] {
  initializeStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading categories:", error);
  }
  return [...MOCK_CATEGORIES];
}