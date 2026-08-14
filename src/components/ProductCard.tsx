"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
    collectionName?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  const mainImage = product.images[0] || "/placeholder.jpg";

  return (
    <div className="group relative bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-dark-muted/50 transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isBestSeller && (
          <span className="bg-brand text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
        {discount && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-gray-400 hover:text-brand transition-colors opacity-0 group-hover:opacity-100">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image */}
      <Link href={`/skins/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-dark">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.collectionName && (
          <p className="text-[11px] text-dark-muted uppercase tracking-wider mb-1">
            {product.collectionName}
          </p>
        )}
        <Link href={`/skins/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white hover:text-brand transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-dark-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Quick add */}
        <Link
          href={`/skins/${product.slug}`}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-brand hover:text-black text-white text-xs font-medium py-2.5 rounded-xl transition-all duration-200"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          View & Add
        </Link>
      </div>
    </div>
  );
}
