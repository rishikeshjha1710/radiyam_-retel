"use client";

import { useEffect, useState, useMemo } from "react";
import { getOrdersList } from "@/lib/firestore";
import Link from "next/link";
import type { Order } from "@/types";

type DateFilter = "today" | "week" | "month" | "all" | "custom";

function getFilteredOrders(orders: Order[], filter: DateFilter, customStart?: string, customEnd?: string): Order[] {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (filter === "today") {
    return orders.filter((o) => o.date === today);
  }
  if (filter === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().slice(0, 10);
    return orders.filter((o) => o.date >= weekStr && o.date <= today);
  }
  if (filter === "month") {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthStr = monthAgo.toISOString().slice(0, 10);
    return orders.filter((o) => o.date >= monthStr && o.date <= today);
  }
  if (filter === "custom" && customStart && customEnd) {
    return orders.filter((o) => o.date >= customStart && o.date <= customEnd);
  }
  return orders;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrdersList().then(setOrders).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => getFilteredOrders(orders, dateFilter, customStart || undefined, customEnd || undefined),
    [orders, dateFilter, customStart, customEnd]
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-600">Filter:</span>
        {(["today", "week", "month", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setDateFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              dateFilter === f
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f === "today" && "Today"}
            {f === "week" && "Last 7 days"}
            {f === "month" && "Last 30 days"}
            {f === "all" && "All"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setDateFilter("custom")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            dateFilter === "custom"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Custom
        </button>
        {dateFilter === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders in this range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => setSelectedOrder(o)}
                  >
                    <td className="p-4 font-medium">{o.orderId}</td>
                    <td className="p-4">{o.customerName}</td>
                    <td className="p-4">{o.date}</td>
                    <td className="p-4">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="p-4">{o.paymentStatus || "—"}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/details?id=${o.id}`}
                        className="text-indigo-600 font-bold hover:underline uppercase tracking-widest text-[10px]"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Order details — {order.orderId}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Customer name</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{order.address}</p>
            </div>
            <div>
              <p className="text-gray-500">Pincode</p>
              <p className="font-medium">{order.pincode || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment status</p>
              <p className="font-medium text-green-600">{order.paymentStatus || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Products</p>
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">₹{item.price.toLocaleString("en-IN")}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 text-right">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t pt-4">
            <p className="text-lg font-bold text-gray-800">
              Total: ₹{order.total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
