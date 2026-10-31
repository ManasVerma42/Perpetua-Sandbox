import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext<{ value: string; setValue: (value: string) => void }>({
  value: "",
  setValue: () => {},
});

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
};

export function Tabs({ defaultValue = "", value, onValueChange, className, ...props }: TabsProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const setValue = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn("flex flex-col gap-2", className)} {...props} />
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex rounded-md bg-muted p-1", className)} {...props} />;
}

export function TabsTrigger({
  value,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const tabs = useContext(TabsContext);
  const active = tabs.value === value;
  return (
    <button
      type="button"
      onClick={() => tabs.setValue(value)}
      className={cn(
        "rounded px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const tabs = useContext(TabsContext);
  if (tabs.value !== value) return null;
  return <div className={cn(className)} {...props} />;
}
