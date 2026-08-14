"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400",
  confirmed: "bg-blue-400/10 text-blue-400",
  preparing: "bg-purple-400/10 text-purple-400",
  shipped: "bg-cyan-400/10 text-cyan-400",
  delivered: "bg-green-400/10 text-green-400",
  cancelled: "bg-red-400/10 text-red-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-dark-muted">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Order</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Customer</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Total</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-left text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Date</th>
                  <th className="text-right text-xs text-dark-muted font-medium px-4 py-3 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <span className="text-xs text-white font-mono">{order.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{order.customerName}</p>
                      <p className="text-xs text-dark-muted">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full uppercase ${statusColors[order.status] || "bg-gray-400/10 text-gray-400"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-brand hover:text-brand-dark transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-dark-muted text-sm">
                      No orders yet
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
