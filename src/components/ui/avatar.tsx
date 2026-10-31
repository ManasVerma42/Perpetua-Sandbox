import { useState, type HTMLAttributes, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  if (broken || !props.src) return null;
  return (
    <img
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={(event) => {
        setBroken(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export default Avatar;
