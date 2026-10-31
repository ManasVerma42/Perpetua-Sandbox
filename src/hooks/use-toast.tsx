import { useEffect, useState, type ReactNode } from "react";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

/** Show a toast from anywhere; <Toaster /> in main.tsx renders it, no provider needed. */
export function toast(input: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { id, ...input }];
  emit();
  setTimeout(() => dismiss(id), 4000);
  return { id, dismiss: () => dismiss(id) };
}

export function dismiss(id?: string) {
  toasts = id ? toasts.filter((item) => item.id !== id) : [];
  emit();
}

/** Kept for code that wraps the app in a provider; toasts need none. */
export function ToastProvider({ children }: { children?: ReactNode }) {
  return children;
}

export function useToast() {
  const [items, setItems] = useState(toasts);
  useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);
  return { toasts: items, toast, dismiss };
}

export default useToast;
