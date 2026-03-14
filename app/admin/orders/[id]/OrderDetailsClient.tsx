"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/lib/firestore";
import type { Order } from "@/types";

export default function OrderDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getOrderById(id).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <div className="p-8 text-gray-500">Loading order details...</div>;

  if (!order)
    return <div className="p-8 text-red-500">Order not found.</div>;

  const formatPrice = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>

        <h1 className="text-3xl font-black text-gray-900">
          Order {order.orderId}
        </h1>
      </div>

      <div className="space-y-4">

        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between border p-4 rounded-xl">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
            </div>

            <p className="font-bold">
              ₹{formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}

        <div className="flex justify-between text-xl font-black mt-6">
          <span>Total</span>
          <span>₹{formatPrice(order.total)}</span>
        </div>

      </div>

    </div>
  );
}