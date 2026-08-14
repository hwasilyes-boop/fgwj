"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, X as XIcon } from "lucide-react";

interface Review {
  id: string;
  customerName: string | null;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  async function toggleApproval(id: string, isApproved: boolean) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved } : r)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Reviews</h1>

      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-muted">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Customer</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Rating</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Comment</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-white">{r.customerName || "Anonymous"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < r.rating ? "text-brand" : "text-dark-border"}`}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-muted max-w-xs truncate">{r.comment || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${r.isApproved ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {r.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.isApproved ? (
                          <button onClick={() => toggleApproval(r.id, false)} className="text-dark-muted hover:text-yellow-400 transition-colors p-2" title="Unapprove">
                            <XIcon className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => toggleApproval(r.id, true)} className="text-dark-muted hover:text-green-400 transition-colors p-2" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(r.id)} className="text-dark-muted hover:text-red-400 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-dark-muted text-sm">No reviews yet</td>
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
