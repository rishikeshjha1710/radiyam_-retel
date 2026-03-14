"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getProductsList, getOrdersList } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Order, Product } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    Promise.all([getOrdersList(), getProductsList()]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => o.date === today);
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    return {
      totalOrders: orders.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((s, o) => s + (o.total || 0), 0),
      productCount: products.length,
    };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const days: { date: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter((o) => o.date === dateStr);
      days.push({
        date: dateStr.slice(5), // MM-DD
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
      });
    }
    return days;
  }, [orders]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Command Center...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 font-medium">Monitoring your business performance in real-time.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/add-product" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </Link>
          <button onClick={() => window.location.reload()} className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, color: "indigo" },
          { label: "Lifetime Orders", value: stats.totalOrders, color: "gray" },
          { label: "Orders Today", value: stats.todayOrders, color: "gray" },
          { label: "Active Products", value: stats.productCount, color: "gray" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
            <p className={`text-3xl font-black ${item.color === 'indigo' ? 'text-indigo-600' : 'text-gray-900'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-8">Revenue Analysis</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-40"></div>
           <div>
              <h2 className="text-xl font-black mb-1">Quick Insights</h2>
              <p className="text-gray-400 text-sm mb-10">System Status: <span className="text-emerald-400 font-bold">Optimal</span></p>
              
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Today's Goal</p>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-2xl font-black">78%</span>
                       <span className="text-xs text-gray-400">₹{stats.todayRevenue.toLocaleString()} / ₹25,000</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-gray-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Top Action Items</p>
                    <ul className="space-y-4">
                       <li className="flex items-center gap-3 text-sm font-medium">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          Review 5 pending shipments
                       </li>
                       <li className="flex items-center gap-3 text-sm font-medium">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          Restock Laptop Backpacks
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
           
           <button className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors">
              View Detailed Reports
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
               </svg>
            </div>
            <p className="text-gray-400 font-medium">No transactions found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 font-black uppercase tracking-widest text-[10px]">
                  <th className="px-10 py-6">Order Reference</th>
                  <th className="px-10 py-6">Customer</th>
                  <th className="px-10 py-6">Date</th>
                  <th className="px-10 py-6 text-right">Total Amount</th>
                  <th className="px-10 py-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6 font-black text-gray-900 tracking-tight">{o.orderId}</td>
                    <td className="px-10 py-6 text-gray-600 font-medium">{o.customerName}</td>
                    <td className="px-10 py-6 text-gray-400 font-medium">{o.date}</td>
                    <td className="px-10 py-6 text-right font-black text-indigo-600">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-10 py-6 text-center">
                       <Link 
                        href={`/admin/orders/${o.id}`}
                        className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                       >
                         Manage
                       </Link>
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
