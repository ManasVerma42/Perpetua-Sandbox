import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => dismiss(item.id)}
          className={cn(
            "rounded-md border bg-card p-3 text-left text-sm shadow-md",
            item.variant === "destructive" && "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {item.title && <p className="font-medium">{item.title}</p>}
          {item.description && <p className="text-muted-foreground">{item.description}</p>}
        </button>
      ))}
    </div>
  );
}

export default Toaster;
