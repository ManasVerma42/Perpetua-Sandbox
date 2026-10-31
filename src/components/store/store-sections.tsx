import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Quote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoreCategory, StoreReview } from "./store-data";

/** "BROWSE" eyebrow and a serif heading whose last words are italic, with an action on the right. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  action,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {title} {accent && <em className="font-serif font-normal italic text-primary">{accent}</em>}
        </h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex h-9 items-center gap-1 rounded-full border px-4 text-sm hover:bg-secondary"
        >
          {action.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export interface HeroStat {
  value: string;
  label: string;
}

/** Tinted band: eyebrow, heading with an italic phrase, two pill buttons, a stats row, product image. */
export function SplitHero({
  eyebrow,
  title,
  accent,
  text,
  image,
  primary = { label: "Shop now", to: "/shop" },
  secondary = { label: "New arrivals", to: "/shop?sort=new" },
  stats = [],
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: string;
  image: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  stats?: HeroStat[];
}) {
  return (
    <section className="bg-secondary">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
          )}
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {title}{" "}
            {accent && <em className="font-serif font-normal italic text-primary">{accent}</em>}
          </h1>
          {text && <p className="mt-5 max-w-md text-muted-foreground">{text}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={primary.to}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {primary.label} <ArrowRight className="size-4" />
            </Link>
            <Link
              to={secondary.to}
              className="inline-flex h-12 items-center rounded-full border border-foreground/30 px-7 text-sm font-medium hover:bg-background"
            >
              {secondary.label}
            </Link>
          </div>
          {stats.length > 0 && (
            <dl className="mt-12 flex flex-wrap divide-x divide-border">
              {stats.map((stat) => (
                <div key={stat.label} className="px-6 first:pl-0">
                  <dt className="text-2xl font-medium">{stat.value}</dt>
                  <dd className="text-[11px] text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <img src={image} alt="" className="aspect-square w-full rounded-3xl object-cover" />
      </div>
    </section>
  );
}

/** Rounded photo with a dark gradient, white heading, cream pill and a glass stat card. */
export function PhotoHero({
  title,
  accent,
  text,
  image,
  cta = { label: "Shop now", to: "/shop" },
  stat,
}: {
  title: string;
  accent?: string;
  text?: string;
  image: string;
  cta?: { label: string; to: string };
  stat?: { lines: string[]; value: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      <div className="relative min-h-[520px] overflow-hidden rounded-3xl">
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative flex min-h-[520px] flex-col justify-end p-8 md:p-12">
          <h1 className="max-w-xl font-display text-5xl font-medium leading-[1.05] text-white md:text-6xl">
            {title} {accent && <em className="font-serif font-normal italic">{accent}</em>}
          </h1>
          {text && <p className="mt-4 max-w-sm text-sm text-white/80">{text}</p>}
          <Link
            to={cta.to}
            className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground"
          >
            {cta.label} <ArrowRight className="size-4" />
          </Link>
        </div>
        {stat && (
          <div className="absolute bottom-8 right-8 hidden w-44 rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur md:block">
            <Leaf className="ml-auto size-5" />
            {stat.lines.map((line) => (
              <p key={line} className="text-xs leading-snug">
                {line}
              </p>
            ))}
            <p className="mt-6 font-serif text-4xl italic">{stat.value}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Round category photos with names and counts. */
export function CategoryCircles({ categories, heading }: { categories: StoreCategory[]; heading?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {heading && <div className="mb-10">{heading}</div>}
      <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="group text-center"
          >
            <img
              src={category.image}
              alt={category.name}
              className="mx-auto aspect-square w-full max-w-28 rounded-full object-cover transition-transform group-hover:scale-105"
            />
            <p className="mt-3 font-serif text-sm">{category.name}</p>
            {category.count !== undefined && (
              <p className="text-xs text-muted-foreground">{category.count} products</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Photo cards with a serif title, a short line and "Shop collection →". */
export function CollectionCards({
  collections,
  heading,
}: {
  collections: { name: string; image: string; line?: string; to?: string }[];
  heading?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {heading && <div className="mb-10">{heading}</div>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection) => (
          <Link key={collection.name} to={collection.to ?? "/shop"} className="group">
            <img
              src={collection.image}
              alt={collection.name}
              className="aspect-[4/3] w-full rounded-2xl object-cover transition-opacity group-hover:opacity-90"
            />
            <p className="mt-3 font-display text-lg">{collection.name}</p>
            {collection.line && <p className="text-xs text-muted-foreground">{collection.line}</p>}
            <p className="mt-2 text-xs font-medium">Shop collection →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const DEFAULT_VALUES = [
  { icon: Truck, title: "Free shipping", text: "On orders over $99" },
  { icon: RotateCcw, title: "30-day returns", text: "Hassle-free policy" },
  { icon: ShieldCheck, title: "2-year warranty", text: "Craft guarantee" },
  { icon: Leaf, title: "Natural materials", text: "Sustainably sourced" },
];

/** Cream tiles: icon in a white circle and a two-line label. */
export function ValueTiles({ items = DEFAULT_VALUES }: { items?: typeof DEFAULT_VALUES }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-4 rounded-2xl bg-secondary p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-primary">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-serif italic">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/** Big rating and a row of quote cards, the middle one raised. */
export function ReviewsBand({
  reviews,
  score = 4.9,
  total = "25,000",
}: {
  reviews: StoreReview[];
  score?: number;
  total?: string;
}) {
  const middle = Math.floor(reviews.length / 2);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-secondary p-8 md:p-10">
        <div className="flex items-end gap-4">
          <p className="font-serif text-5xl italic">
            {score}
            <span className="text-xl text-muted-foreground">/5</span>
          </p>
          <p className="max-w-[14rem] pb-1 text-xs text-muted-foreground">
            More than <strong className="text-foreground">{total}</strong> five-star reviews from
            our customers
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <figure
              key={review.name}
              className={cn(
                "flex flex-col rounded-2xl bg-background/60 p-5",
                index === middle && "bg-card shadow-md lg:-translate-y-3",
              )}
            >
              <Quote className="size-6 fill-primary text-primary" />
              <blockquote className="mt-3 flex-1 text-sm">{review.text}</blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-medium">{review.name}</p>
                {review.role && <p className="text-[11px] text-muted-foreground">{review.role}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Coloured sale band: eyebrow, heading with an italic second line, code, pill button, photos. */
export function PromoBand({
  eyebrow = "Limited time",
  title,
  accent,
  text,
  cta = { label: "Shop the sale", to: "/shop?deals=1" },
  images = [],
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: ReactNode;
  cta?: { label: string; to: string };
  images?: string[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:grid-cols-2 md:p-12">
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-70">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {title}
            {accent && <em className="block font-serif font-normal italic">{accent}</em>}
          </h2>
          {text && <p className="mt-4 max-w-sm text-sm opacity-80">{text}</p>}
          <Link
            to={cta.to}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-background px-6 text-sm font-medium text-foreground"
          >
            {cta.label} <ArrowRight className="size-4" />
          </Link>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((image, index) => (
              <img
                key={image}
                src={image}
                alt=""
                className={cn("aspect-[3/4] w-full rounded-xl object-cover", index === 1 && "translate-y-6")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Dark band with a big serif offer and an email field joined to a subscribe button. */
export function NewsletterBand({
  title = "Get 10% off",
  text = "Recipes, care tips and early access to new collections.",
}: {
  title?: string;
  text?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (email.includes("@")) setDone(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-zinc-950 px-6 py-14 text-center text-white">
        <h2 className="font-display text-4xl font-semibold md:text-6xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">{text}</p>
        {done ? (
          <p className="mt-8 font-serif text-lg italic">Thanks, you're on the list.</p>
        ) : (
          <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-full bg-white/10">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              aria-label="Email address"
              className="h-12 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-white/50"
            />
            <button type="submit" className="bg-accent px-6 text-sm font-medium text-accent-foreground">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default SectionHeading;
