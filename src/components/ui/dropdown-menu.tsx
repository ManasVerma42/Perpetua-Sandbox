import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const MenuContext = createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children?: ReactNode }) {
  const menu = useContext(MenuContext);
  const onClick = () => menu.setOpen(!menu.open);
  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ onClick?: () => void }>, { onClick });
  }
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children }: { className?: string; align?: string; children?: ReactNode }) {
  const menu = useContext(MenuContext);
  if (!menu.open) return null;
  return (
    <div className={cn("absolute right-0 z-50 mt-1 min-w-40 rounded-md border border-border bg-card py-1 shadow-md", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, onClick, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const menu = useContext(MenuContext);
  return (
    <button
      type="button"
      className={cn("block w-full px-3 py-1.5 text-left text-sm hover:bg-accent", className)}
      onClick={(event) => {
        onClick?.(event);
        menu.setOpen(false);
      }}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-1 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-muted" />;
}

export default DropdownMenu;
