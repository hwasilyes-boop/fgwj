"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ALL_PHONE_MODELS, PHONE_MODELS } from "@/lib/constants";

interface FilterSidebarProps {
  collections: { id: string; name: string; slug: string }[];
}

export default function FilterSidebar({ collections }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCollection = searchParams.get("collection") || "";
  const currentModel = searchParams.get("model") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentQ = searchParams.get("q") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Remove filter flags when changing other filters
    if (key !== "featured") params.delete("featured");
    if (key !== "bestseller") params.delete("bestseller");
    router.push(`/skins?${params.toString()}`);
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input
          type="text"
          placeholder="Search skins..."
          defaultValue={currentQ}
          onChange={(e) => {
            const t = setTimeout(() => updateParam("q", e.target.value), 400);
            return () => clearTimeout(t);
          }}
          className="w-full bg-dark-card border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs text-dark-muted uppercase tracking-wider font-medium block mb-2">Sort By</label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 appearance-none"
        >
          <option value="">Recommended</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Collection */}
      <div>
        <label className="text-xs text-dark-muted uppercase tracking-wider font-medium block mb-2">Collection</label>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("collection", "")}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !currentCollection ? "bg-brand/10 text-brand" : "text-gray-400 hover:text-white"
            }`}
          >
            All Collections
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => updateParam("collection", col.slug)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                currentCollection === col.slug ? "bg-brand/10 text-brand" : "text-gray-400 hover:text-white"
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Phone model */}
      <div>
        <label className="text-xs text-dark-muted uppercase tracking-wider font-medium block mb-2">Phone Model</label>
        <select
          value={currentModel}
          onChange={(e) => updateParam("model", e.target.value)}
          className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 appearance-none"
        >
          <option value="">All Models</option>
          <optgroup label="iPhone">
            {PHONE_MODELS.iPhone.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </optgroup>
          <optgroup label="Samsung">
            {PHONE_MODELS.Samsung.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </optgroup>
        </select>
      </div>
    </aside>
  );
}
