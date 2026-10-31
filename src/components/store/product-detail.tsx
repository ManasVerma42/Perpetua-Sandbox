import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, type StoreItem } from "./store-data";
import { Rating } from "./product-card";
import { QuantityStepper } from "./store-layout";
import { useCart } from "./use-cart";

/** Home › Category › Product */
export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {trail.map((crumb, index) => (
        <span key={crumb.label} className="inline-flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-3.5" />}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-foreground">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Large image with a sale pill, thumbnails below. */
export function Gallery({ item }: { item: StoreItem }) {
  const images = item.images?.length ? item.images : [item.image];
  const [current, setCurrent] = useState(0);
  const sale = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img src={images[current]} alt={item.name} className="aspect-square w-full object-cover" />
        {sale > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Sale {sale}%
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "overflow-hidden rounded-xl bg-muted ring-offset-2 ring-offset-background",
                index === current && "ring-2 ring-primary",
              )}
            >
              <img src={image} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TRUST = [
  { icon: Truck, title: "Free shipping", text: "Orders over $99" },
  { icon: RotateCcw, title: "30-day returns", text: "Hassle-free" },
  { icon: ShieldCheck, title: "2-year warranty", text: "Craft guarantee" },
];

/** Title, rating, price card, colour swatches, size boxes, quantity, add to cart and trust row. */
export function ProductInfo({ item }: { item: StoreItem }) {
  const { add } = useCart();
  const [color, setColor] = useState(item.colors?.[0]?.name);
  const firstSize = item.sizes?.find((size) => !size.soldOut)?.label;
  const [size, setSize] = useState(firstSize);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const [first, ...rest] = item.name.split(" ");

  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{item.category}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
        {first}
        {rest.length > 0 && <em className="block font-serif font-normal italic">{rest.join(" ")}</em>}
      </h1>
      {item.description && <p className="mt-4 max-w-lg text-muted-foreground">{item.description}</p>}
      {item.rating !== undefined && (
        <Rating className="mt-4 text-sm" value={item.rating} count={item.reviews} />
      )}

      <div className="mt-6 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl font-bold tracking-tight">{formatPrice(item.price)}</span>
          {item.oldPrice && (
            <>
              <span className="text-muted-foreground line-through">{formatPrice(item.oldPrice)}</span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Save {formatPrice(item.oldPrice - item.price)}
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          or {formatPrice(Math.ceil(item.price / 12))}/month · 12 months · 0% interest
        </p>
      </div>

      {item.colors && item.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide">
            Colour — <span className="text-primary">{color}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {item.colors.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setColor(option.name)}
                className="grid justify-items-center gap-1 text-xs text-muted-foreground"
                aria-pressed={color === option.name}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full ring-offset-2 ring-offset-background",
                    color === option.name ? "ring-2 ring-primary" : "ring-1 ring-border",
                  )}
                  style={{ backgroundColor: option.hex }}
                >
                  {color === option.name && <Check className="size-4 text-white" />}
                </span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {item.sizes && item.sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide">
            Size — <span className="text-primary">{size}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {item.sizes.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled={option.soldOut}
                onClick={() => setSize(option.label)}
                className={cn(
                  "h-12 min-w-24 rounded-xl border px-4 text-sm transition-colors",
                  size === option.label
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-secondary",
                  option.soldOut && "cursor-not-allowed line-through opacity-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <QuantityStepper className="h-14" value={quantity} onChange={setQuantity} />
        <button
          type="button"
          onClick={() => add(item, quantity, { color, size })}
          className="h-14 flex-1 rounded-full bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={() => setSaved(!saved)}
          aria-pressed={saved}
          className="inline-flex h-14 items-center gap-2 rounded-full border border-foreground/30 px-6 text-sm hover:bg-secondary"
        >
          <Heart className={cn("size-4", saved && "fill-destructive text-destructive")} /> Wishlist
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 divide-x rounded-2xl border">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-2 p-4">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium">{title}</p>
              <p className="text-[11px] text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Underline tabs: description and specifications, shipping. */
export function ProductTabs({ item }: { item: StoreItem }) {
  const tabs = ["Description", "Specifications", "Shipping & returns"];
  const [active, setActive] = useState(tabs[0]);
  return (
    <section className="mt-16 border-t">
      <div className="flex gap-8 overflow-x-auto border-b" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 py-4 text-sm",
              active === tab
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="py-8">
        {active === "Description" && (
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl">About this piece</h3>
            <p className="mt-3 text-muted-foreground">
              {item.description ?? "Made to last, designed for everyday use."}
            </p>
          </div>
        )}
        {active === "Specifications" && (
          <dl className="max-w-2xl rounded-2xl border bg-card p-6">
            {Object.entries(item.details ?? { Category: item.category }).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 border-b py-3 text-sm last:border-0">
                <dt className="text-muted-foreground">{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {active === "Shipping & returns" && (
          <p className="max-w-2xl text-muted-foreground">
            Free shipping on orders over $99, delivered in 3–5 working days. Return anything
            within 30 days for a full refund.
          </p>
        )}
      </div>
    </section>
  );
}

/** The whole product page body: breadcrumbs, gallery beside the info, then tabs. */
export function ProductDetail({ item }: { item: StoreItem }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        trail={[
          { label: "Home", to: "/" },
          { label: item.category, to: `/shop?category=${encodeURIComponent(item.category)}` },
          { label: item.name },
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Gallery item={item} />
        <ProductInfo item={item} />
      </div>
      <ProductTabs item={item} />
    </div>
  );
}

export default ProductDetail;
