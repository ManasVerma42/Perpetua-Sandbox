import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  loading?: boolean;
}

export function ProductGallery({ images, name, loading = false }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-2xl bg-muted" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const displayImages = images.length > 0 ? images : ["https://picsum.photos/seed/placeholder/600/600"];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square w-full rounded-2xl bg-muted overflow-hidden">
        <img
          src={displayImages[selectedIndex]}
          alt={`${name} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "aspect-square rounded-xl overflow-hidden bg-muted transition-all",
                selectedIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-1 ring-border hover:ring-primary/50"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;