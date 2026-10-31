import { readFileSync } from "node:fs";
import { Window } from "happy-dom";

const window = new Window({ url: "http://localhost/" });
const browser = window as unknown as Record<string, unknown>;
const globals = [
  "window", "document", "navigator", "location", "history", "localStorage", "sessionStorage",
  "HTMLElement", "Element", "Node", "Text", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent",
  "matchMedia", "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver",
  "IntersectionObserver", "ResizeObserver", "getComputedStyle", "FormData",
];
for (const key of globals) {
  const value = key === "window" ? window : key === "getComputedStyle"
    ? window.getComputedStyle.bind(window) : browser[key];
  if (value === undefined) continue;
  try {
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  } catch {
    // a read-only Node global (e.g. navigator): keep Node's
  }
}

const failures: string[] = [];
window.addEventListener("error", (event) => {
  const error = (event as unknown as { error?: Error }).error;
  failures.push(`uncaught: ${error?.stack ?? String(error)}`);
});

async function main() {
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { MemoryRouter, matchPath } = await import("react-router-dom");
  const { default: App } = await import("./src/App");

  class Boundary extends React.Component<
    { route: string; children?: React.ReactNode },
    { failed: boolean }
> {
    state = { failed: false };
    static getDerivedStateFromError() {
      return { failed: true };
    }
    componentDidCatch(error: unknown) {
      const text = error instanceof Error ? (error.stack ?? error.message) : String(error);
      failures.push(`route ${this.props.route}: ${text}`);
    }
    render() {
      return this.state.failed ? null : this.props.children;
    }
  }

  const source = readFileSync("src/App.tsx", "utf8");
  const patterns = [...source.matchAll(/path=["']([^"']+)["']/g)].map((match) => match[1]);
  const queue = ["/"];
  for (const pattern of patterns) {
    if (!pattern.includes("*")) queue.push(pattern.replace(/:[A-Za-z_]+/g, "1"));
  }
  // Links are checked against the real routes (not a catch-all) when their paths are absolute
  const concrete = patterns.filter((p) => !p.includes("*"));
  const checkLinks = concrete.length > 0 && concrete.every((p) => p.startsWith("/"));
  const dead = new Map<string, string>();
  const seen = new Set<string>();

  // Every declared route, then every page its links lead to
  while (queue.length && seen.size < 40) {
    const route = queue.shift()!;
    if (seen.has(route)) continue;
    seen.add(route);
    const container = window.document.createElement("div");
    window.document.body.appendChild(container);
    const root = createRoot(container as unknown as globalThis.Element);
    const before = failures.length;
    root.render(
      <Boundary route={route}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </Boundary>,
    );
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (route === "/" && failures.length === before && !container.innerHTML.trim()) {
      failures.push("route /: rendered nothing (blank page)");
    }
    for (const link of Array.from(container.querySelectorAll("a[href]"))) {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const url = new URL(href, "http://localhost");
      if (checkLinks && !concrete.some((p) => matchPath({ path: p, end: true }, url.pathname))) {
        if (!dead.has(url.pathname)) dead.set(url.pathname, route);
        continue;
      }
      const target = url.pathname + url.search;
      if (!seen.has(target)) queue.push(target);
    }
    root.unmount();
    container.remove();
  }

  for (const [path, from] of Array.from(dead).slice(0, 10)) {
    failures.push(
      `src/App.tsx has no route for ${path} (linked from ${from}): add a <Route> for it that renders an existing ` +
        "page (or a small page written in src/App.tsx), or point the link at a page that exists",
    );
  }

  console.log("SMOKE " + JSON.stringify(failures));
  await window.happyDOM.abort();
  process.exit(failures.length ? 1 : 0);
}

void main();
