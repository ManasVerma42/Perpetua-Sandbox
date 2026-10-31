import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Star, ShoppingCart, Leaf } from "lucide-react";
import { getAllProducts, getCategories } from "@/lib/product-api";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/store/use-cart";
import { toStoreItem } from "@/lib/store-item";

// Announcement Bar Component
function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-accent text-accent-foreground text-xs text-center py-2 px-4 relative">
      <span>
        Free shipping over ₹999 · Use code <strong>EARTH10</strong> for 10% off
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
        aria-label="Close announcement"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl min-h-[520px] bg-gradient-to-br from-secondary to-background">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <img
        src="https://picsum.photos/seed/warmhome/1200/600"
        alt="Beautiful home interior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col justify-end min-h-[520px] p-8 md:p-12">
        <p className="text-sm text-white/80 uppercase tracking-widest mb-3">
          Handcrafted for your home
        </p>
        <h1 className="text-5xl md:text-6xl font-medium leading-[1.05] text-white max-w-xl mb-4">
          Eco-Friendly{" "}
          <em className="font-serif italic">Kitchenware</em> for a greener home
        </h1>
        <p className="text-sm text-white/80 max-w-sm mb-6">
          Discover our curated collection of sustainable, handcrafted products that bring warmth and style to every corner of your home.
        </p>
        <div className="flex gap-3">
          <Button
            size="lg"
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Shop now →
          </Button>
        </div>
      </div>
      {/* Floating stat card */}
      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 w-40 hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="h-4 w-4 text-accent" />
          <span className="text-xs text-white/80">Sustainable</span>
        </div>
        <p className="text-3xl font-serif italic text-white">96%</p>
        <p className="text-xs text-white/60">Eco-friendly materials</p>
      </div>
    </section>
  );
}

// Stats Row Component
function StatsRow() {
  const stats = [
    { value: "10,000+", label: "Products sold" },
    { value: "5,000+", label: "Happy customers" },
    { value: "50+", label: "Artisan partners" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 -mt-8 relative z-20 max-w-2xl mx-auto px-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-secondary rounded-2xl p-4 md:p-6 text-center shadow-sm"
        >
          <p className="text-xl md:text-2xl font-medium text-foreground">
            {stat.value}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// Category Circles Component
function CategoryCircles({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[11px] tracking-widest text-muted-foreground uppercase mb-4">
          BROWSE
        </p>
        <h2 className="text-3xl font-medium tracking-tight mb-8">
          Shop by <em className="font-serif italic">Category</em>
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="size-24 md:size-28 rounded-full overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-primary transition-all">
                <img
                  src={`https://picsum.photos/seed/${category.id}/200/200`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category.id === "electronics" ? "5" : category.id === "fitness" ? "2" : category.id === "clothing" ? "2" : "2"} products
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products Component
function FeaturedProducts({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-widest text-muted-foreground uppercase mb-2">
              FEATURED
            </p>
            <h2 className="text-2xl md:text-3xl text-muted-foreground">
              Bestselling ✧ <em className="font-serif italic text-foreground">Products</em>
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm text-primary hover:underline hidden md:block"
          >
            View all →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/shop">
            <Button variant="outline" className="rounded-full">
              View all products →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const hasDiscount = product.oldPrice !== undefined || product.originalPrice !== undefined;
  const tag = product.inStock ? (hasDiscount ? "SALE" : "New") : "Sold Out";

  return (
    <div className="group">
      <div className="relative bg-secondary rounded-2xl aspect-[4/5] overflow-hidden mb-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Tag pill */}
        {tag && (
          <span
            className={cn(
              "absolute top-4 left-4 text-[10px] uppercase tracking-wide px-3 py-1 rounded-full",
              tag === "SALE"
                ? "bg-destructive text-destructive-foreground"
                : tag === "Sold Out"
                ? "bg-muted text-muted-foreground"
                : "border border-foreground text-foreground italic"
            )}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Color dots */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex gap-1.5 mb-2">
          {product.colors.slice(0, 4).map((color, index) => (
            <span
              key={index}
              className="size-3 rounded-full border border-muted-foreground/20"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      )}

      {/* Category */}
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {product.categoryId || product.category || "General"}
      </p>

      {/* Name */}
      <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>

      {/* Rating */}
      {product.rating !== undefined && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating || 0)
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount || 0})
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        {hasDiscount && (
          <span className="text-xs text-muted-foreground line-through">
            ${(product.oldPrice || product.originalPrice)?.toFixed(2)}
          </span>
        )}
        <span className="font-semibold">${product.price.toFixed(2)}</span>
      </div>

      {/* Add to cart button */}
      <Button
        size="sm"
        className="rounded-full w-full"
        disabled={!product.inStock}
        onClick={() => add(toStoreItem(product))}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {product.inStock ? "Add to cart" : "Sold Out"}
      </Button>
    </div>
  );
}

// Loading Skeleton for Product Card
function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] rounded-2xl" />
      <div className="flex gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="size-3 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  );
}

// Main Home Component
export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const fetchedProducts = getAllProducts();
        const fetchedCategories = getCategories();
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <HeroSection />
        <StatsRow />
      </main>

      <CategoryCircles categories={categories} />

      {loading ? (
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <FeaturedProducts products={products} />
      )}
    </div>
  );
}

export default Home;