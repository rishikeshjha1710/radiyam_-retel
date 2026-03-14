"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/lib/firestore";
import type { Order } from "@/types";
import Link from "next/link";

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
    return <div className="p-20 text-center font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse text-[10px]">Decrypting Order Metadata...</div>;

  if (!order)
    return (
        <div className="p-20 text-center space-y-4">
            <p className="text-red-500 font-black uppercase tracking-widest text-xs">Error: Order Manifest Not Found.</p>
            <button onClick={() => router.push('/admin/orders')} className="text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors">Return to Registry →</button>
        </div>
    );

  const formatPrice = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">ORDER {order.orderId}</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Transaction Record</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs italic">Acquired Pieces</h2>
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">{order.items.length} Units</span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="px-10 py-8 flex items-center gap-8 group">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-3xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs border-4 border-white">
                        {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 italic text-lg uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Catalog Item #{item.productId.slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-xl">₹{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">₹{formatPrice(item.price)} / unit</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-10 py-10 bg-gray-900 text-white flex justify-between items-center">
              <span className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">Total Transaction Value</span>
              <span className="text-4xl font-black italic tracking-tighter">₹{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs italic mb-8 pb-4 border-b border-gray-50">Customer Profile</h2>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Legal Name</p>
                <p className="font-black text-gray-900 text-lg">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Communication</p>
                <p className="font-medium text-gray-600 text-sm select-all">{order.email}</p>
                <p className="font-bold text-gray-900 mt-1">{order.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs italic mb-8 pb-4 border-b border-gray-50">Logistics Destination</h2>
            <p className="text-gray-500 leading-relaxed font-medium text-sm mb-6 border-l-2 border-indigo-100 pl-4">{order.address}</p>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Postal Code</p>
              <p className="font-black text-gray-900 tracking-[0.3em]">{order.pincode}</p>
            </div>
          </div>
          
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <h2 className="font-black uppercase tracking-widest text-[10px] mb-6 opacity-60 italic">Transaction Status</h2>
             <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                <span className="text-2xl font-black uppercase tracking-tighter italic">{order.paymentStatus || 'Authentication...'}</span>
             </div>
             <div className="mt-10 flex gap-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 backdrop-blur-sm">
                   Update Trace
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
