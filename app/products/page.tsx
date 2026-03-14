"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductsList } from "@/lib/firestore";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductsList().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const formatPrice = (n: number) => n.toLocaleString("en-IN");

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">Loading Vault...</div>;

  if (productId && selectedProduct) {
    return (
      <div className="min-h-screen bg-[#fafafa] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/products")}
            className="group flex items-center gap-3 mb-12 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
               </svg>
            </div>
            Back to Collection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl shadow-indigo-100/50 bg-white">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-tight">Authentic <br/> Artisan Piece</p>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block">{selectedProduct.category || "Lifestyle"}</span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-4">{selectedProduct.name}</h1>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <span className="text-amber-400 text-xl">★</span>
                     <span className="font-black text-gray-900">{selectedProduct.stars}</span>
                   </div>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedProduct.reviewCount} Artisanal Reviews</span>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium leading-relaxed italic text-lg opacity-80 mb-8 border-l-4 border-indigo-100 pl-6">
                  "{selectedProduct.description}"
                </p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{formatPrice(selectedProduct.price)}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-400 font-black text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-xl text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-400 font-black text-xl"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productId: selectedProduct.id,
                      name: selectedProduct.name,
                      price: selectedProduct.price,
                      image: selectedProduct.image,
                    }, quantity);
                    router.push("/checkout");
                  }}
                  className="flex-1 w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-md uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Acquire Piece
                </button>
              </div>
              
              <div className="pt-10 grid grid-cols-2 gap-8 border-t border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                       </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Premium Packaging</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">24-Hour Dispatch</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 block">Our Essentials</span>
           <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4 italic">RADIYAMI PIECES<span className="text-indigo-600">.</span></h1>
           <p className="text-gray-400 font-medium max-w-lg mx-auto">A curated selection of premium household essentials, designed for the modern living space.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products?id=${product.id}`}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-[3rem] bg-white relative shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 right-6">
                   <div className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                   </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">{product.category}</p>
                   <h3 className="text-xl font-black tracking-tight">{product.name}</h3>
                   <p className="text-lg font-black mt-2 italic">₹{formatPrice(product.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
