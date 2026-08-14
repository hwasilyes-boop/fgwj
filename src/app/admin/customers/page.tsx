"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>

      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-muted">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Customer</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Email</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Phone</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Loyalty</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-dark-muted">{c.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-brand font-medium">{c.loyaltyPoints} pts</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-dark-muted text-sm">No customers yet</td>
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
