import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TipContext = createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export function TooltipProvider({ children }: { children?: ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <TipContext.Provider value={{ open, setOpen }}>
      <span className="relative inline-flex">{children}</span>
    </TipContext.Provider>
  );
}

export function TooltipTrigger({ children }: { asChild?: boolean; children?: ReactNode }) {
  const tip = useContext(TipContext);
  return (
    <span onMouseEnter={() => tip.setOpen(true)} onMouseLeave={() => tip.setOpen(false)}>
      {children}
    </span>
  );
}

export function TooltipContent({ className, children }: { className?: string; children?: ReactNode }) {
  const tip = useContext(TipContext);
  if (!tip.open) return null;
  return (
    <span className={cn("absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background", className)}>
      {children}
    </span>
  );
}

export default Tooltip;
