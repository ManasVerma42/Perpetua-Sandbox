import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value?: number }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={width}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div className="h-full bg-primary transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

export default Progress;
