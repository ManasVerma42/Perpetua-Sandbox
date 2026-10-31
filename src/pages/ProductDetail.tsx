import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Truck, RotateCcw, Shield, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/components/store/use-cart";
import { toStoreItem } from "@/lib/store-item";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceCard } from "@/components/product/PriceCard";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { getProductById } from "@/lib/product-api";
import { cn } from "@/lib/utils";
import type { Product, ProductColor } from "@/types";

// Trust row items
const trustItems = [
  {
    icon: Truck,
    title: "Free shipping",
    description: "Orders over ₹999",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    description: "Easy returns",
  },
  {
    icon: Shield,
    title: "2-year warranty",
    description: "Quality guaranteed",
  },
  {
    icon: Leaf,
    title: "100% eco",
    description: "Sustainable materials",
  },
];

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const { add, openSheet } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error("Product ID is required");
        }

        const fetchedProduct = getProductById(id);
        if (!fetchedProduct) {
          throw new Error("Product not found");
        }

        setProduct(fetchedProduct);
        // Set default color selection
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0].name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    add(toStoreItem(product), quantity, { color: selectedColor });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}${selectedColor ? ` (${selectedColor})` : ""} added to your cart.`,
    });

    // Open cart drawer
    openSheet(true);
  };

  const handleWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "This item has been added to your wishlist.",
    });
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the effect
    window.location.reload();
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb skeleton */}
        <Skeleton className="h-4 w-48 mb-6" />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="size-11 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-16">
          <p className="text-destructive text-lg mb-2">
            {error || "Product not found"}
          </p>
          <p className="text-muted-foreground mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRetry}>
              Try again
            </Button>
            <Button asChild>
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get product images (use images array or fallback to single imageUrl)
  const productImages = product.images || (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          to="/shop"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ChevronLeft className="size-4" />
          <span>Home</span>
          <span className="mx-1">·</span>
          <span>Product details</span>
        </Link>
      </nav>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Gallery - Left side */}
        <div className="lg:col-span-1">
          <ProductGallery
            images={productImages}
            name={product.name}
          />
        </div>

        {/* Product info - Center */}
        <div className="lg:col-span-1 space-y-6">
          {/* Category eyebrow */}
          <p className="text-[11px] tracking-widest text-muted-foreground uppercase">
            {product.category || "PRODUCTS"}
          </p>

          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight">
            {product.name}
          </h1>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "size-4",
                      i < 4 ? "text-primary fill-primary" : "text-muted-foreground/30"
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.8 (128 reviews)
              </span>
            </div>
          )}

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <ColorSwatches
              colors={product.colors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          )}

          {/* Trust row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center text-center gap-2",
                  index < trustItems.length - 1 && "md:border-r md:pr-4"
                )}
              >
                <item.icon className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price card - Right side */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <PriceCard
              price={product.price}
              oldPrice={product.originalPrice}
              name={product.name}
              inStock={product.inStock}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="mt-12">
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Shipping & returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="max-w-3xl">
              <h3 className="text-xl font-semibold mb-4">About this piece</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each piece is carefully crafted with attention to detail and quality materials. Our products are designed to bring warmth and style to your home while maintaining our commitment to sustainability.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="pt-6">
            <div className="max-w-3xl">
              <h3 className="text-xl font-semibold mb-4">Product specifications</h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b last:border-0">
                      <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Product ID</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{product.id}</td>
                    </tr>
                    <tr className="border-b last:border-0">
                      <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Category</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{product.category || "General"}</td>
                    </tr>
                    {product.colors && product.colors.length > 0 && (
                      <tr className="border-b last:border-0">
                        <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Available colors</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {product.colors.map((c: ProductColor) => c.name).join(", ")}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b last:border-0">
                      <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Availability</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={product.inStock ? "text-success" : "text-destructive"}>
                          {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-0">
                      <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Material</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">Premium quality materials</td>
                    </tr>
                    <tr className="border-b last:border-0">
                      <td className="py-3 px-4 bg-muted/50 font-medium text-sm">Warranty</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="pt-6">
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Shipping information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Free shipping on orders over ₹999</li>
                  <li>• Standard delivery: 5-7 business days</li>
                  <li>• Express delivery: 2-3 business days (additional charges apply)</li>
                  <li>• We ship to all major cities across India</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Returns & exchanges</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 30-day return policy</li>
                  <li>• Items must be unused and in original packaging</li>
                  <li>• Free returns on defective items</li>
                  <li>• Refunds processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetail;