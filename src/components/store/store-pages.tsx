import { useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard, ProductGrid } from "./product-card";
import { ProductDetail } from "./product-detail";
import {
  SAMPLE_CATEGORIES,
  SAMPLE_PRODUCTS,
  SAMPLE_REVIEWS,
  formatPrice,
  photo,
  type StoreCategory,
  type StoreItem,
  type StoreReview,
} from "./store-data";
import {
  CategoryCircles,
  NewsletterBand,
  PromoBand,
  ReviewsBand,
  SectionHeading,
  SplitHero,
  ValueTiles,
} from "./store-sections";
import { useCart } from "./use-cart";

/** The home page: hero, categories, best sellers, values, promo, reviews and newsletter. */
export function StoreHome({
  items = SAMPLE_PRODUCTS,
  categories = SAMPLE_CATEGORIES,
  reviews = SAMPLE_REVIEWS,
}: {
  items?: StoreItem[];
  categories?: StoreCategory[];
  reviews?: StoreReview[];
}) {
  return (
    <>
      <SplitHero
        eyebrow="Thoughtful · planet-first"
        title="Beautiful things for"
        accent="every table"
        text="Handcrafted pieces made from natural, food-safe materials, built to last for years."
        image={photo("store-hero", 900, 900)}
        stats={[
          { value: "12K+", label: "Happy homes" },
          { value: "100%", label: "Food-safe" },
          { value: "4.9★", label: "Average rating" },
        ]}
      />
      <CategoryCircles
        categories={categories}
        heading={<SectionHeading eyebrow="Browse" title="Shop by" accent="category" />}
      />
      <ProductGrid
        items={items}
        heading={
          <SectionHeading
            eyebrow="Browse"
            title="Best selling"
            accent="products"
            action={{ label: "View all", to: "/shop" }}
          />
        }
      />
      <ValueTiles />
      <PromoBand
        title="Seasonal sale"
        accent="up to 35% off"
        text="On ceramics, stoneware and bamboo. Use code SEASON35 at checkout."
        images={items.slice(0, 3).map((item) => item.image)}
      />
      <ReviewsBand reviews={reviews} />
      <NewsletterBand />
    </>
  );
}

/** The catalogue: ?q= search, ?category= filter and a sort. */
export function ShopPage({ items = SAMPLE_PRODUCTS }: { items?: StoreItem[] }) {
  const [params, setParams] = useSearchParams();
  const query = (params.get("q") ?? "").toLowerCase();
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "featured";
  const deals = params.get("deals") === "1";
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const shown = items
    .filter((item) => !query || item.name.toLowerCase().includes(query))
    .filter((item) => !category || item.category === category)
    .filter((item) => !deals || item.oldPrice !== undefined)
    .sort((a, b) =>
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : sort === "new"
            ? Number(b.tag === "New") - Number(a.tag === "New")
            : 0,
    );

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Shop" title={deals ? "Current" : "All"} accent={deals ? "deals" : "products"} />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {["", ...categories].map((name) => (
          <button
            key={name || "all"}
            type="button"
            onClick={() => update("category", name)}
            className={
              category === name
                ? "h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground"
                : "h-9 rounded-full border px-4 text-sm hover:bg-secondary"
            }
          >
            {name || "All"}
          </button>
        ))}
        <select
          value={sort}
          onChange={(event) => update("sort", event.target.value)}
          aria-label="Sort products"
          className="ml-auto h-9 rounded-full border bg-background px-4 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          {shown.length} results for “{params.get("q")}”
        </p>
      )}
      {shown.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-secondary p-12 text-center">
          <p className="font-medium">No products match</p>
          <button type="button" className="mt-2 text-sm underline" onClick={() => setParams({})}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {shown.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/** /product/:id — the product, then a few more to look at. */
export function ProductPage({ items = SAMPLE_PRODUCTS }: { items?: StoreItem[] }) {
  const { id } = useParams();
  const item = items.find((candidate) => candidate.id === id);
  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm underline">
          Back to the shop
        </Link>
      </div>
    );
  }
  return (
    <>
      <ProductDetail item={item} />
      <ProductGrid
        filters={false}
        items={items.filter((other) => other.id !== item.id).slice(0, 4)}
        heading={<SectionHeading title="You may also" accent="like" />}
      />
    </>
  );
}

/** Contact and delivery form beside the order summary; places the order locally. */
export function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const shipping = total >= 99 || total === 0 ? 0 : 9;

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      email: String(form.get("email")),
      lines,
      total: total + shipping,
      placedAt: new Date().toISOString(),
    };
    try {
      const orders = JSON.parse(localStorage.getItem("store-orders") ?? "[]") as unknown[];
      localStorage.setItem("store-orders", JSON.stringify([order, ...orders]));
    } catch {
      // Storage unavailable: the order still shows as placed for this visit
    }
    clear();
    setPlaced(order.id);
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl">Thank you!</h1>
        <p className="mt-2 text-muted-foreground">Order {placed} is confirmed.</p>
        <Link to="/shop" className="mt-6 inline-block text-sm underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
      <form onSubmit={placeOrder} className="grid max-w-xl gap-8">
        <h1 className="font-display text-3xl font-semibold">Checkout</h1>
        <fieldset className="grid gap-4">
          <legend className="mb-2 text-sm font-semibold">Contact</legend>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 text-sm font-semibold">Delivery</legend>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" required autoComplete="street-address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required autoComplete="address-level2" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" name="postcode" required autoComplete="postal-code" />
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={lines.length === 0}
          className="h-12 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Place order · {formatPrice(total + shipping)}
        </button>
      </form>
      <aside className="h-fit rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Order summary</h2>
        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Your cart is empty. <Link to="/shop" className="underline">Find something you love</Link>.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {lines.map((line) => (
              <li key={`${line.item.id}-${line.color}-${line.size}`} className="flex items-center gap-3">
                <img src={line.item.image} alt="" className="size-14 rounded-lg bg-muted object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{line.item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {line.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(line.item.price * line.quantity)}</p>
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-6 grid gap-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{shipping ? formatPrice(shipping) : "Free"}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total + shipping)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

interface PlacedOrder {
  id: string;
  total: number;
  placedAt: string;
  lines: { item: StoreItem; quantity: number }[];
}

/** /account — the orders placed from this browser. */
export function AccountPage() {
  let orders: PlacedOrder[] = [];
  try {
    orders = JSON.parse(localStorage.getItem("store-orders") ?? "[]") as PlacedOrder[];
  } catch {
    orders = [];
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Account" title="Your" accent="orders" />
      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-secondary p-12 text-center">
          <p className="font-medium">No orders yet</p>
          <Link to="/shop" className="mt-2 inline-block text-sm underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{order.id}</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(order.placedAt).toLocaleDateString()} ·{" "}
                {order.lines.map((line) => `${line.quantity}× ${line.item.name}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** /about — the brand story with a photo. */
export function AboutPage({ brand = "Our store" }: { brand?: string }) {
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Made slowly, <em className="font-serif font-normal italic text-primary">built to last</em>
        </h1>
        <p className="mt-5 text-muted-foreground">
          {brand} works with small studios to make everyday pieces from natural materials, with
          low-impact production and fair partnerships.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
        >
          Shop the collection
        </Link>
      </div>
      <img src={photo("workshop", 900, 1100)} alt="" className="aspect-[4/5] w-full rounded-3xl object-cover" />
    </div>
  );
}

/** Any other address. */
export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-sm underline">
        Back home
      </Link>
    </div>
  );
}

export default StoreHome;
