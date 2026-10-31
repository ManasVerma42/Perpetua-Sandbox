import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SelectState = {
  value: string;
  label: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  choose: (value: string, label: ReactNode) => void;
};

const SelectContext = createContext<SelectState | null>(null);

function useSelect() {
  const state = useContext(SelectContext);
  if (!state) throw new Error("Select parts must be used inside <Select>");
  return state;
}

export function Select({
  value,
  defaultValue = "",
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}) {
  const [inner, setInner] = useState(defaultValue);
  const [label, setLabel] = useState<ReactNode>(null);
  const [open, setOpen] = useState(false);
  const current = value ?? inner;
  const choose = (next: string, nextLabel: ReactNode) => {
    setInner(next);
    setLabel(nextLabel);
    setOpen(false);
    onValueChange?.(next);
  };
  return (
    <SelectContext.Provider value={{ value: current, label, open, setOpen, choose }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children }: { className?: string; children?: ReactNode }) {
  const select = useSelect();
  return (
    <button
      type="button"
      onClick={() => select.setOpen(!select.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 text-sm",
        className,
      )}
    >
      {children}
      <span aria-hidden className="text-muted-foreground">▾</span>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const select = useSelect();
  return <span>{select.label ?? (select.value || placeholder)}</span>;
}

export function SelectContent({ className, children }: { className?: string; children?: ReactNode }) {
  const select = useSelect();
  if (!select.open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-md border border-border bg-card py-1 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children?: ReactNode;
}) {
  const select = useSelect();
  return (
    <button
      type="button"
      onClick={() => select.choose(value, children)}
      className={cn(
        "block w-full px-3 py-1.5 text-left text-sm hover:bg-accent",
        select.value === value && "font-medium",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SelectGroup({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}

export function SelectLabel({ children }: { children?: ReactNode }) {
  return <div className="px-3 py-1 text-xs font-medium text-muted-foreground">{children}</div>;
}

export default Select;
