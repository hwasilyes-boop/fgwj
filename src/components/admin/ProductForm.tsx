"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ALL_PHONE_MODELS, PHONE_MODELS } from "@/lib/constants";
import { Plus, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    images: string[];
    compatibleModels: string[];
    stock: number;
    collectionId: string | null;
    tags: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
    isActive: boolean;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product ? product.price / 1000 : 0,
    comparePrice: product?.comparePrice ? product.comparePrice / 1000 : 0,
    images: product?.images || [],
    compatibleModels: product?.compatibleModels || [],
    stock: product?.stock || 0,
    collectionId: product?.collectionId || "",
    tags: product?.tags || [],
    isBestSeller: product?.isBestSeller || false,
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
  });

  const [imagePath, setImagePath] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then(setCollections)
      .catch(() => {});
  }, []);

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  }

  function addImage() {
    if (!imagePath.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imagePath.trim()] }));
    setImagePath("");
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function toggleModel(model: string) {
    setForm((prev) => ({
      ...prev,
      compatibleModels: prev.compatibleModels.includes(model)
        ? prev.compatibleModels.filter((m) => m !== model)
        : [...prev.compatibleModels, model],
    }));
  }

  function selectAllModels() {
    setForm((prev) => ({ ...prev, compatibleModels: [...ALL_PHONE_MODELS] }));
  }

  function clearAllModels() {
    setForm((prev) => ({ ...prev, compatibleModels: [] }));
  }

  function addTag() {
    if (!tagInput.trim()) return;
    if (form.tags.includes(tagInput.trim())) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price: Math.round(form.price * 1000),
      comparePrice: form.comparePrice ? Math.round(form.comparePrice * 1000) : null,
      collectionId: form.collectionId || null,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic Info */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">Product Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
              />
            </div>
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-dark-muted block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">Price (DT) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
              />
            </div>
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">Compare Price (DT)</label>
              <input
                type="number"
                step="0.1"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
              />
            </div>
            <div>
              <label className="text-xs text-dark-muted block mb-1.5">Stock *</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-dark-muted block mb-1.5">Collection</label>
            <select
              value={form.collectionId}
              onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 appearance-none"
            >
              <option value="">No Collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
          <h2 className="text-lg font-semibold text-white">Images</h2>
          <p className="text-xs text-dark-muted">Enter local image paths (e.g. /products/skins/my-skin.jpg)</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="/products/skins/example.jpg"
              className="flex-1 bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-brand/10 hover:bg-brand/20 text-brand px-4 py-3 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-dark border border-dark-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-[9px] text-dark-muted mt-1 truncate max-w-[80px]">{img}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phone Models */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Compatible Phone Models</h2>
            <div className="flex gap-2">
              <button type="button" onClick={selectAllModels} className="text-[10px] text-brand hover:text-brand-dark">Select All</button>
              <button type="button" onClick={clearAllModels} className="text-[10px] text-dark-muted hover:text-white">Clear</button>
            </div>
          </div>

          <div>
            <p className="text-xs text-dark-muted mb-2">iPhone</p>
            <div className="flex flex-wrap gap-2">
              {PHONE_MODELS.iPhone.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => toggleModel(model)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    form.compatibleModels.includes(model)
                      ? "bg-brand text-black border-brand font-medium"
                      : "border-dark-border text-gray-400 hover:border-dark-muted"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-dark-muted mb-2">Samsung</p>
            <div className="flex flex-wrap gap-2">
              {PHONE_MODELS.Samsung.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => toggleModel(model)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    form.compatibleModels.includes(model)
                      ? "bg-brand text-black border-brand font-medium"
                      : "border-dark-border text-gray-400 hover:border-dark-muted"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
          <h2 className="text-lg font-semibold text-white">Tags</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            />
            <button type="button" onClick={addTag} className="bg-brand/10 hover:bg-brand/20 text-brand px-4 py-3 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-xs bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-dark-muted hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4">
          <h2 className="text-lg font-semibold text-white">Visibility</h2>
          <div className="space-y-3">
            {[
              { key: "isActive" as const, label: "Active", desc: "Product is visible on the store" },
              { key: "isFeatured" as const, label: "Featured", desc: "Show in featured section" },
              { key: "isBestSeller" as const, label: "Best Seller", desc: "Show best seller badge" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer py-2">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs text-dark-muted">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors ${form[key] ? "bg-brand" : "bg-dark-border"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ml-1 ${form[key] ? "translate-x-5" : ""}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-bold px-8 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Update Product" : "Create Product"}
          </button>
          <Link href="/admin/products" className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
