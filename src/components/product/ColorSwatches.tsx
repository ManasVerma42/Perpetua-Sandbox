import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSwatchesProps {
  colors: ColorOption[];
  selectedColor?: string;
  onColorSelect: (colorName: string) => void;
  loading?: boolean;
}

export function ColorSwatches({
  colors,
  selectedColor,
  onColorSelect,
  loading = false,
}: ColorSwatchesProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="size-11 rounded-full bg-muted animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        <span className="text-muted-foreground uppercase tracking-wide">Colour</span>
        {selectedColor && (
          <span className="text-primary ml-2">— {selectedColor}</span>
        )}
      </p>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          return (
            <button
              key={color.name}
              onClick={() => onColorSelect(color.name)}
              className={cn(
                "flex flex-col items-center gap-2 group",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
              )}
              aria-label={`Select ${color.name} color`}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  "size-11 rounded-full transition-all flex items-center justify-center",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2"
                    : "ring-1 ring-border hover:ring-primary/50"
                )}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={cn(
                      "size-5",
                      isLightColor(color.hex) ? "text-black" : "text-white"
                    )}
                  />
                )}
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const color = hex.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export default ColorSwatches;