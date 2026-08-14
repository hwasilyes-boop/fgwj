"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  collectionName: string | null;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New Product
        </Link>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-muted">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Product</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Price</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Collection</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Stock</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark shrink-0">
                          {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{p.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.isBestSeller && <span className="text-[9px] bg-brand/20 text-brand px-1.5 py-0.5 rounded">Best</span>}
                            {p.isFeatured && <span className="text-[9px] bg-blue-400/20 text-blue-400 px-1.5 py-0.5 rounded">Featured</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted">{p.collectionName || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${p.stock < 10 ? "text-red-400" : "text-white"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${p.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-dark-muted hover:text-white transition-colors p-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-dark-muted hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-dark-muted text-sm">
                      No products yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
