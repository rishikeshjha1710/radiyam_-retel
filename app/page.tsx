"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProductsList } from "@/lib/firestore";
import type { Product } from "@/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProductsList().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Refined & Professional */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0a0b] -mt-20 px-6">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-fade-in">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Redefining Domestic Excellence</span>
           </div>
           
           <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight animate-fade-in-up">
              ELEVATE YOUR <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-100">LIVING SPACE.</span>
           </h1>
           
           <p className="max-w-xl mx-auto text-base md:text-xl text-gray-400 font-medium leading-relaxed animate-fade-in-up delay-100 px-4">
              Discover a curated collection of premium household essentials designed to blend artisanal craftsmanship with modern utility.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up delay-200 w-full max-w-sm mx-auto sm:max-w-none">
              <Link 
                 href="/products" 
                 className="w-full sm:w-auto bg-white text-gray-900 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
              >
                 Shop the Collection
              </Link>
              <button className="w-full sm:w-auto text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
                 Our Philosophy
              </button>
           </div>
        </div>

        {/* Improved Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
           <span className="text-[8px] font-black uppercase tracking-widest text-white">Scroll</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* SEARCH BAR - Floating & Clean */}
      <div className="relative z-20 -mt-10 px-4 md:px-6">
         <div className="max-w-4xl mx-auto bg-white rounded-[2rem] md:rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-2 md:p-3 border border-gray-100">
            <div className="relative group">
               <input 
                type="text"
                placeholder="Search masterpieces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 md:pl-14 pr-6 md:pr-10 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-100/50 transition-all text-sm md:text-base"
               />
               <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
            </div>
         </div>
      </div>

      {/* FEATURED SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="space-y-4 mb-20 text-center md:text-left">
           <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Premier Inventory</h2>
           <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none italic">THE CURATED SERIES.</h3>
              <Link href="/products" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-all border-b-2 border-transparent hover:border-indigo-600 pb-2">
                 Browse Entire Catalog →
              </Link>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem]"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-6 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/products?id=${product.id}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 shadow-sm transition-all duration-700 group-hover:shadow-[0_45px_100px_-20px_rgba(79,70,229,0.15)] active:scale-[0.98]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                     <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                        {product.category || "Domestic"}
                     </span>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex justify-between items-center text-white">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">View Details</span>
                           <div className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold">→</div>
                        </div>
                     </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2 px-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight italic uppercase">
                      {product.name}
                    </h4>
                    <p className="text-lg font-black text-gray-900">₹{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-xs font-black text-gray-900">{product.stars}</span>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.reviewCount} Reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="bg-gray-50 py-32 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">The Radiyami Standard</h2>
               <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic">HOUSEHOLD <br/> REDEFINED.</h3>
               <p className="text-lg text-gray-500 leading-relaxed max-w-md">
                  We believe that every item in your home should tell a story of excellence. From artisanal cleaning tools to luxury kitchenware, we curate only the absolute best for your sanctuary.
               </p>
               <div className="space-y-4 pt-4">
                  {[
                     "Artisanal Manufacturing",
                     "Pure Sustainable Materials",
                     "Exceptional Reliability Guarantee"
                  ].map((benefit, idx) => (
                     <div key={idx} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                           </svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{benefit}</span>
                     </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="aspect-[4/5] rounded-[4rem] bg-indigo-100 overflow-hidden shadow-2xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" 
                    alt="Process" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay"></div>
               </div>
               <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 hidden lg:block">
                  <p className="text-4xl font-black text-gray-900 mb-1">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Purity Certified</p>
               </div>
            </div>
         </div>
      </section>

      {/* NEWSLETTER - Compact & Elegant */}
      <section className="px-6 py-40">
         <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic">JOIN THE MASTER-LIST.</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">Receive updates on new collection drops and exclusive maintenance tips for your household pieces.</p>
            
            <form className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-50 rounded-[2.5rem] border border-gray-100">
               <input 
                 type="email" 
                 placeholder="Your premier email address"
                 className="flex-1 bg-transparent border-none outline-none px-8 py-4 text-gray-900 font-bold placeholder-gray-400"
               />
               <button className="bg-gray-900 text-white px-12 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                  Confirm Access
               </button>
            </form>
         </div>
      </section>
    </div>
  );
}