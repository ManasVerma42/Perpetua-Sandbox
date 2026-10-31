import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, type StoreItem } from "./store-data";
import { useCart } from "./use-cart";

/** ★ 4.9 (512) */
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}

/** Price with the old price struck through. */
export function Price({ value, old, className }: { value: number; old?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      {old !== undefined && (
        <span className="text-xs text-muted-foreground line-through">{formatPrice(old)}</span>
      )}
      <span className="font-semibold">{formatPrice(value)}</span>
    </span>
  );
}

/** Image on a soft tile, tag pill, colour dots, name, rating, price and a + Cart pill. */
export function ProductCard({ item, href }: { item: StoreItem; href?: string }) {
  const { add } = useCart();
  const to = href ?? `/product/${item.id}`;
  return (
    <article className="group flex flex-col">
      <Link to={to} className="relative block overflow-hidden rounded-2xl bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/80 px-3 py-1 font-serif text-xs italic text-foreground backdrop-blur">
            {item.tag}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        {item.colors && (
          <div className="mb-2 flex gap-1.5">
            {item.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="size-3 rounded-full ring-1 ring-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.category}</p>
        <Link to={to} className="mt-0.5 line-clamp-2 font-medium hover:underline">
          {item.name}
        </Link>
        {item.rating !== undefined && <Rating className="mt-1" value={item.rating} count={item.reviews} />}
        <div className="mt-auto flex items-center justify-between pt-3">
          <Price value={item.price} old={item.oldPrice} />
          <button
            type="button"
            onClick={() => add(item)}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3.5" /> Cart
          </button>
        </div>
      </div>
    </article>
  );
}

/** Section of product cards with category filter pills. */
export function ProductGrid({
  items,
  heading,
  filters = true,
  columns = 4,
}: {
  items: StoreItem[];
  heading?: ReactNode;
  filters?: boolean;
  columns?: 3 | 4;
}) {
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];
  const [active, setActive] = useState("All");
  const shown = active === "All" ? items : items.filter((item) => item.category === active);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        {heading}
        {filters && categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={cn(
                  "h-8 rounded-full border px-4 text-xs transition-colors",
                  active === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-secondary",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl bg-secondary p-10 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {shown.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductCard;
