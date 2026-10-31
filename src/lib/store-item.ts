import type { StoreItem } from "@/components/store/store-data";
import type { Product } from "@/types";

/** The one place a catalogue Product becomes the StoreItem the cart and store kit take. */
export function toStoreItem(product: Product): StoreItem {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice ?? product.originalPrice,
    image: product.imageUrl,
    images: product.images,
    category: product.category,
    tag: product.tags?.[0],
    rating: product.rating,
    reviews: product.reviewCount,
    description: product.description,
    colors: product.colors,
    details: product.specifications,
  };
}

export default toStoreItem;
