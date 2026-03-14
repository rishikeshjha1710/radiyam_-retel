"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types";

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { isAdmin, loading: authLoading } = useAuth();
  const [form, setForm] = useState<Omit<Product, "id"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (id) {
      getProductById(id).then((p) => {
        if (p) {
          const { id: _, ...rest } = p;
          setForm(rest);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;
    setError("");
    setSaving(true);
    try {
      await updateProduct(id, {
        ...form,
        price: Number(form.price) || 0,
        stars: Math.min(5, Math.max(0, Number(form.stars) || 0)),
        reviewCount: Math.max(0, Number(form.reviewCount) || 0),
      });
      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <p className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading product inventory unit...</p>;
  if (!isAdmin || !form) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 italic">Edit Masterpiece.</h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Modify your premium collection item</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-8">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                   <input
                     type="text"
                     required
                     value={form.name}
                     onChange={(e) => setForm((f) => f ? ({ ...f, name: e.target.value }) : null)}
                     className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all"
                     placeholder="e.g. Signature Leather Satchel"
                   />
                </div>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                   <textarea
                     required
                     rows={6}
                     value={form.description}
                     onChange={(e) => setForm((f) => f ? ({ ...f, description: e.target.value }) : null)}
                     className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium text-gray-600 placeholder-gray-300 transition-all resize-none"
                     placeholder="Crafted with artisanal care, this product defines luxury..."
                   />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                     <input
                       type="text"
                       value={form.category || ""}
                       onChange={(e) => setForm((f) => f ? ({ ...f, category: e.target.value }) : null)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                       placeholder="Lifestyle"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Price (₹)</label>
                     <input
                       type="number"
                       min={0}
                       step={1}
                       required
                       value={form.price || ""}
                       onChange={(e) => setForm((f) => f ? ({ ...f, price: Number(e.target.value) || 0 }) : null)}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-black text-indigo-600"
                       placeholder="4999"
                     />
                   </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Visual Asset URL</label>
              
              <div className="aspect-square bg-gray-100 rounded-[2rem] overflow-hidden mb-6 border-2 border-dashed border-gray-200 group relative">
                 {form.image ? (
                   <img src={form.image} alt="preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-tight">Preview Area</span>
                   </div>
                 )}
              </div>

              <input
                type="url"
                required
                value={form.image}
                onChange={(e) => setForm((f) => f ? ({ ...f, image: e.target.value }) : null)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-xs font-medium text-gray-500 overflow-hidden text-ellipsis"
                placeholder="https://images.unsplash.com/..."
              />
           </div>

           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-center opacity-60">Metadata</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-400">Stars</span>
                   <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.stars || ""}
                      onChange={(e) => setForm((f) => f ? ({ ...f, stars: Number(e.target.value) || 0 }) : null)}
                      className="w-16 bg-white/10 border-none rounded-lg py-1 px-2 text-center text-indigo-400 font-bold outline-none"
                    />
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-400">Reviews</span>
                   <input
                      type="number"
                      min={0}
                      value={form.reviewCount || ""}
                      onChange={(e) => setForm((f) => f ? ({ ...f, reviewCount: Number(e.target.value) || 0 }) : null)}
                      className="w-16 bg-white/10 border-none rounded-lg py-1 px-2 text-center text-indigo-400 font-bold outline-none"
                    />
                </div>
              </div>
           </div>

           {error && (
              <p className="text-xs text-red-400 font-bold bg-red-500/10 p-4 rounded-2xl animate-shake border border-red-500/20">{error}</p>
           )}

           <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                {saving ? "Updating..." : "Update Masterpiece"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="w-full text-gray-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 uppercase tracking-widest text-[10px] font-black">Decrypting Collection Unit...</div>}>
      <EditProductContent />
    </Suspense>
  );
}
