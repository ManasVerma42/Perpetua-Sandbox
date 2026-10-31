/** Store kit data: the shapes every store component takes, plus sample data to start from. */

export interface StoreColor {
  name: string;
  hex: string;
}

export interface StoreSize {
  label: string;
  soldOut?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  tag?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  colors?: StoreColor[];
  sizes?: StoreSize[];
  details?: Record<string, string>;
}

export interface StoreCategory {
  name: string;
  image: string;
  count?: number;
}

export interface StoreReview {
  name: string;
  role?: string;
  text: string;
  rating: number;
}

export function formatPrice(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

/** A placeholder photo; the seed word keeps it stable between renders. */
export function photo(seed: string, width = 800, height = 800): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

const earth: StoreColor[] = [
  { name: "Forest", hex: "#3f5e4a" },
  { name: "Stone", hex: "#c9b08c" },
  { name: "Choco", hex: "#5a4636" },
  { name: "Slate", hex: "#8a8580" },
];

// Names match the products' categories, so each circle opens a filled shop page
export const SAMPLE_CATEGORIES: StoreCategory[] = [
  { name: "Cookware", image: photo("cookware", 300, 300), count: 2 },
  { name: "Cups & mugs", image: photo("coffee-mugs", 300, 300), count: 1 },
  { name: "Bowls", image: photo("stoneware-bowls", 300, 300), count: 1 },
  { name: "Plates", image: photo("ceramic-plates", 300, 300), count: 1 },
  { name: "Glassware", image: photo("glassware", 300, 300), count: 1 },
  { name: "Kitchen", image: photo("bamboo-kitchen", 300, 300), count: 1 },
];

export const SAMPLE_PRODUCTS: StoreItem[] = [
  {
    id: "heritage-dutch-oven",
    name: "Heritage Dutch Oven",
    price: 129,
    oldPrice: 159,
    image: photo("dutch-oven"),
    images: [photo("dutch-oven"), photo("dutch-oven-lid"), photo("dutch-oven-kitchen"), photo("dutch-oven-set")],
    category: "Cookware",
    tag: "Bestseller",
    rating: 4.9,
    reviews: 512,
    description:
      "Enamelled natural clay with exceptional heat retention, for slow-cooked curries, stews and soups.",
    colors: earth,
    sizes: [{ label: "3 L" }, { label: "5.5 L" }, { label: "7 L" }, { label: "9 L", soldOut: true }],
    details: { Material: "Natural clay, food-safe enamel", Capacity: "5.5 litres", Care: "Hand wash" },
  },
  {
    id: "artisan-mug-set",
    name: "Artisan Mug Set",
    price: 42,
    image: photo("artisan-mugs"),
    category: "Cups & mugs",
    tag: "New",
    rating: 4.8,
    reviews: 128,
    colors: earth.slice(0, 3),
  },
  {
    id: "stone-bowl-set",
    name: "Stone Bowl Set",
    price: 56,
    oldPrice: 68,
    image: photo("stone-bowls"),
    category: "Bowls",
    rating: 4.7,
    reviews: 96,
    colors: earth.slice(1),
  },
  {
    id: "crystal-wine-glasses",
    name: "Crystal Wine Glasses",
    price: 38,
    image: photo("wine-glasses"),
    category: "Glassware",
    rating: 4.6,
    reviews: 74,
  },
  {
    id: "bamboo-utensil-holder",
    name: "Bamboo Utensil Holder",
    price: 24,
    image: photo("bamboo-utensils"),
    category: "Kitchen",
    tag: "Eco",
    rating: 4.8,
    reviews: 210,
  },
  {
    id: "glazed-dinner-plates",
    name: "Glazed Dinner Plates",
    price: 64,
    image: photo("glazed-plates"),
    category: "Plates",
    rating: 4.7,
    reviews: 88,
    colors: earth.slice(0, 2),
  },
  {
    id: "linen-table-runner",
    name: "Linen Table Runner",
    price: 29,
    oldPrice: 35,
    image: photo("table-runner"),
    category: "Linen",
    rating: 4.5,
    reviews: 41,
  },
  {
    id: "copper-kettle",
    name: "Copper Kettle",
    price: 89,
    image: photo("copper-kettle"),
    category: "Cookware",
    tag: "Limited",
    rating: 4.9,
    reviews: 63,
  },
];

export const SAMPLE_REVIEWS: StoreReview[] = [
  { name: "Jane Cooper", role: "Nutritionist", text: "The glass jars are perfect for storage and the bamboo utensils feel great every day.", rating: 5 },
  { name: "Darlene Robertson", role: "Culinary instructor", text: "Fantastic products and fast delivery. My kitchen feels so much greener.", rating: 5 },
  { name: "Jacob Jones", role: "Food blogger", text: "Beautiful finish, and the dutch oven holds heat for hours.", rating: 4 },
  { name: "Esther Howard", role: "Sous chef", text: "My go-to set for daily use. Sturdy, simple and timeless.", rating: 5 },
];
