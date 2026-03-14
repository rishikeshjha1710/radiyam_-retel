"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, isAdmin, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      // The useEffect will handle redirection if isAdmin is true
    } catch (err: any) {
      setError(err.message || "Credential verification failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <div className="max-w-md w-full space-y-12 bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10 text-center">
          <Link href="/" className="inline-flex justify-center mb-10">
            <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center rounded-2xl text-2xl font-black italic shadow-xl transform hover:rotate-6 transition-transform">
              R
            </div>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">
            Admin Console
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-400">
            Authorized Personnel Only
          </p>
        </div>

        <form className="mt-10 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="id-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                Security Identifier
              </label>
              <input
                id="id-label"
                type="text"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="Admin ID or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pass-label" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">
                Access Secret
              </label>
              <input
                id="pass-label"
                type="password"
                required
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 placeholder-gray-300 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-gray-900 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Initialize Access"
              )}
            </button>
          </div>
          
          <div className="text-center pt-4">
             <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
               Return to Storefront
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
