"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface PhoneModel {
  id: string;
  brand: string;
  name: string;
  isActive: boolean;
}

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    images: string[];
    compatibleModels: string[];
    stock: number;
    tags: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
  };

  collectionName: string | null;

  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    customerName: string | null;
    createdAt: Date;
  }[];

  relatedProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
  }[];
}

export default function ProductDetail({
  product,
  collectionName,
  reviews,
  relatedProducts,
}: Props) {
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  /*
   * Load active phone models from the database.
   * GET /api/admin/phone-models is public.
   */
  useEffect(() => {
    async function loadPhoneModels() {
      try {
        setLoadingModels(true);

        const response = await fetch("/api/admin/phone-models", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load phone models");
        }

        const data: PhoneModel[] = await response.json();

        setPhoneModels(data);
      } catch (err) {
        console.error("Phone models loading error:", err);
        setPhoneModels([]);
      } finally {
        setLoadingModels(false);
      }
    }

    loadPhoneModels();
  }, []);

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : null;

  const inStock = product.stock > 0;

  /*
   * If the product has compatibleModels configured,
   * show only those models.
   *
   * If compatibleModels is empty,
   * show all active models from the database.
   */
  const availableModels = useMemo(() => {
    if (product.compatibleModels.length === 0) {
      return phoneModels;
    }

    const compatible = new Set(product.compatibleModels);

    return phoneModels.filter((model) => compatible.has(model.name));
  }, [phoneModels, product.compatibleModels]);

  /*
   * Group models dynamically by brand.
   *
   * Example:
   * iPhone
   * Samsung
   * Xiaomi
   * Google
   * OnePlus
   */
  const groupedModels = useMemo(() => {
    return availableModels.reduce<Record<string, PhoneModel[]>>(
      (groups, model) => {
        if (!groups[model.brand]) {
          groups[model.brand] = [];
        }

        groups[model.brand].push(model);

        return groups;
      },
      {}
    );
  }, [availableModels]);

  function handleAddToCart() {
    if (loadingModels) {
      return;
    }

    if (!availableModels.length) {
      setError("No phone models are available for this product.");
      return;
    }

    if (!selectedModel) {
      setError("Please select your phone model");
      return;
    }

    if (!inStock) {
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "",
      phoneModel: selectedModel,
      price: product.price,
      quantity,
      slug: product.slug,
    });

    setAdded(true);
    setError("");

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  const mainImage =
    product.images[selectedImage] ||
    product.images[0] ||
    "/placeholder.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/skins"
        className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-white transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Skins
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-dark-card border border-dark-border">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-brand"
                      : "border-dark-border hover:border-dark-muted"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {collectionName && (
            <p className="text-xs text-brand font-medium tracking-wider uppercase">
              {collectionName}
            </p>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </span>

            {product.comparePrice &&
              product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-dark-muted line-through">
                    {formatPrice(product.comparePrice)}
                  </span>

                  {discount !== null && (
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </>
              )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                inStock ? "bg-brand" : "bg-red-500"
              }`}
            />

            <span className="text-sm text-gray-400">
              {inStock
                ? `In stock (${product.stock})`
                : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-dark-muted bg-white/5 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Phone Model Selection */}
          <div>
            <label className="text-sm font-medium text-white mb-3 block">
              Select Your Phone Model{" "}
              <span className="text-red-400">*</span>
            </label>

            {loadingModels ? (
              <div className="flex items-center gap-2 text-sm text-dark-muted py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading phone models...
              </div>
            ) : availableModels.length === 0 ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm text-red-400">
                  No compatible phone models are available for this product.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedModels).map(([brand, models]) => (
                  <div key={brand}>
                    <p className="text-xs text-dark-muted mb-2">
                      {brand}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model.name);
                            setError("");
                          }}
                          className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                            selectedModel === model.name
                              ? "bg-brand text-black border-brand font-semibold"
                              : "border-dark-border text-gray-400 hover:border-dark-muted hover:text-white"
                          }`}
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedModel && (
              <p className="text-xs text-brand mt-3">
                Selected: <strong>{selectedModel}</strong>
              </p>
            )}

            {error && (
              <p className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium text-white mb-3 block">
              Quantity
            </label>

            <div className="inline-flex items-center bg-dark-card border border-dark-border rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="px-4 py-3 text-white font-medium min-w-[40px] text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.min(product.stock, quantity + 1)
                  )
                }
                disabled={quantity >= product.stock}
                className="px-4 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              added ||
              loadingModels ||
              availableModels.length === 0
            }
            className={`w-full flex items-center justify-center gap-3 font-bold py-4 px-8 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 ${
              added
                ? "bg-green-500 text-white"
                : inStock &&
                    !loadingModels &&
                    availableModels.length > 0
                  ? "bg-brand hover:bg-brand-dark text-black"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart
              </>
            ) : loadingModels ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart —{" "}
                {formatPrice(product.price * quantity)}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">
            Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-dark-card rounded-2xl p-6 border border-dark-border"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < rev.rating
                          ? "text-brand"
                          : "text-dark-border"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                {rev.comment && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {rev.comment}
                  </p>
                )}

                <p className="text-xs text-dark-muted">
                  {rev.customerName || "Customer"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}