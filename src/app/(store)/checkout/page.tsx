"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Loader2,
  Tag,
  X,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);

  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  /*
   * IMPORTANT:
   * Your formatPrice() appears to work with the same
   * numeric unit used by the cart.
   *
   * Your previous checkout displayed 8 DT as shipping,
   * so keep shipping at 8 here.
   */
  const shipping = 8;

  const discount = couponApplied?.discount || 0;

  const total = Math.max(0, subtotal + shipping - discount);

  async function validateCoupon() {
    if (!couponCode.trim()) {
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon");
        setCouponApplied(null);
        return;
      }

      setCouponApplied({
        code: data.code,
        discount: data.discount,
        description: data.description,
      });
    } catch {
      setCouponError("Failed to validate coupon");
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          couponCode: couponApplied?.code || "",
          items: items.map((item) => ({
            productId: item.productId,
            phoneModel: item.phoneModel,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      clearCart();

      router.push(`/order-success/${data.orderId}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-dark-border mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-white mb-3">
          Your Cart is Empty
        </h1>

        <p className="text-dark-muted mb-8">
          Add some items before checkout.
        </p>

        <Link
          href="/skins"
          className="inline-flex bg-brand text-black font-bold px-8 py-4 rounded-xl text-sm"
        >
          Shop Skins
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* =========================
              DELIVERY INFORMATION
          ========================== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
              <h2 className="text-lg font-semibold text-white mb-2">
                Delivery Information
              </h2>

              {/* Full Name */}
              <div>
                <label className="text-xs text-dark-muted block mb-1.5">
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                  placeholder="Your full name"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs text-dark-muted block mb-1.5">
                  Address *
                </label>

                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                  placeholder="Street address"
                />
              </div>

              {/* City + Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">
                    City *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-dark-muted block mb-1.5">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50 resize-none"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            {/* =========================
                PAYMENT METHOD
            ========================== */}
            <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
              <h2 className="text-lg font-semibold text-white mb-4">
                Payment Method
              </h2>

              <div className="flex items-center gap-3 bg-brand/10 border border-brand/20 rounded-xl p-4">
                <div className="w-3 h-3 rounded-full bg-brand" />

                <div>
                  <p className="text-sm font-medium text-white">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-dark-muted">
                    Pay when you receive your order
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================== */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border h-fit sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">
              Order Summary
            </h2>

            {/* =========================
                CART ITEMS
            ========================== */}
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.phoneModel}`}
                  className="flex gap-3"
                >
                  {/* Product image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark shrink-0">
                    <img
                      src={item.productImage || "/placeholder.jpg"}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">
                      {item.productName}
                    </p>

                    {/* PHONE MODEL */}
                    {item.phoneModel && (
                      <div className="flex items-center gap-1 mt-1">
                        <Smartphone className="w-3 h-3 text-brand" />

                        <p className="text-[10px] text-brand font-medium">
                          {item.phoneModel}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-dark-muted mt-1">
                      × {item.quantity}
                    </p>
                  </div>

                  {/* Item price */}
                  <p className="text-xs font-medium text-white whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* =========================
                COUPON
            ========================== */}
            <div className="border-t border-dark-border pt-4 mb-4">
              {couponApplied ? (
                <div className="bg-brand/10 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-brand" />

                      <span className="text-xs text-brand font-medium">
                        {couponApplied.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-dark-muted hover:text-white"
                      aria-label="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {couponApplied.description && (
                    <p className="text-[10px] text-dark-muted mt-1">
                      {couponApplied.description}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className="flex-1 bg-dark border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                  />

                  <button
                    type="button"
                    onClick={validateCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-red-400 text-[11px] mt-1">
                  {couponError}
                </p>
              )}
            </div>

            {/* =========================
                TOTALS
            ========================== */}
            <div className="space-y-2 text-sm border-t border-dark-border pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>

                <span className="text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>

                <span className="text-white">
                  {formatPrice(shipping)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-brand">
                  <span>Discount</span>

                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="border-t border-dark-border pt-3 flex justify-between text-white font-bold text-base">
                <span>Total</span>

                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* =========================
                PLACE ORDER
            ========================== */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-black font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Place Order — {formatPrice(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}