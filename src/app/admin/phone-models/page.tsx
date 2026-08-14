"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface PhoneModel {
  id: string;
  brand: string;
  name: string;
  isActive: boolean;
}

export default function PhoneModelsPage() {
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [brand, setBrand] = useState("iPhone");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadModels() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/phone-models");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load models");
      }

      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModels();
  }, []);

  async function addModel(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/admin/phone-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          name: name.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add model");
        return;
      }

      setModels((current) => [...current, data]);
      setName("");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteModel(id: string) {
    if (!confirm("Delete this phone model?")) return;

    try {
      const res = await fetch(`/api/admin/phone-models/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete model");
        return;
      }

      setModels((current) => current.filter((model) => model.id !== id));
    } catch {
      setError("Network error");
    }
  }

  const grouped = models.reduce<Record<string, PhoneModel[]>>((acc, model) => {
    if (!acc[model.brand]) {
      acc[model.brand] = [];
    }

    acc[model.brand].push(model);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Phone Models
        </h1>
        <p className="text-sm text-dark-muted mt-1">
          Manage the phone models available for your skins.
        </p>
      </div>

      <form
        onSubmit={addModel}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Add Phone Model
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
          >
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Google">Google</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example: iPhone 17 Pro Max"
            className="bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
          />

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-black font-semibold rounded-xl px-4 py-3 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}

            Add Model
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-4">
            {error}
          </p>
        )}
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 text-dark-muted">
            Loading phone models...
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl text-dark-muted">
            No phone models yet.
          </div>
        ) : (
          Object.entries(grouped).map(([brandName, brandModels]) => (
            <div
              key={brandName}
              className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-dark-border">
                <h2 className="text-lg font-semibold text-white">
                  {brandName}
                </h2>
                <p className="text-xs text-dark-muted mt-1">
                  {brandModels.length} model
                  {brandModels.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-dark-border">
                {brandModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {model.name}
                      </p>

                      <p className="text-xs text-dark-muted mt-1">
                        {model.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteModel(model.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}