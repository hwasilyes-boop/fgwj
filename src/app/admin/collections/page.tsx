"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
}

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "", isActive: true });

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    const res = await fetch("/api/admin/collections");
    const data = await res.json();
    setCollections(data);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(col: Collection) {
    setEditing(col);
    setForm({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      image: col.image || "",
      isActive: col.isActive,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;

    await fetch("/api/admin/collections", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    loadCollections();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/admin/collections?id=${id}`, { method: "DELETE" });
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Collections</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-dark-card rounded-2xl border border-dark-border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editing ? "Edit" : "New"} Collection</h2>
              <button onClick={() => setShowForm(false)} className="text-dark-muted hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Slug</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Image Path</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/products/collections/example.jpg"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand/50"
                />
              </div>
              <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-black font-bold py-3 rounded-xl text-sm transition-all">
                {editing ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-muted">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Collection</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Slug</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr key={col.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-white">{col.name}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted">{col.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${col.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                        {col.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(col)} className="text-dark-muted hover:text-white transition-colors p-2"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(col.id)} className="text-dark-muted hover:text-red-400 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
