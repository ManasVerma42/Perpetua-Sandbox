import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Minus, Plus, Search, ShoppingBag, Trash2, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "./store-data";
import { useCart } from "./use-cart";

export interface StoreLink {
  label: string;
  to: string;
  highlight?: boolean;
}

// Every link points at a page the kit provides (see store-pages.tsx)
const DEFAULT_LINKS: StoreLink[] = [
  { label: "Shop", to: "/shop" },
  { label: "New in", to: "/shop?sort=new" },
  { label: "Deals", to: "/shop?deals=1", highlight: true },
  { label: "About", to: "/about" },
];

/** Thin bar above the header for an offer or a code. */
export function AnnouncementBar({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">{children}</div>
  );
}

/** Serif wordmark, centred links, pill search, account and cart with a count badge. */
export function StoreHeader({
  brand,
  tagline,
  links = DEFAULT_LINKS,
}: {
  brand: string;
  tagline?: string;
  links?: StoreLink[];
}) {
  const { count, openSheet } = useCart();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");

  function search(event: FormEvent) {
    event.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          className="rounded-full p-2 hover:bg-secondary lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/" className="leading-none">
          <span className="font-display text-2xl font-bold tracking-tight">{brand}</span>
          {tagline && (
            <span className="mt-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
              {tagline}
            </span>
          )}
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-foreground",
                  link.highlight ? "text-destructive" : "text-muted-foreground",
                  isActive && "font-medium text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <form onSubmit={search} className="ml-auto hidden md:block lg:ml-6">
          <label className="flex h-10 w-64 items-center gap-2 rounded-full bg-secondary px-4 text-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link to="/account" className="rounded-full p-2 hover:bg-secondary" aria-label="Your orders">
            <User className="size-5" />
          </Link>
          <button
            type="button"
            className="relative rounded-full p-2 hover:bg-secondary"
            aria-label={`Cart, ${count} items`}
            onClick={() => openSheet(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="grid gap-1 border-t px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenu(false)}
              className="rounded-lg px-3 py-2 text-sm hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

/** − 1 + pill. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex h-10 items-center rounded-full border", className)}>
      <button
        type="button"
        className="grid h-full w-10 place-items-center rounded-l-full hover:bg-secondary"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        className="grid h-full w-10 place-items-center rounded-r-full hover:bg-secondary"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/** Cart drawer from the right: lines, quantities, total and checkout. */
export function CartSheet({ checkoutTo = "/checkout" }: { checkoutTo?: string }) {
  const { lines, total, open, openSheet, setQuantity, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && openSheet(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, openSheet]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={() => openSheet(false)}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-display text-xl font-semibold">Your cart</h2>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-secondary"
            aria-label="Close cart"
            onClick={() => openSheet(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add something you love.</p>
            </div>
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto px-6">
            {lines.map((line) => (
              <li key={`${line.item.id}-${line.color}-${line.size}`} className="flex gap-4 py-4">
                <img
                  src={line.item.image}
                  alt={line.item.name}
                  className="size-20 rounded-xl bg-muted object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium">{line.item.name}</p>
                    <p className="font-semibold">{formatPrice(line.item.price * line.quantity)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[line.color, line.size].filter(Boolean).join(" · ") || line.item.category}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantityStepper
                      className="h-8"
                      value={line.quantity}
                      onChange={(value) => setQuantity(line, value)}
                    />
                    <button
                      type="button"
                      className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      aria-label={`Remove ${line.item.name}`}
                      onClick={() => remove(line)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t p-6">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-semibold">{formatPrice(total)}</span>
          </div>
          <Link
            to={checkoutTo}
            onClick={() => openSheet(false)}
            className={cn(
              "flex h-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90",
              lines.length === 0 && "pointer-events-none opacity-50",
            )}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}

export interface FooterColumn {
  title: string;
  links: StoreLink[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Shop", links: [{ label: "All products", to: "/shop" }, { label: "New in", to: "/shop?sort=new" }, { label: "Deals", to: "/shop?deals=1" }] },
  { title: "Help", links: [{ label: "Your orders", to: "/account" }, { label: "Checkout", to: "/checkout" }] },
  { title: "Company", links: [{ label: "About us", to: "/about" }] },
];

/** Brand and mission, link columns, payment chips and a giant faded wordmark. */
export function StoreFooter({
  brand,
  mission = "Thoughtfully made goods, delivered to your door.",
  columns = DEFAULT_COLUMNS,
}: {
  brand: string;
  mission?: string;
  columns?: FooterColumn[];
}) {
  return (
    <footer className="mt-24 border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-xl font-bold">{brand}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{mission}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {column.title}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <p>
          © {new Date().getFullYear()} {brand}. All rights reserved.
        </p>
        <div className="flex gap-2">
          {["Visa", "Mastercard", "PayPal", "UPI"].map((method) => (
            <span key={method} className="rounded border px-2 py-0.5 text-[10px]">
              {method}
            </span>
          ))}
        </div>
      </div>
      <p
        aria-hidden
        className="select-none overflow-hidden whitespace-nowrap px-4 font-display text-[18vw] font-bold leading-[0.8] text-muted-foreground/20"
      >
        {brand}
      </p>
    </footer>
  );
}

/** Header, page, footer and the cart sheet: wrap every store route in this. */
export function StoreLayout({
  brand,
  tagline,
  announcement,
  links,
  children,
}: {
  brand: string;
  tagline?: string;
  announcement?: ReactNode;
  links?: StoreLink[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {announcement && <AnnouncementBar>{announcement}</AnnouncementBar>}
      <StoreHeader brand={brand} tagline={tagline} links={links} />
      <main>{children}</main>
      <StoreFooter brand={brand} />
      <CartSheet />
    </div>
  );
}

export default StoreLayout;
