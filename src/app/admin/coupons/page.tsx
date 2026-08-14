"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "percentage" as string, value: 0, maxUses: 0, expiresAt: "", isActive: true });

  useEffect(() => { loadCoupons(); }, []);

  async function loadCoupons() {
    const res = await fetch("/api/admin/coupons");
    setCoupons(await res.json());
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ code: "", type: "percentage", value: 0, maxUses: 0, expiresAt: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.type === "fixed" ? c.value / 1000 : c.value,
      maxUses: c.maxUses || 0,
      expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "",
      isActive: c.isActive,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const value = form.type === "fixed" ? form.value * 1000 : form.value;
    const body = editing
      ? { id: editing.id, ...form, value, maxUses: form.maxUses || null, expiresAt: form.expiresAt || null }
      : { ...form, value, maxUses: form.maxUses || null, expiresAt: form.expiresAt || null };

    await fetch("/api/admin/coupons", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    loadCoupons();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Coupons</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-dark-card rounded-2xl border border-dark-border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editing ? "Edit" : "New"} Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-dark-muted hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Code</label>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-muted block mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 appearance-none">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (DT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-dark-muted block mb-1">Value</label>
                  <input type="number" step="0.1" required value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-muted block mb-1">Max Uses (0=unlimited)</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50" />
                </div>
                <div>
                  <label className="text-xs text-dark-muted block mb-1">Expires At</label>
                  <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50" />
                </div>
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
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Code</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Type</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Value</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Usage</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-white font-mono">{c.code}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted capitalize">{c.type}</td>
                    <td className="px-4 py-3 text-sm text-white">{c.type === "percentage" ? `${c.value}%` : `${(c.value / 1000).toFixed(1)} DT`}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted">{c.usedCount}/{c.maxUses || "∞"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${c.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="text-dark-muted hover:text-white transition-colors p-2"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="text-dark-muted hover:text-red-400 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
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
