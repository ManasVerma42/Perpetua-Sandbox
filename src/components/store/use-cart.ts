import { useSyncExternalStore } from "react";
import type { StoreItem } from "./store-data";

/** One cart row: an item with its chosen colour and size. */
export interface CartLine {
  item: StoreItem;
  quantity: number;
  color?: string;
  size?: string;
}

const KEY = "store-cart";
const listeners = new Set<() => void>();
let lines: CartLine[] = load();
let sheetOpen = false;

function load(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartLine[];
  } catch {
    return [];
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function save(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the cart still works for this visit
  }
  emit();
}

function same(a: CartLine, b: Omit<CartLine, "quantity">) {
  return a.item.id === b.item.id && a.color === b.color && a.size === b.size;
}

/** Cart actions, usable outside components too. */
export const cart = {
  add(item: StoreItem, quantity = 1, options: { color?: string; size?: string } = {}) {
    const line = { item, ...options };
    const existing = lines.find((current) => same(current, line));
    save(
      existing
        ? lines.map((current) =>
            current === existing ? { ...current, quantity: current.quantity + quantity } : current,
          )
        : [...lines, { ...line, quantity }],
    );
    sheetOpen = true;
    emit();
  },
  setQuantity(line: CartLine, quantity: number) {
    save(
      quantity <= 0
        ? lines.filter((current) => current !== line)
        : lines.map((current) => (current === line ? { ...current, quantity } : current)),
    );
  },
  remove(line: CartLine) {
    save(lines.filter((current) => current !== line));
  },
  clear() {
    save([]);
  },
  openSheet(open: boolean) {
    sheetOpen = open;
    emit();
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The cart's lines, totals and actions; every component using it stays in sync. */
export function useCart() {
  const current = useSyncExternalStore(subscribe, () => lines, () => lines);
  const open = useSyncExternalStore(subscribe, () => sheetOpen, () => false);
  return {
    lines: current,
    count: current.reduce((sum, line) => sum + line.quantity, 0),
    total: current.reduce((sum, line) => sum + line.quantity * line.item.price, 0),
    open,
    ...cart,
  };
}
