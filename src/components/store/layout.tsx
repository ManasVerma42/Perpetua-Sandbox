import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartDrawer, CartDrawerTrigger } from '@/components/store/cart-drawer';
import { useCart } from '@/components/store/use-cart';

interface LayoutProps {
  brand?: string;
  announcement?: string;
}

export function StoreLayout({ brand = 'Store', announcement }: LayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-primary py-2 text-center text-xs text-primary-foreground">
          {announcement}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Left: Menu (mobile) + Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-xl font-semibold tracking-tight">
              {brand}
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          {/* Right: Search, Account, Cart */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
            <CartDrawerTrigger onClick={() => setCartOpen(true)}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            </CartDrawerTrigger>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {brand}. All rights reserved.
            </p>
            <nav className="flex items-center gap-6">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="/account"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

export function Layout(props: LayoutProps) {
  return <StoreLayout {...props} />;
}

export default StoreLayout;