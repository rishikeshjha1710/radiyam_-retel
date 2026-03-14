"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, getUserProfile } from "@/lib/firestore";

export default function CheckoutPage() {
  const { items, total, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      // Try to fetch full profile for delivery details
      getUserProfile(user.uid).then((profile: any) => {
        setForm({
          customerName: profile?.fullName || user.displayName || "",
          email: profile?.email || user.email || "",
          phone: profile?.phone || user.phoneNumber || "",
          address: profile?.address || "",
          city: profile?.city || "",
          pincode: profile?.pincode || "",
        });
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));
      const { orderId: oid } = await createOrder({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.city}`,
        pincode: form.pincode,
        items: orderItems,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "Pending (COD)" : "Paid (Simulated)",
      });
      setOrderId(oid);
      clearCart();
      setDone(true);
    } catch (err) {
      alert("Failed to place order. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 p-12 max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Order Confirmed</h1>
          <p className="text-gray-500 font-medium mb-8">
            Your premium selection is being prepared. We've sent a confirmation to <span className="text-indigo-600 font-bold">{form.email}</span>
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Confirmation ID</p>
            <p className="font-mono text-lg font-black text-gray-900 uppercase tracking-widest">{orderId}</p>
          </div>
          <div className="mb-10 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Method</p>
             <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">{paymentMethod}</p>
          </div>
          <Link
            href="/products"
            className="inline-block w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/products" className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            Back to Shop
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-12 italic">Finalize Purchase</h1>
            
            {items.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold mb-8 italic text-lg opacity-60">"Your cart is currently whispering for items..."</p>
                <Link href="/products" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Browse Collection
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <section>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-900 text-white text-[10px] flex items-center justify-center rounded-full">1</span>
                    Shipping Destination
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={form.customerName}
                        onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                        placeholder="Master John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                        placeholder="john@radiyami.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone Signature</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 font-mono"
                        placeholder="+91 000 000 0000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                       <textarea
                        required
                        rows={3}
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium text-gray-600 leading-relaxed"
                        placeholder="Apartment, Studio, or Floor..."
                      />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">City</label>
                       <input
                         type="text"
                         required
                         value={form.city}
                         onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                         className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                         placeholder="City Name"
                       />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Regional Pincode</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-black text-gray-900 tracking-[0.3em]"
                        placeholder="110001"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-900 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                    Payment Selection
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { id: "cod", label: "Cash on Delivery", icon: "₹" },
                      { id: "upi", label: "UPI Transfer", icon: "⇁" },
                      { id: "card", label: "Credit/Debit Card", icon: "■" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all group ${
                          paymentMethod === method.id
                            ? "border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <span className={`text-2xl font-black mb-3 ${paymentMethod === method.id ? "text-indigo-600" : "text-gray-300"}`}>
                           {method.icon}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest text-center ${
                          paymentMethod === method.id ? "text-gray-900" : "text-gray-400"
                        }`}>
                          {method.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Publishing Order..." : "Finalize Purchase"}
                </button>
              </form>
            )}
          </div>

          <aside className="lg:w-[400px]">
             <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden sticky top-32">
                <div className="p-10 bg-gray-900 text-white text-center">
                   <h2 className="text-xl font-black italic">Order Summary</h2>
                </div>
                
                <div className="p-10 max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                   {items.map((i) => (
                    <div key={i.productId} className="py-6 first:pt-0 last:pb-0">
                       <div className="flex gap-4">
                          <img src={i.image} alt={i.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                          <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-gray-900 text-sm truncate">{i.name}</h3>
                             <p className="text-xs text-indigo-600 font-bold mt-1">₹{i.price.toLocaleString("en-IN")} x {i.quantity}</p>
                          </div>
                       </div>
                    </div>
                   ))}
                </div>

                <div className="p-10 bg-gray-50/50 border-t border-gray-100">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-0.5">Grand Total</p>
                         <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{total.toLocaleString()}</p>
                      </div>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
