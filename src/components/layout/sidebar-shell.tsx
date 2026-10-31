import { useState, type ComponentType, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  to: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};
export type SidebarGroup = { label?: string; items: SidebarItem[] };

/** For apps with many sections: fixed sidebar on large screens, a drawer on small ones. */
export function SidebarShell({
  title,
  groups,
  footer,
  actions,
  children,
}: {
  title: string;
  groups: SidebarGroup[];
  footer?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {groups.map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-1">
          {group.label && (
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
          )}
          {group.items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
  const brand = (
    <div className="flex h-16 items-center px-6 text-base font-semibold tracking-tight">{title}</div>
  );
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex">
        {brand}
        {nav}
        {footer && <div className="border-t p-4">{footer}</div>}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-xl">
            {brand}
            {nav}
            {footer && <div className="border-t p-4">{footer}</div>}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-6 backdrop-blur">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="-ml-2 rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <span aria-hidden className="block h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

export default SidebarShell;
