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

type DialogState = { open: boolean; setOpen: (open: boolean) => void };

const DialogContext = createContext<DialogState>({ open: false, setOpen: () => {} });

export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const setOpen = (next: boolean) => {
    setInner(next);
    onOpenChange?.(next);
  };
  return (
    <DialogContext.Provider value={{ open: open ?? inner, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function withClick(child: ReactNode, onClick: () => void, asChild?: boolean) {
  if (asChild && isValidElement(child)) {
    return cloneElement(child as ReactElement<{ onClick?: () => void }>, { onClick });
  }
  return (
    <button type="button" onClick={onClick}>
      {child}
    </button>
  );
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children?: ReactNode }) {
  const dialog = useContext(DialogContext);
  return withClick(children, () => dialog.setOpen(true), asChild);
}

export function DialogClose({ asChild, children }: { asChild?: boolean; children?: ReactNode }) {
  const dialog = useContext(DialogContext);
  return withClick(children, () => dialog.setOpen(false), asChild);
}

export function DialogContent({ className, children }: { className?: string; children?: ReactNode }) {
  const dialog = useContext(DialogContext);
  if (!dialog.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="absolute inset-0" onClick={() => dialog.setOpen(false)} />
      <div className={cn("relative w-full max-w-lg rounded-lg bg-card p-6 shadow-lg", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export default Dialog;
