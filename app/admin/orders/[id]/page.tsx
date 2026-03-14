"use client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/firestore";
import type { Order } from "@/types";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id as string).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading order details...</div>;
  if (!order) return <div className="p-8 text-red-500">Order not found.</div>;

  const formatPrice = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-black text-gray-900">Order {order.orderId}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="px-8 py-6 flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-400">₹{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-8 py-6 bg-gray-50/50 flex justify-between items-center">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Amount</span>
              <span className="text-2xl font-black text-indigo-600">₹{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h2 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Name</p>
                <p className="font-bold text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-600 underline">{order.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                <p className="font-bold text-gray-900">{order.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h2 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Shipping Address</h2>
            <p className="text-gray-600 leading-relaxed italic mb-4">"{order.address}"</p>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pincode</p>
              <p className="font-bold text-gray-900 tracking-widest">{order.pincode}</p>
            </div>
          </div>
          
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
             <h2 className="font-bold mb-4 opacity-80">Order Status</h2>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xl font-black uppercase tracking-tight">{order.paymentStatus || 'Processing'}</span>
             </div>
             <button className="w-full mt-6 bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold text-sm transition-colors border border-white/10">
                Update Status
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
